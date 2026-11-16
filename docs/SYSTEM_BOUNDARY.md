# HARD BOUNDARY: AI HEADQUARTERS vs SPLCART

**Owner confirmed 2026-11-14: these are TWO DIFFERENT systems. Never merge them.**

## Ownership and deployment

- **AI Headquarters** owns its own application code, database, browser research, lead scoring, wholesale relationship pipeline, manual approval/audit, quote drafts, and owner-reported conversion records. It is independently deployed, authenticated and backed up.
- **SPLCART** is the owner's existing live ecommerce storefront. It is NOT the headquarters codebase, backend, database, auth provider, deployment, queue or agent host.
- The GitHub repository `sampathkumar-co/splcart` was confirmed empty when this standalone HQ was initiated. That repository name does NOT grant permission to touch the real storefront. Current HQ work is ONLY on branch `feature/ai-headquarters-browser-wholesale-v1`, PR #1, and MUST remain unmerged unless the owner explicitly reverses this instruction.
- No storefront source edits, API/database writes, checkout changes, credentials, webhooks, deployment changes, schema migrations or environment changes. No shared DB or administrative accounts.
- In HQ, a SPLCART product may be referenced by a **public shop/product URL and owner-entered snapshot**. The user may click a link and shop there independently. Such links do not establish read-only API access or real-time price/stock verification.
- **No storefront API integration is necessary to finish the first standalone HQ release.** Authenticated product sync or paid-order reconciliation would require a separate, specifically approved scope in a future project. Do not make it a blocking requirement for independent HQ workflow tests.
- Avoid using the term LIVE_SPLCART_API for owner-entered data. The only status for hand-entered product snapshots is OWNER_ATTESTED. If an earlier scoring algorithm reserves extra points for independent price verification, those points remain zero until a future approved evidence provider exists.
- Sales won in HQ are **owner-reported**, not payment-verified revenue. Dashboard verified revenue remains zero unless a genuinely independent, authorized payment-reconciliation interface is built and tested. A shop link is not proof of a purchase.
- All outreach, quote approval, external publishing and spend remain owner-gated. Do not automatically contact prospects. Website research respects access and content permissions.

## Engineering and review rules

1. Read `AGENTS.md`, this file, latest PR and CI before work.
2. Implement and test isolated HQ functions only, with ephemeral CI fixtures.
3. The app may contain public links to SPLCART for product shopping; it cannot call private SPLCART endpoints, modify storefront records or infer store inventory/revenue.
4. Label every attribution and conversion correctly. No fake successes or unverified claims.
5. Update `AGENTS.md` and the draft PR after milestone, leaving branch unmerged.
