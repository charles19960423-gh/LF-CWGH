"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteLiability } from "@/app/actions/liabilities";
import {
  LiabilityFormDialog,
  LiabilityFormTrigger,
} from "@/components/liabilities/LiabilityFormDialog";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatCurrency } from "@/lib/format";
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
import type { Liability } from "@/types";

interface LiabilityListProps {
  liabilities: Liability[];
  categories: readonly string[];
  total: number;
}

export function LiabilityList({
  liabilities,
  categories,
  total,
}: LiabilityListProps) {
  const [addOpen, setAddOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  if (liabilities.length === 0) {
    return (
      <>
        <LiabilityFormDialog
          open={addOpen}
          onOpenChange={setAddOpen}
          categories={categories}
        />
        <EmptyState
          title="暂无负债记录"
          description="录入负债，完整掌握你的财务状况"
          actionLabel="+ 新增负债"
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
              <TableHead className="text-right">年利率</TableHead>
              <TableHead className="w-[100px] text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {liabilities.map((liability) => (
              <TableRow key={liability.id}>
                <TableCell className="font-medium">{liability.name}</TableCell>
                <TableCell>{liability.type}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(liability.amount)}
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {liability.interest_rate != null
                    ? `${liability.interest_rate}%`
                    : "—"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <LiabilityFormTrigger
                      categories={categories}
                      liability={liability}
                      variant="ghost"
                      size="icon-sm"
                    />
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setDeleteId(liability.id)}
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
        title="删除负债"
        description="此操作不可撤销，确定删除这条负债吗？"
        onConfirm={() => deleteLiability(deleteId!)}
      />
    </>
  );
}
