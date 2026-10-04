(()=>{'use strict';
function closeNav(nav){
  nav.classList.remove('open');
  document.body.classList.remove('sx-nav-open');
  const menu=nav.querySelector('.menu5');
  menu?.setAttribute('aria-expanded','false');
  menu?.setAttribute('aria-label','Open navigation');
  const label=menu?.querySelector('.sx-menu-label');
  if(label)label.textContent='Menu';
}
function refineHomepageNav(){
  if(!document.body.classList.contains('sx-v7'))return;
  document.querySelectorAll('.v5nav').forEach(nav=>{
    const panel=nav.querySelector('nav');
    if(!panel||panel.dataset.v7Nav==='1')return;

    const org=[...panel.querySelectorAll(':scope > a')].find(a=>/Organizations/i.test(a.textContent));
    const pro=[...panel.querySelectorAll(':scope > a')].find(a=>/Individuals|Professionals/i.test(a.textContent));
    const sol=[...panel.querySelectorAll(':scope > a')].find(a=>/Solutions/i.test(a.textContent));
    const company=[...panel.querySelectorAll(':scope > a')].find(a=>/Our Story|Company/i.test(a.textContent));
    const mobileAuth=panel.querySelector('[data-mobile-auth]');
    const how=document.createElement('a');
    how.href='/#how-it-works';
    how.textContent='How it works';

    panel.replaceChildren();
    panel.append(how);
    if(sol)panel.append(sol);
    if(org)panel.append(org);
    if(pro){pro.textContent='Professionals';panel.append(pro)}
    if(company){company.textContent='Company';panel.append(company)}
    if(mobileAuth)panel.append(mobileAuth);

    panel.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>closeNav(nav)));
    panel.dataset.v7Nav='1';
  });
}
function init(){
  refineHomepageNav();
  requestAnimationFrame(refineHomepageNav);
  setTimeout(refineHomepageNav,250);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
window.addEventListener('pageshow',init);
})();