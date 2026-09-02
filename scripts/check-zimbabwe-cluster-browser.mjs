import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium, webkit, devices } from 'playwright';
import { preview } from 'vite';

const root = resolve(import.meta.dirname,'..');
const output = resolve(root,'artifacts/zimbabwe-page/cluster');
await mkdir(output,{recursive:true});
const sitemap = await readFile(resolve(root,'public/sitemap-zimbabwe.xml'),'utf8');
const routes = ['/zimbabwe', ...[...sitemap.matchAll(/<loc>https:\/\/liontechinnovations.co.uk([^<]+)<\/loc>/g)].map(m=>m[1])];
const server = await preview({root,plugins:[{name:'zimbabwe-cluster-local-rewrites',configurePreviewServer(server){server.middlewares.use((req,_res,next)=>{const url=new URL(req.url,'http://127.0.0.1');if(routes.includes(url.pathname))req.url=`${url.pathname}/index.html${url.search}`;next();});}}],preview:{host:'127.0.0.1',port:4198,strictPort:true}});
const browsers={chromium:await chromium.launch(),webkit:await webkit.launch()};
const errors=[],results=[];
const samples=['banking-financial-services','travel-tourism','construction-companies','logistics-distribution','mining-resources','agriculture-agri-processing','healthcare-hospitals','sports-stadiums-organisations'];
const variants=[
  {name:'mobile-320',engine:'chromium',viewport:{width:320,height:568}},
  {name:'mobile-360',engine:'chromium',viewport:{width:360,height:800}},
  {name:'mobile-390',engine:'chromium',viewport:{width:390,height:844}},
  {name:'android-412',engine:'chromium',...devices['Pixel 7'],viewport:{width:412,height:915}},
  {name:'mobile-430',engine:'chromium',viewport:{width:430,height:932}},
  {name:'desktop-1440',engine:'chromium',viewport:{width:1440,height:900}},
  {name:'iphone-390',engine:'webkit',...devices['iPhone 13'],viewport:{width:390,height:844}},
  {name:'iphone-430',engine:'webkit',...devices['iPhone 13'],viewport:{width:430,height:932}},
];
try {
  for(const variant of variants){
    const {name,engine,defaultBrowserType,...options}=variant;
    const page=await browsers[engine].newPage({...options,reducedMotion:'reduce'});
    page.on('console',m=>{if(m.type()==='error')errors.push({name,url:page.url(),type:'console',message:m.text()});});
    page.on('pageerror',e=>errors.push({name,url:page.url(),type:'page',message:e.message}));
    page.on('requestfailed',r=>errors.push({name,type:'request',url:r.url(),reason:r.failure()?.errorText}));
    page.on('response',r=>{if(r.status()>=400)errors.push({name,type:'http',url:r.url(),status:r.status()});});
    await page.addInitScript(()=>{window.__layoutShift=null;if(PerformanceObserver.supportedEntryTypes.includes('layout-shift')){window.__layoutShift=0;new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.__layoutShift+=e.value;}).observe({type:'layout-shift',buffered:true});}});
    for(const route of routes){
      assert.equal((await page.goto(`http://127.0.0.1:4198${route}`,{waitUntil:'networkidle'})).status(),200);
      assert.equal(await page.locator('h1').count(),1);
      assert.equal(await page.locator('vite-error-overlay').count(),0);
      for(const img of await page.locator('main img').all()){await img.scrollIntoViewIfNeeded();await img.evaluate(i=>i.decode());}
      const state=await page.evaluate(()=>({
        overflow:document.documentElement.scrollWidth>innerWidth+2,
        elements:[...document.querySelectorAll('main *')].filter(e=>{if(e instanceof SVGElement||e.closest('.lt-honeypot'))return false;const r=e.getBoundingClientRect();return r.width>0&&(r.left < -2 || r.right>innerWidth+2);}).map(e=>e.className),
        broken:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src),
        canonical:document.querySelector('link[rel="canonical"]').href,
        body:document.body.innerText,cls:window.__layoutShift,
        images:[...document.querySelectorAll('main img')].map(i=>({src:i.currentSrc,loading:i.loading,width:i.naturalWidth,height:i.naturalHeight})),
        fonts:[...document.querySelectorAll('.lt-kicker,legend')].map(e=>({color:getComputedStyle(e).color,size:parseFloat(getComputedStyle(e).fontSize)})),
      }));
      assert.equal(state.overflow,false,`${name} ${route}: overflow`);assert.deepEqual(state.elements,[],`${name} ${route}: clipped elements`);assert.deepEqual(state.broken,[]);
      if(state.cls!==null)assert.ok(state.cls<=0.01,`${name} ${route}: layout shift ${state.cls}`);
      assert.equal(state.canonical,`https://liontechinnovations.co.uk${route}`);
      assert.ok(!state.body.includes('£395'));assert.ok(state.body.includes('US$750'));assert.ok(state.body.includes('From US$2,500'));assert.ok(state.body.includes('From US$2,750'));
      for(const f of state.fonts){assert.equal(f.color,'rgb(200, 162, 74)');assert.ok(f.size>=12);}
      assert.equal(await page.locator('.lt-desktop-nav [aria-current="page"]').textContent(),'Zimbabwe');
      if(route==='/zimbabwe'){
        assert.equal(await page.locator('#zimbabwe-industries .lt-route-card-linked').count(),26);
        for(const img of await page.locator('.lt-route-platform-image img').all()){
          assert.ok(await img.evaluate(i=>Math.abs(Number(i.getAttribute('width'))/Number(i.getAttribute('height'))-i.naturalWidth/i.naturalHeight)<0.002),'Reserve the artwork aspect ratio before lazy loading');
        }
        if(variant.viewport.width<768){
          assert.equal(await page.locator('.lt-zimbabwe-delivery').evaluate(e=>getComputedStyle(e).gridTemplateColumns.split(' ').length),1);
          for(const field of await page.locator('form input:not([type="checkbox"]),form select,form textarea').all()){
            if(await field.getAttribute('name')==='website')continue;
            assert.ok(await field.evaluate(e=>parseFloat(getComputedStyle(e).fontSize)>=16));
          }
        }
      }else{
        assert.equal(await page.locator('.lt-zw-gates dt').count(),5);
        const first=page.locator('#sector-faq summary').first();await first.focus();await page.keyboard.press('Enter');
        assert.equal(await page.locator('#sector-faq details').first().getAttribute('open'),'');
        assert.ok(await first.evaluate(e=>getComputedStyle(e).outlineStyle!=='none'));
        await page.keyboard.press('Space');
      }
      if(name==='mobile-390'&&route==='/zimbabwe'){
        const captures=[['01-hero','.lt-zimbabwe-hero'],['02-corporate-focus','#zimbabwe-industries'],['03-business-today','#business-today'],['04-offers','#zimbabwe-offers'],['05-digital-future','#digital-foundation'],['06-safe-delivery','#delivery'],['07-security-controls','.lt-zimbabwe-security-layout'],['08-proof','#platform-proof'],['11-faq','#zimbabwe-faq'],['12-enquiry-form','#zimbabwe-enquiry'],['13-final-cta','#zimbabwe-final-cta']];
        for(const [file,selector] of captures){await page.locator(selector).evaluate(e=>window.scrollTo({top:e.getBoundingClientRect().top+scrollY,behavior:'instant'}));await page.screenshot({path:resolve(output,`${file}.png`),scale:'css'});}
      }
      if(['mobile-430','desktop-1440'].includes(name)&&route==='/zimbabwe'){
        await page.evaluate(()=>{document.activeElement?.blur();window.scrollTo({top:0,behavior:'instant'});});
        const buffer=await page.screenshot({path:resolve(output,`${name}-pillar-full.png`),fullPage:true,scale:'css'});assert.ok(buffer.length>0);
      }
      if(['mobile-390','desktop-1440'].includes(name)&&samples.some(slug=>route===`/zimbabwe/${slug}`)){
        await page.evaluate(()=>{document.activeElement?.blur();window.scrollTo({top:0,behavior:'instant'});});
        await page.screenshot({path:resolve(output,`${name}-${route.split('/').at(-1)}.png`),fullPage:true,scale:'css'});
        if(name==='mobile-390'&&route.endsWith('/banking-financial-services'))for(const [file,selector]of[['09-five-gates','.lt-zw-gates'],['10-evidence','#readiness-checks']]){await page.locator(selector).evaluate(e=>window.scrollTo({top:e.getBoundingClientRect().top+scrollY,behavior:'instant'}));await page.screenshot({path:resolve(output,`${file}.png`),scale:'css'});}
      }
      if(name==='mobile-390'||name==='iphone-390'){
        await page.locator('main .lt-button-primary').first().click();
        await page.waitForFunction(()=>{const e=document.getElementById('zimbabwe-enquiry');return e&&e.getBoundingClientRect().top>=-2&&e.getBoundingClientRect().top<112;});
        assert.ok(page.url().endsWith('/zimbabwe#zimbabwe-enquiry'));
        // Let the destination finish loading before the next route navigation.
        // Otherwise WebKit cancels the lazy waterfall request beside the form.
        await page.waitForLoadState('networkidle');
        for(const img of await page.locator('main img').all()){
          if(await img.evaluate(i=>i.getBoundingClientRect().top<innerHeight&&i.getBoundingClientRect().bottom>0))await img.evaluate(i=>i.decode());
        }
      }
      results.push({name,route,pass:true,cls:state.cls,images:state.images});
    }
    await page.close();
    console.log(`${name}: ${routes.length} Zimbabwe routes passed; zero overflow, broken images and missing commercial terms.`);
  }
  await writeFile(resolve(output,'browser-qa.json'),JSON.stringify({results,errors,limitations:['Mobile browser emulation; not physical Gmail or WhatsApp in-app browsers.','CLS is null where the browser does not support layout-shift observation.','Five Gates and evidence captures are the banking sector page, not new pillar sections.']},null,2));
  assert.deepEqual(errors,[]);
  console.log(`Zimbabwe browser cluster PASS: ${results.length} route/viewport checks; console/page/hydration/request errors=0.`);
}finally{await Promise.all(Object.values(browsers).map(b=>b.close()));server.httpServer.closeAllConnections();await new Promise(done=>server.httpServer.close(done));}
