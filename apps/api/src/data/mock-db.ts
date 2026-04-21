import type {
  Campaign,
  CallRecording,
  Company,
  Lead,
  Profile,
  Scorecard,
  TelephonyAccount,
  TrainingScenario
} from "@crm/shared";

export const db: {
  companies: Company[];
  profiles: Profile[];
  campaigns: Campaign[];
  leads: Lead[];
  recordings: CallRecording[];
  trainingScenarios: TrainingScenario[];
  scorecards: Scorecard[];
  telephonyAccounts: TelephonyAccount[];
} = {
  companies: [
    {
      id: "company-summit",
      name: "Summit Leads",
      subscriptionPlan: "Scale"
    }
  ],
  profiles: [
    {
      id: "admin-1",
      companyId: "company-summit",
      fullName: "Info Admin",
      email: "info@summitleadsltd.com",
      role: "admin"
    },
    {
      id: "supervisor-1",
      companyId: "company-summit",
      fullName: "Team Leader One",
      email: "leader@summitleadsltd.com",
      role: "supervisor"
    }
  ],
  campaigns: [
    {
      id: "camp-solar",
      companyId: "company-summit",
      name: "Solar Saver",
      type: "solar",
      region: "AZ",
      dialerMode: "predictive",
      active: true,
      callerIds: [
        {
          id: "num-az-1",
          label: "Phoenix Local Presence",
          phoneNumber: "+14805550111",
          region: "AZ",
          healthScore: 92,
          spamRiskScore: 14
        }
      ],
      documents: [
        {
          id: "doc-solar-script",
          name: "Solar Opening Script",
          category: "script",
          url: "/uploads/solar-opening-script.pdf"
        }
      ]
    },
    {
      id: "camp-roof-md",
      companyId: "company-summit",
      name: "Roofing Maryland",
      type: "roofing",
      region: "MD",
      dialerMode: "power",
      active: true,
      callerIds: [
        {
          id: "num-md-1",
          label: "Baltimore Local Presence",
          phoneNumber: "+14435550111",
          region: "MD",
          healthScore: 88,
          spamRiskScore: 18
        },
        {
          id: "num-md-2",
          label: "Maryland Backup",
          phoneNumber: "+12405550111",
          region: "MD",
          healthScore: 91,
          spamRiskScore: 11
        }
      ],
      documents: [
        {
          id: "doc-roofing-company",
          name: "Roofing Company Info",
          category: "company_info",
          url: "/uploads/roofing-company-info.pdf"
        },
        {
          id: "doc-roofing-rebuttals",
          name: "Roofing Rebuttals",
          category: "rebuttal",
          url: "/uploads/roofing-rebuttals.pdf"
        }
      ]
    }
  ],
  leads: [
    {
      id: "lead-1",
      campaignId: "camp-roof-md",
      fullName: "Dana Carter",
      phoneNumber: "+14105550123",
      state: "MD",
      postalCode: "21201",
      lastDisposition: "new",
      attempts: 0,
      position: 1
    },
    {
      id: "lead-2",
      campaignId: "camp-roof-md",
      fullName: "Chris Bell",
      phoneNumber: "+13015550123",
      state: "MD",
      postalCode: "20850",
      lastDisposition: "callback",
      attempts: 1,
      nextDialAt: "2026-04-21T14:00:00.000Z",
      assignedAgentId: "agent-1",
      position: 2
    }
  ],
  recordings: [
    {
      id: "rec-1",
      callId: "call-1",
      type: "real_call",
      campaignId: "camp-roof-md",
      agentId: "agent-1",
      leadId: "lead-2",
      durationSeconds: 312,
      streamUrl: "/audio/recordings/call-1.mp3",
      downloadUrl: "/audio/recordings/call-1.mp3?download=1",
      createdAt: "2026-04-20T08:30:00.000Z"
    },
    {
      id: "rec-2",
      callId: "training-1",
      type: "training",
      campaignId: "camp-solar",
      agentId: "agent-2",
      durationSeconds: 420,
      streamUrl: "/audio/recordings/training-1.mp3",
      downloadUrl: "/audio/recordings/training-1.mp3?download=1",
      createdAt: "2026-04-20T09:10:00.000Z"
    }
  ],
  trainingScenarios: [
    {
      id: "train-roof-1",
      campaignId: "camp-roof-md",
      name: "Roof Damage Objection Handling",
      voiceOnly: true,
      persona: "Busy homeowner who had storm damage but distrusts contractors",
      objective: "Book an inspection",
      rebuttalFocus: ["price", "trust", "timing"],
      liveCoachingEnabled: true,
      recordingEnabled: true
    }
  ],
  scorecards: [
    {
      id: "score-1",
      callId: "call-1",
      agentId: "agent-1",
      campaignId: "camp-roof-md",
      openingScore: 81,
      complianceScore: 94,
      rebuttalScore: 76,
      closeScore: 70,
      notes: [
        "Strong introduction",
        "Missed a cleaner transition into urgency",
        "Handled trust objection well"
      ]
    }
  ],
  telephonyAccounts: [
    {
      id: "tel-1",
      companyId: "company-summit",
      provider: "telnyx",
      label: "Primary Telnyx",
      active: true
    },
    {
      id: "tel-2",
      companyId: "company-summit",
      provider: "twilio",
      label: "Twilio Backup",
      active: false
    }
  ]
};
