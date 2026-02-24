# AIGC Wiki

> AI图片卡片展示网站 - 展示AI生成图片及其详细参数

[![Deploy on Cloudflare Pages](https://img.shields.io/badge/Deploy-Cloudflare%20Pages-F38020?logo=cloudflare)](https://pages.cloudflare.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)

## 功能特点

- **响应式布局** - 自适应卡片网格，支持各种屏幕尺寸
- **参数展示** - 点击卡片查看完整生成参数（模型、采样器、CFG、VAE、LoRA等）
- **管理后台** - 通过UI界面管理卡片，无需修改代码
- **文件上传** - 支持图片上传和预览
- **安全认证** - JWT会话管理，管理员权限控制

## 快速开始

### 环境要求

- Node.js 18+
- npm 或 yarn

### 安装

```bash
npm install
```

### 配置

复制环境变量文件：

```bash
cp .env.example .env
```

编辑 `.env` 文件，配置：
- `JWT_SECRET` - JWT密钥（生产环境必须更换）
- `ADMIN_USERNAME` - 管理员用户名
- `ADMIN_PASSWORD` - 管理员密码

### 初始化数据库

```bash
npm run db:generate  # 生成Prisma客户端
npm run db:push      # 创建数据库表
npm run db:seed      # 创建管理员账户
```

### 开发

```bash
npm run dev
```

访问 http://localhost:3000

## 管理员登录

- 登录地址: http://localhost:3000/login
- 默认账号: `admin`
- 默认密码: `admin123`

**⚠️ 生产环境请务必修改默认密码**

## 目录结构

```
src/
├── app/
│   ├── page.tsx              # 首页（卡片展示）
│   ├── layout.tsx            # 全局布局
│   ├── globals.css           # 全局样式
│   ├── login/                # 登录页面
│   ├── admin/cards/          # 管理面板
│   └── api/                  # API路由
│       ├── auth/             # 认证接口
│       ├── cards/            # 卡片CRUD
│       └── upload/           # 文件上传
├── components/               # React组件
│   ├── AdminBar.tsx          # 管理员工具栏
│   └── CardModal.tsx         # 卡片详情模态框
├── lib/                      # 工具函数
│   ├── auth.ts               # 认证工具
│   ├── db.ts                 # 数据库连接
│   └── middleware.ts         # API中间件
└── types/                    # TypeScript类型
prisma/
├── schema.prisma             # 数据库模型
└── seed.ts                   # 种子数据
```

## API接口

| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| POST | /api/auth/login | 管理员登录 | 否 |
| POST | /api/auth/logout | 登出 | 否 |
| GET | /api/auth/me | 检查登录状态 | 否 |
| GET | /api/cards | 获取卡片列表 | 否 |
| GET | /api/cards/:id | 获取卡片详情 | 否 |
| POST | /api/cards | 创建卡片 | 是 |
| PUT | /api/cards/:id | 更新卡片 | 是 |
| DELETE | /api/cards/:id | 删除卡片 | 是 |
| POST | /api/upload | 上传文件 | 是 |

## 部署

### Vercel（推荐）

```bash
npm install -g vercel
vercel
```

### Cloudflare Pages

1. 推送代码到 GitHub
2. 在 Cloudflare Dashboard 创建 Pages 项目
3. 连接 GitHub 仓库
4. 构建命令: `npm run build`
5. 输出目录: `.next`
6. 配置环境变量

**注意**: Cloudflare Pages 需要配置 D1 数据库或外部数据库。

### 生产环境配置

生产环境必须配置：

1. 更换 `JWT_SECRET` 为强随机字符串
2. 修改默认管理员密码
3. 配置生产数据库（PostgreSQL 推荐）

## 技术栈

| 技术 | 用途 |
|------|------|
| Next.js 14 | 全栈框架 |
| TypeScript | 类型安全 |
| Tailwind CSS | 样式 |
| Prisma | ORM |
| SQLite/PostgreSQL | 数据库 |
| JWT | 会话管理 |

## License

[MIT](LICENSE)
