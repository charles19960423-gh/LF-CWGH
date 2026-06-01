"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { withAuth, type ActionResult } from "@/lib/actions/utils";
import { parseGoalForm } from "@/lib/validators/goal";
import type { Goal } from "@/types";

function revalidateGoalPaths() {
  revalidatePath("/goals");
  revalidatePath("/");
}

export async function createGoal(
  _prev: ActionResult<Goal> | null,
  formData: FormData
): Promise<ActionResult<Goal>> {
  const parsed = parseGoalForm(formData, true);
  if (!parsed.success) {
    return { success: false, error: parsed.error };
  }

  return withAuth(async (userId) => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("goals")
      .insert({
        user_id: userId,
        ...parsed.data,
        current_amount: parsed.data.current_amount ?? 0,
      })
      .select()
      .single();

    if (error) {
      const msg =
        error.code === "42501"
          ? "数据库权限不足，请在 Supabase 执行 003_grant_permissions.sql"
          : error.message;
      throw new Error(msg);
    }
    revalidateGoalPaths();
    return data;
  });
}

export async function updateGoal(
  id: string,
  _prev: ActionResult<Goal> | null,
  formData: FormData
): Promise<ActionResult<Goal>> {
  const parsed = parseGoalForm(formData, false);
  if (!parsed.success) {
    return { success: false, error: parsed.error };
  }

  return withAuth(async (userId) => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("goals")
      .update(parsed.data)
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      const msg =
        error.code === "42501"
          ? "数据库权限不足，请在 Supabase 执行 003_grant_permissions.sql"
          : error.message;
      throw new Error(msg);
    }
    revalidateGoalPaths();
    return data;
  });
}

export async function deleteGoal(id: string): Promise<ActionResult> {
  return withAuth(async (userId) => {
    const supabase = await createClient();
    const { error } = await supabase
      .from("goals")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      const msg =
        error.code === "42501"
          ? "数据库权限不足，请在 Supabase 执行 003_grant_permissions.sql"
          : error.message;
      throw new Error(msg);
    }
    revalidateGoalPaths();
  });
}
