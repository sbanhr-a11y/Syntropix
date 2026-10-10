#!/usr/bin/env node
// Cross-repository contract QA for all paid professional assessments.
// Static validation complements (not replaces) staging authentication UAT.
const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const front=fs.readFileSync('assessment-runtime-v3.js','utf8');
// Backend runtime is checked in its own repository; this job verifies frontend coverage.
const registrySrc=fs.readFileSync('assessment-registry-v3.js','utf8');
const ctx={window:{}};vm.createContext(ctx);vm.runInContext(registrySrc,ctx);
const bank=ctx.window.SyntropixAssessmentRegistryV3.bank;
const frontMapBlock=front.match(/const slugMap=(\{[^;]+\});const PRICING=/);
assert(frontMapBlock,'Missing assessment frontend catalogue');
const frontend=new Function('return ('+frontMapBlock[1]+')')();
const slugs={'CogniMorph Index':'cognimorph','Coachability Quotient':'coachability','Metacognitive Executive Assessment':'metacognitive-executive','Strategic Inversion Diagnostics':'strategic-inversion','Self-Limiting Belief Auditor':'self-limiting-belief','Cognitive Learning Profiler':'cognitive-learning-profiler','Commercial Instinct Index':'commercial-instinct','Communication Signature':'communication-signature','Managerial Effectiveness Index':'managerial-effectiveness','Executive Leadership Index':'executive-leadership'};
const names=Object.values(frontend);
assert.equal(names.length,10,'Expected ten professional instruments');
assert.equal(new Set(names).size,10,'Duplicate instrument');
for(const [slug,name] of Object.entries(frontend)){
 assert(bank[name]?.questions?.length,'Missing assessment instrument: '+name);
 assert.equal(slugs[name],slug,'Mismatched OTP destination: '+name);
 console.log('PASS',slug,name,'items='+bank[name].questions.length);
}
assert.equal(Object.keys(slugs).length,names.length,'Unexpected backend catalogue drift');
assert(front.includes('function showPurchaseRecovery()'),'Shared purchase recovery unavailable');
assert(front.includes("if(!window.__syntropixTestLab?.active)showPurchaseRecovery()"),'Test Lab isolation missing');
assert(front.includes('AbortSignal.timeout(20000)'),'Request timeout removed');
assert(front.includes('Promise.race([sb.auth.getSession()'),'Sign-in timeout removed');
assert(front.includes('finally{button.disabled=false}'),'Recovery button may remain disabled');
console.log('PASS: all 10 frontend professional assessment paid-access contracts; backend checks run separately');
