# Codex Editorial Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `/codex/` 从深绿色技术服务页改成米白纸张、钴蓝强调、侧边栏和横向价格目录组成的原创编辑式服务手册，同时保留现有内容、二维码、交互和 SEO/GEO 隔离。

**Architecture:** 继续使用独立的 `codex/index.html`、`codex/style.css` 和 `codex/script.js`。HTML 重新组织为编辑式页面框架，CSS 全量替换视觉系统，JavaScript 保持现有菜单与二维码弹窗行为；测试先定义新结构并明确禁止旧结构。

**Tech Stack:** HTML5、原生 CSS、原生 JavaScript、Node.js 静态断言、Python 本地静态服务器、浏览器响应式验证。

---

## 文件结构

- Modify: `tests/site-checks.mjs` — 定义原创编辑式结构和旧版结构移除约束。
- Modify: `codex/index.html` — 重组为侧边栏、流程索引、线框服务目录和横向套餐目录。
- Replace: `codex/style.css` — 使用米白、黑色、钴蓝的新视觉系统。
- Verify: `codex/script.js` — 保留菜单、二维码弹窗、焦点恢复和内容显示行为；仅在选择器失效时修改。
- Preserve: `codex/wechat-qr.jpg`、`codex/favicon.png`。

明确不修改：根目录首页、全局 CSS/JS、`robots.txt`、`sitemap.xml`、`llms.txt`、`GEO-ANALYSIS.md`、`html/` 和 `en/`。

### Task 1: 先定义原创结构的失败测试

**Files:**
- Modify: `tests/site-checks.mjs`
- Test: `tests/site-checks.mjs`

- [ ] **Step 1: 替换 Codex 页面结构断言**

在现有 Codex 断言区加入以下检查：

```js
assert.match(codexHome, /class="page-rail"/);
assert.match(codexHome, /class="editorial-shell"/);
assert.match(codexHome, /class="hero-process"/);
assert.match(codexHome, /class="service-directory"/);
assert.match(codexHome, /class="pricing-ledger"/);
assert.match(codexHome, /class="pricing-row is-featured"/);
assert.match(codexHome, /class="faq-ledger"/);
assert.doesNotMatch(codexHome, /class="delivery-board/);
assert.doesNotMatch(codexHome, /class="hero-highlights/);
assert.doesNotMatch(codexHome, /class="pricing-card/);
assert.doesNotMatch(codexHome, /class="promise-grid/);

const codexCss = await read('codex/style.css');
assert.match(codexCss, /--paper:\s*#f3f0e8/);
assert.match(codexCss, /--cobalt:\s*#2447d7/);
assert.match(codexCss, /\.page-rail/);
assert.match(codexCss, /\.pricing-ledger/);
assert.doesNotMatch(codexCss, /--night:\s*#07110f/);
assert.doesNotMatch(codexCss, /\.delivery-board/);
```

保留四档套餐、二维码、本地资源、canonical、GPT Plus、微信浮动按钮、弹窗与无长破折号断言。

- [ ] **Step 2: 运行测试并确认因旧版结构而失败**

Run: `node tests/site-checks.mjs`

Expected: FAIL，首个错误为缺少 `page-rail` 或仍存在旧版 `delivery-board`，而不是测试语法错误。

- [ ] **Step 3: 提交测试红灯**

```bash
git add tests/site-checks.mjs
git commit -m "test: define codex editorial redesign"
```

### Task 2: 重组为编辑式服务手册 HTML

**Files:**
- Modify: `codex/index.html`
- Test: `tests/site-checks.mjs`

- [ ] **Step 1: 建立页面侧边栏和主框架**

`body` 内使用以下顶层结构：

```html
<aside class="page-rail" aria-label="页面标识">
  <a href="#top" class="rail-mark">CX</a>
  <span class="rail-title">CODEX DELIVERY</span>
  <span class="rail-year">2026</span>
</aside>
<div class="editorial-shell">
  <header class="site-header">
    <nav class="nav-shell" aria-label="主导航">
      <a class="brand" href="#top">Codex 安装交付手册</a>
      <button class="menu-toggle" type="button" aria-controls="site-menu" aria-expanded="false">菜单</button>
      <div class="site-menu" id="site-menu">
        <a href="#market">为什么选我们</a>
        <a href="#service">服务内容</a>
        <a href="#pricing">套餐价格</a>
        <a href="#faq">FAQ</a>
        <a class="nav-plus qr-trigger" href="#contact">GPT Plus</a>
      </div>
    </nav>
  </header>
  <main id="top"></main>
  <footer class="site-footer"></footer>
</div>
```

- [ ] **Step 2: 用流程索引替换旧首屏交付面板**

首屏必须包含：

```html
<section class="hero" aria-labelledby="hero-title">
  <div class="hero-main">
    <div class="hero-copy" data-reveal>
      <p class="hero-offer">599 元起 | 1 对 1 远程交付 | 装不好直接退款</p>
      <h1 id="hero-title">把 Codex 装进<br>你的工作流</h1>
      <p class="hero-lead">支持 Windows、macOS 和手机 App。赠送 1 个月 ChatGPT Plus，带你完成第一个真实任务。</p>
      <div class="hero-actions"><a class="button button-primary" href="#contact">预约远程安装</a><a class="button button-secondary" href="#pricing">查看套餐价格</a></div>
    </div>
    <ol class="hero-process" data-reveal>
      <li><span>01</span><div><strong>检查设备</strong><p>确认系统、账号和权限条件。</p></div></li>
      <li><span>02</span><div><strong>完成安装</strong><p>配置电脑端与手机端使用方式。</p></div></li>
      <li><span>03</span><div><strong>真实任务验收</strong><p>读取项目并完成一次真实任务。</p></div></li>
    </ol>
  </div>
  <div class="hero-index" data-reveal>
    <article><span>01</span><strong>全流程手把手</strong><p>从检查到任务跑通。</p></article>
    <article><span>02</span><strong>全平台支持</strong><p>覆盖电脑和手机。</p></article>
    <article><span>03</span><strong>Plus 赠送</strong><p>含 1 个月等值权益。</p></article>
    <article><span>04</span><strong>结果退款</strong><p>无法跑通直接退款。</p></article>
  </div>
</section>
```

- [ ] **Step 3: 重组内容区**

保持现有业务文案，使用以下结构名称：

```html
<section id="market" class="chapter chapter-market"><div class="chapter-number">01</div><div class="market-editorial"></div></section>
<section id="service" class="chapter chapter-service"><div class="chapter-number">02</div><div class="service-directory"></div></section>
<section id="pricing" class="chapter chapter-pricing"><div class="chapter-number">03</div><div class="pricing-ledger"></div></section>
<section class="chapter chapter-promise"><div class="chapter-number">04</div><div class="promise-columns"></div></section>
<section class="chapter chapter-safety"><div class="chapter-number">05</div><div class="safety-directory"></div></section>
<section id="faq" class="chapter chapter-faq"><div class="chapter-number">06</div><div class="faq-ledger"></div></section>
<section id="contact" class="chapter chapter-contact"><div class="contact-manual"></div></section>
```

四个套餐使用 `article.pricing-row`。标准跑通包额外使用 `is-featured`。每行继续包含套餐名、价格、摘要、完整列表和原按钮链接。

- [ ] **Step 4: 保留二维码入口和弹窗标记**

保留 `#wechat-float`、`.qr-trigger`、`#qr-modal`、`[data-modal-close]`、`#qr-modal-title` 和二维码本地路径，避免 JavaScript 行为回归。

- [ ] **Step 5: 运行测试，确认结构断言通过并推进到 CSS 断言失败**

Run: `node tests/site-checks.mjs`

Expected: FAIL，错误指向缺少 `--paper: #f3f0e8`、缺少 `--cobalt` 或仍存在旧 CSS 选择器。

- [ ] **Step 6: 提交 HTML 重构**

```bash
git add codex/index.html
git commit -m "refactor: restructure codex as editorial manual"
```

### Task 3: 全量替换编辑式 CSS

**Files:**
- Replace: `codex/style.css`
- Test: `tests/site-checks.mjs`

- [ ] **Step 1: 使用新设计令牌**

```css
:root {
  --paper: #f3f0e8;
  --paper-light: #faf8f1;
  --ink: #171717;
  --muted: #625f58;
  --line: #b9b4aa;
  --cobalt: #2447d7;
  --cobalt-pale: #e2e7fb;
  --white: #ffffff;
  --rail-width: 70px;
  --container: 1160px;
}
```

- [ ] **Step 2: 实现桌面框架**

```css
.page-rail { position: fixed; inset: 0 auto 0 0; width: var(--rail-width); border-right: 1px solid var(--ink); background: var(--paper-light); }
.rail-title { writing-mode: vertical-rl; letter-spacing: .16em; }
.editorial-shell { margin-left: var(--rail-width); }
.nav-shell, .hero, .chapter, .site-footer { width: min(var(--container), calc(100% - 48px)); margin-inline: auto; }
.hero-main { display: grid; grid-template-columns: 1.15fr .85fr; min-height: 610px; }
.hero-process li { display: grid; grid-template-columns: 150px 1fr; border-top: 1px solid var(--line); }
.hero-index { display: grid; grid-template-columns: repeat(4, 1fr); border-block: 1px solid var(--ink); }
```

- [ ] **Step 3: 实现章节与横向价格目录**

```css
.chapter { display: grid; grid-template-columns: 110px 1fr; padding-block: 112px; border-bottom: 1px solid var(--ink); }
.chapter-number { font-size: 54px; color: var(--cobalt); }
.service-directory { display: grid; grid-template-columns: repeat(2, 1fr); border-top: 1px solid var(--ink); border-left: 1px solid var(--ink); }
.service-directory article { min-height: 260px; padding: 28px; border-right: 1px solid var(--ink); border-bottom: 1px solid var(--ink); }
.pricing-ledger { border-top: 1px solid var(--ink); }
.pricing-row { display: grid; grid-template-columns: 70px 230px 1fr 170px; gap: 24px; padding: 30px 0; border-bottom: 1px solid var(--ink); }
.pricing-row.is-featured { margin-inline: -24px; padding-inline: 24px; color: var(--white); background: var(--cobalt); }
.faq-ledger { display: grid; grid-template-columns: repeat(2, 1fr); border-top: 1px solid var(--ink); }
```

- [ ] **Step 4: 实现钴蓝联系区、浮动按钮和弹窗**

联系区使用钴蓝底色，二维码使用白色纸张框。浮动按钮使用钴蓝矩形加圆形“微”标记。弹窗左侧钴蓝信息栏、右侧白色二维码区域，保留现有打开和关闭状态类。

```css
.contact-manual { display: grid; grid-template-columns: 1.15fr .85fr; gap: 48px; padding: 48px; color: var(--white); background: var(--cobalt); }
.contact-qr { padding: 18px; color: var(--ink); background: var(--white); }
.wechat-float { position: fixed; right: 22px; bottom: 22px; display: inline-flex; align-items: center; gap: 10px; color: var(--white); background: var(--cobalt); }
.qr-modal.is-open { display: grid; }
.qr-modal__panel { display: grid; grid-template-columns: .8fr 1.2fr; width: min(860px, 94vw); background: var(--paper-light); }
.qr-modal__copy { align-self: stretch; padding: 42px 32px; color: var(--white); background: var(--cobalt); }
```

- [ ] **Step 5: 实现移动端折叠规则**

```css
@media (max-width: 860px) {
  .page-rail { display: none; }
  .editorial-shell { margin-left: 0; }
  .menu-toggle { display: inline-flex; }
  .site-menu { display: none; position: absolute; inset: 100% 0 auto; flex-direction: column; }
  .site-menu.is-open { display: flex; }
  .hero-main, .chapter { grid-template-columns: 1fr; }
  .hero-process li { grid-template-columns: 86px 1fr; }
  .hero-index, .service-directory, .faq-ledger { grid-template-columns: 1fr; }
  .pricing-row { grid-template-columns: 1fr; }
  .chapter-number { margin-bottom: 30px; }
}
```

- [ ] **Step 6: 运行测试并确认全部通过**

Run: `node tests/site-checks.mjs`

Expected: PASS，输出验证 9 个 HTML 页面。

- [ ] **Step 7: 提交视觉重写**

```bash
git add codex/style.css tests/site-checks.mjs
git commit -m "style: redesign codex as editorial service manual"
```

### Task 4: 验证交互与浏览器表现

**Files:**
- Verify: `codex/index.html`
- Verify: `codex/style.css`
- Verify: `codex/script.js`

- [ ] **Step 1: 检查脚本语法和现有测试**

Run: `node --check codex/script.js && node tests/site-checks.mjs`

Expected: 两个命令退出码均为 0。

- [ ] **Step 2: 启动静态服务器**

Run: `python3 -m http.server 4173`

Expected: `http://localhost:4173/codex/` 可访问，HTML、CSS、JS、favicon 和二维码均返回 200。

- [ ] **Step 3: 验证桌面端**

在 1280×720 和 1440×1000 下确认：侧边栏可见、首屏为米白编辑排版、流程数字位于右侧、横向套餐目录无溢出、推荐套餐整行钴蓝、二维码完整。

- [ ] **Step 4: 验证手机端**

在 390×844 下确认：侧边栏隐藏、菜单可展开与收起、流程和套餐单列排列、二维码完整、页面无横向滚动。

- [ ] **Step 5: 验证二维码交互**

确认顶部 GPT Plus 和右下角微信按钮都能打开弹窗；关闭按钮、遮罩和 `Escape` 都能关闭；关闭后焦点回到触发入口。

- [ ] **Step 6: 检查浏览器日志与资源日志**

Expected: 控制台无错误或警告，静态服务器无 404。

### Task 5: 完成范围审计与整合

**Files:**
- Verify only.

- [ ] **Step 1: 运行最终测试与格式检查**

Run: `node tests/site-checks.mjs && git diff --check`

Expected: 测试通过，`git diff --check` 无输出。

- [ ] **Step 2: 证明原页面和 SEO/GEO 文件没有变化**

Run:

```bash
git diff 4756e8d -- index.html css/style.css js/script.js robots.txt sitemap.xml llms.txt GEO-ANALYSIS.md html en
```

Expected: 无输出。

- [ ] **Step 3: 检查最终提交范围**

Run: `git status --short --branch && git log --oneline 98cac4f..HEAD`

Expected: 产品改动仅包含 `codex/index.html`、`codex/style.css` 和 `tests/site-checks.mjs`；`codex/script.js` 保持不变，视觉草图目录 `.superpowers/` 不提交。
