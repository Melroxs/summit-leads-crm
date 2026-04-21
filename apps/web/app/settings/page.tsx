import { PageHeader } from "../../components/page-header";
import { getTelephonyAccounts } from "../../lib/api";
import { requireSession } from "../../lib/auth";

export default async function SettingsPage() {
  await requireSession();
  const telephonyProviders = await getTelephonyAccounts().catch(() => []);

  return (
    <div className="page-grid">
      <PageHeader
        title="Settings"
        subtitle="Configure telephony providers, intelligence layers, general settings, and dialer behavior."
        rightSlot={<div className="pill">Add Provider</div>}
      />

      <section className="three-up">
        <article className="panel">
          <div className="panel-header">
            <div>
              <h2 className="panel-title">Telephony Providers</h2>
              <p className="panel-subtitle">Campaign-aware provider configuration.</p>
            </div>
          </div>
          <div className="panel-body">
            {telephonyProviders.map((provider) => (
              <div className="info-card" key={provider.id} style={{ marginBottom: 12 }}>
                <div className="badge-row">
                  <span className="badge cyan">{provider.provider}</span>
                  <span className="badge green">{provider.active ? "Active" : "Inactive"}</span>
                </div>
                <p style={{ marginTop: 10 }}>{provider.label}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="panel-header">
            <div>
              <h2 className="panel-title">Intelligence</h2>
              <p className="panel-subtitle">Campaign-trained AI behavior and QA scoring settings.</p>
            </div>
          </div>
          <div className="panel-body">
            <div className="info-card">
              <h4>Realtime AI</h4>
              <p>Whisper coaching, transcript monitoring, objection detection, next-best prompt.</p>
            </div>
            <div className="info-card" style={{ marginTop: 12 }}>
              <h4>Post Call AI</h4>
              <p>Summary, outcome, score, coaching feedback, and follow-up action generation.</p>
            </div>
          </div>
        </article>

        <article className="panel">
          <div className="panel-header">
            <div>
              <h2 className="panel-title">Dialer Rules</h2>
              <p className="panel-subtitle">No duplicates, ownership locking, local presence, and number health.</p>
            </div>
          </div>
          <div className="panel-body">
            <ol className="list">
              <li>One lead, one owner.</li>
              <li>Sequential exhaustion before recycle.</li>
              <li>Disposition-driven retries only.</li>
              <li>Geo-matched outbound number preferred.</li>
              <li>Spam score influences number rotation.</li>
            </ol>
          </div>
        </article>
      </section>
    </div>
  );
}
