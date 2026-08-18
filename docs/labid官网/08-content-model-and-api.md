# Spec 08 — 内容模型与 API 约定

## 1. 目标
定义稳定的数据边界，让前端页面、CMS 与后端实现解耦。技术栈可由 Codex 根据现有项目决定，但数据语义必须保持一致。

## 2. SiteSettings
```ts
type SiteSettings = {
  siteName: string
  logoUrl?: string
  hero: HeroContent
  product: ProductContent
  contact: ContactContent
  footer: FooterContent
}
```

## 3. HeroContent
```ts
type HeroContent = {
  eyebrow?: string
  title: string
  description: string
  primaryCta: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
  media?: MediaAsset
}
```

## 4. ProductContent
```ts
type ProductContent = {
  title: string
  description?: string
  values: ProductValue[]
}

type ProductValue = {
  id: string
  title: string
  description: string
  media?: MediaAsset
  sortOrder: number
  enabled: boolean
}
```

V1 默认三项价值：
- AI 自动识别与梳理科研工作；
- 形成研究脉络与科研叙事；
- 所见即所得后台持续更新。

## 5. DemoCase
```ts
type DemoCase = {
  id: string
  discipline: string
  teamScale: string
  description?: string
  cover: MediaAsset
  url: string
  sortOrder: number
  enabled: boolean
  createdAt: string
  updatedAt: string
}
```

默认 seed 数据：
- 生命科学 / 大型研究团队 / https://demo-life.labid.cn/
- 化学 / 中型课题组 / https://demo-chem.labid.cn/
- 材料学 / 小型课题组 / https://demo-materials.labid.cn/

## 6. ContactContent
```ts
type ContactContent = {
  title: string
  description?: string
  phone?: string
  email?: string
  responseSlaText: string
  successText: string
}
```

默认 `responseSlaText` 必须表达 48 小时内联系。

## 7. FooterContent
```ts
type FooterContent = {
  icp: string
  copyrightOwner: string
  copyrightYearMode: "current" | "fixed"
  fixedYear?: number
}
```

默认：
- `icp = "粤 ICP 备 2026073823 号"`
- `copyrightOwner = "深圳市深瞻科技有限公司"`

## 8. Lead
```ts
type Lead = {
  id: string
  school: string
  department: string
  name: string
  contact: string
  message: string
  status: "new" | "contacted" | "closed"
  source?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  createdAt: string
  updatedAt: string
}
```

通知投递使用独立的 `lead_deliveries` 表，通过 `lead_id` 关联 Lead，字段包含 `channel`、`destination`、`status`、`attempts` 与 `last_error`。渠道名称为开放字符串，不为邮件、短信之外的后续渠道修改主表结构。

## 9. MediaAsset
```ts
type MediaAsset = {
  id?: string
  url: string
  alt: string
  width?: number
  height?: number
  mimeType?: string
}
```

## 10. 建议 API
公开：
- `GET /api/site`
- `GET /api/cases`
- `POST /api/leads`

后台：
- `GET /api/admin/site`
- `PUT /api/admin/site`
- `GET /api/admin/cases`
- `POST /api/admin/cases`
- `PUT /api/admin/cases/:id`
- `DELETE /api/admin/cases/:id`
- `GET /api/admin/leads`
- `GET /api/admin/leads/:id`
- `PATCH /api/admin/leads/:id/status`
- 图片上传接口按实际对象存储方案定义。

如果使用框架 server actions / RPC，不要求机械实现 REST，但能力必须等价。

## 11. 错误返回
统一错误模型：
```ts
type ApiError = {
  code: string
  message: string
  fieldErrors?: Record<string, string>
}
```

前端不得直接显示数据库或服务端堆栈。

## 12. 环境变量
至少：
- 数据库连接；
- 邮件发送服务配置；
- `LEAD_NOTIFICATION_EMAIL=276238375@qq.com`
- 对象存储配置；
- 管理后台认证密钥。

敏感变量不得提交到 Git。

## 13. 验收标准
- 页面不依赖散落硬编码获取内容；
- 三个案例 seed 数据准确；
- Lead 数据结构覆盖需求中的五项信息；
- CMS 与公开站点使用同一内容来源；
- API 有稳定错误结构。
