#!/usr/bin/env node
// Routes protected application changes to stricter runtime validation.
// It never changes qa/v7-protected-boundary.mjs, which remains the public-site boundary guard.
import {execFileSync} from 'node:child_process';
import {appendFileSync} from 'node:fs';
const base=process.argv[2]||'origin/main', head=process.argv[3]||'HEAD';
const changed=execFileSync('git',['diff','--name-only',base+'...'+head],{encoding:'utf8'}).trim().split(/\r?\n/).filter(Boolean);
const runtime=new Set(['assessment-runtime-v3.js','auth-passwordless.js']);
const protectedOther=/^(admin\.html|signin\.html|enterprise-console(?:\.html|\.js)|assessment-(?:runtime-v3\.(?:html|css)|registry-v3\.js|validation-v2\.js|test-lab-v1\.js|invite-router-v1\.js|assignment-ui-v1\.js)|acdc-horizon(?:\.html|\.css|\.js)|reviewer-|command-|qa\/reviewer|supabase\/|backend\/|server\/)/;
const app=changed.some(x=>runtime.has(x));
let mode='public';
if(app){
  mode='runtime';
  const permitted=x=>runtime.has(x)||x==='qa/release-evidence/paid-access-protected-review-20261011.md';
  const unexpected=changed.filter(x=>!permitted(x));
  if(unexpected.length){console.error('Protected runtime release has out-of-scope files:',unexpected);process.exit(2)}
  if(changed.some(x=>protectedOther.test(x))){console.error('Unapproved protected application surface');process.exit(2)}
  if(!changed.every(permitted)){process.exit(2)}
}
if(process.env.GITHUB_OUTPUT)appendFileSync(process.env.GITHUB_OUTPUT,'mode='+mode+'\n');
console.log('Release mode: '+mode+'; changed files: '+changed.join(', '));
