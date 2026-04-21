import type { CallRecording } from "@crm/shared";
import { ApiError } from "../lib/errors.js";
import { supabaseAdmin } from "../lib/supabase.js";

type RecordingRow = {
  id: string;
  call_id: string;
  type: CallRecording["type"];
  campaign_id: string;
  agent_id: string;
  lead_id: string | null;
  duration_seconds: number;
  stream_url: string;
  download_url: string;
  created_at: string;
};

function mapRecording(row: RecordingRow): CallRecording {
  return {
    id: row.id,
    callId: row.call_id,
    type: row.type,
    campaignId: row.campaign_id,
    agentId: row.agent_id,
    leadId: row.lead_id ?? undefined,
    durationSeconds: row.duration_seconds,
    streamUrl: row.stream_url,
    downloadUrl: row.download_url,
    createdAt: row.created_at
  };
}

const baseSelect = `
  id,
  call_id,
  type,
  campaign_id,
  agent_id,
  lead_id,
  duration_seconds,
  stream_url,
  download_url,
  created_at
`;

export const recordingRepository = {
  async list(companyId: string, filters?: { campaignId?: string; agentId?: string; type?: CallRecording["type"] }) {
    let query = supabaseAdmin
      .from("recordings")
      .select(baseSelect)
      .eq("company_id", companyId)
      .order("created_at", { ascending: false });

    if (filters?.campaignId) query = query.eq("campaign_id", filters.campaignId);
    if (filters?.agentId) query = query.eq("agent_id", filters.agentId);
    if (filters?.type) query = query.eq("type", filters.type);

    const { data, error } = await query;

    if (error) {
      throw new ApiError(500, error.message);
    }

    return (data ?? []).map((row) => mapRecording(row as RecordingRow));
  },

  async create(companyId: string, recording: CallRecording) {
    const { data, error } = await supabaseAdmin
      .from("recordings")
      .insert({
        id: recording.id,
        company_id: companyId,
        call_id: recording.callId,
        type: recording.type,
        campaign_id: recording.campaignId,
        agent_id: recording.agentId,
        lead_id: recording.leadId ?? null,
        duration_seconds: recording.durationSeconds,
        stream_url: recording.streamUrl,
        download_url: recording.downloadUrl,
        created_at: recording.createdAt
      })
      .select(baseSelect)
      .single();

    if (error || !data) {
      throw new ApiError(500, error?.message ?? "Recording insert failed");
    }

    return mapRecording(data as RecordingRow);
  }
};

