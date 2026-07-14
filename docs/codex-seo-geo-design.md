# Codex 页面 SEO/GEO 增强设计

## 目标

在不改动原首页内容、原首页 SEO/GEO 规则和 Codex 页面现有转化流程的前提下，提高 `/codex/` 对中文搜索引擎和 AI 答案引擎的可抓取性、语义明确度与可引用性。

主要搜索意图：

- Codex 怎么安装
- Codex Windows 安装
- Codex macOS 安装
- Codex 手机怎么用
- Codex 远程安装服务

## 范围与约束

- 只修改 `codex/index.html`、`codex/style.css` 和 `tests/site-checks.mjs`。
- 不修改根目录 `index.html`、`robots.txt`、`sitemap.xml`、`llms.txt` 或现有首页 SEO/GEO 文案。
- 不创建或恢复 `docs/superpowers`。
- 保留现有视觉风格、价格、FAQ、微信二维码、预约弹窗和交互。
- 不虚构客户评价、服务数量、作者资质或 OpenAI 官方合作关系。

## 页面内容设计

在现有“Codex 怎么安装”四步指南之后增加一个语义化平台对照表，标题为“Windows、macOS 和手机怎么用 Codex”。表格包含“设备”、“使用方式”、“小白需要准备”三列，明确表达：

- Windows 与 macOS 通过 ChatGPT 桌面应用登录、选择 Codex 并授权项目文件夹。
- iPhone 与安卓手机通过 ChatGPT 移动应用的远程入口查看、批准和继续受支持的桌面任务，不表述为手机本地独立运行完整桌面 Codex。

表格下方增加简短服务声明：本站提供独立的第三方远程安装与使用指导，与 OpenAI 无隶属或官方合作关系；产品功能、计划权益和系统要求以 OpenAI 官方说明为准。

## 结构化数据与 AI 可引用性

在现有 JSON-LD `@graph` 中：

- 为 `WebPage` 增加 `datePublished: 2026-07-14`，保留 `dateModified: 2026-07-14`。
- 增加 `about` 指向独立的 `SoftwareApplication` 节点，名称为 OpenAI Codex，并使用 OpenAI 官方 Codex 页作为 `sameAs`。
- 为 `WebPage` 增加 `citation` 数组，引用 OpenAI 的 Codex 入门、桌面应用、移动端与 ChatGPT 计划说明，仅使用已在官方站点核对的 URL。
- 对 `Service` 与服务提供方的描述中明确“独立第三方”，且与页面可见声明保持一致。
- 保留 `FAQPage`、`Service`、`BreadcrumbList` 和实际价格，不声称可获得特定搜索富结果。

对页面中两张非首屏微信二维码增加 `loading="lazy"` 和 `decoding="async"`，不更换图片。

## 样式与响应式

对照表沿用当前编辑式手册风格：纸张底色、细黑边框、钴蓝重点标识。桌面端使用三列表格；手机端转为纵向信息块，不产生水平滚动。新增声明保持低干扰，但必须可见、可读。

## 验证

- 先在 `tests/site-checks.mjs` 增加新内容、声明、JSON-LD 字段、引用链接和图片加载属性的断言，确认测试先失败。
- 实施后运行全量站点检查，验证 JSON-LD 可正常解析。
- 在 1280px 桌面宽度和 390px 手机宽度检查对照表、导航、价格和预约弹窗，要求无水平溢出、无控制台错误。
- 检查 Git diff，确认原首页与全局 SEO/GEO 文件未改动，`.superpowers/` 未纳入提交。

## 成功标准

- 搜索引擎与 AI 系统能从页面直接提取安装步骤、平台差异、手机使用边界、服务价格和第三方身份。
- 主要中文搜索意图在标题、正文、问答或表格中自然覆盖，不做关键词堆砌。
- 结构化数据与可见页面内容完全一致。
- 不承诺排名或收录时间；发布后另行通过搜索资源平台提交 URL。
