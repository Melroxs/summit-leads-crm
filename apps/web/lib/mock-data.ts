export const dashboardMetrics = [
  { label: "Total Contacts", value: "13,996", note: "1,104 imported today" },
  { label: "Active Campaigns", value: "4", note: "Solar, roofing, insurance, revival" },
  { label: "Calls Today", value: "1,280", note: "avg connect 18.4%" },
  { label: "AI Coaching Latency", value: "1.2s", note: "Below 1.5s target" },
  { label: "Lead Reuse", value: "0", note: "Ownership lock holding" },
  { label: "AI Minutes", value: "312", note: "Tracked for billing" }
];

export const agentStatuses = [
  { name: "Jireh", email: "jireh@summitleadsltd.com", status: "On Call", since: "7:15 PM" },
  { name: "Info", email: "info@summitleadsltd.com", status: "Wrap Up", since: "3:35 PM" },
  { name: "Pretorius", email: "pretorius@summitleadsltd.com", status: "Ready", since: "6:12 PM" },
  { name: "Kate Agent", email: "kate.agent@summitleadsltd.com", status: "Break", since: "3:42 PM" }
];

export const leads = [
  {
    name: "Mike Service Agent",
    phone: "(228) 226-8594",
    campaign: "Scottsdale Solar",
    owner: "agent-3",
    disposition: "New",
    nextDial: "Ready now",
    region: "Arizona"
  },
  {
    name: "Dana Carter",
    phone: "(410) 555-0123",
    campaign: "Roofing Maryland",
    owner: "agent-1",
    disposition: "Callback",
    nextDial: "Tomorrow 14:00",
    region: "Maryland"
  },
  {
    name: "Chris Bell",
    phone: "(301) 555-0123",
    campaign: "Roofing Maryland",
    owner: "agent-1",
    disposition: "Voicemail",
    nextDial: "In 48 hours",
    region: "Maryland"
  }
];

export const campaigns = [
  {
    name: "Scottsdale Solar",
    type: "Solar",
    mode: "Predictive",
    leads: 5980,
    numbers: 6,
    ai: "Savings, tax credits, energy bill pain",
    documents: ["Script", "Rebuttals", "Company FAQ", "QA rubric"]
  },
  {
    name: "Roofing Maryland",
    type: "Roofing",
    mode: "Power + Predictive",
    leads: 11008,
    numbers: 4,
    ai: "Storm urgency, insurance claims, trust building",
    documents: ["Damage story", "Insurance guide", "Rebuttals", "Inspection close"]
  }
];

export const recordings = [
  {
    type: "Real call",
    agent: "agent-1",
    campaign: "Roofing Maryland",
    date: "Apr 20, 2026",
    duration: "05:12",
    download: "Enabled"
  },
  {
    type: "Training simulation",
    agent: "agent-2",
    campaign: "Scottsdale Solar",
    date: "Apr 20, 2026",
    duration: "07:00",
    download: "Enabled"
  }
];

export const scorecards = [
  { area: "Opening", score: 81, note: "Strong opener, slightly slow on transition" },
  { area: "Compliance", score: 94, note: "Required disclosures captured" },
  { area: "Rebuttals", score: 76, note: "Handled trust well, price objection still soft" },
  { area: "Close", score: 70, note: "Needs firmer assumptive finish" }
];

export const trainingScenarios = [
  {
    name: "Solar homeowner on high utility bills",
    campaign: "Scottsdale Solar",
    coaching: "Whisper enabled",
    scoring: "QA score + objection map"
  },
  {
    name: "Roofing storm-damage homeowner",
    campaign: "Roofing Maryland",
    coaching: "Whisper enabled",
    scoring: "Inspection booking score"
  }
];

export const billingPlans = [
  { plan: "Starter", seats: "10", voiceMinutes: "3,000", aiMinutes: "500", status: "Active" },
  { plan: "Scale", seats: "50", voiceMinutes: "25,000", aiMinutes: "5,000", status: "Available" }
];

export const telephonyProviders = [
  { name: "Telnyx", status: "Primary", use: "Realtime voice, call control, recordings" },
  { name: "Twilio", status: "Standby", use: "Fallback telephony provider" }
];

export const supervisorEvents = [
  { agent: "Jireh", mode: "Listen", campaign: "Solar", note: "Manager monitoring first call block" },
  { agent: "Info", mode: "Whisper", campaign: "Roofing", note: "AI plus manager guidance active" },
  { agent: "Pretorius", mode: "Barge", campaign: "Roofing", note: "Manager joined close attempt" }
];

