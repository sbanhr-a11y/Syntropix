// Read-only visual and interaction checks. Run against an isolated staging URL only.
// npm install --save-dev @playwright/test && npx playwright install chromium
// BASE_URL=https://your-isolated-staging-host npx playwright test tests/visual-linked-pages.spec.js
const {test,expect}=require('@playwright/test');
const paths=['/','/solutions.html','/enterprise.html','/professionals.html','/talent-solutions.html','/manager-development.html','/professional-coaching.html','/prism360.html','/employee-experience.html','/compliance-learning.html','/pricing.html','/company.html','/science.html','/evidence-in-practice.html','/technical-notes.html','/trust.html','/trust-center.html','/privacy.html','/terms.html','/refund-cancellation.html','/signin.html','/assessment-runtime-v3.html','/assessment-intelligence.html'];
const widths=[320,360,375,390,430,768,820,1024,1280,1440,1920];
const base=process.env.BASE_URL;
const approvedHosts=['syntropix-v7-staging.onrender.com','syntropix-home-hcs-staging.onrender.com','localhost','127.0.0.1'];
if(!base)throw Error('BASE_URL is required; use isolated staging, not production');
if(!approvedHosts.includes(new URL(base).hostname))throw Error('Refusing to run against an unapproved or production host: '+new URL(base).hostname);
test.describe.configure({mode:'parallel'});
for(const route of paths){
 test(`responsive checks ${route}`,async({browser})=>{
  const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
  const failures=[];
  for(const width of widths){
   await page.setViewportSize({width,height:844});
   const response=await page.goto(new URL(route,base).href,{waitUntil:'domcontentloaded',timeout:30000});
   await expect.soft(response?.status(),`HTTP ${route} ${width}`).toBeLessThan(400);
   await page.evaluate(()=>document.fonts.ready);
   await page.waitForTimeout(150);
   const metrics=await page.evaluate(()=>{
     const doc=document.documentElement;
     const scrollOverflow=doc.scrollWidth-doc.clientWidth;
     const visible=el=>{const s=getComputedStyle(el);return s.display!=='none'&&s.visibility!=='hidden'&&el.getClientRects().length>0};
     const clipped=[...document.querySelectorAll('a,button,.meta-icon,.assessment-meta,.assessment-card')].filter(visible).filter(el=>{
       const r=el.getBoundingClientRect(),p=el.parentElement?.getBoundingClientRect();
       return r.width>0&&(r.left<-2||r.right>innerWidth+2||(p&&getComputedStyle(el.parentElement).overflowX==='hidden'&&(r.right>p.right+2||r.left<p.left-2)));
     }).slice(0,15).map(el=>({tag:el.tagName,cls:el.className,text:(el.innerText||'').slice(0,60)}));
     const unnamedButtons=[...document.querySelectorAll('button')].filter(visible).filter(el=>!(el.innerText||el.getAttribute('aria-label')||el.getAttribute('title')||'').trim()).length;
     return {scrollOverflow,clipped,unnamedButtons};
   });
   if(metrics.scrollOverflow>2||metrics.clipped.length||metrics.unnamedButtons)failures.push({width,...metrics});
   await page.screenshot({path:`test-results/linked-${route.replace(/[^a-z0-9]/gi,'_')||'home'}-${width}.png`,fullPage:true,animations:'disabled'});
  }
  expect(failures,`layout failures ${route}`).toEqual([]);
  await page.close();
 });
}
