(()=>{'use strict';
const canvas=document.getElementById('story-syntropy-canvas');
if(!canvas)return;
const ctx=canvas.getContext('2d',{alpha:true});
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
let particles=[],w=0,h=0,dpr=1,raf=0,running=false,start=performance.now();

function seeded(i,salt=0){const x=Math.sin((i+1)*12.9898+salt*78.233)*43758.5453;return x-Math.floor(x)}
function targetFor(i,count){
  const cols=Math.max(9,Math.round(Math.sqrt(count*1.6))),rows=Math.ceil(count/cols);
  const c=i%cols,r=Math.floor(i/cols);
  const nx=cols<=1?.5:c/(cols-1), ny=rows<=1?.5:r/(rows-1);
  const wave=Math.sin(nx*Math.PI*2)*.035;
  return {x:w*(.57+nx*.33),y:h*(.22+ny*.56+wave)};
}
function reset(){
  const rect=canvas.getBoundingClientRect();dpr=Math.min(devicePixelRatio||1,2);
  w=Math.max(1,rect.width);h=Math.max(1,rect.height);
  canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
  const count=w<500?96:w<800?132:168;
  particles=Array.from({length:count},(_,i)=>{
    const t=targetFor(i,count);
    return {i,x:w*(.08+seeded(i,1)*.36),y:h*(.13+seeded(i,2)*.72),tx:t.x,ty:t.y,
      phase:seeded(i,3)*Math.PI*2,size:1.1+seeded(i,4)*1.7,delay:seeded(i,5)*.22};
  });
  draw(reduce.matches?1:.02,0);
}
function ease(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2}
function state(now){
  if(reduce.matches)return {p:1,pulse:.4};
  const cycle=((now-start)%11500)/11500;
  let p,pulse=0;
  if(cycle<.17)p=0;
  else if(cycle<.64)p=ease((cycle-.17)/.47);
  else if(cycle<.84){p=1;pulse=(cycle-.64)/.2}
  else p=1-ease((cycle-.84)/.16);
  return {p,pulse};
}
function draw(progress,pulse){
  ctx.clearRect(0,0,w,h);
  const grad=ctx.createLinearGradient(0,0,w,0);
  grad.addColorStop(0,'rgba(247,231,206,.08)');
  grad.addColorStop(.55,'rgba(157,193,131,.035)');
  grad.addColorStop(1,'rgba(80,200,120,.09)');
  ctx.fillStyle=grad;ctx.fillRect(0,0,w,h);

  ctx.lineWidth=.65;
  for(let j=0;j<5;j++){
    ctx.beginPath();
    for(let x=0;x<=w;x+=14){
      const n=x/w, yy=h*(.24+j*.13)+Math.sin(n*5.2+j)*10*(1-n);
      x===0?ctx.moveTo(x,yy):ctx.lineTo(x,yy);
    }
    ctx.strokeStyle='rgba(157,193,131,.055)';ctx.stroke();
  }

  const p=Math.max(0,Math.min(1,progress));
  particles.forEach(o=>{
    const local=Math.max(0,Math.min(1,(p-o.delay)/(1-o.delay)));
    const e=ease(local);
    const chaos=(1-e);
    const driftX=Math.sin(o.phase+p*12)*10*chaos;
    const driftY=Math.cos(o.phase*.8+p*10)*8*chaos;
    const x=o.x+(o.tx-o.x)*e+driftX;
    const y=o.y+(o.ty-o.y)*e+driftY;
    const structured=x>w*.54;
    const alpha=.28+.58*e;
    ctx.beginPath();ctx.arc(x,y,o.size*(.82+.22*e),0,Math.PI*2);
    ctx.fillStyle=structured?'rgba(80,200,120,'+alpha+')':'rgba(247,231,206,'+(.35+.35*(1-e))+')';ctx.fill();
  });

  if(p>.62){
    const a=(p-.62)/.38;
    ctx.save();ctx.globalAlpha=Math.min(.78,a);
    ctx.strokeStyle='rgba(214,184,120,.58)';ctx.lineWidth=1;
    const y=h*.5;ctx.beginPath();ctx.moveTo(w*.57,y);ctx.lineTo(w*.9,y);ctx.stroke();
    [0,.25,.5,.75,1].forEach((n,k)=>{
      const x=w*(.57+n*.33);ctx.beginPath();ctx.arc(x,y,3.1+(pulse>.1?Math.sin(pulse*Math.PI+k)*.6:0),0,Math.PI*2);
      ctx.fillStyle=k===4?'rgba(214,184,120,.95)':'rgba(157,193,131,.9)';ctx.fill();
    });ctx.restore();
  }
}
function frame(now){if(!running)return;const s=state(now);draw(s.p,s.pulse);raf=requestAnimationFrame(frame)}
function setRunning(on){if(on===running)return;running=on;if(on){raf=requestAnimationFrame(frame)}else cancelAnimationFrame(raf)}
const io=new IntersectionObserver(es=>setRunning(Boolean(es[0]&&es[0].isIntersecting)&&!document.hidden&&!reduce.matches),{threshold:.12});
io.observe(canvas);
document.addEventListener('visibilitychange',()=>setRunning(!document.hidden&&canvas.getBoundingClientRect().bottom>0&&canvas.getBoundingClientRect().top<innerHeight&&!reduce.matches));
if(reduce.addEventListener)reduce.addEventListener('change',()=>{reset();setRunning(!reduce.matches)});
new ResizeObserver(reset).observe(canvas);
reset();if(!reduce.matches)setRunning(true);
})();