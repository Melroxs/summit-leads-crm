export const env = {
  port: Number(process.env.PORT ?? 4000),
  telnyxApiKey: process.env.TELNYX_API_KEY ?? "",
  telnyxConnectionId: process.env.TELNYX_CONNECTION_ID ?? "",
  telnyxPublicKey: process.env.TELNYX_PUBLIC_KEY ?? "",
  telnyxAppId: process.env.TELNYX_APP_ID ?? "",
  telnyxApiBaseUrl: process.env.TELNYX_API_BASE_URL ?? "https://api.telnyx.com/v2",
  telnyxStatusCallbackUrl: process.env.TELNYX_STATUS_CALLBACK_URL ?? "",
  mediaStreamWsUrl: process.env.MEDIA_STREAM_WS_URL ?? "",
  openAiApiKey: process.env.OPENAI_API_KEY ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  supabaseUrl: process.env.SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY ?? "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""
};
