import assert from 'node:assert/strict';
import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const productionOrigin = 'https://www.gptplus.uno';

const read = (relativePath) => readFile(path.join(root, relativePath), 'utf8');

const htmlFiles = [
  'index.html',
  ...(await readdir(path.join(root, 'html')))
    .filter((file) => file.endsWith('.html'))
    .map((file) => `html/${file}`),
];

const allHtmlFiles = [...htmlFiles, 'en/index.html', 'codex/index.html'];

for (const relativePath of htmlFiles) {
  const html = await read(relativePath);
  const expectedHref = relativePath === 'index.html' ? 'en/index.html' : '../en/index.html';
  const assetPrefix = relativePath === 'index.html' ? '' : '../';

  assert.match(
    html,
    new RegExp(
      `<a href="${expectedHref}" class="language-toggle-btn icon-control"[^>]*aria-label="切换到英文"[^>]*>[\\s\\S]*?<i data-lucide="languages"`,
    ),
    `${relativePath} should expose an icon-only English language link in the header`,
  );
  assert.match(
    html,
    new RegExp(`${assetPrefix.replace('../', '\\.\\.\\/')}css/style\\.css\\?v=20260605a`),
    `${relativePath} should load the cache-busted mobile stylesheet`,
  );
  assert.match(
    html,
    new RegExp(`${assetPrefix.replace('../', '\\.\\.\\/')}js/script\\.js\\?v=20260605a`),
    `${relativePath} should load the cache-busted interaction script`,
  );
}

const chineseHome = await read('index.html');
assert.match(
  chineseHome,
  /<a[^>]*class="codex-side-entry"[^>]*href="codex\/"[^>]*>[\s\S]*Codex安装交付服务[\s\S]*<\/a>/,
  'Homepage should expose the fixed Codex installation service entry',
);
assert.match(
  chineseHome,
  /<img src="image\/wechat-qr\.png" alt="ChatGPT Plus \/ Pro 客服微信二维码"/,
  'Homepage should load the customer-service QR code from the local image directory',
);
assert.doesNotMatch(
  chineseHome,
  /gptguide\.cn\/img\/yueshi_wechat\.png/,
  'Homepage should not depend on the previous remote QR-code host',
);
assert.match(
  chineseHome,
  new RegExp(
    `<link rel="alternate" hreflang="zh-Hans" href="${productionOrigin}/">`,
  ),
);
assert.match(
  chineseHome,
  new RegExp(
    `<link rel="alternate" hreflang="en" href="${productionOrigin}/en/">`,
  ),
);
assert.match(
  chineseHome,
  new RegExp(
    `<link rel="alternate" hreflang="x-default" href="${productionOrigin}/">`,
  ),
);

const englishHome = await read('en/index.html');
assert.match(englishHome, /<html lang="en">/);
assert.match(
  englishHome,
  new RegExp(`<link rel="canonical" href="${productionOrigin}/en/">`),
);
assert.match(
  englishHome,
  /<h1[^>]*>[\s\S]*ChatGPT Plus \/ Pro[\s\S]*Purchase and Upgrade Guide[\s\S]*<\/h1>/,
);
assert.match(
  englishHome,
  /<a href="\.\.\/index\.html" class="language-toggle-btn icon-control"[^>]*aria-label="Switch to Chinese"/,
);
assert.match(englishHome, /\.\.\/css\/style\.css\?v=20260605a/);
assert.match(englishHome, /\.\.\/js\/script\.js\?v=20260605a/);

for (const relativePath of allHtmlFiles) {
  const html = await read(relativePath);
  const jsonLdBlocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];

  for (const [, json] of jsonLdBlocks) {
    assert.doesNotThrow(
      () => JSON.parse(json),
      `${relativePath} should contain valid JSON-LD`,
    );
  }

  const localReferences = [...html.matchAll(/\b(?:href|src)="([^"]+)"/g)]
    .map((match) => match[1])
    .filter((reference) => (
      reference
      && !reference.startsWith('#')
      && !/^(?:https?:|mailto:|tel:|data:)/.test(reference)
    ));

  for (const reference of localReferences) {
    const cleanReference = reference.split(/[?#]/, 1)[0];
    const resolvedPath = path.resolve(root, path.dirname(relativePath), cleanReference);

    await assert.doesNotReject(
      access(resolvedPath),
      `${relativePath} should reference an existing local file: ${reference}`,
    );
  }
}

const css = await read('css/style.css');
assert.match(css, /\.codex-side-entry/);
assert.match(css, /@media \(max-width: 768px\)[\s\S]*\.codex-side-entry/);
assert.match(css, /\/\* Mobile readability and header controls \*\//);
assert.match(css, /@media \(max-width: 768px\)[\s\S]*#theme-toggle[\s\S]*display: grid !important/);
assert.match(css, /@media \(max-width: 768px\)[\s\S]*white-space: normal/);
assert.match(css, /@media \(max-width: 768px\)[\s\S]*main > article\.container/);
assert.match(css, /@media \(max-width: 768px\)[\s\S]*main > article h1/);
assert.match(css, /\.language-toggle-btn/);
assert.match(css, /\.icon-control/);
assert.match(css, /#mobile-menu-button\[aria-expanded="true"\]::before/);

const script = await read('js/script.js');
assert.match(script, /menuButton\.setAttribute\('aria-expanded', String\(isMenuOpen\)\)/);
assert.match(script, /mobileMenu\.classList\.add\('hidden'\)/);
assert.match(script, /menuButton\.setAttribute\('aria-expanded', 'false'\)/);

const sitemap = await read('sitemap.xml');
assert.match(sitemap, /xmlns:xhtml="http:\/\/www\.w3\.org\/1999\/xhtml"/);
assert.match(sitemap, new RegExp(`<loc>${productionOrigin}/en/</loc>`));
assert.match(sitemap, new RegExp(`<loc>${productionOrigin}/codex/</loc>`));
assert.match(
  sitemap,
  new RegExp(`<loc>${productionOrigin}/codex/</loc>[\\s\\S]*?<lastmod>2026-07-14</lastmod>`),
);
assert.match(
  sitemap,
  new RegExp(
    `<xhtml:link rel="alternate" hreflang="zh-Hans" href="${productionOrigin}/" ?/>`,
  ),
);
assert.match(
  sitemap,
  new RegExp(
    `<xhtml:link rel="alternate" hreflang="en" href="${productionOrigin}/en/" ?/>`,
  ),
);

const llms = await read('llms.txt');
assert.match(
  llms,
  new RegExp(`\\[English Homepage\\]\\(${productionOrigin}/en/\\)`),
);
assert.match(
  llms,
  new RegExp(`\\[Codex Installation Tutorial And Delivery Service\\]\\(${productionOrigin}/codex/\\)`),
);

await assert.rejects(
  access(path.join(root, 'docs/superpowers')),
  { code: 'ENOENT' },
  'docs/superpowers should not be published with the site source',
);

const codexFiles = [
  'codex/index.html',
  'codex/style.css',
  'codex/script.js',
  'codex/wechat-qr.jpg',
  'codex/wechat-icon.png',
  'codex/favicon.png',
];

for (const relativePath of codexFiles) {
  await assert.doesNotReject(
    access(path.join(root, relativePath)),
    `Codex page asset should exist: ${relativePath}`,
  );
}

const codexHome = await read('codex/index.html');
assert.match(codexHome, /<html lang="zh-CN">/);
assert.match(
  codexHome,
  /<title>Codex安装教程与远程安装服务｜Windows、macOS、手机小白指南<\/title>/,
);
assert.match(codexHome, /<meta name="description"[\s\S]*Codex怎么安装/);
assert.match(
  codexHome,
  /<link rel="canonical" href="https:\/\/www\.gptplus\.uno\/codex\/">/,
);
assert.match(codexHome, /<meta property="og:url" content="https:\/\/www\.gptplus\.uno\/codex\/">/);
assert.match(codexHome, /<h1 id="hero-title">Codex 安装教程<br>把它装进你的工作流<\/h1>/);
assert.match(codexHome, /id="guide"/);
assert.match(codexHome, /Codex怎么安装？小白先看这 4 步/);
assert.match(codexHome, /信息核对：2026年7月14日/);
assert.match(codexHome, /https:\/\/help\.openai\.com\/en\/articles\/20001276-moving-to-the-new-chatgpt-desktop-app/);
assert.match(codexHome, /https:\/\/chatgpt\.com\/zh-Hans-CN\/codex\/mobile\//);
assert.match(codexHome, /<small class="discount-badge">立减100元<\/small>/);
assert.match(codexHome, /<p class="price">¥499 <small>\/ 次<\/small><\/p>/);
assert.match(codexHome, /<p class="original-price">原价 <del>¥599<\/del><\/p>/);
assert.doesNotMatch(codexHome, /599 元起/);
assert.match(codexHome, /<script type="application\/ld\+json">[\s\S]*"@type": "Service"/);
assert.match(codexHome, /<script type="application\/ld\+json">[\s\S]*"@type": "FAQPage"/);
assert.match(codexHome, /<script type="application\/ld\+json">[\s\S]*"@type": "BreadcrumbList"/);
assert.match(codexHome, /href="#market"/);
assert.match(
  codexHome,
  /<div class="site-menu" id="site-menu">\s*<a href="\.\.\/">GPT一键升级<\/a>\s*<a href="#market">/,
);
assert.match(codexHome, /href="#service"/);
assert.match(codexHome, /href="#pricing"/);
assert.match(codexHome, /href="#faq"/);
assert.match(
  codexHome,
  /class="[^\"]*nav-plus[^\"]*reservation-trigger[^\"]*qr-trigger[^\"]*"[^>]*>\s*预约安装/,
);
assert.match(codexHome, /id="wechat-float"/);
assert.match(codexHome, /class="wechat-float__icon"[^>]*src="wechat-icon\.png"/);
assert.match(codexHome, /id="qr-modal"/);
assert.match(codexHome, /aria-describedby="qr-modal-description"/);
assert.match(
  codexHome,
  /class="qr-modal__close"[^>]*aria-label="关闭二维码弹窗"[^>]*>\s*<span aria-hidden="true">×<\/span>/,
);
assert.match(codexHome, /class="qr-modal__steps"[^>]*aria-label="预约流程"/);
assert.match(codexHome, /<strong>扫码添加<\/strong>/);
assert.match(codexHome, /<strong>发送设备<\/strong>/);
assert.match(codexHome, /<strong>确认时间<\/strong>/);
assert.match(codexHome, /class="qr-modal__caption"/);
assert.match(codexHome, /添加后备注“Codex”/);
assert.match(codexHome, /id="contact"/);
assert.match(codexHome, /src="wechat-qr\.jpg"/);
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
assert.match(codexHome, /<link rel="icon" href="favicon\.png" type="image\/png">/);
assert.doesNotMatch(codexHome, /[—–]/);

const codexCss = await read('codex/style.css');
assert.match(codexCss, /--paper:\s*#f3f0e8/);
assert.match(codexCss, /--cobalt:\s*#2447d7/);
assert.match(codexCss, /--wechat:\s*#07c160/);
assert.match(codexCss, /\.page-rail/);
assert.match(codexCss, /\.rail-title\s*\{[^}]*padding-top:\s*28px;/);
assert.match(codexCss, /\.guide-steps/);
assert.match(codexCss, /\.discount-badge/);
assert.match(codexCss, /\.original-price/);
assert.match(codexCss, /\.pricing-ledger/);
assert.match(
  codexCss,
  /\.qr-modal__panel\s*\{[^}]*width:\s*min\(680px, calc\(100vw - 48px\)\);[^}]*border-radius:\s*16px;/,
);
assert.match(
  codexCss,
  /\.qr-modal__close\s*\{[^}]*width:\s*40px;[^}]*height:\s*40px;[^}]*border-radius:\s*50%;/,
);
assert.match(codexCss, /\.qr-modal__steps/);
assert.match(codexCss, /\.qr-modal__caption/);
assert.match(codexCss, /@keyframes qr-modal-enter/);
assert.match(codexCss, /backdrop-filter:\s*blur\(3px\)/);
assert.match(
  codexCss,
  /\.wechat-float\s*\{[^}]*min-height:\s*64px;[^}]*border-radius:\s*14px;[^}]*font-size:\s*16px;/,
);
assert.match(
  codexCss,
  /\.wechat-float__icon\s*\{[^}]*width:\s*48px;[^}]*height:\s*48px;/,
);
assert.match(
  codexCss,
  /@media \(max-width: 640px\)[\s\S]*\.wechat-float\s*\{[^}]*min-height:\s*54px;[^}]*border-radius:\s*12px;[^}]*font-size:\s*14px;/,
);
assert.match(
  codexCss,
  /@media \(max-width: 640px\)[\s\S]*\.wechat-float__icon\s*\{[^}]*width:\s*36px;[^}]*height:\s*36px;/,
);
assert.match(codexCss, /@keyframes reservation-wobble[\s\S]*rotate:\s*-?\d/);
assert.doesNotMatch(codexCss, /translateX\(/);
assert.match(
  codexCss,
  /@media \(prefers-reduced-motion: reduce\)[\s\S]*\.reservation-trigger[\s\S]*animation:\s*none/,
);
assert.doesNotMatch(codexCss, /--night:\s*#07110f/);
assert.doesNotMatch(codexCss, /\.delivery-board/);

const codexScript = await read('codex/script.js');
assert.match(codexScript, /aria-expanded/);
assert.match(codexScript, /classList\.add\('is-open'\)/);
assert.match(codexScript, /event\.key === 'Escape'/);
assert.match(codexScript, /lastTrigger\.focus\(\)/);
assert.match(
  codexScript,
  /window\.setTimeout\(\(\) => \{[\s\S]*?revealItems\.forEach\(\(item\) => item\.classList\.add\('is-visible'\)\)[\s\S]*?\}, 1200\)/,
  'Codex page should reveal all content after the scroll-animation fallback timeout',
);

console.log(`Validated ${htmlFiles.length + 2} HTML pages and international SEO metadata.`);
