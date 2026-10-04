(()=>{'use strict';

function makeDisclosure(section,grid,label){
  if(!section||!grid||grid.dataset.v7Disclosure==='1')return;
  const id='v7-grid-'+Math.random().toString(36).slice(2,8);
  grid.id=grid.id||id;
  grid.hidden=true;
  grid.classList.add('v7-collapsed-grid');
  grid.dataset.v7Disclosure='1';
  const button=document.createElement('button');
  button.type='button';
  button.className='v7-catalogue-toggle';
  button.setAttribute('aria-expanded','false');
  button.setAttribute('aria-controls',grid.id);
  button.innerHTML='<span>'+label+'</span><span aria-hidden="true">＋</span>';
  button.addEventListener('click',()=>{
    const open=button.getAttribute('aria-expanded')==='true';
    button.setAttribute('aria-expanded',String(!open));
    grid.hidden=open;
    button.lastElementChild.textContent=open?'＋':'−';
  });
  grid.before(button);
}
function refineLongCatalogues(){
  if(document.body.classList.contains('sx-v7-professionals')){
    [...document.querySelectorAll('section')].forEach(section=>{
      const h=[...section.querySelectorAll('h2')].find(x=>/Twelve assessments for different chapters of adult life|Go deeper on a specific pattern/i.test(x.textContent));
      const grid=h?section.querySelector('.assessment-grid'):null;
      if(h&&grid&&matchMedia('(min-width:1101px)').matches)makeDisclosure(section,grid,'Browse focused development assessments');
    });
  }
  if(document.body.classList.contains('sx-v7-organizations')){
    [...document.querySelectorAll('section')].forEach(section=>{
      const h=[...section.querySelectorAll('h2')].find(x=>/Additional Syntropix assessment portfolio/i.test(x.textContent));
      let grid=null;
      if(h){
        let node=h.nextElementSibling;
        while(node&&!grid){
          if(node.matches&&node.matches('.assessment-grid.enterprise-grid'))grid=node;
          node=node.nextElementSibling;
        }
      }
      if(h&&grid)makeDisclosure(section,grid,'Explore the additional assessment portfolio');
    });
  }
}

function refine(){
  if(!document.body.classList.contains('sx-v7-journey')||document.body.classList.contains('sx-v7-nav'))return;
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
const init=()=>{refine();refineLongCatalogues();requestAnimationFrame(()=>{refine();refineLongCatalogues()});setTimeout(()=>{refine();refineLongCatalogues()},120);setTimeout(()=>{refine();refineLongCatalogues()},420)};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
window.addEventListener('pageshow',init);
})();