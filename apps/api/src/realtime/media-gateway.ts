import { randomUUID } from "crypto";
import type { Server as HttpServer } from "http";
import { WebSocketServer } from "ws";
import { coachingEngine } from "./coaching-engine.js";
import { mediaSessionStore } from "./media-session-store.js";

type TelnyxStreamMessage =
  | { event: "connected"; version?: string }
  | {
      event: "start";
      start?: {
        call_control_id?: string;
        call_session_id?: string;
        stream_id?: string;
        custom_parameters?: Record<string, string>;
      };
    }
  | { event: "media"; media?: { payload?: string; track?: string; chunk?: string; timestamp?: string } }
  | { event: "stop" }
  | { event: string; [key: string]: unknown };

export function attachMediaGateway(server: HttpServer) {
  const wss = new WebSocketServer({ server, path: "/media-stream" });

  wss.on("connection", (socket) => {
    const connectionId = randomUUID();
    mediaSessionStore.create(connectionId, socket);

    socket.on("message", (raw) => {
      try {
        const message = JSON.parse(raw.toString()) as TelnyxStreamMessage;

        if (message.event === "start") {
          const start = message.start as {
            call_control_id?: string;
            call_session_id?: string;
            stream_id?: string;
            custom_parameters?: Record<string, string>;
          } | undefined;

          mediaSessionStore.update(connectionId, {
            callControlId: start?.call_control_id,
            callSessionId: start?.call_session_id,
            streamId: start?.stream_id,
            agentId: start?.custom_parameters?.agent_id,
            campaignId: start?.custom_parameters?.campaign_id
          });
          return;
        }

        if (message.event === "media") {
          const hint = coachingEngine.handleMediaFrame(connectionId);

          if (hint) {
            socket.send(JSON.stringify({
              event: "coach",
              coach: {
                text: hint.text,
                priority: hint.priority
              }
            }));
          }

          return;
        }

        if (message.event === "stop") {
          mediaSessionStore.delete(connectionId);
        }
      } catch (error) {
        socket.send(JSON.stringify({
          event: "error",
          message: error instanceof Error ? error.message : "Failed to process media frame"
        }));
      }
    });

    socket.on("close", () => {
      mediaSessionStore.delete(connectionId);
    });
  });

  return wss;
}
