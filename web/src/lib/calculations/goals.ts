import {
  differenceInMonths,
  isBefore,
  parse,
  startOfDay,
} from "date-fns";
import { GOAL_TEMPLATES } from "@/lib/constants/categories";
import type { Goal } from "@/types";

export type GoalMetrics = {
  progress: number;
  remaining: number;
  monthsLeft: number;
  monthlySaving: number;
  status: "active" | "achieved" | "overdue";
  statusLabel: string;
};

export function getGoalIcon(name: string): string {
  const template = GOAL_TEMPLATES.find(
    (t) => name.includes(t.name) || name.startsWith(t.icon)
  );
  return template?.icon ?? "🎯";
}

export function calcGoalMetrics(goal: Goal): GoalMetrics {
  const today = startOfDay(new Date());
  const targetDate = parse(goal.target_date, "yyyy-MM-dd", new Date());
  const remaining = Math.max(goal.target_amount - goal.current_amount, 0);
  const progress =
    goal.target_amount > 0
      ? Math.min((goal.current_amount / goal.target_amount) * 100, 100)
      : 0;

  if (goal.current_amount >= goal.target_amount) {
    return {
      progress: 100,
      remaining: 0,
      monthsLeft: 0,
      monthlySaving: 0,
      status: "achieved",
      statusLabel: "已达成 🎉",
    };
  }

  const monthsLeft = Math.max(differenceInMonths(targetDate, today), 0);

  if (isBefore(targetDate, today)) {
    return {
      progress,
      remaining,
      monthsLeft: 0,
      monthlySaving: remaining,
      status: "overdue",
      statusLabel: "已逾期 ⚠️",
    };
  }

  const monthlySaving =
    monthsLeft > 0 ? Math.ceil(remaining / monthsLeft) : remaining;

  return {
    progress,
    remaining,
    monthsLeft,
    monthlySaving,
    status: "active",
    statusLabel:
      progress >= 90 ? "即将达成 🎉" : formatTargetDate(goal.target_date),
  };
}

function formatTargetDate(date: string): string {
  const parsed = parse(date, "yyyy-MM-dd", new Date());
  return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, "0")}-${String(parsed.getDate()).padStart(2, "0")}`;
}

export type GoalWithMetrics = Goal & GoalMetrics & { icon: string };

export function enrichGoal(goal: Goal): GoalWithMetrics {
  const metrics = calcGoalMetrics(goal);
  return {
    ...goal,
    ...metrics,
    icon: getGoalIcon(goal.name),
  };
}
