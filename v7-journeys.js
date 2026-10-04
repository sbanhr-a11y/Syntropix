(()=>{'use strict';
function refine(){
  if(!document.body.classList.contains('sx-v7-journey'))return;
  document.querySelectorAll('.v5nav').forEach(nav=>{
    const panel=nav.querySelector('nav'); if(!panel)return;
    const current=[...panel.querySelectorAll(':scope > a')].map(a=>a.textContent.trim());
    if(current.includes('How it works')&&current.includes('Professionals')&&!panel.querySelector('.nav-products'))return;
    const links=[...panel.querySelectorAll(':scope > a')];
    const org=links.find(a=>/Organizations/i.test(a.textContent));
    const pro=links.find(a=>/Individuals|Professionals/i.test(a.textContent));
    const sol=links.find(a=>/Solutions/i.test(a.textContent));
    const company=links.find(a=>/Our Story|Company/i.test(a.textContent));
    const mobileAuth=panel.querySelector('[data-mobile-auth]');
    const how=document.createElement('a'); how.href='/#how-it-works'; how.textContent='How it works';
    panel.replaceChildren(how);
    if(sol)panel.append(sol);
    if(org)panel.append(org);
    if(pro){pro.textContent='Professionals';panel.append(pro)}
    if(company){company.textContent='Company';panel.append(company)}
    if(mobileAuth)panel.append(mobileAuth);
    panel.dataset.v7JourneyNav='1';
  });
}
const init=()=>{refine();requestAnimationFrame(refine);setTimeout(refine,120);setTimeout(refine,420)};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
window.addEventListener('pageshow',init);
})();