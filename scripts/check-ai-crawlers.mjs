import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const failures = [];
const robots = await readFile(join(projectRoot, 'public', 'robots.txt'), 'utf8');
const requiredBots = ['Googlebot', 'Bingbot', 'OAI-SearchBot'];
const agents = [
  { label: 'Browser', value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140 Safari/537.36' },
  ...requiredBots.map((label) => ({ label, value: label })),
];

for (const bot of requiredBots) {
  const block = robots.match(new RegExp(`User-agent: ${bot}([\\s\\S]*?)(?=\\nUser-agent:|\\nSitemap:|$)`, 'i'))?.[1] ?? '';
  if (!/Allow:\s*\//i.test(block)) failures.push(`robots.txt: ${bot} is not explicitly allowed`);
  if (!/Disallow:\s*\/api\//i.test(block)) failures.push(`robots.txt: ${bot} API restriction is missing`);
}
if (!robots.includes('Sitemap: https://liontechinnovations.co.uk/sitemap.xml')) failures.push('robots.txt: production sitemap declaration missing');

const sitemapFiles = ['sitemap-core.xml', 'sitemap-industries-1.xml', 'sitemap-industries-2.xml', 'sitemap-industries-3.xml', 'sitemap-industries-4.xml', 'sitemap-industries-5.xml'];
const routeUrls = [];
for (const file of sitemapFiles) {
  const xml = await readFile(join(projectRoot, 'public', file), 'utf8');
  routeUrls.push(...[...xml.matchAll(/<loc>https:\/\/liontechinnovations\.co\.uk([^<]*)<\/loc>/g)].map((match) => match[1] || '/'));
}

const programmaticRoutes = routeUrls.filter((route) => route === '/industries' || route.startsWith('/industries/'));
if (programmaticRoutes.length !== 101) failures.push(`Crawler inventory: expected 101 new routes, received ${programmaticRoutes.length}`);
for (const route of programmaticRoutes) {
  const html = await readFile(join(projectRoot, 'dist', route.slice(1), 'index.html'), 'utf8');
  if (!/<h1>[\s\S]+?<\/h1>/.test(html)) failures.push(`${route}: meaningful initial H1 missing`);
  if (!html.includes(route === '/industries' ? 'data-industry-directory' : 'data-programmatic-content')) failures.push(`${route}: substantive initial HTML marker missing`);
  if (/noindex|nosnippet|max-snippet:\s*0/i.test(html)) failures.push(`${route}: restrictive index/snippet control found`);
}

const baseUrl = process.env.AI_CRAWLER_BASE_URL?.replace(/\/$/, '');
if (baseUrl) {
  const paths = ['/robots.txt', '/industries', '/industries/dental-practices/ai-visibility', '/ai-data/index.json'];
  const baselines = new Map();
  for (const agent of agents) {
    for (const path of paths) {
      const response = await fetch(`${baseUrl}${path}`, { headers: { 'user-agent': agent.value } });
      const body = await response.text();
      if (response.status !== 200) failures.push(`${agent.label} ${path}: HTTP ${response.status}`);
      if (/attention required|checking your browser|captcha|access denied/i.test(body)) failures.push(`${agent.label} ${path}: challenge or denial response detected`);
      if (/vercel\.app|localhost|127\.0\.0\.1/i.test(body)) failures.push(`${agent.label} ${path}: preview/local production metadata detected`);
      if (path.startsWith('/industries')) {
        const canonical = body.match(/<link rel="canonical" href="([^"]+)"/)?.[1] ?? '';
        const substantive = path === '/industries' ? body.includes('data-industry-directory') : body.includes('data-programmatic-content');
        if (!substantive || canonical !== `${baseUrl}${path}`.replace(baseUrl, 'https://liontechinnovations.co.uk')) failures.push(`${agent.label} ${path}: substantive HTML or canonical mismatch`);
        const signature = `${canonical}|${body.match(/<h1>([\s\S]*?)<\/h1>/)?.[1] ?? ''}|${substantive}`;
        if (agent.label === 'Browser') baselines.set(path, signature);
        else if (baselines.get(path) !== signature) failures.push(`${agent.label} ${path}: material response differs from browser baseline`);
      }
    }
  }
  process.stdout.write(`Crawler HTTP checks: base=${baseUrl} agents=${agents.length} paths=${paths.length}\n`);
} else {
  process.stdout.write('Crawler HTTP checks: local initial-HTML policy validated; set AI_CRAWLER_BASE_URL for preview WAF/CDN verification.\n');
}

process.stdout.write(`Crawler validation failures: ${failures.length}\n`);
if (failures.length) throw new Error(failures.join('\n'));
