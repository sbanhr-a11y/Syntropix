(()=>{'use strict';
const REVIEWER_RECOVERY_TARGET='https://acdc-staging.syntropix.in/command/reset.html';
(function routeReviewerRecovery(){
  const hash=location.hash||'';
  const query=location.search||'';
  const recoveryInHash=/(^|[&#])type=recovery(&|$)/.test(hash)||/(^|[&#])access_token=/.test(hash)&&/(^|[&#])refresh_token=/.test(hash);
  const recoveryInQuery=/(^|[?&])type=recovery(&|$)/.test(query);
  if(recoveryInHash||recoveryInQuery){
    location.replace(REVIEWER_RECOVERY_TARGET+query+hash);
    throw new Error('Reviewer recovery redirect');
  }
})();
const PROJECT_URL='https://otdxdyfdmfigwopplqwm.supabase.co';const PUBLISHABLE_KEY='sb_publishable_wwpMf-7LO4jEO-NDvfk4DQ_Ce3AwaMK';const RETURN_KEY='syntropix_auth_return';function client(){if(!window.supabase?.createClient)throw new Error('Secure sign-in library unavailable.');return window.supabase.createClient(PROJECT_URL,PUBLISHABLE_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}})}function safeReturn(value){try{const u=new URL(value||'/',location.origin);return u.origin===location.origin?u.pathname+u.search+u.hash:'/'}catch{return'/'}}function syncWebsiteIdentity(session){if(session?.user){localStorage.setItem('syntropix_user',JSON.stringify({email:session.user.email||'',name:session.user.user_metadata?.name||session.user.email?.split('@')[0]||'Participant',role:'participant',auth:'supabase'}));window.dispatchEvent(new Event('storage'))}else{localStorage.removeItem('syntropix_user');window.dispatchEvent(new Event('storage'))}}async function consumePurchaseMagicLink(sb){
  const fragment=new URLSearchParams((location.hash||"").replace(/^#/,""));
  if(fragment.get("type")!=="magiclink"||!fragment.get("token_hash"))return;
  const tokenHash=fragment.get("token_hash");
  const dest=safeReturn(fragment.get("returnTo"));
  history.replaceState(null,"",location.pathname+location.search);
  if(!/^\/assessment-runtime-v3\.html\?assessment=[a-z0-9-]+$/.test(dest))throw new Error("Invalid assessment return destination.");
  sessionStorage.setItem(RETURN_KEY,dest);
  const {error}=await sb.auth.verifyOtp({token_hash:tokenHash,type:"magiclink"});
  if(error)throw new Error("This secure link has expired or could not be verified. Request another purchase sign-in link.");
}
async function init(){const sb=client(),form=document.querySelector('#magic-link-form'),email=document.querySelector('#magic-email'),status=document.querySelector('#magic-status'),signed=document.querySelector('#signed-in'),logout=document.querySelector('#logout');await consumePurchaseMagicLink(sb);const requested=safeReturn(new URLSearchParams(location.search).get('returnTo'));if(requested!=='/')sessionStorage.setItem(RETURN_KEY,requested);const show=async()=>{const {data}=await sb.auth.getSession();syncWebsiteIdentity(data?.session||null);if(data?.session){form.hidden=true;signed.hidden=false;signed.querySelector('strong').textContent=data.session.user.email||'Signed in';const dest=safeReturn(sessionStorage.getItem(RETURN_KEY));if(dest!=='/'&&dest!=='/signin.html'){sessionStorage.removeItem(RETURN_KEY);location.replace(dest)}}else{form.hidden=false;signed.hidden=true}};await show();sb.auth.onAuthStateChange((_event,session)=>{syncWebsiteIdentity(session);if(session)show()});form.addEventListener('submit',async e=>{e.preventDefault();status.textContent='Sending secure sign-in link…';const address=email.value.trim().toLowerCase();const {error}=await sb.auth.signInWithOtp({email:address,options:{emailRedirectTo:`${location.origin}/signin.html`,shouldCreateUser:false}});status.textContent=error?'We could not send a sign-in link. If this email has Syntropix access, please try again or contact support.':'If this email has Syntropix access, a secure sign-in link will arrive shortly.'});logout.addEventListener('click',async()=>{await sb.auth.signOut();syncWebsiteIdentity(null);location.reload()})}init().catch(e=>{const s=document.querySelector('#magic-status');if(s)s.textContent=e?.message||'Secure sign-in is temporarily unavailable.'})})();