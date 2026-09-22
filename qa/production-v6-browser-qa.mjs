import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
import path from 'node:path';

const base='http://127.0.0.1:4173';
const pages=[
  ['home','/'],
  ['organizations','/enterprise.html'],
  ['individuals','/professionals.html'],
  ['solutions','/solutions.html'],
  ['assessment-intelligence','/assessment-intelligence.html'],
  ['manager-development','/manager-development.html'],
  ['prism360','/prism360.html'],
  ['signal','/employee-experience.html'],
  ['talent-solutions','/talent-solutions.html'],
  ['coaching','/professional-coaching.html'],
  ['compliance','/compliance-learning.html'],
  ['pricing','/pricing.html'],
  ['evidence','/science.html'],
  ['trust','/trust.html'],
  ['privacy','/privacy.html'],
  ['terms','/terms.html'],
  ['refunds','/refund-cancellation.html'],
  ['cookies','/cookie-policy.html']
];
const viewports=[
  ['desktop-xl',1920,1080],
  ['desktop',1440,900],
  ['tablet',1024,768],
  ['mobile',390,844]
];
const screenshotPages=new Set(['home','organizations','individuals','solutions','evidence','trust','signal','manager-development','coaching']);
const outDir='qa-output';
fs.mkdirSync(outDir,{recursive:true});
const report={generatedAt:new Date().toISOString(),base,pages:[],summary:{cases:0,failures:0,warnings:0,criticalA11y:0,seriousA11y:0}};
const browser=await chromium.launch({headless:true});

function fail(e,msg){e.failures.push(msg);report.summary.failures++}
function warn(e,msg){e.warnings.push(msg);report.summary.warnings++}

async function initialGeometry(page){
  return await page.evaluate(()=>{
    const nav=document.querySelector('.v5nav');
    const hero=document.querySelector('main h1');
    const skip=document.querySelector('.v6-skip');
    const n=nav?.getBoundingClientRect(),h=hero?.getBoundingClientRect(),s=skip?.getBoundingClientRect();
    const navStyle=nav?getComputedStyle(nav):null;
    return {
      scrollY:window.scrollY,
      nav: n ? {top:n.top,bottom:n.bottom,height:n.height,display:navStyle?.display,position:navStyle?.position}:null,
      hero: h ? {top:h.top,bottom:h.bottom,height:h.height}:null,
      overlap: n&&h&&navStyle?.display!=='none' ? Math.max(0,n.bottom-h.top):0,
      skip:s?{top:s.top,bottom:s.bottom,focused:document.activeElement===skip}:null
    };
  });
}

async function primeScroll(page){
  await page.evaluate(async()=>{
    const max=document.documentElement.scrollHeight-window.innerHeight;
    const step=Math.max(420,Math.floor(window.innerHeight*.82));
    for(let y=0;y<=max;y+=step){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,45));}
    window.scrollTo(0,0);
  });
  await page.waitForTimeout(220);
}

for(const [pageName,url] of pages){
  for(const [vpName,width,height] of viewports){
    const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1});
    const page=await context.newPage();
    const entry={page:pageName,url,viewport:vpName,width,height,consoleErrors:[],pageErrors:[],requestFailures:[],failures:[],warnings:[],checks:{}};
    report.summary.cases++;
    page.on('console',m=>{if(m.type()==='error')entry.consoleErrors.push(m.text())});
    page.on('pageerror',e=>entry.pageErrors.push(String(e)));
    page.on('requestfailed',r=>{if(r.url().startsWith(base))entry.requestFailures.push({url:r.url(),error:r.failure()?.errorText||'failed'})});
    try{
      const response=await page.goto(base+url,{waitUntil:'networkidle',timeout:30000});
      entry.checks.httpStatus=response?.status()??null;
      if(!response||response.status()>=400)fail(entry,'HTTP load failure');
      await page.waitForTimeout(300);

      entry.checks.initial=await initialGeometry(page);
      entry.checks.actualUrl=page.url();
      const intentionalAssessmentRedirect=pageName==='assessment-intelligence' && /\/(professionals|enterprise)\.html#/.test(new URL(entry.checks.actualUrl).pathname+new URL(entry.checks.actualUrl).hash);
      entry.checks.intentionalAssessmentRedirect=intentionalAssessmentRedirect;
      if(!intentionalAssessmentRedirect&&Math.abs(entry.checks.initial.scrollY)>1)fail(entry,'Page did not open at scrollY=0');
      if(entry.checks.initial.skip?.bottom>1&&!entry.checks.initial.skip.focused)fail(entry,'Skip link visible without focus');
      if(!intentionalAssessmentRedirect&&entry.checks.initial.overlap>4)fail(entry,'Navigation overlaps initial H1 by '+Math.round(entry.checks.initial.overlap)+'px');

      const metrics=await page.evaluate(()=>({
        title:document.title,
        bodyTextLength:document.body.innerText.trim().length,
        h1Count:document.querySelectorAll('h1').length,
        scrollWidth:document.documentElement.scrollWidth,
        clientWidth:document.documentElement.clientWidth,
        scrollHeight:document.documentElement.scrollHeight,
        errorOverlay:!!document.querySelector('[data-nextjs-dialog],.vite-error-overlay,#webpack-dev-server-client-overlay'),
        skipLink:!!document.querySelector('a.v6-skip[href="#main"]'),
        main:!!document.querySelector('main#main'),
        canonical:!!document.querySelector('link[rel="canonical"]'),
        description:!!document.querySelector('meta[name="description"]'),
        ogTitle:!!document.querySelector('meta[property="og:title"]')
      }));
      entry.metrics=metrics;
      if(metrics.bodyTextLength<150)fail(entry,'Page content unexpectedly sparse');
      if(metrics.h1Count!==1)fail(entry,'Expected exactly one H1');
      if(metrics.scrollWidth-metrics.clientWidth>3)fail(entry,'Document horizontal overflow '+(metrics.scrollWidth-metrics.clientWidth)+'px');
      if(metrics.errorOverlay)fail(entry,'Error overlay detected');
      if(!metrics.main)warn(entry,'main#main landmark missing');
      if(!metrics.skipLink)warn(entry,'Skip link missing');
      if(!metrics.canonical)warn(entry,'Canonical missing');
      if(!metrics.description)warn(entry,'Meta description missing');
      if(!metrics.ogTitle)warn(entry,'OpenGraph title missing');

      await page.screenshot({path:path.join(outDir,`top--${pageName}--${vpName}.png`),fullPage:false,animations:'disabled'});

      // Automated accessibility: critical = failure; serious = warning for manual review.
      const axe=await new AxeBuilder({page}).analyze();
      const critical=axe.violations.filter(v=>v.impact==='critical');
      const serious=axe.violations.filter(v=>v.impact==='serious');
      entry.checks.a11y={
        critical:critical.map(v=>({id:v.id,help:v.help,nodes:v.nodes.length,evidence:v.nodes.slice(0,10).map(n=>({target:n.target,html:n.html,failureSummary:n.failureSummary,any:n.any?.map(a=>a.data).filter(Boolean)}))})),
        serious:serious.map(v=>({id:v.id,help:v.help,nodes:v.nodes.length,evidence:v.nodes.slice(0,10).map(n=>({target:n.target,html:n.html,failureSummary:n.failureSummary,any:n.any?.map(a=>a.data).filter(Boolean)}))}))
      };
      report.summary.criticalA11y+=critical.length; report.summary.seriousA11y+=serious.length;
      if(critical.length)fail(entry,'Critical accessibility violations: '+critical.map(v=>v.id).join(', '));
      if(serious.length)warn(entry,'Serious accessibility violations: '+serious.map(v=>v.id).join(', '));

      await primeScroll(page);

      const overflowers=await page.evaluate(()=>{
        const insideScroller=(el)=>{
          let p=el.parentElement;
          while(p&&p!==document.body){
            const ps=getComputedStyle(p);
            if((ps.overflowX==='auto'||ps.overflowX==='scroll')&&p.scrollWidth>p.clientWidth+2)return true;
            p=p.parentElement;
          }
          return false;
        };
        return Array.from(document.querySelectorAll('body *')).filter(el=>{
          const r=el.getBoundingClientRect(),s=getComputedStyle(el);
          if(s.position==='fixed'||s.position==='absolute'||s.display==='none'||s.visibility==='hidden'||r.width<=0||insideScroller(el))return false;
          return r.right>window.innerWidth+4||r.left<-4;
        }).slice(0,12).map(el=>({tag:el.tagName,id:el.id,class:String(el.className).slice(0,120),left:Math.round(el.getBoundingClientRect().left),right:Math.round(el.getBoundingClientRect().right),width:Math.round(el.getBoundingClientRect().width)}));
      });
      entry.checks.overflowers=overflowers;
      if(overflowers.length)fail(entry,'Visible element horizontal overflow: '+overflowers.length);

      if(pageName==='home'){
        const revealLoc=page.locator('.sx-reveal');
        const revealTotal=await revealLoc.count();
        for(let ri=0;ri<revealTotal;ri++){await revealLoc.nth(ri).scrollIntoViewIfNeeded();await page.waitForTimeout(110)}
        await page.waitForTimeout(450);
        const revealVisible=await page.locator('.sx-reveal.visible').count();
        entry.checks.reveals={total:revealTotal,visible:revealVisible};
        if(revealVisible!==revealTotal)fail(entry,`Reveal state incomplete ${revealVisible}/${revealTotal}`);
        const cards=page.locator('.sx-testimonial-card');
        entry.checks.testimonialCount=await cards.count();
        if(entry.checks.testimonialCount<3)fail(entry,'Fewer than 3 testimonials');
        const carousel=page.locator('[data-testimonial-carousel]');
        if(await carousel.count()){
          await carousel.scrollIntoViewIfNeeded(); await page.waitForTimeout(120);
          const y1=await page.evaluate(()=>window.scrollY);
          const next=page.locator('[data-carousel-next]');
          if(await next.count()){
            await next.evaluate(el=>el.click()); await page.waitForTimeout(700);
            const y2=await page.evaluate(()=>window.scrollY);
            entry.checks.carouselScrollDelta=Math.abs(y2-y1);
            if(entry.checks.carouselScrollDelta>8)fail(entry,'Carousel changed vertical page scroll by '+entry.checks.carouselScrollDelta+'px');
          }
        }
        if(width<=1100){
          const panel=page.locator('#home-menu-panel'),toggle=page.locator('.home-menu-toggle');
          entry.checks.mobileMenuInitiallyVisible=await panel.isVisible();
          if(entry.checks.mobileMenuInitiallyVisible)fail(entry,'Mobile menu visible before toggle');
          await toggle.evaluate(el=>el.click());await page.waitForTimeout(100);
          entry.checks.mobileMenuVisibleAfterToggle=await panel.isVisible();
          if(!entry.checks.mobileMenuVisibleAfterToggle)fail(entry,'Mobile menu did not open');
          await toggle.evaluate(el=>el.click());
        }
      }

      if(pageName==='organizations'){
        const form=page.locator('#conversation .form5');
        if(!(await form.count()))fail(entry,'Enterprise contact form missing');
        else{
          await form.scrollIntoViewIfNeeded();await page.waitForTimeout(100);
          const b=await form.boundingBox();entry.checks.contactFormRect=b;
          if(b&&(b.x< -2||b.x+b.width>width+2))fail(entry,'Enterprise contact form exceeds viewport');
          const controls=await form.locator('input,select,textarea,button').count();
          entry.checks.contactControlCount=controls;
          if(controls<8)warn(entry,'Enterprise form control count lower than expected');
        }
      }

      if(pageName==='individuals'){
        entry.checks.finderBeforeCatalogue=await page.evaluate(()=>{
          const f=document.querySelector('.finder'),c=document.querySelector('.assessment-catalogue-inline');
          return !!(f&&c&&(f.compareDocumentPosition(c)&Node.DOCUMENT_POSITION_FOLLOWING));
        });
        if(!entry.checks.finderBeforeCatalogue)fail(entry,'Finder is not before catalogue');
        const cards=page.locator('.assessment-catalogue-inline .assessment-card');
        entry.checks.assessmentCardCount=await cards.count();
        if(entry.checks.assessmentCardCount<6)fail(entry,'Assessment catalogue unexpectedly small');
      }

      if(pageName==='evidence'){
        const ladder=page.locator('.v6-evidence-ladder');
        if(await ladder.count()){const b=await ladder.boundingBox();entry.checks.evidenceLadderRect=b;if(b&&(b.x< -2||b.x+b.width>width+2))fail(entry,'Evidence ladder exceeds viewport')}
      }

      if(pageName==='signal'){
        const shell=page.locator('.signal-exec-shell');
        if(!(await shell.count()))fail(entry,'Signal Executive showcase missing');
        else{await shell.scrollIntoViewIfNeeded();const b=await shell.boundingBox();entry.checks.signalShellRect=b;if(b&&(b.x< -2||b.x+b.width>width+2))fail(entry,'Signal Executive exceeds viewport')}
      }

      if(pageName==='manager-development'){
        entry.checks.hasDevelop=await page.getByText('Develop',{exact:true}).count()>0;
        if(!entry.checks.hasDevelop)fail(entry,'Develop stage missing');
      }

      if(pageName==='trust'){
        const a=page.locator('a[href="/enterprise.html#conversation"]').filter({hasText:/Contact us/i});
        entry.checks.internalContactCount=await a.count();
        if(!entry.checks.internalContactCount)fail(entry,'Trust Contact us does not route internally');
        if(await page.locator('a[href^="mailto:contact@syntropix.in"]').count())fail(entry,'Trust still contains mailto contact CTA');
      }

      await page.evaluate(()=>window.scrollTo(0,0)); await page.waitForTimeout(150);
      if(screenshotPages.has(pageName) && (vpName==='desktop'||vpName==='tablet'||vpName==='mobile')){
        await page.screenshot({path:path.join(outDir,`full--${pageName}--${vpName}.png`),fullPage:true,animations:'disabled'});
      }
      if(entry.consoleErrors.length)warn(entry,'Console errors '+entry.consoleErrors.length+': '+entry.consoleErrors.slice(0,2).join(' | '));
      if(entry.pageErrors.length)fail(entry,'Page errors '+entry.pageErrors.length);
      if(entry.requestFailures.length)fail(entry,'Local request failures '+entry.requestFailures.length);
    }catch(err){fail(entry,'Exception: '+String(err?.stack||err))}
    report.pages.push(entry);
    await context.close();
  }
}
await browser.close();
fs.writeFileSync(path.join(outDir,'report.json'),JSON.stringify(report,null,2));
fs.writeFileSync(path.join(outDir,'summary.txt'),[
  `Cases: ${report.summary.cases}`,
  `Failures: ${report.summary.failures}`,
  `Warnings: ${report.summary.warnings}`,
  `Critical accessibility groups: ${report.summary.criticalA11y}`,
  `Serious accessibility groups: ${report.summary.seriousA11y}`
].join('\n')+'\n');
console.log(JSON.stringify(report.summary));
if(report.summary.failures>0)process.exitCode=1;
