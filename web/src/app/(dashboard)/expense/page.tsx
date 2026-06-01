import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ExpenseStructureBar } from "@/components/transactions/ExpenseStructureBar";
import { TransactionFilters } from "@/components/transactions/TransactionFilters";
import { TransactionFormTrigger } from "@/components/transactions/TransactionFormDialog";
import { TransactionList } from "@/components/transactions/TransactionList";
import { Card, CardContent } from "@/components/ui/card";
import { EXPENSE_CATEGORIES } from "@/lib/constants/categories";
import { getCurrentMonth } from "@/lib/date-utils";
import {
  groupByCategory,
  listTransactions,
  sumTransactions,
} from "@/lib/database/transactions";
import { requireUserId } from "@/lib/auth-server";
import { formatCurrency } from "@/lib/format";

export const metadata: Metadata = {
  title: "支出管理",
};

interface PageProps {
  searchParams: Promise<{ month?: string; category?: string }>;
}

export default async function ExpensePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const month = params.month ?? getCurrentMonth();
  const category = params.category ?? "all";
  const userId = await requireUserId();

  const transactions = await listTransactions(userId, {
    type: "expense",
    month,
    category,
  });
  const total = sumTransactions(transactions);
  const structure = groupByCategory(transactions);

  return (
    <>
      <PageHeader title="支出管理" description="追踪支出结构与商业投入">
        <TransactionFormTrigger
          type="expense"
          categories={EXPENSE_CATEGORIES}
          label="支出"
        />
      </PageHeader>

      <div className="space-y-6">
        <Card>
          <CardContent className="py-6">
            <p className="text-sm text-muted-foreground">本月支出合计</p>
            <p className="mt-1 text-3xl font-semibold text-[#1e3a5f]">
              {formatCurrency(total)}
            </p>
          </CardContent>
        </Card>

        <ExpenseStructureBar items={structure} />

        <Suspense fallback={null}>
          <TransactionFilters
            month={month}
            category={category}
            categories={EXPENSE_CATEGORIES}
          />
        </Suspense>

        <TransactionList
          transactions={transactions}
          type="expense"
          categories={EXPENSE_CATEGORIES}
          label="支出"
          total={total}
        />
      </div>
    </>
  );
}
