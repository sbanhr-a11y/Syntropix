import { chromium } from 'playwright';
import fs from 'node:fs';

const base='http://127.0.0.1:4173';
const pages=[
  'index.html','enterprise.html','professionals.html','solutions.html',
  'assessment-intelligence.html','manager-development.html','prism360.html',
  'employee-experience.html','talent-solutions.html','professional-coaching.html',
  'compliance-learning.html','pricing.html','science.html','trust.html',
  'privacy.html','terms.html','refund-cancellation.html','cookie-policy.html'
];
const critical=new Set([
  'index.html','enterprise.html','professionals.html','solutions.html',
  'employee-experience.html','professional-coaching.html','pricing.html',
  'science.html','trust.html'
]);
const viewports=[
  {name:'desktop-1920',width:1920,height:1080},
  {name:'desktop-1440',width:1440,height:1000},
  {name:'tablet-1024',width:1024,height:900},
  {name:'mobile-390',width:390,height:844},
];

fs.rmSync('qa-output',{recursive:true,force:true});
fs.mkdirSync('qa-output/screenshots',{recursive:true});

async function revealForScreenshot(page){
  const reveals=page.locator('.sx-reveal');
  const count=await reveals.count();
  for(let i=0;i<count;i++){
    await reveals.nth(i).scrollIntoViewIfNeeded();
    await page.waitForTimeout(120);
  }
  await page.evaluate(async()=>{
    const step=Math.max(420,Math.floor(window.innerHeight*.72));
    for(let y=0;y<document.documentElement.scrollHeight;y+=step){
      window.scrollTo(0,y);
      await new Promise(r=>setTimeout(r,55));
    }
    window.scrollTo(0,0);
    await new Promise(r=>setTimeout(r,500));
  });
}

const browser=await chromium.launch({headless:true});
const report={generatedAt:new Date().toISOString(),results:[],targeted:{},failures:[]};

for(const vp of viewports){
  const context=await browser.newContext({viewport:{width:vp.width,height:vp.height},deviceScaleFactor:1});
  for(const path of pages){
    const page=await context.newPage();
    const consoleErrors=[],pageErrors=[],badResponses=[];
    page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text())});
    page.on('pageerror',e=>pageErrors.push(String(e)));
    page.on('response',r=>{
      if(r.url().startsWith(base) && r.status()>=400) badResponses.push({url:r.url(),status:r.status()});
    });
    const url=`${base}/${path}`;
    let navError=null;
    try{
      await page.goto(url,{waitUntil:'domcontentloaded',timeout:12000});
      await page.waitForTimeout(350);
    }catch(e){navError=String(e)}
    const metrics=navError?null:await page.evaluate(()=>({
      title:document.title,
      bodyText:document.body?.innerText?.trim().length||0,
      scrollWidth:document.documentElement.scrollWidth,
      clientWidth:document.documentElement.clientWidth,
      scrollHeight:document.documentElement.scrollHeight,
      h1Count:document.querySelectorAll('h1').length,
      visibleMain:!!document.querySelector('main') && getComputedStyle(document.querySelector('main')).display!=='none'
    }));
    const overflow=metrics?Math.max(0,metrics.scrollWidth-metrics.clientWidth):null;
    const rec={viewport:vp.name,path,url,navError,metrics,overflow,consoleErrors,pageErrors,badResponses};
    report.results.push(rec);
    if(navError || !metrics || metrics.bodyText<80 || !metrics.visibleMain || metrics.h1Count!==1 || overflow>2 || consoleErrors.length || pageErrors.length || badResponses.length){
      report.failures.push({viewport:vp.name,path,navError,metrics,overflow,consoleErrors,pageErrors,badResponses});
    }
    if(critical.has(path) && !navError){
      await revealForScreenshot(page);
      await page.screenshot({path:`qa-output/screenshots/${path.replace('.html','')}--${vp.name}.png`,fullPage:true});
    }
    await page.close();
  }
  await context.close();
}

// Targeted regression: homepage reveal content must become visible when scrolled into view.
{
 const context=await browser.newContext({viewport:{width:1440,height:1000}});
 const page=await context.newPage();
 await page.goto(base+'/index.html',{waitUntil:'domcontentloaded',timeout:12000});
 const items=page.locator('.sx-reveal');
 const count=await items.count();
 for(let i=0;i<count;i++){
   await items.nth(i).scrollIntoViewIfNeeded();
   await page.waitForTimeout(120);
 }
 await page.waitForTimeout(750);
 const state=await page.locator('.sx-reveal').evaluateAll(els=>els.map(el=>({visible:el.classList.contains('visible'),opacity:getComputedStyle(el).opacity,display:getComputedStyle(el).display})));
 const failed=state.filter(x=>!x.visible || Number(x.opacity)<0.95 || x.display==='none');
 report.targeted.homepageRevealState={count,failed:failed.length,pass:count>0&&failed.length===0};
 if(!report.targeted.homepageRevealState.pass) report.failures.push({target:'homepageRevealState',...report.targeted.homepageRevealState,state});
 await context.close();
}

// Targeted regression: homepage menu closed by default and opens only on interaction.
{
 const context=await browser.newContext({viewport:{width:390,height:844}});
 const page=await context.newPage();
 await page.goto(base+'/index.html',{waitUntil:'domcontentloaded',timeout:12000});
 const before=await page.locator('.home-menu-panel').evaluate(el=>getComputedStyle(el).display);
 await page.locator('.home-menu-toggle').click();
 await page.waitForTimeout(100);
 const after=await page.locator('.home-menu-panel').evaluate(el=>getComputedStyle(el).display);
 report.targeted.mobileMenu={before,after,pass:before==='none'&&after!=='none'};
 if(!report.targeted.mobileMenu.pass) report.failures.push({target:'mobileMenu',...report.targeted.mobileMenu});
 await context.close();
}

// Targeted regression: inner-page mobile navigation must be usable.
{
 const context=await browser.newContext({viewport:{width:390,height:844}});
 const page=await context.newPage();
 await page.goto(base+'/enterprise.html',{waitUntil:'domcontentloaded',timeout:12000});
 const button=page.locator('.menu5');
 const beforeNav=await page.locator('.v5nav nav').evaluate(el=>getComputedStyle(el).display);
 const buttonVisible=await button.isVisible();
 if(buttonVisible) await button.click();
 await page.waitForTimeout(120);
 const afterNav=await page.locator('.v5nav nav').evaluate(el=>getComputedStyle(el).display);
 report.targeted.innerPageMobileNav={buttonVisible,beforeNav,afterNav,pass:buttonVisible && beforeNav==='none' && afterNav!=='none'};
 if(!report.targeted.innerPageMobileNav.pass) report.failures.push({target:'innerPageMobileNav',...report.targeted.innerPageMobileNav});
 await context.close();
}

// Targeted regression: skip link remains off-screen until keyboard focus.
{
 const context=await browser.newContext({viewport:{width:390,height:844}});
 const checks=[];
 for(const path of ['professionals.html','employee-experience.html']){
   const page=await context.newPage();
   await page.goto(base+'/'+path,{waitUntil:'domcontentloaded',timeout:12000});
   const link=page.locator('.v6-skip');
   const before=await link.evaluate(el=>{const s=getComputedStyle(el),r=el.getBoundingClientRect();return {position:s.position,top:s.top,bottom:r.bottom,focused:document.activeElement===el}});
   await link.focus();
   await page.waitForTimeout(60);
   const after=await link.evaluate(el=>{const s=getComputedStyle(el),r=el.getBoundingClientRect();return {position:s.position,top:s.top,bottom:r.bottom,focused:document.activeElement===el}});
   checks.push({path,before,after});
   await page.close();
 }
 const pass=checks.every(x=>x.before.position==='fixed' && x.before.bottom<=0 && !x.before.focused && x.after.position==='fixed' && x.after.focused && x.after.bottom>0);
 report.targeted.skipLinkFocusBehavior={checks,pass};
 if(!pass) report.failures.push({target:'skipLinkFocusBehavior',checks});
 await context.close();
}

 // Targeted regression: compact mobile chrome must preserve production behavior.
{
 const context=await browser.newContext({viewport:{width:390,height:844}});
 const checks=[];
 for(const path of ['index.html','professionals.html']){
   const page=await context.newPage();
   await page.goto(base+'/'+path,{waitUntil:'domcontentloaded',timeout:12000});
   await page.waitForTimeout(150);
   const state=await page.evaluate(()=>{
     const nav=document.querySelector('.v5nav');
     const brand=nav?.querySelector('.brand');
     const auth=nav?.querySelector('.nav-auth');
     const heading=document.querySelector('h1');
     const visibleControls=[...nav?.querySelectorAll('button,select,a')||[]].filter(el=>el!==brand && getComputedStyle(el).display!=='none' && el.getBoundingClientRect().width>0);
     const brandBox=brand?.getBoundingClientRect()||null;
     const collisions=brandBox?visibleControls.filter(el=>{const r=el.getBoundingClientRect();return !(r.right<=brandBox.left||r.left>=brandBox.right||r.bottom<=brandBox.top||r.top>=brandBox.bottom)}).map(el=>el.className||el.tagName):[];
     const hs=heading?getComputedStyle(heading):null;
     return {
       authDisplay:auth?getComputedStyle(auth).display:null,
       collisions,
       headingOverflowWrap:hs?.overflowWrap||null,
       headingWordBreak:hs?.wordBreak||null
     };
   });
   checks.push({path,...state});
   await page.close();
 }
 const pass=checks.every(x=>x.authDisplay==='none' && x.collisions.length===0 && x.headingOverflowWrap!=='anywhere' && x.headingWordBreak!=='break-all');
 report.targeted.mobileChromeParity={checks,pass};
 if(!pass) report.failures.push({target:'mobileChromeParity',checks});
 await context.close();
}

 // Targeted regression: floating contact controls must not obstruct mobile hero CTAs.
{
 const context=await browser.newContext({viewport:{width:390,height:844}});
 const checks=[];
 for(const path of ['index.html','professionals.html']){
   const page=await context.newPage();
   await page.goto(base+'/'+path,{waitUntil:'domcontentloaded',timeout:12000});
   await page.waitForTimeout(180);
   const state=await page.evaluate(()=>{
     const ctas=[...document.querySelectorAll('.sx-hero .sx-actions a,.hero5>.actions a')].filter(el=>getComputedStyle(el).display!=='none');
     const floats=[...document.querySelectorAll('.floating')].filter(el=>getComputedStyle(el).display!=='none');
     const overlaps=[];
     for(const cta of ctas){
       const a=cta.getBoundingClientRect();
       for(const fl of floats){
         const b=fl.getBoundingClientRect();
         const overlap=!(a.right<=b.left||a.left>=b.right||a.bottom<=b.top||a.top>=b.bottom);
         if(overlap) overlaps.push({cta:cta.textContent.trim().slice(0,60),floating:fl.className});
       }
     }
     return {ctaCount:ctas.length,floatingCount:floats.length,overlaps};
   });
   checks.push({path,...state});
   await page.close();
 }
 const pass=checks.every(x=>x.ctaCount>0 && x.overlaps.length===0);
 report.targeted.mobileHeroCtaClearance={checks,pass};
 if(!pass) report.failures.push({target:'mobileHeroCtaClearance',checks});
 await context.close();
}

 // Targeted regression: testimonial carousel must not vertically jump the page.
{
 const context=await browser.newContext({viewport:{width:1440,height:1000}});
 const page=await context.newPage();
 await page.goto(base+'/index.html',{waitUntil:'domcontentloaded',timeout:12000});
 const section=page.locator('[data-testimonial-carousel]');
 await section.scrollIntoViewIfNeeded();
 await page.waitForTimeout(150);
 const y1=await page.evaluate(()=>window.scrollY);
 const next=page.locator('[data-carousel-next]');
 const visible=await next.count()?await next.isVisible():false;
 if(visible){
   await next.evaluate(el=>el.click());
   await page.waitForTimeout(450);
 }
 const y2=await page.evaluate(()=>window.scrollY);
 const controlsStatic=await page.locator('.sx-carousel-controls').getAttribute('data-static');
 report.targeted.testimonialVerticalJump={before:y1,after:y2,delta:Math.abs(y2-y1),controlVisible:visible,controlsStatic,pass:Math.abs(y2-y1)<=2 && (visible || controlsStatic==='true')};
 if(!report.targeted.testimonialVerticalJump.pass) report.failures.push({target:'testimonialVerticalJump',...report.targeted.testimonialVerticalJump});
 await context.close();
}

// Targeted regression: 1024 enterprise contact form stays inside viewport.
{
 const context=await browser.newContext({viewport:{width:1024,height:900}});
 const page=await context.newPage();
 await page.goto(base+'/enterprise.html',{waitUntil:'domcontentloaded',timeout:12000});
 const box=await page.locator('#conversation .form5').boundingBox();
 const doc=await page.evaluate(()=>({sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth}));
 report.targeted.enterpriseTabletForm={box,doc,pass:!!box && box.x>=-1 && box.x+box.width<=1025 && doc.sw<=doc.cw+2};
 if(!report.targeted.enterpriseTabletForm.pass) report.failures.push({target:'enterpriseTabletForm',...report.targeted.enterpriseTabletForm});
 await context.close();
}

// Targeted regression: hidden form control must not create overflow.
{
 const context=await browser.newContext({viewport:{width:390,height:844}});
 const page=await context.newPage();
 await page.goto(base+'/professional-coaching.html',{waitUntil:'domcontentloaded',timeout:12000});
 const doc=await page.evaluate(()=>({sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth}));
 const hidden=await page.locator('input.sr-only').count()?await page.locator('input.sr-only').first().evaluate(el=>{const s=getComputedStyle(el);return {width:s.width,height:s.height,position:s.position}}):null;
 report.targeted.coachingHiddenInput={doc,hidden,pass:doc.sw<=doc.cw+2 && (!hidden || (hidden.width==='1px'&&hidden.height==='1px'))};
 if(!report.targeted.coachingHiddenInput.pass) report.failures.push({target:'coachingHiddenInput',...report.targeted.coachingHiddenInput});
 await context.close();
}

// Targeted check: Individuals assessment card contrast primitives exist/render.
{
 const context=await browser.newContext({viewport:{width:1440,height:1000}});
 const page=await context.newPage();
 await page.goto(base+'/professionals.html',{waitUntil:'domcontentloaded',timeout:12000});
 const cards=page.locator('.assessment-catalogue-inline .assessment-card');
 const count=await cards.count();
 const sample=count?await cards.first().evaluate(el=>{
   const cs=getComputedStyle(el),h=el.querySelector('h3'),p=el.querySelector('p');
   return {background:cs.backgroundImage,backgroundColor:cs.backgroundColor,border:cs.borderColor,h3:h?getComputedStyle(h).color:null,p:p?getComputedStyle(p).color:null};
 }):null;
 report.targeted.individualAssessmentCards={count,sample,pass:count>=6 && !!sample && sample.h3!=='rgba(0, 0, 0, 0)'};
 if(!report.targeted.individualAssessmentCards.pass) report.failures.push({target:'individualAssessmentCards',...report.targeted.individualAssessmentCards});
 await context.close();
}


// Targeted regression: legacy/functional runner shells must not reference missing local assets.
{
 const runnerPages=['assessment-suite-v2-runner.html','enterprise-system-runner.html'];
 const viewports=[{name:'desktop',width:1440,height:1000},{name:'mobile',width:390,height:844}];
 const checks=[];
 for(const vp of viewports){
   const context=await browser.newContext({viewport:{width:vp.width,height:vp.height},javaScriptEnabled:false});
   for(const path of runnerPages){
     const page=await context.newPage();
     const badResponses=[];
     page.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400) badResponses.push({url:r.url(),status:r.status()})});
     let navError=null;
     try{await page.goto(base+'/'+path,{waitUntil:'networkidle',timeout:12000})}catch(e){navError=String(e)}
     const metrics=navError?null:await page.evaluate(()=>({sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth,title:document.title,bodyText:document.body?.innerText?.trim().length||0}));
     checks.push({path,viewport:vp.name,navError,badResponses,metrics});
     await page.close();
   }
   await context.close();
 }
 const pass=checks.every(x=>!x.navError && x.badResponses.length===0 && x.metrics && x.metrics.bodyText>100 && x.metrics.sw<=x.metrics.cw+2);
 report.targeted.runnerAssetIntegrity={checks,pass};
 if(!pass) report.failures.push({target:'runnerAssetIntegrity',checks});
}

await browser.close();
fs.writeFileSync('qa-output/qa-report.json',JSON.stringify(report,null,2));
console.log(JSON.stringify({failures:report.failures.length,targeted:report.targeted},null,2));
if(report.failures.length) process.exit(1);
