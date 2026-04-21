import { randomUUID } from "crypto";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL ?? "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const seedPassword = process.env.SEED_USER_PASSWORD ?? "SummitLeads123!";
const email = process.env.SEED_USER_EMAIL ?? "admin@summitleads.ai";
const fullName = process.env.SEED_USER_NAME ?? "Summit Admin";

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

async function main() {
  const existingUser = await supabase.auth.admin.listUsers();
  if (existingUser.error) throw existingUser.error;

  const matched = existingUser.data.users.find((user) => user.email?.toLowerCase() === email.toLowerCase());
  const userId = matched?.id ?? (await createUser()).id;
  const companyId = randomUUID();
  const solarCampaignId = randomUUID();
  const roofingCampaignId = randomUUID();

  const { error: companyError } = await supabase
    .from("companies")
    .upsert({
      id: companyId,
      name: "Summit Leads",
      subscription_plan: "scale"
    }, { onConflict: "id" });

  if (companyError) throw companyError;

  const { error: profileError } = await supabase
    .from("profiles")
    .upsert({
      id: userId,
      company_id: companyId,
      full_name: fullName,
      email,
      role: "admin"
    }, { onConflict: "id" });

  if (profileError) throw profileError;

  const { error: campaignError } = await supabase
    .from("campaigns")
    .upsert([
      {
        id: solarCampaignId,
        company_id: companyId,
        name: "Scottsdale Solar",
        type: "solar",
        region: "AZ",
        dialer_mode: "predictive",
        active: true
      },
      {
        id: roofingCampaignId,
        company_id: companyId,
        name: "Roofing Maryland",
        type: "roofing",
        region: "MD",
        dialer_mode: "power",
        active: true
      }
    ], { onConflict: "id" });

  if (campaignError) throw campaignError;

  const { error: numberError } = await supabase.from("campaign_numbers").insert([
    {
      company_id: companyId,
      campaign_id: solarCampaignId,
      label: "Phoenix Local Presence",
      phone_number: "+14805550111",
      region: "AZ",
      health_score: 92,
      spam_risk_score: 14
    },
    {
      company_id: companyId,
      campaign_id: roofingCampaignId,
      label: "Baltimore Local Presence",
      phone_number: "+14435550111",
      region: "MD",
      health_score: 88,
      spam_risk_score: 18
    }
  ]);

  if (numberError) throw numberError;

  const { error: documentError } = await supabase.from("campaign_documents").insert([
    {
      company_id: companyId,
      campaign_id: solarCampaignId,
      name: "Solar Opening Script",
      category: "script",
      url: "https://example.com/solar-script.pdf"
    },
    {
      company_id: companyId,
      campaign_id: roofingCampaignId,
      name: "Roofing Rebuttals",
      category: "rebuttal",
      url: "https://example.com/roofing-rebuttals.pdf"
    }
  ]);

  if (documentError) throw documentError;

  const { error: trainingError } = await supabase.from("training_scenarios").insert([
    {
      company_id: companyId,
      campaign_id: solarCampaignId,
      name: "Solar Homeowner High Bill Scenario",
      voice_only: true,
      persona: "Homeowner worried about utility bills",
      objective: "Set consultation",
      rebuttal_focus: ["price", "trust", "commitment"],
      live_coaching_enabled: true,
      recording_enabled: true
    },
    {
      company_id: companyId,
      campaign_id: roofingCampaignId,
      name: "Storm Damage Roof Inspection Scenario",
      voice_only: true,
      persona: "Homeowner with insurance questions",
      objective: "Book inspection",
      rebuttal_focus: ["timing", "insurance", "price"],
      live_coaching_enabled: true,
      recording_enabled: true
    }
  ]);

  if (trainingError) throw trainingError;

  const { error: telephonyError } = await supabase.from("telephony_accounts").insert({
    company_id: companyId,
    provider: "telnyx",
    label: "Primary Telnyx",
    active: true
  });

  if (telephonyError) throw telephonyError;

  console.log(JSON.stringify({
    seeded: true,
    companyId,
    adminUserId: userId,
    adminEmail: email,
    adminPassword: matched ? "existing-user-password-unchanged" : seedPassword,
    campaigns: [solarCampaignId, roofingCampaignId]
  }, null, 2));
}

async function createUser() {
  const created = await supabase.auth.admin.createUser({
    email,
    password: seedPassword,
    email_confirm: true
  });

  if (created.error || !created.data.user) {
    throw created.error ?? new Error("Failed to create seed auth user");
  }

  return created.data.user;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
