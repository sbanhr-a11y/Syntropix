(()=>{'use strict';
const API='https://syntropix-backend.onrender.com/api',params=new URLSearchParams(location.search),token=params.get('testToken'),requestedAssessment=params.get('assessment');
function fatal(message){document.body.innerHTML=`<main class="runtime"><section class="panel"><p class="kicker">TEST LAB</p><h1>Test session unavailable</h1><p>${String(message||'This launch link could not be validated.')}</p><p><a class="button primary" href="/professionals.html#assessments">Back to assessments</a></p></section></main>`}
function load(){
  if(window.__syntropixRuntimeLoadRequested)return;
  window.__syntropixRuntimeLoadRequested=true;
  const s=document.createElement('script');
  s.src='/assessment-runtime-v3.js';
  s.onload=()=>setTimeout(()=>{if(!window.__syntropixAssessmentRuntimeReady)fatal('The assessment engine did not initialize correctly. Please relaunch it from Syntropix Command.')},150);
  s.onerror=()=>fatal('Assessment runtime unavailable.');
  document.body.appendChild(s)
}
if(!token){load();return}
const originalFetch=window.fetch.bind(window),oldUser=localStorage.getItem('syntropix_user'),oldToken=localStorage.getItem('syntropix_token');
let active=false;
function restore(){if(!active)return;if(oldUser===null)localStorage.removeItem('syntropix_user');else localStorage.setItem('syntropix_user',oldUser);if(oldToken===null)localStorage.removeItem('syntropix_token');else localStorage.setItem('syntropix_token',oldToken);active=false}
window.addEventListener('pagehide',restore,{once:true});
(async()=>{
 try{
   const r=await originalFetch(`${API}/command/test-lab/validate`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token}),cache:'no-store'}),d=await r.json();
   if(!r.ok||!d.valid)throw new Error(d.message||'Invalid test session.');
   if(requestedAssessment&&d.assessment!==requestedAssessment)throw new Error('This test link is for a different assessment. Please relaunch it from Syntropix Command.');
   active=true;
   window.__syntropixTestLab={active:true,assessment:d.assessment,expiresAt:d.expiresAt};
   localStorage.setItem('syntropix_user',JSON.stringify({role:'demo',name:'Syntropix Test Lab',auth:'test-lab'}));
   localStorage.setItem('syntropix_token','TEST-LAB-EPHEMERAL');
   window.fetch=async(input,init={})=>{
     const url=typeof input==='string'?input:input?.url||'';
     if(url.includes('/payments/access-status'))return new Response(JSON.stringify({status:'success',authorized:true,role:'demo',testMode:true}),{status:200,headers:{'Content-Type':'application/json'}});
     if(url.includes('/payments/grant-bypass'))return new Response(JSON.stringify({status:'success',entitlementToken:'TEST-LAB-EPHEMERAL',testMode:true}),{status:200,headers:{'Content-Type':'application/json'}});
     if(url.includes('/reports/submit'))return new Response(JSON.stringify({status:'success',testMode:true,persisted:false}),{status:200,headers:{'Content-Type':'application/json'}});
     if(url.includes('/reports/feedback-rating'))return new Response(JSON.stringify({status:'success',testMode:true,persisted:false}),{status:200,headers:{'Content-Type':'application/json'}});
     if(url.includes('/reports/deliver'))return new Response(JSON.stringify({status:'success',testMode:true,emailed:false}),{status:200,headers:{'Content-Type':'application/json'}});
     if(url.includes('/validation/submit')||url.includes('/assessments/validation-response'))return new Response(JSON.stringify({status:'success',collected:false,reason:'internal-test-mode'}),{status:200,headers:{'Content-Type':'application/json'}});
     return originalFetch(input,init)
   };
   const banner=document.createElement('div');
   banner.setAttribute('role','status');
   banner.style.cssText='position:sticky;top:0;z-index:10000;padding:10px 18px;background:#D6B878;color:#090b09;text-align:center;font:800 12px/1.3 system-ui;letter-spacing:.08em';
   banner.textContent='INTERNAL TEST MODE · NO PAYMENT · ASSESSMENT DATA & REPORT NOT SAVED';
   document.body.prepend(banner);
   load()
 }catch(e){restore();fatal(e.message)}
})()
})();