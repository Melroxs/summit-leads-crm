import { Router } from "express";
import { z } from "zod";
import { requireAuthContext } from "../lib/tenant.js";
import { trainingService } from "../services/training-service.js";

const router = Router();

router.get("/scenarios", async (req, res, next) => {
  try {
    const auth = requireAuthContext(req);
    res.json(await trainingService.list(auth.companyId));
  } catch (error) {
    next(error);
  }
});

router.post("/voice-session", async (req, res, next) => {
  try {
    const auth = requireAuthContext(req);
    const body = z.object({
      campaignId: z.string(),
      scenarioId: z.string()
    }).parse(req.body);

    const session = await trainingService.buildVoiceSessionPrompt(auth.companyId, body.campaignId, body.scenarioId);
    if (!session) return res.status(404).json({ message: "Campaign or scenario not found" });
    return res.json(session);
  } catch (error) {
    next(error);
  }
});

export default router;
