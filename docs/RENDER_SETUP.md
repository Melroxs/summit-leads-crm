# Render Setup

## Services to create

Create two Render web services:

1. `summit-leads-api`
2. `summit-leads-web`

You can either:

1. use the checked-in `render.yaml`
2. or create the two services manually in the Render dashboard

## Backend service

### Basic settings

- Service type: `Web Service`
- Runtime: `Node`
- Root directory: repo root
- Build command:

```bash
npm install && npm run build --workspace @crm/shared && npm run build --workspace @crm/api
```

- Start command:

```bash
npm run start --workspace @crm/api
```

### Custom domain

- Add `api.yourdomain.com`

### Environment variables

```env
NODE_ENV=production
PORT=10000
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com

SUPABASE_URL=https://exrmldmcagoxyhhmprhz.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

TELNYX_API_KEY=your_rotated_telnyx_api_key
TELNYX_CONNECTION_ID=2926607396442736303
TELNYX_APP_ID=2926607396442736303
TELNYX_SIP_USERNAME=6bp60pek
TELNYX_SIP_PASSWORD=j3v3cu1bsy
TELNYX_API_BASE_URL=https://api.telnyx.com/v2
TELNYX_PUBLIC_KEY=your_telnyx_public_key
TELNYX_STATUS_CALLBACK_URL=https://api.yourdomain.com/api/telnyx/events
MEDIA_STREAM_WS_URL=wss://api.yourdomain.com/media-stream

OPENAI_API_KEY=your_openai_api_key
```

## Frontend service

### Basic settings

- Service type: `Web Service`
- Runtime: `Node`
- Root directory: repo root
- Build command:

```bash
npm install && npm run build --workspace @crm/web
```

- Start command:

```bash
npm run start --workspace @crm/web
```

### Custom domain

- Add `app.yourdomain.com`

### Environment variables

```env
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_SUPABASE_URL=https://exrmldmcagoxyhhmprhz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
```

## DNS records

At your DNS provider, add:

1. `CNAME` for `api` pointing to your backend Render hostname
2. `CNAME` for `app` pointing to your frontend Render hostname

Example:

```text
api  CNAME  summit-leads-api.onrender.com
app  CNAME  summit-leads-web.onrender.com
```

## Final URLs

Once the backend is live, these should be your Telnyx endpoints:

- `https://api.yourdomain.com/api/telnyx/events`
- `https://api.yourdomain.com/api/telnyx/recordings`
- `wss://api.yourdomain.com/media-stream`

