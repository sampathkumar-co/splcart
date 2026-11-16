#!/usr/bin/env bash
# CI ONLY: exercise a full logical HQ DB backup/restore into a NEW throwaway DB.
# It never uses the SPLCART storefront or a persistent environment.
set -euo pipefail
if [[ "${HQ_TEST_MODE:-}" != "1" || "${DATABASE_URL:-}" != "postgresql://hq:hq@localhost:5432/hq?schema=public" ]]; then
  echo "Refusing non-CI or non-ephemeral HQ database" >&2
  exit 2
fi
CONTAINER="$(docker ps --filter ancestor=postgres:17 --format '{{.ID}}' | head -1)"
if [[ -z "$CONTAINER" ]]; then
  echo "Expected CI PostgreSQL 17 service container not found" >&2
  exit 2
fi
DUMP="$(mktemp)"
cleanup(){
  docker exec "$CONTAINER" dropdb -U hq --if-exists hq_restore_check >/dev/null 2>&1 || true
  rm -f "$DUMP"
}
trap cleanup EXIT
docker exec "$CONTAINER" pg_dump -U hq -d hq --format=custom --no-owner > "$DUMP"
test -s "$DUMP"
docker exec "$CONTAINER" createdb -U hq hq_restore_check
docker exec -i "$CONTAINER" pg_restore -U hq -d hq_restore_check --no-owner < "$DUMP"
PROSPECTS="$(docker exec "$CONTAINER" psql -U hq -d hq_restore_check -tAc 'select count(*) from "Prospect"' | tr -d '[:space:]')"
QUOTES="$(docker exec "$CONTAINER" psql -U hq -d hq_restore_check -tAc 'select count(*) from "Quote"' | tr -d '[:space:]')"
EVENTS="$(docker exec "$CONTAINER" psql -U hq -d hq_restore_check -tAc 'select count(*) from "SystemAudit"' | tr -d '[:space:]')"
if [[ "${PROSPECTS:-0}" -lt 1 || "${QUOTES:-0}" -lt 1 || "${EVENTS:-0}" -lt 2 ]]; then
  echo "Restore did not retain independent HQ prospect, quote and owner audit history" >&2
  exit 1
fi
echo "PASS isolated HQ pg_dump + pg_restore roundtrip: $PROSPECTS prospect(s), $QUOTES quote(s), $EVENTS owner audit event(s), no store data."
