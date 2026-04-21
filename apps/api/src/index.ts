import { createServer } from "http";
import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import authRouter from "./routes/auth.js";
import campaignsRouter from "./routes/campaigns.js";
import dialerRouter from "./routes/dialer.js";
import recordingsRouter from "./routes/recordings.js";
import scoringRouter from "./routes/scoring.js";
import settingsRouter from "./routes/settings.js";
import telnyxRouter from "./routes/telnyx.js";
import trainingRouter from "./routes/training.js";
import { ApiError } from "./lib/errors.js";
import { requireAuth } from "./middleware/auth.js";
import { attachMediaGateway } from "./realtime/media-gateway.js";

const app = express();
const server = createServer(app);

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "crm-api",
    voiceRoleplayMode: "enabled",
    timestamp: new Date().toISOString()
  });
});

app.use("/api/telnyx", telnyxRouter);
app.use("/api/auth", requireAuth, authRouter);
app.use("/api/campaigns", requireAuth, campaignsRouter);
app.use("/api/dialer", requireAuth, dialerRouter);
app.use("/api/recordings", requireAuth, recordingsRouter);
app.use("/api/scoring", requireAuth, scoringRouter);
app.use("/api/training", requireAuth, trainingRouter);
app.use("/api/settings", requireAuth, settingsRouter);

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  if (error instanceof Error) {
    return res.status(500).json({ message: error.message });
  }

  return res.status(500).json({ message: "Unexpected server error" });
});

attachMediaGateway(server);

server.listen(env.port, () => {
  console.log(`CRM API listening on http://localhost:${env.port}`);
});
