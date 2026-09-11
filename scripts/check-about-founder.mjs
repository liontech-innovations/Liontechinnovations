import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import ts from 'typescript';
import { chromium } from 'playwright';
import { preview } from 'vite';

// Adapted from the handoff verifier: use production rewrites and report provider
// errors separately, without overlooking first-party or unattributed failures.
const root = resolve(import.meta.dirname, '..');
const output = resolve(root, 'qa-artifacts/about-founder', process.env.FOUNDER_RUN || 'local');
const embedUrl = 'https://certify.sbs.ox.ac.uk/embed/ba50fb87-4576-4f98-a03a-bfc7ee6cae91';
const credentialUrl = 'https://certify.sbs.ox.ac.uk/ba50fb87-4576-4f98-a03a-bfc7ee6cae91';
const linkedInUrl = 'https://www.linkedin.com/in/freejoy-chimbizi-544157a7/';
const report = { status: 'RUNNING', viewports: [], firstPartyErrors: [], providerErrors: [], credentialResponses: [] };
await mkdir(output, { recursive: true });
let server;
let browser;

function existingSections(source) {
  const file = ts.createSourceFile('AboutPage.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const sections = [];
  function visit(node) {
    if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node)) {
      const opening = ts.isJsxElement(node) ? node.openingElement : node;
      if (['PageHero', 'RouteSection', 'RouteCta'].includes(opening.tagName.getText(file)) &&
          !opening.attributes.properties.some(attr => ts.isJsxAttribute(attr) && attr.name.getText(file) === 'id' && attr.initializer?.text === 'founder-credentials')) {
        sections.push(node.getText(file).replaceAll('\r\n', '\n'));
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(file);
  return sections;
}

async function verifyCertificate(frame) {
  const certificate = frame.getByRole('img', { name: /Certificate for credential AI, Justice, and the Rule of Law issued to Freejoy Masimba Chimbizi/ });
  await certificate.waitFor({ state: 'visible', timeout: 30000 });
  await frame.waitForFunction(() => [...document.images].some(image => image.complete && image.naturalWidth > 3000));
  assert.match(await frame.locator('body').innerText(), /Freejoy Masimba Chimbizi/);
  assert.match(await frame.locator('body').innerText(), /11 September 2026|September 11, 2026/);
  return certificate;
}

function recordError(width, message, source = '') {
  const urls = [source, ...message.matchAll(/https?:\/\/[^\s)]+/g)].map(value => Array.isArray(value) ? value[0] : value).filter(Boolean);
  const external = urls.length > 0 && urls.every(value => {
    try { return new URL(value).origin !== report.baseUrl; } catch { return false; }
  });
  (external ? report.providerErrors : report.firstPartyErrors).push({ width, message, source });
}

try {
  const baseline = execFileSync('git', ['show', '215a95e16f976a2f1982b3223d60d1abcd494b89:src/pages/AboutPage.tsx'], { cwd: root, encoding: 'utf8' });
  const current = await readFile(resolve(root, 'src/pages/AboutPage.tsx'), 'utf8');
  assert.deepEqual(existingSections(current), existingSections(baseline), 'Existing About sections changed');
  report.existingSections = 'Unchanged from approved baseline';
  if (!process.env.FOUNDER_BASE_URL) {
    const config = JSON.parse(await readFile(resolve(root, 'vercel.json'), 'utf8'));
    const rewrites = new Map(config.rewrites.filter(({ source }) => !/[(:]/.test(source)).map(({ source, destination }) => [source, destination]));
    server = await preview({ plugins: [{ name: 'founder-vercel-rewrites', configurePreviewServer(s) {
      s.middlewares.use((req, _res, next) => {
        const url = new URL(req.url || '/', 'http://127.0.0.1');
        if (rewrites.has(url.pathname)) req.url = rewrites.get(url.pathname) + url.search;
        next();
      });
    } }], preview: { host: '127.0.0.1', port: 4176, strictPort: true } });
  }
  report.baseUrl = new URL(process.env.FOUNDER_BASE_URL || 'http://127.0.0.1:4176').origin;
  browser = await chromium.launch();
  const referencePage = await browser.newPage();
  await referencePage.goto(report.baseUrl);
  const boxAppearance = element => {
    const style = getComputedStyle(element);
    return ['backgroundImage', 'backgroundColor', 'borderTopWidth', 'borderTopColor', 'borderRadius', 'boxShadow'].map(key => style[key]);
  };
  const approvedBoxAppearance = await referencePage.locator('.lt-company-proof-grid .lt-standard-card').first().evaluate(boxAppearance);
  await referencePage.close();
  for (const width of [1440, 1024, 768, 390, 320]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const responseTasks = [];
    page.on('console', message => { if (message.type() === 'error') recordError(width, message.text(), message.location().url); });
    page.on('pageerror', error => recordError(width, error.stack || error.message));
    page.on('response', response => {
      if (response.request().resourceType() === 'document' && response.url().startsWith('https://certify.sbs.ox.ac.uk/')) {
        responseTasks.push(response.allHeaders().then(headers => report.credentialResponses.push({ width, url: response.url(), status: response.status(), xFrameOptions: headers['x-frame-options'] || null, csp: headers['content-security-policy'] || null })));
      }
    });
    const response = await page.goto(`${report.baseUrl}/about`, { waitUntil: 'domcontentloaded' });
    assert.equal(response.status(), 200);
    assert.match(await response.text(), /id="founder-credentials"/, 'Section must be prerendered');
    const section = page.locator('#founder-credentials');
    await section.waitFor({ state: 'visible' });
    await section.scrollIntoViewIfNeeded();
    const sections = await page.locator('main section').evaluateAll(els => els.map(el => ({ id: el.id, heading: el.querySelector('h2')?.textContent })));
    const index = sections.findIndex(s => s.id === 'founder-credentials');
    assert.equal(sections[index - 1].heading, 'Built for practical decisions');
    assert.equal(sections[index + 1].heading, 'Production systems, not presentation concepts');
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await section.locator('.lt-route-heading > p').last().textContent(), 'LionTech is founded by Freejoy Masimba Chimbizi, whose background includes more than seven years in the British Army as a Supply Chain Specialist, where discipline, accountability and reliable operational delivery were fundamental. He combines that experience with practical AI implementation, production engineering and professional development in responsible AI and governance. Together, these experiences shape LionTech’s approach to building useful AI systems with clear controls, human oversight and operational discipline.');
    assert.equal(await section.locator('.lt-about-founder-summary').textContent(), 'Operational experience, practical engineering and responsible AI governance applied to LionTech’s work.');
    assert.equal(await section.locator('#founder-client-reassurance-title').textContent(), 'WHY THIS MATTERS FOR CLIENTS');
    assert.deepEqual(await section.locator('.lt-about-client-reassurance p').allTextContents(), [
      'AI systems can affect customers, staff, data and business decisions. This professional development strengthens LionTech’s approach to AI ethics, transparency, accountability, human oversight and responsible decision-making.',
      'For clients, that means LionTech approaches AI not simply as technology to deploy, but as an operational capability that should be understandable, reviewable and responsibly governed.',
    ]);
    assert(await section.evaluate(el => {
      const reassurance = el.querySelector('.lt-about-client-reassurance');
      const bounds = reassurance.getBoundingClientRect();
      const paragraphs = reassurance.querySelectorAll('p');
      return bounds.top >= el.querySelector('.lt-about-credential-meta').getBoundingClientRect().bottom &&
        bounds.bottom <= el.querySelector('.lt-about-development').getBoundingClientRect().top &&
        Number(getComputedStyle(paragraphs[1]).fontWeight) > Number(getComputedStyle(paragraphs[0]).fontWeight);
    }), 'Client reassurance must follow metadata, precede development areas and subtly emphasize its second paragraph');
    assert.deepEqual(await section.locator('.lt-about-development-box p').allTextContents(), [
      'AI Ethics', 'Human Oversight', 'Transparency', 'Accountability', 'Human Rights', 'Judicial Transparency', 'Access to Justice',
    ]);
    assert.deepEqual(await section.locator('.lt-about-capability-box h4').allTextContents(), [
      'MILITARY OPERATIONAL DISCIPLINE', 'PRACTICAL ENGINEERING', 'RESPONSIBLE AI & GOVERNANCE',
    ]);
    assert.equal(await section.locator('.lt-about-founder-column .lt-about-capabilities').count(), 1);
    assert(await section.locator('#founder-capabilities-title').evaluate(el => parseFloat(getComputedStyle(el).fontSize) <= 14), 'Capability heading must remain a compact label');
    for (const box of await section.locator('.lt-about-development-box, .lt-about-capability-box').all()) {
      assert.deepEqual(await box.evaluate(boxAppearance), approvedBoxAppearance, 'Founder boxes must reuse the homepage treatment');
    }
    assert(await section.evaluate(el => {
      const grid = el.querySelector('.lt-about-development-grid').getBoundingClientRect();
      return grid.bottom <= el.querySelector('iframe').getBoundingClientRect().top;
    }), 'Development areas must precede the certificate');
    const geometry = await section.evaluate(el => {
      const viewport = document.documentElement.clientWidth;
      const overflow = [...el.querySelectorAll('*')].filter(child => !(child instanceof SVGElement)).filter(child => {
        const r = child.getBoundingClientRect();
        return r.width && (r.left < -1 || r.right > viewport + 1 || child.scrollWidth > child.clientWidth + 2 && getComputedStyle(child).display !== 'inline');
      }).map(child => child.className);
      return { viewport, scrollWidth: document.documentElement.scrollWidth, overflow, cards: [...el.querySelector('.lt-about-founder-grid').children].map(child => child.getBoundingClientRect().toJSON()) };
    });
    assert(geometry.scrollWidth <= width + 1);
    assert.deepEqual(geometry.overflow, []);
    const [founder, credential] = geometry.cards;
    if (width >= 768) {
      assert(Math.abs(founder.y - credential.y) < 2);
      assert(Math.abs(founder.width / (founder.width + credential.width) - 0.38) < 0.01);
    } else assert(credential.y >= founder.bottom);
    const iframe = section.locator('iframe');
    assert.equal(await iframe.getAttribute('src'), embedUrl);
    assert.equal(await iframe.getAttribute('loading'), 'lazy');
    assert.equal(await iframe.getAttribute('title'), 'Freejoy Masimba Chimbizi — AI, Justice, and the Rule of Law credential');
    await iframe.scrollIntoViewIfNeeded();
    const frame = await (await iframe.elementHandle()).contentFrame();
    await verifyCertificate(frame);
    await section.screenshot({ path: resolve(output, `first-visit-${width}.png`), animations: 'disabled' });
    await iframe.scrollIntoViewIfNeeded();
    // Dismiss provider UI as a visitor can; never alter its DOM, CSP or content.
    for (const name of ['Got it!', 'Dismiss sharing']) {
      const button = frame.getByRole('button', { name, exact: true });
      if (await button.isVisible()) await button.press('Enter');
    }
    const frameGeometry = await frame.evaluate(() => {
      const image = [...document.images].find(i => i.naturalWidth > 3000 && i.getBoundingClientRect().height > 100);
      return { width: innerWidth, height: innerHeight, scrollWidth: document.documentElement.scrollWidth, certificate: image.getBoundingClientRect().toJSON() };
    });
    assert(frameGeometry.scrollWidth <= frameGeometry.width + 1, 'Provider horizontal overflow');
    assert(frameGeometry.certificate.bottom <= frameGeometry.height + 1, 'Certificate bottom clipped');
    assert(frameGeometry.certificate.top >= 0 && frameGeometry.certificate.left >= 0, 'Certificate top/left clipped');
    await page.bringToFront();
    await page.locator('#founder-profile-title').click();
    await iframe.scrollIntoViewIfNeeded();
    await section.screenshot({ path: resolve(output, `section-${width}.png`), animations: 'disabled' });
    await page.screenshot({ path: resolve(output, `about-${width}.png`), fullPage: true, animations: 'disabled' });
    const linkedIn = section.locator('a.lt-about-founder-link');
    const verification = section.locator('a.lt-about-credential-verify');
    for (const [link, href] of [[linkedIn, linkedInUrl], [verification, credentialUrl]]) {
      assert.equal(await link.getAttribute('href'), href);
      assert.equal(await link.getAttribute('target'), '_blank');
      assert.match(await link.getAttribute('rel'), /noopener/);
      assert.match(await link.getAttribute('rel'), /noreferrer/);
    }
    await linkedIn.focus();
    assert.equal(await linkedIn.evaluate(el => getComputedStyle(el).outlineStyle), 'solid');
    const linkedInPopup = page.waitForEvent('popup');
    await linkedIn.press('Enter');
    const popup = await linkedInPopup;
    await popup.waitForLoadState('domcontentloaded');
    const linkedInDestination = new URL(popup.url());
    assert.equal(linkedInDestination.hostname, 'www.linkedin.com');
    const authwall = linkedInDestination.pathname === '/authwall';
    const approvedPath = new URL(linkedInUrl).pathname.replace(/\/$/, '');
    const returnedPath = authwall
      ? new URL(linkedInDestination.searchParams.get('sessionRedirect'), linkedInUrl).pathname.replace(/\/$/, '')
      : linkedInDestination.pathname.replace(/\/$/, '');
    assert.equal(returnedPath, approvedPath);
    const linkedInStatus = authwall ? 'Approved URL opens; LinkedIn authentication wall prevents profile-content verification' : 'Approved profile URL opens in new tab';
    await popup.close();
    if (width === 1440) {
      const popupPromise = page.waitForEvent('popup');
      await verification.click();
      const official = await popupPromise;
      await official.waitForLoadState('domcontentloaded');
      await verifyCertificate(official.mainFrame());
      report.officialAction = 'Correct public credential opens and renders in new tab';
      await official.close();
    }
    await page.bringToFront();
    await page.getByRole('link', { name: 'Explore the industry guides' }).click();
    await page.waitForURL('**/industries');
    await page.goBack();
    await page.getByRole('link', { name: 'See the readiness path' }).click();
    await page.waitForURL('**/ai-business-readiness');
    await page.goBack();
    await page.locator('main .lt-button-primary').first().click();
    await page.waitForURL('**/contact#snapshot-enquiry');
    await Promise.all(responseTasks);
    report.viewports.push({ width, geometry, frameGeometry, navigation: 'PASS', keyboardAndLinks: 'PASS', linkedInStatus, certificate: 'Rendered; full certificate visible after provider overlays dismissed' });
    await context.close();
  }
  assert.equal(report.firstPartyErrors.length, 0, 'First-party or unattributed errors require review');
  report.status = 'PASS; external-provider errors recorded separately; screenshots require visual review';
} catch (error) {
  report.status = 'FAIL';
  report.failure = error.stack;
  process.exitCode = 1;
} finally {
  await writeFile(resolve(output, 'report.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ status: report.status, viewports: report.viewports.map(v => v.width), firstPartyErrors: report.firstPartyErrors, providerErrorCount: report.providerErrors.length, failure: report.failure, output }, null, 2));
  await browser?.close();
  if (server) await new Promise(resolveClose => server.httpServer.close(resolveClose));
}
