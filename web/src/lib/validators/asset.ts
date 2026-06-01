import { z } from "zod";
import { ASSET_TYPES } from "@/lib/constants/categories";

const assetSchema = z.object({
  name: z.string().min(1, "请填写名称"),
  type: z.string().min(1, "请选择类型"),
  amount: z.coerce.number().min(0, "金额不能为负"),
});

export function parseAssetForm(formData: FormData) {
  const parsed = assetSchema.safeParse({
    name: String(formData.get("name") ?? "").trim(),
    type: String(formData.get("type") ?? ""),
    amount: formData.get("amount"),
  });

  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0]?.message ?? "输入无效" };
  }

  if (!ASSET_TYPES.includes(parsed.data.type as never)) {
    return { success: false as const, error: "资产类型无效" };
  }

  return { success: true as const, data: parsed.data };
}
