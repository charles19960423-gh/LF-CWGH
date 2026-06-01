import type { GoalWithMetrics } from "@/lib/calculations/goals";
import { formatCurrency, formatPercent } from "@/lib/format";

export type GoalPlanInput = {
  goal: GoalWithMetrics;
  monthlyIncome: number;
  monthlyExpense: number;
};

export type GoalPlanResult = {
  goalName: string;
  monthlySaving: number;
  requiredSavingRate: number | null;
  feasibility: "high" | "medium" | "low";
  advice: string;
};

export function planGoalPath(input: GoalPlanInput): GoalPlanResult {
  const { goal, monthlyIncome } = input;
  const monthlySaving = goal.monthlySaving;
  const requiredSavingRate =
    monthlyIncome > 0 ? (monthlySaving / monthlyIncome) * 100 : null;

  let feasibility: GoalPlanResult["feasibility"] = "medium";
  let advice = "保持当前储蓄节奏，定期更新目标进度。";

  if (goal.status === "achieved") {
    return {
      goalName: goal.name,
      monthlySaving: 0,
      requiredSavingRate: 0,
      feasibility: "high",
      advice: "目标已达成，可将余力投入下一个目标。",
    };
  }

  if (requiredSavingRate === null) {
    advice = "先录入本月收入，才能评估目标路径是否可行。";
    feasibility = "low";
  } else if (requiredSavingRate <= 30) {
    feasibility = "high";
    advice = `每月存 ${formatCurrency(monthlySaving)} 即可，所需储蓄率 ${formatPercent(requiredSavingRate)}，路径可行。`;
  } else if (requiredSavingRate <= 50) {
    feasibility = "medium";
    advice = `每月需存 ${formatCurrency(monthlySaving)}，储蓄率 ${formatPercent(requiredSavingRate)} 偏高，建议增加收入或延长目标期限。`;
  } else {
    feasibility = "low";
    advice = `每月需存 ${formatCurrency(monthlySaving)}，储蓄率 ${formatPercent(requiredSavingRate)} 不现实，建议调整目标金额或截止日期。`;
  }

  return {
    goalName: goal.name,
    monthlySaving,
    requiredSavingRate,
    feasibility,
    advice,
  };
}
