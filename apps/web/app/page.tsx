import { PageHeader } from "../components/page-header";
import { getCampaigns, getProfile, getRecordings, getScorecards } from "../lib/api";
import { requireSession } from "../lib/auth";
import { agentStatuses, dashboardMetrics } from "../lib/mock-data";

const statusBadges = [
  { label: "Ready 9", tone: "green" },
  { label: "On Call 8", tone: "cyan" },
  { label: "Wrap Up 3", tone: "amber" },
  { label: "Paused 1", tone: "red" },
  { label: "Lunch 1", tone: "purple" }
];

export default async function HomePage() {
  await requireSession();

  const [profile, campaigns, recordings, scorecards] = await Promise.all([
    getProfile().catch(() => null),
    getCampaigns().catch(() => []),
    getRecordings().catch(() => []),
    getScorecards().catch(() => [])
  ]);

  const liveMetrics = [
    { label: "Active Campaigns", value: String(campaigns.length), note: "Tenant-scoped from API" },
    { label: "Recordings", value: String(recordings.length), note: "Live recording rows" },
    { label: "QA Scorecards", value: String(scorecards.length), note: "Pulled from API" },
    { label: "Logged In Role", value: profile?.role ?? "Unknown", note: profile?.email ?? "Missing profile" }
  ];

  return (
    <div className="page-grid">
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back to Summit Leads CRM. This workspace tracks CRM, dialing, AI coaching, and QA in one place."
        rightSlot={<div className="pill">Wrap Up</div>}
      />

      <section className="cards-grid">
        {[...liveMetrics, ...dashboardMetrics].map((item) => (
          <article className="metric-card" key={item.label}>
            <p>{item.label}</p>
            <h3>{item.value}</h3>
            <small>{item.note}</small>
          </article>
        ))}
      </section>

      <section className="dashboard-grid">
        <article className="panel">
          <div className="panel-header">
            <div>
              <h2 className="panel-title">Agent Status Overview</h2>
              <p className="panel-subtitle">Live operational status for supervisors and admins.</p>
            </div>
          </div>
          <div className="panel-body">
            <div className="badge-row">
              {statusBadges.map((badge) => (
                <span className={`badge ${badge.tone}`} key={badge.label}>
                  {badge.label}
                </span>
              ))}
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Agent</th>
                  <th>Status</th>
                  <th>Since</th>
                </tr>
              </thead>
              <tbody>
                {agentStatuses.map((agent) => (
                  <tr key={agent.email}>
                    <td>
                      <strong>{agent.name}</strong>
                      <div className="tiny">{agent.email}</div>
                    </td>
                    <td>{agent.status}</td>
                    <td>{agent.since}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="panel">
          <div className="panel-header">
            <div>
              <h2 className="panel-title">Execution Priorities</h2>
              <p className="panel-subtitle">Rules from the product design document currently reflected in the scaffold.</p>
            </div>
          </div>
          <div className="panel-body">
            <div className="list-card">
              <ol className="list">
                <li>No duplicate lead assignment across agents.</li>
                <li>Voice-only AI training and coaching, not text roleplay.</li>
                <li>Campaign documents shape AI call behavior per vertical.</li>
                <li>Recordings available inside CRM plus downloadable.</li>
                <li>Telnyx-first telephony layer with room for Twilio or SIP later.</li>
              </ol>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
