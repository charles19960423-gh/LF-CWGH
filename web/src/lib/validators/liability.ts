import { z } from "zod";
import { LIABILITY_TYPES } from "@/lib/constants/categories";

const liabilitySchema = z.object({
  name: z.string().min(1, "请填写名称"),
  type: z.string().min(1, "请选择类型"),
  amount: z.coerce.number().min(0, "金额不能为负"),
  interest_rate: z
    .string()
    .optional()
    .transform((v) => {
      if (!v?.trim()) return null;
      const n = parseFloat(v);
      return Number.isNaN(n) ? null : n;
    }),
});

export function parseLiabilityForm(formData: FormData) {
  const parsed = liabilitySchema.safeParse({
    name: String(formData.get("name") ?? "").trim(),
    type: String(formData.get("type") ?? ""),
    amount: formData.get("amount"),
    interest_rate: String(formData.get("interest_rate") ?? ""),
  });

  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0]?.message ?? "输入无效" };
  }

  if (!LIABILITY_TYPES.includes(parsed.data.type as never)) {
    return { success: false as const, error: "负债类型无效" };
  }

  return { success: true as const, data: parsed.data };
}
