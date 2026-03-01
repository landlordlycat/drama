# Next Drama 🎭

一个基于 **Next.js 16 (App Router)** + **TypeScript** 构建的现代化影视播放与后台管理平台。

---

## ✨ 功能特性

### 🌐 前台功能

- **沉浸式播放**：基于 [ArtPlayer](https://artplayer.org/)，支持多种视频格式、来源切换及播放状态记忆。
- **智能发现**：精选首页支持**触底加载更多**（无限滚动）、多维分类筛选、实时搜索及热门趋势。
- **动态交互**：剧集详情页支持收藏/取消收藏，实时同步至用户中心。
- **响应式设计**：适配 PC 与移动端，提供流畅的跨设备体验。

### 🔐 认证与用户

- **多渠道登录**：支持邮箱注册/登录及 GitHub OAuth 第三方登录。
- **安全体系**：基于 [Better Auth](https://www.better-auth.com/)，提供密码重置、邮箱验证等完整流程。
- **个性化中心**：管理个人资料、查看播放历史、维护收藏列表。

### 📊 管理后台

- **数据可视化**：仪表盘展示播放趋势、用户活跃度及内容统计（基于 Recharts）。
- **内容中台**：全方位的分类、标签、播放源、剧集内容管理。
- **系统审计**：记录关键操作日志，确保系统可追溯性。

---

## 🛠️ 技术栈

| 领域         | 技术方案                        |
| :----------- | :------------------------------ |
| **框架**     | Next.js 16 (App Router)         |
| **语言**     | TypeScript                      |
| **样式**     | Tailwind CSS v4                 |
| **UI 组件**  | Radix UI + shadcn/ui            |
| **认证**     | Better Auth                     |
| **数据库**   | Drizzle ORM + Neon (PostgreSQL) |
| **邮件服务** | Resend                          |
| **播放器**   | ArtPlayer                       |
| **图表**     | Recharts                        |

---

## 📂 目录结构

```txt
drama/
├── app/                  # 路由与页面 (包含 API 路由)
│   ├── (auth)/           # 认证相关页面 (登录、注册、后台)
│   ├── (main)/           # 前台展示页面 (首页、分类、详情)
│   └── api/              # 后端 API 接口
├── components/           # 复用组件
│   ├── drama/            # 业务组件
│   ├── layout/           # 布局组件
│   ├── player/           # 播放器封装
│   └── ui/               # 基础 UI 原子组件 (shadcn)
├── db/                   # 数据库 Schema 与连接配置
├── lib/                  # 核心业务逻辑、服务、工具函数
├── drizzle/              # 数据库迁移脚本
├── public/               # 静态资源
└── styles/               # 全局样式
```

---

## 🚀 快速开始

### 1. 克隆与安装

```bash
git clone <repository-url>
cd next-drama/drama
pnpm install
```

### 2. 配置环境变量

复制 `.env.example` 并重命名为 `.env`，填写必要信息：

```env
# 数据库
DATABASE_URL=

# 认证
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# GitHub OAuth
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# 邮件服务
RESEND_API_KEY=
MAIL_FROM=
```

### 3. 数据库初始化

```bash
pnpm drizzle-kit push
```

### 4. 启动开发服务器

```bash
pnpm dev
```

---

## 🔧 开发规范

- **Lint 检查**：运行 `pnpm lint` 保持代码风格一致。
- **类型检查**：提交前建议运行 `pnpm exec tsc --noEmit`。
- **认证控制**：可通过环境变量 `AUTH_ALLOW_SIGN_UP=false` 关闭公开注册。

---

## 📝 许可证

本项目采用 [MIT License](LICENSE) 许可。
