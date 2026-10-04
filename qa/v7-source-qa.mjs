#!/usr/bin/env node
import fs from 'node:fs';

const html=fs.readFileSync('index.html','utf8');
const css=fs.readFileSync('v7-home.css','utf8');
const failures=[];
const require=(ok,msg)=>{if(!ok)failures.push(msg)};

require((html.match(/<h1\b/g)||[]).length===1,'Homepage must contain exactly one H1');
require(html.includes('class="v6-skip" href="#main"'),'Skip link to #main must remain');
require(html.includes('id="main"'),'Main landmark must remain');
require(html.includes('assessment-invite-router-v1.js'),'Assessment invitation router must remain loaded');
require(html.includes('acdc-staging.syntropix.in/command/reset.html'),'Recovery redirect contract must remain');
require(html.includes('data-syntropix-hcs'),'3D HCS mount must remain');
require(html.includes('syntropix-hcs-v1.js'),'3D HCS implementation must remain');
require(html.includes('v7-home.css'),'V7 isolated stylesheet must remain');
require(html.includes('The report is not the finish line.'),'Approved homepage belief must remain');
for(const stage of ['Assess','Diagnose','Develop','Practice','Coach','Apply','Measure']){
  require(html.includes('>'+stage+'<'),'Missing seven-stage system step: '+stage);
}
require(!/SOC 2|ISO 27001/i.test(html),'Homepage must not imply unsupported Syntropix certification');
require(css.includes('body.sx-v6.sx-v7'),'V7 CSS must remain scope-isolated');
require(css.includes('@media(prefers-reduced-motion:reduce)'),'V7 reduced-motion CSS contract missing');
require(css.includes(':focus-visible'),'V7 visible-focus treatment missing');

const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);
const duplicates=ids.filter((id,i)=>ids.indexOf(id)!==i);
require(duplicates.length===0,'Duplicate IDs: '+[...new Set(duplicates)].join(', '));

const localHrefs=[...html.matchAll(/href="(\/[^"#?]*[^"]*)"/g)].map(m=>m[1].split('#')[0].split('?')[0]).filter(Boolean);
for(const href of new Set(localHrefs)){
  if(href==='/'||href.endsWith('/')) continue;
  const p=href.replace(/^\//,'');
  require(fs.existsSync(p),'Homepage links to missing local file: '+href);
}

if(failures.length){
  console.error('V7 source QA: FAIL');
  failures.forEach(x=>console.error(' - '+x));
  process.exit(1);
}
console.log('V7 source QA: PASS');
console.log('Checks: semantic shell, recovery/invite invariants, HCS, seven-stage narrative, claim guard, CSS isolation, reduced motion, focus visibility, duplicate IDs, local links.');
