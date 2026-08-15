import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { preview } from 'vite';

const projectRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const distDirectory = join(projectRoot, 'dist');
const port = Number(process.env.PROGRAMMATIC_PREVIEW_PORT || 4192);
const screenshotDirectory = join(projectRoot, 'qa-artifacts', 'programmatic');
const failures = [];
const consoleMessages = [];
const pageMessages = [];
const hydrationPattern = /Minified React error #\d+|Hydration failed|Text content does not match|There was an error while hydrating|recoverable[^\n]*hydration/i;

const sitemapFiles = ['sitemap-industries-1.xml', 'sitemap-industries-2.xml', 'sitemap-industries-3.xml', 'sitemap-industries-4.xml', 'sitemap-industries-5.xml'];
const routes = ['/industries'];
for (const filename of sitemapFiles) {
  const xml = await readFile(join(projectRoot, 'public', filename), 'utf8');
  routes.push(...[...xml.matchAll(/<loc>https:\/\/liontechinnovations\.co\.uk([^<]+)<\/loc>/g)].map((match) => match[1]));
}
if (routes.length !== 101 || new Set(routes).size !== 101) throw new Error(`Expected 101 unique routes, received ${routes.length}/${new Set(routes).size}`);

const screenshotRoutes = [
  '/industries',
  '/industries/dental-practices',
  '/industries/solicitors',
  '/industries/roofing-contractors',
  '/industries/aesthetics-clinics/ai-visibility',
  '/industries/mortgage-brokers/how-ai-compares',
  '/industries/managed-it-service-providers/agent-readiness',
  '/industries/domiciliary-care-providers/checklist',
];

const discoveryRoutes = [
  { route: '/', featureHrefs: [], gateHrefs: [] },
  { route: '/ai-business-readiness', featureHrefs: ['/industries', '/industries', '/methodology#evidence-standards', '/contact#snapshot-enquiry'], gateHrefs: ['/industries', '/industries', '/methodology#evidence-standards', '/industries', '/contact#snapshot-enquiry'] },
  { route: '/ai-visibility-snapshot', featureHrefs: ['/methodology#evidence-standards', '/methodology#evidence-standards', '/industries', '/methodology#five-gates', '/readiness-fix-sprint', '/readiness-fix-sprint', '/contact#snapshot-enquiry'], gateHrefs: ['/industries', '/industries', '/methodology#evidence-standards', '/industries', '/contact#snapshot-enquiry'] },
  { route: '/methodology', featureHrefs: [], gateHrefs: ['/industries', '/industries', '#evidence-standards', '/industries', '/contact#snapshot-enquiry'] },
  { route: '/about', featureHrefs: [], gateHrefs: [] },
];

let previewServer;
let browser;
try {
  previewServer = await preview({
    root: projectRoot,
    plugins: [{
      name: 'prerender-directory-preview',
      configurePreviewServer(server) {
        server.middlewares.use(async (request, _response, next) => {
          const url = new URL(request.url || '/', 'http://127.0.0.1');
          if (url.pathname !== '/' && !url.pathname.includes('.')) {
            try {
              await access(join(distDirectory, url.pathname.slice(1), 'index.html'));
              request.url = `${url.pathname.replace(/\/$/, '')}/index.html${url.search}`;
            } catch {
              // Let Vite apply its normal fallback for non-prerendered paths.
            }
          }
          next();
        });
      },
    }],
    preview: { host: '127.0.0.1', port, strictPort: true },
  });
  browser = await chromium.launch({ headless: true });
  const baseUrl = `http://127.0.0.1:${port}`;
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });

  let nextRouteIndex = 0;
  let completedRoutes = 0;
  const testRoute = async () => {
    const index = nextRouteIndex;
    nextRouteIndex += 1;
    if (index >= routes.length) return;
    const route = routes[index];
    const page = await context.newPage();
    page.on('console', (message) => { if (message.type() === 'error') consoleMessages.push(`${route}: ${message.text()}`); });
    page.on('pageerror', (error) => pageMessages.push(`${route}: ${error.message}`));
    const response = await page.goto(`${baseUrl}${route}`, { waitUntil: 'domcontentloaded' });
    if (!response?.ok()) failures.push(`${route}: HTTP ${response?.status() ?? 'unknown'}`);
    await page.waitForTimeout(80);
    const state = await page.evaluate((isDirectory) => ({
      title: document.title,
      h1: document.querySelector('h1')?.textContent?.trim() ?? '',
      canonical: document.querySelector('link[rel="canonical"]')?.href ?? '',
      marker: Boolean(document.querySelector(isDirectory ? '[data-industry-directory]' : '[data-programmatic-content]')),
      ctas: document.querySelectorAll('[data-cta-placement] a[href="/contact#snapshot-enquiry"]').length,
      alternateJson: document.querySelector('link[rel="alternate"][type="application/json"]')?.getAttribute('href') ?? '',
      industriesPrimaryNav: Boolean(document.querySelector('.lt-desktop-nav a[href="/industries"]')),
      companyBrainPrimaryNav: Boolean(document.querySelector('.lt-desktop-nav a[href="/company-brain"]')),
      industriesActive: Boolean(document.querySelector('.lt-desktop-nav a[href="/industries"].is-active[aria-current="page"]')),
      footerIndustryGuides: Boolean(document.querySelector('.lt-unified-footer a[href="/industries"]')),
      footerCompanyBrain: Boolean(document.querySelector('.lt-unified-footer a[href="/company-brain"]')),
      directoryGuideLinks: isDirectory ? new Set([...document.querySelectorAll('[data-guide-type]')].map((link) => link.getAttribute('href'))).size : null,
      nestedInteractions: document.querySelectorAll('a a, a button, button a').length,
      invalidHrefs: [...document.querySelectorAll('a')].map((link) => link.getAttribute('href') || '').filter((href) => !href || href === '#' || /vercel\.app|localhost|127\.0\.0\.1/i.test(href)),
      brokenImages: [...document.images].filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.src),
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
      jsonLdValid: [...document.querySelectorAll('script[type="application/ld+json"]')].every((script) => {
        try { JSON.parse(script.textContent || ''); return true; } catch { return false; }
      }),
    }), route === '/industries');
    const expectedCanonical = new URL(route, 'https://liontechinnovations.co.uk').toString();
    if (!state.marker || !state.title || !state.h1) failures.push(`${route}: expected rendered content missing`);
    if (state.canonical !== expectedCanonical) failures.push(`${route}: canonical mismatch ${state.canonical}`);
    if (state.ctas !== (route === '/industries' ? 2 : 3)) failures.push(`${route}: expected CTA count missing (${state.ctas})`);
    if (route !== '/industries' && !state.alternateJson) failures.push(`${route}: alternate JSON link missing`);
    if (!state.industriesPrimaryNav || state.companyBrainPrimaryNav || !state.industriesActive) failures.push(`${route}: primary Industries navigation or active state is incorrect`);
    if (!state.footerIndustryGuides || !state.footerCompanyBrain) failures.push(`${route}: footer Industry Guides or Company Brain link missing`);
    if (route === '/industries' && state.directoryGuideLinks !== 100) failures.push(`/industries: expected 100 unique visible guide destinations, received ${state.directoryGuideLinks}`);
    if (state.nestedInteractions) failures.push(`${route}: nested interactive elements found (${state.nestedInteractions})`);
    if (state.invalidHrefs.length) failures.push(`${route}: invalid public hrefs ${state.invalidHrefs.join(', ')}`);
    if (state.brokenImages.length) failures.push(`${route}: broken images ${state.brokenImages.join(', ')}`);
    if (state.overflow) failures.push(`${route}: horizontal overflow at 1440px`);
    if (!state.jsonLdValid) failures.push(`${route}: JSON-LD parse error`);
    await page.close();
    completedRoutes += 1;
    if (completedRoutes % 20 === 0 || completedRoutes === routes.length) process.stdout.write(`Programmatic browser smoke: ${completedRoutes}/${routes.length}\n`);
    await testRoute();
  };
  await Promise.all(Array.from({ length: 6 }, () => testRoute()));

  for (const spec of discoveryRoutes) {
    const page = await context.newPage();
    page.on('console', (message) => { if (message.type() === 'error') consoleMessages.push(`${spec.route}: ${message.text()}`); });
    page.on('pageerror', (error) => pageMessages.push(`${spec.route}: ${error.message}`));
    const response = await page.goto(`${baseUrl}${spec.route}`, { waitUntil: 'domcontentloaded' });
    if (!response?.ok()) failures.push(`${spec.route}: HTTP ${response?.status() ?? 'unknown'}`);
    await page.waitForTimeout(100);

    const state = await page.evaluate(() => ({
      visibleIndustryLinks: [...document.querySelectorAll('a[href="/industries"]')].filter((link) => {
        const style = getComputedStyle(link);
        const rect = link.getBoundingClientRect();
        return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
      }).length,
      featureHrefs: [...document.querySelectorAll('[data-linked-card]')].map((link) => link.getAttribute('href')),
      gateHrefs: [...document.querySelectorAll('[data-linked-gate]')].map((link) => link.getAttribute('href')),
      methodologyIds: ['five-gates', 'evidence-standards'].filter((id) => document.getElementById(id)).length,
      footerIndustryGuides: Boolean(document.querySelector('.lt-unified-footer a[href="/industries"]')),
      footerCompanyBrain: Boolean(document.querySelector('.lt-unified-footer a[href="/company-brain"]')),
      nestedInteractions: document.querySelectorAll('a a, a button, button a').length,
      invalidHrefs: [...document.querySelectorAll('a')].map((link) => link.getAttribute('href') || '').filter((href) => !href || href === '#' || /vercel\.app|localhost|127\.0\.0\.1/i.test(href)),
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
    }));

    if (state.visibleIndustryLinks < 1) failures.push(`${spec.route}: visible Industries discovery link missing`);
    if (JSON.stringify(state.featureHrefs) !== JSON.stringify(spec.featureHrefs)) failures.push(`${spec.route}: linked feature-card destinations changed (${state.featureHrefs.join(', ')})`);
    if (JSON.stringify(state.gateHrefs) !== JSON.stringify(spec.gateHrefs)) failures.push(`${spec.route}: linked Five Gates destinations changed (${state.gateHrefs.join(', ')})`);
    if (spec.route === '/methodology' && state.methodologyIds !== 2) failures.push('/methodology: Five Gates or evidence-standards anchor missing');
    if (!state.footerIndustryGuides || !state.footerCompanyBrain) failures.push(`${spec.route}: footer Industry Guides or Company Brain link missing`);
    if (state.nestedInteractions) failures.push(`${spec.route}: nested interactive elements found (${state.nestedInteractions})`);
    if (state.invalidHrefs.length) failures.push(`${spec.route}: invalid public hrefs ${state.invalidHrefs.join(', ')}`);
    if (state.overflow) failures.push(`${spec.route}: horizontal overflow at 1440px`);

    const linkedCard = page.locator('[data-linked-card], [data-linked-gate]').first();
    if (await linkedCard.count()) {
      await linkedCard.focus();
      const focusState = await linkedCard.evaluate((element) => ({
        active: document.activeElement === element,
        outline: getComputedStyle(element).outlineStyle,
      }));
      if (!focusState.active || focusState.outline === 'none') failures.push(`${spec.route}: linked card lacks keyboard focus visibility`);
    }
    await page.close();
  }

  await mkdir(screenshotDirectory, { recursive: true });
  for (const route of screenshotRoutes) {
    for (const viewport of [{ name: 'desktop', width: 1440, height: 900 }, { name: 'mobile', width: 390, height: 844 }]) {
      const page = await context.newPage();
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(`${baseUrl}${route}`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(100);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2);
      if (overflow) failures.push(`${route}: horizontal overflow at ${viewport.width}px`);
      if (viewport.name === 'mobile' && !(await page.getByRole('button', { name: 'Open navigation' }).isVisible())) failures.push(`${route}: mobile navigation control missing`);
      const filename = `${route.slice(1).replaceAll('/', '--') || 'home'}--${viewport.name}.png`;
      await page.screenshot({ path: join(screenshotDirectory, filename), fullPage: true });
      await page.close();
    }
  }

  const hydrationMessages = [...consoleMessages, ...pageMessages].filter((message) => hydrationPattern.test(message));
  process.stdout.write(`Programmatic browser console errors: ${consoleMessages.length}\n`);
  process.stdout.write(`Programmatic page errors: ${pageMessages.length}\n`);
  process.stdout.write(`Programmatic hydration errors: ${hydrationMessages.length}\n`);
  process.stdout.write(`Core discovery journeys checked: ${discoveryRoutes.length}\n`);
  process.stdout.write(`Representative screenshots: ${screenshotRoutes.length * 2}\n`);
  failures.push(...consoleMessages, ...pageMessages);
  await writeFile(join(projectRoot, 'qa-artifacts', 'programmatic-route-result.json'), `${JSON.stringify({
    routesChecked: routes.length,
    desktopViewport: '1440x900',
    mobileViewport: '390x844',
    representativeScreenshots: screenshotRoutes.length * 2,
    consoleErrors: consoleMessages.length,
    pageErrors: pageMessages.length,
    hydrationErrors: hydrationMessages.length,
    failures,
  }, null, 2)}\n`, 'utf8');
  if (failures.length) throw new Error(failures.slice(0, 100).join('\n'));
} finally {
  await browser?.close();
  await previewServer?.httpServer.close();
}
