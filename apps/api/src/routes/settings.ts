import { Router } from "express";
import { requireAuthContext } from "../lib/tenant.js";
import { telephonyRepository } from "../repositories/telephony-repository.js";

const router = Router();

router.get("/telephony", async (req, res, next) => {
  try {
    const auth = requireAuthContext(req);
    res.json(await telephonyRepository.list(auth.companyId));
  } catch (error) {
    next(error);
  }
});

export default router;
