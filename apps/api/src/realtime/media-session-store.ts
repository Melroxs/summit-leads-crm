type MediaSession = {
  callControlId?: string;
  callSessionId?: string;
  streamId?: string;
  agentId?: string;
  campaignId?: string;
  connectedAt: string;
  lastMediaAt?: string;
  framesReceived: number;
  websocket: import("ws").WebSocket;
};

const sessions = new Map<string, MediaSession>();

export const mediaSessionStore = {
  create(id: string, websocket: import("ws").WebSocket) {
    const session: MediaSession = {
      connectedAt: new Date().toISOString(),
      framesReceived: 0,
      websocket
    };

    sessions.set(id, session);
    return session;
  },

  update(id: string, patch: Partial<MediaSession>) {
    const session = sessions.get(id);
    if (!session) return undefined;
    Object.assign(session, patch);
    return session;
  },

  get(id: string) {
    return sessions.get(id);
  },

  delete(id: string) {
    sessions.delete(id);
  },

  list() {
    return [...sessions.values()];
  }
};

