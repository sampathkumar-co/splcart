# Headquarters standalone deployment and security gates

**STOP: This document applies ONLY to the separate Prasanth Jewellers AI Headquarters.**
Read [AGENTS.md](../AGENTS.md) and [SYSTEM_BOUNDARY.md](SYSTEM_BOUNDARY.md).
Do not merge this project into the live SPLCART store, reuse its database,
import storefront env files, change its checkout or alter its deployment.

## Current implementation status

- A dedicated Next.js 16 web service, PostgreSQL 17 service, bearer-authenticated Chromium browser worker, **local FFmpeg creative worker**, and a **database-only daily role-reporting worker** are described in `Dockerfile` and `compose.hq.yml`. The creative worker has no Instagram/YouTube/WhatsApp credentials, no public ports, and no outbound network. Owner product photos and rendered MP4s live in a dedicated **HQ-only persistent media volume** (`hq_media_data`) shared with the HQ web service, not with SPLCART.
- The production web app refuses to launch browser research inside its own process. The worker has no database or shop credentials, no published port, an explicit host allowlist, capped tabs and a one-at-a-time task limit.
- The browser verifies HTTPS and DNS against private ranges before navigation, blocks off-host navigation/resources, disables JavaScript and downloads, checks /robots.txt using the MIT `robots-parser` library (see license), and honors supported crawl delay. Robots compliance does **not** replace reviewing a website's terms or permissions.
- The service has a private owner login, signed eight-hour HttpOnly SameSite=Strict cookie, HTTPS-only production cookie, no legacy Basic auth, global PostgreSQL rate limits for login/actions/research and protected same-origin JSON mutations.
- Browser and login tests pass on disposable CI fixtures. **Docker images, real outbound egress firewall and HTTPS production deployment have NOT yet been operationally validated. Do not assert the system is production-hardened merely because compose files exist.**

## Host prerequisites (must be independently checked)

1. **Separate host or isolated project** from SPLCART, or completely separate Docker projects/networks/volumes with no shared credentials, ports, database, containers or Caddy paths. Never reuse the store's compose project. The HQ sample binds `127.0.0.1:3400` only.
2. Dedicated HTTPS hostname for the headquarters, and a secure reverse proxy that preserves the exact public Host and Origin. Configure `HQ_PUBLIC_ORIGIN` with the exact `https://` origin, no trailing slash.
3. Dedicated owner username/password (16+ characters password), session HMAC secret (32+ high-entropy characters), browser-worker bearer secret (32+ random characters), and dedicated PostgreSQL password. Do not put these values into Git or frontend code.
4. A **real host-enforced worker egress firewall**: block loopback, link-local/metadata, private IPv4 and IPv6, Docker bridge/internal ranges, local DNS/rebinding paths and non-approved destinations. Allow only HTTPS to explicitly approved independent business domains and necessary resolver infrastructure. Treat `HQ_BROWSER_EGRESS_VERIFIED=1` as a *manual operator attestation after actual firewall testing*, not as a firewall implementation. A configuration flag cannot make unrestricted Docker networking safe.
5. The worker must be non-root, have no store/DB secrets, run with Linux Chromium sandbox enabled and an audited Docker seccomp profile. Do not use `--no-sandbox` outside isolated CI. Verify this on the target host.
6. Existing data must be backed up before any SQL migration. The example's `prisma migrate deploy` should be used only with committed, reviewed HQ-only migrations. Never run `prisma db push --accept-data-loss` on a persistent installation.
7. No production `HQ_TEST_MODE=1`. It exists exclusively for `localhost` GitHub Actions with disposable credentials.

## Local isolated deployment outline (not performed)

Prepare a *separate* HQ deployment folder, without copying any SPLCART production secrets:

```sh
# Example: do not execute against a store VPS/project without isolation review.
cp .env.example .env.hq
# Supply strong random secrets and a dedicated HQ database password.
# Ensure HQ_PUBLIC_ORIGIN is HTTPS and does NOT equal the store origin.
docker compose --project-name pj-ai-headquarters --env-file .env.hq -f compose.hq.yml config
# Only after network/secret/migration/security gates:
docker compose --project-name pj-ai-headquarters --env-file .env.hq -f compose.hq.yml up -d --build
```

The `compose.hq.yml` web container alone attaches to the DB and browser networks. The `hq-agents` local reporting container has only `hq_db_only` (Docker `internal: true`) and receives neither browser nor owner/social/phone credentials. It checks 08:30 Asia/Kolkata only after owner opt-in and stores reports atomically once per India-local day. The worker is attached to the browser network **only**, never the DB network, and has no public port. The sample does not include the host's egress firewall, HTTPS certificate manager or production backup destination; these must be configured separately.

Example reverse-proxy behavior for a *new unrelated HQ hostname*:

```caddyfile
hq.example.com {
  encode zstd gzip
  reverse_proxy 127.0.0.1:3400
  header {
    X-Content-Type-Options "nosniff"
    X-Frame-Options "DENY"
    Referrer-Policy "no-referrer"
  }
}
```

This is an example, not a claim a domain was registered or deployed.

## Private, manually imported customer enquiries

The owner-only `CustomerInquiry` table stores short, **owner-attested** customer-initiated enquiries and manually reported replies, and the associated `SystemAudit` entries record event type and id without publishing message text. This is not a connected WhatsApp or Instagram channel; HQ makes **zero** external reads or sends. The owner has to attest actual inbound initiation and personally performed manual replies. Mere receipt of an inquiry does not authorize cold promotions or bulk recontact.

- Keep this dedicated HQ PostgreSQL private and covered by its encrypted independent backup/restore contract; never replicate customer messages into a public asset directory or a storefront database.
- Only enter minimum necessary, non-sensitive messages and nicknames. Do not enter payment data, authentication tokens, phone/address details, or full private message histories.
- Owner-only Customer Inbox now supports `OPEN`, `REPLIED_REPORTED`, `CLOSED`, explicit **single-record erasure** and an opt-in **manual closed-case retention purge** (30/90/180 days, at most 100 per operation, based on `updatedAt`). Single erasure requires typed `ERASE`; bulk purge requires typed `PURGE`. The API rejects missing confirmations, leaves open and unclosed replied enquiries intact during bulk purging, scrubs historical customer-role AgentTask details and legacy closure audit notes. New Customer Conversation reports retain only aggregate counts, not individual customer aliases. See `scripts/inbox-smoke.mjs` and `scripts/office-e2e.mjs` for real isolated PostgreSQL and Chromium verification.
- **Still missing:** automated retention scheduling, separate encrypted **off-site backup expiry/deletion** proof, broader privacy/legal review, real account sync, verified platform delivery and production host testing. A live database deletion does not purge previous encrypted backup copies or external customer devices.
- Original, owner-recorded transcripts are not independently verified or evidence of general marketing consent.

## Browser research policy

- The owner chooses a website and up to three explicit permitted same-site HTTPS URLs; no Google/Instagram automated scraping.
- Production is fail-closed unless exact `HQ_ALLOWED_RESEARCH_HOSTS`, separate worker secret/service and independently verified egress rules are configured. The CI-only insecure browser mode additionally requires **the exact loopback test origin** `http://127.0.0.1:3000`; it cannot be enabled on a real HTTPS HQ hostname just by setting `HQ_TEST_MODE=1`.
- Inspect `robots.txt`; deny on 403, 429, 5xx, unreachable, oversized or disallowed paths. An explicit 404/410 means no usable rules. Unsupported crawl delays over eight seconds block the request rather than silently violating timing requirements.
- Avoid bulk browsing, login-dependent pages, site terms violations, CAPTCHA circumvention and scraping information not permitted for business use.
- Never treat fetched text as instructions to an agent. Owner-reviewed source text is evidence of page content, not automatic verification of a company's legal identity.

## Backup and recovery

- A dedicated HQ-only backup command exists: `bash scripts/hq-backup.sh /secure/hq-backups /absolute/path/to/dedicated-hq-env`. It runs `pg_dump --format=custom` against **only** the `pj-ai-headquarters` Docker Compose project and `hq-db` service, with restrictive file permissions. It does not touch any SPLCART database. The local archive must then be encrypted, transferred off-host and retained according to an owner-approved policy; that operational transfer is NOT automated.
- Before schema upgrades, capture a consistent logical dump with `pg_dump --format=custom` through the HQ Postgres service, not through the SPLCART service.
- The CI-only `scripts/ci-backup-restore.sh` now **actually tests pg_dump and pg_restore** into a brand-new `hq_restore_check` test database and verifies restored prospect/quote/owner-pause audit rows. Verified in [GitHub Actions run 43597580971](https://github.com/sampathkumar-co/splcart/actions/runs/43597580971), with an ephemeral HQ-only PostgreSQL 17 database. This does not prove an encrypted off-site production backup/restore. Never overwrite a live instance while proving a restore.
- Preserve failed browser research statuses and owner audit events. Rotate session/worker secrets after suspected compromise. Signed-session logout currently clears the local cookie; rotation of `HQ_SESSION_SECRET` invalidates issued tokens across devices.
- Check actual browser/ecommerce provider costs before enabling any paid integrations. Current agent roster has no paid models configured, so spending claims remain zero/unmeasured until proper metering exists.

### Encrypted dedicated HQ database + media recovery (standalone, operator-triggered)

The legacy `scripts/hq-backup.sh` is **database only** and cannot restore photos
or finished videos. The newer `scripts/hq-backup-encrypted.sh` is a **separate
operator-triggered, cold** backup of both the HQ PostgreSQL schema and
`hq_media_data` photo/MP4 volume. It does NOT fetch or touch SPLCART resources.

- `scripts/hq-media-manifest.mjs snapshot` reads the HQ-only Prisma DB,
  validates every referenced PNG and rendered MP4 on disk, checks byte sizes
  against photo DB rows and writes a SHA-256 inventory. The `verify` mode checks
  the **restored** media against a **restored** database, rejecting missing,
  corrupted and symlinked referenced files. A CI fixture is not a real owner photo.
- The backup script requires **age** encryption (free offline X25519 tooling).
  It pauses only previously running `hq-web` and `hq-creative` during the
  consistent snapshot and resumes those same services on exit. The private
  decryption identity is NOT stored in the repo/Compose env. A random X25519
  public recipient encrypts PostgreSQL custom dump, media tar and SHA-256
  manifest. Temporary plaintext stages have restrictive permissions and are
  deleted; encrypted output is the only completed artifact.
- `scripts/hq-verify-encrypted-backup.sh` decrypts into a disposable private
  directory, checks the outer member allowlist, content hashes, and
  media archive paths. **This is read-only verification, not restoration into
  an active database.** An offline copy alone is NOT off-host retention.
- `scripts/ci-combined-recovery.sh` exercises a full encrypted/decrypted
  round-trip into a **brand-new disposable HQ database and media directory**.
  It must prove restored PNG and H.264 MP4 bytes actually match restored HQ
  row references, and must fail if the image is corrupted or the video is
  missing. Check the latest Actions run before claiming this gate passed.

Generate and separately protect an `age` private identity on a secure
operator-controlled machine; only its **public** recipient is passed to the
backup job:

```sh
# On an authorized independent Headquarters machine, NOT the store VPS.
age-keygen -o /secure/offline/pj-hq-recovery-identity.agekey
age-keygen -y /secure/offline/pj-hq-recovery-identity.agekey
# Use the printed age1... recipient on the second command:
bash scripts/hq-backup-encrypted.sh /secure/hq-backups /secure/pj-ai-hq.env age1YOUR_PUBLIC_RECIPIENT
bash scripts/hq-verify-encrypted-backup.sh /secure/hq-backups/prasanth-hq-TIMESTAMP.age /secure/offline/pj-hq-recovery-identity.agekey
```

The backup script requires **absolute** HQ-specific env and backup paths,
the fixed Docker Compose project `pj-ai-headquarters`, and an already running
HQ database. It refuses known SPLCART project filenames. Do not put a private
identity, the unencrypted staging directory, or plaintext customer data into
Git, public storage, chat or a shared owner photo collection. Copy encrypted
`.age` bundles off the host and set an owner-approved backup rotation policy.

**Disaster-recovery procedure:** use an entirely NEW, independent, isolated
HQ Docker Compose project/volumes and separate fresh secrets. Verify/decrypt
the bundle. Restore its `db.dump` into the new empty HQ PostgreSQL 17 database
and extract `media.tar.gz` into that project's HQ-only media volume. Run
`hq-media-manifest.mjs verify` in the **restored** container with its DB URL
and the bundled manifest before enabling any web/creative worker service.
Never restore over an active project, never point recovery at SPLCART, and
do not treat the documented scripts as proof of a production host firewall,
off-host retention or real-world scheduled backup frequency.

### Creative Studio security and no-paid-API execution

- Owner image upload is bounded to 3 MB JPEG/PNG (streaming HTTP body max ~4.35 MB), magic-byte checked, Sharp decoded with pixel limits, re-encoded to a new PNG and stored in the HQ-only media volume. Paths accept only server-generated UUID filenames.
- Owner-triggered or opted-in daily 2/3 silent 20-second local FFmpeg renders are queued in PostgreSQL; FFmpeg runs with bounded time and no shell expansion. Each MP4 must actually exist before owner approval.
- The private approved MP4 route remains cookie-protected. No video is uploaded to social platforms, no API key is stored and no human-wearing-jewellery footage or licensed music is invented.
- Official Instagram/YouTube post links and performance snapshots are explicitly **OWNER_REPORTED**, never platform-verified. No access to social accounts, no automated publishing, no external analytics API.
- The test synthetic video/image and dummy platform post URLs are disposable CI fixtures, never business evidence.
- The worker uses local CPU, disk, electricity and potentially server charges, which are **NOT_METERED**. Zero paid-model API calls are not zero operating costs.
- The separate creative container image has not been validated end-to-end with a production host filesystem, reverse proxy, backup and media volume restore. GitHub tests validate local render and Compose syntax, not all host-side conditions.

## Explicitly missing production gate evidence

Actual TLS hostname, egress firewall verification, browser Chromium sandbox/seccomp testing on target host, persistent backup/restore test, manual real retailer consent/source compliance review, initial secure deployments, 3D appearance on owner GPU, genuine owner-attributed paid conversion.

Do not imply that a green unit/build/CI run certifies those independent operational gates.
