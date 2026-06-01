"use client";

import { useActionState, useEffect, useState } from "react";
import { format } from "date-fns";
import { Pencil } from "lucide-react";
import {
  createTransaction,
  updateTransaction,
} from "@/app/actions/transactions";
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
import type { Transaction, TransactionType } from "@/types";

interface TransactionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: TransactionType;
  categories: readonly string[];
  transaction?: Transaction | null;
  label: string;
}

export function TransactionFormDialog({
  open,
  onOpenChange,
  type,
  categories,
  transaction,
  label,
}: TransactionFormDialogProps) {
  const isEdit = Boolean(transaction);
  const action = isEdit
    ? updateTransaction.bind(null, type, transaction!.id)
    : createTransaction.bind(null, type);

  const [state, formAction, pending] = useActionState<
    ActionResult<Transaction> | null,
    FormData
  >(action, null);

  useEffect(() => {
    if (state?.success) {
      onOpenChange(false);
    }
  }, [state, onOpenChange]);

  const defaultDate =
    transaction?.date ?? format(new Date(), "yyyy-MM-dd");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? `编辑${label}` : `新增${label}`}</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">日期 *</Label>
            <Input id="date" name="date" type="date" defaultValue={defaultDate} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">金额 *</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              min="0.01"
              defaultValue={transaction?.amount ?? ""}
              placeholder="0.00"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">分类 *</Label>
            <select
              id="category"
              name="category"
              className={selectClassName}
              defaultValue={transaction?.category ?? categories[0]}
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
            <Label htmlFor="account">账户</Label>
            <Input
              id="account"
              name="account"
              defaultValue={transaction?.account ?? ""}
              placeholder="微信 / 银行卡"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="note">备注</Label>
            <Input
              id="note"
              name="note"
              defaultValue={transaction?.note ?? ""}
              placeholder="可选"
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

interface TransactionFormTriggerProps {
  type: TransactionType;
  categories: readonly string[];
  label: string;
  transaction?: Transaction | null;
  variant?: "default" | "ghost";
  size?: "default" | "sm" | "icon-sm";
}

export function TransactionFormTrigger({
  type,
  categories,
  label,
  transaction,
  variant = "default",
  size = "default",
}: TransactionFormTriggerProps) {
  const [open, setOpen] = useState(false);
  const isEdit = Boolean(transaction);

  return (
    <>
      <Button
        type="button"
        variant={variant}
        size={size}
        className={variant === "default" ? "bg-[#1e3a5f] hover:bg-[#162d4a]" : undefined}
        onClick={() => setOpen(true)}
        aria-label={isEdit ? "编辑" : `新增${label}`}
      >
        {isEdit && size === "icon-sm" ? (
          <Pencil className="size-4" />
        ) : isEdit ? (
          "编辑"
        ) : (
          `+ 新增${label}`
        )}
      </Button>
      <TransactionFormDialog
        open={open}
        onOpenChange={setOpen}
        type={type}
        categories={categories}
        transaction={transaction}
        label={label}
      />
    </>
  );
}
