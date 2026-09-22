import { chromium } from 'playwright';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import fs from 'node:fs';

const candidate='http://127.0.0.1:4173';
const baseline='http://127.0.0.1:4174';
const pages=[
  'index.html','enterprise.html','professionals.html','solutions.html',
  'assessment-intelligence.html','manager-development.html','prism360.html',
  'employee-experience.html','talent-solutions.html','professional-coaching.html',
  'compliance-learning.html','pricing.html','science.html','trust.html',
  'privacy.html','terms.html','refund-cancellation.html','cookie-policy.html'
];
const viewports=[
  {name:'desktop-1920',width:1920,height:1080},
  {name:'desktop-1440',width:1440,height:1000},
  {name:'tablet-1024',width:1024,height:900},
  {name:'mobile-390',width:390,height:844},
];

fs.rmSync('visual-diff-output',{recursive:true,force:true});
fs.mkdirSync('visual-diff-output/diffs',{recursive:true});

const browser=await chromium.launch({headless:true});
const report={generatedAt:new Date().toISOString(),baselineCommit:'6f143f05253d997a4fd2b6777b376b84312e8d8d',candidateCommit:process.env.GITHUB_SHA||'current',threshold:0.003,results:[],failures:[]};

async function capture(base,path,vp){
  const context=await browser.newContext({viewport:{width:vp.width,height:vp.height},deviceScaleFactor:1,reducedMotion:'reduce'});
  const page=await context.newPage();
  await page.goto(`${base}/${path}`,{waitUntil:'networkidle',timeout:15000});
  await page.addStyleTag({content:`
    *,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}
    html{scroll-behavior:auto!important}
    .floating{animation:none!important}
  `});
  await page.evaluate(()=>{
    document.querySelectorAll('.sx-reveal').forEach(el=>el.classList.add('visible'));
    window.scrollTo(0,0);
  });
  await page.waitForTimeout(250);
  const metrics=await page.evaluate(()=>({
    title:document.title,
    width:document.documentElement.scrollWidth,
    height:document.documentElement.scrollHeight,
    bodyText:document.body?.innerText?.trim().length||0,
    href:location.pathname+location.hash
  }));
  const buffer=await page.screenshot({fullPage:true});
  await context.close();
  return {buffer,metrics};
}

for(const vp of viewports){
  for(const path of pages){
    const [b,c]=await Promise.all([capture(baseline,path,vp),capture(candidate,path,vp)]);
    const bp=PNG.sync.read(b.buffer),cp=PNG.sync.read(c.buffer);
    const geometryMatch=bp.width===cp.width&&bp.height===cp.height;
    let mismatchPixels=null,ratio=1,diffPath=null;
    if(geometryMatch){
      const diff=new PNG({width:bp.width,height:bp.height});
      mismatchPixels=pixelmatch(bp.data,cp.data,diff.data,bp.width,bp.height,{threshold:0.1,includeAA:false});
      ratio=mismatchPixels/(bp.width*bp.height);
      if(ratio>report.threshold){
        diffPath=`visual-diff-output/diffs/${path.replace('.html','')}--${vp.name}.png`;
        fs.writeFileSync(diffPath,PNG.sync.write(diff));
      }
    }
    const textDelta=Math.abs((b.metrics.bodyText||0)-(c.metrics.bodyText||0));
    const pass=geometryMatch&&ratio<=report.threshold&&textDelta===0&&b.metrics.title===c.metrics.title;
    const rec={path,viewport:vp.name,pass,geometryMatch,ratio,mismatchPixels,textDelta,baseline:b.metrics,candidate:c.metrics,diffPath};
    report.results.push(rec);
    if(!pass) report.failures.push(rec);
  }
}
await browser.close();
fs.writeFileSync('visual-diff-output/visual-diff-report.json',JSON.stringify(report,null,2));
console.log(JSON.stringify({checks:report.results.length,failures:report.failures.length,maxRatio:Math.max(...report.results.map(x=>x.ratio))},null,2));
if(report.failures.length) process.exit(1);
