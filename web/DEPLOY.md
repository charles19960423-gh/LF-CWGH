# Vercel 部署指南

> 林峰 Life OS · Web 应用

---

## 方式一：GitHub 导入（推荐）

### 1. 推送代码到 GitHub

确保最新代码已在 https://github.com/charles19960423-gh/LF-CWGH

### 2. 创建 Vercel 项目

1. 打开 [vercel.com/new](https://vercel.com/new)
2. 导入仓库 **LF-CWGH**
3. **重要**：Framework Preset 选 **Next.js**
4. **Root Directory** 点 Edit → 填 **`web`** → Continue
5. 环境变量（Environment Variables）添加：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` | Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_...` | Supabase Publishable Key |
| `OPENAI_API_KEY` | `sk-...` | 可选，AI 复盘用 |

6. 点击 **Deploy**

### 3. 配置 Supabase Auth（必做）

部署成功后复制 Vercel 域名，例如 `https://lf-cwgh.vercel.app`

在 Supabase → **Authentication** → **URL Configuration**：

| 字段 | 值 |
|------|-----|
| Site URL | `https://你的域名.vercel.app` |
| Redirect URLs | `https://你的域名.vercel.app/**` |

保存后，生产环境登录/注册即可正常工作。

---

## 方式二：Vercel CLI

```bash
cd web
npx vercel login
npx vercel link
npx vercel env add NEXT_PUBLIC_SUPABASE_URL
npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
npx vercel env add OPENAI_API_KEY
npx vercel --prod
```

---

## 构建说明

- 构建命令：`npm run build`（已含 `--webpack`，兼容中文路径）
- 输出目录：Next.js 默认
- Node.js：20.x（Vercel 自动）

---

## 部署后验证

- [ ] 首页 `/` 可访问
- [ ] 登录 / 注册正常
- [ ] 设置页显示「已连接 ✅」
- [ ] 收入/支出 CRUD 正常
- [ ] 生成本月复盘（含 AI 建议）

---

## 常见问题

**Q: 登录后跳回 login？**  
A: 检查 Supabase URL Configuration 是否添加了 Vercel 域名。

**Q: 数据库 permission denied？**  
A: 在 Supabase 执行 `web/supabase/migrations/003_grant_permissions.sql`。

**Q: AI 复盘无建议？**  
A: 在 Vercel 项目 Settings → Environment Variables 添加 `OPENAI_API_KEY`，重新 Deploy。

**Q: 构建失败？**  
A: 确认 Root Directory 设为 `web`，不是仓库根目录。
