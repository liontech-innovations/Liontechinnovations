import { access, mkdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { preview } from 'vite';

const projectRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const distDirectory = join(projectRoot, 'dist');
const phase = process.argv[2];
const port = Number(process.env.KNOWLEDGE_ENGINE_SCREENSHOT_PORT || 4194);

if (!['before', 'after'].includes(phase)) {
  throw new Error('Pass a screenshot phase: before or after.');
}

const screenshotDirectory = join(projectRoot, 'qa-artifacts', 'knowledge-engine', phase);
const desktop = { width: 1440, height: 900 };
const mobile = { width: 390, height: 844 };

let previewServer;
let browser;

try {
  previewServer = await preview({
    root: projectRoot,
    plugins: [{
      name: 'knowledge-engine-screenshot-preview',
      configurePreviewServer(server) {
        server.middlewares.use(async (request, _response, next) => {
          const url = new URL(request.url || '/', 'http://127.0.0.1');
          if (url.pathname !== '/' && !url.pathname.includes('.')) {
            try {
              await access(join(distDirectory, url.pathname.slice(1), 'index.html'));
              request.url = `${url.pathname.replace(/\/$/, '')}/index.html${url.search}`;
            } catch {
              // Allow Vite to use its normal fallback for non-prerendered paths.
            }
          }
          next();
        });
      },
    }],
    preview: { host: '127.0.0.1', port, strictPort: true },
  });

  browser = await chromium.launch({ headless: true });
  await mkdir(screenshotDirectory, { recursive: true });
  const baseUrl = `http://127.0.0.1:${port}`;

  const capture = async ({ route, viewport, filename, locator, fullPage = false }) => {
    const page = await browser.newPage({ viewport });
    await page.goto(`${baseUrl}${route}`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(150);
    await page.addStyleTag({ content: '.lt-skip-link { display: none !important; }' });
    const path = join(screenshotDirectory, filename);
    if (locator) {
      await page.locator(locator).screenshot({ path });
    } else {
      await page.screenshot({ path, fullPage });
    }
    await page.close();
  };

  const desktopCaptures = [
    { route: '/industries', filename: 'desktop-industries-hero.png', locator: '.lt-industry-hero' },
    { route: '/industries', filename: 'desktop-health-care-cards.png', locator: '.lt-industry-directory-group:nth-of-type(2)' },
    { route: '/industries', filename: 'desktop-professional-financial-cards.png', locator: '.lt-industry-directory-group:nth-of-type(3)' },
    { route: '/industries', filename: 'desktop-local-home-cards.png', locator: '.lt-industry-directory-group:nth-of-type(4)' },
    { route: '/industries', filename: 'desktop-business-services-cards.png', locator: '.lt-industry-directory-group:nth-of-type(5)' },
    { route: '/industries/dental-practices', filename: 'desktop-industry-hub.png', fullPage: true },
    { route: '/industries/aesthetics-clinics/ai-visibility', filename: 'desktop-supporting-guide.png', fullPage: true },
  ];

  for (const item of desktopCaptures) {
    await capture({ ...item, viewport: desktop });
  }

  const cardSelector = '[data-industry-directory-entry="aesthetics-clinics"]';
  const mobileCaptures = [
    { route: '/industries', filename: 'mobile-industries-hero.png', locator: '.lt-industry-hero' },
    { route: '/industries', filename: 'mobile-industry-card.png', locator: cardSelector },
    { route: '/industries', filename: 'mobile-secondary-actions.png', locator: `${cardSelector} .lt-industry-secondary-actions, ${cardSelector} > div` },
    { route: '/industries/aesthetics-clinics/ai-visibility', filename: 'mobile-supporting-guide.png', fullPage: true },
  ];

  for (const item of mobileCaptures) {
    await capture({ ...item, viewport: mobile });
  }

  const visualQaCaptures = phase === 'after' ? [
    { route: '/industries/aesthetics-clinics/how-ai-compares', filename: 'desktop-health-comparison-guide.png', fullPage: true },
    { route: '/industries/aesthetics-clinics/agent-readiness', filename: 'desktop-health-agent-readiness-guide.png', fullPage: true },
    { route: '/industries/aesthetics-clinics/checklist', filename: 'desktop-health-checklist-guide.png', fullPage: true },
    { route: '/industries/financial-advisers', filename: 'desktop-professional-financial-guide.png', fullPage: true },
    { route: '/industries/roofing-contractors', filename: 'desktop-local-home-guide.png', fullPage: true },
    { route: '/industries/recruitment-agencies', filename: 'desktop-business-services-guide.png', fullPage: true },
    { route: '/', filename: 'desktop-core-home.png', fullPage: true },
    { route: '/ai-business-readiness', filename: 'desktop-core-ai-business-readiness.png', fullPage: true },
    { route: '/ai-visibility-snapshot', filename: 'desktop-core-ai-visibility-snapshot.png', fullPage: true },
    { route: '/methodology', filename: 'desktop-core-methodology.png', fullPage: true },
    { route: '/about', filename: 'desktop-core-about.png', fullPage: true },
  ] : [];

  for (const item of visualQaCaptures) {
    await capture({ ...item, viewport: desktop });
  }

  process.stdout.write(`Captured ${desktopCaptures.length + mobileCaptures.length + visualQaCaptures.length} ${phase} screenshots in ${screenshotDirectory}.\n`);
} finally {
  await browser?.close();
  await previewServer?.httpServer.close();
}
