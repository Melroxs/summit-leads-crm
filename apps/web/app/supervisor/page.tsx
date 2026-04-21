import { PageHeader } from "../../components/page-header";
import { supervisorEvents } from "../../lib/mock-data";

export default function SupervisorPage() {
  return (
    <div className="page-grid">
      <PageHeader
        title="Supervisor Panel"
        subtitle="Listen, whisper, or barge into live calls while keeping interventions visible in the audit trail."
        rightSlot={<div className="pill">Team Monitor</div>}
      />
      <section className="panel">
        <div className="panel-header">
          <div>
            <h2 className="panel-title">Live Interventions</h2>
            <p className="panel-subtitle">Managers can monitor all active calls in real time.</p>
          </div>
        </div>
        <div className="panel-body">
          <table className="data-table">
            <thead>
              <tr>
                <th>Agent</th>
                <th>Mode</th>
                <th>Campaign</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {supervisorEvents.map((event) => (
                <tr key={`${event.agent}-${event.mode}`}>
                  <td>{event.agent}</td>
                  <td><span className="badge amber">{event.mode}</span></td>
                  <td>{event.campaign}</td>
                  <td>{event.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

