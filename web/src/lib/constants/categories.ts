export const INCOME_CATEGORIES = [
  "工资",
  "项目收入",
  "咨询收入",
  "课程收入",
  "广告收入",
  "投资收益",
  "其他",
] as const;

export const EXPENSE_CATEGORIES = [
  "餐饮",
  "住房",
  "交通",
  "娱乐",
  "学习",
  "健康",
  "商业投入",
  "营销推广",
  "员工工资",
  "设备采购",
  "其他",
] as const;

export const ASSET_TYPES = [
  "现金",
  "银行卡",
  "支付宝",
  "微信",
  "股票",
  "基金",
  "房产",
  "车辆",
  "公司股权",
] as const;

export const LIABILITY_TYPES = [
  "信用卡",
  "房贷",
  "车贷",
  "经营贷",
  "朋友借款",
] as const;

export const GOAL_TEMPLATES = [
  { name: "应急基金", icon: "🛡️" },
  { name: "创业基金", icon: "🚀" },
  { name: "买房基金", icon: "🏠" },
  { name: "教育基金", icon: "📚" },
  { name: "退休基金", icon: "🎯" },
] as const;

export type IncomeCategory = (typeof INCOME_CATEGORIES)[number];
export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];
export type AssetType = (typeof ASSET_TYPES)[number];
export type LiabilityType = (typeof LIABILITY_TYPES)[number];
