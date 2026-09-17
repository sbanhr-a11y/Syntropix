(()=>{'use strict';
const KEY='syntropix_region';
function emit(region,source){
  if(!region)return;
  window.dispatchEvent(new CustomEvent('syntropix:regionchange',{detail:{region,source:source||'runtime'}}));
}
document.addEventListener('change',event=>{
  const select=event.target;
  if(!(select instanceof HTMLSelectElement)||select.id!=='region')return;
  const region=select.value;
  if(!region)return;
  localStorage.setItem(KEY,region);
  queueMicrotask(()=>emit(region,'runtime'));
});
window.addEventListener('storage',event=>{
  if(event.key!==KEY||!event.newValue)return;
  const select=document.getElementById('region');
  if(select&&select.value!==event.newValue){
    select.value=event.newValue;
    select.dispatchEvent(new Event('change',{bubbles:true}));
  }else emit(event.newValue,'storage');
});
})();
