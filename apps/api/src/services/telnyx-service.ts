import type { CampaignNumber, Lead } from "@crm/shared";
import { env } from "../config/env.js";
import { ApiError } from "../lib/errors.js";
import { campaignRepository } from "../repositories/campaign-repository.js";
import { leadRepository } from "../repositories/lead-repository.js";

function normalizeAreaCode(phoneNumber: string): string {
  return phoneNumber.replace(/[^0-9]/g, "").slice(-10, -7);
}

function rankNumberFit(lead: Lead, number: CampaignNumber): number {
  const leadAreaCode = normalizeAreaCode(lead.phoneNumber);
  const numberAreaCode = normalizeAreaCode(number.phoneNumber);
  const localPresenceBonus = leadAreaCode === numberAreaCode ? 30 : 0;
  const regionBonus = lead.state === number.region ? 20 : 0;
  return number.healthScore - number.spamRiskScore + localPresenceBonus + regionBonus;
}

export const telnyxService = {
  async pickBestCallerId(companyId: string, campaignId: string, lead: Lead): Promise<CampaignNumber | undefined> {
    const campaign = await campaignRepository.getById(companyId, campaignId);
    if (!campaign) return undefined;

    return [...campaign.callerIds]
      .sort((a, b) => rankNumberFit(lead, b) - rankNumberFit(lead, a))[0];
  },

  async buildRealTimeVoiceStreamPayload(companyId: string, input: {
    campaignId: string;
    lead: Lead;
    agentId: string;
  }) {
    const callerId = await this.pickBestCallerId(companyId, input.campaignId, input.lead);

    return {
      connectionId: env.telnyxConnectionId,
      appId: env.telnyxAppId,
      campaignId: input.campaignId,
      agentId: input.agentId,
      leadId: input.lead.id,
      to: input.lead.phoneNumber,
      from: callerId?.phoneNumber,
      localPresenceEnabled: true,
      recordingEnabled: true,
      streamMode: "realtime_voice",
      whisperCoachingChannel: "supervisor_or_ai_only"
    };
  },

  async createOutboundCallSession(companyId: string, input: {
    campaignId: string;
    agentId: string;
    leadId: string;
  }) {
    const lead = await leadRepository.getById(companyId, input.leadId);

    if (!lead) {
      throw new ApiError(404, "Lead not found for outbound session");
    }

    const payload = await this.buildRealTimeVoiceStreamPayload(companyId, {
      campaignId: input.campaignId,
      agentId: input.agentId,
      lead
    });

    const telnyxRequestBody = {
      connection_id: env.telnyxConnectionId,
      to: payload.to,
      from: payload.from,
      webhook_url: env.telnyxStatusCallbackUrl || undefined,
      stream_url: env.mediaStreamWsUrl || undefined,
      stream_track: "both_tracks",
      stream_bidirectional_mode: "mp3",
      custom_headers: [
        { name: "x-agent-id", value: input.agentId },
        { name: "x-campaign-id", value: input.campaignId },
        { name: "x-lead-id", value: input.leadId }
      ]
    };

    if (!env.telnyxApiKey || !env.telnyxConnectionId || !env.mediaStreamWsUrl) {
      return {
        provider: "telnyx",
        dryRun: true,
        reason: "Missing Telnyx API key, connection id, or media websocket URL.",
        request: telnyxRequestBody
      };
    }

    const response = await fetch(`${env.telnyxApiBaseUrl}/calls`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.telnyxApiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(telnyxRequestBody)
    });

    if (!response.ok) {
      throw new ApiError(response.status, `Telnyx call creation failed: ${await response.text()}`);
    }

    const data = await response.json();

    return {
      provider: "telnyx",
      dryRun: false,
      payload,
      telnyx: data
    };
  },

  async injectWhisperCoaching(_companyId: string, input: {
    callControlId: string;
    message: string;
    voice: string;
  }) {
    return {
      provider: "telnyx",
      action: "whisper_coaching_enqueued",
      target: input.callControlId,
      message: input.message,
      voice: input.voice,
      note: "Attach TTS generation here and push the base64 mp3 back through the active media websocket."
    };
  }
};
