import { Router } from "express";
import { z } from "zod";
import { requireAuthContext } from "../lib/tenant.js";
import { dialerService } from "../services/dialer-service.js";
import { telnyxService } from "../services/telnyx-service.js";

const router = Router();

router.get("/:campaignId/summary", async (req, res, next) => {
  try {
    const auth = requireAuthContext(req);
    const params = z.object({ campaignId: z.string() }).parse(req.params);
    res.json(await dialerService.getDialerSummary(auth.companyId, params.campaignId));
  } catch (error) {
    next(error);
  }
});

router.post("/:campaignId/next-lead", async (req, res, next) => {
  try {
    const auth = requireAuthContext(req);
    const params = z.object({ campaignId: z.string() }).parse(req.params);
    const body = z.object({ agentId: z.string() }).parse(req.body);
    res.json(await dialerService.getNextLead(auth.companyId, params.campaignId, body.agentId));
  } catch (error) {
    next(error);
  }
});

router.post("/complete-call", async (req, res, next) => {
  try {
    const auth = requireAuthContext(req);
    const body = z.object({
      leadId: z.string(),
      disposition: z.enum([
        "new",
        "in_progress",
        "connected",
        "voicemail",
        "callback",
        "not_interested",
        "sale",
        "dropped",
        "failed"
      ])
    }).parse(req.body);

    res.json(await dialerService.completeCall(auth.companyId, body));
  } catch (error) {
    next(error);
  }
});

router.post("/:campaignId/realtime-payload", async (req, res, next) => {
  try {
    const auth = requireAuthContext(req);
    const params = z.object({ campaignId: z.string() }).parse(req.params);
    const body = z.object({
      agentId: z.string(),
      lead: z.object({
        id: z.string(),
        campaignId: z.string(),
        fullName: z.string(),
        phoneNumber: z.string(),
        state: z.string(),
        postalCode: z.string(),
        assignedAgentId: z.string().optional(),
        lastDisposition: z.enum([
          "new",
          "in_progress",
          "connected",
          "voicemail",
          "callback",
          "not_interested",
          "sale",
          "dropped",
          "failed"
        ]),
        attempts: z.number(),
        nextDialAt: z.string().optional(),
        position: z.number()
      })
    }).parse(req.body);

    res.json(await telnyxService.buildRealTimeVoiceStreamPayload(auth.companyId, {
      campaignId: params.campaignId,
      agentId: body.agentId,
      lead: body.lead
    }));
  } catch (error) {
    next(error);
  }
});

export default router;
