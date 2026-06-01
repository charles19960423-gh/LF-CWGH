import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { LiabilityFormTrigger } from "@/components/liabilities/LiabilityFormDialog";
import { LiabilityList } from "@/components/liabilities/LiabilityList";
import { Card, CardContent } from "@/components/ui/card";
import { LIABILITY_TYPES } from "@/lib/constants/categories";
import { listLiabilities, sumLiabilities } from "@/lib/database/liabilities";
import { requireUserId } from "@/lib/auth-server";
import { formatCurrency } from "@/lib/format";

export const metadata: Metadata = {
  title: "负债管理",
};

export default async function LiabilitiesPage() {
  const userId = await requireUserId();
  const liabilities = await listLiabilities(userId);
  const total = sumLiabilities(liabilities);

  return (
    <>
      <PageHeader title="负债管理" description="清晰掌握你的负债情况">
        <LiabilityFormTrigger categories={LIABILITY_TYPES} />
      </PageHeader>

      <div className="space-y-6">
        <Card>
          <CardContent className="py-6">
            <p className="text-sm text-muted-foreground">总负债</p>
            <p className="mt-1 text-3xl font-semibold text-[#1e3a5f]">
              {formatCurrency(total)}
            </p>
          </CardContent>
        </Card>

        <LiabilityList
          liabilities={liabilities}
          categories={LIABILITY_TYPES}
          total={total}
        />
      </div>
    </>
  );
}
