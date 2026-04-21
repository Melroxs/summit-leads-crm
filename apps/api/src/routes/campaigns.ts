import { Router } from "express";
import { z } from "zod";
import { requireAuthContext } from "../lib/tenant.js";
import { campaignRepository } from "../repositories/campaign-repository.js";
import { leadRepository } from "../repositories/lead-repository.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const auth = requireAuthContext(req);
    res.json(await campaignRepository.list(auth.companyId));
  } catch (error) {
    next(error);
  }
});

router.post("/:campaignId/documents", async (req, res, next) => {
  try {
    const auth = requireAuthContext(req);
    const params = z.object({ campaignId: z.string() }).parse(req.params);
    const body = z.object({
      id: z.string(),
      name: z.string(),
      category: z.enum(["script", "company_info", "rebuttal", "offer", "qa"]),
      url: z.string()
    }).parse(req.body);

    const updated = await campaignRepository.addDocument(auth.companyId, params.campaignId, body);
    if (!updated) return res.status(404).json({ message: "Campaign not found" });
    return res.json(updated);
  } catch (error) {
    next(error);
  }
});

router.post("/:campaignId/caller-ids", async (req, res, next) => {
  try {
    const auth = requireAuthContext(req);
    const params = z.object({ campaignId: z.string() }).parse(req.params);
    const body = z.array(z.object({
      id: z.string(),
      label: z.string(),
      phoneNumber: z.string(),
      region: z.string(),
      healthScore: z.number(),
      spamRiskScore: z.number()
    })).parse(req.body);

    const updated = await campaignRepository.addCallerIds(auth.companyId, params.campaignId, body);
    if (!updated) return res.status(404).json({ message: "Campaign not found" });
    return res.json(updated);
  } catch (error) {
    next(error);
  }
});

router.get("/:campaignId/leads", async (req, res, next) => {
  try {
    const auth = requireAuthContext(req);
    const params = z.object({ campaignId: z.string() }).parse(req.params);
    res.json(await leadRepository.listByCampaign(auth.companyId, params.campaignId));
  } catch (error) {
    next(error);
  }
});

router.post("/:campaignId/leads/upload", async (req, res, next) => {
  try {
    const auth = requireAuthContext(req);
    const params = z.object({ campaignId: z.string() }).parse(req.params);
    const body = z.array(z.object({
      fullName: z.string(),
      phoneNumber: z.string(),
      state: z.string(),
      postalCode: z.string()
    })).parse(req.body);

    res.status(201).json(await leadRepository.bulkUpload(auth.companyId, params.campaignId, body));
  } catch (error) {
    next(error);
  }
});

router.delete("/:campaignId/leads", async (req, res, next) => {
  try {
    const auth = requireAuthContext(req);
    const params = z.object({ campaignId: z.string() }).parse(req.params);
    res.json({
      deleted: await leadRepository.bulkDeleteCampaignList(auth.companyId, params.campaignId)
    });
  } catch (error) {
    next(error);
  }
});

export default router;
