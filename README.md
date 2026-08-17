# LabID 官网 V1

面向高校 PI 与研究团队的 AI 时代学术数字身份官网。项目包含正式公开单页、销售线索表单和 `/admin` 内容管理后台。

## 已实现

- 响应式单页官网：Hero、产品叙事、虚拟案例、联系表单、页脚；
- 三个预置案例，可在 CMS 中新增、编辑、排序、上下线和删除；
- SQLite 内容与线索持久化；
- 表单前后端校验、honeypot、频率限制、重复提交保护；
- 线索先落库后发 SMTP 邮件，邮件失败不丢失线索；
- 环境变量管理员登录、签名 HttpOnly Session、后台 noindex；
- 首页内容实时预览、案例管理与安全图片上传；
- 线索查看、跟进状态、邮件发送状态与人工重试；
- 登录限流、同源校验、操作审计与未保存内容提醒；
- Metadata、canonical、Open Graph、favicon、robots、sitemap；
- 关键转化事件的轻量第一方统计记录；
- 键盘焦点、表单 label、图片 alt、reduced motion 与移动端菜单；
- Node 单元测试、ESLint、生产构建、Docker 与 CI。

## 技术栈

- Next.js 16 / React 19 / TypeScript
- Node.js 24 内置 SQLite
- Zod
- Nodemailer

Node.js 24 是必需版本，因为项目使用 `node:sqlite`。

## 本地运行

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

打开：

- 官网：`http://localhost:3001`
- CMS：`http://localhost:3001/admin`

数据库会在首次启动时自动创建，并写入默认首页内容与三个案例。默认路径为 `data/labid.db`。

## 环境变量

复制 `.env.example` 并设置：

- `NEXT_PUBLIC_SITE_URL`：正式站点 URL；
- `DATABASE_PATH`：SQLite 文件路径；
- `ADMIN_EMAIL`、`ADMIN_PASSWORD`、`ADMIN_SESSION_SECRET`：CMS 登录；
- `LEAD_NOTIFICATION_EMAIL`：线索收件邮箱，默认业务值为 `276238375@qq.com`；
- `SMTP_*`：邮件服务配置。
- `UPLOAD_DIR`：本地上传目录；
- `UPLOAD_PUBLIC_BASE_URL`：上传图片的公开 URL 前缀。

仓库不包含默认管理员密码或真实 SMTP 密钥。

## 验证

```bash
pnpm lint
pnpm test
pnpm build
```

生产构建使用 standalone 输出：

```bash
node .next/standalone/server.js
```

## Docker 部署

创建不提交到 Git 的 `.env`，然后：

```bash
docker compose up -d --build
```

`labid_data` volume 保存数据库。部署升级时不要删除该 volume，并应定期备份其中的 `labid.db`。
`labid_uploads` volume 保存通过 CMS 上传的案例封面。多实例部署建议改接对象存储。

原先的阿里云 OSS 静态部署不再适用：CMS、数据库和邮件 API 需要持续运行的 Node 服务。静态图片仍可托管在 OSS，并通过 CMS 配置其 HTTPS URL。

## 文档

- 产品与开发规格：[`docs/labid官网/README.md`](docs/labid官网/README.md)
- CMS 使用说明：[`docs/CMS管理说明.md`](docs/CMS管理说明.md)
- 数据库结构：[`db/schema.sql`](db/schema.sql)
