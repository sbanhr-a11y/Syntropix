const { chromium } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');
const {execFile} = require('node:child_process');
const {promisify} = require('node:util');
const exec = promisify(execFile);
const pages = ['/professionals.html','/employee-experience.html','/','/enterprise.html','/pricing.html'];
const widths = [320,375,390,768,1024,1440];
const base = process.env.BASE_URL || 'http://127.0.0.1:8765';
if (!['127.0.0.1','localhost'].includes(new URL(base).hostname)) throw Error('Localhost only');
const output = path.join('test-results','comparison');
fs.mkdirSync(output,{recursive:true});
(async()=>{
 const browser=await chromium.launch();
 const results=[];
 for (const route of pages) for (const width of widths){
  const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce',deviceScaleFactor:1});
  await page.goto(new URL(route,base).href,{waitUntil:'load'});
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForTimeout(200);
  const key=route.replace(/\W/g,'_')+'-'+width;
  await page.screenshot({path:path.join(output,key+'.png'),fullPage:true,animations:'disabled'});
  const data=await page.evaluate(()=>{
   const r=document.documentElement;
   return {overflow:r.scrollWidth-r.clientWidth,cardCount:document.querySelectorAll('.assessment-card').length};
  });
  results.push({route,width,...data});
  await page.close();
 }
 await browser.close();
 fs.writeFileSync(path.join(output,'metrics.json'),JSON.stringify(results,null,2));
 console.log('Captured',results.length,'page/viewport images');
})().catch(e=>{console.error(e);process.exit(1)});
