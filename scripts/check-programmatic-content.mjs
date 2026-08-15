import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const distDirectory = join(projectRoot, 'dist');
const failures = [];
const wordCounts = [];
const similarityPairs = [];

const decode = (value) => value
  .replace(/<!--.*?-->/gs, ' ')
  .replace(/&(?:#x27|apos);/g, "'")
  .replace(/&quot;/g, '"')
  .replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
  .replace(/<[^>]+>/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const words = (value) => decode(value).match(/[\p{L}\p{N}£][\p{L}\p{N}’'&£/-]*/gu) ?? [];
const normalizeTokens = (value) => words(value).map((word) => word.toLowerCase().replace(/[’']/g, '')).filter(Boolean);

function extract(html, pattern, label, route) {
  const match = html.match(pattern);
  if (!match) failures.push(`${route}: missing ${label}`);
  return match?.[1] ?? '';
}

function getArticle(html) {
  const start = html.indexOf('<article class="lt-industry-page"');
  const end = html.indexOf('</article></main>', start);
  return start >= 0 && end > start ? html.slice(start, end + '</article>'.length) : '';
}

function substantiveMarkup(article) {
  return article
    .replace(/<nav class="lt-industry-breadcrumbs"[\s\S]*?<\/nav>/g, ' ')
    .replace(/<div class="lt-industry-cta[^>]*"[\s\S]*?<\/div><\/div>/g, ' ')
    .replace(/<section class="lt-industry-panel"><p class="lt-kicker">CONNECTED GUIDANCE[\s\S]*?<\/section>/g, ' ')
    .replace(/<div class="lt-industry-review"[\s\S]*?<\/div>/g, ' ')
    .replace(/<(?:p) class="(?:lt-kicker|lt-route-card-label)">[\s\S]*?<\/p>/g, ' ');
}

function similarityText(article) {
  return decode(substantiveMarkup(article))
    .replace(/AI-first readiness|AI visibility|How AI compares|Agent readiness|Readiness checklist/gi, ' ')
    .replace(/What AI and buyers need to understand|Questions the public information should answer|Page-specific evidence observations|Six checks to run next|Evidence and official reference points/gi, ' ');
}

function shingles(value, size = 5) {
  const tokens = normalizeTokens(value);
  const output = new Set();
  for (let index = 0; index <= tokens.length - size; index += 1) output.add(tokens.slice(index, index + size).join(' '));
  return output;
}

function jaccard(left, right) {
  let intersection = 0;
  for (const item of left) if (right.has(item)) intersection += 1;
  return intersection / (left.size + right.size - intersection || 1);
}

function tokenOverlap(left, right) {
  const a = new Set(normalizeTokens(left));
  const b = new Set(normalizeTokens(right));
  let intersection = 0;
  for (const token of a) if (b.has(token)) intersection += 1;
  return intersection / Math.min(a.size || 1, b.size || 1);
}

const vite = await createServer({ root: projectRoot, appType: 'custom', logLevel: 'error', server: { middlewareMode: true, hmr: false } });

try {
  const {
    industries,
    industryPageDescriptors,
    industryPageTypes,
    snapshotActionPath,
    snapshotActionUrl,
    validateIndustryRecords,
  } = await vite.ssrLoadModule('/src/content/industries/index.ts');

  validateIndustryRecords(industries);
  if (industries.length !== 20) failures.push(`Inventory: expected 20 industries, received ${industries.length}`);
  if (industryPageTypes.length !== 5) failures.push(`Inventory: expected 5 page types, received ${industryPageTypes.length}`);
  if (industryPageDescriptors.length !== 100) failures.push(`Inventory: expected 100 pages, received ${industryPageDescriptors.length}`);

  const values = { title: new Map(), description: new Map(), h1: new Map(), canonical: new Map(), introduction: new Map() };
  const rendered = [];
  const banned = [/guaranteed ranking/i, /guaranteed AI recommendation/i, /number one in AI/i, /approved by ChatGPT/i, /official AI score/i, /industry benchmark/i];

  for (const descriptor of industryPageDescriptors) {
    const route = descriptor.path;
    const htmlPath = join(distDirectory, route.slice(1), 'index.html');
    let html;
    try {
      html = await readFile(htmlPath, 'utf8');
    } catch {
      failures.push(`${route}: missing prerendered HTML`);
      continue;
    }

    const article = getArticle(html);
    if (!article) failures.push(`${route}: missing initial programmatic article HTML`);
    const title = decode(extract(html, /<title>([\s\S]*?)<\/title>/i, 'title', route));
    const description = decode(extract(html, /<meta name="description" content="([\s\S]*?)"\s*\/>/i, 'description', route));
    const h1 = decode(extract(article, /<h1>([\s\S]*?)<\/h1>/i, 'H1', route));
    const canonical = extract(html, /<link rel="canonical" href="([^"]+)"\s*\/>/i, 'canonical', route);
    const directAnswer = decode(extract(article, /<p class="lt-industry-answer"[^>]*>([\s\S]*?)<\/p>/i, 'answer-first summary', route));
    const introduction = decode(extract(article, /<p class="lt-industry-introduction"[^>]*>([\s\S]*?)<\/p>/i, 'introduction', route));
    const wordCount = words(substantiveMarkup(article)).length;
    wordCounts.push({ route, words: wordCount });

    if (wordCount < 900 || wordCount > 1500) failures.push(`${route}: substantive word count ${wordCount} is outside 900–1500`);
    if (words(directAnswer).length < 80 || words(directAnswer).length > 90) failures.push(`${route}: answer-first summary has ${words(directAnswer).length} words; required range is 80–90`);
    if (words(introduction).length < 140) failures.push(`${route}: introduction has ${words(introduction).length} words; minimum is 140`);
    if ((article.match(/data-source-observation=/g) ?? []).length !== 2) failures.push(`${route}: requires exactly two page-specific source observations`);
    if ((article.match(/data-gate="(?:discover|describe|trust|compare|act)"/g) ?? []).length !== 5) failures.push(`${route}: Five Gates are incomplete`);
    if ((article.match(/data-cta-placement="(?:hero|contextual|final)"/g) ?? []).length !== 3) failures.push(`${route}: requires hero, contextual and final CTA placements`);
    if ((article.match(new RegExp(`href="${snapshotActionPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'g')) ?? []).length !== 3) failures.push(`${route}: requires exactly three canonical Snapshot CTA anchors`);
    if ((article.match(/GET AI SNAPSHOT/g) ?? []).length !== 3) failures.push(`${route}: primary CTA label is missing or changed`);
    if ((article.match(/<details>/g) ?? []).length !== 3) failures.push(`${route}: requires three visible FAQs`);
    if ((extract(article, /data-contextual-links="true">([\s\S]*?)<\/div>/, 'contextual links', route).match(/<a /g) ?? []).length < 4) failures.push(`${route}: requires at least four contextual links`);
    if (!article.includes('data-source-list="true"') || !article.includes('data-reviewed-date="true"')) failures.push(`${route}: source list or reviewed date missing`);
    if (!html.includes(`href="/ai-data/industries/${descriptor.industry.slug}.json"`)) failures.push(`${route}: alternate industry JSON endpoint missing`);
    if (html.includes('noindex')) failures.push(`${route}: contains noindex`);
    if (/vercel\.app|localhost|127\.0\.0\.1/i.test(`${canonical} ${description}`)) failures.push(`${route}: preview or local URL found in metadata`);
    if (!canonical.startsWith('https://liontechinnovations.co.uk/')) failures.push(`${route}: canonical is not production-domain HTTPS`);
    if (/stripe\.com|buy\.stripe/i.test(article)) failures.push(`${route}: public Stripe reference found`);
    for (const entityFact of ['Lion Tech Innovations Ltd', '17068390', 'Manchester-based, serving UK businesses remotely']) {
      if (!html.includes(entityFact)) failures.push(`${route}: canonical entity fact missing (${entityFact})`);
    }
    if (/London-based/i.test(html)) failures.push(`${route}: rejected London-based claim detected`);
    for (const pattern of banned) if (pattern.test(article)) failures.push(`${route}: banned unsupported phrase ${pattern}`);

    const jsonLd = extract(html, /<script id="route-structured-data" type="application\/ld\+json">([\s\S]*?)<\/script>/, 'JSON-LD', route);
    try {
      const parsed = JSON.parse(jsonLd);
      if (!JSON.stringify(parsed).includes('https://liontechinnovations.co.uk/#organization')) failures.push(`${route}: JSON-LD does not reference central Organization @id`);
      if (/vercel\.app|localhost|127\.0\.0\.1/i.test(JSON.stringify(parsed))) failures.push(`${route}: preview or local URL found in JSON-LD`);
    } catch (error) {
      failures.push(`${route}: JSON-LD parse failed (${error.message})`);
    }

    for (const [key, value] of Object.entries({ title, description, h1, canonical, introduction })) {
      const prior = values[key].get(value);
      if (prior) failures.push(`${route}: duplicate ${key} also used by ${prior}`);
      values[key].set(value, route);
    }
    rendered.push({ descriptor, article, title, description, h1, canonical, introduction, clean: similarityText(article) });
  }

  for (let left = 0; left < rendered.length; left += 1) {
    for (let right = left + 1; right < rendered.length; right += 1) {
      const a = rendered[left];
      const b = rendered[right];
      const score = jaccard(shingles(a.clean), shingles(b.clean));
      const siblings = a.descriptor.industry.slug === b.descriptor.industry.slug;
      const descriptionOverlap = tokenOverlap(a.description, b.description);
      similarityPairs.push({ left: a.descriptor.path, right: b.descriptor.path, score, siblings, descriptionOverlap });
      if (score > 0.60 || (siblings && score > 0.55)) failures.push(`${a.descriptor.path} <> ${b.descriptor.path}: five-word-shingle Jaccard ${score.toFixed(4)} exceeds ${siblings ? '0.55 sibling' : '0.60 global'} threshold`);
      if (descriptionOverlap > 0.70) failures.push(`${a.descriptor.path} <> ${b.descriptor.path}: meta-description token overlap ${descriptionOverlap.toFixed(4)} exceeds 0.70`);
    }
  }

  const directory = await readFile(join(distDirectory, 'industries', 'index.html'), 'utf8');
  if ((directory.match(/href="\/industries\/[^"]+"/g) ?? []).length < 100) failures.push('/industries: does not link to all 100 programmatic routes');
  if ((directory.match(/data-cta-placement="(?:hero|final)"/g) ?? []).length !== 2) failures.push('/industries: required CTA placements missing');
  if (!directory.includes(snapshotActionPath) || !directory.includes('GET AI SNAPSHOT')) failures.push('/industries: canonical Snapshot action missing');
  if (/stripe\.com|buy\.stripe/i.test(directory)) failures.push('/industries: public Stripe reference found');

  const publicIndex = JSON.parse(await readFile(join(projectRoot, 'public', 'ai-data', 'index.json'), 'utf8'));
  if (publicIndex.industries.length !== 20 || publicIndex.primaryAction.url !== snapshotActionUrl) failures.push('AI-data index inventory or primary action is invalid');
  for (const industry of industries) {
    const record = JSON.parse(await readFile(join(projectRoot, 'public', 'ai-data', 'industries', `${industry.slug}.json`), 'utf8'));
    const required = ['schemaVersion', 'slug', 'name', 'shortDescription', 'fiveGates', 'commonServices', 'buyerQuestions', 'trustedSources', 'factsAIShouldUnderstand', 'commonVisibilityGaps', 'comparisonCriteria', 'trustSignals', 'actionPaths', 'agentReadinessOpportunities', 'automationBoundaries', 'structuredDataRecommendations', 'riskNotes', 'reviewedAt', 'reviewedBy', 'canonicalPageUrls', 'primaryAction'];
    for (const key of required) if (!(key in record)) failures.push(`${industry.slug}.json: missing ${key}`);
    if (record.primaryAction.url !== snapshotActionUrl || record.primaryAction.actionType !== 'snapshot-enquiry') failures.push(`${industry.slug}.json: primary action mismatch`);
    if (record.trustedSources.length < 4 || record.trustedSources.some((source) => !source.url.startsWith('https://'))) failures.push(`${industry.slug}.json: source coverage invalid`);
  }

  similarityPairs.sort((a, b) => b.score - a.score);
  await mkdir(join(projectRoot, 'docs'), { recursive: true });
  await writeFile(join(projectRoot, 'docs', 'PROGRAMMATIC_SIMILARITY_REPORT.json'), `${JSON.stringify({
    reviewedAt: '2026-08-15',
    routeCount: rendered.length,
    wordCount: {
      minimum: Math.min(...wordCounts.map((item) => item.words)),
      maximum: Math.max(...wordCounts.map((item) => item.words)),
      pages: wordCounts,
    },
    top20: similarityPairs.slice(0, 20),
  }, null, 2)}\n`, 'utf8');

  const highest = similarityPairs[0];
  process.stdout.write(`Programmatic inventory: industries=${industries.length} pageTypes=${industryPageTypes.length} routes=${rendered.length} directory=1\n`);
  process.stdout.write(`Substantive word-count range: ${Math.min(...wordCounts.map((item) => item.words))}–${Math.max(...wordCounts.map((item) => item.words))}\n`);
  process.stdout.write(`Highest similarity: ${highest?.left} <> ${highest?.right} = ${highest?.score.toFixed(4)}\n`);
  process.stdout.write(`Validation failures: ${failures.length}\n`);
  if (failures.length) throw new Error(failures.slice(0, 100).join('\n') + (failures.length > 100 ? `\n... ${failures.length - 100} more` : ''));
} finally {
  await vite.close();
}
