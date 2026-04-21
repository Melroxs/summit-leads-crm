import { PageHeader } from "../../components/page-header";
import { getCampaigns, getDialerSummary } from "../../lib/api";
import { requireSession } from "../../lib/auth";

const activity = [
  "Call 3:35 PM - AI summary generated",
  "Call 2:37 PM - Manual dial logged",
  "Call 2:36 PM - Callback scheduled",
  "Call 2:34 PM - Recording attached"
];

export default async function DialerPage() {
  await requireSession();
  const campaigns = await getCampaigns().catch(() => []);
  const primaryCampaign = campaigns[0];
  const summary = primaryCampaign ? await getDialerSummary(primaryCampaign.id).catch(() => null) : null;

  return (
    <div className="page-grid">
      <PageHeader
        title="Dialer"
        subtitle="Power and predictive dialing with campaign routing, live voice controls, and anti-duplicate assignment logic."
        rightSlot={
          <>
            <div className="pill">Power Dial</div>
            <div className="pill">Scripts (1)</div>
            <div className="pill">Ready</div>
          </>
        }
      />

      <section className="dashboard-grid">
        <div className="page-grid">
          <article className="panel">
            <div className="panel-body call-stage">
              <div className="info-card">
                <h4>Campaign</h4>
                <p>{primaryCampaign ? `${primaryCampaign.name} - ${primaryCampaign.region}` : "No campaign connected"}</p>
              </div>
              <div className="info-grid">
                <div className="info-card">
                  <h4>{summary?.totalLeads ?? 0}</h4>
                  <p>Remaining</p>
                </div>
                <div className="info-card">
                  <h4>{primaryCampaign?.callerIds.length ?? 0}</h4>
                  <p>Phone pool active</p>
                </div>
                <div className="info-card">
                  <h4>{primaryCampaign?.callerIds[0]?.phoneNumber ?? "No number"}</h4>
                  <p>Best local presence number</p>
                </div>
              </div>
            </div>
          </article>

          <article className="contact-card">
            <div className="badge-row">
              <span className="badge cyan">Manual Call</span>
              <span className="badge green">{summary?.dialerMode ?? "predictive"}</span>
            </div>
            <h3>Mike Service Agent</h3>
            <p className="panel-subtitle">(228) 226-8594</p>
            <div className="tiny">Attempt #1 · Ownership locked to current agent</div>
          </article>

          <article className="panel">
            <div className="panel-body">
              <div className="call-surface">
                <div style={{ textAlign: "center" }}>
                  <button className="mute-button" type="button">
                    ⌁
                  </button>
                  <div style={{ marginTop: 12 }}>00:00</div>
                </div>
              </div>
            </div>
          </article>

          <article className="panel">
            <div className="panel-header">
              <div>
                <h2 className="panel-title">Call Controls</h2>
                <p className="panel-subtitle">Mute, hold, and in-call audio adjustment hooks.</p>
              </div>
            </div>
            <div className="panel-body call-controls">
              <div className="control-row">
                <button className="control-button" type="button">Mute</button>
                <button className="control-button" type="button">Hold</button>
              </div>
              <div>
                <div className="tiny">Speaker</div>
                <div className="slider-line" />
              </div>
              <div>
                <div className="tiny">Microphone</div>
                <div className="slider-line" />
              </div>
            </div>
          </article>

          <article className="panel">
            <div className="panel-header">
              <div>
                <h2 className="panel-title">DTMF Keypad</h2>
                <p className="panel-subtitle">Available during active calls.</p>
              </div>
            </div>
            <div className="panel-body">
              <div className="keypad">
                {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map((digit) => (
                  <div className="digit" key={digit}>
                    {digit}
                  </div>
                ))}
              </div>
            </div>
          </article>
        </div>

        <div className="page-grid">
          <article className="panel">
            <div className="panel-header">
              <div>
                <h2 className="panel-title">Notes</h2>
                <p className="panel-subtitle">Live notes for the active call.</p>
              </div>
            </div>
            <div className="panel-body">
              <div className="muted-box">Add call notes here...</div>
            </div>
          </article>

          <article className="panel">
            <div className="panel-header">
              <div>
                <h2 className="panel-title">Contact Activity</h2>
                <p className="panel-subtitle">Calls, callbacks, appointments, and AI summaries.</p>
              </div>
            </div>
            <div className="panel-body">
              <div className="activity-list">
                {activity.map((item) => (
                  <div className="activity-item" key={item}>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </article>

          <article className="panel">
            <div className="panel-header">
              <div>
                <h2 className="panel-title">Predictive Dialer Rules</h2>
                <p className="panel-subtitle">Business logic from the product spec.</p>
              </div>
            </div>
            <div className="panel-body">
              <ol className="list">
                <li>No duplicate lead assignment across active agents.</li>
                <li>Sequential exhaustion before any recycle pass.</li>
                <li>Disposition-based retry timing after failure, callback, or voicemail.</li>
                <li>Campaign number rotation with local presence matching.</li>
                <li>Spam detection and number health factor into caller selection.</li>
              </ol>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
