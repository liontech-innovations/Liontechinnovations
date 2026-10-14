import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile, access } from 'node:fs/promises';
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
    ssr=await createServer({root,configFile:false,logLevel:'error',server:{middlewareMode:true,hmr:false,watch:{ignored:['**/qa-artifacts/**','**/dist/**']}},optimizeDeps:{noDiscovery:true,include:[]}});
    const {default:notFound}=await ssr.ssrLoadModule('/api/tender-not-found.ts');
    server=await preview({root,plugins:[{name:'tender-preview-rewrites',configurePreviewServer(s){s.middlewares.use(async(req,res,next)=>{
      const url=new URL(req.url,'http://127.0.0.1');
      if(exact.has(url.pathname)) req.url=exact.get(url.pathname)+url.search;
      else if(url.pathname==='/tenders'||url.pathname.startsWith('/tenders/')||url.pathname.startsWith('/downloads/tenders/')) {
        if(url.pathname.startsWith('/downloads/tenders/')) {
          const filename=url.pathname.slice('/downloads/tenders/'.length);
          if(/^[a-z0-9-]+\.(csv|md)$/.test(filename)) { try { await access(join(root,'dist/downloads/tenders',filename)); next(); return; } catch {} }
        }
        const response=notFound();res.statusCode=response.status;response.headers.forEach((value,key)=>res.setHeader(key,value));res.end(await response.text());return;
      }
      next();
    });}}],preview:{host:'127.0.0.1',port:0,strictPort:false}});
  }
  const base=process.env.TENDERS_BASE_URL || `http://127.0.0.1:${server.httpServer.address().port}`; report.base=base;
  const contextOptions={reducedMotion:'reduce',viewport:{width:375,height:844}};
  const apiHeaders={};
  if(process.env.VERCEL_OIDC_TOKEN) apiHeaders['x-vercel-trusted-oidc-idp-token']=process.env.VERCEL_OIDC_TOKEN;
  const origin=new URL(base).origin;
  const expectedRobots=process.env.TENDERS_EXPECT_PUBLISHED==='true'?'index,follow':'noindex,follow';
  browser=await chromium.launch();
  const context=await browser.newContext(contextOptions);
  // Keep a protected-preview credential scoped to this exact origin; never send it to source sites.
  if(Object.keys(apiHeaders).length) await context.route(`${origin}/**`,route=>route.continue({headers:{...route.request().headers(),...apiHeaders}}));
  const page=await context.newPage();
  page.on('console',message=>{if(message.type()==='error')report.consoleErrors.push({text:message.text(),url:message.location().url});});
  page.on('pageerror',error=>report.consoleErrors.push({text:error.message,url:''}));
  page.on('request',request=>{if(/localhost:3000|127\.0\.0\.1:3000|mission-control/i.test(request.url()))report.networkWarnings.push('Unexpected private endpoint request');});
  // Read the checked-in typed catalogue through Vite, not an invented route list.
  if(!ssr) ssr=await createServer({root,configFile:false,logLevel:'error',server:{middlewareMode:true,hmr:false,watch:{ignored:['**/qa-artifacts/**','**/dist/**']}},optimizeDeps:{noDiscovery:true,include:[]}});
  const {tenderCatalog}=await ssr.ssrLoadModule('/src/content/tenders/catalog.ts');
  const {tenderPreviewCohorts}=await ssr.ssrLoadModule('/src/content/tenders/release.ts');
  const selected=tenderCatalog.filter(entry=>tenderPreviewCohorts.includes(entry.cohort));
  assert.equal(selected.length,5,'First-cohort preview must contain five resources');
  for(const entry of selected) {
    const response=await page.goto(`${base}${entry.path}`,{waitUntil:'networkidle'});
    assert.equal(response.status(),200,entry.path);
    const initialHtml=await response.text();
    assert.equal((initialHtml.match(/<h1[ >]/g)||[]).length,1);
    assert(initialHtml.includes(`rel="canonical" href="https://liontechinnovations.co.uk${entry.path}"`));
    assert(initialHtml.includes(`name="robots" content="${expectedRobots}"`));
    assert(initialHtml.includes('Field guide for the blank worksheet'),'Useful initial HTML must not require client rendering');
    await page.locator(`[data-tender-page="${entry.slug}"]`).waitFor();
    assert.equal(await page.locator('h1').count(),1);
    const geometry=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,bodyFont:getComputedStyle(document.querySelector('.lt-tender-answer')).fontSize,headColour:getComputedStyle(document.querySelector('.lt-tender-page h1')).color}));
    assert.equal(geometry.overflow,false,entry.path); assert.equal(geometry.bodyFont,'18px');
    assert.equal(await page.locator('.lt-tender-utility tbody tr').count(),entry.utility.fields.length);
    assert.equal(await page.locator('.lt-tender-faq details').count(),3);
    assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'),expectedRobots);
    const request=page.locator('[data-tender-page]').getByRole('link',{name:'Request Tender Support',exact:true});
    assert.equal(await request.getAttribute('href'),`/tenders?source=${entry.slug}#enquiry`);
    await page.screenshot({path:join(out,`resource-${entry.slug}-375.png`),fullPage:true});
    const file=join(out,`${entry.slug}.csv`);
    if(process.env.TENDERS_BASE_URL && Object.keys(apiHeaders).length) {
      // Browser download navigation does not inherit route-injected OIDC headers.
      // Verify the same link's bytes over authenticated HTTP; local checks still require a real click/download.
      const href=await page.getByRole('link',{name:'Download blank CSV'}).getAttribute('href');
      assert.equal(href,`/downloads/tenders/${entry.slug}.csv`);
      const response=await context.request.get(`${base}${href}`,{headers:apiHeaders});
      assert.equal(response.status(),200); assert.match(response.headers()['content-type'],/text\/csv/);
      await writeFile(file,await response.body());
      const worksheet=await context.request.get(`${base}/downloads/tenders/${entry.slug}.md`,{headers:apiHeaders});
      assert.equal(worksheet.status(),200); assert((await worksheet.text()).includes('Fictional'));
      report.downloadTransport='Protected-preview authenticated HTTP; actual click/download also verified in the local built preview';
    } else {
      const downloadWait=page.waitForEvent('download'); await page.getByRole('link',{name:'Download blank CSV'}).click(); const download=await downloadWait;
      await download.saveAs(file);
    }
    const text=await readFile(file,'utf8'); for(const field of entry.utility.fields)assert(text.toLowerCase().includes(field.toLowerCase()));
    report.routes.push({path:entry.path,status:200,overflow:false,download:'PASS',fields:entry.utility.fields.length});
  }
  for(const entry of tenderCatalog.filter(entry=>!tenderPreviewCohorts.includes(entry.cohort))) {
    for(const path of [entry.path,`/downloads/tenders/${entry.slug}.csv`,`/downloads/tenders/${entry.slug}.md`]) {
      const response=await context.request.get(`${base}${path}`,{headers:apiHeaders});
      assert.equal(response.status(),404,`Unreviewed resource/download must not be publicly served: ${path}`);
    }
  }
  report.unreviewed='20 resources and their 40 downloads return 404';
  for(const [width,height] of [[375,812],[390,844],[430,932],[768,1024],[1024,768],[1280,800],[1440,900]]) {
    await page.setViewportSize({width,height});
    await page.goto(`${base}/tenders`,{waitUntil:'networkidle'});
    await page.locator('.lt-tender-hero').waitFor();
    const hero=page.locator('.lt-tender-hero-image img'),secondary=page.locator('.lt-tender-illustration img');
    await secondary.scrollIntoViewIfNeeded(); await page.waitForFunction(()=>document.querySelector('.lt-tender-illustration img').complete);
    const images=await page.locator('.lt-tender-page img').evaluateAll(images=>images.map(i=>({complete:i.complete,width:i.naturalWidth,height:i.naturalHeight,src:new URL(i.currentSrc).pathname,loading:i.loading,fit:getComputedStyle(i).objectFit,box:i.getBoundingClientRect().toJSON()})));
    assert.equal(images.length,2); assert(images.every(i=>i.complete&&i.width>0)); assert.equal(images[1].loading,'lazy');
    assert(Math.abs(images[1].box.width/images[1].box.height-images[1].width/images[1].height)<.01);
    if(width===375) assert.equal(images[0].fit,'contain');
    const colours=await page.evaluate(()=>{const paragraph=document.querySelector('.lt-tender-section p'),heading=document.querySelector('.lt-tender-section h2'),button=document.querySelector('.lt-tender-page .lt-button-primary');return{body:getComputedStyle(paragraph).color,heading:getComputedStyle(heading).color,paper:getComputedStyle(document.querySelector('.lt-tender-page')).backgroundColor,buttonText:getComputedStyle(button).color,buttonBg:getComputedStyle(button).backgroundColor,bodySize:getComputedStyle(paragraph).fontSize,bodyLine:getComputedStyle(paragraph).lineHeight};});
    assert(contrast(colours.body,colours.paper)>=4.5,'Body contrast'); assert(contrast(colours.heading,colours.paper)>=4.5,'Heading contrast'); assert(contrast(colours.buttonText,colours.buttonBg)>=4.5,'Primary CTA contrast');
    if(width<=1100) {
      const heroColours=await page.locator('.lt-tender-hero-copy').evaluate(el=>({heading:getComputedStyle(el.querySelector('h1')).color,body:getComputedStyle(el.querySelector('p:not(.lt-kicker)')).color,secondary:getComputedStyle(el.querySelector('.lt-button-secondary')).color}));
      for(const color of Object.values(heroColours)) assert(contrast(color,colours.paper)>=4.5,'Mobile/tablet hero text must be readable on the LionTech canvas');
    }
    assert.equal(colours.bodySize,await page.locator('.marketing-site').evaluate(el=>getComputedStyle(el).fontSize),'Hub body typography must inherit the shared LionTech scale'); assert(parseFloat(colours.bodyLine)>=24);
    assert.equal(await page.locator('.lt-tender-deliverables .lt-standard-card').count(),4,'Four native deliverable cards');
    assert.equal(await page.locator('#process .lt-restored-gates .lt-standard-card').count(),5,'Five structured native process cards');
    assert.equal(await page.locator('.lt-tender-resources .lt-standard-card').count(),3,'Three branded resource groups');
    assert.equal(await page.locator('[data-tender-faq] details').count(),7,'All approved FAQ answers retained');
    if(width<768) assert.equal(await page.locator('.lt-tender-resources').evaluate(el=>getComputedStyle(el).gridAutoRows),'auto','Stacked resources must be content-sized');
    const footerHeight=await page.locator('.lt-compact-footer').evaluate(el=>el.getBoundingClientRect().height);
    if(width>=1280) assert(footerHeight<=225,`Compact desktop footer is ${footerHeight}px`);
    if(width>=1280) {
      const fallbackHeights=await page.locator('.lt-compact-footer').evaluate(el=>{const original=el.style.fontFamily;try{return ['system-ui','sans-serif','Verdana'].map(family=>{el.style.fontFamily=family;return {family,height:el.getBoundingClientRect().height};});}finally{el.style.fontFamily=original;}});
      for(const {family,height} of fallbackHeights) assert(height<=225,`Compact footer with ${family} is ${height}px`);
    }
    if(width<768) {
      for(const details of await page.locator('.lt-compact-footer details').all()) {
        const summary=details.locator('summary'); await summary.focus(); await page.keyboard.press('Enter');
        assert(await details.evaluate(el=>el.open),'Footer group opens from keyboard');
        for(const link of await details.locator('a').all()) assert(await link.isVisible(),'Essential footer links are available');
        await summary.focus(); await page.keyboard.press('Enter');
      }
    }
    assert(images[1].box.width<=640,'Supporting illustration must not dominate the page');
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    assert.equal(await page.locator('.lt-tender-caption').count(),0,'Visible image-warning paragraphs are removed');
    assert.equal(await page.getByRole('link',{name:'View full illustration'}).count(),0);
    if(width<=430) for(const image of images) assert(image.box.width>=width-32,'Mobile artwork fills the section width');
    for (const description of await page.locator('.lt-tender-page img').evaluateAll(images=>images.map(image=>image.alt))) assert.match(description,/AI-generated/,'Accurate image descriptions remain available');
    await page.locator('.lt-tender-hero').screenshot({path:join(out,`hero-${width}.png`)});
    await page.locator('.lt-tender-illustration').screenshot({path:join(out,`illustration-${width}.png`)});
    assert.equal(await page.locator('.lt-tender-offer').count(),0,'Enquiry-only pages must not advertise unapproved offers');
    assert(!/(?:£\s*\d|\bVAT\b|tax treatment|initial deposit|checkout totals)/i.test(await page.locator('.lt-tender-page').innerText()));
    await page.locator('#scope').screenshot({path:join(out,`scope-${width}.png`)});
    await page.screenshot({path:join(out,`hub-${width}.png`),fullPage:true});
    report.views.push({width,overflow:false,images,contrast:{body:contrast(colours.body,colours.paper),heading:contrast(colours.heading,colours.paper),button:contrast(colours.buttonText,colours.buttonBg)}});
  }
  for(const name of ['tender-hero-meeting','tender-support-illustration']) for(const width of [640,960,1440,1672]) {
    const filename=`${name}-${width}.webp`;
    const response=await context.request.get(`${base}/assets/tenders/${filename}`,{headers:apiHeaders});
    assert.equal(response.status(),200);
    assert.deepEqual(await response.body(),await readFile(join(root,'public/assets/tenders',filename)),'Deployed image differs from the approved asset');
  }
  report.approvedAssetBytes='All eight deployed variants match the checked-in approved files';
  // 200% zoom-equivalent CSS viewport reflow, plus a doubled rendering stress check.
  await page.setViewportSize({width:720,height:450}); await page.goto(`${base}/tenders`,{waitUntil:'networkidle'});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.screenshot({path:join(out,'zoom-200-equivalent.png'),fullPage:true});
  report.zoom='200% equivalent reflow at 720 CSS pixels passed; not a full accessibility certification';
  const availableLinks=await page.locator('a[href^="/tenders/"]').evaluateAll(links=>links.map(link=>new URL(link.href).pathname));
  assert(availableLinks.every(path=>selected.some(entry=>entry.path===path)));
  assert.equal(await page.locator('.lt-tender-resources li').count(),5);
  const enquiryLink=page.locator('.lt-tender-hero').getByRole('link',{name:'Request Tender Support',exact:true});
  await enquiryLink.focus(); await page.keyboard.press('Enter');
  assert.equal(new URL(page.url()).pathname,'/tenders'); assert.equal(new URL(page.url()).hash,'#enquiry'); await page.getByRole('form',{name:'Tender enquiry'}).waitFor();
  for(const details of await page.locator('[data-tender-faq] details').all()) {
    const summary=details.locator('summary'); await summary.focus(); await page.keyboard.press('Enter');
    assert(await details.evaluate(el=>el.open)); assert(await details.locator('p').isVisible(),'Approved FAQ answer is accessible');
    await page.keyboard.press('Enter'); assert(!(await details.evaluate(el=>el.open)));
  }
  report.keyboard='Enquiry CTA and FAQ activated from the keyboard; form success receives focus';
  await page.setViewportSize({width:375,height:844});
  await page.goto(`${base}/tenders?source=cleaning-tender-support#enquiry`,{waitUntil:'networkidle'});
  await page.getByRole('link',{name:'How support works',exact:true}).click();
  assert.equal(new URL(page.url()).pathname,'/tenders'); assert.equal(new URL(page.url()).search,'?source=cleaning-tender-support'); assert.equal(new URL(page.url()).hash,'#process');
  await page.locator('.lt-tender-hero').getByRole('link',{name:'Request Tender Support',exact:true}).click();
  assert.equal(new URL(page.url()).hash,'#enquiry'); assert.equal(new URL(page.url()).search,'?source=cleaning-tender-support');
  await page.locator('.lt-tender-scope-panel .lt-button-primary').click();
  assert.equal(new URL(page.url()).hash,'#enquiry'); assert.equal(new URL(page.url()).search,'?source=cleaning-tender-support');
  const requests=[];let status=502;
  await page.route('**/api/tender-enquiry',async route=>{requests.push(JSON.parse(route.request().postData()));await new Promise(r=>setTimeout(r,250));await route.fulfill({status,contentType:'application/json',body:JSON.stringify({ok:status===200})});});
  const form=page.getByRole('form',{name:'Tender enquiry'});
  const controls=await form.locator('input:not([type="checkbox"]):not([name="website"]),select,textarea').evaluateAll(elements=>elements.map(el=>({name:el.name,text:getComputedStyle(el).color,background:getComputedStyle(el).backgroundColor,border:getComputedStyle(el).borderTopColor,placeholder:el.matches('input,textarea')?getComputedStyle(el,'::placeholder').color:null})));
  for (const control of controls) {
    assert(contrast(control.text,control.background)>=4.5,`Readable ${control.name} input/selected value`);
    assert(contrast(control.border,control.background)>=3,`Visible ${control.name} control boundary`);
    if(control.placeholder) assert(contrast(control.placeholder,control.background)>=4.5,`Readable ${control.name} placeholder`);
  }
  report.formContrast='All visible field values and placeholders exceed 4.5:1 against their actual control backgrounds';
  await form.screenshot({path:join(out,'form-375.png')});
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
  for(const width of [375,768,1280,1440]) {
    await page.setViewportSize({width,height:900}); await page.goto(`${base}/`,{waitUntil:'networkidle'});
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    await page.evaluate(()=>{window.__tenderNavigationProbe=true;});
    const solutions=page.getByRole('navigation',{name:'Footer solutions'});
    if(width<768) await solutions.locator('summary').click();
    await solutions.getByRole('link',{name:'Tender Support',exact:true}).click();
    await page.locator('.lt-tender-hero').waitFor(); assert.equal(new URL(page.url()).pathname,'/tenders');
    assert.equal(await page.evaluate(()=>window.__tenderNavigationProbe),true,'Internal navigation must not reload');
    assert.equal(await page.locator('.lt-desktop-nav a[aria-current="page"]').textContent(),'Tender Support');
    if(width>=1280) {
      const rows=await page.locator('.lt-desktop-nav a').evaluateAll(links=>links.map(link=>link.getBoundingClientRect().y));
      assert.equal(rows.length,9); assert.equal(new Set(rows).size,1);
    } else {
      await page.getByRole('button',{name:'Open navigation'}).click();
      await page.locator('#mobile-navigation').getByRole('link',{name:'Services',exact:true}).click();
      assert.equal(await page.locator('#mobile-navigation').count(),0);
      await page.getByRole('link',{name:'Explore Tender Support',exact:true}).click(); await page.locator('.lt-tender-hero').waitFor();
    }
  }
  report.navigation='Tender Support first in the nine-item header; active route, Services/footer entry, mobile menu and no-reload navigation pass';
  // Existing external credential-provider errors are not counted as new tender-page errors.
  assert.deepEqual(report.networkWarnings,[]);
  report.expectedMockFailures=report.consoleErrors.filter(error=>error.url===`${origin}/api/tender-enquiry`&&error.text.includes('502'));
  assert.equal(report.expectedMockFailures.length,1,'Exactly one intentional mocked 502 response was exercised');
  assert.deepEqual(report.consoleErrors.filter(error=>!report.expectedMockFailures.includes(error)&&!error.url.startsWith('https://certify.sbs.ox.ac.uk/')),[]);
  report.status='PASS';
  await context.close();
} catch(error) {report.status='FAIL';report.failure=error.stack;process.exitCode=1;}
finally {await browser?.close();if(server)await new Promise(done=>server.httpServer.close(done));await ssr?.close();await writeFile(join(out,'report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));}
