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

const allHtmlFiles = [...htmlFiles, 'en/index.html'];

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

console.log(`Validated ${htmlFiles.length + 1} HTML pages and international SEO metadata.`);
