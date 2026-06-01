"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteAsset } from "@/app/actions/assets";
import { AssetFormDialog, AssetFormTrigger } from "@/components/assets/AssetFormDialog";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatCurrency, formatPercent } from "@/lib/format";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Asset } from "@/types";

interface AssetListProps {
  assets: (Asset & { percentage: number })[];
  categories: readonly string[];
  total: number;
}

export function AssetList({ assets, categories, total }: AssetListProps) {
  const [addOpen, setAddOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  if (assets.length === 0) {
    return (
      <>
        <AssetFormDialog
          open={addOpen}
          onOpenChange={setAddOpen}
          categories={categories}
        />
        <EmptyState
          title="暂无资产记录"
          description="录入你的资产，开启财富驾驶舱"
          actionLabel="+ 新增资产"
          onAction={() => setAddOpen(true)}
        />
      </>
    );
  }

  return (
    <>
      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>名称</TableHead>
              <TableHead>类型</TableHead>
              <TableHead className="text-right">金额</TableHead>
              <TableHead className="text-right">占比</TableHead>
              <TableHead className="w-[100px] text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.map((asset) => (
              <TableRow key={asset.id}>
                <TableCell className="font-medium">{asset.name}</TableCell>
                <TableCell>{asset.type}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(asset.amount)}
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {formatPercent(asset.percentage)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <AssetFormTrigger
                      categories={categories}
                      asset={asset}
                      variant="ghost"
                      size="icon-sm"
                    />
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setDeleteId(asset.id)}
                      aria-label="删除"
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2} className="text-right font-medium">
                合计
              </TableCell>
              <TableCell className="text-right font-semibold">
                {formatCurrency(total)}
              </TableCell>
              <TableCell colSpan={2} />
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="删除资产"
        description="此操作不可撤销，确定删除这条资产吗？"
        onConfirm={() => deleteAsset(deleteId!)}
      />
    </>
  );
}
