const API='https://syntropix-backend.onrender.com/api';const CALL='https://call.whatsapp.com/voice/KUopE3L5cl0RAj3iMYsjpC';const CHAT_GREETING='Hi! Welcome to Syntropix. How can we help you today? You can ask about assessments, coaching, organization solutions, or anything else you would like to explore.';const CHAT_SESSION_KEY='syntropix_chat_session';let chatPoll=null;let renderedMessageIds=new Set();let lastOperatorCount=0;function sxUser(){try{return JSON.parse(localStorage.getItem('syntropix_user')||'null')}catch{return null}}function sxLogout(){if(typeof window.logoutUser==='function')return window.logoutUser();['syntropix_user','syntropix_session','syntropix_token'].forEach(k=>localStorage.removeItem(k));location.reload()}function sxBack(){if(history.length>1)history.back();else location.href='/'}function isLandingPage(){const p=location.pathname.replace(/\/+$/,'');return p===''||p==='/'||p==='/index.html'||p==='/homepage-v4.html'}function iconPhone(){return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92z"/></svg>'}function iconChat(){return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/><path d="M8 9h8M8 13h5"/></svg>'}function syncCanonicalNav(){const accessGate=/\/(signin|admin)\.html$/.test(location.pathname);document.querySelectorAll('.v5nav').forEach(nav=>{let back=nav.querySelector('[data-back]');if(isLandingPage()){back?.remove()}else if(!back){const b=document.createElement('button');b.type='button';b.className='nav-back';b.dataset.back='';b.innerHTML='← <span>Back</span>';b.onclick=sxBack;nav.insertBefore(b,nav.querySelector('.brand'))}let auth=nav.querySelector('[data-auth]');if(accessGate){auth?.remove();return}if(!auth){auth=document.createElement('button');auth.type='button';auth.className='nav-auth';auth.dataset.auth='';nav.insertBefore(auth,nav.querySelector('.menu5'))}const u=sxUser();const mobileNav=nav.querySelector('nav');let mobileAuth=mobileNav?.querySelector('[data-mobile-auth]');if(!mobileAuth){mobileAuth=document.createElement('a');mobileAuth.dataset.mobileAuth='';mobileAuth.className='mobile-nav-auth';mobileNav.appendChild(mobileAuth)}mobileAuth.textContent=u?(u.role==='master'?'Open Command':'Log out'):'Sign in';mobileAuth.href=u&&u.role==='master'?'https://syntropix-backend.onrender.com/command/':u?'#logout':'/signin.html';mobileAuth.onclick=u&&u.role!=='master'?e=>{e.preventDefault();sxLogout()}:null;auth.textContent=u?'Log out':'Sign in';auth.onclick=()=>{const current=sxUser();if(current){if(current.role==='master'){location.href='https://syntropix-backend.onrender.com/command/';return}sxLogout()}else location.href='/signin.html'}})}function setupEliteNavigation(){if(!document.body.matches('.sx-v6,.v6-marketing'))return;const products=[['Assessment Intelligence','Developmental assessments for individuals and cohorts','/professionals.html#assessments'],['Enterprise Assessments','Cohort and system intelligence','/enterprise.html#enterprise-assessments'],['Manager Development + Coaching','Practice-led manager capability','/manager-development.html'],['Prism360','Multi-rater development feedback','/prism360.html'],['Horizon AC/DC','Simulation-based talent evidence','/solutions.html#acdc'],['The Culture Compass','Employee pulse check & experience intelligence','/employee-experience.html'],['Talent Solutions','Hiring and talent decision support','/talent-solutions.html'],['Professional Coaching','Individual development support','/professional-coaching.html'],['Compliance Learning','Governance learning suite','/compliance-learning.html']];document.querySelectorAll('.v5nav').forEach(h=>{let nav=h.querySelector('nav');if(!nav)return;nav.innerHTML='<a href="/enterprise.html">Organizations</a><a href="/professionals.html">Individuals</a><div class="nav-products"><button class="nav-products-trigger" type="button" aria-expanded="false">Products</button><div class="nav-products-menu">'+products.map(p=>'<a class="nav-product-link" href="'+p[2]+'"><b>'+p[0]+'</b><small>'+p[1]+'</small></a>').join('')+'</div></div><a href="/solutions.html">Solutions</a><a href="/science.html">Evidence</a><a href="/trust.html">Trust</a><a href="/company.html">Our Story</a>';let menu=h.querySelector('.menu5');if(!menu){menu=document.createElement('button');menu.className='menu5';menu.type='button';h.appendChild(menu)}menu.setAttribute('aria-label','Open navigation');menu.setAttribute('aria-expanded','false');menu.innerHTML='<span class="sx-menu-icon" aria-hidden="true"><i></i></span>';menu.onclick=e=>{e.stopPropagation();const open=h.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));if(!open)h.querySelector('.nav-products')?.classList.remove('products-open')};const group=nav.querySelector('.nav-products'),trigger=group?.querySelector('.nav-products-trigger');if(group&&trigger){trigger.onclick=e=>{e.preventDefault();const open=group.classList.toggle('products-open');trigger.setAttribute('aria-expanded',String(open))};group.addEventListener('mouseenter',()=>{if(!matchMedia('(max-width:1100px)').matches){group.classList.add('products-open');trigger.setAttribute('aria-expanded','true')}});group.addEventListener('mouseleave',()=>{if(!matchMedia('(max-width:1100px)').matches){group.classList.remove('products-open');trigger.setAttribute('aria-expanded','false')}});group.addEventListener('focusout',e=>{if(!group.contains(e.relatedTarget)){group.classList.remove('products-open');trigger.setAttribute('aria-expanded','false')}})}nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{h.classList.remove('open');menu.setAttribute('aria-expanded','false')}))});document.addEventListener('click',e=>document.querySelectorAll('.v5nav').forEach(h=>{if(!h.contains(e.target)){h.classList.remove('open');h.querySelector('.menu5')?.setAttribute('aria-expanded','false');h.querySelector('.nav-products')?.classList.remove('products-open')}}))}function setupFloatingActions(){if(document.body.matches('.sx-v6,.v6-marketing')){if(!document.querySelector('[data-call]'))document.body.insertAdjacentHTML('beforeend','<button type="button" class="floating call5" data-call aria-label="Call Syntropix"></button>');if(!document.querySelector('[data-chat]'))document.body.insertAdjacentHTML('beforeend','<button type="button" class="floating chat5" data-chat aria-label="Chat with Syntropix"></button>');if(!document.querySelector('#chat5'))document.body.insertAdjacentHTML('beforeend','<div id="chat5" class="chatpanel hidden"></div>')}document.querySelectorAll('[data-call]').forEach(b=>{b.type='button';b.innerHTML=iconPhone();b.title='Call Syntropix';b.setAttribute('aria-label','Call Syntropix');b.addEventListener('click',openCall)});document.querySelectorAll('[data-chat]').forEach(b=>{b.type='button';b.innerHTML=iconChat();b.title='Chat with Syntropix';b.setAttribute('aria-label','Chat with Syntropix');b.addEventListener('click',openChat)});setupChatPanel()}function openCall(){const direct=matchMedia('(max-width:760px)').matches||matchMedia('(pointer:coarse)').matches||navigator.maxTouchPoints>0;if(direct){window.location.href=CALL;return}openCallPanel()}function openCallPanel(){let p=document.getElementById('sx-call-panel');if(!p){p=document.createElement('div');p.id='sx-call-panel';p.className='callpanel';p.innerHTML='<button class="callpanel-close" type="button" aria-label="Close">×</button><p class="kicker">CALL SYNTROPIX</p><h3>Scan to start a voice call</h3><div id="sx-call-qr" class="call-qr"></div><p class="call-help">Scan with your phone camera to open a WhatsApp voice call. Video calling is not offered from this site.</p><a class="btn primary" href="'+CALL+'" target="_blank" rel="noopener">Open voice call on this device</a>';document.body.appendChild(p);p.querySelector('.callpanel-close').onclick=()=>p.classList.add('hidden');if(window.QRCode)new QRCode(document.getElementById('sx-call-qr'),{text:CALL,width:180,height:180});else document.getElementById('sx-call-qr').innerHTML='<img src="/assets/syntropix-whatsapp-call-qr.png" alt="QR code for Syntropix WhatsApp voice call">'}p.classList.remove('hidden')}function setupChatPanel(){const panel=document.querySelector('#chat5');if(!panel)return;panel.innerHTML=`<div class="chat-head"><div><span class="chat-status-dot"></span><b>Syntropix Concierge</b></div><button type="button" class="chat-close" aria-label="Close chat">×</button></div><div class="chat-messages" aria-live="polite"><div class="chat-message bot">${CHAT_GREETING}</div></div><div class="chat-activity hidden" aria-live="polite">Syntropix is typing…</div><form class="chat-compose"><label class="sr-only" for="sx-chat-input">Your message</label><textarea id="sx-chat-input" rows="1" maxlength="1500" placeholder="Write a message…" required></textarea><button type="submit" aria-label="Send message">${iconChat()}</button></form><p class="chat-note">Messages stay in this secure Concierge. <a class="chat-wa-link" href="${API}/chat/whatsapp" target="_blank" rel="noopener noreferrer">Continue in WhatsApp →</a></p>`;panel.querySelector('.chat-close').addEventListener('click',()=>{panel.classList.add('hidden');stopChatPoll()});panel.querySelector('.chat-compose').addEventListener('submit',sendBridgeMessage)}function setChatActivity(show,text='Syntropix is typing…'){const el=document.querySelector('.chat-activity');if(!el)return;el.textContent=text;el.classList.toggle('hidden',!show)}async function createChatSession(){const r=await fetch(`${API}/chat/sessions`,{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});const j=await r.json();if(!r.ok||!j.session)throw new Error(j.message||'Unable to start chat');localStorage.setItem(CHAT_SESSION_KEY,j.session);return j.session}async function getChatSession(){let token=localStorage.getItem(CHAT_SESSION_KEY);if(token)return token;return createChatSession()}async function resetChatSession(){localStorage.removeItem(CHAT_SESSION_KEY);renderedMessageIds.clear();lastOperatorCount=0;return createChatSession()}async function openChat(){const panel=document.querySelector('#chat5');if(!panel)return;panel.classList.remove('hidden');try{await getChatSession();await pollChat(true);startChatPoll()}catch(e){addChatBubble('bot','Live messaging is temporarily unavailable. Please try again shortly.')}setTimeout(()=>panel.querySelector('textarea')?.focus(),80)}function addChatBubble(kind,text,id){if(id&&renderedMessageIds.has(id))return;const messages=document.querySelector('.chat-messages');if(!messages)return;const el=document.createElement('div');el.className=`chat-message ${kind}`;el.textContent=text;messages.appendChild(el);if(id)renderedMessageIds.add(id);messages.scrollTop=messages.scrollHeight}async function sendBridgeMessage(e){e.preventDefault();const form=e.currentTarget,input=form.querySelector('textarea'),button=form.querySelector('button'),text=input.value.trim().slice(0,1500);if(!text)return;button.disabled=true;addChatBubble('user',text);input.value='';setChatActivity(true,'Sending…');try{let token=await getChatSession();let r=await fetch(`${API}/chat/sessions/${token}/messages`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:text})});if(r.status===404){token=await resetChatSession();r=await fetch(`${API}/chat/sessions/${token}/messages`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:text})})}const j=await r.json();if(!r.ok)throw new Error(j.message||'Delivery failed');if(j.messageId)renderedMessageIds.add(j.messageId);setChatActivity(true,'Delivered to Syntropix · awaiting reply…');startChatPoll()}catch(err){setChatActivity(false);addChatBubble('bot','That message could not be delivered. Please try again.')}finally{button.disabled=false;input.focus()}}async function pollChat(force=false){let token=localStorage.getItem(CHAT_SESSION_KEY);if(!token)return;try{let r=await fetch(`${API}/chat/sessions/${token}/messages`,{cache:'no-store'});if(r.status===404){await resetChatSession();return}const j=await r.json();if(!r.ok)return;let operatorCount=0;const messages=j.messages||[];messages.forEach(m=>{if(m.direction==='operator'){operatorCount++;addChatBubble('bot',m.body,m.id)}else if(m.direction==='visitor'){addChatBubble('user',m.body,m.id)}});const last=messages[messages.length-1];if(last?.direction==='operator')setChatActivity(false);else if(last?.direction==='visitor')setChatActivity(true,'Delivered to Syntropix · awaiting reply…');if(!force&&operatorCount>lastOperatorCount&&document.hidden){document.title=`(${operatorCount-lastOperatorCount}) Syntropix reply`;setTimeout(()=>{document.title=document.title.replace(/^\(\d+\) /,'')},5000)}lastOperatorCount=Math.max(lastOperatorCount,operatorCount)}catch{}}function startChatPoll(){stopChatPoll();chatPoll=setInterval(()=>pollChat(false),3000)}function stopChatPoll(){if(chatPoll){clearInterval(chatPoll);chatPoll=null}}document.addEventListener('visibilitychange',()=>{if(!document.hidden&&document.querySelector('#chat5:not(.hidden)'))pollChat(true)});document.addEventListener('DOMContentLoaded',()=>{syncCanonicalNav();setupEliteNavigation();syncCanonicalNav();setupFloatingActions();document.querySelectorAll('.lead-form').forEach(f=>f.addEventListener('submit',submitLead))});window.addEventListener('pageshow',syncCanonicalNav);window.addEventListener('storage',syncCanonicalNav);async function submitLead(e){e.preventDefault();const f=e.currentTarget,s=f.querySelector('.form-status'),b=f.querySelector('button[type=submit]');const d=Object.fromEntries(new FormData(f).entries());if(d.website)return;const stagingPreview=location.hostname==='syntropix-v7-staging.onrender.com';if(stagingPreview){s.dataset.staging='true';s.textContent='Staging preview: this enquiry was not sent. Production email delivery remains unchanged.';return}s.removeAttribute('data-staging');s.textContent='Sending…';b.disabled=true;try{const message=`Company: ${d.company||'—'}\nMobile: ${d.mobile||'—'}\nRole: ${d.role||'—'}\nTeam size: ${d.size||'—'}\nInterest: ${d.interest||'—'}\n\n${d.query||''}`;const r=await fetch(`${API}/contact/message`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:d.name,contact:d.email||d.mobile,message,source:d.source||'website_v5',hp:d.website||''})});const j=await r.json();if(!r.ok||j.status!=='success')throw new Error(j.message||'Unable to send');s.textContent='Thank you. Your enquiry has been sent to Syntropix.';f.reset()}catch(err){s.textContent='We could not send this form right now. Please email contact@syntropix.in.'}finally{b.disabled=false}};(()=>{'use strict';
function enhanceNav(){
 const path=(location.pathname||'/').replace(/\/$/,'')||'/';
 document.querySelectorAll('.v5nav nav>a').forEach(a=>{
   const href=(new URL(a.href,location.href)).pathname.replace(/\/$/,'')||'/';
   if(href===path)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');
 });
 document.querySelectorAll('.v5nav').forEach(nav=>{
   const menu=nav.querySelector('.menu5');if(!menu||menu.dataset.premiumBound)return;menu.dataset.premiumBound='1';
   menu.addEventListener('click',()=>requestAnimationFrame(()=>document.body.classList.toggle('sx-nav-open',nav.classList.contains('open'))));
   nav.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>document.body.classList.remove('sx-nav-open')));
 });
}
function enhanceTables(){
 document.querySelectorAll('.cred-table').forEach(table=>{
   const heads=[...table.querySelectorAll('thead th')].map(th=>th.textContent.trim());
   table.querySelectorAll('tbody tr').forEach(tr=>[...tr.children].forEach((td,i)=>{if(!td.dataset.label)td.dataset.label=heads[i]||''}));
 });
}
function enhanceForms(){
 document.querySelectorAll('input,textarea').forEach(el=>{
   const n=(el.name||el.id||'').toLowerCase();
   if((el.type==='email'||n.includes('email'))&&!el.autocomplete)el.autocomplete='email';
   if((el.type==='tel'||n.includes('mobile')||n.includes('phone'))){el.inputMode='tel';if(!el.autocomplete)el.autocomplete='tel'}
   if((n==='name'||n.includes('fullname'))&&!el.autocomplete)el.autocomplete='name';
   if(n.includes('company')&&!el.autocomplete)el.autocomplete='organization';
 });
}
const categoryMap={
 'cognimorph':'Adaptability','coachability':'Adaptability','adaptive-capacity':'Adaptability',
 'metacognitive-executive':'Thinking','cognitive-learning-profiler':'Thinking','strategic-inversion':'Thinking',
 'managerial-effectiveness':'Leadership','executive-leadership':'Leadership',
 'commercial-instinct':'Commercial','communication-signature':'Communication',
 'relationship-intimacy-blueprint':'Relationships','relationship-dynamics':'Relationships','social-signal':'Relationships',
 'career-navigation':'Career & Work','work-life-fit':'Career & Work','self-limiting-belief':'Career & Work'
};
function cardKey(card){
 const a=card.querySelector('a[href*="assessment="]');if(!a)return '';
 try{return new URL(a.href,location.href).searchParams.get('assessment')||''}catch{return ''}
}
function deferMobileContactDock(){
 const hero=document.querySelector('.sx-hero,.hero5');
 if(!hero||!matchMedia('(max-width:760px)').matches){document.body.classList.remove('sx-hero-contact-defer');return}
 const sync=()=>{const r=hero.getBoundingClientRect();document.body.classList.toggle('sx-hero-contact-defer',r.bottom>innerHeight-40&&r.top<innerHeight)};
 sync();
 if(!hero.dataset.contactDockObserver){
   hero.dataset.contactDockObserver='1';
   const io=new IntersectionObserver(sync,{threshold:[0,.05,.2,.5,1]});io.observe(hero);
   addEventListener('scroll',sync,{passive:true});addEventListener('resize',sync,{passive:true});
 }
}
function enhancePortfolio(){
 if(!document.body.classList.contains('v6-individual'))return;
 const section=document.querySelector('.assessment-catalogue-inline'),grid=section?.querySelector('.assessment-grid');if(!section||!grid)return;
 if(section.querySelector('.sx-portfolio-navigator'))return;
 const nav=document.createElement('div');nav.className='sx-portfolio-navigator';
 nav.innerHTML='<div class="sx-portfolio-search"><label for="sx-assessment-search">Find an assessment</label><input id="sx-assessment-search" type="search" inputmode="search" autocomplete="off" placeholder="Search by topic or assessment name"></div><div class="sx-portfolio-filters" role="group" aria-label="Filter assessments"><button type="button" data-filter="All" aria-pressed="true">All</button><button type="button" data-filter="Leadership">Leadership</button><button type="button" data-filter="Adaptability">Adaptability</button><button type="button" data-filter="Thinking">Thinking</button><button type="button" data-filter="Communication">Communication</button><button type="button" data-filter="Commercial">Commercial</button><button type="button" data-filter="Career & Work">Career & work</button><button type="button" data-filter="Relationships">Relationships</button></div><p class="sx-portfolio-result" aria-live="polite"></p>';
 grid.before(nav);
 const input=nav.querySelector('input'),buttons=[...nav.querySelectorAll('[data-filter]')],result=nav.querySelector('.sx-portfolio-result');
 let filter='All';
 const apply=()=>{
   const q=input.value.trim().toLowerCase();let visible=0;
   [...grid.querySelectorAll('.assessment-card')].forEach(card=>{
     const key=cardKey(card),cat=categoryMap[key]||'Other',text=card.textContent.toLowerCase();
     const show=(filter==='All'||cat===filter)&&(!q||text.includes(q));card.hidden=!show;if(show)visible++;
   });
   result.textContent=visible+' assessment'+(visible===1?'':'s')+' shown';
 };
 buttons.forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;buttons.forEach(x=>x.setAttribute('aria-pressed',String(x===b)));apply()}));
 input.addEventListener('input',apply);
 const mo=new MutationObserver(apply);mo.observe(grid,{childList:true});apply();
}
function init(){enhanceNav();enhanceTables();enhanceForms();enhancePortfolio();deferMobileContactDock()}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',()=>{init();setTimeout(init,350)},{once:true}):(init(),setTimeout(init,350));
window.addEventListener('pageshow',enhanceNav);
})();

;(()=>{'use strict';
function syncGoldNav(nav){
  const menu=nav.querySelector('.menu5'),panel=nav.querySelector('nav');if(!menu||!panel)return;
  const open=nav.classList.contains('open');
  menu.setAttribute('aria-expanded',String(open));
  menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');
  const label=menu.querySelector('.sx-menu-label');if(label)label.textContent=open?'Close':'Menu';
  if(!open&&matchMedia('(max-width:1100px)').matches){
    const products=nav.querySelector('.nav-products');
    products?.classList.remove('products-open');
    products?.querySelector('.nav-products-trigger')?.setAttribute('aria-expanded','false');
  }
  document.body.classList.toggle('sx-nav-open',Boolean(document.querySelector('.v5nav.open')));
}
function installGoldNav(){
  document.querySelectorAll('.v5nav').forEach((nav,i)=>{
    const menu=nav.querySelector('.menu5'),panel=nav.querySelector('nav');if(!menu||!panel)return;
    if(!panel.id)panel.id='sx-primary-nav-'+i;
    menu.setAttribute('aria-controls',panel.id);
    if(!menu.querySelector('.sx-menu-label'))menu.insertAdjacentHTML('beforeend','<span class="sx-menu-label">Menu</span>');
    const products=nav.querySelector('.nav-products'),trigger=products?.querySelector('.nav-products-trigger'),sub=products?.querySelector('.nav-products-menu');
    if(trigger&&sub){
      if(!sub.id)sub.id='sx-product-nav-'+i;
      trigger.setAttribute('aria-controls',sub.id);
    }
    if(!menu.dataset.goldNavBound){
      menu.dataset.goldNavBound='1';
      menu.addEventListener('click',()=>requestAnimationFrame(()=>syncGoldNav(nav)));
      panel.addEventListener('click',e=>{
        if(e.target.closest('a'))requestAnimationFrame(()=>syncGoldNav(nav));
        if(e.target.closest('.nav-products-trigger'))requestAnimationFrame(()=>syncGoldNav(nav));
      });
    }
    syncGoldNav(nav);
  });
}
document.addEventListener('click',()=>requestAnimationFrame(()=>document.querySelectorAll('.v5nav').forEach(syncGoldNav)));
document.addEventListener('keydown',e=>{
  if(e.key!=='Escape')return;
  document.querySelectorAll('.v5nav.open').forEach(nav=>{
    const menu=nav.querySelector('.menu5');
    nav.classList.remove('open');
    nav.querySelector('.nav-products')?.classList.remove('products-open');
    syncGoldNav(nav);
    menu?.focus();
  });
});
const desktopMq=matchMedia('(min-width:1101px)');
const closeOnDesktop=e=>{
  if(!e.matches)return;
  document.querySelectorAll('.v5nav.open').forEach(nav=>{nav.classList.remove('open');syncGoldNav(nav)});
};
desktopMq.addEventListener?.('change',closeOnDesktop);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',installGoldNav);else installGoldNav();
window.addEventListener('pageshow',installGoldNav);
})();