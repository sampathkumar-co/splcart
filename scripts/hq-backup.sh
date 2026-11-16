#!/usr/bin/env bash
# HQ ONLY. Consistent encrypted/off-host transfer must be configured separately.
# Never pass SPLCART store database names/URLs or reuse a store project.
set -euo pipefail
if [[ $# -ne 2 ]]; then
  echo "Usage: scripts/hq-backup.sh /path/to/private/backups /path/to/dedicated-HQ-env" >&2
  exit 2
fi
BACKUP_DIR="$1"
ENV_PATH="$2"
if [[ ! -f "$ENV_PATH" || ! "$ENV_PATH" =~ (hq|headquarters) ]]; then
  echo "Dedicated Headquarters environment file required; refusing unknown env." >&2
  exit 2
fi
if [[ -e "compose.splcart.yml" || -e "docker-compose.splcart.yml" ]]; then
  echo "Store project files detected: refusing to run a HQ backup in a store working tree." >&2
  exit 2
fi
umask 077
mkdir -p "$BACKUP_DIR"
OUT="$BACKUP_DIR/prasanth-hq-$(date -u +%Y%m%dT%H%M%SZ).dump"
TMP="${OUT}.partial"
cleanup(){ rm -f "$TMP"; }
trap cleanup EXIT
docker compose --project-name pj-ai-headquarters --env-file "$ENV_PATH" -f compose.hq.yml \
  exec -T hq-db pg_dump -U hq -d hq --format=custom --no-owner > "$TMP"
test -s "$TMP"
mv "$TMP" "$OUT"
echo "HQ-only database backup created at $OUT"
echo "Move to an encrypted off-host destination; do not store credentials in the backup folder."
