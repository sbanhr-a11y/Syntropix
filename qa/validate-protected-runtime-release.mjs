#!/usr/bin/env node
/**
 * Protected application-runtime release evidence validator.
 * This is an ADDITIONAL gate, never a replacement for the V7 protected-file guard.
 * Fail closed on incomplete, stale, off-scope or self-approved release evidence.
 */
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';

const [manifestPath, base='origin/main', head='HEAD']=process.argv.slice(2);
function fail(message){console.error('PROTECTED RELEASE: FAIL — '+message);process.exit(2)}
if(!manifestPath)fail('manifest path required');
let manifest;
try{manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'))}catch{fail('manifest absent or invalid')}
const allowed=new Set(['assessment-runtime-v3.js','auth-passwordless.js']);
const sha=execFileSync('git',['rev-parse',head],{encoding:'utf8'}).trim();
const changed=execFileSync('git',['diff','--name-only',base+'...'+head],{encoding:'utf8'}).trim().split(/\r?\n/).filter(Boolean);
if(!/^[a-f0-9]{40}$/.test(manifest.commit_sha)||manifest.commit_sha!==sha)fail('release SHA mismatch');
if(manifest.release_type!=='protected_assessment_runtime')fail('wrong release type');
if(!Array.isArray(manifest.allowed_paths)||manifest.allowed_paths.length!==2||manifest.allowed_paths.some(p=>!allowed.has(p)))fail('path allowlist must be exact');
if(changed.some(p=>!allowed.has(p)))fail('unexpected changed path');
if(!changed.length)fail('no protected runtime changes');
if(!manifest.founder_approval_reference||!manifest.security_review_reference||!manifest.browser_report_test_reference||!manifest.rollback_reference)fail('missing evidence references');
if(manifest.author_login===manifest.reviewer_login)fail('reviewer must be distinct from author');
if(manifest.reviewer_decision!=='approved')fail('security review not approved');
if(manifest.browser_report_decision!=='passed')fail('browser/report UAT not passed');
console.log('PROTECTED RELEASE: evidence PASS (still requires repository branch protection and mandatory existing checks)');
