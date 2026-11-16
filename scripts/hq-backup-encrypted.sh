#!/usr/bin/env bash
# Explicitly invoked, HQ-ONLY encrypted database + photo + MP4 cold backup.
# This script NEVER reads, writes or connects to SPLCART. No social/AI API keys.
# Requires an independently managed age X25519 public recipient (not a secret).
set -euo pipefail
if [[ $# -ne 3 ]]; then
 echo "Usage: bash scripts/hq-backup-encrypted.sh /ABSOLUTE/private-backup-dir /path/to/dedicated-hq.env age1PUBLIC_RECIPIENT" >&2
 exit 2
fi
BACKUP_DIR="$1"
ENV_PATH="$2"
RECIPIENT="$3"
if [[ "$BACKUP_DIR" != /* || "$ENV_PATH" != /* || ! -f "$ENV_PATH" ||
      ! "$ENV_PATH" =~ (hq|headquarters) || ! "$RECIPIENT" =~ ^age1[0-9a-z]{50,100}$ ||
      ! -f compose.hq.yml || -f compose.splcart.yml || -f docker-compose.splcart.yml ]]; then
 echo "Refusing unsafe/non-Headquarters backup arguments or store project files" >&2
 exit 2
fi
for program in docker age sha256sum tar mktemp; do
 command -v "$program" >/dev/null || { echo "Missing backup tool: $program" >&2; exit 2; }
done
umask 077
mkdir -p "$BACKUP_DIR"
COMPOSE=(docker compose --project-name pj-ai-headquarters --env-file "$ENV_PATH" -f compose.hq.yml)
# A cold backup requires no writes to either the HQ DB or media while snapshotting.
# Only stop services that were already running and restart those SAME services.
RUNNING="$("${COMPOSE[@]}" ps --services --status running)"
TO_RESTART=()
for service in hq-web hq-creative; do
 if grep -Fxq "$service" <<< "$RUNNING"; then TO_RESTART+=("$service"); fi
done
TMP="$(mktemp -d "$BACKUP_DIR/.hq-backup-stage.XXXXXXXX")"
STATUS=0
cleanup(){
 STATUS=$?
 trap - EXIT INT TERM
 if [[ ${#TO_RESTART[@]} -gt 0 ]]; then
   "${COMPOSE[@]}" start "${TO_RESTART[@]}" >&2 || STATUS=1
 fi
 rm -rf "$TMP"
 exit "$STATUS"
}
trap cleanup EXIT INT TERM

if [[ ${#TO_RESTART[@]} -gt 0 ]]; then
 echo "Temporarily stopping HQ-only write services for consistent combined snapshot..." >&2
 "${COMPOSE[@]}" stop -t 45 "${TO_RESTART[@]}" >&2
fi
"${COMPOSE[@]}" exec -T hq-db pg_dump -U hq -d hq --format=custom --no-owner > "$TMP/db.dump"
test -s "$TMP/db.dump"
"${COMPOSE[@]}" run --rm --no-deps -T --entrypoint node hq-creative \
 scripts/hq-media-manifest.mjs snapshot > "$TMP/media-manifest.json"
test -s "$TMP/media-manifest.json"
# The media archive includes the complete dedicated HQ-only volume directory,
# including any orphan files, while manifest hashes independently check records.
"${COMPOSE[@]}" run --rm --no-deps -T --entrypoint tar hq-creative \
 -C /app/data -czf - hq-media > "$TMP/media.tar.gz"
test -s "$TMP/media.tar.gz"
(cd "$TMP" && sha256sum db.dump media.tar.gz media-manifest.json > SHA256SUMS)
OUT="$BACKUP_DIR/prasanth-hq-$(date -u +%Y%m%dT%H%M%SZ)-$RANDOM.age"
if [[ -e "$OUT" ]]; then echo "Refusing overwrite of existing HQ backup" >&2; exit 2; fi
# Never publish a plaintext bundle as a finished backup.
tar -C "$TMP" -czf - db.dump media.tar.gz media-manifest.json SHA256SUMS |
  age -r "$RECIPIENT" > "$OUT.partial"
test -s "$OUT.partial"
mv -n "$OUT.partial" "$OUT"
echo "Encrypted HQ database + photo + MP4 recovery bundle: $OUT"
echo "Store it off-host with an independently protected age PRIVATE identity. Restore testing is still required."
