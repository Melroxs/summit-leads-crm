import { PageHeader } from "../../components/page-header";
import { getScorecards } from "../../lib/api";
import { requireSession } from "../../lib/auth";

export default async function ScoringPage() {
  await requireSession();
  const scorecards = await getScorecards().catch(() => []);

  return (
    <div className="page-grid">
      <PageHeader
        title="QA Scoring"
        subtitle="Post-call AI scores openings, compliance, rebuttals, and close quality for both live and training calls."
        rightSlot={<div className="pill">AI Scorecards</div>}
      />
      <section className="cards-grid">
        {scorecards.map((item) => (
          <article className="panel" key={item.id}>
            <div className="panel-body">
              <div className="badge-row">
                <span className="badge cyan">{item.callId}</span>
              </div>
              <h3>{Math.round((item.openingScore + item.complianceScore + item.rebuttalScore + item.closeScore) / 4)}/100</h3>
              <p>{item.notes.join(", ")}</p>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
