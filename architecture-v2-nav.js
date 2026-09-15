(function(){
  'use strict';
  var links=[
    {href:'/enterprise.html',label:'Organizations'},
    {href:'/professionals.html',label:'Professionals'},
    {href:'/science.html',label:'Evidence'},
    {href:'/trust.html',label:'Trust'}
  ];
  function install(){
    if(document.getElementById('architecture-v2-nav')) return;
    var bar=document.createElement('div');
    bar.id='architecture-v2-nav';
    bar.setAttribute('role','navigation');
    bar.setAttribute('aria-label','Syntropix audience and trust navigation');
    bar.style.cssText='position:relative;z-index:60;background:#020617;border-bottom:1px solid #1e293b;color:#cbd5e1;font-family:Inter,system-ui,sans-serif';
    var inner=document.createElement('div');
    inner.style.cssText='max-width:1280px;margin:auto;padding:8px 24px;display:flex;gap:18px;justify-content:flex-end;align-items:center;flex-wrap:wrap;font-size:12px';
    var prefix=document.createElement('span');
    prefix.textContent='Explore Syntropix:';
    prefix.style.cssText='color:#64748b';
    inner.appendChild(prefix);
    links.forEach(function(item){
      var a=document.createElement('a');
      a.href=item.href;
      a.textContent=item.label;
      a.style.cssText='color:#cbd5e1;text-decoration:none;font-weight:600';
      a.addEventListener('mouseenter',function(){a.style.color='#fff';});
      a.addEventListener('mouseleave',function(){a.style.color='#cbd5e1';});
      inner.appendChild(a);
    });
    bar.appendChild(inner);
    document.body.insertBefore(bar,document.body.firstChild);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',install); else install();
})();
