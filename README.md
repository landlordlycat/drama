# Drama

基于 Next.js 16 + TypeScript 的影视播放与后台管理项目。

## 功能概览

- 前台：首页、分类、搜索、热门、详情、播放器
- 用户：邮箱注册/登录、GitHub 登录、忘记密码、重置密码
- 用户中心：资料编辑、修改密码、修改邮箱（邮件验证后生效）
- 内容能力：收藏夹、观看历史、历史上报、来源切换
- 后台：概览、日志、分类、标签、播放源、收藏管理、历史管理

## 技术栈

- Next.js 16（App Router）
- TypeScript
- Tailwind CSS v4
- Radix UI + shadcn/ui
- Better Auth
- Drizzle ORM + Neon/PostgreSQL
- Resend（认证邮件发送）

## 目录结构

```txt
app/                  路由与页面（含 API）
components/           通用组件与 UI 组件
lib/                  业务逻辑、服务、工具、认证
db/                   数据库连接
auth-schema.ts        认证相关表结构
drizzle/              数据库迁移
public/               静态资源
styles/               全局样式
```

## 本地开发

```bash
pnpm install
pnpm dev
```

构建与运行：

```bash
pnpm build
pnpm start
```

质量检查：

```bash
pnpm lint
pnpm exec tsc --noEmit
```

## 环境变量

请参考 `.env.example`，至少配置以下项目：

- `DATABASE_URL`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- `NEXT_PUBLIC_APP_URL`
- `RESEND_API_KEY`
- `MAIL_FROM`
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`

## 认证与注册策略

### 1) GitHub 登录行为

- 首次 GitHub 登录：会创建账号（相当于注册）并完成可用身份建立。
- 再次 GitHub 登录：直接登录已有账号。

### 2) 关闭公开注册（当前实现）

目前支持通过环境变量控制：

- `AUTH_ALLOW_SIGN_UP=false`
- `NEXT_PUBLIC_AUTH_ALLOW_SIGN_UP=false`

生效效果：

- 后端拒绝邮箱注册接口（`/api/auth/sign-up/email`）
- 登录页隐藏“去注册”入口
- 注册页显示“注册已关闭”提示
- GitHub 登录禁止隐式注册（仅允许已存在用户登录）

修改后需重启服务。

### 3) 修改邮箱

后台设置页已支持“修改邮箱”：

- 输入新邮箱后发送验证邮件
- 用户点击邮件验证链接后，邮箱才会真正变更

## 后续计划（认证）

- 增加“后台可视化开关注册”能力（管理员在设置页直接开关）
- 使用数据库系统配置项替代环境变量，做到实时生效（无需改 env）

## License

MIT
