# Supabase 数据库设置指南

> 林峰 Life OS · 第二阶段  
> 预计耗时：15 分钟

---

## 1. 创建 Supabase 项目

1. 打开 [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. 点击 **New Project**
3. 填写项目名称：`linfeng-life-os`
4. 设置数据库密码（请保存）
5. 选择区域（推荐 Singapore 或 Tokyo，离中国较近）
6. 等待项目创建完成（约 2 分钟）

---

## 2. 获取 API 密钥

1. 进入项目 → **Settings** → **API**
2. 复制以下两项到 `web/.env.local`：

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

3. 保存文件，重启开发服务器：

```bash
cd "/Users/jx-charles/Documents/林峰系统说/102-林峰财务规划/web"
npm run dev
```

---

## 3. 执行数据库迁移

1. 进入 Supabase Dashboard → **SQL Editor**
2. 点击 **New query**
3. 复制粘贴 `migrations/001_initial_schema.sql` 全部内容 → 点击 **Run**
4. 再复制粘贴 `migrations/002_updated_at_triggers.sql` → 点击 **Run**

---

## 4. 验证表已创建

进入 **Table Editor**，应看到 6 张表：

| 表 | 说明 |
|----|------|
| users | 用户 |
| transactions | 收入/支出 |
| assets | 资产 |
| liabilities | 负债 |
| goals | 财务目标 |
| reports | 月度复盘 |

每张表旁边应显示 **RLS enabled**（绿色盾牌）。

---

## 5. 验证 Auth 触发器

1. 打开 App → 注册一个新账号
2. 回到 Supabase → **Table Editor** → `users`
3. 应自动出现一条与 auth.users 对应的记录

---

## 6. 在 App 中验证

1. 注册/登录后进入 **设置** 页
2. 查看「数据库状态」应显示：**已连接 ✅**
3. 姓名、邮箱来自 `public.users` 表

---

## 常见问题

**Q: 注册后 users 表没有数据？**  
A: 确认 001 迁移中的 `handle_new_user` 触发器已执行。App 端也会在注册时 fallback 写入。

**Q: RLS 报错 permission denied？**  
A: 确认使用的是 `anon` key（不是 service_role），且用户已登录。

**Q: 本地无法连接？**  
A: 检查 `.env.local` 是否在 `web/` 目录下，且变量名正确。

---

## 表结构速查

详见上级目录 `03-技术设计/数据库设计.md`
