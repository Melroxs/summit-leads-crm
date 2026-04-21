import type { UserRole } from "@crm/shared";

declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
        email: string;
        companyId: string;
        role: UserRole;
        accessToken: string;
      };
    }
  }
}

export {};

