# PS5 预约小程序前端

本仓库当前聚焦于前端实现，提供两套独立的客户端：

- **微信小程序**：基于 Uni-App（Vue 3 + Composition API）。
- **网页版（H5 / 桌面端）**：基于 Vite + Vue 3 + Pinia + Vue Router。

后端（Go + Gin + MySQL）将在后续版本补充。

## 仓库结构

```
.
├── README.md                 # 项目说明
└── frontend/
    ├── package.json          # Uni-App 工程依赖
    ├── src/                  # 小程序源代码
    ├── uni.scss
    └── h5/                   # Web 端（Vite + Vue 3）工程
        ├── package.json      # 桌面端依赖
        ├── index.html        # SPA 入口
        ├── vite.config.js
        └── src/              # 与小程序一致的业务模块（组件/页面/Store 等）
```

## 微信小程序开发流程

1. 安装依赖

   ```bash
   cd frontend
   npm install
   ```

2. 启动微信小程序编译输出

   ```bash
   npm run dev:mp-weixin
   ```

   该命令会在 `dist/dev/mp-weixin/` 目录生成微信小程序代码，并保持实时监听。

3. 打开微信开发者工具

   - 选择「导入项目」，AppID 使用测试或体验号；
   - 项目目录指向 `frontend/dist/dev/mp-weixin`；
   - 导入后即可在模拟器中预览、调试，支持控制台、网络、Storage 等工具。

4. （可选）构建产物

   ```bash
   npm run build:mp-weixin
   ```

   生成的代码位于 `dist/build/mp-weixin/`，可直接用于上传审核。

### 接口联调

- 默认请求地址为 `http://localhost:3000`，可在启动命令前设置 `VITE_API_BASE_URL`：

  ```bash
  VITE_API_BASE_URL=https://api.example.com npm run dev:mp-weixin
  ```

- 登录流程使用 `uni.login` 获取 `code`，前端调用 `POST /api/auth/wechat/login` 获取 `{ token, user }`。

- 图片上传通过 `uni.uploadFile`，请在微信开发者工具中配置合法的上传域名。

## 功能概览

- **预约页**：展示 72 小时整点时段，可视化可用/占用状态，校验未完成订单上限。
- **支付页**：展示订单号、金额、静态收款二维码与倒计时，支持支付凭证上传（≤3 张）。
- **订单列表**：按状态筛选，支持查看详情、取消订单、再次上传凭证。
- **订单详情**：显示预约与支付信息、凭证预览，并提供操作入口。

所有交互均遵循《需求文档 v0.1》，方便后续与后端联调及迭代。

## 常见问题

- **微信开发者工具提示未找到 app.json**：请先执行 `npm run dev:mp-weixin`，生成 `dist/dev/mp-weixin/app.json` 后再导入项目。
- **依赖安装冲突**：仓库已固定 Uni-App 相关依赖版本为 `3.0.0-alpha-4080420251023001`，如需升级请确保各包版本一致。
- **服务器时间**：前端会根据响应头 `Date` 计算服务器时间偏移，用于倒计时与可预约时间窗口，请确保后端返回该头部。

如需反馈问题或讨论需求，欢迎提交 Issue。后端脚手架准备就绪后，我们将继续补充接口实现与自动化测试。

## 网页版（H5）开发与部署

### 环境准备

```bash
cd frontend/h5
npm install
```

### 本地调试

```bash
# 启动开发服务，默认端口 5173
npm run dev
```

打开浏览器访问 `http://localhost:5173`，即可进入桌面端预约界面。主要差异：

- 针对大屏优化的排版（1120px 容器、渐变背景、卡片化信息展示）。
- Web 端使用原生表单与 `<input type="file">` 实现支付凭证上传，并提供 Toast 通知。 
- 登录流程需要手动输入后端提供的 `code` 或测试口令，便于在无微信环境下调试。

### 接口地址

- 通过环境变量 `VITE_API_BASE_URL` 指向后端：

  ```bash
  VITE_API_BASE_URL=https://api.example.com npm run dev
  ```

- 构建产物默认写入 `dist/`，可托管到任意静态资源服务（Nginx、Vercel、静态网站托管平台等）。

### 构建与部署

```bash
npm run build
# dist/ 目录即为部署资源
```

部署上线后请务必配置 HTTPS，并确保跨域响应头允许浏览器访问后端 API 与文件上传接口。
