import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { chromium } from 'playwright';
import { createServer, preview } from 'vite';

const projectRoot = resolve(import.meta.dirname, '..');
const publicAssetPath = join(projectRoot, 'public', 'brand', 'liontech-email-signature-20260815.png');
const distAssetPath = join(projectRoot, 'dist', 'brand', 'liontech-email-signature-20260815.png');
const expectedHash = 'ce0773f56647a3e594766dbe0223415de22cf6bef8ef0b51d3216d008e79d33b';
const expectedImageUrl = 'https://liontechinnovations.co.uk/brand/liontech-email-signature-20260815.png';
const expectedDestinationUrl = 'https://liontechinnovations.co.uk/';
const expectedHomepageUrl = 'https://liontechinnovations.co.uk';
const expectedPlainText = `Kind regards,

Freejoy Chimbizi
Founder & CEO
Lion Tech Innovations Ltd
admin@liontechinnovations.co.uk
liontechinnovations.co.uk
+44 7305 824321`;
const failures = [];
const assert = (condition, message) => {
  if (!condition) failures.push(message);
};
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function inspectPng(buffer, label) {
  assert(buffer.subarray(0, 8).toString('hex') === '89504e470d0a1a0a', `${label}: invalid PNG signature`);
  assert(buffer.readUInt32BE(16) === 2172, `${label}: expected width 2172, received ${buffer.readUInt32BE(16)}`);
  assert(buffer.readUInt32BE(20) === 724, `${label}: expected height 724, received ${buffer.readUInt32BE(20)}`);
  assert(createHash('sha256').update(buffer).digest('hex') === expectedHash, `${label}: SHA-256 mismatch`);
}

inspectPng(await readFile(publicAssetPath), 'public asset');
inspectPng(await readFile(distAssetPath), 'dist asset');

const vite = await createServer({
  root: projectRoot,
  appType: 'custom',
  logLevel: 'error',
  server: { middlewareMode: true, hmr: false },
});

let signatureModule;
try {
  signatureModule = await vite.ssrLoadModule('/src/content/emailSignature.ts');
} finally {
  await vite.close();
}

const {
  SIGNATURE_DESTINATION_URL,
  SIGNATURE_HOMEPAGE_URL,
  SIGNATURE_HTML,
  SIGNATURE_IMAGE_URL,
  SIGNATURE_PLAIN_TEXT,
} = signatureModule;

assert(SIGNATURE_IMAGE_URL === expectedImageUrl, 'canonical image URL changed');
assert(SIGNATURE_DESTINATION_URL === expectedDestinationUrl, 'canonical banner destination changed');
assert(SIGNATURE_HOMEPAGE_URL === expectedHomepageUrl, 'canonical homepage URL changed');
assert(SIGNATURE_PLAIN_TEXT === expectedPlainText, 'plain-text signature changed');

const directBanner = new RegExp(
  `<a\\b[^>]*href="${escapeRegex(expectedDestinationUrl)}"[^>]*>\\s*<img\\b[^>]*src="${escapeRegex(expectedImageUrl)}"[^>]*\\/?>(?:\\s*)<\\/a>`,
  'i',
);
assert(directBanner.test(SIGNATURE_HTML), 'banner anchor must directly wrap the approved image');
assert(/<img\b[^>]*\bwidth="600"/i.test(SIGNATURE_HTML), 'signature image width="600" missing');
assert(/max-width:\s*100%/i.test(SIGNATURE_HTML), 'signature max-width:100% missing');
assert(/height:\s*auto/i.test(SIGNATURE_HTML), 'signature height:auto missing');
assert(SIGNATURE_HTML.includes(`href="mailto:admin@liontechinnovations.co.uk"`), 'signature mailto link changed');
assert(SIGNATURE_HTML.includes(`href="tel:+447305824321"`), 'signature telephone link changed');
assert(SIGNATURE_HTML.includes(`href="${expectedHomepageUrl}"`), 'signature homepage link changed');
assert(!/<script\b/i.test(SIGNATURE_HTML), 'copied signature HTML contains a script');
assert(!/\bclass\s*=/i.test(SIGNATURE_HTML), 'copied signature HTML contains class=');
assert(!/\bsrc\s*=\s*["']data:/i.test(SIGNATURE_HTML), 'copied signature HTML contains a data image');
assert(!/base64/i.test(SIGNATURE_HTML), 'copied signature HTML contains base64');
assert(!/registered\s+office|streetAddress|addressLocality|addressRegion|postalCode|PostalAddress/i.test(SIGNATURE_HTML), 'copied signature HTML contains prohibited private-location data');
assert(!/stripe\.com|buy\.stripe|checkout\.stripe/i.test(SIGNATURE_HTML), 'copied signature HTML contains a public Stripe link');

const installerSource = await readFile(join(projectRoot, 'src', 'pages', 'SignatureInstallPage.tsx'), 'utf8');
for (const expectedSource of ["'text/html'", "'text/plain'", 'navigator.clipboard.write', 'navigator.clipboard.writeText']) {
  assert(installerSource.includes(expectedSource), `installer clipboard source missing ${expectedSource}`);
}
assert(installerSource.includes('COPY SIGNATURE FOR GMAIL'), 'installer copy button missing');
assert(installerSource.includes('dangerouslySetInnerHTML'), 'installer rendered preview missing');
assert(!/<pre\b|<textarea\b/i.test(installerSource), 'installer exposes raw HTML in a text container');

const routeSource = await readFile(join(projectRoot, 'src', 'routes', 'AppRoutes.tsx'), 'utf8');
const prerenderSource = await readFile(join(projectRoot, 'src', 'prerender.tsx'), 'utf8');
const vercelConfigSource = await readFile(join(projectRoot, 'vercel.json'), 'utf8');
for (const [label, source] of [['router', routeSource], ['prerender', prerenderSource], ['Vercel rewrites', vercelConfigSource]]) {
  assert(source.includes('/email/signature-install'), `${label}: signature installer route missing`);
}

const renderedInstaller = await readFile(join(projectRoot, 'dist', 'email', 'signature-install', 'index.html'), 'utf8');
assert(/<meta\s+name="robots"\s+content="noindex,follow"\s*\/>/i.test(renderedInstaller), 'installer prerender is missing noindex,follow');
assert(renderedInstaller.includes('COPY SIGNATURE FOR GMAIL'), 'installer prerender is missing the copy button');
assert(renderedInstaller.includes('Rendered LionTech email signature preview'), 'installer prerender is missing the real preview');
for (const sitemap of ['sitemap.xml', 'sitemap-core.xml', 'sitemap-industries-1.xml', 'sitemap-industries-2.xml', 'sitemap-industries-3.xml', 'sitemap-industries-4.xml', 'sitemap-industries-5.xml']) {
  assert(!(await readFile(join(projectRoot, 'public', sitemap), 'utf8')).includes('/email/signature-install'), `${sitemap}: internal installer leaked into public sitemap`);
}

const vercelConfig = JSON.parse(vercelConfigSource);
const exactRewrites = new Map(
  vercelConfig.rewrites
    .filter(({ source }) => !source.includes('(') && !source.includes(':'))
    .map(({ source, destination }) => [source.replace(/\/$/, '') || '/', destination]),
);
const port = Number(process.env.EMAIL_SIGNATURE_PREVIEW_PORT || 4193);
let previewServer;
let browser;
let browserContext;

try {
  previewServer = await preview({
    root: projectRoot,
    plugins: [{
      name: 'signature-vercel-rewrite-preview',
      configurePreviewServer(server) {
        server.middlewares.use((request, _response, next) => {
          const url = new URL(request.url || '/', 'http://127.0.0.1');
          const destination = exactRewrites.get(url.pathname.replace(/\/$/, '') || '/');
          if (destination) request.url = `${destination}${url.search}`;
          next();
        });
      },
    }],
    preview: { host: '127.0.0.1', port, strictPort: true },
  });

  browser = await chromium.launch({ headless: true });
  browserContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const formattedPage = await browserContext.newPage();
  await formattedPage.addInitScript(() => {
    window.__signatureClipboardCalls = { write: [], writeText: [] };
    class TestClipboardItem {
      constructor(values) {
        this.values = values;
        this.types = Object.keys(values);
      }
      async getType(type) {
        return this.values[type];
      }
    }
    Object.defineProperty(window, 'ClipboardItem', { configurable: true, value: TestClipboardItem });
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        write: async (items) => {
          const records = [];
          for (const item of items) {
            const record = {};
            for (const type of item.types) record[type] = await (await item.getType(type)).text();
            records.push(record);
          }
          window.__signatureClipboardCalls.write.push(records);
        },
        writeText: async (value) => window.__signatureClipboardCalls.writeText.push(value),
      },
    });
  });

  const response = await formattedPage.goto(`http://127.0.0.1:${port}/email/signature-install`, { waitUntil: 'networkidle' });
  assert(response?.ok(), `installer returned HTTP ${response?.status() ?? 'unknown'}`);
  const browserState = await formattedPage.evaluate(() => {
    const preview = document.querySelector('.lt-signature-preview');
    const banner = preview?.querySelector('a[href="https://liontechinnovations.co.uk/"]');
    const image = banner?.querySelector('img');
    return {
      bodyText: document.body.innerText,
      robots: document.querySelector('meta[name="robots"]')?.getAttribute('content'),
      bannerHref: banner?.href,
      bannerOnlyWrapsImage: Boolean(banner && banner.children.length === 1 && banner.firstElementChild?.tagName === 'IMG'),
      imageWidthAttribute: image?.getAttribute('width'),
      imageRenderedWidth: image?.getBoundingClientRect().width,
      imageNaturalWidth: image?.naturalWidth,
      imageSource: image?.getAttribute('src'),
      homepageLink: preview?.querySelector('a[href="https://liontechinnovations.co.uk"]')?.getAttribute('href'),
      emailLink: preview?.querySelector('a[href="mailto:admin@liontechinnovations.co.uk"]')?.getAttribute('href'),
      telephoneLink: preview?.querySelector('a[href="tel:+447305824321"]')?.getAttribute('href'),
    };
  });
  assert(browserState.robots === 'noindex,follow', 'browser installer noindex value changed');
  assert(!browserState.bodyText.includes('<a ') && !browserState.bodyText.includes('SIGNATURE_HTML'), 'raw signature HTML is visible');
  assert(browserState.bannerHref === expectedDestinationUrl, 'preview banner destination changed');
  assert(browserState.bannerOnlyWrapsImage, 'preview banner anchor does not directly wrap the image');
  assert(browserState.imageWidthAttribute === '600', 'preview image width attribute changed');
  assert(Math.abs((browserState.imageRenderedWidth ?? 0) - 600) <= 1, `preview banner rendered at ${browserState.imageRenderedWidth}px instead of 600px`);
  assert(browserState.imageNaturalWidth === 2172, 'preview banner did not load the approved asset');
  assert(browserState.imageSource === '/brand/liontech-email-signature-20260815.png', 'preview does not use the local approved static asset');
  assert(browserState.homepageLink === expectedHomepageUrl, 'preview homepage link changed');
  assert(browserState.emailLink === 'mailto:admin@liontechinnovations.co.uk', 'preview email link changed');
  assert(browserState.telephoneLink === 'tel:+447305824321', 'preview telephone link changed');

  await formattedPage.getByRole('button', { name: 'COPY SIGNATURE FOR GMAIL' }).click();
  await formattedPage.getByRole('status').filter({ hasText: 'Copied with formatting' }).waitFor();
  const formattedCalls = await formattedPage.evaluate(() => window.__signatureClipboardCalls);
  assert(formattedCalls.write.length === 1, 'formatted clipboard write was not called exactly once');
  assert(formattedCalls.writeText.length === 0, 'plain-text fallback ran during formatted clipboard success');
  assert(formattedCalls.write[0]?.[0]?.['text/html'] === SIGNATURE_HTML, 'formatted clipboard HTML changed');
  assert(formattedCalls.write[0]?.[0]?.['text/plain'] === SIGNATURE_PLAIN_TEXT, 'formatted clipboard plain text changed');

  const fallbackPage = await browserContext.newPage();
  await fallbackPage.setViewportSize({ width: 390, height: 844 });
  await fallbackPage.addInitScript(() => {
    window.__signatureClipboardCalls = { writeText: [] };
    Object.defineProperty(window, 'ClipboardItem', { configurable: true, value: undefined });
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: async (value) => window.__signatureClipboardCalls.writeText.push(value) },
    });
  });
  await fallbackPage.goto(`http://127.0.0.1:${port}/email/signature-install`, { waitUntil: 'networkidle' });
  await fallbackPage.getByRole('button', { name: 'COPY SIGNATURE FOR GMAIL' }).click();
  await fallbackPage.getByRole('status').filter({ hasText: 'plain-text signature was copied' }).waitFor();
  const fallbackCalls = await fallbackPage.evaluate(() => window.__signatureClipboardCalls);
  assert(fallbackCalls.writeText.length === 1 && fallbackCalls.writeText[0] === SIGNATURE_PLAIN_TEXT, 'plain-text clipboard fallback changed');
} catch (error) {
  failures.push(`browser signature check failed: ${error.message}`);
} finally {
  await browserContext?.close();
  await browser?.close();
  await previewServer?.httpServer.close();
}

process.stdout.write(`Email signature asset: 2172x724 sha256=${expectedHash}\n`);
process.stdout.write(`Email signature installer: route=1 formattedClipboard=1 plainTextFallback=1\n`);
process.stdout.write(`Email signature failures: ${failures.length}\n`);
if (failures.length) throw new Error(failures.join('\n'));
