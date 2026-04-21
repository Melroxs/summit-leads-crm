import type { Lead } from "@crm/shared";
import { db } from "../data/mock-db.js";

type CsvLeadUpload = Pick<Lead, "fullName" | "phoneNumber" | "state" | "postalCode">[];

export const leadService = {
  listByCampaign(campaignId: string): Lead[] {
    return db.leads
      .filter((lead) => lead.campaignId === campaignId)
      .sort((a, b) => a.position - b.position);
  },

  bulkUpload(campaignId: string, uploaded: CsvLeadUpload): Lead[] {
    const startPosition = db.leads.filter((lead) => lead.campaignId === campaignId).length;
    const created = uploaded.map((lead, index) => ({
      id: `lead-${db.leads.length + index + 1}`,
      campaignId,
      fullName: lead.fullName,
      phoneNumber: lead.phoneNumber,
      state: lead.state,
      postalCode: lead.postalCode,
      lastDisposition: "new" as const,
      attempts: 0,
      position: startPosition + index + 1
    }));
    db.leads.push(...created);
    return created;
  },

  bulkDeleteCampaignList(campaignId: string): number {
    const before = db.leads.length;
    db.leads = db.leads.filter((lead) => lead.campaignId !== campaignId);
    return before - db.leads.length;
  }
};

