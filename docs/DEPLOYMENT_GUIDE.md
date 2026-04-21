# Deployment Guide

## What this project includes

This project is split into two apps:

1. `apps/api` is the backend. It stores campaigns, leads, dialer rules, recordings metadata, training scenarios, scoring, and Telnyx voice events.
2. `apps/web` is the admin dashboard. It gives you the screens to manage campaigns, upload leads, review recordings, launch training, and monitor dialer/QA results.

## Step 1: install the tools

You need these installed on your computer:

1. Node.js 20 or newer
2. npm 10 or newer
3. PostgreSQL 15 or newer

## Step 2: download packages

Open a terminal inside this folder and run:

```powershell
npm install
```

## Step 3: create your environment file

Copy `.env.example` to `.env` and fill in:

1. Your Telnyx API key
2. Your Telnyx connection ID
3. Your Telnyx public key
4. Your OpenAI API key
5. Your PostgreSQL connection string

## Step 4: start the backend

Run:

```powershell
npm run dev:api
```

The backend will start on `http://localhost:4000`.

## Step 5: start the web dashboard

In a second terminal, run:

```powershell
npm run dev:web
```

The dashboard will start on `http://localhost:3000`.

## Step 6: connect Telnyx

In Telnyx, point your webhooks to your backend:

1. Call events webhook: `/api/telnyx/events`
2. Media or streaming webhook: `/api/telnyx/stream`
3. Recording webhook: `/api/telnyx/recordings`

## Step 7: add campaigns

Inside the dashboard:

1. Create a campaign like `Solar` or `Roofing Maryland`
2. Upload campaign documents, rebuttals, offer details, and scripts
3. Add the outbound caller IDs that belong to that campaign
4. Upload the lead CSV file and assign it to that campaign

## Step 8: how the dialer logic works

This build is designed to avoid duplicate calling:

1. A lead gets assigned to only one agent the first time that lead is touched
2. That lead stays owned by that same agent
3. Failed or dropped calls do not immediately retry
4. The system keeps moving forward through the list
5. Only after the full list is exhausted should the dialer consider another pass
6. Redial timing can be controlled by disposition rules

## Step 9: voice training mode

Training is built as a voice-first flow:

1. The agent joins a simulated call
2. The scenario uses the campaign's script, company info, objections, and rebuttals
3. Coaching can whisper guidance live
4. The session can be recorded
5. QA scoring is shown afterward

## Step 10: production hardening

Before going live, add:

1. Real database migrations
2. Auth and role permissions
3. File storage for campaign docs and recordings
4. Secure signed download URLs
5. Queue workers for dialing and scoring
6. Full Telnyx webhook verification
7. Realtime audio transport for AI coaching

## Easy summary

If you want the simplest mental model:

1. Campaigns contain the script, numbers, and leads
2. Leads belong to campaigns
3. Once an agent touches a lead, that lead belongs to that agent
4. Calls and training sessions create recordings
5. QA and coaching run on top of those calls

