import { chromium } from 'playwright';
import { readFile } from 'node:fs/promises';
import { preview } from 'vite';

const routes = [
  '/',
  '/ai-visibility-snapshot',
  '/ai-business-readiness',
  '/readiness-fix-sprint',
  '/monitoring',
  '/company-brain',
  '/methodology',
  '/about',
  '/contact#snapshot-enquiry',
  '/email/signature-install',
  '/privacy-policy',
  '/terms-and-conditions',
  '/careops/lost-enquiry-recovery',
  '/careops/command-centre',
  '/careops/free-check/thanks',
];

const expectedText = {
  '/': 'See What AI Tells Your Customers About You. Then Fix It.',
  '/ai-visibility-snapshot': 'See what AI says. Know what to fix.',
  '/ai-business-readiness': 'See it. Fix it. Stay ready.',
  '/readiness-fix-sprint': 'Turn priority gaps into approved changes.',
  '/monitoring': 'Keep the important facts visible and current.',
  '/company-brain': 'Bring AI inside when the business is ready.',
  '/methodology': 'A clear way to inspect AI readiness.',
  '/about': 'Evidence-led readiness. Production engineering.',
  '/contact#snapshot-enquiry': 'Tell us which business AI should understand.',
  '/email/signature-install': 'Install the approved LionTech signature.',
  '/privacy-policy': 'Privacy Policy',
  '/terms-and-conditions': 'Terms & Conditions',
  '/careops/lost-enquiry-recovery': "You're losing care enquiries that should have become clients.",
  '/careops/command-centre': 'A weekly operating view for care providers that need faster action.',
  '/careops/free-check/thanks': "Thank you — we've got it.",
};

const hydrationPattern = /Minified React error #\d+|Hydration failed|Text content does not match|There was an error while hydrating|recoverable[^\n]*hydration/i;
const externalBaseUrl = process.env.HOTFIX_BASE_URL?.replace(/\/$/, '');
const port = Number(process.env.HOTFIX_PREVIEW_PORT || 4190);
let previewServer;
let browser;

try {
  if (!externalBaseUrl) {
    const vercelConfig = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'));
    const exactRewrites = new Map(
      vercelConfig.rewrites
        .filter(({ source }) => !source.includes('(') && !source.includes(':'))
        .map(({ source, destination }) => [source.replace(/\/$/, '') || '/', destination]),
    );

    previewServer = await preview({
      plugins: [{
        name: 'vercel-rewrite-preview',
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
  }

  const baseUrl = externalBaseUrl || `http://127.0.0.1:${port}`;
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const results = [];

  for (const route of routes) {
    const page = await context.newPage();
    const consoleErrors = [];
    const pageErrors = [];

    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    page.on('pageerror', (error) => pageErrors.push(error.message));

    const response = await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle' });
    if (!response?.ok()) throw new Error(`${route} returned HTTP ${response?.status() ?? 'unknown'}`);

    await page.waitForTimeout(250);
    const state = await page.evaluate(() => {
      const anchor = document.getElementById('snapshot-enquiry');
      const anchorRect = anchor?.getBoundingClientRect();
      const form = anchor?.querySelector('form');

      return {
        bodyText: document.body.innerText,
        brokenImages: [...document.images]
          .filter((image) => image.complete && image.naturalWidth === 0)
          .map((image) => image.currentSrc || image.src),
        canonical: document.querySelector('link[rel="canonical"]')?.href || null,
        form: form
          ? {
              anchorTop: anchorRect?.top ?? null,
              fields: [...form.elements].map((element) => element.name).filter(Boolean),
              sections: [...form.querySelectorAll('legend')].map((legend) => legend.textContent?.trim()),
              hasConsent: Boolean(form.querySelector('input[name="consent"][type="checkbox"]')),
              submitText: form.querySelector('button[type="submit"]')?.textContent?.trim() || null,
            }
          : null,
        horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
        jsonLdValid: [...document.querySelectorAll('script[type="application/ld+json"]')]
          .every((script) => {
            try {
              JSON.parse(script.textContent || '');
              return true;
            } catch {
              return false;
            }
          }),
      };
    });

    if (!state.bodyText.includes(expectedText[route])) throw new Error(`${route} rendered unexpected content`);
    if (state.brokenImages.length) throw new Error(`${route} has broken images: ${state.brokenImages.join(', ')}`);
    if (state.horizontalOverflow) throw new Error(`${route} has horizontal overflow at 1440px`);
    if (!state.jsonLdValid) throw new Error(`${route} contains invalid JSON-LD`);

    if (route !== '/careops/free-check/thanks') {
      const path = route.split('#')[0];
      const expectedCanonical = new URL(path || '/', 'https://liontechinnovations.co.uk').toString();
      if (state.canonical !== expectedCanonical) {
        throw new Error(`${route} canonical mismatch: expected ${expectedCanonical}, received ${state.canonical}`);
      }
    }

    if (route === '/contact#snapshot-enquiry') {
      const expectedFields = ['name', 'email', 'company', 'websiteUrl', 'jobTitle', 'department', 'companySize', 'primaryService', 'primaryLocation', 'competitor', 'website', 'consent'];
      if (!state.form || state.form.anchorTop === null || state.form.anchorTop < 0 || state.form.anchorTop >= 900) {
        throw new Error('Snapshot enquiry form is not visible at the direct hash route');
      }
      if (JSON.stringify(state.form.fields) !== JSON.stringify(expectedFields)) throw new Error('Snapshot enquiry form fields changed');
      if (JSON.stringify(state.form.sections) !== JSON.stringify(['Your details', 'Company', 'Snapshot context'])) {
        throw new Error('Snapshot enquiry form sections changed');
      }
      if (!state.form.hasConsent || state.form.submitText !== 'Request a Founding Snapshot') {
        throw new Error('Snapshot enquiry form consent or submit behaviour changed');
      }
    }

    const hydrationErrors = [...consoleErrors, ...pageErrors].filter((message) => hydrationPattern.test(message));
    results.push({ route, consoleErrors, pageErrors, hydrationErrors });
    await page.close();
  }

  const hydrationErrors = results.flatMap((result) => result.hydrationErrors);
  const consoleErrors = results.flatMap((result) => result.consoleErrors);
  const pageErrors = results.flatMap((result) => result.pageErrors);

  for (const result of results) {
    process.stdout.write(`${result.route}: console=${result.consoleErrors.length}, page=${result.pageErrors.length}, hydration=${result.hydrationErrors.length}\n`);
  }
  process.stdout.write(`React hydration errors: ${hydrationErrors.length}\n`);
  process.stdout.write(`Browser console errors: ${consoleErrors.length}\n`);
  process.stdout.write(`Page errors: ${pageErrors.length}\n`);

  if (hydrationErrors.length || consoleErrors.length || pageErrors.length) {
    throw new Error([...hydrationErrors, ...consoleErrors, ...pageErrors].join('\n\n'));
  }
} finally {
  await browser?.close();
  await previewServer?.httpServer.close();
}
