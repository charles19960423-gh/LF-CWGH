import { createClient } from "@/lib/supabase/server";
import { getMonthRange } from "@/lib/date-utils";
import { mapTransaction } from "@/lib/database/mappers";
import type { Transaction, TransactionType } from "@/types";

export async function listTransactions(
  userId: string,
  options: {
    type: TransactionType;
    month?: string;
    category?: string;
  }
): Promise<Transaction[]> {
  const supabase = await createClient();
  let query = supabase
    .from("transactions")
    .select("*")
    .eq("user_id", userId)
    .eq("type", options.type)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  if (options.month) {
    const { start, end } = getMonthRange(options.month);
    query = query.gte("date", start).lte("date", end);
  }

  if (options.category && options.category !== "all") {
    query = query.eq("category", options.category);
  }

  const { data, error } = await query;
  if (error) {
    if (error.code === "42501") {
      throw new Error(
        "数据库权限不足。请在 Supabase SQL Editor 执行 003_grant_permissions.sql"
      );
    }
    throw error;
  }
  return (data ?? []).map(mapTransaction);
}

export function sumTransactions(transactions: Transaction[]): number {
  return transactions.reduce((sum, t) => sum + t.amount, 0);
}

export function groupByCategory(
  transactions: Transaction[]
): { category: string; amount: number; percentage: number }[] {
  const total = sumTransactions(transactions);
  if (total === 0) return [];

  const map = new Map<string, number>();
  for (const t of transactions) {
    map.set(t.category, (map.get(t.category) ?? 0) + t.amount);
  }

  return [...map.entries()]
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: (amount / total) * 100,
    }))
    .sort((a, b) => b.amount - a.amount);
}
