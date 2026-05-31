# 林峰 Life OS

> **成为你自己 · BEING YOURSELF**  
> 帮助个体创业者用系统管理人生，实现财富增长与个人成长。

---

## 项目状态

| 阶段 | 状态 |
|------|------|
| 产品规划 + IA V1 | ✅ 完成 |
| 文档清理 + 同步 | ✅ 完成 |
| 开发 | ✅ 第一阶段完成（web/） |

---

## 开发入口

| 优先级 | 文档 | 用途 |
|--------|------|------|
| **1** | [`01-产品规划/IA-V1.md`](01-产品规划/IA-V1.md) | ★ 唯一开发主文档 |
| **2** | [`01-产品规划/Cursor开发提示词.md`](01-产品规划/Cursor开发提示词.md) | 5 阶段逐步提示词 |
| **3** | [`web/README.md`](web/README.md) | Web 应用启动说明 |

**本地运行**：

```bash
cd web
cp .env.local.example .env.local
# 填入 Supabase 配置
npm run dev
```

**当前进度**：
- 第一阶段「搭框架」✅
- 第二阶段「数据库」✅ 代码层就绪 → 请在 Supabase 执行 SQL（见 `web/supabase/SETUP.md`）

---

## 文档结构（15 个文件）

```
├── web/                          ★ Next.js 应用（在此开发）
│   ├── src/app/(auth)/           登录 / 注册
│   ├── src/app/(dashboard)/      财富系统全部页面
│   └── README.md                 启动说明
├── 01-产品规划/
│   ├── IA-V1.md                 ★ 开发主文档
│   ├── Cursor开发提示词.md
│   ├── PRD-V1.md                产品决策（开发以 IA 为准）
│   ├── 用户画像.md
│   └── 用户旅程地图.md
├── 02-交互设计/
│   ├── 页面原型图-低保真.md       ★ 全部页面线框
│   ├── Dashboard.md
│   ├── Assets.md
│   └── Goals.md
├── 03-技术设计/
│   ├── 数据库设计.md
│   └── API设计.md
├── prompts/
│   └── advisor-system.md
└── supabase/migrations/
    └── 001_initial_schema.sql
```

---

## V1 范围

只做 **财富系统**，9 天 MVP：框架 → 数据库 → 核心功能 → Dashboard → AI 复盘

## 技术栈

Next.js 15 · TypeScript · Tailwind · shadcn/ui · Supabase · OpenAI · Vercel
