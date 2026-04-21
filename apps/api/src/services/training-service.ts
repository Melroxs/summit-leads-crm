import type { TrainingScenario } from "@crm/shared";
import { campaignRepository } from "../repositories/campaign-repository.js";
import { trainingRepository } from "../repositories/training-repository.js";

export const trainingService = {
  async list(companyId: string): Promise<TrainingScenario[]> {
    return trainingRepository.list(companyId);
  },

  async buildVoiceSessionPrompt(companyId: string, campaignId: string, scenarioId: string): Promise<Record<string, unknown> | undefined> {
    const campaign = await campaignRepository.getById(companyId, campaignId);
    const scenario = (await trainingRepository.list(companyId)).find((item) => item.id === scenarioId);

    if (!campaign || !scenario) return undefined;

    return {
      mode: "voice_only_roleplay",
      voiceStreamingRequired: true,
      liveCoaching: scenario.liveCoachingEnabled,
      recordingEnabled: scenario.recordingEnabled,
      campaignName: campaign.name,
      useDocuments: campaign.documents,
      persona: scenario.persona,
      objective: scenario.objective,
      rebuttalFocus: scenario.rebuttalFocus,
      guidance: [
        "Do not use text-only roleplay.",
        "Simulate a natural phone call.",
        "Use campaign documentation as the source of truth.",
        "Send whisper coaching only to the agent audio channel."
      ]
    };
  }
};
