import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const base='http://127.0.0.1:4179';
await mkdir('qa-output-cognimorph',{recursive:true});
const browser=await chromium.launch({headless:true});
function observeErrors(page){page.on('pageerror',error=>console.error('POC PAGE ERROR:',error.stack||error.message));page.on('console',msg=>{if(msg.type()==='error')console.error('POC CONSOLE ERROR:',msg.text())})}
const records=[];
async function scenario(name,fn){
  try{await fn();records.push({scenario:name,status:'PASS'});console.log('PASS',name)}
  catch(error){records.push({scenario:name,status:'FAIL',message:error.message});console.error('FAIL',name,error);process.exitCode=1}
}
function assertNoNetwork(page){
  const requests=[];
  page.on('request',request=>{if(!request.url().startsWith(base+'/'))requests.push(request.url())});
  return ()=>assert.deepEqual(requests,[],'Unexpected outbound network request(s)');
}
await scenario('Fictional report: 4 segments, profile topology, score cards, 90-day activities and local coaching',async()=>{
  const page=await browser.newPage({viewport:{width:1440,height:900}});
  const safe=assertNoNetwork(page);observeErrors(page);
  await page.goto(base+'/',{waitUntil:'networkidle'});
  assert.equal(await page.locator('#intro h1').innerText(),'How do you respond when work changes?');
  await page.getByRole('button',{name:'View a fictional completed report'}).click(); console.log('DIAGNOSTIC after demo',await page.evaluate(()=>({hidden:document.getElementById('results').hidden,html:document.getElementById('results').outerHTML.slice(0,100),score:document.getElementById('overallIndex').textContent})));
  assert.equal(await page.locator('#results').isVisible(),true);
  assert.equal(await page.locator('#segmentDetails .segment').count(),4);
  assert.equal(await page.locator('#segmentDetails .segment .segment-application').count(),4);
  assert.equal(await page.locator('#segmentDetails .segment .segment-columns').count(),4);
  assert.equal(await page.locator('.report-nav a').count(),9);
  assert.equal(await page.locator('#dimensions article.metric').count(),4);
  assert.equal(await page.locator('#quickScores > div').count(),4);
  assert.equal(await page.locator('#developmentPlan article').count(),3);
  assert.equal(await page.locator('#developmentPlan li').count(),12);
  assert.equal(await page.locator('#topography polygon.radar-value').count(),1);
  const diagramBounds=await page.evaluate(()=>{const svg=document.getElementById('topography'),vb=svg.viewBox.baseVal;return[...svg.querySelectorAll('text')].map(t=>{const rect=t.getBBox();return {text:t.textContent,inside:rect.x>=vb.x-2&&rect.y>=vb.y-2&&rect.x+rect.width<=vb.x+vb.width+2&&rect.y+rect.height<=vb.y+vb.height+2}})});
  assert(diagramBounds.every(x=>x.inside),'Clipped radar labels: '+JSON.stringify(diagramBounds.filter(x=>!x.inside)));
  assert.match(await page.locator('#overallIndex').innerText(),/^\d+(\.\d+)? \/ 100$/);
  await page.locator('#coachUnderstand').click();
  assert.match(await page.locator('#coachAnswer').innerText(),/Your scores summarize/);
  await page.locator('#coachExample').click();
  assert.match(await page.locator('#coachAnswer').innerText(),/Example:/);
  await page.screenshot({path:'qa-output-cognimorph/desktop-report.png',fullPage:true});
  await page.emulateMedia({media:'print'});
  const pdf=await page.pdf({format:'A4',printBackground:true,preferCSSPageSize:true,tagged:true,outline:true});
  assert(pdf.length>10000,'PDF unexpectedly small');
  const printStyles=await page.evaluate(()=>{const card=document.querySelector('#results .report-top .panel'),t=card.querySelector('p');return{background:getComputedStyle(card).backgroundColor,color:getComputedStyle(t).color,fontSize:getComputedStyle(t).fontSize}});
  assert.match(printStyles.background,/rgb\(255, 255, 255\)/,'Print cards must have white backgrounds: '+JSON.stringify(printStyles));
  assert.match(printStyles.color,/rgb\(23, 33, 26\)/,'Print text must be dark: '+JSON.stringify(printStyles));
  await writeFile('qa-output-cognimorph/fictional-report.pdf',pdf);
  safe();await page.close();
});
await scenario('Questionnaire: seven accessible candidate items and complete-response gate',async()=>{
  const page=await browser.newPage({viewport:{width:1280,height:850}});
  const safe=assertNoNetwork(page);observeErrors(page);
  await page.goto(base+'/',{waitUntil:'networkidle'});
  await page.getByRole('button',{name:/Explore the questions/}).click();
  assert.equal(await page.locator('.question').count(),20);
  const candidates={
    11:'When work suddenly gets busy or confusing, I decide what needs my attention first.',
    13:'When someone says my work needs to improve, I can listen without feeling like a failure.',
    14:'When someone questions my plan, my first reaction is to defend it.',
    16:'I sometimes reject useful advice because I do not like how it was given.',
    17:'I believe that hard work and not giving up help me grow in my career.',
    18:'When a plan I worked on fails, I look at what went wrong without blaming people.',
    19:'When my work is judged under pressure, I try to see it as a problem I can work through.'
  };
  for(const [n,statement] of Object.entries(candidates)){
    assert((await page.locator('.question').nth(Number(n)-1).innerText()).includes(statement));
  }
  assert(await page.locator('#finish').isDisabled());
  for(let i=0;i<20;i++){
    const question=page.locator('.question').nth(i);
    await question.locator('.scale button').nth(i%6).click();
    assert.equal(await question.locator('[aria-pressed="true"]').count(),1);
  }
  assert(await page.locator('#finish').isEnabled());
  assert.match(await page.locator('#progressText').innerText(),/20 of 20/);
  await page.locator('#finish').click();
  assert.equal(await page.locator('#results').isVisible(),true);
  assert.equal(await page.locator('#segmentDetails .segment').count(),4);
  safe();await page.close();
});
await scenario('Mobile layout: 375px and 768px width report without horizontal overflow',async()=>{
  for(const width of [320,375,768,1024,1366,1600]){
    const page=await browser.newPage({viewport:{width,height:820},isMobile:width<=375,hasTouch:width<=375});
    await page.goto(base+'/',{waitUntil:'networkidle'});
    await page.locator('#demo').click();
    assert.equal(await page.locator('#results').isVisible(),true);
    const geometry=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,viewport:window.innerWidth}));
    assert(geometry.scrollWidth<=geometry.viewport+2,JSON.stringify({width,...geometry}));
    if(width>=1366){const bounds=await page.evaluate(()=>{const m=document.querySelector('main').getBoundingClientRect();return{width:m.width,viewport:window.innerWidth}});assert(bounds.width>=width*.83,'Desktop container leaves excessive empty margins: '+JSON.stringify(bounds));}
    await page.screenshot({path:'qa-output-cognimorph/layout-'+width+'.png',fullPage:true});
    await page.close();
  }
});
await scenario('Privacy: refresh clears responses; keyboard buttons work',async()=>{
  const page=await browser.newPage();
  await page.goto(base+'/',{waitUntil:'networkidle'});
  await page.locator('#start').focus();
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('#questionsView').isVisible(),true);
  await page.locator('.question').first().locator('button').first().focus();
  await page.keyboard.press('Space');
  assert.equal(await page.locator('.question').first().locator('[aria-pressed="true"]').count(),1);
  await page.reload({waitUntil:'networkidle'});
  assert.equal(await page.locator('#intro').isVisible(),true);
  await page.locator('#start').click();
  assert.match(await page.locator('#progressText').innerText(),/0 of 20/);
  await page.close();
});
await scenario('Automated WCAG accessibility: questionnaire and report at desktop and mobile',async()=>{
  for(const viewport of [{width:1440,height:900},{width:375,height:812}]){
    const context=await browser.newContext({viewport});
    const page=await context.newPage();
    await page.goto(base+'/',{waitUntil:'networkidle'});
    await page.locator('#start').click();
    const quiz=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
    const badQuiz=quiz.violations.filter(v=>['critical','serious'].includes(v.impact));
    await page.locator('#reset').click();
    await page.locator('#demo').click();
    const report=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
    const badReport=report.violations.filter(v=>['critical','serious'].includes(v.impact));
    await writeFile('qa-output-cognimorph/axe-'+viewport.width+'.json',JSON.stringify({quiz:quiz.violations,report:report.violations},null,2));
    assert.equal(badQuiz.length,0,'Questionnaire serious/critical a11y issues: '+JSON.stringify(badQuiz.map(x=>({id:x.id,targets:x.nodes.map(n=>n.target)}))));
    assert.equal(badReport.length,0,'Report serious/critical a11y issues: '+JSON.stringify(badReport.map(x=>({id:x.id,targets:x.nodes.map(n=>n.target)}))));
    await context.close();
  }
});
await writeFile('qa-output-cognimorph/results.json',JSON.stringify(records,null,2));
await browser.close();
if(records.some(x=>x.status!=='PASS'))process.exitCode=1;
