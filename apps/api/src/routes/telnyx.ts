import { Router } from "express";
import { z } from "zod";
import { requireAuthContext } from "../lib/tenant.js";
import { requireAuth } from "../middleware/auth.js";
import { telnyxService } from "../services/telnyx-service.js";

const router = Router();

router.post("/events", (req, res) => {
  res.json({
    received: true,
    message: "Store call state updates here, including lead touch timestamps and ownership preservation.",
    event: req.body
  });
});

router.post("/stream", (req, res) => {
  res.json({
    received: true,
    message: "Process realtime media frames here for AI coaching and simulation audio.",
    event: req.body
  });
});

router.post("/recordings", (req, res) => {
  res.json({
    received: true,
    message: "Store Telnyx recording metadata here and map it into the CRM recordings screen.",
    event: req.body
  });
});

router.post("/outbound-session", requireAuth, async (req, res, next) => {
  try {
    const auth = requireAuthContext(req);
    const body = z.object({
      campaignId: z.string(),
      agentId: z.string(),
      leadId: z.string()
    }).parse(req.body);

    res.json(await telnyxService.createOutboundCallSession(auth.companyId, body));
  } catch (error) {
    next(error);
  }
});

router.post("/coach/whisper", requireAuth, async (req, res, next) => {
  try {
    const auth = requireAuthContext(req);
    const body = z.object({
      callControlId: z.string(),
      message: z.string(),
      voice: z.string().default("alloy")
    }).parse(req.body);

    res.json(await telnyxService.injectWhisperCoaching(auth.companyId, body));
  } catch (error) {
    next(error);
  }
});

export default router;
