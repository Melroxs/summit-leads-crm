import type { CallDisposition, Lead } from "@crm/shared";
import { ApiError } from "../lib/errors.js";
import { campaignRepository } from "../repositories/campaign-repository.js";
import { leadRepository } from "../repositories/lead-repository.js";
import { telnyxService } from "./telnyx-service.js";

const terminalDispositions: CallDisposition[] = ["sale", "not_interested"];

function canDialLead(lead: Lead, nowIso: string): boolean {
  if (terminalDispositions.includes(lead.lastDisposition)) return false;
  if (!lead.nextDialAt) return true;
  return new Date(lead.nextDialAt).getTime() <= new Date(nowIso).getTime();
}

function nextDialByDisposition(disposition: CallDisposition): string | undefined {
  const now = new Date();

  switch (disposition) {
    case "callback":
      now.setHours(now.getHours() + 24);
      return now.toISOString();
    case "voicemail":
      now.setHours(now.getHours() + 48);
      return now.toISOString();
    case "failed":
    case "dropped":
      now.setHours(now.getHours() + 72);
      return now.toISOString();
    default:
      return undefined;
  }
}

export const dialerService = {
  async getNextLead(companyId: string, campaignId: string, agentId: string): Promise<{ lead?: Lead; reason?: string; callerId?: string }> {
    const nowIso = new Date().toISOString();
    const ordered = await leadRepository.listByCampaign(companyId, campaignId);

    const candidate = ordered.find((lead) => {
      if (lead.assignedAgentId && lead.assignedAgentId !== agentId) return false;
      return canDialLead(lead, nowIso);
    });

    if (!candidate) {
      return {
        reason: "No dialable leads right now. Keep ownership intact and wait for the next eligible disposition window."
      };
    }

    const assignedAgentId = candidate.assignedAgentId ?? agentId;
    const updated = await leadRepository.update(companyId, candidate.id, {
      assignedAgentId,
      lastDisposition: "in_progress"
    });

    const callerId = await telnyxService
      .pickBestCallerId(companyId, campaignId, updated)
      .then((number) => number?.phoneNumber);

    return {
      lead: updated,
      callerId
    };
  },

  async completeCall(companyId: string, input: {
    leadId: string;
    disposition: CallDisposition;
  }): Promise<Lead> {
    const lead = await leadRepository.getById(companyId, input.leadId);

    if (!lead) {
      throw new ApiError(404, "Lead not found");
    }

    return leadRepository.update(companyId, input.leadId, {
      attempts: lead.attempts + 1,
      lastDisposition: input.disposition,
      nextDialAt: nextDialByDisposition(input.disposition)
    });
  },

  async getDialerSummary(companyId: string, campaignId: string) {
    const campaign = await campaignRepository.getById(companyId, campaignId);
    const leads = await leadRepository.listByCampaign(companyId, campaignId);

    return {
      dialerMode: campaign?.dialerMode ?? "predictive",
      totalLeads: leads.length,
      assignedLeads: leads.filter((lead) => lead.assignedAgentId).length,
      untouchedLeads: leads.filter((lead) => !lead.assignedAgentId).length,
      activeCallbacks: leads.filter((lead) => lead.lastDisposition === "callback").length,
      protectedOwnership: true,
      redialMode: "end_of_list_then_disposition_window"
    };
  }
};
