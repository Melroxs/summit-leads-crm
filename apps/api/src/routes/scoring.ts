import { Router } from "express";
import { z } from "zod";
import { requireAuthContext } from "../lib/tenant.js";
import { scorecardRepository } from "../repositories/scorecard-repository.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const auth = requireAuthContext(req);
    const query = z.object({
      campaignId: z.string().optional()
    }).parse(req.query);

    res.json(await scorecardRepository.list(auth.companyId, query.campaignId));
  } catch (error) {
    next(error);
  }
});

export default router;
