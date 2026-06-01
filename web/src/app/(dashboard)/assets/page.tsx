import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { AssetFormTrigger } from "@/components/assets/AssetFormDialog";
import { AssetList } from "@/components/assets/AssetList";
import { Card, CardContent } from "@/components/ui/card";
import { ASSET_TYPES } from "@/lib/constants/categories";
import {
  listAssets,
  sumAssets,
  withAssetPercentages,
} from "@/lib/database/assets";
import { requireUserId } from "@/lib/auth-server";
import { formatCurrency } from "@/lib/format";

export const metadata: Metadata = {
  title: "资产管理",
};

export default async function AssetsPage() {
  const userId = await requireUserId();
  const assets = withAssetPercentages(await listAssets(userId));
  const total = sumAssets(assets);

  return (
    <>
      <PageHeader title="资产管理" description="掌握你的资产结构与占比">
        <AssetFormTrigger categories={ASSET_TYPES} />
      </PageHeader>

      <div className="space-y-6">
        <Card>
          <CardContent className="py-6">
            <p className="text-sm text-muted-foreground">总资产</p>
            <p className="mt-1 text-3xl font-semibold text-[#1e3a5f]">
              {formatCurrency(total)}
            </p>
          </CardContent>
        </Card>

        <AssetList assets={assets} categories={ASSET_TYPES} total={total} />
      </div>
    </>
  );
}
