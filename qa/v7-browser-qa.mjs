import { chromium } from 'playwright';
import fs from 'node:fs';

const base='http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});
const out={generatedAt:new Date().toISOString(),checks:[],failures:[]};
fs.rmSync('qa-output-v7',{recursive:true,force:true});
fs.mkdirSync('qa-output-v7/screenshots',{recursive:true});

const record=(name,pass,detail={})=>{
  const row={name,pass,...detail}; out.checks.push(row); if(!pass)out.failures.push(row);
};

for(const vp of [
  {name:'desktop-1440',width:1440,height:1000},
  {name:'tablet-1024',width:1024,height:900},
  {name:'tablet-768',width:768,height:1024},
  {name:'mobile-430',width:430,height:932},
  {name:'mobile-390',width:390,height:844},
  {name:'reflow-320',width:320,height:800}
]){
  const context=await browser.newContext({viewport:{width:vp.width,height:vp.height}});
  const page=await context.newPage();
  const errors=[];
  page.on('pageerror',e=>errors.push(String(e)));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
  await page.goto(base+'/index.html',{waitUntil:'domcontentloaded',timeout:12000});
  await page.waitForTimeout(650);

  const state=await page.evaluate(()=>({
    h1:document.querySelectorAll('h1').length,
    main:!!document.querySelector('main'),
    sw:document.documentElement.scrollWidth,
    cw:document.documentElement.clientWidth,
    hero:document.querySelector('.sx-v7-hero')?.getBoundingClientRect().toJSON?.()||null,
    copy:document.querySelector('.sx-hero-copy')?.getBoundingClientRect().toJSON?.()||null,
    visual:document.querySelector('.sx-hero-visual')?.getBoundingClientRect().toJSON?.()||null,
    stages:document.querySelectorAll('.sx-v7-stage').length,
    products:document.querySelectorAll('.sx-v7-product').length,
    journeys:document.querySelectorAll('.sx-v7-journey').length,
    quotes:document.querySelectorAll('.sx-v7-quote').length,
    navLinks:[...document.querySelectorAll('.v5nav nav>a')].map(a=>a.textContent.trim()),
    acdcRuntimeLinks:document.querySelectorAll('a[href="/acdc-horizon.html"]').length
  }));

  const expectedNav=['How it works','Solutions','Organizations','Professionals','Company'];
  const navPass=expectedNav.every(x=>state.navLinks.includes(x))&&!state.navLinks.includes('Individuals');
  record(vp.name+':semantic-shell',state.h1===1&&state.main&&state.stages===7&&state.products===4&&state.journeys===2&&state.quotes>=2&&navPass,{state,navPass});
  record(vp.name+':horizontal-reflow',state.sw<=state.cw+2,{scrollWidth:state.sw,clientWidth:state.cw});
  record(vp.name+':console-clean',errors.length===0,{errors});
  record(vp.name+':public-acdc-boundary',state.acdcRuntimeLinks===0,{count:state.acdcRuntimeLinks});

  if(vp.width>=1101){
    const separated=!!state.copy&&!!state.visual&&state.visual.x>=state.copy.x+Math.min(state.copy.width*.72,state.copy.width-40);
    record(vp.name+':hero-composition',separated,{copy:state.copy,visual:state.visual});
  }else{
    const button=page.locator('.menu5');
    const visible=await button.isVisible();
    const box=visible?await button.boundingBox():null;
    if(visible)await button.click();
    await page.waitForTimeout(120);
    const expanded=await button.getAttribute('aria-expanded');
    const navVisible=await page.locator('.v5nav nav').isVisible();
    await page.keyboard.press('Escape');
    await page.waitForTimeout(80);
    const closed=await button.getAttribute('aria-expanded');
    const focused=await button.evaluate(el=>document.activeElement===el);
    record(vp.name+':mobile-nav',visible&&!!box&&box.height>=44&&expanded==='true'&&navVisible&&closed==='false'&&focused,{box,expanded,navVisible,closed,focused});
  }

  const interactive=await page.locator('.sx-v7-textlink,.sx-v7-product,.sx-v7-trustlinks a').evaluateAll(els=>els.map(el=>{const r=el.getBoundingClientRect();return {text:el.textContent.trim().slice(0,50),w:r.width,h:r.height}}));
  record(vp.name+':touch-targets',interactive.every(x=>x.h>=44),{interactive});

  if(vp.name==='desktop-1440'||vp.name==='mobile-390') {
    await page.screenshot({path:'qa-output-v7/screenshots/home--'+vp.name+'.png',fullPage:true});
  }
  await context.close();
}

// Keyboard focus and skip-link behavior.
{
  const context=await browser.newContext({viewport:{width:1440,height:900}});
  const page=await context.newPage();
  await page.goto(base+'/index.html',{waitUntil:'domcontentloaded',timeout:12000});
  await page.keyboard.press('Tab');
  const state=await page.evaluate(()=>{
    const a=document.activeElement,s=a?getComputedStyle(a):null,r=a?.getBoundingClientRect();
    return {text:a?.textContent?.trim(),href:a?.getAttribute?.('href'),top:r?.top,outline:s?.outlineStyle,outlineWidth:s?.outlineWidth};
  });
  record('keyboard:skip-link',state.href==='#main'&&state.top>=0,{state});
  await context.close();
}

// Reduced-motion contract.
{
  const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'});
  const page=await context.newPage();
  await page.goto(base+'/index.html',{waitUntil:'domcontentloaded',timeout:12000});
  await page.waitForTimeout(400);
  const state=await page.evaluate(()=>({
    reduced:matchMedia('(prefers-reduced-motion: reduce)').matches,
    reveals:[...document.querySelectorAll('.sx-reveal')].every(x=>x.classList.contains('visible')),
    productTransition:getComputedStyle(document.querySelector('.sx-v7-product')).transitionDuration
  }));
  record('motion:reduced',state.reduced&&state.reveals&&(/^0s(, 0s)*$/.test(state.productTransition)||state.productTransition==='0s'),{state});
  await context.close();
}

fs.writeFileSync('qa-output-v7/report.json',JSON.stringify(out,null,2));
await browser.close();
if(out.failures.length){
  console.error('V7 browser QA failed:',JSON.stringify(out.failures,null,2));
  process.exit(1);
}
console.log('V7 browser QA PASS:',out.checks.length,'checks');
