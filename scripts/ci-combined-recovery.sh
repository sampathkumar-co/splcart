#!/usr/bin/env bash
# CI ONLY: prove local photos + rendered MP4 + matching HQ DB rows can recover
# from an ENCRYPTED bundle into an isolated fresh DB and media directory.
set -euo pipefail
if [[ "${HQ_TEST_MODE:-}" != "1" ||
      "${DATABASE_URL:-}" != "postgresql://hq:hq@localhost:5432/hq?schema=public" ||
      "${HQ_MEDIA_DIR:-}" != "/tmp/hq-ci-media" ]]; then
  echo "Refusing to run combined recovery outside ephemeral HQ CI" >&2
  exit 2
fi
for binary in docker age age-keygen sha256sum tar; do
  command -v "$binary" >/dev/null || { echo "Missing CI backup verification tool $binary" >&2; exit 2; }
done
DB_CONTAINER="$(docker ps --filter ancestor=postgres:17 --format '{{.ID}}' | head -1)"
[[ -n "$DB_CONTAINER" ]] || { echo "No ephemeral HQ Postgres 17 container" >&2; exit 2; }
TEMP="$(mktemp -d)"
cleanup(){
  docker exec "$DB_CONTAINER" dropdb -U hq --if-exists hq_media_restore_check >/dev/null 2>&1 || true
  rm -rf "$TEMP"
}
trap cleanup EXIT
mkdir -p "$TEMP/bundle" "$TEMP/restored" "$TEMP/restored-media"
node scripts/hq-media-manifest.mjs snapshot > "$TEMP/bundle/media-manifest.json"
node -e 'const m=require(process.argv[1]);if(m.photoCount<1||m.videoCount<1)process.exit(2)' "$TEMP/bundle/media-manifest.json"
docker exec "$DB_CONTAINER" pg_dump -U hq -d hq --format=custom --no-owner > "$TEMP/bundle/db.dump"
# Production media volume archives carry the root directory "hq-media/".
tar -C "$HQ_MEDIA_DIR" --transform='s,^,hq-media/,' -czf "$TEMP/bundle/media.tar.gz" assets reels
(cd "$TEMP/bundle" && sha256sum db.dump media.tar.gz media-manifest.json > SHA256SUMS)
age-keygen -o "$TEMP/ephemeral-ci.agekey" 2>"$TEMP/age-keygen.log"
RECIPIENT="$(age-keygen -y "$TEMP/ephemeral-ci.agekey")"
[[ "$RECIPIENT" == age1* ]] || { echo "Missing ephemeral age public recipient" >&2; exit 2; }
tar -C "$TEMP/bundle" -czf - db.dump media.tar.gz media-manifest.json SHA256SUMS |
  age -r "$RECIPIENT" > "$TEMP/recovery.age"
test -s "$TEMP/recovery.age"
age -d -i "$TEMP/ephemeral-ci.agekey" "$TEMP/recovery.age" | tar -xz -C "$TEMP/restored"
(cd "$TEMP/restored" && sha256sum -c SHA256SUMS)
bash scripts/hq-verify-encrypted-backup.sh "$TEMP/recovery.age" "$TEMP/ephemeral-ci.agekey"
docker exec -i "$DB_CONTAINER" pg_restore --list < "$TEMP/restored/db.dump" >/dev/null
docker exec "$DB_CONTAINER" createdb -U hq hq_media_restore_check
docker exec -i "$DB_CONTAINER" pg_restore -U hq -d hq_media_restore_check --no-owner < "$TEMP/restored/db.dump"
tar -C "$TEMP/restored-media" -xzf "$TEMP/restored/media.tar.gz"
RESTORED_URL="postgresql://hq:hq@localhost:5432/hq_media_restore_check?schema=public"
env DATABASE_URL="$RESTORED_URL" HQ_MEDIA_DIR="$TEMP/restored-media/hq-media" \
  node scripts/hq-media-manifest.mjs verify "$TEMP/restored/media-manifest.json"

# Deliberately corrupt recovered media and confirm validation FAILS CLOSED.
PHOTO="$(find "$TEMP/restored-media/hq-media/assets" -maxdepth 1 -type f -name '*.png' | head -1)"
test -f "$PHOTO"
printf 'CI-corruption' >> "$PHOTO"
if env DATABASE_URL="$RESTORED_URL" HQ_MEDIA_DIR="$TEMP/restored-media/hq-media" \
   node scripts/hq-media-manifest.mjs verify "$TEMP/restored/media-manifest.json" >/dev/null 2>&1; then
 echo "Media checksum test failed to detect corrupt photo" >&2
 exit 1
fi
tar -C "$TEMP/restored-media" -xzf "$TEMP/restored/media.tar.gz"
VIDEO="$(find "$TEMP/restored-media/hq-media/reels" -maxdepth 1 -type f -name '*.mp4' | head -1)"
test -f "$VIDEO"
rm -f "$VIDEO"
if env DATABASE_URL="$RESTORED_URL" HQ_MEDIA_DIR="$TEMP/restored-media/hq-media" \
   node scripts/hq-media-manifest.mjs verify "$TEMP/restored/media-manifest.json" >/dev/null 2>&1; then
 echo "Media recovery test failed to detect missing video" >&2
 exit 1
fi
echo "PASS encrypted HQ DB + media full restore to isolated fresh DB, SHA-256, corrupted PNG and missing MP4 rejection. No storefront data."
