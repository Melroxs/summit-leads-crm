import type { Scorecard } from "@crm/shared";
import { db } from "../data/mock-db.js";

export const scoringService = {
  listByCampaign(campaignId?: string): Scorecard[] {
    if (!campaignId) return db.scorecards;
    return db.scorecards.filter((scorecard) => scorecard.campaignId === campaignId);
  }
};

