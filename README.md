# Lab ID 官网

一期官网为零依赖静态站点，入口文件为 `index.html`，品牌理念图位于 `assets/`。

## 本地预览

直接打开 `index.html`，或在当前目录启动任意静态服务。

## 阿里云 OSS 部署

本项目已配置 GitHub Actions：推送到 `main` 分支后，自动同步静态文件到阿里云 OSS。

### 1. 创建 OSS Bucket

在阿里云 OSS 创建一个 Bucket，建议：

- Bucket 名称：可使用 `labid-official-site` 或你偏好的唯一名称
- 地域：选择离用户更近的地域，例如 `oss-cn-shenzhen`
- 读写权限：公共读
- 静态页面：
  - 默认首页：`index.html`
  - 默认 404 页：`404.html`

### 2. 绑定域名

在 OSS Bucket 的传输管理或域名管理中绑定自定义域名：

```text
www.labid.cn
```

按阿里云提示到 DNS 服务商添加 CNAME 解析。若域名 DNS 也在阿里云云解析中，添加一条记录：

```text
记录类型：CNAME
主机记录：www
记录值：阿里云 OSS 提供的 Bucket 外网域名或绑定向导给出的 CNAME 值
```

### 3. 配置 GitHub

在 GitHub 仓库中进入 `Settings -> Secrets and variables -> Actions`。

添加 Secrets：

```text
ALIYUN_ACCESS_KEY_ID
ALIYUN_ACCESS_KEY_SECRET
```

添加 Variables：

```text
ALIYUN_OSS_REGION=cn-shenzhen
ALIYUN_OSS_BUCKET=你的 OSS Bucket 名称
```

如果你的 Bucket 不在深圳地域，请把 `ALIYUN_OSS_REGION` 改成实际地域，例如 `cn-hangzhou`。

### 4. 推送并发布

初始化 Git 仓库并推送到 GitHub：

```bash
git init
git branch -M main
git add .
git commit -m "Initial Lab ID official website"
git remote add origin https://github.com/<your-account>/<your-repo>.git
git push -u origin main
```

推送后 GitHub Actions 会自动运行 `Deploy to Alibaba Cloud OSS`。

## 页面合规信息

页面 Footer 展示备案号：

```text
粤ICP备2026073823号
```

点击备案号会在新窗口打开：

```text
https://beian.miit.gov.cn
```
