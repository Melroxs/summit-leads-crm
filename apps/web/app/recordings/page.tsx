import { PageHeader } from "../../components/page-header";
import { getRecordings } from "../../lib/api";
import { requireSession } from "../../lib/auth";

export default async function RecordingsPage() {
  await requireSession();
  const recordings = await getRecordings().catch(() => []);

  return (
    <div className="page-grid">
      <PageHeader
        title="Recordings"
        subtitle="Review all real and simulated calls inside the CRM, then stream or download them for QA and coaching."
        rightSlot={<div className="pill">Filter by agent</div>}
      />
      <section className="panel">
        <div className="panel-header">
          <div>
            <h2 className="panel-title">Recording Library</h2>
            <p className="panel-subtitle">Filter by agent, campaign, date, or call type.</p>
          </div>
        </div>
        <div className="panel-body">
          <table className="data-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Agent</th>
                <th>Campaign</th>
                <th>Date</th>
                <th>Duration</th>
                <th>Download</th>
              </tr>
            </thead>
            <tbody>
              {recordings.map((recording) => (
                <tr key={recording.id}>
                  <td>{recording.type}</td>
                  <td>{recording.agentId}</td>
                  <td>{recording.campaignId}</td>
                  <td>{recording.createdAt}</td>
                  <td>{recording.durationSeconds}s</td>
                  <td>
                    <span className="badge green">{recording.downloadUrl ? "Enabled" : "Missing"}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
