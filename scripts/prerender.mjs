import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const distDirectory = join(projectRoot, 'dist');
const templatePath = join(distDirectory, 'index.html');
const siteUrl = 'https://liontechinnovations.co.uk';

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function replaceMeta(html, attribute, key, value) {
  const pattern = new RegExp(`<meta\\s+${attribute}="${key}"[\\s\\S]*?>`, 'i');
  const replacement = `<meta ${attribute}="${key}" content="${escapeHtml(value)}" />`;
  if (!pattern.test(html)) throw new Error(`Missing ${attribute} metadata tag: ${key}`);
  return html.replace(pattern, replacement);
}

function applyHead(html, seo) {
  const canonical = new URL(seo.path, siteUrl).toString();
  const schema = seo.schema ?? [];
  const serializedSchema = JSON.stringify(schema).replaceAll('<', '\\u003c');
  const schemaTag = `<script id="route-structured-data" type="application/ld+json">${serializedSchema}</script>`;
  const alternateJsonTag = seo.alternateJson
    ? `<link id="route-alternate-json" rel="alternate" type="application/json" href="${escapeHtml(seo.alternateJson)}" />`
    : '';

  let output = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(seo.title)}</title>`);
  output = replaceMeta(output, 'name', 'description', seo.description);
  output = replaceMeta(output, 'property', 'og:title', seo.title);
  output = replaceMeta(output, 'property', 'og:description', seo.description);
  output = replaceMeta(output, 'property', 'og:type', seo.type ?? 'website');
  output = replaceMeta(output, 'property', 'og:url', canonical);
  output = replaceMeta(output, 'name', 'twitter:title', seo.title);
  output = replaceMeta(output, 'name', 'twitter:description', seo.description);
  output = output.replace(/<link\s+rel="canonical"[\s\S]*?>/i, `<link rel="canonical" href="${escapeHtml(canonical)}" />`);
  output = output.includes('<!-- route-structured-data -->')
    ? output.replace('<!-- route-structured-data -->', schemaTag)
    : output.replace('</head>', `    ${schemaTag}\n  </head>`);
  if (alternateJsonTag) output = output.replace('</head>', `    ${alternateJsonTag}\n  </head>`);

  return output;
}

function applyMarkup(html, markup) {
  const root = '<div id="root"></div>';
  if (!html.includes(root)) throw new Error('Missing empty React root in Vite output');
  return html.replace(root, `<div id="root">${markup}</div>`);
}

const template = await readFile(templatePath, 'utf8');
const vite = await createServer({
  root: projectRoot,
  appType: 'custom',
  logLevel: 'error',
  server: { middlewareMode: true },
});

try {
  const { prerenderRoutes, renderMarketingRoute } = await vite.ssrLoadModule('/src/prerender.tsx');

  for (const route of prerenderRoutes) {
    const { markup, seo } = renderMarketingRoute(route);
    const rendered = applyMarkup(applyHead(template, seo), markup);
    const outputPath = route === '/'
      ? templatePath
      : join(distDirectory, route.slice(1), 'index.html');

    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, rendered, 'utf8');
  }

  process.stdout.write(`Prerendered ${prerenderRoutes.length} routes.\n`);
} finally {
  await vite.close();
}
