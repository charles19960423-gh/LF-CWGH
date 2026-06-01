"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteTransaction } from "@/app/actions/transactions";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { TransactionFormTrigger } from "@/components/transactions/TransactionFormDialog";
import { formatDisplayDate } from "@/lib/date-utils";
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
import type { Transaction, TransactionType } from "@/types";

interface TransactionTableProps {
  transactions: Transaction[];
  type: TransactionType;
  categories: readonly string[];
  label: string;
  total: number;
  onAdd?: () => void;
}

export function TransactionTable({
  transactions,
  type,
  categories,
  label,
  total,
  onAdd,
}: TransactionTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  if (transactions.length === 0) {
    return (
      <EmptyState
        title={`暂无${label}记录`}
        description={`点击「新增${label}」开始记录`}
        actionLabel={`+ 新增${label}`}
        onAction={onAdd}
      />
    );
  }

  return (
    <>
      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>日期</TableHead>
              <TableHead className="text-right">金额</TableHead>
              <TableHead>分类</TableHead>
              <TableHead>账户</TableHead>
              <TableHead>备注</TableHead>
              <TableHead className="w-[100px] text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((t) => (
              <TableRow key={t.id}>
                <TableCell>{formatDisplayDate(t.date)}</TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(t.amount)}
                </TableCell>
                <TableCell>{t.category}</TableCell>
                <TableCell className="text-muted-foreground">
                  {t.account || "—"}
                </TableCell>
                <TableCell className="max-w-[160px] truncate text-muted-foreground">
                  {t.note || "—"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <TransactionFormTrigger
                      type={type}
                      categories={categories}
                      label={label}
                      transaction={t}
                      variant="ghost"
                      size="icon-sm"
                    />
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setDeleteId(t.id)}
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
              <TableCell colSpan={5} className="text-right font-medium">
                合计
              </TableCell>
              <TableCell className="text-right font-semibold">
                {formatCurrency(total)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title={`删除${label}`}
        description="此操作不可撤销，确定删除这条记录吗？"
        onConfirm={() => deleteTransaction(type, deleteId!)}
      />
    </>
  );
}
