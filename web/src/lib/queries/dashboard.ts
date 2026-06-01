import { format, subMonths } from "date-fns";
import { listAssets, sumAssets } from "@/lib/database/assets";
import { enrichGoal, type GoalWithMetrics } from "@/lib/calculations/goals";
import { listGoals } from "@/lib/database/goals";
import { listLiabilities, sumLiabilities } from "@/lib/database/liabilities";
import {
  listTransactions,
  sumTransactions,
} from "@/lib/database/transactions";
import { createClient } from "@/lib/supabase/server";
import { getCurrentMonth, getMonthRange, formatMonthLabel } from "@/lib/date-utils";
import { mapTransaction } from "@/lib/database/mappers";

export type DashboardStats = {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  monthlyIncome: number;
  monthlyExpense: number;
  savingRate: number | null;
  hasFinancialData: boolean;
  goals: GoalWithMetrics[];
};

export type TrendPoint = {
  month: string;
  label: string;
  income: number;
  expense: number;
  netWorth: number;
};

export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  const month = getCurrentMonth();

  const [assets, liabilities, incomeTx, expenseTx, goals] = await Promise.all([
    listAssets(userId),
    listLiabilities(userId),
    listTransactions(userId, { type: "income", month }),
    listTransactions(userId, { type: "expense", month }),
    listGoals(userId),
  ]);

  const totalAssets = sumAssets(assets);
  const totalLiabilities = sumLiabilities(liabilities);
  const netWorth = totalAssets - totalLiabilities;
  const monthlyIncome = sumTransactions(incomeTx);
  const monthlyExpense = sumTransactions(expenseTx);

  const savingRate =
    monthlyIncome > 0
      ? ((monthlyIncome - monthlyExpense) / monthlyIncome) * 100
      : null;

  const enrichedGoals = goals.map(enrichGoal).slice(0, 3);

  return {
    totalAssets,
    totalLiabilities,
    netWorth,
    monthlyIncome,
    monthlyExpense,
    savingRate,
    hasFinancialData: totalAssets > 0 || totalLiabilities > 0,
    goals: enrichedGoals,
  };
}

export async function getTrendData(
  userId: string,
  monthCount = 6
): Promise<TrendPoint[]> {
  const assets = await listAssets(userId);
  const liabilities = await listLiabilities(userId);
  const currentNetWorth = sumAssets(assets) - sumLiabilities(liabilities);

  const months = Array.from({ length: monthCount }, (_, i) =>
    format(subMonths(new Date(), monthCount - 1 - i), "yyyy-MM")
  );

  const oldestMonth = months[0];
  const { start } = getMonthRange(oldestMonth);

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", userId)
    .gte("date", start)
    .order("date", { ascending: true });

  if (error) {
    if (error.code === "42501") {
      throw new Error(
        "数据库权限不足。请在 Supabase SQL Editor 执行 003_grant_permissions.sql"
      );
    }
    throw error;
  }

  const transactions = (data ?? []).map(mapTransaction);

  const monthlySavings = new Map<string, number>();
  for (const month of months) {
    monthlySavings.set(month, 0);
  }

  for (const tx of transactions) {
    const month = tx.date.slice(0, 7);
    if (!monthlySavings.has(month)) continue;
    const delta = tx.type === "income" ? tx.amount : -tx.amount;
    monthlySavings.set(month, (monthlySavings.get(month) ?? 0) + delta);
  }

  const monthlyIncome = new Map<string, number>();
  const monthlyExpense = new Map<string, number>();
  for (const month of months) {
    monthlyIncome.set(month, 0);
    monthlyExpense.set(month, 0);
  }
  for (const tx of transactions) {
    const month = tx.date.slice(0, 7);
    if (tx.type === "income" && monthlyIncome.has(month)) {
      monthlyIncome.set(month, (monthlyIncome.get(month) ?? 0) + tx.amount);
    }
    if (tx.type === "expense" && monthlyExpense.has(month)) {
      monthlyExpense.set(month, (monthlyExpense.get(month) ?? 0) + tx.amount);
    }
  }

  let savingsAfter = 0;
  const netWorthByMonth = new Map<string, number>();

  for (let i = months.length - 1; i >= 0; i--) {
    const month = months[i];
    netWorthByMonth.set(month, currentNetWorth - savingsAfter);
    savingsAfter += monthlySavings.get(month) ?? 0;
  }

  return months.map((month) => ({
    month,
    label: formatMonthLabel(month).replace(/年(\d+)月/, (_, m) => `${m}月`),
    income: monthlyIncome.get(month) ?? 0,
    expense: monthlyExpense.get(month) ?? 0,
    netWorth: netWorthByMonth.get(month) ?? currentNetWorth,
  }));
}

export async function getAllGoalsWithMetrics(
  userId: string
): Promise<GoalWithMetrics[]> {
  const goals = await listGoals(userId);
  return goals.map(enrichGoal);
}
