"use client";

import { useState } from "react";
import { TransactionFormDialog } from "@/components/transactions/TransactionFormDialog";
import { TransactionTable } from "@/components/transactions/TransactionTable";
import type { Transaction, TransactionType } from "@/types";

interface TransactionListProps {
  transactions: Transaction[];
  type: TransactionType;
  categories: readonly string[];
  label: string;
  total: number;
}

export function TransactionList({
  transactions,
  type,
  categories,
  label,
  total,
}: TransactionListProps) {
  const [addOpen, setAddOpen] = useState(false);

  return (
    <>
      <TransactionFormDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        type={type}
        categories={categories}
        label={label}
      />
      <TransactionTable
        transactions={transactions}
        type={type}
        categories={categories}
        label={label}
        total={total}
        onAdd={() => setAddOpen(true)}
      />
    </>
  );
}
