import { chromium } from 'playwright';
import fs from 'node:fs';

const baseline='http://127.0.0.1:4174';
const candidate='http://127.0.0.1:4173';
const cases=[
  ['professionals.html','mobile-390',390,844],
  ['employee-experience.html','mobile-390',390,844],
  ['enterprise.html','mobile-390',390,844],
  ['talent-solutions.html','mobile-390',390,844],
  ['compliance-learning.html','mobile-390',390,844],
  ['prism360.html','mobile-390',390,844],
  ['employee-experience.html','tablet-1024',1024,900],
  ['index.html','mobile-390',390,844]
];
fs.rmSync('visual-evidence',{recursive:true,force:true});fs.mkdirSync('visual-evidence',{recursive:true});
const browser=await chromium.launch({headless:true});
async function shot(base,path,name,w,h,isBaseline){
 const context=await browser.newContext({viewport:{width:w,height:h},deviceScaleFactor:1,reducedMotion:'reduce'});
 const page=await context.newPage();
 await page.goto(base+'/'+path,{waitUntil:'networkidle',timeout:15000});
 await page.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important} html{scroll-behavior:auto!important}'});
 await page.evaluate(({isBaseline,path})=>{
   if(isBaseline){
     const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
     for(const n of nodes){let t=n.nodeValue||'';t=t.replace(/Professionals/g,'Individuals');if(path==='pricing.html')t=t.replace(/Professional/g,'Individual').replace(/professional/g,'individual');n.nodeValue=t;}
   }
   document.querySelectorAll('.sx-reveal').forEach(el=>el.classList.add('visible'));window.scrollTo(0,0);
 },{isBaseline,path});
 await page.waitForTimeout(250);
 await page.screenshot({path:`visual-evidence/${name}.png`,fullPage:true});
 const metrics=await page.evaluate(()=>({h:document.documentElement.scrollHeight,w:document.documentElement.scrollWidth}));
 await context.close(); return metrics;
}
const report=[];
for(const [path,label,w,h] of cases){
 const key=path.replace('.html','')+'--'+label;
 const b=await shot(baseline,path,key+'--before',w,h,true);
 const c=await shot(candidate,path,key+'--after',w,h,false);
 report.push({path,label,before:b,after:c,delta:c.h-b.h});
}
await browser.close();fs.writeFileSync('visual-evidence/report.json',JSON.stringify(report,null,2));
