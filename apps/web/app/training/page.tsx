import { PageHeader } from "../../components/page-header";
import { getTrainingScenarios } from "../../lib/api";
import { requireSession } from "../../lib/auth";

const coachingFlow = [
  "Live call audio stream",
  "Realtime transcription",
  "Campaign-aware AI reasoning",
  "Private whisper TTS to agent",
  "Post-call summary and QA score"
];

export default async function TrainingPage() {
  await requireSession();
  const trainingScenarios = await getTrainingScenarios().catch(() => []);

  return (
    <div className="page-grid">
      <PageHeader
        title="AI Training"
        subtitle="Voice-based sales simulation with campaign-specific personas, QA scoring, and live whisper coaching."
        rightSlot={<div className="pill">Voice Roleplay</div>}
      />

      <section className="split">
        <article className="panel">
          <div className="panel-header">
            <div>
              <h2 className="panel-title">Scenario Library</h2>
              <p className="panel-subtitle">Training scenarios adapt to the selected campaign.</p>
            </div>
          </div>
          <div className="panel-body">
            <div className="cards-grid">
              {trainingScenarios.map((scenario) => (
                <div className="info-card" key={scenario.id}>
                  <div className="badge-row">
                    <span className="badge cyan">{scenario.campaignId}</span>
                    <span className="badge green">{scenario.liveCoachingEnabled ? "Whisper enabled" : "Whisper off"}</span>
                  </div>
                  <h4 style={{ marginTop: 12 }}>{scenario.name}</h4>
                  <p>{scenario.objective}</p>
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className="panel">
          <div className="panel-header">
            <div>
              <h2 className="panel-title">Voice Coaching Pipeline</h2>
              <p className="panel-subtitle">This module is explicitly voice-first and blocks text-only roleplay.</p>
            </div>
          </div>
          <div className="panel-body">
            <ol className="list">
              {coachingFlow.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <div className="callout" style={{ marginTop: 16 }}>
              Example whisper prompts: “Ask about roof age”, “Handle price objection”, “Close now”.
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
