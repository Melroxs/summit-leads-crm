import type { Request } from "express";
import { ApiError } from "./errors.js";

export function requireAuthContext(request: Request) {
  if (!request.auth) {
    throw new ApiError(401, "Missing authenticated tenant context");
  }

  return request.auth;
}

