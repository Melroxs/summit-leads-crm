import { ApiError } from "../lib/errors.js";
import { supabaseAdmin } from "../lib/supabase.js";

export const profileRepository = {
  async getCurrentProfile(userId: string) {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("id, company_id, full_name, email, role")
      .eq("id", userId)
      .single();

    if (error || !data) {
      throw new ApiError(404, error?.message ?? "Profile not found");
    }

    return {
      id: data.id,
      companyId: data.company_id,
      fullName: data.full_name,
      email: data.email,
      role: data.role
    };
  }
};
