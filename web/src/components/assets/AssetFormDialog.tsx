"use client";

import { useActionState, useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { createAsset, updateAsset } from "@/app/actions/assets";
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
import type { Asset } from "@/types";

interface AssetFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: readonly string[];
  asset?: Asset | null;
}

export function AssetFormDialog({
  open,
  onOpenChange,
  categories,
  asset,
}: AssetFormDialogProps) {
  const isEdit = Boolean(asset);
  const action = isEdit
    ? updateAsset.bind(null, asset!.id)
    : createAsset;

  const [state, formAction, pending] = useActionState<
    ActionResult<Asset> | null,
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
          <DialogTitle>{isEdit ? "编辑资产" : "新增资产"}</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">名称 *</Label>
            <Input
              id="name"
              name="name"
              defaultValue={asset?.name ?? ""}
              placeholder="招商银行 / 微信零钱"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">类型 *</Label>
            <select
              id="type"
              name="type"
              className={selectClassName}
              defaultValue={asset?.type ?? categories[0]}
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
              defaultValue={asset?.amount ?? ""}
              placeholder="0.00"
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

export function AssetFormTrigger({
  categories,
  asset,
  variant = "default",
  size = "default",
}: {
  categories: readonly string[];
  asset?: Asset | null;
  variant?: "default" | "ghost";
  size?: "default" | "icon-sm";
}) {
  const [open, setOpen] = useState(false);
  const isEdit = Boolean(asset);

  return (
    <>
      <Button
        type="button"
        variant={variant}
        size={size}
        className={variant === "default" ? "bg-[#1e3a5f] hover:bg-[#162d4a]" : undefined}
        onClick={() => setOpen(true)}
        aria-label={isEdit ? "编辑" : "新增资产"}
      >
        {isEdit && size === "icon-sm" ? (
          <Pencil className="size-4" />
        ) : isEdit ? (
          "编辑"
        ) : (
          "+ 新增资产"
        )}
      </Button>
      <AssetFormDialog
        open={open}
        onOpenChange={setOpen}
        categories={categories}
        asset={asset}
      />
    </>
  );
}
