import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const base='http://127.0.0.1:4173';
const pages=[
  ['home','/'],
  ['organizations','/enterprise.html'],
  ['individuals','/professionals.html'],
  ['solutions','/solutions.html'],
  ['evidence','/science.html'],
  ['trust','/trust.html'],
  ['signal','/employee-experience.html'],
  ['manager-development','/manager-development.html'],
  ['coaching','/professional-coaching.html']
];
const viewports=[
  ['desktop-xl',1920,1080],
  ['desktop',1440,900],
  ['tablet',1024,768],
  ['mobile',390,844]
];
const outDir='browser-qa-artifacts';
fs.mkdirSync(outDir,{recursive:true});
const report={generatedAt:new Date().toISOString(),base,pages:[],summary:{cases:0,failures:0,warnings:0}};
const browser=await chromium.launch({headless:true});

function recordFailure(entry,msg){entry.failures.push(msg);report.summary.failures++;}
function recordWarning(entry,msg){entry.warnings.push(msg);report.summary.warnings++;}

for(const [pageName,url] of pages){
  for(const [vpName,width,height] of viewports){
    const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1});
    const page=await context.newPage();
    const entry={page:pageName,url,viewport:vpName,width,height,consoleErrors:[],pageErrors:[],requestFailures:[],failures:[],warnings:[],checks:{}};
    report.summary.cases++;
    page.on('console',m=>{ if(m.type()==='error') entry.consoleErrors.push(m.text()); });
    page.on('pageerror',e=>entry.pageErrors.push(String(e)));
    page.on('requestfailed',r=>{
      const u=r.url();
      if(u.startsWith(base)) entry.requestFailures.push({url:u,error:r.failure()?.errorText||'failed'});
    });
    try{
      const response=await page.goto(base+url,{waitUntil:'networkidle',timeout:30000});
      entry.checks.httpStatus=response?.status()??null;
      if(!response||response.status()>=400) recordFailure(entry,'Page load HTTP failure');
      await page.waitForTimeout(350);
      // Measure header/hero geometry only at the real top-of-page state.
      await page.evaluate(()=>window.scrollTo(0,0));
      await page.waitForTimeout(80);
      // Prime real scroll-driven/lazy content before capture.
      if(pageName==='home'){
        const revealLocators=page.locator('.sx-reveal');
        const revealCount=await revealLocators.count();
        for(let ri=0;ri<revealCount;ri++){
          await revealLocators.nth(ri).scrollIntoViewIfNeeded();
          await page.waitForTimeout(140);
        }
        await page.evaluate(()=>window.scrollTo(0,0));
        await page.waitForTimeout(250);
      }else{
        await page.evaluate(async()=>{
          const step=Math.max(320,Math.floor(window.innerHeight*.72));
          for(let y=0;y<document.documentElement.scrollHeight;y+=step){
            window.scrollTo(0,y);
            await new Promise(r=>setTimeout(r,60));
          }
          window.scrollTo(0,0);
          await new Promise(r=>setTimeout(r,180));
        });
      }
      const metrics=await page.evaluate(()=>({
        title:document.title,
        bodyTextLength:document.body.innerText.trim().length,
        h1Count:document.querySelectorAll('h1').length,
        scrollWidth:document.documentElement.scrollWidth,
        clientWidth:document.documentElement.clientWidth,
        scrollHeight:document.documentElement.scrollHeight,
        clientHeight:document.documentElement.clientHeight,
        errorOverlay:!!document.querySelector('[data-nextjs-dialog], .vite-error-overlay, #webpack-dev-server-client-overlay'),
        skipLink:!!document.querySelector('a.v6-skip[href="#main"]'),
        main:!!document.querySelector('main#main')
      }));
      entry.metrics=metrics;
      entry.checks.skipState=await page.evaluate(()=>{
        const el=document.querySelector('.v6-skip');
        if(!el)return null;
        const r=el.getBoundingClientRect(),s=getComputedStyle(el);
        return {top:r.top,bottom:r.bottom,display:s.display,visibility:s.visibility,opacity:s.opacity,focused:document.activeElement===el};
      });
      if(entry.checks.skipState && !entry.checks.skipState.focused && entry.checks.skipState.bottom>0) recordFailure(entry,'Skip link visible without focus');
      entry.checks.navHeroOverlap=await page.evaluate(()=>{
        const nav=document.querySelector('.v5nav'),hero=document.querySelector('main section:first-child h1, main h1');
        if(!nav||!hero)return null;
        const n=nav.getBoundingClientRect(),h=hero.getBoundingClientRect();
        return {navBottom:n.bottom,heroTop:h.top,overlap:Math.max(0,n.bottom-h.top)};
      });
      if(entry.checks.navHeroOverlap?.overlap>2) recordFailure(entry,`Sticky nav overlaps hero by ${entry.checks.navHeroOverlap.overlap}px`);
      if(metrics.bodyTextLength<200) recordFailure(entry,'Page content unexpectedly sparse');
      if(metrics.h1Count!==1) recordFailure(entry,'Expected exactly one H1');
      if(metrics.scrollWidth-metrics.clientWidth>2) recordFailure(entry,`Horizontal overflow: ${metrics.scrollWidth-metrics.clientWidth}px`);
      if(metrics.errorOverlay) recordFailure(entry,'Framework error overlay detected');
      if(!metrics.skipLink) recordWarning(entry,'Skip link missing');
      if(!metrics.main) recordWarning(entry,'main#main landmark missing');

      entry.checks.unloadedImages=await page.evaluate(()=>Array.from(document.images)
        .filter(img=>!img.complete || img.naturalWidth===0)
        .map(img=>img.getAttribute('src')).filter(Boolean));
      if(entry.checks.unloadedImages.length) recordFailure(entry,`Unloaded images: ${entry.checks.unloadedImages.length}`);

      entry.checks.overflowers=await page.evaluate(()=>Array.from(document.querySelectorAll('body *')).filter(el=>{
        const r=el.getBoundingClientRect(),s=getComputedStyle(el);
        if(s.position==='fixed' || s.position==='sticky' || s.display==='none' || s.visibility==='hidden') return false;
        return r.width>0 && (r.right>window.innerWidth+3 || r.left<-3);
      }).slice(0,12).map(el=>({tag:el.tagName,class:String(el.className||''),id:el.id,right:Math.round(el.getBoundingClientRect().right),left:Math.round(el.getBoundingClientRect().left)})));
      if(entry.checks.overflowers.length) recordFailure(entry,'Element-level horizontal overflow detected');

      if(width<=1100 && pageName!=='home'){
        const toggle=page.locator('.menu5');
        if(await toggle.count()){
          entry.checks.sharedMenuToggleVisible=await toggle.isVisible();
          if(!entry.checks.sharedMenuToggleVisible) recordFailure(entry,'Shared mobile menu toggle is not visible');
          await toggle.click({force:true});
          await page.waitForTimeout(100);
          entry.checks.sharedMenuExpanded=await toggle.getAttribute('aria-expanded');
        }
      }

      if(pageName==='home'){
        entry.checks.revealTotal=await page.locator('.sx-reveal').count();
        entry.checks.revealVisible=await page.locator('.sx-reveal.visible').count();
        if(entry.checks.revealVisible!==entry.checks.revealTotal) recordFailure(entry,`Reveal state incomplete: ${entry.checks.revealVisible}/${entry.checks.revealTotal}`);
        entry.checks.testimonialCount=await page.locator('.sx-testimonial-card').count();
        if(entry.checks.testimonialCount<3) recordFailure(entry,'Expected at least 3 testimonials');
        const carousel=page.locator('[data-testimonial-carousel]');
        if(await carousel.count()){
          await carousel.scrollIntoViewIfNeeded();
          await page.waitForTimeout(200);
          const y1=await page.evaluate(()=>window.scrollY);
          const next=page.locator('[data-carousel-next]');
          if(await next.isVisible()){
            await next.evaluate(el=>el.click());
            await page.waitForTimeout(900);
            const y2=await page.evaluate(()=>window.scrollY);
            entry.checks.carouselScrollDelta=Math.abs(y2-y1);
            if(Math.abs(y2-y1)>8) recordFailure(entry,`Carousel changed page scroll by ${Math.abs(y2-y1)}px`);
          } else entry.checks.carouselStatic=true;
        }
        if(width<=1100){
          const panel=page.locator('#home-menu-panel');
          const toggle=page.locator('.home-menu-toggle');
          entry.checks.mobileMenuInitiallyVisible=await panel.isVisible();
          if(entry.checks.mobileMenuInitiallyVisible) recordFailure(entry,'Mobile menu panel visible before toggle');
          await toggle.evaluate(el=>el.click());
          await page.waitForTimeout(100);
          entry.checks.mobileMenuVisibleAfterToggle=await panel.isVisible();
          if(!entry.checks.mobileMenuVisibleAfterToggle) recordFailure(entry,'Mobile menu failed to open');
        }
      }

      if(pageName==='organizations'){
        const section=page.locator('#conversation');
        if(await section.count()){
          await section.scrollIntoViewIfNeeded();
          const rect=await section.boundingBox();
          entry.checks.contactRect=rect;
          const formRect=await page.locator('#conversation .form5').boundingBox();
          entry.checks.contactFormRect=formRect;
          if(formRect && formRect.x+formRect.width>width+2) recordFailure(entry,'Contact form exceeds viewport');
          entry.checks.visibleFormControls=await page.locator('#conversation input, #conversation select, #conversation textarea, #conversation button[type="submit"]').count();
          if(entry.checks.visibleFormControls<6) recordFailure(entry,'Contact form controls unexpectedly incomplete');
        } else recordFailure(entry,'Contact section missing');
      }

      if(pageName==='trust'){
        const cta=page.locator('a[href="/enterprise.html#conversation"]');
        entry.checks.internalContactCta=await cta.count();
        if(!entry.checks.internalContactCta) recordFailure(entry,'Trust contact CTA does not route internally');
        entry.checks.mailtoContact=await page.locator('a[href^="mailto:contact@syntropix.in"]').count();
        if(entry.checks.mailtoContact) recordFailure(entry,'Trust contact CTA still uses mailto');
      }

      if(pageName==='individuals'){
        entry.checks.finderBeforeCatalogue=await page.evaluate(()=>{
          const f=document.querySelector('.finder'),c=document.querySelector('.assessment-catalogue-inline');
          return !!(f&&c&&(f.compareDocumentPosition(c)&Node.DOCUMENT_POSITION_FOLLOWING));
        });
        if(!entry.checks.finderBeforeCatalogue) recordFailure(entry,'Finder is not before assessment catalogue');
        const cards=page.locator('.assessment-catalogue-inline .assessment-card');
        entry.checks.assessmentCardCount=await cards.count();
        if(entry.checks.assessmentCardCount<6) recordFailure(entry,'Assessment catalogue unexpectedly small');
        entry.checks.sampleCardStyles=await cards.evaluateAll(els=>els.slice(0,4).map(el=>{
          const h=el.querySelector('h3'),p=el.querySelector('p');
          const cs=getComputedStyle(el),hs=h?getComputedStyle(h):null,ps=p?getComputedStyle(p):null;
          return {background:cs.backgroundImage||cs.backgroundColor,border:cs.borderTopColor,h3Color:hs?.color,pColor:ps?.color};
        }));
      }

      if(pageName==='evidence'){
        const ladder=page.locator('.v6-evidence-ladder');
        if(await ladder.count()){
          const box=await ladder.boundingBox();
          entry.checks.evidenceLadderRect=box;
          if(box && box.x+box.width>width+2) recordFailure(entry,'Evidence ladder exceeds viewport');
        }
      }

      if(pageName==='signal'){
        const shell=page.locator('.signal-exec-shell');
        if(await shell.count()){
          await shell.scrollIntoViewIfNeeded();
          const box=await shell.boundingBox();
          entry.checks.signalShellRect=box;
          if(box && box.x+box.width>width+2) recordFailure(entry,'Signal Executive exceeds viewport');
        } else recordFailure(entry,'Signal Executive showcase missing');
      }

      if(pageName==='manager-development'){
        entry.checks.hasDevelop=await page.getByText('Develop',{exact:true}).count()>0;
        if(!entry.checks.hasDevelop) recordFailure(entry,'Develop stage missing');
      }

      if(entry.consoleErrors.length) recordWarning(entry,`Console errors: ${entry.consoleErrors.length}`);
      if(entry.pageErrors.length) recordFailure(entry,`Page errors: ${entry.pageErrors.length}`);
      if(entry.requestFailures.length) recordFailure(entry,`Local request failures: ${entry.requestFailures.length}`);

      await page.evaluate(()=>window.scrollTo(0,0));
      await page.waitForTimeout(120);
      const file=`${pageName}--${vpName}.png`;
      await page.screenshot({path:path.join(outDir,file),fullPage:true,animations:'disabled'});
      entry.screenshot=file;
    }catch(e){
      recordFailure(entry,'Exception: '+String(e?.stack||e));
    }
    report.pages.push(entry);
    await context.close();
  }
}
await browser.close();
fs.writeFileSync(path.join(outDir,'report.json'),JSON.stringify(report,null,2));
const summaryLines=[
  `Cases: ${report.summary.cases}`,
  `Failures: ${report.summary.failures}`,
  `Warnings: ${report.summary.warnings}`
];
fs.writeFileSync(path.join(outDir,'summary.txt'),summaryLines.join('\n')+'\n');
console.log(JSON.stringify(report.summary));
if(report.summary.failures>0) process.exitCode=1;
