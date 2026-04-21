import { PageHeader } from "../../components/page-header";
import { getCampaigns } from "../../lib/api";
import { requireSession } from "../../lib/auth";

export default async function CampaignsPage() {
  await requireSession();
  const campaigns = await getCampaigns().catch(() => []);

  return (
    <div className="page-grid">
      <PageHeader
        title="Campaigns"
        subtitle="Each campaign controls its own leads, AI documents, phone numbers, scripts, and training behavior."
        rightSlot={<div className="pill">Add Campaign</div>}
      />

      <section className="cards-grid">
        {campaigns.map((campaign) => (
          <article className="panel" key={campaign.id}>
            <div className="panel-body">
              <div className="badge-row">
                <span className="badge cyan">{campaign.type}</span>
                <span className="badge purple">{campaign.dialerMode}</span>
              </div>
              <h3>{campaign.name}</h3>
              <p className="panel-subtitle">{campaign.region} campaign with AI behavior scoped by uploaded docs.</p>
              <div className="mini-grid" style={{ marginTop: 16 }}>
                <div className="info-card">
                  <h4>{campaign.documents.length}</h4>
                  <p>Documents</p>
                </div>
                <div className="info-card">
                  <h4>{campaign.callerIds.length}</h4>
                  <p>Campaign numbers</p>
                </div>
              </div>
              <div className="badge-row" style={{ marginTop: 16 }}>
                {campaign.documents.map((item) => (
                  <span className="badge" key={item.id}>
                    {item.name}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
