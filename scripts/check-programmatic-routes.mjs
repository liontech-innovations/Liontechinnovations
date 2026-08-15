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
  '/methodology',
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
      directoryEntries: isDirectory ? document.querySelectorAll('[data-industry-directory-entry]').length : null,
      directoryPrimaryLinks: isDirectory ? document.querySelectorAll('[data-industry-directory-entry] > .lt-industry-primary-link[data-guide-type="hub"]').length : null,
      directorySecondaryLinks: isDirectory ? document.querySelectorAll('[data-industry-directory-entry] .lt-industry-secondary-actions a[data-guide-type]').length : null,
      directoryFilterButtons: isDirectory ? document.querySelectorAll('[data-guide-filter-button]').length : null,
      directoryHierarchyValid: isDirectory ? [...document.querySelectorAll('[data-industry-directory-entry]')].every((entry) => (
        entry.querySelectorAll(':scope > a.lt-industry-primary-link[data-guide-type="hub"]').length === 1
        && entry.querySelectorAll(':scope > nav.lt-industry-secondary-actions > a').length === 4
        && [...entry.querySelectorAll(':scope > nav.lt-industry-secondary-actions > a')].every((link) => link.tagName === 'A')
      )) : null,
      nestedInteractions: document.querySelectorAll('a a, a button, button a').length,
      invalidHrefs: [...document.querySelectorAll('a')].map((link) => link.getAttribute('href') || '').filter((href) => !href || href === '#' || /vercel\.app|localhost|127\.0\.0\.1/i.test(href)),
      brokenImages: [...document.images].filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.src),
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
      h1FontSize: Number.parseFloat(getComputedStyle(document.querySelector('h1')).fontSize),
      h2FontSizes: [...document.querySelectorAll('.lt-industry-page .lt-industry-panel > h2, .lt-industry-directory .lt-industry-guide-filter h2, .lt-industry-directory .lt-industry-directory-group > h2')].map((heading) => Number.parseFloat(getComputedStyle(heading).fontSize)),
      textBoundsValid: [...document.querySelectorAll('.lt-industry-page h1, .lt-industry-page h2, .lt-industry-page h3, .lt-industry-page p, .lt-industry-page li, .lt-industry-directory h1, .lt-industry-directory h2, .lt-industry-directory h3, .lt-industry-directory p')].every((element) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return style.display === 'none' || style.visibility === 'hidden' || rect.width === 0 || (rect.left >= -2 && rect.right <= document.documentElement.clientWidth + 2);
      }),
      cardsUnclipped: [...document.querySelectorAll('.lt-industry-page .lt-standard-card, .lt-industry-directory .lt-standard-card')].every((card) => card.scrollWidth <= card.clientWidth + 2 && card.scrollHeight <= card.clientHeight + 2),
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
    if (route === '/industries' && (state.directoryEntries !== 20 || state.directoryPrimaryLinks !== 20 || state.directorySecondaryLinks !== 80 || state.directoryFilterButtons !== 5 || !state.directoryHierarchyValid)) failures.push(`/industries: directory hierarchy is invalid (${state.directoryEntries} entries, ${state.directoryPrimaryLinks} primary, ${state.directorySecondaryLinks} secondary, ${state.directoryFilterButtons} filters)`);
    if (state.nestedInteractions) failures.push(`${route}: nested interactive elements found (${state.nestedInteractions})`);
    if (state.invalidHrefs.length) failures.push(`${route}: invalid public hrefs ${state.invalidHrefs.join(', ')}`);
    if (state.brokenImages.length) failures.push(`${route}: broken images ${state.brokenImages.join(', ')}`);
    if (state.overflow) failures.push(`${route}: horizontal overflow at 1440px`);
    if (state.h1FontSize < 32 || state.h1FontSize > 42) failures.push(`${route}: knowledge-engine H1 scale drifted (${state.h1FontSize}px)`);
    if (state.h2FontSizes.some((size) => size < 24 || size > 34)) failures.push(`${route}: knowledge-engine H2 scale drifted (${state.h2FontSizes.join(', ')}px)`);
    if (!state.textBoundsValid || !state.cardsUnclipped) failures.push(`${route}: text or card bounds are clipped at 1440px`);
    if (!state.jsonLdValid) failures.push(`${route}: JSON-LD parse error`);
    await page.close();
    completedRoutes += 1;
    if (completedRoutes % 20 === 0 || completedRoutes === routes.length) process.stdout.write(`Programmatic browser smoke: ${completedRoutes}/${routes.length}\n`);
    await testRoute();
  };
  await Promise.all(Array.from({ length: 6 }, () => testRoute()));

  const directoryPage = await context.newPage();
  directoryPage.on('console', (message) => { if (message.type() === 'error') consoleMessages.push(`/industries interaction: ${message.text()}`); });
  directoryPage.on('pageerror', (error) => pageMessages.push(`/industries interaction: ${error.message}`));
  await directoryPage.goto(`${baseUrl}/industries`, { waitUntil: 'domcontentloaded' });
  await directoryPage.waitForTimeout(100);

  const initialDirectoryLayout = await directoryPage.evaluate(() => {
    const hero = document.querySelector('.lt-industry-hero');
    const heading = document.querySelector('.lt-industry-hero h1');
    const cards = [...document.querySelectorAll('[data-industry-directory-entry]')];
    const professionalCards = [...document.querySelectorAll('[data-industry-group="Professional and financial services"] [data-industry-directory-entry]')];
    const guidePanel = document.querySelector('.lt-industry-guide-filter');
    const guideHeading = document.querySelector('.lt-industry-guide-filter h2');
    const groupHeading = document.querySelector('.lt-industry-directory-group h2');
    const industryBody = document.querySelector('.lt-industry-body');
    const primaryHeading = cards[0]?.querySelector('.lt-industry-primary-heading h3');
    const firstCardWidth = cards[0]?.getBoundingClientRect().width ?? 0;
    const oddCardWidth = professionalCards.at(-1)?.getBoundingClientRect().width ?? 0;
    return {
      heroBottom: hero?.getBoundingClientRect().bottom ?? Number.POSITIVE_INFINITY,
      h1FontSize: heading ? Number.parseFloat(getComputedStyle(heading).fontSize) : Number.POSITIVE_INFINITY,
      guidePanelHeight: guidePanel?.getBoundingClientRect().height ?? Number.POSITIVE_INFINITY,
      guidePanelBlockPadding: guidePanel ? Number.parseFloat(getComputedStyle(guidePanel).paddingTop) : Number.POSITIVE_INFINITY,
      guideHeadingSize: guideHeading ? Number.parseFloat(getComputedStyle(guideHeading).fontSize) : Number.POSITIVE_INFINITY,
      groupHeadingSize: groupHeading ? Number.parseFloat(getComputedStyle(groupHeading).fontSize) : Number.POSITIVE_INFINITY,
      bodyGap: industryBody ? Number.parseFloat(getComputedStyle(industryBody).rowGap) : Number.POSITIVE_INFINITY,
      cardMinHeight: cards[0] ? Number.parseFloat(getComputedStyle(cards[0]).minHeight) : Number.POSITIVE_INFINITY,
      cardHeights: cards.map((card) => card.getBoundingClientRect().height),
      primaryHeadingSize: primaryHeading ? Number.parseFloat(getComputedStyle(primaryHeading).fontSize) : Number.POSITIVE_INFINITY,
      cardsUnclipped: cards.every((card) => card.scrollHeight <= card.clientHeight + 2),
      actionsContained: cards.every((card) => {
        const cardRect = card.getBoundingClientRect();
        return [...card.querySelectorAll('.lt-industry-secondary-actions a')].every((link) => {
          const rect = link.getBoundingClientRect();
          return rect.left >= cardRect.left - 1 && rect.right <= cardRect.right + 1 && rect.top >= cardRect.top - 1 && rect.bottom <= cardRect.bottom + 1;
        });
      }),
      targetSizesValid: cards.every((card) => [...card.querySelectorAll('.lt-industry-secondary-actions a')].every((link) => link.getBoundingClientRect().height >= 44)),
      oddCardIntentional: firstCardWidth > 0 && oddCardWidth >= firstCardWidth * 1.75,
    };
  });
  if (initialDirectoryLayout.heroBottom > 900 || initialDirectoryLayout.h1FontSize < 32 || initialDirectoryLayout.h1FontSize > 42) failures.push(`/industries: desktop hero exceeds the locked knowledge-engine scale (${initialDirectoryLayout.heroBottom}px, ${initialDirectoryLayout.h1FontSize}px)`);
  if (initialDirectoryLayout.guidePanelHeight > 180 || initialDirectoryLayout.guidePanelBlockPadding < 16 || initialDirectoryLayout.guidePanelBlockPadding > 22 || initialDirectoryLayout.guideHeadingSize < 24 || initialDirectoryLayout.guideHeadingSize > 32) failures.push(`/industries: Guide Types panel density drifted (${initialDirectoryLayout.guidePanelHeight}px, ${initialDirectoryLayout.guidePanelBlockPadding}px, ${initialDirectoryLayout.guideHeadingSize}px)`);
  if (initialDirectoryLayout.groupHeadingSize < 27 || initialDirectoryLayout.groupHeadingSize > 36 || initialDirectoryLayout.bodyGap < 48 || initialDirectoryLayout.bodyGap > 61) failures.push(`/industries: directory heading or section rhythm drifted (${initialDirectoryLayout.groupHeadingSize}px, ${initialDirectoryLayout.bodyGap}px)`);
  if (initialDirectoryLayout.cardMinHeight < 245 || initialDirectoryLayout.cardMinHeight > 265 || initialDirectoryLayout.cardHeights.some((height) => height < 245 || height > 305) || initialDirectoryLayout.primaryHeadingSize < 19 || initialDirectoryLayout.primaryHeadingSize > 25.5) failures.push(`/industries: directory card scale drifted (${initialDirectoryLayout.cardMinHeight}px min, ${initialDirectoryLayout.primaryHeadingSize}px heading)`);
  if (!initialDirectoryLayout.cardsUnclipped || !initialDirectoryLayout.actionsContained || !initialDirectoryLayout.targetSizesValid || !initialDirectoryLayout.oddCardIntentional) failures.push('/industries: desktop card geometry, action containment or odd-card handling failed');

  for (const filter of ['ai-visibility', 'how-ai-compares', 'agent-readiness', 'checklist']) {
    const button = directoryPage.locator(`[data-guide-filter-button="${filter}"]`);
    await button.click();
    const filterState = await directoryPage.evaluate((selectedFilter) => ({
      selected: document.querySelector(`[data-guide-filter-button="${selectedFilter}"]`)?.getAttribute('aria-pressed'),
      pressedCount: document.querySelectorAll('[data-guide-filter-button][aria-pressed="true"]').length,
      entries: document.querySelectorAll('[data-industry-directory-entry]').length,
      links: document.querySelectorAll('[data-industry-directory-entry] [data-guide-type]').length,
      prioritised: document.querySelectorAll(`.lt-industry-secondary-actions [data-guide-type="${selectedFilter}"].is-prioritised`).length,
      statusText: document.querySelector('.lt-industry-filter-status')?.textContent ?? '',
    }), filter);
    if (filterState.selected !== 'true' || filterState.pressedCount !== 1 || filterState.entries !== 20 || filterState.links !== 100 || filterState.prioritised !== 20 || !filterState.statusText.trim()) failures.push(`/industries: ${filter} filter state is not accessible or visually applied`);
  }

  const keyboardFilter = directoryPage.locator('[data-guide-filter-button="ai-visibility"]');
  await keyboardFilter.focus();
  await keyboardFilter.press('Space');
  if (await keyboardFilter.getAttribute('aria-pressed') !== 'true') failures.push('/industries: guide filter is not keyboard operable');

  for (const selector of ['.lt-industry-primary-link', '.lt-industry-secondary-actions a', '[data-guide-filter-button]']) {
    const control = directoryPage.locator(selector).first();
    await control.focus();
    const focusState = await control.evaluate((element) => ({
      active: document.activeElement === element,
      cursor: getComputedStyle(element).cursor,
      outline: getComputedStyle(element).outlineStyle,
    }));
    if (!focusState.active || focusState.cursor !== 'pointer' || focusState.outline === 'none') failures.push(`/industries: ${selector} lacks pointer or keyboard focus affordance`);
  }

  const navigationCases = [
    { guideType: 'hub', expectedPath: '/industries/aesthetics-clinics' },
    { guideType: 'ai-visibility', expectedPath: '/industries/aesthetics-clinics/ai-visibility' },
    { guideType: 'how-ai-compares', expectedPath: '/industries/aesthetics-clinics/how-ai-compares' },
    { guideType: 'agent-readiness', expectedPath: '/industries/aesthetics-clinics/agent-readiness' },
    { guideType: 'checklist', expectedPath: '/industries/aesthetics-clinics/checklist' },
  ];
  for (const navigationCase of navigationCases) {
    await directoryPage.goto(`${baseUrl}/industries`, { waitUntil: 'domcontentloaded' });
    await directoryPage.locator(`[data-industry-directory-entry="aesthetics-clinics"] [data-guide-type="${navigationCase.guideType}"]`).click();
    await directoryPage.waitForTimeout(80);
    if (new URL(directoryPage.url()).pathname !== navigationCase.expectedPath) failures.push(`/industries: ${navigationCase.guideType} interaction navigated to ${new URL(directoryPage.url()).pathname}`);
  }
  await directoryPage.close();

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
      evidenceGeometry: (() => {
        const grid = document.querySelector('.lt-route-evidence-grid');
        if (!grid) return null;
        const cards = [...grid.querySelectorAll('.lt-route-card')];
        const heights = cards.map((card) => card.getBoundingClientRect().height);
        const firstCardStyle = cards[0] ? getComputedStyle(cards[0]) : null;
        return {
          columns: getComputedStyle(grid).gridTemplateColumns.split(' ').length,
          gap: Number.parseFloat(getComputedStyle(grid).gap),
          h2Size: Number.parseFloat(getComputedStyle(grid.closest('.lt-route-section').querySelector('h2')).fontSize),
          cardCount: cards.length,
          cardMinHeight: firstCardStyle ? Number.parseFloat(firstCardStyle.minHeight) : 0,
          cardPadding: firstCardStyle ? Number.parseFloat(firstCardStyle.paddingTop) : 0,
          heights,
          naturalRows: new Set(heights.map((height) => Math.round(height))).size > 1,
          cardsUnclipped: cards.every((card) => card.scrollWidth <= card.clientWidth + 2 && card.scrollHeight <= card.clientHeight + 2),
        };
      })(),
      testingProcessGeometry: (() => {
        const process = document.querySelector('.lt-route-process-line');
        const step = process?.querySelector('article');
        const heading = process?.querySelector('h3');
        if (!process || !step || !heading) return null;
        const processStyle = getComputedStyle(process);
        const stepStyle = getComputedStyle(step);
        return {
          stepCount: process.querySelectorAll('article').length,
          columns: processStyle.gridTemplateColumns.split(' ').length,
          gap: Number.parseFloat(processStyle.gap),
          stepMinHeight: Number.parseFloat(stepStyle.minHeight),
          stepPadding: Number.parseFloat(stepStyle.paddingTop),
          h3Size: Number.parseFloat(getComputedStyle(heading).fontSize),
          stepsUnclipped: [...process.querySelectorAll('article')].every((item) => item.scrollWidth <= item.clientWidth + 2 && item.scrollHeight <= item.clientHeight + 2),
        };
      })(),
    }));

    if (state.visibleIndustryLinks < 1) failures.push(`${spec.route}: visible Industries discovery link missing`);
    if (JSON.stringify(state.featureHrefs) !== JSON.stringify(spec.featureHrefs)) failures.push(`${spec.route}: linked feature-card destinations changed (${state.featureHrefs.join(', ')})`);
    if (JSON.stringify(state.gateHrefs) !== JSON.stringify(spec.gateHrefs)) failures.push(`${spec.route}: linked Five Gates destinations changed (${state.gateHrefs.join(', ')})`);
    if (spec.route === '/methodology' && state.methodologyIds !== 2) failures.push('/methodology: Five Gates or evidence-standards anchor missing');
    if (spec.route === '/methodology') {
      const evidence = state.evidenceGeometry;
      if (!evidence || evidence.columns !== 2 || evidence.cardCount !== 4 || evidence.gap < 10 || evidence.gap > 14 || evidence.h2Size < 27 || evidence.h2Size > 38 || evidence.cardMinHeight < 160 || evidence.cardMinHeight > 190 || evidence.cardPadding < 22 || evidence.cardPadding > 26 || !evidence.naturalRows || !evidence.cardsUnclipped) failures.push(`/methodology: Evidence Standards density or bounds drifted (${JSON.stringify(evidence)})`);
      const process = state.testingProcessGeometry;
      if (!process || process.stepCount !== 5 || process.columns !== 5 || Math.abs(process.gap - 12) > 0.1 || Math.abs(process.stepMinHeight - 195) > 0.1 || Math.abs(process.stepPadding - 22.4) > 0.1 || Math.abs(process.h3Size - 17.92) > 0.1 || !process.stepsUnclipped) failures.push(`/methodology: frozen Testing Process geometry changed (${JSON.stringify(process)})`);
    }
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
      const responsiveLayout = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
        textBoundsValid: [...document.querySelectorAll('main h1, main h2, main h3, main p, main li')].every((element) => {
          const rect = element.getBoundingClientRect();
          const style = getComputedStyle(element);
          return style.display === 'none' || style.visibility === 'hidden' || rect.width === 0 || (rect.left >= -2 && rect.right <= document.documentElement.clientWidth + 2);
        }),
        cardsUnclipped: [...document.querySelectorAll('main .lt-standard-card')].every((card) => card.scrollWidth <= card.clientWidth + 2 && card.scrollHeight <= card.clientHeight + 2),
        targetsValid: [...document.querySelectorAll('.lt-industry-secondary-actions a, [data-guide-filter-button]')].every((control) => control.getBoundingClientRect().height >= 44),
      }));
      if (responsiveLayout.overflow) failures.push(`${route}: horizontal overflow at ${viewport.width}px`);
      if (!responsiveLayout.textBoundsValid || !responsiveLayout.cardsUnclipped || !responsiveLayout.targetsValid) failures.push(`${route}: clipped text/card bounds or undersized industry controls at ${viewport.width}px`);
      if (viewport.name === 'mobile' && !(await page.getByRole('button', { name: 'Open navigation' }).isVisible())) failures.push(`${route}: mobile navigation control missing`);
      if (route === '/industries') {
        const directoryLayout = await page.evaluate((viewportHeight) => {
          const hero = document.querySelector('.lt-industry-hero');
          const heading = document.querySelector('.lt-industry-hero h1');
          const cards = [...document.querySelectorAll('[data-industry-directory-entry]')];
          return {
            heroBottom: hero?.getBoundingClientRect().bottom ?? Number.POSITIVE_INFINITY,
            h1FontSize: heading ? Number.parseFloat(getComputedStyle(heading).fontSize) : Number.POSITIVE_INFINITY,
            cardsUnclipped: cards.every((card) => card.scrollHeight <= card.clientHeight + 2),
            actionsContained: cards.every((card) => {
              const cardRect = card.getBoundingClientRect();
              return [...card.querySelectorAll('.lt-industry-secondary-actions a')].every((link) => {
                const rect = link.getBoundingClientRect();
                return rect.left >= cardRect.left - 1 && rect.right <= cardRect.right + 1 && rect.bottom <= cardRect.bottom + 1;
              });
            }),
            targetsValid: [...document.querySelectorAll('.lt-industry-secondary-actions a, [data-guide-filter-button]')].every((control) => control.getBoundingClientRect().height >= 44),
            singleColumn: cards.length > 1 && Math.abs(cards[0].getBoundingClientRect().left - cards[1].getBoundingClientRect().left) <= 2,
            heroFits: (hero?.getBoundingClientRect().bottom ?? Number.POSITIVE_INFINITY) <= viewportHeight + 24,
          };
        }, viewport.height);
        const mobileLayoutInvalid = viewport.name === 'mobile' && (directoryLayout.h1FontSize > 38 || !directoryLayout.singleColumn || !directoryLayout.heroFits);
        if (mobileLayoutInvalid || !directoryLayout.cardsUnclipped || !directoryLayout.actionsContained || !directoryLayout.targetsValid) failures.push(`/industries: ${viewport.name} hero or card layout assertions failed`);
      }
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
