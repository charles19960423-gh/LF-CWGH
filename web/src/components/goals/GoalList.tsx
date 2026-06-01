"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteGoal } from "@/app/actions/goals";
import { GoalFormDialog, GoalFormTrigger } from "@/components/goals/GoalFormDialog";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { EmptyState } from "@/components/shared/EmptyState";
import type { GoalWithMetrics } from "@/lib/calculations/goals";
import { formatCurrency, formatPercent } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function GoalCard({ goal }: { goal: GoalWithMetrics }) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const isAchieved = goal.status === "achieved";
  const isOverdue = goal.status === "overdue";

  return (
    <>
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="pt-6">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold">
                {goal.icon} {goal.name}
              </h3>
              {isAchieved && (
                <span className="mt-1 inline-block rounded-full bg-[#c9a227]/15 px-2 py-0.5 text-xs font-medium text-[#c9a227]">
                  已达成 🎉
                </span>
              )}
              {isOverdue && (
                <span className="mt-1 inline-block rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                  已逾期 ⚠️
                </span>
              )}
            </div>
            <span className="text-lg font-bold">{formatPercent(goal.progress)}</span>
          </div>

          <div className="mb-4 h-3 overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                isAchieved || goal.progress >= 90 ? "bg-[#c9a227]" : "bg-[#1e3a5f]"
              )}
              style={{ width: `${Math.min(goal.progress, 100)}%` }}
            />
          </div>

          <p className="mb-4 text-sm text-muted-foreground">
            {formatCurrency(goal.current_amount)} / {formatCurrency(goal.target_amount)}
          </p>

          <div className="grid grid-cols-2 gap-3 rounded-lg bg-muted/40 p-3 text-sm sm:grid-cols-4">
            <div>
              <p className="text-muted-foreground">剩余金额</p>
              <p className="font-medium">{formatCurrency(goal.remaining)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">剩余时间</p>
              <p className="font-medium">
                {isAchieved ? "—" : `${goal.monthsLeft} 个月`}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">每月需存</p>
              <p className="font-medium">{formatCurrency(goal.monthlySaving)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">预计完成</p>
              <p className="font-medium">{goal.statusLabel}</p>
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <GoalFormTrigger goal={goal} variant="ghost" size="default" />
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="mr-1 size-4" />
              删除
            </Button>
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="删除目标"
        description="此操作不可撤销，确定删除这个目标吗？"
        onConfirm={() => deleteGoal(goal.id)}
      />
    </>
  );
}

interface GoalListProps {
  goals: GoalWithMetrics[];
}

export function GoalList({ goals }: GoalListProps) {
  const [addOpen, setAddOpen] = useState(false);

  if (goals.length === 0) {
    return (
      <>
        <GoalFormDialog open={addOpen} onOpenChange={setAddOpen} />
        <EmptyState
          title="还没有财务目标"
          description="设定你的第一个目标，让系统帮你计算每月需存金额"
          actionLabel="+ 新增目标"
          onAction={() => setAddOpen(true)}
        />
      </>
    );
  }

  return (
    <div className="space-y-4">
      {goals.map((goal) => (
        <GoalCard key={goal.id} goal={goal} />
      ))}
    </div>
  );
}
