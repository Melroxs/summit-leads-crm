import type { NextFunction, Request, Response } from "express";
import { supabaseAdmin } from "../lib/supabase.js";

export async function requireAuth(request: Request, response: Response, next: NextFunction) {
  const authorization = request.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return response.status(401).json({ message: "Missing bearer token" });
  }

  const accessToken = authorization.slice("Bearer ".length).trim();
  const userResult = await supabaseAdmin.auth.getUser(accessToken);

  if (userResult.error || !userResult.data.user) {
    return response.status(401).json({ message: "Invalid Supabase session token" });
  }

  const profileResult = await supabaseAdmin
    .from("profiles")
    .select("id, company_id, role, email")
    .eq("id", userResult.data.user.id)
    .single();

  if (profileResult.error || !profileResult.data) {
    return response.status(403).json({ message: "Profile not found for authenticated user" });
  }

  request.auth = {
    userId: profileResult.data.id,
    companyId: profileResult.data.company_id,
    role: profileResult.data.role,
    email: profileResult.data.email,
    accessToken
  };

  next();
}
