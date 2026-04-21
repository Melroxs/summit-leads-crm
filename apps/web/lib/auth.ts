import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "./supabase-server";

export async function requireSession() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getSession();

  if (!data.session) {
    redirect("/login");
  }

  return data.session;
}

