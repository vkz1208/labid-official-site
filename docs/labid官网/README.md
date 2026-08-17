# LabID 官网 Spec 文档集

本目录用于指导 Codex 完成 LabID 官网 V1 的设计与开发。

## 产品一句话
LabID 是面向高校 PI 与研究团队的 AI 时代学术数字身份服务。V1 重点展示“AI 自动梳理科研工作 + 所见即所得持续管理”的课题组学术主页产品，并承担商业转化与获客。

## V1 核心原则
1. 官网 V1 只做单页主页，不建设独立二级页面。
2. 官网必须有一个简单 CMS 后台，便于非技术人员维护首页内容。
3. 视觉参考 OpenAI 与 Google DeepMind 官网：克制、现代、留白充分、排版有呼吸感。
4. 目标用户是高校 PI / 研究团队负责人，不以学生为核心用户。
5. 官网不是“免费试用”页面，而是正式商业产品官网；文案与交互不得暗示免费试用。
6. 三个虚拟案例必须作为核心产品证据展示。
7. 联系表单提交后，线索需发送至指定邮箱，并明确提示官方将在 48 小时内联系。
8. 所有首页主要内容应尽可能支持 CMS 配置，而不是硬编码。

## 文档目录
- `01-product-scope-and-principles.md`：产品范围、用户、核心约束
- `02-homepage-information-architecture.md`：首页结构、导航与页面流
- `03-visual-design-system.md`：视觉风格、排版、卡片、响应式与动效
- `04-hero-and-product-story.md`：首屏与产品说明区
- `05-demo-cases.md`：三类虚拟案例展示与跳转
- `06-contact-and-lead-form.md`：联系我们、表单、邮件通知
- `07-cms-admin.md`：CMS 管理后台
- `08-content-model-and-api.md`：内容模型、数据结构、接口约定
- `09-seo-performance-security.md`：SEO、性能、可访问性、安全与监控
- `10-acceptance-and-delivery.md`：开发阶段、验收标准与交付清单

## 实施顺序建议
建议 Codex 按 `01 → 02 → 03 → 08 → 04 → 05 → 06 → 07 → 09 → 10` 的顺序执行。

## 固定业务信息
- 生命科学 · 大型研究团队：https://demo-life.labid.cn/
- 化学 · 中型课题组：https://demo-chem.labid.cn/
- 材料学 · 小型课题组：https://demo-materials.labid.cn/
- 表单收件邮箱：276238375@qq.com
- 备案信息：粤 ICP 备 2026073823 号
- 版权所有：深圳市深瞻科技有限公司
