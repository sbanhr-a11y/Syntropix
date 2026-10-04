#!/usr/bin/env node
/**
 * V7 protected-boundary guard.
 * Fails when a public-site PR modifies protected application/reviewer/runtime surfaces.
 * Usage:
 *   node qa/v7-protected-boundary.mjs [base-ref] [head-ref]
 */
import {execFileSync} from 'node:child_process';

const base=process.argv[2]||'origin/main';
const head=process.argv[3]||'HEAD';
const out=execFileSync('git',['diff','--name-only',base+'...'+head],{encoding:'utf8'});
const files=out.split(/\r?\n/).map(x=>x.trim()).filter(Boolean);

const exact=new Set([
  'admin.html',
  'signin.html',
  'auth-passwordless.js',
  'enterprise-console.html',
  'enterprise-console.js',
  'assessment-runtime-v3.html',
  'assessment-runtime-v3.css',
  'assessment-runtime-v3.js',
  'assessment-registry-v3.js',
  'assessment-validation-v2.js',
  'assessment-test-lab-v1.js',
  'assessment-invite-router-v1.js',
  'assessment-assignment-ui-v1.js',
  'acdc-horizon.html',
  'acdc-horizon.css',
  'acdc-horizon.js'
]);

const prefixes=[
  'reviewer-',
  'command-',
  'qa/reviewer',
  'supabase/',
  'backend/',
  'server/'
];

const riskyShared=new Set([
  'site-v5.js',
  'global-footer-v1.js',
  'premium-ui-v1.js',
  'v6-foundation.css',
  'v6-shared.css'
]);

const protectedFiles=files.filter(f=>exact.has(f)||prefixes.some(p=>f.startsWith(p)));
const shared=files.filter(f=>riskyShared.has(f));

console.log('V7 changed files:');
files.forEach(f=>console.log(' - '+f));

if(shared.length){
  console.log('\nShared high-risk presentation files changed (manual review required):');
  shared.forEach(f=>console.log(' ! '+f));
}

if(protectedFiles.length){
  console.error('\nERROR: V7 protected boundary violated:');
  protectedFiles.forEach(f=>console.error(' X '+f));
  process.exit(2);
}
console.log('\nProtected boundary: PASS');
