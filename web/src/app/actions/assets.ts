"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { withAuth, type ActionResult } from "@/lib/actions/utils";
import { parseAssetForm } from "@/lib/validators/asset";
import type { Asset } from "@/types";

export async function createAsset(
  _prev: ActionResult<Asset> | null,
  formData: FormData
): Promise<ActionResult<Asset>> {
  const parsed = parseAssetForm(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error };
  }

  return withAuth(async (userId) => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("assets")
      .insert({ user_id: userId, ...parsed.data })
      .select()
      .single();

    if (error) {
      const msg =
        error.code === "42501"
          ? "数据库权限不足，请在 Supabase 执行 003_grant_permissions.sql"
          : error.message;
      throw new Error(msg);
    }
    revalidatePath("/assets");
    return data;
  });
}

export async function updateAsset(
  id: string,
  _prev: ActionResult<Asset> | null,
  formData: FormData
): Promise<ActionResult<Asset>> {
  const parsed = parseAssetForm(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error };
  }

  return withAuth(async (userId) => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("assets")
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
    revalidatePath("/assets");
    return data;
  });
}

export async function deleteAsset(id: string): Promise<ActionResult> {
  return withAuth(async (userId) => {
    const supabase = await createClient();
    const { error } = await supabase
      .from("assets")
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
    revalidatePath("/assets");
  });
}
