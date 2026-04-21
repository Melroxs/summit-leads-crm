import type { Lead } from "@crm/shared";
import { ApiError } from "../lib/errors.js";
import { supabaseAdmin } from "../lib/supabase.js";

type LeadRow = {
  id: string;
  campaign_id: string;
  full_name: string;
  phone_number: string;
  state: string;
  postal_code: string;
  assigned_agent_id: string | null;
  last_disposition: Lead["lastDisposition"];
  attempts: number;
  next_dial_at: string | null;
  position: number;
};

function mapLead(row: LeadRow): Lead {
  return {
    id: row.id,
    campaignId: row.campaign_id,
    fullName: row.full_name,
    phoneNumber: row.phone_number,
    state: row.state,
    postalCode: row.postal_code,
    assignedAgentId: row.assigned_agent_id ?? undefined,
    lastDisposition: row.last_disposition,
    attempts: row.attempts,
    nextDialAt: row.next_dial_at ?? undefined,
    position: row.position
  };
}

const baseSelect = `
  id,
  campaign_id,
  full_name,
  phone_number,
  state,
  postal_code,
  assigned_agent_id,
  last_disposition,
  attempts,
  next_dial_at,
  position
`;

export const leadRepository = {
  async listByCampaign(companyId: string, campaignId: string): Promise<Lead[]> {
    const { data, error } = await supabaseAdmin
      .from("leads")
      .select(baseSelect)
      .eq("company_id", companyId)
      .eq("campaign_id", campaignId)
      .order("position", { ascending: true });

    if (error) {
      throw new ApiError(500, error.message);
    }

    return (data ?? []).map((row) => mapLead(row as LeadRow));
  },

  async getById(companyId: string, leadId: string): Promise<Lead | undefined> {
    const { data, error } = await supabaseAdmin
      .from("leads")
      .select(baseSelect)
      .eq("company_id", companyId)
      .eq("id", leadId)
      .maybeSingle();

    if (error) {
      throw new ApiError(500, error.message);
    }

    return data ? mapLead(data as LeadRow) : undefined;
  },

  async bulkUpload(
    companyId: string,
    campaignId: string,
    uploaded: Pick<Lead, "fullName" | "phoneNumber" | "state" | "postalCode">[]
  ): Promise<Lead[]> {
    const existing = await this.listByCampaign(companyId, campaignId);
    const rows = uploaded.map((lead, index) => ({
      company_id: companyId,
      campaign_id: campaignId,
      full_name: lead.fullName,
      phone_number: lead.phoneNumber,
      state: lead.state,
      postal_code: lead.postalCode,
      last_disposition: "new",
      attempts: 0,
      position: existing.length + index + 1
    }));

    const { data, error } = await supabaseAdmin
      .from("leads")
      .insert(rows)
      .select(baseSelect);

    if (error) {
      throw new ApiError(500, error.message);
    }

    return (data ?? []).map((row) => mapLead(row as LeadRow));
  },

  async bulkDeleteCampaignList(companyId: string, campaignId: string): Promise<number> {
    const { data, error } = await supabaseAdmin
      .from("leads")
      .delete()
      .eq("company_id", companyId)
      .eq("campaign_id", campaignId)
      .select("id");

    if (error) {
      throw new ApiError(500, error.message);
    }

    return data?.length ?? 0;
  },

  async update(companyId: string, leadId: string, patch: Partial<Lead>): Promise<Lead> {
    const payload: Record<string, unknown> = {};

    if (patch.assignedAgentId !== undefined) payload.assigned_agent_id = patch.assignedAgentId;
    if (patch.lastDisposition !== undefined) payload.last_disposition = patch.lastDisposition;
    if (patch.attempts !== undefined) payload.attempts = patch.attempts;
    if (patch.nextDialAt !== undefined) payload.next_dial_at = patch.nextDialAt;
    if (patch.position !== undefined) payload.position = patch.position;

    const { data, error } = await supabaseAdmin
      .from("leads")
      .update(payload)
      .eq("company_id", companyId)
      .eq("id", leadId)
      .select(baseSelect)
      .single();

    if (error || !data) {
      throw new ApiError(500, error?.message ?? "Lead update failed");
    }

    return mapLead(data as LeadRow);
  }
};

