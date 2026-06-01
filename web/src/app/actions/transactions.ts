"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { withAuth, type ActionResult } from "@/lib/actions/utils";
import { parseTransactionForm } from "@/lib/validators/transaction";
import type { Transaction, TransactionType } from "@/types";

function revalidateTransactionPaths(type: TransactionType) {
  revalidatePath(type === "income" ? "/income" : "/expense");
}

export async function createTransaction(
  type: TransactionType,
  _prev: ActionResult<Transaction> | null,
  formData: FormData
): Promise<ActionResult<Transaction>> {
  const parsed = parseTransactionForm(formData, type);
  if (!parsed.success) {
    return { success: false, error: parsed.error };
  }

  return withAuth(async (userId) => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("transactions")
      .insert({
        user_id: userId,
        type,
        ...parsed.data,
        account: parsed.data.account ?? null,
        note: parsed.data.note ?? null,
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
    revalidateTransactionPaths(type);
    return data;
  });
}

export async function updateTransaction(
  type: TransactionType,
  id: string,
  _prev: ActionResult<Transaction> | null,
  formData: FormData
): Promise<ActionResult<Transaction>> {
  const parsed = parseTransactionForm(formData, type);
  if (!parsed.success) {
    return { success: false, error: parsed.error };
  }

  return withAuth(async (userId) => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("transactions")
      .update({
        ...parsed.data,
        account: parsed.data.account ?? null,
        note: parsed.data.note ?? null,
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
    revalidateTransactionPaths(type);
    return data;
  });
}

export async function deleteTransaction(
  type: TransactionType,
  id: string
): Promise<ActionResult> {
  return withAuth(async (userId) => {
    const supabase = await createClient();
    const { error } = await supabase
      .from("transactions")
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
    revalidateTransactionPaths(type);
  });
}
