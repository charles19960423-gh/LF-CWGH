"use client";

import { useActionState, useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { createGoal, updateGoal } from "@/app/actions/goals";
import type { ActionResult } from "@/lib/actions/utils";
import { GOAL_TEMPLATES } from "@/lib/constants/categories";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Goal } from "@/types";

interface GoalFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal?: Goal | null;
}

export function GoalFormDialog({ open, onOpenChange, goal }: GoalFormDialogProps) {
  const isEdit = Boolean(goal);
  const action = isEdit ? updateGoal.bind(null, goal!.id) : createGoal;

  const [state, formAction, pending] = useActionState<
    ActionResult<Goal> | null,
    FormData
  >(action, null);

  const [name, setName] = useState(goal?.name ?? "");

  useEffect(() => {
    if (state?.success) {
      onOpenChange(false);
    }
  }, [state, onOpenChange]);

  useEffect(() => {
    if (open) {
      setName(goal?.name ?? "");
    }
  }, [open, goal]);

  function applyTemplate(templateName: string, icon: string) {
    setName(`${icon} ${templateName}`);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "编辑目标" : "新增财务目标"}</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          {!isEdit && (
            <div className="space-y-2">
              <Label>快速选择模板</Label>
              <div className="flex flex-wrap gap-2">
                {GOAL_TEMPLATES.map((t) => (
                  <Button
                    key={t.name}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => applyTemplate(t.name, t.icon)}
                  >
                    {t.icon} {t.name}
                  </Button>
                ))}
              </div>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="name">目标名称 *</Label>
            <Input
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="🚀 创业基金"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="target_amount">目标金额 *</Label>
            <Input
              id="target_amount"
              name="target_amount"
              type="number"
              step="0.01"
              min="0.01"
              defaultValue={goal?.target_amount ?? ""}
              placeholder="500000"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="current_amount">当前已存 *</Label>
            <Input
              id="current_amount"
              name="current_amount"
              type="number"
              step="0.01"
              min="0"
              defaultValue={goal?.current_amount ?? 0}
              placeholder="0"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="target_date">目标日期 *</Label>
            <Input
              id="target_date"
              name="target_date"
              type="date"
              defaultValue={goal?.target_date ?? ""}
              required
            />
          </div>
          {state && !state.success && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button type="submit" className="bg-[#1e3a5f] hover:bg-[#162d4a]" disabled={pending}>
              {pending ? "保存中..." : "保存"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function GoalFormTrigger({
  goal,
  variant = "default",
  size = "default",
}: {
  goal?: Goal | null;
  variant?: "default" | "ghost";
  size?: "default" | "icon-sm";
}) {
  const [open, setOpen] = useState(false);
  const isEdit = Boolean(goal);

  return (
    <>
      <Button
        type="button"
        variant={variant}
        size={size}
        className={variant === "default" ? "bg-[#1e3a5f] hover:bg-[#162d4a]" : undefined}
        onClick={() => setOpen(true)}
        aria-label={isEdit ? "编辑" : "新增目标"}
      >
        {isEdit && size === "icon-sm" ? (
          <Pencil className="size-4" />
        ) : isEdit ? (
          "编辑"
        ) : (
          "+ 新增目标"
        )}
      </Button>
      <GoalFormDialog open={open} onOpenChange={setOpen} goal={goal} />
    </>
  );
}
