import type { Campaign, CampaignDocument, CampaignNumber } from "@crm/shared";
import { db } from "../data/mock-db.js";

export const campaignService = {
  list(): Campaign[] {
    return db.campaigns;
  },

  addDocument(campaignId: string, document: CampaignDocument): Campaign | undefined {
    const campaign = db.campaigns.find((item) => item.id === campaignId);
    if (!campaign) return undefined;
    campaign.documents.push(document);
    return campaign;
  },

  addCallerIds(campaignId: string, numbers: CampaignNumber[]): Campaign | undefined {
    const campaign = db.campaigns.find((item) => item.id === campaignId);
    if (!campaign) return undefined;
    campaign.callerIds.push(...numbers);
    return campaign;
  }
};

