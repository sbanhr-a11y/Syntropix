'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const src=fs.readFileSync(require('node:path').join(__dirname,'../assessment-runtime-v3.js'),'utf8');
test('Cognimorph completion is persisted through canonical report submission',()=>{
 assert.match(src,/reportHtml:name==='CogniMorph Index'\?\$\('report'\)\.innerHTML:undefined/);
 assert.match(src,/response\?\.status!=='success'/);
});
test('Cognimorph email copy is explicit and never silently defaulted on',()=>{
 assert.match(src,/check\.id='cmi-email-copy-opt-in';check\.checked=false/);
 assert.match(src,/emailRequested:name==='CogniMorph Index'/);
});
test('1–4 star choices are extracted correctly instead of selecting only fifth star',()=>{
 assert.doesNotMatch(src,/button\.selected:last-of-type/);
 assert.match(src,/querySelectorAll\('#rating-stars button\.selected'\)/);
});
