import type { TrainingScenario } from "@crm/shared";
import { ApiError } from "../lib/errors.js";
import { supabaseAdmin } from "../lib/supabase.js";

type TrainingRow = {
  id: string;
  campaign_id: string;
  name: string;
  voice_only: boolean;
  persona: string;
  objective: string;
  rebuttal_focus: string[] | null;
  live_coaching_enabled: boolean;
  recording_enabled: boolean;
};

function mapTrainingScenario(row: TrainingRow): TrainingScenario {
  return {
    id: row.id,
    campaignId: row.campaign_id,
    name: row.name,
    voiceOnly: row.voice_only,
    persona: row.persona,
    objective: row.objective,
    rebuttalFocus: row.rebuttal_focus ?? [],
    liveCoachingEnabled: row.live_coaching_enabled,
    recordingEnabled: row.recording_enabled
  };
}

export const trainingRepository = {
  async list(companyId: string): Promise<TrainingScenario[]> {
    const { data, error } = await supabaseAdmin
      .from("training_scenarios")
      .select(`
        id,
        campaign_id,
        name,
        voice_only,
        persona,
        objective,
        rebuttal_focus,
        live_coaching_enabled,
        recording_enabled
      `)
      .eq("company_id", companyId)
      .order("name", { ascending: true });

    if (error) {
      throw new ApiError(500, error.message);
    }

    return (data ?? []).map((row) => mapTrainingScenario(row as TrainingRow));
  }
};

