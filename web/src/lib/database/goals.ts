import { createClient } from "@/lib/supabase/server";
import { mapGoal } from "@/lib/database/mappers";
import type { Goal } from "@/types";

function handleDbError(error: { code?: string; message: string }) {
  if (error.code === "42501") {
    throw new Error(
      "数据库权限不足。请在 Supabase SQL Editor 执行 003_grant_permissions.sql"
    );
  }
  throw error;
}

export async function listGoals(userId: string): Promise<Goal[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) handleDbError(error);
  return (data ?? []).map(mapGoal);
}
