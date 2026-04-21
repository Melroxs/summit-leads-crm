export type CampaignType = "solar" | "roofing" | "custom";
export type UserRole = "admin" | "supervisor" | "agent";
export type DialerMode = "power" | "predictive";

export type CallDisposition =
  | "new"
  | "in_progress"
  | "connected"
  | "voicemail"
  | "callback"
  | "not_interested"
  | "sale"
  | "dropped"
  | "failed";

export interface CampaignDocument {
  id: string;
  name: string;
  category: "script" | "company_info" | "rebuttal" | "offer" | "qa";
  url: string;
}

export interface Company {
  id: string;
  name: string;
  subscriptionPlan: string;
}

export interface Profile {
  id: string;
  companyId: string;
  fullName: string;
  email: string;
  role: UserRole;
}

export interface CampaignNumber {
  id: string;
  label: string;
  phoneNumber: string;
  region: string;
  healthScore: number;
  spamRiskScore: number;
}

export interface Campaign {
  id: string;
  companyId: string;
  name: string;
  type: CampaignType;
  region: string;
  dialerMode: DialerMode;
  callerIds: CampaignNumber[];
  documents: CampaignDocument[];
  active: boolean;
}

export interface Lead {
  id: string;
  campaignId: string;
  fullName: string;
  phoneNumber: string;
  state: string;
  postalCode: string;
  assignedAgentId?: string;
  lastDisposition: CallDisposition;
  attempts: number;
  nextDialAt?: string;
  position: number;
}

export interface CallRecording {
  id: string;
  callId: string;
  type: "real_call" | "training";
  campaignId: string;
  agentId: string;
  leadId?: string;
  durationSeconds: number;
  streamUrl: string;
  downloadUrl: string;
  createdAt: string;
}

export interface TelephonyAccount {
  id: string;
  companyId: string;
  provider: "telnyx" | "twilio" | "sip";
  label: string;
  active: boolean;
}

export interface TrainingScenario {
  id: string;
  campaignId: string;
  name: string;
  voiceOnly: boolean;
  persona: string;
  objective: string;
  rebuttalFocus: string[];
  liveCoachingEnabled: boolean;
  recordingEnabled: boolean;
}

export interface Scorecard {
  id: string;
  callId: string;
  agentId: string;
  campaignId: string;
  openingScore: number;
  complianceScore: number;
  rebuttalScore: number;
  closeScore: number;
  notes: string[];
}

export interface TrainingSession {
  id: string;
  campaignId: string;
  agentId: string;
  scenarioId: string;
  mode: "voice_simulation";
  recordingId?: string;
  scorecardId?: string;
}
