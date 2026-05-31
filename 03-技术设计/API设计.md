# 林峰 Life OS — API 设计 V1

> **版本**：V1.1  
> **日期**：2026-05-31  
> **架构**：Next.js 15 Server Actions + Supabase Client  
> **权威参照**：`01-产品规划/IA-V1.md`

---

## 1. 架构概览

```
Client Component
    ↓ form action / onClick
Server Actions (lib/actions/*.ts)
    ├── getSession() → Supabase Auth
    ├── Zod 校验
    ├── Supabase Client 读写
    └── revalidatePath()
    ↓
PostgreSQL (Supabase, RLS)
```

**原则**：

- 无独立 REST API，全部 Server Actions
- 返回 `{ success: boolean, data?, error? }`
- 所有操作带 `user_id` 过滤
- AI 集成在 `/reports`，无独立 `/advisor` 路由

---

## 2. 认证 Actions

| Action | 输入 | 说明 |
|--------|------|------|
| `signIn` | email, password | 登录 |
| `signUp` | email, password, name | 注册 → trigger 创建 users |
| `signOut` | — | 退出 → redirect `/login` |

---

## 3. 交易 Actions

**文件**：`lib/actions/transactions.ts`

| Action | 说明 |
|--------|------|
| `createTransaction` | type, amount, category, account?, date, note? |
| `updateTransaction` | id + partial |
| `deleteTransaction` | id |
| `listTransactions` | type, month?, category? |
| `getExpenseStructure` | month → `{ category, amount, percentage }[]` |
| `getIncomeStructure` | month → `{ category, amount, percentage }[]` |

**收入分类**：工资、项目收入、咨询收入、课程收入、广告收入、投资收益、其他

**支出分类**：餐饮、住房、交通、娱乐、学习、健康、商业投入、营销推广、员工工资、设备采购、其他

---

## 4. 资产 Actions

**文件**：`lib/actions/assets.ts`

| Action | 说明 |
|--------|------|
| `createAsset` | name, type, amount |
| `updateAsset` | id + partial |
| `deleteAsset` | id |
| `listAssets` | 含 total + 占比 |

---

## 5. 负债 Actions

**文件**：`lib/actions/liabilities.ts`

| Action | 说明 |
|--------|------|
| `createLiability` | name, type, amount, interestRate? |
| `updateLiability` | id + partial |
| `deleteLiability` | id |
| `listLiabilities` | 含 total |

---

## 6. 目标 Actions

**文件**：`lib/actions/goals.ts`

| Action | 说明 |
|--------|------|
| `createGoal` | name, targetAmount, currentAmount, targetDate |
| `updateGoal` | id + partial |
| `deleteGoal` | id |
| `listGoals` | 含 remaining, monthlySaving, progress |

**计算**：`lib/calculations/goals.ts`

---

## 7. Dashboard Actions

**文件**：`lib/queries/dashboard.ts`

| Action | 返回 |
|--------|------|
| `getDashboardStats` | netWorth, totalAssets, totalLiabilities, incomeTotal, expenseTotal, savingRate, topGoals |
| `getTrendData` | 近 6 月 income/expense/netWorth 趋势（P1） |

---

## 8. 复盘 + AI Actions

**文件**：`lib/actions/reports.ts` + `lib/ai/`

| Action | 说明 |
|--------|------|
| `generateReport` | 聚合当月数据 → 写入 `reports` 表 |
| `listReports` | 历史复盘列表 |
| `getReport` | 单条复盘详情 |
| `generateAiSummary` | OpenAI 生成 ai_summary + ai_suggestions |

**reports 表字段**：

```
income_total, expense_total, saving_rate
income_breakdown (JSONB)   ← 收入排行
expense_breakdown (JSONB)  ← 支出排行
ai_summary (TEXT)
ai_suggestions (JSONB)
```

**Prompt**：`prompts/advisor-system.md`

---

## 9. 设置 Actions

| Action | 说明 |
|--------|------|
| `getProfile` | 读取 users |
| `updateProfile` | 更新 name |

---

## 10. 工具函数

```typescript
// lib/actions/utils.ts
type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

async function withAuth<T>(fn: (userId: string) => Promise<T>): Promise<ActionResult<T>>
```

---

## 11. 文件结构

```
src/
├── lib/
│   ├── actions/
│   │   ├── auth.ts
│   │   ├── transactions.ts
│   │   ├── assets.ts
│   │   ├── liabilities.ts
│   │   ├── goals.ts
│   │   ├── reports.ts
│   │   ├── dashboard.ts
│   │   └── settings.ts
│   ├── ai/
│   │   └── generate-review.ts
│   ├── calculations/
│   │   ├── goals.ts
│   │   └── health.ts
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── constants/
│   │   └── categories.ts
│   └── validations/
│       ├── transaction.ts
│       ├── asset.ts
│       └── goal.ts
└── prompts/
    └── advisor-system.md
```

---

## 12. 安全清单

- [ ] 所有 Action 经 `withAuth`
- [ ] Supabase RLS 启用
- [ ] Zod 校验所有输入
- [ ] OpenAI Key 仅服务端
- [ ] 金额 > 0，日期格式 YYYY-MM-DD

---

## 修订记录

| 版本 | 变更 |
|------|------|
| V1.1 | 移除 Prisma/onboarding；AI 合并 reports；对齐 IA-V1 |
| V1.0 | 初始版 |
