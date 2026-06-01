import { getMonthRange } from "@/lib/date-utils";
import { listAssets, sumAssets } from "@/lib/database/assets";
import { enrichGoal, type GoalWithMetrics } from "@/lib/calculations/goals";
import { listGoals } from "@/lib/database/goals";
import { listLiabilities, sumLiabilities } from "@/lib/database/liabilities";
import {
  groupByCategory,
  listTransactions,
  sumTransactions,
} from "@/lib/database/transactions";
import type { BreakdownItem } from "@/types";

export type ReportAggregate = {
  month: string;
  monthDate: string;
  incomeTotal: number;
  expenseTotal: number;
  balance: number;
  savingRate: number | null;
  incomeBreakdown: BreakdownItem[];
  expenseBreakdown: BreakdownItem[];
  netWorth: number;
  totalAssets: number;
  totalLiabilities: number;
  goals: GoalWithMetrics[];
};

export async function aggregateMonthlyReport(
  userId: string,
  month: string
): Promise<ReportAggregate> {
  const monthDate = `${month}-01`;

  const [assets, liabilities, incomeTx, expenseTx, goals] = await Promise.all([
    listAssets(userId),
    listLiabilities(userId),
    listTransactions(userId, { type: "income", month }),
    listTransactions(userId, { type: "expense", month }),
    listGoals(userId),
  ]);

  const totalAssets = sumAssets(assets);
  const totalLiabilities = sumLiabilities(liabilities);
  const incomeTotal = sumTransactions(incomeTx);
  const expenseTotal = sumTransactions(expenseTx);
  const balance = incomeTotal - expenseTotal;
  const savingRate =
    incomeTotal > 0 ? ((incomeTotal - expenseTotal) / incomeTotal) * 100 : null;

  return {
    month,
    monthDate,
    incomeTotal,
    expenseTotal,
    balance,
    savingRate,
    incomeBreakdown: groupByCategory(incomeTx),
    expenseBreakdown: groupByCategory(expenseTx),
    netWorth: totalAssets - totalLiabilities,
    totalAssets,
    totalLiabilities,
    goals: goals.map(enrichGoal),
  };
}

export function monthToDate(month: string): string {
  return `${month}-01`;
}

export { getMonthRange };
