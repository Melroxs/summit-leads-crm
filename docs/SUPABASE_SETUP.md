# Supabase Setup

## What changed

The app now expects:

1. Supabase Auth for login/session validation
2. Supabase Postgres for tenant-scoped data
3. Row level security based on `profiles.company_id`

## Setup steps

1. Create a Supabase project
2. Copy your project URL and keys into `.env`
3. Run the SQL in `supabase/migrations/0001_init.sql`
4. Create at least one company row
5. Create at least one auth user in Supabase Auth
6. Insert a matching `profiles` row using that auth user id

## Seed command

Once your env file exists and you have a real Supabase Auth user id, run:

```powershell
$env:SEED_USER_ID="your-auth-user-id"
$env:SEED_USER_EMAIL="admin@yourcompany.com"
npm run seed:supabase --workspace @crm/api
```

This creates:

1. a real `Summit Leads` company
2. an admin profile
3. a solar campaign
4. a roofing campaign
5. campaign numbers, docs, training scenarios, and Telnyx telephony account rows

## Multi-tenant rule

Every table is scoped by `company_id`.

That means:

1. one user belongs to one company
2. one campaign belongs to one company
3. leads, recordings, scorecards, and telephony accounts are all filtered to that company

## Runtime note

The API expects a Supabase access token in the `Authorization` header:

```text
Bearer <supabase_access_token>
```

The Next app is prepared to read a session cookie and forward that token to the API.
