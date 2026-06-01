# 林峰 Life OS — Web 应用

> 成为你自己 · BEING YOURSELF

## 快速开始

```bash
cd web
cp .env.local.example .env.local
# 填入 Supabase URL 和 Anon Key
npm install
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)

## 技术栈

Next.js 16 · TypeScript · Tailwind v4 · shadcn/ui · Supabase · OpenAI

## 目录

```
src/
├── app/
│   ├── (auth)/          登录 / 注册
│   ├── (dashboard)/     财富系统全部页面
│   └── actions/         Server Actions
├── components/
│   ├── layout/          Sidebar, PageHeader, AppLayout
│   ├── auth/            登录注册表单
│   └── ui/              shadcn/ui
├── lib/
│   ├── supabase/        Auth 客户端
│   ├── constants/       分类枚举
│   └── format.ts        金额格式化
└── types/
```

## 开发阶段

| 阶段 | 状态 |
|------|------|
| 1 搭框架 | ✅ |
| 2 数据库 | ✅ |
| 3 核心功能 | ✅ 收入/支出/资产/负债 CRUD |
| 4 Dashboard | ✅ 聚合指标 + 趋势图 + 目标页 |
| 5 AI 复盘 | ✅ 月度复盘 + OpenAI 建议 |

产品文档见上级目录 `01-产品规划/IA-V1.md`

## 部署到 Vercel

详见 [DEPLOY.md](./DEPLOY.md)

要点：
1. Vercel 导入 GitHub 仓库 **LF-CWGH**
2. **Root Directory** 设为 `web`
3. 配置环境变量：`NEXT_PUBLIC_SUPABASE_URL`、`NEXT_PUBLIC_SUPABASE_ANON_KEY`、`OPENAI_API_KEY`
4. Supabase Auth 添加 Vercel 域名到 Redirect URLs
