#!/usr/bin/env bash
# Read-only structural/decryption/checksum verification, NOT an active database restore.
# Do not run this on a live storefront or overwrite persistent HQ media.
set -euo pipefail
if [[ $# -ne 2 || ! -f "$1" || ! -f "$2" ]]; then
 echo "Usage: bash scripts/hq-verify-encrypted-backup.sh /path/to/hq-backup.age /path/to/age-identity.txt" >&2
 exit 2
fi
for program in age tar sha256sum; do
 command -v "$program" >/dev/null || { echo "Missing verification tool: $program" >&2; exit 2; }
done
umask 077
TEMP="$(mktemp -d)"
trap 'rm -rf "$TEMP"' EXIT
mkdir "$TEMP/extract"
age -d -i "$2" "$1" > "$TEMP/bundle.tar.gz"
# Strictly limit the outer archive to the four expected flat backup files.
ACTUAL="$(tar -tzf "$TEMP/bundle.tar.gz" | sort)"
EXPECTED="$(printf '%s\n' SHA256SUMS db.dump media-manifest.json media.tar.gz | sort)"
if [[ "$ACTUAL" != "$EXPECTED" ]]; then
 echo "Unexpected encrypted HQ backup archive entries" >&2
 exit 1
fi
# Refuse extracted symlinks and other special file types.
if tar -tvzf "$TEMP/bundle.tar.gz" | awk '{print substr($1,1,1)}' | grep -v '^-$' >/dev/null; then
 echo "Unsafe HQ bundle entry type" >&2
 exit 1
fi
tar --no-same-owner --no-same-permissions -xzf "$TEMP/bundle.tar.gz" -C "$TEMP/extract"
(cd "$TEMP/extract" && sha256sum -c SHA256SUMS)
tar -tzf "$TEMP/extract/media.tar.gz" | while IFS= read -r name; do
 case "$name" in
  hq-media/|hq-media/assets/|hq-media/reels/|hq-media/assets/*|hq-media/reels/*) ;;
  *) echo "Unsafe/non-HQ media archive entry: $name" >&2; exit 1 ;;
 esac
done
echo "PASS encrypted standalone HQ archive decrypted, expected members and SHA-256 checksums verified."
echo "This read-only check is NOT a live target-host restore; run the DB/media fresh-restore acceptance separately."
