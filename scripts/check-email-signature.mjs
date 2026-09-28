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
  FIX_SIGNATURE_DESTINATION_URL,
  FIX_SIGNATURE_HTML,
  FIX_SIGNATURE_IMAGE_URL,
  FIX_SIGNATURE_PLAIN_TEXT,
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

const expectedFixImageUrl = 'https://liontechinnovations.co.uk/brand/fix-banner.png';
const expectedFixHash = 'a609e9102c44b8d536742be7e0ca3de09c08ea6699061ab65eb8ad0f452fe165';
for (const directory of ['public', 'dist']) {
  const bytes = await readFile(join(projectRoot, directory, 'brand', 'fix-banner.png'));
  assert(bytes.subarray(0, 8).toString('hex') === '89504e470d0a1a0a', `${directory}: fix banner is not PNG`);
  assert(bytes.readUInt32BE(16) === 1774 && bytes.readUInt32BE(20) === 887, `${directory}: fix banner dimensions changed`);
  assert(createHash('sha256').update(bytes).digest('hex') === expectedFixHash, `${directory}: approved fix banner bytes changed`);
}
assert(FIX_SIGNATURE_IMAGE_URL === expectedFixImageUrl, 'fix image URL changed');
assert(FIX_SIGNATURE_DESTINATION_URL === expectedDestinationUrl, 'fix destination must be the homepage');
assert(FIX_SIGNATURE_PLAIN_TEXT === `Kind regards,

Freejoy Chimbizi
Founder & CEO
Lion Tech Innovations Ltd
+44 7305 824321
admin@liontechinnovations.co.uk
https://liontechinnovations.co.uk/`, 'fix plain-text contact details changed');
assert(!/AI Visibility|See what AI says|liontech-email-signature-20260815|Snapshot|CareOps|PostOrder|stripe/i.test(FIX_SIGNATURE_HTML), 'fix signature contains another campaign');
assert(!/<script\b|<map\b|<area\b|\bclass\s*=|\bon\w+\s*=/i.test(FIX_SIGNATURE_HTML), 'fix signature must use conservative email HTML');

const installerSource = await readFile(join(projectRoot, 'src', 'pages', 'SignatureInstallPage.tsx'), 'utf8');
for (const expectedSource of ["'text/html'", "'text/plain'", 'navigator.clipboard.write', 'navigator.clipboard.writeText']) {
  assert(installerSource.includes(expectedSource), `installer clipboard source missing ${expectedSource}`);
}
assert(installerSource.includes('COPY SIGNATURE FOR GMAIL'), 'installer copy button missing');
assert(installerSource.includes('dangerouslySetInnerHTML'), 'installer rendered preview missing');
assert(installerSource.includes('opens the LionTech homepage.'), 'installer banner destination guidance changed');
assert(!installerSource.includes('opens the Snapshot enquiry form.'), 'installer contains the retired Snapshot banner guidance');
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

  const fixPageErrors = [];
  formattedPage.on('pageerror', (error) => fixPageErrors.push(error.message));
  const fixResponse = await formattedPage.goto(`http://127.0.0.1:${port}/email/signature-install?variant=fix`, { waitUntil: 'networkidle' });
  assert(fixResponse?.ok(), 'fix installer did not return HTTP 200');
  await formattedPage.getByRole('heading', { name: 'LionTech Founder — Automation Fix', exact: true }).waitFor();
  const fixImage = formattedPage.getByRole('img', { name: 'Lion Tech Innovations — Turn More Enquiries Into Revenue', exact: true });
  const fixState = await fixImage.evaluate((image) => {
    const banner = image.parentElement;
    const preview = image.closest('.lt-signature-preview');
    const bounds = image.getBoundingClientRect();
    const anchorBounds = banner.getBoundingClientRect();
    return {
      source: image.getAttribute('src'), complete: image.complete, width: image.naturalWidth, height: image.naturalHeight,
      renderedWidth: bounds.width, renderedHeight: bounds.height, widthAttribute: image.getAttribute('width'),
      bannerTag: banner.tagName, href: banner.getAttribute('href'), target: banner.getAttribute('target'), rel: banner.getAttribute('rel'),
      onlyImage: banner.children.length === 1 && banner.firstElementChild === image,
      covered: bounds.left >= anchorBounds.left && bounds.right <= anchorBounds.right && bounds.top >= anchorBounds.top && bounds.bottom <= anchorBounds.bottom,
      phone: preview.querySelector('a[href^="tel:"]')?.getAttribute('href'),
      email: preview.querySelector('a[href^="mailto:"]')?.getAttribute('href'),
      website: [...preview.querySelectorAll('a')].find((link) => link.textContent === 'https://liontechinnovations.co.uk')?.getAttribute('href'),
      horizontalOverflow: preview.scrollWidth > preview.clientWidth || document.documentElement.scrollWidth > innerWidth,
    };
  });
  assert(fixState.source === expectedFixImageUrl, 'fix preview image URL is incorrect');
  assert(fixState.complete && fixState.width === 1774 && fixState.height === 887, 'fix preview image did not load');
  assert(fixState.widthAttribute === '600' && Math.abs(fixState.renderedWidth - 600) <= 1 && Math.abs(fixState.renderedWidth / fixState.renderedHeight - 2) < 0.01, 'fix image size or proportions changed');
  assert(fixState.bannerTag === 'A' && fixState.onlyImage && fixState.covered && fixState.href === expectedDestinationUrl, 'whole fix banner is not inside the homepage anchor');
  assert(fixState.target === '_blank' && fixState.rel === 'noopener noreferrer', 'fix banner external-link attributes changed');
  assert(fixState.phone === 'tel:+447305824321' && fixState.email === 'mailto:admin@liontechinnovations.co.uk' && fixState.website === expectedDestinationUrl, 'fix contact links are incorrect');
  assert(!fixState.horizontalOverflow, 'fix desktop preview clips horizontally');

  // Verify external-protocol clicks without starting a call or composing an email.
  await formattedPage.evaluate(() => {
    window.__signatureProtocolClicks = [];
    document.addEventListener('click', (event) => {
      const link = event.target.closest('a');
      if (link && /^(tel:|mailto:)/.test(link.getAttribute('href'))) {
        event.preventDefault();
        window.__signatureProtocolClicks.push(link.getAttribute('href'));
      }
    });
  });
  await formattedPage.getByRole('link', { name: '+44 7305 824321', exact: true }).click();
  await formattedPage.getByRole('link', { name: 'admin@liontechinnovations.co.uk', exact: true }).click();
  assert(JSON.stringify(await formattedPage.evaluate(() => window.__signatureProtocolClicks)) === JSON.stringify(['tel:+447305824321', 'mailto:admin@liontechinnovations.co.uk']), 'fix phone/email clicks failed');

  const fixBanner = formattedPage.getByRole('link', { name: 'Lion Tech Innovations — Turn More Enquiries Into Revenue', exact: true });
  for (const [xFraction, yFraction] of [[0.05, 0.5], [0.5, 0.5], [0.95, 0.9]]) {
    const [popup] = await Promise.all([
      formattedPage.waitForEvent('popup'),
      fixBanner.click({ position: { x: fixState.renderedWidth * xFraction, y: fixState.renderedHeight * yFraction } }),
    ]);
    await popup.waitForURL(expectedDestinationUrl, { waitUntil: 'domcontentloaded' });
    assert(popup.url() === expectedDestinationUrl, `fix banner click at ${xFraction} missed the homepage`);
    await popup.close();
  }
  const [websitePopup] = await Promise.all([
    formattedPage.waitForEvent('popup'),
    formattedPage.getByRole('link', { name: 'https://liontechinnovations.co.uk', exact: true }).click(),
  ]);
  await websitePopup.waitForURL(expectedDestinationUrl, { waitUntil: 'domcontentloaded' });
  assert(websitePopup.url() === expectedDestinationUrl, 'fix website text does not open the homepage');
  await websitePopup.close();

  await formattedPage.getByRole('button', { name: 'COPY SIGNATURE', exact: true }).click();
  await formattedPage.getByRole('status').filter({ hasText: 'Copied with formatting' }).waitFor();
  const fixClipboardCalls = await formattedPage.evaluate(() => window.__signatureClipboardCalls);
  assert(fixClipboardCalls.write.length === 1 && fixClipboardCalls.write[0]?.[0]?.['text/html'] === FIX_SIGNATURE_HTML && fixClipboardCalls.write[0]?.[0]?.['text/plain'] === FIX_SIGNATURE_PLAIN_TEXT, 'fix rich clipboard content differs from approved signature');
  assert(fixClipboardCalls.writeText.length === 0, 'fix rich copy unexpectedly fell back to text');
  assert(fixPageErrors.length === 0, `fix installer browser/hydration errors: ${fixPageErrors.join('; ')}`);

  await fallbackPage.goto(`http://127.0.0.1:${port}/email/signature-install?variant=fix`, { waitUntil: 'networkidle' });
  await fallbackPage.getByRole('button', { name: 'COPY SIGNATURE', exact: true }).click();
  await fallbackPage.getByRole('status').filter({ hasText: 'plain-text signature was copied' }).waitFor();
  const fixMobile = await fallbackPage.evaluate(() => {
    const preview = document.querySelector('.lt-signature-preview');
    const image = preview.querySelector('img');
    const bounds = image.getBoundingClientRect();
    const previewBounds = preview.getBoundingClientRect();
    return {
      calls: window.__signatureClipboardCalls.writeText,
      complete: image.complete && image.naturalWidth === 1774,
      fits: preview.scrollWidth <= preview.clientWidth && document.documentElement.scrollWidth <= innerWidth && bounds.left >= previewBounds.left && bounds.right <= previewBounds.right,
      ratio: bounds.width / bounds.height,
    };
  });
  assert(fixMobile.calls.length === 1 && fixMobile.calls[0] === FIX_SIGNATURE_PLAIN_TEXT, 'fix plain-text fallback changed');
  assert(fixMobile.complete && fixMobile.fits && Math.abs(fixMobile.ratio - 2) < 0.01, 'fix mobile preview is broken, clipped or distorted');
} catch (error) {
  failures.push(`browser signature check failed: ${error.message}`);
} finally {
  await browserContext?.close();
  await browser?.close();
  await previewServer?.httpServer.close();
}

process.stdout.write(`Email signature asset: 2172x724 sha256=${expectedHash}\n`);
process.stdout.write(`Email signature installer: route=1 formattedClipboard=1 plainTextFallback=1\n`);
process.stdout.write(`Automation Fix signature: lockedImage=1774x887 variant=fix bannerClickPositions=3 contactLinks=3 richClipboard=1 mobileFallback=1\n`);
process.stdout.write(`Email signature failures: ${failures.length}\n`);
if (failures.length) throw new Error(failures.join('\n'));
