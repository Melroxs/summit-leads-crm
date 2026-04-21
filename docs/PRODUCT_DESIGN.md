# Summit Leads AI CRM + Dialer Platform

This repo now reflects the product direction you provided:

## Product Positioning

An AI-driven outbound sales execution platform combining CRM, power/predictive dialing, realtime coaching, QA, supervision, campaign training, telephony, and SaaS billing.

## Product Modules Represented In The Repo

1. CRM core
2. Dialer system
3. Realtime voice system
4. Call recording system
5. AI voice coaching
6. Post-call AI engine
7. Supervisor control system
8. Campaign AI training
9. Number management
10. Multi-tenancy and roles
11. Billing surface

## Current Repo Mapping

- `apps/web`: dark SaaS admin shell inspired by the provided Summit UI screenshots
- `apps/api`: API scaffold for campaigns, leads, dialer rules, training, recordings, QA, and telephony hooks
- `packages/shared`: shared domain types for multi-tenant CRM and dialer entities

## Important Build Rules Captured

1. AI training must be voice-first, not text roleplay
2. Campaigns must carry their own scripts, docs, and AI behavior
3. Lead ownership must lock on first touch
4. Duplicate simultaneous dialing must be prevented
5. Sequential exhaustion must happen before recycle
6. Local presence and number health must influence outbound number choice
7. Recordings must exist for both real and simulated calls
