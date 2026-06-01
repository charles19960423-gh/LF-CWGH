import Link from "next/link";
import { formatCurrency, formatPercent } from "@/lib/format";
import type { GoalWithMetrics } from "@/lib/calculations/goals";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface GoalProgressListProps {
  goals: GoalWithMetrics[];
}

export function GoalProgressList({ goals }: GoalProgressListProps) {
  if (goals.length === 0) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base">财务目标</CardTitle>
          <Link href="/goals" className="text-sm text-[#1e3a5f] hover:underline">
            去设定 →
          </Link>
        </CardHeader>
        <CardContent>
          <p className="py-4 text-center text-sm text-muted-foreground">
            还没有财务目标，设定第一个目标吧
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">目标完成度</CardTitle>
        <Link href="/goals" className="text-sm text-[#1e3a5f] hover:underline">
          查看全部 →
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {goals.map((goal) => (
          <Link
            key={goal.id}
            href="/goals"
            className="block rounded-lg p-2 transition-colors hover:bg-muted/50"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">
                {goal.icon} {goal.name}
              </span>
              <span className="text-sm font-semibold">
                {formatPercent(goal.progress)}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  goal.progress >= 100 ? "bg-[#c9a227]" : "bg-[#1e3a5f]"
                )}
                style={{ width: `${Math.min(goal.progress, 100)}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {formatCurrency(goal.current_amount)} /{" "}
              {formatCurrency(goal.target_amount)}
            </p>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
