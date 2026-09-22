import { chromium } from 'playwright';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import fs from 'node:fs';

const pages=['/','/enterprise.html','/professionals.html','/solutions.html','/science.html','/trust.html','/employee-experience.html'];
const viewports={wide:{width:1920,height:1080},desktop:{width:1440,height:1000},tablet:{width:1024,height:1366},mobile:{width:390,height:844}};
const roots={baseline:'http://127.0.0.1:4174',candidate:'http://127.0.0.1:4173'};
fs.mkdirSync('qa-regression/baseline',{recursive:true});
fs.mkdirSync('qa-regression/candidate',{recursive:true});
fs.mkdirSync('qa-regression/diff',{recursive:true});

const browser=await chromium.launch({headless:true});
const results=[];
for(const [vp,viewport] of Object.entries(viewports)){
  for(const path of pages){
    const imgs={};
    const metrics={};
    for(const [kind,base] of Object.entries(roots)){
      const context=await browser.newContext({viewport,deviceScaleFactor:1,reducedMotion:'reduce'});
      const page=await context.newPage();
      const errors=[];
      page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
      page.on('pageerror',e=>errors.push(String(e)));
      const response=await page.goto(base+path,{waitUntil:'networkidle',timeout:30000});
      await page.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}'});
      const height=await page.evaluate(()=>document.documentElement.scrollHeight);
      for(let y=0;y<height;y+=Math.max(500,Math.floor(viewport.height*.75))){await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(25)}
      await page.evaluate(()=>scrollTo(0,0)); await page.waitForTimeout(120);
      const safe=path==='/'?'home':path.slice(1).replace('.html','');
      const file=`qa-regression/${kind}/${safe}-${vp}.png`;
      await page.screenshot({path:file,fullPage:true});
      imgs[kind]=PNG.sync.read(fs.readFileSync(file));
      metrics[kind]={
        status:response?.status()??null,
        scrollWidth:await page.evaluate(()=>document.documentElement.scrollWidth),
        clientWidth:await page.evaluate(()=>document.documentElement.clientWidth),
        scrollHeight:await page.evaluate(()=>document.documentElement.scrollHeight),
        h1:await page.locator('h1').count(),
        errors
      };
      await context.close();
    }
    const b=imgs.baseline,c=imgs.candidate;
    const rec={viewport:vp,path,baseline:metrics.baseline,candidate:metrics.candidate};
    if(b.width!==c.width||b.height!==c.height){
      rec.dimensionMismatch={baseline:[b.width,b.height],candidate:[c.width,c.height]};
      rec.diffRatio=1;
    }else{
      const diff=new PNG({width:b.width,height:b.height});
      const changed=pixelmatch(b.data,c.data,diff.data,b.width,b.height,{threshold:.12,includeAA:false});
      rec.changedPixels=changed;
      rec.totalPixels=b.width*b.height;
      rec.diffRatio=changed/rec.totalPixels;
      if(changed) fs.writeFileSync(`qa-regression/diff/${path==='/'?'home':path.slice(1).replace('.html','')}-${vp}.png`,PNG.sync.write(diff));
    }
    rec.functionalOk=metrics.candidate.status===200&&metrics.candidate.scrollWidth<=metrics.candidate.clientWidth+2&&metrics.candidate.h1===1&&metrics.candidate.errors.length===0;
    results.push(rec);
  }
}
await browser.close();
const visualFailures=results.filter(r=>r.diffRatio>.001);
const functionalFailures=results.filter(r=>!r.functionalOk);
const report={generatedAt:new Date().toISOString(),threshold:.001,total:results.length,visualFailures:visualFailures.length,functionalFailures:functionalFailures.length,maxDiffRatio:Math.max(...results.map(r=>r.diffRatio)),results};
fs.writeFileSync('qa-regression/visual-regression.json',JSON.stringify(report,null,2));
console.log(JSON.stringify({total:report.total,visualFailures:report.visualFailures,functionalFailures:report.functionalFailures,maxDiffRatio:report.maxDiffRatio,worst:[...results].sort((a,b)=>b.diffRatio-a.diffRatio).slice(0,10).map(r=>({viewport:r.viewport,path:r.path,diffRatio:r.diffRatio,dimensionMismatch:r.dimensionMismatch}))},null,2));
if(visualFailures.length||functionalFailures.length) process.exitCode=1;
