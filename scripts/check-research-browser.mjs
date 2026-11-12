import assert from 'node:assert/strict';
import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { chromium } from 'playwright';
import { preview } from 'vite';

const articles = JSON.parse(await readFile('docs/visibility/2026-11-12/articles/articles.json', 'utf8'));
const server = process.env.RESEARCH_BASE_URL ? null : await preview({
  preview:{host:'127.0.0.1',port:4186,strictPort:true},logLevel:'error',
  plugins:[{name:'research-prerender-preview',configurePreviewServer(server){
    server.middlewares.use(async(request,_response,next)=>{
      const url = new URL(request.url || '/', 'http://127.0.0.1');
      if (url.pathname !== '/' && !url.pathname.includes('.')) {
        try {
          await access(join('dist',url.pathname.slice(1),'index.html'));
          request.url = `${url.pathname.replace(/\/$/,'')}/index.html${url.search}`;
        } catch { /* Preserve the normal preview fallback for unknown routes. */ }
      }
      next();
    });
  }}],
});
const base = process.env.RESEARCH_BASE_URL || 'http://127.0.0.1:4186';
const output = process.env.RESEARCH_QA_DIR || 'qa-artifacts/research/local';
await mkdir(output, {recursive:true});
const browser = await chromium.launch({headless:true});
const results = [];
try {
  for (const viewport of [{width:1440,height:1000},{width:390,height:844}]) {
    const page = await browser.newPage({viewport});
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/*', route => {
      const url = new URL(route.request().url());
      return url.origin === new URL(base).origin || url.protocol === 'data:' ? route.continue() : route.abort();
    });
    for (const path of ['/research', ...articles.map(article=>article.path)]) {
      const response = await page.goto(base + path, {waitUntil:'networkidle'});
      assert.equal(response.status(),200, `${path}: status`);
      await page.locator('h1').waitFor();
      assert.equal(await page.locator('h1').count(),1);
      assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://liontechinnovations.co.uk'+path);
      const layout = await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,width:window.innerWidth}));
      assert.ok(layout.scroll <= layout.width + 1, `${path}: no horizontal overflow at ${viewport.width}: ${JSON.stringify(layout)}`);
      assert.ok(await page.locator('footer a[href="/research"]').count() > 0);
      const readability = await page.evaluate(() => {
        const rgb = value => (value.match(/[\d.]+/g) || []).slice(0,3).map(Number);
        const luminance = colour => rgb(colour).map(value => { const channel=value/255; return channel<=0.04045?channel/12.92:((channel+0.055)/1.055)**2.4; }).reduce((sum,value,index)=>sum+value*[0.2126,0.7152,0.0722][index],0);
        return [...document.querySelectorAll('.lt-research-intro,.lt-research-section p,.lt-research-note,.lt-research-evidence p,.lt-research-sources p')].map(element=>{
          let current=element,background='rgb(6,19,32)';
          while(current){ const colour=getComputedStyle(current).backgroundColor; if(colour !== 'rgba(0, 0, 0, 0)' && colour !== 'transparent'){background=colour;break;} current=current.parentElement; }
          const a=luminance(getComputedStyle(element).color),b=luminance(background);
          return (Math.max(a,b)+0.05)/(Math.min(a,b)+0.05);
        });
      });
      assert.ok(readability.every(ratio=>ratio>=4.5),`${path}: body text contrast ${Math.min(...readability)}`);
      const headingSizes = await page.locator('.lt-research-card h2,.lt-research-article h2').evaluateAll(nodes=>nodes.map(node=>parseFloat(getComputedStyle(node).fontSize)));
      assert.ok(headingSizes.every(size=>size<=32), `${path}: controlled research heading scale`);
      const slug = path.split('/').pop();
      await page.screenshot({path:`${output}/${slug}-${viewport.width}.png`,fullPage:true,animations:'disabled'});
      results.push({path,width:viewport.width,status:response.status(),overflow:false});
    }
    await page.goto(base+'/research',{waitUntil:'networkidle'});
    await page.locator('.lt-research-read').first().click();
    await page.waitForURL('**'+articles[0].path);
    assert.equal(await page.locator('h1').innerText(),articles[0].title);
    await page.getByRole('link',{name:'All research',exact:true}).click();
    await page.waitForURL('**/research');
    await page.locator('.lt-research-read').last().click();
    await page.waitForURL('**'+articles[1].path);
    assert.equal(await page.locator('h1').innerText(),articles[1].title);
    assert.deepEqual(errors,[],`No browser runtime errors at ${viewport.width}`);
    await page.close();
  }
  for(const article of articles) for(const item of article.evidence) {
    const response = await fetch(base+item.url);
    assert.equal(response.status,200,item.url);
    const text = await response.text();
    assert.ok(!text.startsWith('<!doctype'),item.url+': not fallback HTML');
    if(item.url.endsWith('.json')) JSON.parse(text);
    else assert.ok(text.includes('def run_tests'));
  }
  const result = {status:'PASS',base,checks:results,spaNavigation:'PASS',evidenceDownloads:'PASS',runtimeErrors:0};
  await writeFile(`${output}/results.json`,JSON.stringify(result,null,2)+'\n');
  console.log(JSON.stringify(result,null,2));
} finally {await browser.close(); if(server) await new Promise(resolve=>server.httpServer.close(resolve));}
