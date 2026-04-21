import { mediaSessionStore } from "./media-session-store.js";

type CoachingHint = {
  text: string;
  priority: "low" | "medium" | "high";
};

function selectHint(frameCount: number): CoachingHint | undefined {
  if (frameCount > 0 && frameCount % 100 === 0) {
    return { text: "Ask a sharper discovery question now.", priority: "medium" };
  }

  if (frameCount > 0 && frameCount % 175 === 0) {
    return { text: "Price objection likely coming. Anchor value before discount talk.", priority: "high" };
  }

  return undefined;
}

export const coachingEngine = {
  handleMediaFrame(connectionId: string) {
    const session = mediaSessionStore.get(connectionId);
    if (!session) return undefined;

    session.framesReceived += 1;
    session.lastMediaAt = new Date().toISOString();

    return selectHint(session.framesReceived);
  }
};

