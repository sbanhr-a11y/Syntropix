#!/usr/bin/env node
/** Read-only GitHub approval attestation; fail closed and never rely on PR-supplied booleans.
 * Expected use: workflow_run / manual dispatch on a trusted default-branch workflow,
 * with a read-only GitHub token. Not to run with write credentials on untrusted PR code.
 */
const [ownerRepo,prNumber,expectedSha]=process.argv.slice(2);
function fail(s){console.error('APPROVAL ATTESTATION: FAIL — '+s);process.exit(2)}
if(!/^[\w.-]+\/[\w.-]+$/.test(ownerRepo||'')||!/^\d+$/.test(prNumber||'')||!/^[a-f0-9]{40}$/.test(expectedSha||''))fail('invalid target');
if(!process.env.GITHUB_TOKEN)fail('read-only GitHub token unavailable');
const base='https://api.github.com/repos/'+ownerRepo;
async function get(path){
 const r=await fetch(base+path,{headers:{Authorization:'Bearer '+process.env.GITHUB_TOKEN,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28'}});
 if(!r.ok)fail('GitHub API returned '+r.status+' for '+path);
 return r.json();
}
const pr=await get('/pulls/'+prNumber);
if(pr.head?.sha!==expectedSha||pr.base?.ref!=='main'||pr.draft)fail('PR head/base/state does not match release');
const author=pr.user?.login;
let reviews=[],page=1;
while(page<=10){
 const part=await get('/pulls/'+prNumber+'/reviews?per_page=100&page='+page);
 reviews.push(...part);if(part.length<100)break;page++;
}
if(page>10)fail('review results exceed verified pagination limit');
const latest=new Map();
for(const rev of reviews){
 if(!rev.user?.login||!rev.submitted_at)continue;
 const user=rev.user.login.toLowerCase();
 if(['APPROVED','CHANGES_REQUESTED','DISMISSED'].includes(rev.state))latest.set(user,rev);
}
let approved=false;
for(const [login,rev] of latest){
 if(login===(author||'').toLowerCase()||rev.state!=='APPROVED'||rev.commit_id!==expectedSha)continue;
 const permission=await get('/collaborators/'+encodeURIComponent(login)+'/permission');
 if(['admin','maintain','write'].includes(permission.permission))approved=true;
}
if(!approved)fail('no current independent authorized approval for exact commit');
const statuses=await get('/commits/'+expectedSha+'/check-runs?per_page=100');
if(statuses.total_count>100)fail('check-run pagination incomplete');
const required=['V7 public website safety QA','Canonical Assessment Runtime Safety Gate','Public Repository Research IP Guard'];
for(const name of required){
 if(!statuses.check_runs?.some(x=>x.name===name&&x.status==='completed'&&x.conclusion==='success'))fail('required check missing or failing: '+name);
}
console.log('APPROVAL ATTESTATION: PASS for commit '+expectedSha);
