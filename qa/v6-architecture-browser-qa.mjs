import { chromium } from 'playwright';
import fs from 'node:fs';

const base='http://127.0.0.1:4173';
const pages=[
  'index.html','enterprise.html','professionals.html','solutions.html',
  'assessment-intelligence.html','manager-development.html','prism360.html',
  'employee-experience.html','talent-solutions.html','professional-coaching.html',
  'compliance-learning.html','pricing.html','science.html','trust.html',
  'company.html','evidence-in-practice.html','technical-notes.html','trust-center.html',
  'privacy.html','terms.html','refund-cancellation.html','cookie-policy.html'
];
const critical=new Set([
  'index.html','enterprise.html','professionals.html','solutions.html',
  'employee-experience.html','professional-coaching.html','pricing.html',
  'science.html','trust.html','company.html','evidence-in-practice.html','technical-notes.html','trust-center.html'
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

// Targeted regression: canonical mobile navigation must be consistent and stay inside the viewport.
{
 const context=await browser.newContext({viewport:{width:390,height:844}});
 const checks=[];
 for(const path of ['index.html','enterprise.html','professionals.html']){
   const page=await context.newPage();
   await page.goto(base+'/'+path,{waitUntil:'domcontentloaded',timeout:12000});
   await page.waitForTimeout(120);
   const button=page.locator('.menu5');
   const nav=page.locator('.v5nav nav');
   const beforeNav=await nav.evaluate(el=>getComputedStyle(el).display);
   const buttonVisible=await button.isVisible();
   const label=await button.getAttribute('aria-label');
   if(buttonVisible) await button.click();
   await page.waitForTimeout(120);
   const afterNav=await nav.evaluate(el=>getComputedStyle(el).display);
   const box=await nav.boundingBox();
   const viewportPass=!!box && box.x>=-1 && box.x+box.width<=391;
   const iconState=await button.evaluate(el=>{
     const icon=el.querySelector('.sx-menu-icon'),mid=icon?.querySelector('i');
     const before=icon?getComputedStyle(icon,'::before'):null,after=icon?getComputedStyle(icon,'::after'):null,buttonStyle=getComputedStyle(el);
     return {borderWidth:buttonStyle.borderTopWidth,borderStyle:buttonStyle.borderTopStyle,midOpacity:mid?getComputedStyle(mid).opacity:null,beforeTransform:before?.transform||null,afterTransform:after?.transform||null};
   });
   checks.push({path,buttonVisible,label,beforeNav,afterNav,box,viewportPass,iconState});
   await page.close();
 }
 const pass=checks.every(x=>x.buttonVisible && x.label==='Open navigation' && x.beforeNav==='none' && x.afterNav!=='none' && x.viewportPass && x.iconState.borderWidth==='0px' && x.iconState.midOpacity==='1' && (x.iconState.beforeTransform==='none'||x.iconState.beforeTransform==='matrix(1, 0, 0, 1, 0, 0)') && (x.iconState.afterTransform==='none'||x.iconState.afterTransform==='matrix(1, 0, 0, 1, 0, 0)'));
 report.targeted.canonicalMobileNav={checks,pass};
 if(!pass) report.failures.push({target:'canonicalMobileNav',checks});
 await context.close();
}

// Targeted regression: personal direct contact details are not exposed in enterprise page/footer.
{
 const context=await browser.newContext({viewport:{width:1440,height:1000}});
 const page=await context.newPage();
 await page.goto(base+'/enterprise.html',{waitUntil:'domcontentloaded',timeout:12000});
 await page.waitForTimeout(120);
 const phoneLinks=await page.locator('a[href="tel:+918826706057"]').count();
 const emailLinks=await page.locator('a[href="mailto:contact@syntropix.in"]').count();
 const directCard=await page.locator('.enterprise-contact-direct').count();
 const pass=phoneLinks===0&&emailLinks===0&&directCard===0;
 report.targeted.enterpriseDirectContactRemoved={phoneLinks,emailLinks,directCard,pass};
 if(!pass) report.failures.push({target:'enterpriseDirectContactRemoved',phoneLinks,emailLinks,directCard});
 await context.close();
}

// Targeted regression: Concierge relay note remains supporting microcopy, not body-sized text.
{
 const context=await browser.newContext({viewport:{width:390,height:844}});
 const page=await context.newPage();
 const token='33333333-3333-4333-8333-333333333333';
 await page.route('https://syntropix-backend.onrender.com/api/chat/sessions',async route=>route.fulfill({status:201,contentType:'application/json',body:JSON.stringify({status:'success',session:token,transport:'command'})}));
 await page.route(new RegExp('https://syntropix-backend\\.onrender\\.com/api/chat/sessions/'+token+'/messages'),async route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({status:'success',session:{status:'open',visitorLabel:'Visitor TEST'},messages:[]})}));
 await page.goto(base+'/enterprise.html',{waitUntil:'domcontentloaded',timeout:12000});
 await page.locator('[data-chat]').first().click();
 await page.waitForTimeout(120);
 const state=await page.locator('.chat-note').evaluate(el=>{const s=getComputedStyle(el),r=el.getBoundingClientRect();return {fontSize:parseFloat(s.fontSize),lineHeight:s.lineHeight,textAlign:s.textAlign,left:r.left,width:r.width}});
 const pass=state.fontSize<=10&&state.textAlign==='left';
 report.targeted.conciergeMicrocopy={...state,pass};
 if(!pass) report.failures.push({target:'conciergeMicrocopy',...state});
 await context.close();
}

// Targeted regression: Concierge history restores after reload and contact widgets use Burnt Terracotta.
{
 const context=await browser.newContext({viewport:{width:1440,height:1000}});
 const page=await context.newPage();
 const token='44444444-4444-4444-8444-444444444444';
 await page.route('https://syntropix-backend.onrender.com/api/chat/sessions',async route=>route.fulfill({status:201,contentType:'application/json',body:JSON.stringify({status:'success',session:token,transport:'command'})}));
 await page.route(new RegExp('https://syntropix-backend\\.onrender\\.com/api/chat/sessions/'+token+'/messages'),async route=>{
   if(route.request().method()==='POST')return route.fulfill({status:201,contentType:'application/json',body:JSON.stringify({status:'success',delivered:true,transport:'command',messageId:'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'})});
   return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({status:'success',session:{status:'open',visitorLabel:'Visitor QA'},messages:[{id:'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',direction:'visitor',body:'Earlier visitor message',delivery_status:'command'},{id:'cccccccc-cccc-4ccc-8ccc-cccccccccccc',direction:'operator',body:'Earlier Syntropix reply',delivery_status:'command'}]})});
 });
 await page.goto(base+'/enterprise.html',{waitUntil:'domcontentloaded',timeout:12000});
 await page.locator('[data-chat]').first().click();
 await page.waitForTimeout(180);
 const history={visitor:await page.getByText('Earlier visitor message',{exact:true}).count(),operator:await page.getByText('Earlier Syntropix reply',{exact:true}).count()};
 const chatColors=await page.evaluate(()=>{const css=e=>e?getComputedStyle(e):null;return {head:css(document.querySelector('.chat-head b'))?.color,send:css(document.querySelector('.chat-compose button'))?.backgroundColor,wa:css(document.querySelector('.chat-wa-link'))?.color,chatTab:css(document.querySelector('.chat5'))?.backgroundColor,callTab:css(document.querySelector('.call5'))?.backgroundColor}});
 await page.locator('[data-call]').first().click();
 await page.waitForTimeout(100);
 const callColors=await page.evaluate(()=>{const css=e=>e?getComputedStyle(e):null;return {kicker:css(document.querySelector('.callpanel .kicker'))?.color,button:css(document.querySelector('.callpanel .btn.primary'))?.backgroundColor}});
 const champagne='rgb(214, 184, 120)',emerald='rgb(15, 138, 95)',offwhite='rgb(244, 242, 236)';
 const pass=history.visitor===1&&history.operator===1&&chatColors.head===offwhite&&chatColors.send===champagne&&chatColors.wa===champagne&&chatColors.chatTab===emerald&&chatColors.callTab===emerald&&callColors.kicker===champagne;
 report.targeted.conciergeHistoryAndApprovedPalette={history,chatColors,callColors,pass};
 if(!pass)report.failures.push({target:'conciergeHistoryAndApprovedPalette',history,chatColors,callColors});
 await context.close();
}

// Targeted regression: desktop product dropdown opens on hover and retracts when pointer leaves.
{
 const context=await browser.newContext({viewport:{width:1440,height:1000}});
 const page=await context.newPage();
 await page.goto(base+'/index.html',{waitUntil:'domcontentloaded',timeout:12000});
 const group=page.locator('.nav-products');
 const menu=page.locator('.nav-products-menu');
 const before=await menu.evaluate(el=>getComputedStyle(el).display);
 await group.hover();
 await page.waitForTimeout(120);
 const during=await menu.evaluate(el=>getComputedStyle(el).display);
 await page.locator('main').hover({position:{x:10,y:10}});
 await page.waitForTimeout(140);
 const after=await menu.evaluate(el=>getComputedStyle(el).display);
 const links=await menu.locator('.nav-product-link').count();
 const trigger=page.locator('.nav-products-trigger');
 await trigger.focus();
 await trigger.press('Enter');
 await page.waitForTimeout(100);
 const keyboardOpen=await menu.evaluate(el=>getComputedStyle(el).display);
 await trigger.press('Enter');
 await page.waitForTimeout(100);
 const keyboardClosed=await menu.evaluate(el=>getComputedStyle(el).display);
 report.targeted.productDropdown={before,during,after,keyboardOpen,keyboardClosed,links,pass:before==='none'&&during!=='none'&&after==='none'&&keyboardOpen!=='none'&&keyboardClosed==='none'&&links>=8};
 if(!report.targeted.productDropdown.pass) report.failures.push({target:'productDropdown',...report.targeted.productDropdown});
 await context.close();
}

// Targeted regression: report previews exist in both assessment journeys and individual steps stay on one desktop row.
{
 const context=await browser.newContext({viewport:{width:1440,height:1000}});
 const checks=[];
 for(const path of ['enterprise.html','professionals.html']){
   const page=await context.newPage();
   await page.goto(base+'/'+path,{waitUntil:'domcontentloaded',timeout:12000});
   const galleries=await page.locator('.sx-report-gallery').count();
   const shots=await page.locator('.sx-report-shot').count();
   checks.push({path,galleries,shots});
   await page.close();
 }
 const page=await context.newPage();
 await page.goto(base+'/professionals.html',{waitUntil:'domcontentloaded',timeout:12000});
 const tops=await page.locator('.journey-flow article').evaluateAll(els=>els.map(el=>Math.round(el.getBoundingClientRect().top)));
 const sameRow=tops.length===7 && new Set(tops).size===1;
 await page.close();
 const pass=checks.every(x=>x.galleries===1&&x.shots>=3)&&sameRow;
 report.targeted.reportPreviewAndJourneyRow={checks,tops,sameRow,pass};
 if(!pass) report.failures.push({target:'reportPreviewAndJourneyRow',checks,tops,sameRow});
 await context.close();
}

// Targeted regression: skip link remains off-screen until keyboard focus.
{
 const context=await browser.newContext({viewport:{width:390,height:844}});
 const checks=[];
 for(const path of ['professionals.html','employee-experience.html','company.html','trust-center.html']){
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

// Targeted regression: sign-in shell must not receive the public Products megamenu.
{
 const context=await browser.newContext({viewport:{width:1440,height:1000}});
 const page=await context.newPage();
 await page.goto(base+'/signin.html',{waitUntil:'domcontentloaded',timeout:12000});
 await page.waitForTimeout(180);
 const state=await page.evaluate(()=>{
   const nav=document.querySelector('.v5nav');
   const main=document.querySelector('main');
   const box=nav?.getBoundingClientRect();
   return {
     products:document.querySelectorAll('.nav-products').length,
     auth:document.querySelectorAll('.nav-auth').length,
     scrollWidth:document.documentElement.scrollWidth,
     clientWidth:document.documentElement.clientWidth,
     navBox:box?{left:box.left,right:box.right,width:box.width}:null,
     mainVisible:!!main && getComputedStyle(main).display!=='none'
   };
 });
 const pass=state.products===0 && state.auth===0 && state.scrollWidth<=state.clientWidth+2 && state.mainVisible;
 report.targeted.signinShellIsolation={...state,pass};
 if(!pass) report.failures.push({target:'signinShellIsolation',...state});
 await context.close();
}

// Targeted regression: report-preview heading must remain legible on the dark gallery.
{
 const context=await browser.newContext({viewport:{width:1440,height:1000}});
 const page=await context.newPage();
 await page.goto(base+'/professionals.html',{waitUntil:'domcontentloaded',timeout:12000});
 const state=await page.locator('.sx-report-gallery-head h3').evaluate(el=>{
   const s=getComputedStyle(el),rgb=s.color.match(/\d+/g)?.map(Number)||[];
   return {color:s.color,rgb};
 });
 const pass=state.rgb.length>=3 && state.rgb[0]>180 && state.rgb[1]>180 && state.rgb[2]>180;
 report.targeted.reportPreviewContrast={...state,pass};
 if(!pass) report.failures.push({target:'reportPreviewContrast',...state});
 await context.close();
}

// Targeted regression: call control must open a usable desktop call panel.
{
 const context=await browser.newContext({viewport:{width:1440,height:1000}});
 const page=await context.newPage();
 await page.goto(base+'/professionals.html',{waitUntil:'domcontentloaded',timeout:12000});
 const call=page.locator('[data-call]').first();
 const visible=await call.isVisible();
 if(visible) await call.click();
 await page.waitForTimeout(120);
 const panel=page.locator('#sx-call-panel');
 const panelVisible=await panel.count()?await panel.isVisible():false;
 const directLink=await panel.count()?await panel.locator('a[href^="https://call.whatsapp.com/"]').count():0;
 const qrImage=await panel.count()?await panel.locator('img[src="/assets/syntropix-whatsapp-call-qr.png"]').count():0;
 const pass=visible&&panelVisible&&directLink>=1&&qrImage===1;
 report.targeted.callControl={visible,panelVisible,directLink,qrImage,pass};
 if(!pass) report.failures.push({target:'callControl',visible,panelVisible,directLink,qrImage});
 await context.close();
}

// Targeted regression: touch/mobile call control bypasses QR and opens the WhatsApp call target directly.
{
 const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
 const page=await context.newPage();
 await page.route('https://call.whatsapp.com/**',async route=>route.fulfill({status:200,contentType:'text/html',body:'<html><body>call target</body></html>'}));
 await page.goto(base+'/solutions.html',{waitUntil:'domcontentloaded',timeout:12000});
 await page.waitForTimeout(120);
 const call=page.locator('[data-call]').first();
 const chat=page.locator('[data-chat]').first();
 const controlsVisible=await call.isVisible()&&await chat.isVisible();
 await call.click();
 await page.waitForTimeout(160);
 const url=page.url();
 const qrPanel=await page.locator('#sx-call-panel').count();
 const pass=controlsVisible&&url.startsWith('https://call.whatsapp.com/')&&qrPanel===0;
 report.targeted.mobileDirectCall={controlsVisible,url,qrPanel,pass};
 if(!pass) report.failures.push({target:'mobileDirectCall',controlsVisible,url,qrPanel});
 await context.close();
}

// Targeted regression: public pages without static contact markup still receive working floating controls.
{
 const context=await browser.newContext({viewport:{width:1440,height:1000}});
 const page=await context.newPage();
 const token='22222222-2222-4222-8222-222222222222';
 await page.route('https://syntropix-backend.onrender.com/api/chat/sessions',async route=>route.fulfill({status:201,contentType:'application/json',body:JSON.stringify({status:'success',session:token,transport:'command'})}));
 await page.route(new RegExp('https://syntropix-backend\\.onrender\\.com/api/chat/sessions/'+token+'/messages'),async route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({status:'success',session:{status:'open',visitorLabel:'Visitor TEST'},messages:[]})}));
 await page.goto(base+'/solutions.html',{waitUntil:'domcontentloaded',timeout:12000});
 await page.waitForTimeout(120);
 const call=page.locator('[data-call]').first();
 const chat=page.locator('[data-chat]').first();
 const controlsVisible=await call.isVisible()&&await chat.isVisible();
 await chat.click();
 await page.waitForTimeout(100);
 const panelVisible=await page.locator('#chat5').isVisible();
 const pass=controlsVisible&&panelVisible;
 report.targeted.injectedContactControls={controlsVisible,panelVisible,pass};
 if(!pass) report.failures.push({target:'injectedContactControls',controlsVisible,panelVisible});
 await context.close();
}

// Targeted regression: concierge UI must accept a message when backend falls back to Command transport.
{
 const context=await browser.newContext({viewport:{width:390,height:844}});
 const page=await context.newPage();
 const token='11111111-1111-4111-8111-111111111111';
 await page.route('https://syntropix-backend.onrender.com/api/chat/sessions',async route=>{
   if(route.request().method()==='POST') return route.fulfill({status:201,contentType:'application/json',body:JSON.stringify({status:'success',session:token,transport:'command'})});
   return route.continue();
 });
 await page.route(new RegExp('https://syntropix-backend\\.onrender\\.com/api/chat/sessions/'+token+'/messages'),async route=>{
   if(route.request().method()==='POST') return route.fulfill({status:201,contentType:'application/json',body:JSON.stringify({status:'success',delivered:true,transport:'command'})});
   return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({status:'success',session:{status:'open',visitorLabel:'Visitor TEST'},messages:[]})});
 });
 await page.goto(base+'/professionals.html',{waitUntil:'domcontentloaded',timeout:12000});
 await page.locator('[data-chat]').first().click();
 await page.waitForTimeout(120);
 const panelVisible=await page.locator('#chat5').isVisible();
 const directWhatsApp=await page.locator('.chat-wa-link[href="https://syntropix-backend.onrender.com/api/chat/whatsapp"]').count();
 await page.locator('#sx-chat-input').fill('QA message');
 await page.locator('.chat-compose button').click();
 await page.waitForTimeout(180);
 const text=await page.locator('.chat-messages').innerText();
 const pass=panelVisible && directWhatsApp===1 && text.includes('QA message') && !text.includes('could not be delivered');
 report.targeted.conciergeCommandFallback={panelVisible,directWhatsApp,text,pass};
 if(!pass) report.failures.push({target:'conciergeCommandFallback',panelVisible,directWhatsApp,text});
 await context.close();
}

// Targeted regression: homepage hero must contain a balanced right-side architecture visual on desktop.
{
 const context=await browser.newContext({viewport:{width:1440,height:1000}});
 const page=await context.newPage();
 await page.goto(base+'/index.html',{waitUntil:'domcontentloaded',timeout:12000});
 await page.waitForTimeout(180);
 const state=await page.evaluate(()=>{
   const hero=document.querySelector('.sx-hero');
   const copy=document.querySelector('.sx-hero-copy');
   const visual=document.querySelector('.sx-hero-visual');
   const slab=document.querySelector('.sx-hero-slab');
   const hb=hero?.getBoundingClientRect(),cb=copy?.getBoundingClientRect(),vb=visual?.getBoundingClientRect(),sb=slab?.getBoundingClientRect();
   return {
     hero:hb?{width:hb.width,height:hb.height}:null,
     copy:cb?{left:cb.left,right:cb.right,width:cb.width}:null,
     visual:vb?{left:vb.left,right:vb.right,width:vb.width,height:vb.height}:null,
     slab:sb?{width:sb.width,height:sb.height}:null,
     display:visual?getComputedStyle(visual).display:null
   };
 });
 const pass=!!state.visual&&!!state.slab&&state.display!=='none'&&state.visual.width>380&&state.slab.width>190&&state.visual.left>state.copy.left;
 report.targeted.homeHeroArchitecture={...state,pass};
 if(!pass) report.failures.push({target:'homeHeroArchitecture',...state});
 await context.close();
}

// Targeted regression: display typography stays within the calibrated premium scale.
{
 const context=await browser.newContext({viewport:{width:1440,height:1000}});
 const page=await context.newPage();
 const checks=[];
 for(const path of ['index.html','enterprise.html','professionals.html','solutions.html','science.html','trust.html']){
   await page.goto(base+'/'+path,{waitUntil:'domcontentloaded',timeout:12000});
   await page.waitForTimeout(80);
   const state=await page.evaluate(()=>{
     const hero=document.querySelector('.sx-hero h1,.hero5 h1');
     const section=document.querySelector('.sx-section-head h2,.section5 h2');
     const size=el=>el?parseFloat(getComputedStyle(el).fontSize):null;
     return {hero:size(hero),section:size(section)};
   });
   checks.push({path,...state});
 }
 const pass=checks.every(x=>(x.hero===null||x.hero<=84.5)&&(x.section===null||x.section<=70.5));
 report.targeted.displayTypographyCalibration={checks,pass};
 if(!pass) report.failures.push({target:'displayTypographyCalibration',checks});
 await context.close();
}

// Targeted regression: credibility layer must expose accountable leadership, evidence boundaries and trust documentation.
{
 const context=await browser.newContext({viewport:{width:1440,height:1000}});
 const page=await context.newPage();
 const checks={};
 await page.goto(base+'/company.html',{waitUntil:'domcontentloaded',timeout:12000});
 checks.company={founder:await page.getByText('Shubhashish Banerjee',{exact:true}).count(),boundary:await page.getByText(/Previous professional experience informs/).count()};
 await page.goto(base+'/technical-notes.html',{waitUntil:'domcontentloaded',timeout:12000});
 checks.technical={notes:await page.locator('.cred-note').count(),guardrail:await page.getByText(/Developmental indicators/).count()};
 await page.goto(base+'/evidence-in-practice.html',{waitUntil:'domcontentloaded',timeout:12000});
 checks.evidence={blueprints:await page.locator('.cred-blueprint').count(),standard:await page.getByText(/Five questions before an outcome becomes marketing/).count()};
 await page.goto(base+'/trust-center.html',{waitUntil:'domcontentloaded',timeout:12000});
 checks.trust={providers:await page.locator('.cred-table tbody tr').count(),providerBoundary:await page.getByText(/Provider certifications are not presented as Syntropix certifications/).count()};
 const pass=checks.company.founder===1&&checks.company.boundary>=1&&checks.technical.notes===13&&checks.technical.guardrail>=1&&checks.evidence.blueprints===3&&checks.evidence.standard>=1&&checks.trust.providers>=5&&checks.trust.providerBoundary>=1;
 report.targeted.credibilityLayer={checks,pass};
 if(!pass) report.failures.push({target:'credibilityLayer',checks});
 await context.close();
}

// Targeted regression: product demonstration modules must remain visible and clearly illustrative.
{
 const context=await browser.newContext({viewport:{width:1440,height:1000}});
 const page=await context.newPage();
 const checks=[];
 for(const path of ['manager-development.html','prism360.html','employee-experience.html','solutions.html']){
   await page.goto(base+'/'+path,{waitUntil:'domcontentloaded',timeout:12000});
   const demos=await page.locator('.cred-demo').count();
   const disclaimer=await page.locator('.cred-disclaimer').count();
   const visible=demos?await page.locator('.cred-demo').first().isVisible():false;
   checks.push({path,demos,disclaimer,visible});
 }
 const pass=checks.every(x=>x.demos>=1&&x.disclaimer>=1&&x.visible);
 report.targeted.productDemonstrations={checks,pass};
 if(!pass) report.failures.push({target:'productDemonstrations',checks});
 await context.close();
}

// Targeted regression: public credibility pages must not claim Syntropix certifications it does not hold.
{
 const context=await browser.newContext({viewport:{width:1200,height:900}});
 const page=await context.newPage();
 const hits=[];
 for(const path of ['company.html','trust-center.html','technical-notes.html','evidence-in-practice.html']){
   await page.goto(base+'/'+path,{waitUntil:'domcontentloaded',timeout:12000});
   const text=(await page.locator('body').innerText()).toLowerCase();
   const prohibited=['syntropix is iso 27001 certified','syntropix is soc 2 certified','syntropix is soc2 certified'];
   for(const phrase of prohibited)if(text.includes(phrase))hits.push({path,phrase});
 }
 const pass=hits.length===0;
 report.targeted.noUnsupportedCertificationClaims={hits,pass};
 if(!pass) report.failures.push({target:'noUnsupportedCertificationClaims',hits});
 await context.close();
}


// Targeted regression: universal footer keeps the approved copyright and fresh Syntropix favicon.
{
 const context=await browser.newContext({viewport:{width:1200,height:900}});
 const checks=[];
 for(const path of ['index.html','enterprise.html','pricing.html','privacy.html']){
   const page=await context.newPage();
   await page.goto(base+'/'+path,{waitUntil:'domcontentloaded',timeout:12000});
   await page.waitForTimeout(180);
   const state=await page.evaluate(()=>({
     icon:document.querySelector('link[rel="icon"]')?.href||'',
     shortcut:document.querySelector('link[rel="shortcut icon"]')?.href||'',
     apple:document.querySelector('link[rel="apple-touch-icon"]')?.href||'',
     footerText:document.querySelector('footer.sx-global-footer')?.innerText||''
   }));
   checks.push({path,...state});
   await page.close();
 }
 const pass=checks.every(x=>x.icon.includes('/favicon.png')&&x.shortcut.includes('/favicon.png')&&x.apple.includes('/favicon.png')&&x.footerText.includes('© 2026 Syntropix® – All rights reserved.'));
 report.targeted.universalFooterBranding={checks,pass};
 if(!pass) report.failures.push({target:'universalFooterBranding',checks});
 await context.close();
}


// Targeted regression: Managerial Effectiveness public metadata matches its canonical ten-dimension runtime.
{
 const context=await browser.newContext({viewport:{width:1200,height:900}});
 const page=await context.newPage();
 await page.goto(base+'/professionals.html',{waitUntil:'domcontentloaded',timeout:12000});
 await page.waitForTimeout(220);
 const card=page.locator('.assessment-card').filter({has:page.locator('a[href*="assessment=managerial-effectiveness"]')}).first();
 const meta=(await card.locator('.assessment-meta').innerText()).trim();
 const pass=/10\s+(?:dimensions|dims?\.?)/i.test(meta)&&!/8\s+(?:dimensions|dims?\.?)/i.test(meta);
 report.targeted.managerialEffectivenessDimensionMetadata={meta,pass};
 if(!pass) report.failures.push({target:'managerialEffectivenessDimensionMetadata',meta});
 await page.close();
 await context.close();
}

await browser.close();
fs.writeFileSync('qa-output/qa-report.json',JSON.stringify(report,null,2));
console.log(JSON.stringify({failures:report.failures.length,targeted:report.targeted},null,2));
if(report.failures.length) process.exit(1);
