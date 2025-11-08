# PS5 Reservation Frontend

PS5 Reservation 是一套极简的预约系统，用于管理单台/少量 PS5 的时段预约、人工核验支付以及订单状态追踪。当前仓库仅包含前端代码，基于 **Vite + Vue 3 + Pinia + Vue Router** 实现单页应用（SPA），后端（Go + Gin + MySQL）将于后续补充。

## 仓库结构


```
.
├── README.md                # 项目说明
└── frontend/                # Vite + Vue 3 前端工程
    ├── index.html           # Vite 入口 HTML
    ├── package.json         # 依赖与脚本
    ├── vite.config.js       # Vite 配置（含路径别名）
    └── src/
        ├── App.vue          # 根组件
        ├── main.js          # 应用入口，挂载 Pinia 与 Router
        ├── router/          # 路由定义（预约、支付、订单列表、订单详情）
        ├── components/      # 通用组件（时段网格、倒计时、凭证上传等）
        ├── pages/           # 页面视图
        ├── services/        # REST API 请求封装
        ├── store/           # Pinia 状态（鉴权、时段、订单）
        ├── utils/           # 时间处理、提示工具
        └── styles/          # 全局样式与主题变量
```

## 快速开始

1. 安装依赖：
   ```bash
   cd frontend
   npm install
   ```

2. 启动开发服务器（默认 http://localhost:5173）：
   ```bash
   npm run dev
   ```

   前端会直接以 SPA 形式运行，适合在桌面浏览器中调试。若需要联调后端接口，可在运行命令前设置 `VITE_API_BASE_URL` 环境变量指向后端服务，例如：
   ```bash
   VITE_API_BASE_URL=https://api.example.com npm run dev
   ```

3. 构建生产包：
   ```bash
   npm run build
   ```

4. 预览构建结果：
   ```bash
   npm run preview
   ```

### 模拟登录

由于浏览器环境无法直接调用微信 `wx.login`，前端在没有现成 Token 时会尝试读取环境变量 `VITE_MOCK_WECHAT_CODE` 并调用 `POST /api/auth/wechat/login`。开发阶段可在 `.env.local` 中写入：

```
VITE_MOCK_WECHAT_CODE=your-mock-code
```

后端收到后返回 `{ token, user }` 即可完成前端鉴权逻辑。实际接入小程序时，可将该流程替换为真实的微信登录。

## 开发提示

- REST 请求统一封装在 `src/services/http.js` 中，使用 `fetch` 实现，自动附带 `Authorization` 头并维护服务器时间偏移。
- 图片上传（支付凭证）通过标准 `multipart/form-data` 完成，可直接对接任意支持表单上传的后端接口。
- UI 采用轻量级自定义样式，未引入第三方组件库，便于后续根据视觉稿替换或扩展。
- 预约逻辑遵循需求文档：72 小时窗口、整点粒度、订单锁定、凭证上传与状态流转等，可在 `src/pages` 中查看完整交互。

## 后续计划

待后端脚手架提交后，将补充：

- Gin + MySQL 服务端实现（鉴权、预约、订单、后台核验等接口）。
- 数据迁移与示例种子数据。
- 自动化测试、Lint 与 CI 配置。

欢迎提交 Issue 或 PR 讨论需求细节与技术实现。
