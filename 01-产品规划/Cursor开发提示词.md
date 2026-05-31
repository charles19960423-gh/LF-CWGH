# 林峰 Life OS — Cursor 开发提示词

> **版本**：V1.0  
> **日期**：2026-05-31  
> **参照**：`01-产品规划/IA-V1.md`  
> **用法**：按阶段复制到 Cursor Agent，每阶段验收后再进下一步

---

## 开发规则（先复制到 `.cursor/rules/project.mdc`）

```markdown
# 林峰 Life OS 开发规则

## 产品
- 产品名：林峰 Life OS · 成为你自己 · BEING YOURSELF
- 使命：帮助个体创业者用系统管理人生，实现财富增长与个人成长
- V1 只做财富系统，其他系统仅占位
- 核心用户：个体创业者，年入 10-100 万
- 不是记账工具，是财富驾驶舱

## 技术栈
- Next.js 15 App Router + TypeScript
- Tailwind CSS + shadcn/ui
- Supabase (PostgreSQL + Auth + RLS)
- OpenAI API
- Server Actions
- Vercel 部署

## 代码规范
- Server Component 默认，"use client" 仅交互部分
- 金额 number 存储，formatCurrency() 展示
- 所有 DB 操作带 user_id
- Action 返回 { success: boolean, data?, error? }
- 输入 Zod 校验
- 中文 UI，英文代码

## 参照
- IA：01-产品规划/IA-V1.md
- 原型：02-交互设计/页面原型图-低保真.md
- 数据库：03-技术设计/数据库设计.md
- 类别：lib/constants/categories.ts
```

---

## 第一阶段：搭框架（Day 1）

```
在 /Users/jx-charles/Documents/林峰系统说/102-林峰财务规划 创建项目。

参照 01-产品规划/IA-V1.md 执行：

1. 初始化 Next.js 15（App Router + TypeScript + Tailwind + src/）
2. 安装 shadcn/ui（default, slate）
3. 安装：@supabase/supabase-js @supabase/ssr date-fns lucide-react zod
4. 创建目录：
   src/app/(auth)/login/page.tsx
   src/app/(auth)/signup/page.tsx
   src/app/(dashboard)/layout.tsx
   src/app/(dashboard)/page.tsx          ← Dashboard 占位
   src/app/(dashboard)/income/page.tsx
   src/app/(dashboard)/expense/page.tsx
   src/app/(dashboard)/assets/page.tsx
   src/app/(dashboard)/liabilities/page.tsx
   src/app/(dashboard)/goals/page.tsx
   src/app/(dashboard)/reports/page.tsx
   src/app/(dashboard)/settings/page.tsx
   src/app/(dashboard)/life-os/page.tsx  ← Coming Soon 占位
   src/components/layout/                 ← AppLayout, Sidebar, PageHeader
   src/lib/supabase/                      ← client, server, middleware
   src/lib/constants/categories.ts
   src/lib/utils.ts                       ← formatCurrency, formatPercent

5. Sidebar 品牌：
   林峰 Life OS
   成为你自己
   导航：财务驾驶舱/收入/支出/资产/负债/目标/复盘/设置

6. Supabase Auth：登录/注册/退出
7. middleware 保护 dashboard 路由
8. .env.local.example

所有页面先放 PageHeader + 占位文字。npm run dev 无报错。
```

---

## 第二阶段：数据库（Day 2）

```
参照 03-技术设计/数据库设计.md 创建 6 张表。

1. supabase/migrations/001_initial_schema.sql：
   users, transactions, assets, liabilities, goals, reports
   全部启用 RLS（user_id = auth.uid()）

2. src/lib/constants/categories.ts：

   INCOME_CATEGORIES = [
     '工资','项目收入','咨询收入','课程收入','广告收入','投资收益','其他'
   ]
   EXPENSE_CATEGORIES = [
     '餐饮','住房','交通','娱乐','学习','健康',
     '商业投入','营销推广','员工工资','设备采购','其他'
   ]
   ASSET_TYPES = [
     '现金','银行卡','支付宝','微信','股票','基金','房产','车辆','公司股权'
   ]
   LIABILITY_TYPES = [
     '信用卡','房贷','车贷','经营贷','朋友借款'
   ]
   GOAL_TEMPLATES = [
     { name:'应急基金', icon:'🛡️' },
     { name:'创业基金', icon:'🚀' },
     { name:'买房基金', icon:'🏠' },
     { name:'教育基金', icon:'📚' },
     { name:'退休基金', icon:'🎯' },
   ]

3. src/types/index.ts：User, Transaction, Asset, Liability, Goal, Report

4. Auth 注册时自动创建 users 记录（trigger 或 server action）
```

---

## 第三阶段：核心功能（Day 3-5）

### Day 3：收入管理

```
实现 /income 页面：
- 本月收入合计
- TransactionTable：日期/金额/分类/账户/备注/操作
- FilterBar：月份 + 分类
- FormDialog：date, amount, category, account, note
- Server Actions：create/update/delete/list (type='income')
- EmptyState + ConfirmDialog
```

### Day 4：支出管理

```
实现 /expense 页面：
- 本月支出合计
- StructureBar：支出结构占比（按 category 分组）
- 其余同 income，type='expense'
- 分类用 EXPENSE_CATEGORIES（含商业投入/营销推广/员工工资/设备采购）
```

### Day 5：资产 + 负债

```
/assets 页面：
- 总资产合计 + 占比
- AssetTable CRUD
- 类型：ASSET_TYPES

/liabilities 页面：
- 总负债合计
- LiabilityTable CRUD（含 interest_rate）
- 类型：LIABILITY_TYPES
```

---

## 第四阶段：Dashboard（Day 6-7）

### Day 6：核心指标聚合

```
实现 / Dashboard：

参照 IA-V1 Dashboard 布局：

1. NetWorthHero：净资产（主色背景）
2. MetricCard × 4：总资产/总负债/本月收入/本月支出
3. SavingRateBar：储蓄率 + 健康状态
4. GoalProgressList：目标进度条

lib/queries/dashboard.ts → getDashboardStats(userId)
所有数字从 DB 聚合，与明细页一致。
MetricCard 可点击跳转。
空状态：「录入资产，开启财富驾驶舱 →」
```

### Day 7：目标 + 趋势

```
/goals 页面：
- GoalCard：名称/进度/剩余/每月需存/预计完成
- GoalFormDialog + 模板按钮
- lib/calculations/goals.ts

Dashboard 趋势图（Recharts）：
- 收入趋势（近6月）
- 支出趋势（近6月）
- 净资产趋势（近6月）— 需 net_worth 快照或按月计算
```

---

## 第五阶段：AI 顾问（Day 8-9）

### Day 8：财务复盘

```
/reports 页面：

1. [生成本月复盘] 按钮
2. 自动聚合：
   - 本月收入/支出/储蓄率
   - 收入排行（按 category 百分比）
   - 支出排行（按 category 百分比）
   - 目标进度变化
3. 写入 reports 表
4. 历史复盘列表
```

### Day 9：OpenAI 接入

```
1. lib/ai/generate-review.ts
   - 输入：月度财务数据
   - Prompt：prompts/advisor-system.md
   - 输出：AI 建议（如「商业投入增长50%，建议跟踪ROI」）

2. lib/ai/goal-planning.ts
   - 输入：目标 + 当前财务数据
   - 输出：每月需存 + 实现建议

3. Dashboard 智能分析卡片（3 条）

4. 部署 Vercel + 环境变量
5. 完整流程测试
```

---

## 验收清单

```
[ ] 注册 → 登录 → Dashboard
[ ] 资产/负债 CRUD → 净资产正确
[ ] 收入/支出 CRUD → 本月数据正确
[ ] 支出结构占比正确
[ ] 目标 CRUD → 每月需存计算正确
[ ] Dashboard 全部指标准确
[ ] 趋势图显示
[ ] 月度复盘生成 + 收入/支出排行
[ ] AI 建议生成
[ ] 空状态 + 删除确认
[ ] 移动端可用
[ ] Vercel 部署成功
```
