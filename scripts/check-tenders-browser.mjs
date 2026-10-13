import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { chromium } from 'playwright';
import { createServer, preview } from 'vite';
const root = resolve(import.meta.dirname,'..');
const out = resolve(root,'qa-artifacts/tenders',process.env.TENDERS_RUN || 'local');
await mkdir(out,{recursive:true});
let browser, server, ssr;
const report={status:'RUNNING',routes:[],views:[],consoleErrors:[],networkWarnings:[]};
const rgb = text => text.match(/[\d.]+/g).slice(0,3).map(Number).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);
const luminance = text => rgb(text).reduce((total,v,i)=>total+v*[.2126,.7152,.0722][i],0);
const contrast = (a,b) => (Math.max(luminance(a),luminance(b))+.05)/(Math.min(luminance(a),luminance(b))+.05);
try {
  if (!process.env.TENDERS_BASE_URL) {
    const config=JSON.parse(await readFile(join(root,'vercel.json'),'utf8'));
    const exact=new Map(config.rewrites.filter(r=>!/[(:]/.test(r.source)).map(r=>[r.source,r.destination]));
    ssr=await createServer({root,configFile:false,logLevel:'error',server:{middlewareMode:true,hmr:false},optimizeDeps:{noDiscovery:true,include:[]}});
    const {default:notFound}=await ssr.ssrLoadModule('/api/tender-not-found.ts');
    server=await preview({root,plugins:[{name:'tender-preview-rewrites',configurePreviewServer(s){s.middlewares.use(async(req,res,next)=>{
      const url=new URL(req.url,'http://127.0.0.1');
      if(exact.has(url.pathname)) req.url=exact.get(url.pathname)+url.search;
      else if(url.pathname==='/tenders'||url.pathname.startsWith('/tenders/')) {const response=notFound();res.statusCode=response.status;response.headers.forEach((value,key)=>res.setHeader(key,value));res.end(await response.text());return;}
      next();
    });}}],preview:{host:'127.0.0.1',port:5174,strictPort:true}});
  }
  const base=process.env.TENDERS_BASE_URL || 'http://127.0.0.1:5174'; report.base=base;
  const contextOptions={reducedMotion:'reduce',viewport:{width:375,height:844}};
  const apiHeaders={};
  if(process.env.VERCEL_OIDC_TOKEN) apiHeaders['x-vercel-trusted-oidc-idp-token']=process.env.VERCEL_OIDC_TOKEN;
  const origin=new URL(base).origin;
  browser=await chromium.launch();
  const context=await browser.newContext(contextOptions);
  // Keep a protected-preview credential scoped to this exact origin; never send it to source sites.
  if(Object.keys(apiHeaders).length) await context.route(`${origin}/**`,route=>route.continue({headers:{...route.request().headers(),...apiHeaders}}));
  const page=await context.newPage();
  page.on('console',message=>{if(message.type()==='error')report.consoleErrors.push({text:message.text(),url:message.location().url});});
  page.on('pageerror',error=>report.consoleErrors.push({text:error.message,url:''}));
  page.on('request',request=>{if(/localhost:3000|127\.0\.0\.1:3000|mission-control/i.test(request.url()))report.networkWarnings.push('Unexpected private endpoint request');});
  // Read the checked-in typed catalogue through Vite, not an invented route list.
  if(!ssr) ssr=await createServer({root,configFile:false,logLevel:'error',server:{middlewareMode:true,hmr:false},optimizeDeps:{noDiscovery:true,include:[]}});
  const {tenderCatalog}=await ssr.ssrLoadModule('/src/content/tenders/catalog.ts');
  for(const entry of tenderCatalog) {
    const response=await page.goto(`${base}${entry.path}`,{waitUntil:'networkidle'});
    assert.equal(response.status(),200,entry.path);
    await page.locator(`[data-tender-page="${entry.slug}"]`).waitFor();
    assert.equal(await page.locator('h1').count(),1);
    const geometry=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,bodyFont:getComputedStyle(document.querySelector('.lt-tender-answer')).fontSize,headColour:getComputedStyle(document.querySelector('.lt-tender-page h1')).color}));
    assert.equal(geometry.overflow,false,entry.path); assert.equal(geometry.bodyFont,'18px');
    assert.equal(await page.locator('.lt-tender-utility tbody tr').count(),entry.utility.fields.length);
    assert.equal(await page.locator('.lt-tender-faq details').count(),3);
    assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'),'noindex,follow');
    const downloadWait=page.waitForEvent('download'); await page.getByRole('link',{name:'Download blank CSV'}).click(); const download=await downloadWait;
    const file=join(out,`${entry.slug}.csv`); await download.saveAs(file);
    const text=await readFile(file,'utf8'); for(const field of entry.utility.fields)assert(text.toLowerCase().includes(field.toLowerCase()));
    report.routes.push({path:entry.path,status:200,overflow:false,download:'PASS',fields:entry.utility.fields.length});
  }
  for(const width of [375,768,1440]) {
    await page.setViewportSize({width,height:960});
    await page.goto(`${base}/tenders`,{waitUntil:'networkidle'});
    await page.locator('.lt-tender-hero').waitFor();
    const hero=page.locator('.lt-tender-hero-image img'),secondary=page.locator('.lt-tender-illustration img');
    await secondary.scrollIntoViewIfNeeded(); await page.waitForFunction(()=>document.querySelector('.lt-tender-illustration img').complete);
    const images=await page.locator('.lt-tender-page img').evaluateAll(images=>images.map(i=>({complete:i.complete,width:i.naturalWidth,height:i.naturalHeight,src:new URL(i.currentSrc).pathname,loading:i.loading,fit:getComputedStyle(i).objectFit,box:i.getBoundingClientRect().toJSON()})));
    assert.equal(images.length,2); assert(images.every(i=>i.complete&&i.width>0)); assert.equal(images[1].loading,'lazy');
    assert(Math.abs(images[1].box.width/images[1].box.height-images[1].width/images[1].height)<.01);
    if(width===375) assert.equal(images[0].fit,'contain');
    const colours=await page.evaluate(()=>{const paragraph=document.querySelector('.lt-tender-page .lt-route-section > .lt-shell > p:not(.lt-tender-review)'),heading=document.querySelector('.lt-tender-page .lt-route-section h2'),button=document.querySelector('.lt-tender-page .lt-button-primary');return{body:getComputedStyle(paragraph).color,heading:getComputedStyle(heading).color,paper:getComputedStyle(document.querySelector('.lt-tender-page')).backgroundColor,buttonText:getComputedStyle(button).color,buttonBg:getComputedStyle(button).backgroundColor,bodySize:getComputedStyle(paragraph).fontSize,bodyLine:getComputedStyle(paragraph).lineHeight};});
    assert(contrast(colours.body,colours.paper)>=4.5,'Body contrast'); assert(contrast(colours.heading,colours.paper)>=4.5,'Heading contrast'); assert(contrast(colours.buttonText,colours.buttonBg)>=4.5,'Primary CTA contrast');
    if(width<=1000) {
      const heroColours=await page.locator('.lt-tender-hero-copy').evaluate(el=>({heading:getComputedStyle(el.querySelector('h1')).color,body:getComputedStyle(el.querySelector('p:not(.lt-kicker)')).color,secondary:getComputedStyle(el.querySelector('.lt-button-secondary')).color}));
      for(const color of Object.values(heroColours)) assert(contrast(color,colours.paper)>=4.5,'Mobile/tablet hero must have dark readable text');
    }
    assert.equal(colours.bodySize,'18px'); assert(parseFloat(colours.bodyLine)>=27);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    assert.match(await page.locator('.lt-tender-caption').innerText(),/AI-generated.*independent.*not affiliated/s);
    await page.locator('.lt-tender-hero').screenshot({path:join(out,`hero-${width}.png`)});
    await page.locator('.lt-tender-illustration').screenshot({path:join(out,`illustration-${width}.png`)});
    await page.locator('#pricing').screenshot({path:join(out,`pricing-${width}.png`)});
    await page.screenshot({path:join(out,`hub-${width}.png`),fullPage:true});
    report.views.push({width,overflow:false,images,contrast:{body:contrast(colours.body,colours.paper),heading:contrast(colours.heading,colours.paper),button:contrast(colours.buttonText,colours.buttonBg)}});
  }
  // 200% zoom-equivalent CSS viewport reflow, plus a doubled rendering stress check.
  await page.setViewportSize({width:720,height:450}); await page.goto(`${base}/tenders`,{waitUntil:'networkidle'});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.screenshot({path:join(out,'zoom-200-equivalent.png'),fullPage:true});
  report.zoom='200% equivalent reflow at 720 CSS pixels passed; not a full accessibility certification';
  await page.setViewportSize({width:375,height:844});
  await page.goto(`${base}/tenders?source=cleaning-tender-support#enquiry`,{waitUntil:'networkidle'});
  const requests=[];let status=502;
  await page.route('**/api/tender-enquiry',async route=>{requests.push(JSON.parse(route.request().postData()));await new Promise(r=>setTimeout(r,250));await route.fulfill({status,contentType:'application/json',body:JSON.stringify({ok:status===200})});});
  const form=page.getByRole('form',{name:'Tender enquiry'});
  await form.getByRole('button',{name:'Send tender enquiry'}).click();assert.equal(requests.length,0,'Required fields block an empty send');
  for(const [name,value] of Object.entries({name:'Local QA',email:'qa@example.com',company:'Fictional QA',publicTenderUrl:'https://www.find-tender.service.gov.uk/',deadline:'2026-12-15T15:00',timezone:'Europe/London',message:'Labelled browser fixture, not sent.'}))await form.locator(`[name="${name}"]`).fill(value);
  await form.locator('[name="sector"]').selectOption('Cleaning');await form.locator('[name="support"]').selectOption('Tender Fit Review');await form.locator('[name="consent"]').check();
  await form.locator('[name="timezone"]').fill('invalid-zone');await form.getByRole('button',{name:'Send tender enquiry'}).click();assert.equal(requests.length,0);await form.locator('[name="timezone"]').fill('Europe/London');
  await form.getByRole('button',{name:'Send tender enquiry'}).click();await page.getByRole('alert').waitFor();
  assert.equal(requests.length,1);assert.equal(requests[0].source,'/tenders/cleaning-tender-support');
  const first=requests[0];status=200;await form.getByRole('button',{name:'Send tender enquiry'}).click();await page.getByRole('heading',{name:'Your enquiry has been received.'}).waitFor();
  assert.deepEqual(requests[1],first,'Retry preserves payload/key');assert.equal(await page.locator('.lt-tender-success').evaluate(el=>document.activeElement===el),true);
  report.enquiry='Client validation, source attribution, loading, retry idempotency, honest failure and success focus passed with mocked provider; zero real emails.';
  const response=await context.request.get(`${base}/tenders/not-a-real-page`,{headers:apiHeaders});assert.equal(response.status(),404);
  report.unknownSlug={status:response.status(),robots:response.headers()['x-robots-tag']};
  for(const path of ['/','/about','/contact','/dev-fix','/links','/ai-visibility-snapshot','/privacy-policy']) {
    const response=await page.goto(`${base}${path}`,{waitUntil:'domcontentloaded'});assert.equal(response.status(),200,path);await page.locator('h1').first().waitFor();
  }
  // Existing external credential-provider errors are not counted as new tender-page errors.
  assert.deepEqual(report.networkWarnings,[]);
  report.expectedMockFailures=report.consoleErrors.filter(error=>error.url===`${origin}/api/tender-enquiry`&&error.text.includes('502'));
  assert.equal(report.expectedMockFailures.length,1,'Exactly one intentional mocked 502 response was exercised');
  assert.deepEqual(report.consoleErrors.filter(error=>!report.expectedMockFailures.includes(error)&&!error.url.startsWith('https://certify.sbs.ox.ac.uk/')),[]);
  report.status='PASS';
  await context.close();
} catch(error) {report.status='FAIL';report.failure=error.stack;process.exitCode=1;}
finally {await browser?.close();if(server)await new Promise(done=>server.httpServer.close(done));await ssr?.close();await writeFile(join(out,'report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));}
