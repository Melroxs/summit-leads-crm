import { Router } from "express";
import { requireAuthContext } from "../lib/tenant.js";
import { profileRepository } from "../repositories/profile-repository.js";

const router = Router();

router.get("/me", async (req, res, next) => {
  try {
    const auth = requireAuthContext(req);
    res.json(await profileRepository.getCurrentProfile(auth.userId));
  } catch (error) {
    next(error);
  }
});

export default router;

