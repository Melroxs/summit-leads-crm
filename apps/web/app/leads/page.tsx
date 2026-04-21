import { PageHeader } from "../../components/page-header";
import { getCampaignLeads, getCampaigns } from "../../lib/api";
import { requireSession } from "../../lib/auth";

export default async function LeadsPage() {
  await requireSession();
  const campaigns = await getCampaigns().catch(() => []);
  const primaryCampaign = campaigns[0];
  const leads = primaryCampaign ? await getCampaignLeads(primaryCampaign.id).catch(() => []) : [];

  return (
    <div className="page-grid">
      <PageHeader
        title="Leads"
        subtitle="Bulk upload, lock ownership, and control retry windows without recycling the same lead too early."
        rightSlot={<div className="pill">CSV Import</div>}
      />
      <section className="panel">
        <div className="panel-header">
          <div>
            <h2 className="panel-title">Lead Ownership Table</h2>
            <p className="panel-subtitle">Ownership remains with the first-touch agent. Retry timing is disposition-based.</p>
          </div>
        </div>
        <div className="panel-body">
          <table className="data-table">
            <thead>
              <tr>
                <th>Lead</th>
                <th>Campaign</th>
                <th>Owner</th>
                <th>Disposition</th>
                <th>Next Dial</th>
                <th>Region</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td>
                    <strong>{lead.fullName}</strong>
                    <div className="tiny">{lead.phoneNumber}</div>
                  </td>
                  <td>{primaryCampaign?.name ?? "No campaign"}</td>
                  <td>{lead.assignedAgentId ?? "Unassigned"}</td>
                  <td>{lead.lastDisposition}</td>
                  <td>{lead.nextDialAt ?? "Ready now"}</td>
                  <td>{lead.state}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
