import type { Campaign, CampaignDocument, CampaignNumber } from "@crm/shared";
import { ApiError } from "../lib/errors.js";
import { supabaseAdmin } from "../lib/supabase.js";

type CampaignQueryRow = {
  id: string;
  company_id: string;
  name: string;
  type: Campaign["type"];
  region: string;
  dialer_mode: Campaign["dialerMode"];
  active: boolean;
  campaign_documents: Array<{
    id: string;
    name: string;
    category: CampaignDocument["category"];
    url: string;
  }> | null;
  campaign_numbers: Array<{
    id: string;
    label: string;
    phone_number: string;
    region: string;
    health_score: number;
    spam_risk_score: number;
  }> | null;
};

function mapCampaign(row: CampaignQueryRow): Campaign {
  return {
    id: row.id,
    companyId: row.company_id,
    name: row.name,
    type: row.type,
    region: row.region,
    dialerMode: row.dialer_mode,
    active: row.active,
    documents: (row.campaign_documents ?? []).map((item) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      url: item.url
    })),
    callerIds: (row.campaign_numbers ?? []).map((item) => ({
      id: item.id,
      label: item.label,
      phoneNumber: item.phone_number,
      region: item.region,
      healthScore: item.health_score,
      spamRiskScore: item.spam_risk_score
    }))
  };
}

export const campaignRepository = {
  async list(companyId: string): Promise<Campaign[]> {
    const { data, error } = await supabaseAdmin
      .from("campaigns")
      .select(`
        id,
        company_id,
        name,
        type,
        region,
        dialer_mode,
        active,
        campaign_documents (
          id,
          name,
          category,
          url
        ),
        campaign_numbers (
          id,
          label,
          phone_number,
          region,
          health_score,
          spam_risk_score
        )
      `)
      .eq("company_id", companyId)
      .order("name", { ascending: true });

    if (error) {
      throw new ApiError(500, error.message);
    }

    return (data ?? []).map((row) => mapCampaign(row as CampaignQueryRow));
  },

  async getById(companyId: string, campaignId: string): Promise<Campaign | undefined> {
    const items = await this.list(companyId);
    return items.find((item) => item.id === campaignId);
  },

  async addDocument(companyId: string, campaignId: string, document: CampaignDocument) {
    const { error } = await supabaseAdmin.from("campaign_documents").insert({
      id: document.id,
      company_id: companyId,
      campaign_id: campaignId,
      name: document.name,
      category: document.category,
      url: document.url
    });

    if (error) {
      throw new ApiError(500, error.message);
    }

    return this.getById(companyId, campaignId);
  },

  async addCallerIds(companyId: string, campaignId: string, numbers: CampaignNumber[]) {
    const { error } = await supabaseAdmin.from("campaign_numbers").insert(
      numbers.map((number) => ({
        id: number.id,
        company_id: companyId,
        campaign_id: campaignId,
        label: number.label,
        phone_number: number.phoneNumber,
        region: number.region,
        health_score: number.healthScore,
        spam_risk_score: number.spamRiskScore
      }))
    );

    if (error) {
      throw new ApiError(500, error.message);
    }

    return this.getById(companyId, campaignId);
  }
};

