import { Router } from "express";
import { z } from "zod";
import { requireAuthContext } from "../lib/tenant.js";
import { recordingRepository } from "../repositories/recording-repository.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const auth = requireAuthContext(req);
    const query = z.object({
      campaignId: z.string().optional(),
      agentId: z.string().optional(),
      type: z.enum(["real_call", "training"]).optional()
    }).parse(req.query);

    res.json(await recordingRepository.list(auth.companyId, query));
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const auth = requireAuthContext(req);
    const body = z.object({
      id: z.string(),
      callId: z.string(),
      type: z.enum(["real_call", "training"]),
      campaignId: z.string(),
      agentId: z.string(),
      leadId: z.string().optional(),
      durationSeconds: z.number(),
      streamUrl: z.string(),
      downloadUrl: z.string(),
      createdAt: z.string()
    }).parse(req.body);

    res.status(201).json(await recordingRepository.create(auth.companyId, body));
  } catch (error) {
    next(error);
  }
});

export default router;
