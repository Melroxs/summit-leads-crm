import type { TelephonyAccount } from "@crm/shared";
import { ApiError } from "../lib/errors.js";
import { supabaseAdmin } from "../lib/supabase.js";

type TelephonyRow = {
  id: string;
  company_id: string;
  provider: TelephonyAccount["provider"];
  label: string;
  active: boolean;
};

function mapTelephony(row: TelephonyRow): TelephonyAccount {
  return {
    id: row.id,
    companyId: row.company_id,
    provider: row.provider,
    label: row.label,
    active: row.active
  };
}

export const telephonyRepository = {
  async list(companyId: string) {
    const { data, error } = await supabaseAdmin
      .from("telephony_accounts")
      .select("id, company_id, provider, label, active")
      .eq("company_id", companyId)
      .order("label", { ascending: true });

    if (error) {
      throw new ApiError(500, error.message);
    }

    return (data ?? []).map((row) => mapTelephony(row as TelephonyRow));
  }
};

