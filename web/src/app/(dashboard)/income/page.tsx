import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { TransactionFilters } from "@/components/transactions/TransactionFilters";
import { TransactionFormTrigger } from "@/components/transactions/TransactionFormDialog";
import { TransactionList } from "@/components/transactions/TransactionList";
import { Card, CardContent } from "@/components/ui/card";
import { INCOME_CATEGORIES } from "@/lib/constants/categories";
import { getCurrentMonth } from "@/lib/date-utils";
import {
  listTransactions,
  sumTransactions,
} from "@/lib/database/transactions";
import { requireUserId } from "@/lib/auth-server";
import { formatCurrency } from "@/lib/format";

export const metadata: Metadata = {
  title: "收入管理",
};

interface PageProps {
  searchParams: Promise<{ month?: string; category?: string }>;
}

export default async function IncomePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const month = params.month ?? getCurrentMonth();
  const category = params.category ?? "all";
  const userId = await requireUserId();

  const transactions = await listTransactions(userId, {
    type: "income",
    month,
    category,
  });
  const total = sumTransactions(transactions);

  return (
    <>
      <PageHeader title="收入管理" description="记录和分析你的收入来源">
        <TransactionFormTrigger
          type="income"
          categories={INCOME_CATEGORIES}
          label="收入"
        />
      </PageHeader>

      <div className="space-y-6">
        <Card>
          <CardContent className="py-6">
            <p className="text-sm text-muted-foreground">本月收入合计</p>
            <p className="mt-1 text-3xl font-semibold text-[#1e3a5f]">
              {formatCurrency(total)}
            </p>
          </CardContent>
        </Card>

        <Suspense fallback={null}>
          <TransactionFilters
            month={month}
            category={category}
            categories={INCOME_CATEGORIES}
          />
        </Suspense>

        <TransactionList
          transactions={transactions}
          type="income"
          categories={INCOME_CATEGORIES}
          label="收入"
          total={total}
        />
      </div>
    </>
  );
}
