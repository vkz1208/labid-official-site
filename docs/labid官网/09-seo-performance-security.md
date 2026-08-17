# Spec 09 — SEO、性能、可访问性与安全

## 1. SEO 目标
V1 需要具备基础可索引能力，让搜索引擎理解 LabID 的品牌、目标用户和核心产品。

## 2. Metadata
至少配置：
- `<title>`
- meta description
- canonical
- Open Graph
- favicon
- sitemap
- robots.txt

建议 title 结构：
`LabID | AI 时代的学术数字身份`

具体营销文案可在上线前调整。

## 3. 结构化语义
- 只使用一个 H1；
- Section 使用 H2；
- 案例卡片标题语义清晰；
- Header / main / section / footer 正确使用；
- 联系表单有 label。

可视情况增加 Organization JSON-LD，但不得编造机构信息。

## 4. 性能
目标：
- 首屏关键资源优先加载；
- 非关键图片 lazy load；
- 图片响应式；
- WebP/AVIF；
- 避免超大 JS bundle；
- 避免首页引入重量级动画库，仅为简单 fade/hover 服务；
- 字体减少阻塞。

建议以 Core Web Vitals 为优化方向。

## 5. 图片稳定性
所有主要图片设置：
- width / height 或 aspect-ratio；
- alt；
- object-fit；
- 加载失败 fallback。

避免 CLS。

## 6. 可访问性
- 键盘可以操作导航、CTA、案例与表单；
- focus ring 可见；
- 正常字号下对比度达标；
- 图片 alt 合理；
- 错误信息和字段绑定；
- 成功提示可被 screen reader 感知；
- 支持 reduced motion。

## 7. 安全
### Contact Form
- 服务端验证；
- rate limit；
- 防机器人 honeypot；
- 防 SQL/NoSQL 注入由 ORM/parameterized query 保证；
- 输出转义防 XSS；
- 不信任任何客户端字段。

### CMS
- 所有管理 API 鉴权；
- secure session cookie；
- 生产环境 HTTPS；
- 登录暴力尝试限制；
- 文件上传类型与大小限制；
- 管理页面 `noindex`。

### Secrets
- 不得在仓库写入邮件密码、数据库密码、管理员密码；
- 使用环境变量；
- 提供 `.env.example`，只保留变量名。

## 8. 隐私
表单只收集开展联系所需信息。
页面应以简短提示告知用户提交的信息用于联系 LabID。

若未来增加统计平台，需避免无必要采集敏感信息。

## 9. 错误监控
建议接入轻量错误监控。
至少记录：
- 表单后端异常；
- 邮件发送失败；
- CMS 写入失败；
- 关键外部服务错误。

## 10. Analytics
V1 可以接入基础 Web Analytics，用于：
- 首页访问；
- 案例点击；
- Contact CTA 点击；
- 表单开始；
- 表单成功。

事件名称建议：
- `case_view`
- `contact_cta_click`
- `lead_form_start`
- `lead_submit_success`
- `lead_submit_error`

不得为了埋点阻塞核心页面。

## 11. 验收标准
- 基础 SEO metadata 完整；
- Lighthouse/等价工具无严重可访问性问题；
- 关键图片已优化；
- 管理后台不可索引；
- 表单无法绕过服务端校验；
- secrets 不进入代码仓库；
- 关键转化事件可被统计。
