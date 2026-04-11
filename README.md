# Vanadium Toolbox

一个基于 Tauri + React + TypeScript 开发的跨平台桌面应用工具集。

## 项目简介

Vanadium Toolbox 是一个现代化的跨平台桌面应用，提供了一系列实用工具和功能，帮助用户提高工作效率。

## 功能特性

- **主题切换**：支持亮色/暗色主题
- **多语言支持**：中文和英文界面
- **模块化设计**：清晰的代码结构，易于扩展
- **跨平台**：支持 Windows、macOS 和 Linux
- **轻量级**：基于 Tauri 框架，占用资源少

## 技术栈

- **前端**：React + TypeScript + Vite + Ant Design
- **后端**：Rust (Tauri)
- **状态管理**：React useState/useEffect
- **路由**：React Router
- **国际化**：i18n
- **配置管理**：本地配置文件

## 安装和运行

### 前提条件

- Node.js (v16+)
- Rust (v1.60+)
- Tauri CLI

### 安装依赖

```bash
npm install
```

### 开发模式运行

```bash
npm run tauri dev
```

### 构建生产版本

```bash
npm run tauri build
```

## 项目结构

```
vanadium-toolbox/
├── src/                # 前端源代码
│   ├── assets/         # 静态资源
│   ├── locales/        # 国际化文件
│   ├── pages/          # 页面组件
│   ├── styles/         # 样式文件
│   ├── templates/      # 模板组件
│   ├── utils/          # 工具函数
│   ├── App.tsx         # 应用主组件
│   ├── i18n.ts         # 国际化配置
│   └── main.tsx        # 应用入口
├── src-tauri/          # Tauri 后端代码
│   ├── src/            # Rust 源代码
│   ├── Cargo.toml      # Rust 依赖配置
│   └── tauri.conf.json # Tauri 配置
├── package.json        # 前端依赖配置
└── README.md           # 项目说明
```

## 核心功能模块

### 1. 配置管理
- 主题设置
- 语言设置
- 窗口大小配置

### 2. 国际化
- 支持中文和英文
- 动态语言切换

### 3. 主题系统
- 亮色主题
- 暗色主题
- 主题状态持久化

## 贡献指南

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 打开 Pull Request

## 许可证

MIT License

## 联系我们

如有问题或建议，请通过 GitHub Issues 反馈。
