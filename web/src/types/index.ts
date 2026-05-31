import type { Tables, TablesInsert, TablesUpdate } from "./database";

export type User = Tables<"users">;
export type UserInsert = TablesInsert<"users">;
export type Transaction = Tables<"transactions">;
export type Asset = Tables<"assets">;
export type Liability = Tables<"liabilities">;
export type Goal = Tables<"goals">;
export type Report = Tables<"reports">;

export type TransactionInsert = TablesInsert<"transactions">;
export type AssetInsert = TablesInsert<"assets">;
export type LiabilityInsert = TablesInsert<"liabilities">;
export type GoalInsert = TablesInsert<"goals">;
export type ReportInsert = TablesInsert<"reports">;

export type TransactionUpdate = TablesUpdate<"transactions">;
export type AssetUpdate = TablesUpdate<"assets">;
export type LiabilityUpdate = TablesUpdate<"liabilities">;
export type GoalUpdate = TablesUpdate<"goals">;

export type TransactionType = Transaction["type"];

export type BreakdownItem = {
  category: string;
  amount: number;
  percentage: number;
};
