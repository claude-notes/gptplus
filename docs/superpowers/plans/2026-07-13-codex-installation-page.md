# Codex Installation Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 新增一个视觉接近参考站、内容沿用 Codex 安装交付服务、使用用户微信二维码且不改动现有首页及 SEO/GEO 文件的 `/codex/` 独立页面。

**Architecture:** 使用独立的 `codex/index.html`、`codex/style.css`、`codex/script.js` 和本地二维码图片实现，不加载现有全局页面资源。静态测试验证内容、价格、资源隔离和交互标记，浏览器验证桌面端、手机端与二维码弹窗行为。

**Tech Stack:** HTML5、原生 CSS、原生 JavaScript、Node.js 静态断言、Python 本地静态服务器、浏览器响应式验证。

---

## 文件结构

- Create: `codex/index.html` — 页面元数据、语义结构、全部 Codex 服务内容。
- Create: `codex/style.css` — 页面独立设计令牌、布局、组件和响应式规则。
- Create: `codex/script.js` — 移动导航、二维码弹窗、焦点恢复和轻量滚动入场。
- Create: `codex/wechat-qr.jpg` — 用户提供的微信二维码原图。
- Modify: `tests/site-checks.mjs` — 增加 Codex 页面静态约束和本地资源检查。

明确不修改：`index.html`、`css/style.css`、`js/script.js`、`robots.txt`、`sitemap.xml`、`llms.txt`、`GEO-ANALYSIS.md` 以及 `html/`、`en/` 下的现有页面。

### Task 1: 为独立页面添加失败的静态验收测试

**Files:**
- Modify: `tests/site-checks.mjs`
- Test: `tests/site-checks.mjs`

- [ ] **Step 1: 在现有测试末尾增加 Codex 页面断言**

新增以下逻辑，先读取尚不存在的页面和资源：

```js
const codexFiles = [
  'codex/index.html',
  'codex/style.css',
  'codex/script.js',
  'codex/wechat-qr.jpg',
];

for (const relativePath of codexFiles) {
  await assert.doesNotReject(
    access(path.join(root, relativePath)),
    `Codex page asset should exist: ${relativePath}`,
  );
}

const codexHome = await read('codex/index.html');
assert.match(codexHome, /<html lang="zh-CN">/);
assert.match(codexHome, /<link rel="canonical" href="https:\/\/www\.gptplus\.uno\/codex\/">/);
assert.match(codexHome, /href="#market"/);
assert.match(codexHome, /href="#service"/);
assert.match(codexHome, /href="#pricing"/);
assert.match(codexHome, /href="#faq"/);
assert.match(codexHome, /class="[^\"]*qr-trigger[^\"]*"[^>]*>\s*GPT Plus/);
assert.match(codexHome, /id="wechat-float"/);
assert.match(codexHome, /id="qr-modal"/);
assert.match(codexHome, /id="contact"/);
assert.match(codexHome, /src="wechat-qr\.jpg"/);
assert.match(codexHome, /基础安装包/);
assert.match(codexHome, /¥599/);
assert.match(codexHome, /标准跑通包/);
assert.match(codexHome, /¥999/);
assert.match(codexHome, /进阶工作流包/);
assert.match(codexHome, /¥1999/);
assert.match(codexHome, /团队小班包/);
assert.match(codexHome, /¥4999/);
assert.doesNotMatch(codexHome, /(?:href|src)="https?:\/\/qimuai\.cn/i);
assert.match(codexHome, /href="style\.css"/);
assert.match(codexHome, /src="script\.js"/);

const codexScript = await read('codex/script.js');
assert.match(codexScript, /aria-expanded/);
assert.match(codexScript, /classList\.add\('is-open'\)/);
assert.match(codexScript, /event\.key === 'Escape'/);
assert.match(codexScript, /lastTrigger\.focus\(\)/);
```

- [ ] **Step 2: 运行测试并确认它因新页面不存在而失败**

Run: `node tests/site-checks.mjs`

Expected: FAIL，错误指向 `codex/index.html` 或 `Codex page asset should exist`，而不是语法错误。

- [ ] **Step 3: 提交测试红灯**

```bash
git add tests/site-checks.mjs
git commit -m "test: define codex landing page requirements"
```

### Task 2: 创建二维码资源与语义完整的页面结构

**Files:**
- Create: `codex/index.html`
- Create: `codex/wechat-qr.jpg`
- Test: `tests/site-checks.mjs`

- [ ] **Step 1: 创建目录并复制用户二维码原图**

```bash
mkdir -p codex
cp "/Users/zt/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/wxid_4xumfi32xm5w22_4bb6/temp/RWTemp/2026-07/aec80556ed816c864073c40107b26819/973fa5d55ac4d99bfd7332df0617c0d5.jpg" codex/wechat-qr.jpg
```

- [ ] **Step 2: 创建独立 HTML**

`codex/index.html` 必须包含以下确定结构：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Codex 安装交付服务｜Windows、macOS 与手机 App 远程安装</title>
  <meta name="description" content="Codex 一对一远程安装交付服务，支持 Windows、macOS、安卓和苹果手机 App，包含 ChatGPT Plus 权益准备、首次任务跑通与售后答疑。">
  <link rel="canonical" href="https://www.gptplus.uno/codex/">
  <meta property="og:type" content="website">
  <meta property="og:title" content="Codex 安装交付服务">
  <meta property="og:description" content="599 元起，一对一完成 Codex 多端安装、账号检查和首次任务跑通。">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header class="site-header">
    <nav class="nav-shell" aria-label="主导航">
      <a class="brand" href="#top" aria-label="Codex 安装交付服务首页"><span class="brand-mark">Cx</span><span>Codex 安装交付服务</span></a>
      <button class="menu-toggle" type="button" aria-controls="site-menu" aria-expanded="false">菜单</button>
      <div class="site-menu" id="site-menu">
        <a href="#market">为什么选我们</a><a href="#service">服务内容</a><a href="#pricing">套餐价格</a><a href="#faq">FAQ</a>
        <a class="nav-plus qr-trigger" href="#contact">GPT Plus</a>
      </div>
    </nav>
  </header>
  <main id="top">
    <section class="hero">
      <div class="container hero-grid">
        <div><p class="eyebrow">599 元起｜1 对 1 远程交付｜装不好直接退款</p><h1>一次装好 Codex</h1><p>帮你一次装好 Codex，支持 Windows 版本、macOS（苹果电脑）版本、安卓手机 App 和苹果手机 App。赠送 1 个月 ChatGPT Plus，手机端可随时随地远程指挥 Codex 帮你干活。</p><div class="hero-actions"><a class="button button-primary" href="#contact">预约远程安装</a><a class="button button-ghost" href="#pricing">查看套餐价格</a></div></div>
        <div class="delivery-demo" aria-label="Codex 交付界面示意"><strong>电脑端安装</strong><p>Windows / macOS 版本已完成登录</p><p>ChatGPT Plus 权益检查通过</p><p>首次任务已跑通，可开始验收</p></div>
      </div>
    </section>
    <section class="section section-mist" id="market"><div class="container"><p class="section-kicker">为什么选我们</p><h2>你不缺教程，缺的是今天就能用起来</h2><div class="reason-grid"><article><span>1</span><h3>不用自己反复试错</h3><p>我们直接检查你的设备环境，选择更稳的安装路线。</p></article><article><span>2</span><h3>避开共享账号风险</h3><p>不推荐共享账号、黑卡订阅或来路不明的低价拼车。</p></article><article><span>3</span><h3>装完马上验收</h3><p>你要亲眼看到 Codex 能登录、读取项目并完成真实任务。</p></article></div></div></section>
    <section class="section" id="service"><div class="container"><p class="section-kicker">服务内容</p><h2>从安装到第一次能用，全部陪你走完</h2><div class="service-grid"><article><h3>设备与系统检查</h3><p>确认 Windows、macOS、安卓手机或苹果手机环境。</p></article><article><h3>账号与 Plus 准备</h3><p>完成 ChatGPT 账号登录、Plus 权益准备和 Codex 可用性检查。</p></article><article><h3>Codex 多端安装</h3><p>安装电脑端版本、安卓手机 App 或苹果手机 App。</p></article><article><h3>任务跑通与手机指挥</h3><p>完成一次真实任务，并教你用手机远程指挥 Codex。</p></article></div></div></section>
    <section class="section section-mist" id="pricing"><div class="container"><p class="section-kicker">套餐价格</p><h2>599 元起，主推能真正开始工作的标准包</h2><div class="pricing-grid"><article class="pricing-card"><span>入门</span><h3>基础安装包</h3><p class="price">¥599 <small>/ 次</small></p><ul><li>1 台设备远程安装</li><li>赠送 1 个月 ChatGPT Plus</li><li>Windows 或 macOS 二选一</li><li>完成登录、基础配置和测试任务</li><li>装不好退款</li></ul><a href="#contact">选择基础包</a></article><article class="pricing-card is-featured"><span>推荐</span><h3>标准跑通包</h3><p class="price">¥999 <small>/ 次</small></p><ul><li>包含基础安装包全部内容</li><li>电脑端与手机端 App 配置</li><li>教你随时远程指挥 Codex</li><li>带跑一个真实项目文件夹</li><li>7 天售后答疑</li></ul><a href="#contact">选择标准包</a></article><article class="pricing-card"><span>进阶</span><h3>进阶工作流包</h3><p class="price">¥1999 <small>/ 次</small></p><ul><li>包含标准跑通包全部内容</li><li>配置电脑端与手机端协同流程</li><li>整理 Codex 使用 SOP</li><li>可选 API 或国产模型备用方案</li><li>2 次远程陪跑与 14 天答疑</li></ul><a href="#contact">选择进阶包</a></article><article class="pricing-card"><span>团队</span><h3>团队小班包</h3><p class="price">¥4999 <small>/ 起</small></p><ul><li>多人设备检查与安装</li><li>统一团队使用规范</li><li>项目协作基础配置</li><li>一次团队演示课</li><li>7 天群内答疑</li></ul><a href="#contact">咨询团队包</a></article></div><p class="service-note"><strong>上门服务说明：</strong>深圳加收 500 元；广州、惠州、东莞、佛山、中山加收 1000 元。</p></div></section>
    <section class="section"><div class="container promise-grid"><article><h2>交付到什么程度算完成</h2><ul><li>Codex 能在电脑或手机上正常启动。</li><li>ChatGPT / Codex 登录和权益状态可用。</li><li>能读取指定项目文件夹或演示文件夹。</li><li>完成一次真实任务。</li></ul></article><article><h2>什么情况直接退款</h2><ul><li>排障后仍无法完成安装。</li><li>无法让 Codex 完成首次测试任务。</li><li>安装前诊断发现条件不满足。</li><li>不使用共享账号、黑卡订阅或低价拼车交付。</li></ul></article></div></section>
    <section class="section section-mist"><div class="container"><p class="section-kicker">安全边界</p><h2>全程透明，不拿账号做长期代管</h2><div class="reason-grid"><article><h3>屏幕共享，全程可见</h3><p>配置过程在你的设备上完成，你能看到每一步操作。</p></article><article><h3>不索要长期密码</h3><p>账号登录和授权由你本人操作，我们只做安装与排障指导。</p></article><article><h3>敏感项目可隔离演示</h3><p>项目代码敏感时，只用演示文件夹完成验收。</p></article></div></div></section>
    <section class="section" id="faq"><div class="container"><p class="section-kicker">FAQ</p><h2>预约前最常见的问题</h2><div class="faq-grid"><article><h3>完全零基础可以买吗？</h3><p>可以。需要手机 App 远程指挥时建议选择标准包。</p></article><article><h3>支持哪些设备？</h3><p>支持 Windows、macOS、安卓手机 App 和苹果手机 App。</p></article><article><h3>一定需要 ChatGPT Plus 吗？</h3><p>套餐默认包含 1 个月 Plus 等值权益，已有 Plus 可咨询抵扣方案。</p></article><article><h3>一般要多久？</h3><p>基础安装通常 45-90 分钟，标准包一般预留 90-150 分钟。</p></article><article><h3>能不能配置国产模型或 API 备用？</h3><p>进阶工作流包可选配备用方案。</p></article><article><h3>为什么不卖更便宜？</h3><p>交付内容包含远程时间、排障、权益准备、首次跑通和售后。</p></article></div></div></section>
    <section class="section section-mist" id="contact"><div class="container contact-card"><div><p class="section-kicker">微信预约</p><h2>先发你的设备环境，确认后再预约</h2><p>发送电脑或手机型号、系统版本、ChatGPT 账号和 Plus 状态，以及你想用 Codex 做什么。</p></div><div class="contact-qr"><img src="wechat-qr.jpg" alt="Codex 安装交付服务微信二维码"><strong>扫码添加微信</strong></div></div></section>
  </main>
  <footer><div class="container">Codex 安装交付服务。发送你的设备环境后确认预约。</div></footer>
  <a class="wechat-float qr-trigger" id="wechat-float" href="#contact"><span>微信咨询</span></a>
  <div class="qr-modal" id="qr-modal" role="dialog" aria-modal="true" aria-labelledby="qr-modal-title" hidden>
    <div class="qr-modal__backdrop" data-modal-close></div>
    <div class="qr-modal__panel">
      <button class="qr-modal__close" type="button" data-modal-close aria-label="关闭二维码弹窗">×</button>
      <h2 id="qr-modal-title">添加微信，预约 Codex 安装</h2>
      <p>扫码添加微信，发送你的设备型号、系统版本和使用需求。</p>
      <img src="wechat-qr.jpg" alt="Codex 安装交付服务微信二维码">
    </div>
  </div>
  <script src="script.js"></script>
</body>
</html>
```

- [ ] **Step 3: 运行静态测试，确认失败点推进到缺少 CSS 或 JS**

Run: `node tests/site-checks.mjs`

Expected: FAIL，页面内容断言通过，错误指向 `codex/style.css` 或 `codex/script.js` 不存在。

- [ ] **Step 4: 提交 HTML 与二维码资源**

```bash
git add codex/index.html codex/wechat-qr.jpg
git commit -m "feat: add codex installation page content"
```

### Task 3: 实现独立视觉系统与响应式布局

**Files:**
- Create: `codex/style.css`
- Test: `tests/site-checks.mjs`

- [ ] **Step 1: 定义页面专用设计令牌**

`codex/style.css` 顶部使用以下变量，不引用现有全局 CSS：

```css
:root {
  --ink: #101817;
  --muted: #5e6b69;
  --paper: #ffffff;
  --mist: #eef5f4;
  --line: #d7e1df;
  --night: #07100f;
  --night-soft: #101c1b;
  --teal: #147f73;
  --teal-bright: #82dfd3;
  --teal-pale: #dff5f1;
  --amber: #f2b544;
  --container: 1180px;
  --radius: 10px;
  --shadow: 0 18px 50px rgba(13, 36, 32, 0.1);
}
```

- [ ] **Step 2: 实现桌面布局和组件样式**

必须覆盖：固定白色导航、深色双栏 hero、四项亮点、设备模拟面板、交替内容分区、三列/四列卡片、深色推荐套餐、FAQ 两列网格、底部绿色咨询区、右下角浮动按钮、二维码弹窗、可见键盘焦点。

关键布局规则：

```css
.container, .nav-shell { width: min(var(--container), calc(100% - 40px)); margin-inline: auto; }
.hero-grid { display: grid; grid-template-columns: 1.03fr .97fr; gap: 56px; align-items: center; }
.reason-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
.service-grid, .pricing-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.faq-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
.contact-card { display: grid; grid-template-columns: 1.4fr .8fr; gap: 34px; align-items: center; }
.pricing-card.is-featured { background: var(--night-soft); color: #fff; transform: translateY(-14px); }
.wechat-float { position: fixed; right: 24px; bottom: 24px; z-index: 40; }
.qr-modal.is-open { display: grid; }
```

- [ ] **Step 3: 添加响应式和低动画偏好**

```css
@media (max-width: 980px) {
  .hero-grid, .contact-card { grid-template-columns: 1fr; }
  .service-grid, .pricing-grid { grid-template-columns: repeat(2, 1fr); }
  .pricing-card.is-featured { transform: none; }
}

@media (max-width: 720px) {
  .menu-toggle { display: inline-flex; }
  .site-menu { display: none; position: absolute; inset: 100% 20px auto; flex-direction: column; }
  .site-menu.is-open { display: flex; }
  .reason-grid, .service-grid, .pricing-grid, .faq-grid { grid-template-columns: 1fr; }
  .hero { padding-block: 72px; }
  .wechat-float span { display: none; }
  .qr-modal__panel { width: min(92vw, 460px); max-height: 90vh; overflow: auto; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { scroll-behavior: auto !important; animation-duration: .01ms !important; transition-duration: .01ms !important; }
}
```

- [ ] **Step 4: 运行测试并确认仅缺少脚本**

Run: `node tests/site-checks.mjs`

Expected: FAIL，错误只指向 `codex/script.js` 不存在或脚本行为断言未满足。

- [ ] **Step 5: 提交视觉实现**

```bash
git add codex/style.css
git commit -m "style: recreate codex service landing page"
```

### Task 4: 实现移动菜单与二维码弹窗

**Files:**
- Create: `codex/script.js`
- Test: `tests/site-checks.mjs`

- [ ] **Step 1: 添加完整交互脚本**

```js
document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const menu = document.getElementById('site-menu');
  const modal = document.getElementById('qr-modal');
  const modalClose = modal?.querySelector('.qr-modal__close');
  const triggers = document.querySelectorAll('.qr-trigger');
  let lastTrigger = null;

  const closeMenu = () => {
    if (!menu || !menuToggle) return;
    menu.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  };

  menuToggle?.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  menu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

  const openModal = (trigger) => {
    if (!modal) return;
    lastTrigger = trigger;
    modal.hidden = false;
    modal.classList.add('is-open');
    document.body.classList.add('modal-open');
    modalClose?.focus();
  };

  const closeModal = () => {
    if (!modal || modal.hidden) return;
    modal.classList.remove('is-open');
    modal.hidden = true;
    document.body.classList.remove('modal-open');
    lastTrigger?.focus();
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      openModal(trigger);
    });
  });

  modal?.querySelectorAll('[data-modal-close]').forEach((control) => control.addEventListener('click', closeModal));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeModal();
  });
});
```

- [ ] **Step 2: 运行静态测试并确认全部通过**

Run: `node tests/site-checks.mjs`

Expected: PASS，并输出现有站点页面验证数量，无断言错误。

- [ ] **Step 3: 提交交互实现**

```bash
git add codex/script.js tests/site-checks.mjs
git commit -m "feat: add codex qr and mobile interactions"
```

### Task 5: 浏览器验证桌面端、手机端和交互

**Files:**
- Verify: `codex/index.html`
- Verify: `codex/style.css`
- Verify: `codex/script.js`
- Verify: `codex/wechat-qr.jpg`

- [ ] **Step 1: 启动本地静态服务器**

Run: `python3 -m http.server 4173`

Expected: 服务监听 `http://localhost:4173`，访问路径为 `http://localhost:4173/codex/`。

- [ ] **Step 2: 在桌面宽度验证页面**

检查：导航固定、hero 双栏、三个选择理由、四项服务、四档套餐、标准包突出、FAQ 两列、咨询区二维码完整、无横向滚动。

- [ ] **Step 3: 验证二维码弹窗**

依次检查顶部 GPT Plus 和右下角微信按钮；两者都打开同一弹窗。确认关闭按钮、遮罩和 `Escape` 均能关闭，关闭后焦点返回触发元素。

- [ ] **Step 4: 在手机宽度验证页面**

使用约 390×844 视口，检查菜单展开/收起、内容单列、按钮不溢出、浮动按钮不遮挡主要内容、二维码完整显示。

- [ ] **Step 5: 检查浏览器控制台**

Expected: 无 JavaScript 错误、资源 404 或对 `qimuai.cn` 的静态资源请求。

### Task 6: 完成范围审计与最终验证

**Files:**
- Verify only; no additional production files unless验证发现问题。

- [ ] **Step 1: 运行完整静态检查**

Run: `node tests/site-checks.mjs`

Expected: PASS，退出码为 0。

- [ ] **Step 2: 检查格式和资源引用**

Run: `git diff --check`

Expected: 无输出，退出码为 0。

- [ ] **Step 3: 确认禁止修改的文件没有变化**

Run:

```bash
git diff 4755bc7 -- index.html css/style.css js/script.js robots.txt sitemap.xml llms.txt GEO-ANALYSIS.md html en
```

Expected: 无输出。

- [ ] **Step 4: 检查最终变更范围**

Run: `git status --short`

Expected: 产品变更只涉及 `codex/` 与 `tests/site-checks.mjs`；设计和计划文档位于 `docs/superpowers/`；`.superpowers/` 视觉草图目录不提交。

- [ ] **Step 5: 如验证修复产生未提交变更，提交最终修复**

```bash
git add codex tests/site-checks.mjs
git commit -m "fix: polish codex installation page"
```
