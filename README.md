# AIGC Wiki

> AI图片卡片展示网站 - 展示AI生成图片及其详细参数

[![Deploy on Cloudflare Pages](https://img.shields.io/badge/Deploy-Cloudflare%20Pages-F38020?logo=cloudflare)](https://pages.cloudflare.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Pure Static](https://img.shields.io/badge/类型-纯静态-4A90D9)]()

## 功能特点

- **响应式布局** - 自适应卡片网格，支持各种屏幕尺寸
- **参数展示** - 点击卡片查看完整生成参数（模型、采样器、CFG、VAE、LoRA等）
- **模块化管理** - 每张卡片独立JSON文件，便于维护和扩展
- **零依赖** - 纯静态实现，无需后端服务，部署简单

## 快速开始

### 本地预览

直接用浏览器打开 `index.html`，或使用本地服务器：

```bash
# Python
python -m http.server 8080

# Node.js
npx serve
```

### 部署到 Cloudflare Pages

1. 将项目推送到 GitHub 仓库
2. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)，进入 Pages
3. 点击「创建项目」→「连接到 Git」
4. 选择仓库和分支
5. 构建设置留空（纯静态项目无需构建命令）
6. 点击「保存并部署」

部署完成后，Cloudflare 会自动分配 `*.pages.dev` 域名。

## 目录结构

```
AIGC_wiki/
├── index.html           # 主页面
├── css/
│   └── style.css        # 样式文件
├── js/
│   └── app.js           # 主逻辑
├── data/
│   └── cards/           # 卡片数据
│       ├── index.json   # 卡片索引
│       └── *.json       # 各卡片数据文件
├── images/
│   ├── thumb/           # 缩略图
│   └── full/            # 原图
└── README.md
```

## 添加新卡片

### 步骤

1. 将图片放入对应目录：
   - 缩略图 → `images/thumb/`
   - 原图 → `images/full/`

2. 在 `data/cards/` 创建 JSON 文件（如 `card-004.json`）

3. 在 `data/cards/index.json` 中添加文件名

### JSON 格式

```json
{
  "id": "unique-id",
  "title": "图片标题",
  "thumbnail": "images/thumb/example.jpg",
  "fullImage": "images/full/example.jpg",
  "model": {
    "name": "模型名称",
    "type": "Checkpoint / LoRA"
  },
  "parameters": {
    "sampler": "DPM++ 2M Karras",
    "cfg": 7.5,
    "steps": 30,
    "vae": "vae-ft-mse-840000",
    "upscaler": "R-ESRGAN 4x+",
    "seed": 123456789,
    "size": "512x768"
  },
  "loras": [
    { "name": "LoRA名称", "weight": 0.8 }
  ],
  "prompt": "正向提示词",
  "negativePrompt": "负面提示词",
  "createdAt": "2024-01-01"
}
```

## 技术栈

| 技术 | 用途 |
|------|------|
| HTML5 | 页面结构 |
| CSS3 (Grid + Flexbox) | 响应式布局 |
| JavaScript (ES6+) | 交互逻辑 |

无框架依赖，最小化实现。

## License

[MIT](LICENSE)
