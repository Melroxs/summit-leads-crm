import type { CallRecording } from "@crm/shared";
import { db } from "../data/mock-db.js";

export const recordingsService = {
  list(filters?: { campaignId?: string; agentId?: string; type?: CallRecording["type"] }): CallRecording[] {
    return db.recordings.filter((recording) => {
      if (filters?.campaignId && recording.campaignId !== filters.campaignId) return false;
      if (filters?.agentId && recording.agentId !== filters.agentId) return false;
      if (filters?.type && recording.type !== filters.type) return false;
      return true;
    });
  },

  create(recording: CallRecording): CallRecording {
    db.recordings.unshift(recording);
    return recording;
  }
};

