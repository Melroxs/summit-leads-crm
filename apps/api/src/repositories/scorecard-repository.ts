import type { Scorecard } from "@crm/shared";
import { ApiError } from "../lib/errors.js";
import { supabaseAdmin } from "../lib/supabase.js";

type ScorecardRow = {
  id: string;
  call_id: string;
  agent_id: string;
  campaign_id: string;
  opening_score: number;
  compliance_score: number;
  rebuttal_score: number;
  close_score: number;
  notes: string[] | null;
};

function mapScorecard(row: ScorecardRow): Scorecard {
  return {
    id: row.id,
    callId: row.call_id,
    agentId: row.agent_id,
    campaignId: row.campaign_id,
    openingScore: row.opening_score,
    complianceScore: row.compliance_score,
    rebuttalScore: row.rebuttal_score,
    closeScore: row.close_score,
    notes: row.notes ?? []
  };
}

export const scorecardRepository = {
  async list(companyId: string, campaignId?: string) {
    let query = supabaseAdmin
      .from("call_scores")
      .select(`
        id,
        call_id,
        agent_id,
        campaign_id,
        opening_score,
        compliance_score,
        rebuttal_score,
        close_score,
        notes
      `)
      .eq("company_id", companyId)
      .order("created_at", { ascending: false });

    if (campaignId) query = query.eq("campaign_id", campaignId);

    const { data, error } = await query;

    if (error) {
      throw new ApiError(500, error.message);
    }

    return (data ?? []).map((row) => mapScorecard(row as ScorecardRow));
  }
};

