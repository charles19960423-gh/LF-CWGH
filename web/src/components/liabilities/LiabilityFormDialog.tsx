"use client";

import { useActionState, useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { createLiability, updateLiability } from "@/app/actions/liabilities";
import type { ActionResult } from "@/lib/actions/utils";
import { selectClassName } from "@/lib/form-styles";
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
import type { Liability } from "@/types";

interface LiabilityFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: readonly string[];
  liability?: Liability | null;
}

export function LiabilityFormDialog({
  open,
  onOpenChange,
  categories,
  liability,
}: LiabilityFormDialogProps) {
  const isEdit = Boolean(liability);
  const action = isEdit
    ? updateLiability.bind(null, liability!.id)
    : createLiability;

  const [state, formAction, pending] = useActionState<
    ActionResult<Liability> | null,
    FormData
  >(action, null);

  useEffect(() => {
    if (state?.success) {
      onOpenChange(false);
    }
  }, [state, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "编辑负债" : "新增负债"}</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">名称 *</Label>
            <Input
              id="name"
              name="name"
              defaultValue={liability?.name ?? ""}
              placeholder="招商银行信用卡"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">类型 *</Label>
            <select
              id="type"
              name="type"
              className={selectClassName}
              defaultValue={liability?.type ?? categories[0]}
              required
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">金额 *</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              min="0"
              defaultValue={liability?.amount ?? ""}
              placeholder="0.00"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="interest_rate">年利率 (%)</Label>
            <Input
              id="interest_rate"
              name="interest_rate"
              type="number"
              step="0.01"
              min="0"
              defaultValue={liability?.interest_rate ?? ""}
              placeholder="可选，如 4.5"
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

export function LiabilityFormTrigger({
  categories,
  liability,
  variant = "default",
  size = "default",
}: {
  categories: readonly string[];
  liability?: Liability | null;
  variant?: "default" | "ghost";
  size?: "default" | "icon-sm";
}) {
  const [open, setOpen] = useState(false);
  const isEdit = Boolean(liability);

  return (
    <>
      <Button
        type="button"
        variant={variant}
        size={size}
        className={variant === "default" ? "bg-[#1e3a5f] hover:bg-[#162d4a]" : undefined}
        onClick={() => setOpen(true)}
        aria-label={isEdit ? "编辑" : "新增负债"}
      >
        {isEdit && size === "icon-sm" ? (
          <Pencil className="size-4" />
        ) : isEdit ? (
          "编辑"
        ) : (
          "+ 新增负债"
        )}
      </Button>
      <LiabilityFormDialog
        open={open}
        onOpenChange={setOpen}
        categories={categories}
        liability={liability}
      />
    </>
  );
}
