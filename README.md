# Drama - 影视在线播放平台

一个基于 Next.js 构建的现代化影视在线播放平台，支持视频搜索、分类浏览、热门推荐等功能。

## ✨ 功能特性

- 🎬 **视频播放** - 支持剧集在线播放，使用 ArtPlayer 播放器
- 🔍 **搜索功能** - 支持关键词搜索影视资源
- 📂 **分类浏览** - 按类型分类浏览影视内容
- 🔥 **热门推荐** - 展示热门影视资源
- 🌙 **主题切换** - 支持明暗主题切换
- 📱 **响应式设计** - 适配各种设备屏幕

## 🛠️ 技术栈

- **框架**: Next.js 16 (App Router)
- **语言**: TypeScript
- **UI 组件**: Radix UI + shadcn/ui
- **样式**: Tailwind CSS v4
- **播放器**: ArtPlayer
- **主题**: next-themes
- **日期处理**: date-fns

## 📁 项目结构

```
drama/
├── app/                    # Next.js App Router
│   ├── (home)/            # 首页模块
│   ├── @modal/            # 模态框 (并行路由)
│   ├── api/               # API 路由
│   ├── categories/        # 分类页面
│   ├── detail/            # 详情页面
│   ├── hot/               # 热门页面
│   ├── search/            # 搜索页面
│   └── user/              # 用户模块
├── components/            # 公共组件
│   ├── ui/               # UI 基础组件
│   ├── drama/            # 影视相关组件
│   ├── layout/           # 布局组件
│   └── player/           # 播放器组件
├── config/               # 配置文件
├── constants/            # 常量定义
├── lib/                  # 工具库
│   ├── services/        # API 服务
│   └── types/           # 类型定义
└── styles/              # 全局样式
```

## 🚀 快速开始

### 环境要求

- Node.js 18+
- pnpm (推荐)

### 安装依赖

```bash
pnpm install
```

### 配置环境变量

创建 `.env.local` 文件并配置 API 地址：

```env
ZY_BASE_URL=your_api_base_url
```

### 启动开发服务器

```bash
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本

```bash
pnpm build
pnpm start
```

## 📡 API 接口

项目通过 `ApiService` 类封装了以下接口：

| 接口 | 方法 | 描述 |
|------|------|------|
| `/list` | `getList()` | 获取影视列表 |
| `/search` | `search()` | 搜索影视 |
| `/detail/:id` | `getDetail()` | 获取影视详情 |
| `/hot` | `getHot()` | 获取热门影视 |
| `/types` | `getTypes()` | 获取分类列表 |

## 📊 开发进度

### ✅ 已完成功能

| 功能 | 说明 |
|------|------|
| 首页列表 | 分页展示影视列表 |
| 视频搜索 | 关键词搜索，支持分页 |
| 分类浏览 | 按类型筛选，支持分页 |
| 热门推荐 | 展示热门影视资源 |
| 视频详情 | 展示影视信息、演员、导演等 |
| 视频播放 | ArtPlayer 播放器，支持上下集切换、自动连播、倍速播放 |
| 选集功能 | 剧集选择列表 |
| 主题切换 | 明暗主题切换 |
| 全局搜索 | Header 搜索框 |
| Loading 状态 | Suspense + Skeleton 骨架屏 |
| 模态框路由 | @modal 并行路由 (拦截详情路由) |

### 🚧 待开发功能

| 功能 | 说明 |
|------|------|
| 用户登录/注册 | 用户认证系统 |
| 用户中心 | 个人信息管理 |
| 观看历史 | 记录用户观看历史 |
| 收藏功能 | 收藏喜欢的影视 |
| 评论系统 | 影视评论互动 |
| 评分展示 | 展示豆瓣评分 |
| 移动端导航 | 适配移动设备的导航菜单 |
| 播放记录 | 记住上次观看位置 |

## 📄 License

MIT