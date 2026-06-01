"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { withAuth, type ActionResult } from "@/lib/actions/utils";
import { parseLiabilityForm } from "@/lib/validators/liability";
import type { Liability } from "@/types";

export async function createLiability(
  _prev: ActionResult<Liability> | null,
  formData: FormData
): Promise<ActionResult<Liability>> {
  const parsed = parseLiabilityForm(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error };
  }

  return withAuth(async (userId) => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("liabilities")
      .insert({
        user_id: userId,
        name: parsed.data.name,
        type: parsed.data.type,
        amount: parsed.data.amount,
        interest_rate: parsed.data.interest_rate,
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
    revalidatePath("/liabilities");
    return data;
  });
}

export async function updateLiability(
  id: string,
  _prev: ActionResult<Liability> | null,
  formData: FormData
): Promise<ActionResult<Liability>> {
  const parsed = parseLiabilityForm(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error };
  }

  return withAuth(async (userId) => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("liabilities")
      .update({
        name: parsed.data.name,
        type: parsed.data.type,
        amount: parsed.data.amount,
        interest_rate: parsed.data.interest_rate,
      })
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
    revalidatePath("/liabilities");
    return data;
  });
}

export async function deleteLiability(id: string): Promise<ActionResult> {
  return withAuth(async (userId) => {
    const supabase = await createClient();
    const { error } = await supabase
      .from("liabilities")
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
    revalidatePath("/liabilities");
  });
}
