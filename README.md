# Prasanth Jewellers · AI Headquarters

> **Read [AGENTS.md](AGENTS.md) first, in every new coding chat.** It is the canonical project vision, decisions, implementation contract, roadmap and handoff. Update it after every milestone.

Standalone Next.js + PostgreSQL application built in the user-chosen [`sampathkumar-co/splcart`](https://github.com/sampathkumar-co/splcart) repository. The GitHub repository was empty when development began; **it is not the source tree of the live SPLCART storefront**. This is a new independent app, never a production storefront rewrite.

## Vertical built first

1. Owner opens a Google search in their own browser and chooses an independently hosted public business website.
2. Owner submits the HTTPS site to **Playwright Chromium**, which visits the actual page, extracts factual headings/source links and stores the result, including errors. No mass scraping, Google Maps scraping, or authentication bypass.
3. Owner registers a source-backed retailer lead from a completed inspection, or adds an explicitly unverified entry.
4. Owner enters real SPLCART product catalogue records, clearly labelled `OWNER_ATTESTED` until an authenticated integration can reconcile them.
5. Owner records evidenced comparisons. Scores are deterministic, explained and **conservative**: no claimed price advantage unless real API pricing, material, units, delivered prices and freshness are independently verified.
6. Owner reviews/approves leads, records manual outreach history and interest, quotations and owner-reported orders. Contact is never sent automatically. Owner reports **never count** as verified revenue.
7. The premium 3D office and accessible 2D view read the same persisted work state and do not simulate actions.

## Run locally

Requires Node 22+, PostgreSQL 16+, and Chromium dependencies.

```sh
cp .env.example .env
npm install
npm run browser:install
npm run db:generate
npm run db:migrate -- --name init
npm run dev
```

Visit `http://localhost:3000`. The app uses a fail-closed owner username/password (HTTP Basic) for initial development. **Deploy behind HTTPS and replace it with production-grade sessions/identity, CSRF and rate-limiting before exposing publicly.** Set a long random owner password and a private database password. No credentials belong in Git.

```sh
npm test
npm run typecheck
npm run build
```

For 3D use, WebGL must be available; the complete 2D view works without it. Research performs **one owner-triggered HTTPS page inspection**, not a queue of uncontrolled spiders. Playwright is an optional runtime dependency and will report an explicit failure if Chromium is not installed.

## Known blockers and safety

- Production SPLCART backend code and actual protected product/order API contracts have not been supplied or inspected. Authenticated read-only sync and payment verification remain **BLOCKED**.
- No automatic outreach, no Instagram DMs, no promotional calls, no external publishing, no unapproved spending.
- An observed competitor price is **not** a proven comparable wholesale offer. `OWNER_ATTESTED` prices do not qualify for competitive advantage points.
- Public contact details do not grant permission to send messages. Website terms, robots constraints and Indian calling/messaging requirements must be respected.
- The initial app demonstrates a verifiable operator-assisted pipeline, **not** an already-running autonomous 16-agent business.

See [AGENTS.md](AGENTS.md) for the design, completion standard and next milestone.
