import { createClient } from "@/lib/supabase/server";
import { mapAsset } from "@/lib/database/mappers";
import type { Asset } from "@/types";

export async function listAssets(userId: string): Promise<Asset[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("assets")
    .select("*")
    .eq("user_id", userId)
    .order("amount", { ascending: false });

  if (error) {
    if (error.code === "42501") {
      throw new Error(
        "数据库权限不足。请在 Supabase SQL Editor 执行 003_grant_permissions.sql"
      );
    }
    throw error;
  }
  return (data ?? []).map(mapAsset);
}

export function sumAssets(assets: Asset[]): number {
  return assets.reduce((sum, a) => sum + a.amount, 0);
}

export function withAssetPercentages(assets: Asset[]) {
  const total = sumAssets(assets);
  return assets.map((asset) => ({
    ...asset,
    percentage: total > 0 ? (asset.amount / total) * 100 : 0,
  }));
}
