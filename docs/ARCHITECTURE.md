# Architecture

## Repo layout

- `apps/api`: Express backend for campaigns, leads, dialer rules, recordings, training orchestration, scoring, and Telnyx webhooks
- `apps/web`: Next.js admin dashboard for campaign management and QA operations
- `packages/shared`: Shared domain types

## Core business rules implemented

1. Training is voice-first and explicitly blocks text-only roleplay.
2. Campaigns own their own scripts, company docs, rebuttals, QA references, and caller IDs.
3. CSV-style bulk lead upload is modeled at the API layer.
4. Campaign lead deletion removes the whole uploaded campaign list from the system.
5. First-touch lead ownership stays with the agent who touched the lead.
6. The dialer does not immediately retry failed or dropped calls.
7. The dialer keeps moving through the list instead of hammering the same lead.
8. Caller ID selection prefers local presence, then number health, then lower spam risk.
9. Recordings support both real calls and AI simulation calls.
10. Telnyx endpoints are stubbed for event intake, streaming, and recording sync.

## Next production steps

1. Replace the in-memory store with PostgreSQL and migrations.
2. Add real CSV file parsing and object storage.
3. Add auth, tenants, and role-based permissions.
4. Add realtime media orchestration for Telnyx plus AI voice streaming.
5. Add queue workers for predictive dialing and asynchronous QA scoring.
