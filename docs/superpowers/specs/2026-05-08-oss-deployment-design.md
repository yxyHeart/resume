# 阿里云 OSS 静态托管部署设计

## 背景

简历生成器是一个纯前端 SPA（React 19 + Vite），无后端、无 API、无环境变量。构建产物为静态文件（`dist/`），适合静态网站托管。项目仓库在 GitHub (`yxyHeart/resume`)，需部署到阿里云 OSS 供个人使用。

## 架构

```
GitHub (yxyHeart/resume)  →  push to main
  → GitHub Actions
    → npm run build (dist/)
    → ossutil sync dist/ → OSS bucket
      → 静态网站托管 → 用户访问
```

## OSS 配置（手动，控制台操作）

- **Bucket 名称**：自定义（如 `resume-builder`）
- **地域**：选离用户近的（如 `oss-cn-shenzhen`）
- **存储类型**：标准存储
- **读写权限**：公共读（静态网站必须公开访问）
- **静态网站托管**：
  - 默认首页：`index.html`
  - 默认 404 页：`index.html`（SPA 路由兜底，虽然当前无路由，但预防未来添加）
- **访问地址**：`<bucket-name>.oss-cn-<region>.aliyuncs.com`
- **无需自定义域名**

## RAM 访问控制

为 GitHub Actions 创建专用 RAM 子账号：

- **权限**：仅 `AliyunOSSFullAccess`（或更精细地限制到该 bucket）
- **生成 AccessKey**：保存 `AccessKey ID` 和 `AccessKey Secret`
- **GitHub Secrets 配置**：
  - `OSS_ACCESS_KEY_ID`
  - `OSS_ACCESS_KEY_SECRET`
  - `OSS_BUCKET`（bucket 名称）
  - `OSS_REGION`（如 `oss-cn-shenzhen`）

## GitHub Actions Workflow

文件：`.github/workflows/deploy.yml`

- **触发**：push 到 `main`
- **步骤**：
  1. Checkout 代码
  2. Setup Node.js 20
  3. `npm ci`
  4. `npm run build`
  5. 安装 ossutil（阿里云官方 CLI）
  6. `ossutil sync dist/ oss://<bucket>/ --force` 同步到 OSS

## 代码改动

- **新增**：`.github/workflows/deploy.yml`
- **无其他代码改动**：`vite.config.ts` 的 `base` 保持默认 `/`，因为 OSS 静态托管是根路径访问

## 费用

OSS 静态托管费用极低：
- 存储：约 0.12 元/GB/月（dist 通常 < 5MB）
- 流量：外网流出约 0.50 元/GB（个人用流量极小）
- 请求：几乎可忽略
- **预估**：< 1 元/月

## 验证方式

1. 在 GitHub 仓库 Settings → Secrets 中配置 4 个 Secrets
2. Push 代码到 main 分支
3. 在 GitHub Actions 页面查看 workflow 运行状态
4. 访问 OSS 静态网站地址，确认页面正常加载
5. 测试所有功能：表单输入、预览更新、PDF 导出、JSON 导入导出
