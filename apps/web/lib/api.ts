import type { Campaign, CallRecording, Scorecard, TelephonyAccount, TrainingScenario } from "@crm/shared";
import { createSupabaseServerClient } from "./supabase-server";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export type ProfileResponse = {
  id: string;
  companyId: string;
  fullName: string;
  email: string;
  role: string;
};

export type LeadResponse = {
  id: string;
  fullName: string;
  phoneNumber: string;
  assignedAgentId?: string;
  lastDisposition: string;
  nextDialAt?: string;
  state: string;
};

async function fetchApi<T>(path: string): Promise<T> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getSession();
  const accessToken = data.session?.access_token ?? "";

  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`API request failed for ${path}`);
  }

  return response.json() as Promise<T>;
}

export async function getProfile() {
  return fetchApi<ProfileResponse>("/api/auth/me");
}

export async function getCampaigns() {
  return fetchApi<Campaign[]>("/api/campaigns");
}

export async function getCampaignLeads(campaignId: string) {
  return fetchApi<LeadResponse[]>(`/api/campaigns/${campaignId}/leads`);
}

export async function getRecordings() {
  return fetchApi<CallRecording[]>("/api/recordings");
}

export async function getScorecards() {
  return fetchApi<Scorecard[]>("/api/scoring");
}

export async function getTrainingScenarios() {
  return fetchApi<TrainingScenario[]>("/api/training/scenarios");
}

export async function getTelephonyAccounts() {
  return fetchApi<TelephonyAccount[]>("/api/settings/telephony");
}

export async function getDialerSummary(campaignId: string) {
  return fetchApi<{
    dialerMode: string;
    totalLeads: number;
    assignedLeads: number;
    untouchedLeads: number;
    activeCallbacks: number;
    protectedOwnership: boolean;
    redialMode: string;
  }>(`/api/dialer/${campaignId}/summary`);
}
