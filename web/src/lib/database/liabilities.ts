import { createClient } from "@/lib/supabase/server";
import { mapLiability } from "@/lib/database/mappers";
import type { Liability } from "@/types";

export async function listLiabilities(userId: string): Promise<Liability[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("liabilities")
    .select("*")
    .eq("user_id", userId)
    .order("amount", { ascending: false });

  if (error) {
    if (error.code === "42501") {
      throw new Error(
        "数据库权限不足。请在 Supabase SQL Editor 执行 003_grant_permissions.sql"
      );
    }
    throw error;
  }
  return (data ?? []).map(mapLiability);
}

export function sumLiabilities(liabilities: Liability[]): number {
  return liabilities.reduce((sum, l) => sum + l.amount, 0);
}
