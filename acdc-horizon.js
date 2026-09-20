const qs=new URLSearchParams(location.search);
const token=qs.get('token')||'';
const demo=qs.get('demo')==='1';
const allowedApis=new Set([
  'https://syntropix-backend.onrender.com/api/acdc',
  'https://syntropix-backend-1.onrender.com/api/acdc'
]);
const requestedApi=(qs.get('api')||'').replace(/\/$/,'');
const API=allowedApis.has(requestedApi)?requestedApi:'https://syntropix-backend.onrender.com/api/acdc';
const $=id=>document.getElementById(id);
let context=null,currentExercise=null,currentSession=null,selectedEvent=null,activeChannel='all',events=[],timerHandle=null,secondsLeft=0,demoActionCount=0;
const demoContext={
  participant:{id:'demo',name:'Alex Morgan',consent_at:null,status:'opened'},
  programme:{
    id:'demo-program',name:'Northstar Business Unit Manager Centre',role_name:'Business Unit Manager',mode:'hybrid',
    purpose:'Observe managerial judgement, execution, people leadership, stakeholder influence and adaptability through realistic work simulations.',
    methodology_version:'acdc-v0.1',scenario_version:'manager-v0.1'
  },
  exercises:[
    {id:'demo-workday',code:'northstar_workday',name:'Northstar Workday',type:'workday',sequence:1,duration_minutes:45,participant_brief:'You are the newly appointed Business Unit Manager at Northstar Consumer Technologies. Work through the information presented, respond as you would at work, and make your own prioritisation and communication decisions.',delivery:'digital'},
    {id:'demo-roleplay',code:'people_leadership_conversation',name:'People Leadership Conversation',type:'role_play',sequence:2,duration_minutes:25,participant_brief:'Conduct a conversation with a previously strong team member whose delivery and working relationships have deteriorated.',delivery:'live_role_player'},
    {id:'demo-case',code:'business_case_recommendation',name:'Business Case Recommendation',type:'business_case',sequence:3,duration_minutes:55,participant_brief:'Review the business pack and present a recommendation with priorities, risks and an execution path.',delivery:'digital'}
  ],
  boundaries:{ai_scoring:false}
};
const demoEventBank=[
  {event_key:'NW-001',sequence:10,channel:'inbox',title:'Customer escalation: Meridian Retail',body:'Meridian Retail has escalated a service failure affecting a strategic launch. Their COO wants a recovery plan before noon and has copied your commercial director.'},
  {event_key:'NW-002',sequence:20,channel:'inbox',title:'CFO request: cost reduction proposal',body:'Finance needs a credible 6% controllable-cost reduction proposal by 16:00. The CFO asks you to protect customer-critical capability and identify implementation risk.'},
  {event_key:'NW-003',sequence:30,channel:'chat',title:'Team message: delivery conflict',body:'Two managers are disputing ownership of a delayed launch task. Each says the other team failed to provide the required input.'},
  {event_key:'NW-004',sequence:40,channel:'notification',title:'Change in circumstances',body:'Your highest-volume channel has moved tomorrow\'s promotion forward by 24 hours. The current service recovery plan will now collide with peak demand.'},
  {event_key:'NW-005',sequence:50,channel:'inbox',title:'Resignation notice',body:'Your operations lead has resigned with immediate effect for personal reasons. She owns two critical recovery actions already scheduled for today.'}
];

async function post(path,body={}){
  const r=await fetch(API+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),cache:'no-store'});
  const text=await r.text();let data={};
  try{data=text?JSON.parse(text):{}}catch(_){throw new Error('The simulation service returned an unreadable response.')}
  if(!r.ok||data.status==='error')throw new Error(data.message||'Request failed.');
  return data;
}
function show(id){
  ['loadingView','welcomeView','workspaceView','exerciseCompleteView','finishedView'].forEach(x=>$(x)?.classList.add('hidden'));
  $(id)?.classList.remove('hidden');
}
function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function modeLabel(mode){return mode==='ac'?'Assessment Centre':mode==='dc'?'Development Centre':'AC + DC Hybrid'}
function channelLabel(channel){return ({inbox:'Inbox',chat:'Messages',calendar:'Calendar',document:'Documents',task:'Tasks',notification:'Priority update'})[channel]||channel}
function syncClock(){
  const d=new Date();$('clock').textContent=d.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit',hour12:false});
}
function renderWelcome(){
  $('programmeName').textContent=context.programme.name;
  $('roleName').textContent=context.programme.role_name;
  $('modeName').textContent=modeLabel(context.programme.mode);
  $('exerciseCount').textContent=String(context.exercises.length);
  $('programmeIntro').textContent=context.programme.purpose||'You will work through a structured set of realistic work situations.';
  $('consentCheck').checked=Boolean(context.participant.consent_at);
  show('welcomeView');
}
function renderEvents(){
  const visible=events.filter(e=>activeChannel==='all'||e.channel===activeChannel);
  const feed=$('eventFeed');feed.innerHTML='';
  $('emptyFeed').classList.toggle('hidden',visible.length>0);
  for(const e of visible){
    const card=document.createElement('article');card.className='event-card'+(selectedEvent?.event_key===e.event_key?' selected':'');card.dataset.channel=e.channel;
    card.innerHTML='<div class="meta"><span class="channel-dot"></span><small>'+esc(channelLabel(e.channel))+' · '+String(e.sequence||'').padStart(2,'0')+'</small></div><h3>'+esc(e.title||'Update')+'</h3><p>'+esc(e.body||'')+'</p>';
    card.onclick=()=>selectEvent(e);feed.appendChild(card);
  }
}
function selectEvent(e){
  selectedEvent=e;$('noSelection').classList.add('hidden');$('selectionPanel').classList.remove('hidden');
  $('selectedChannel').textContent=channelLabel(e.channel);$('selectedTitle').textContent=e.title||'Update';$('selectedBody').textContent=e.body||'';
  $('responseText').value='';$('responseStatus').textContent='';renderEvents();$('responseText').focus();
}
function addEvents(incoming){
  for(const e of incoming||[])if(!events.some(x=>x.event_key===e.event_key))events.push(e);
  events.sort((a,b)=>Number(a.sequence||0)-Number(b.sequence||0));renderEvents();
}
function startTimer(minutes){
  clearInterval(timerHandle);secondsLeft=Math.max(0,Number(minutes||0)*60);
  const tick=()=>{const m=Math.floor(secondsLeft/60),s=secondsLeft%60;$('exerciseTimer').textContent=String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');if(secondsLeft>0)secondsLeft--;};
  tick();timerHandle=setInterval(tick,1000);
}
function setupCompleteButton(){
  let b=document.getElementById('completeExerciseButton');if(b)return;
  b=document.createElement('button');b.id='completeExerciseButton';b.className='primary';b.textContent='Complete exercise';
  b.onclick=completeExercise;document.querySelector('.evidence-note')?.after(b);
}
async function begin(){
  $('welcomeError').textContent='';
  if(!$('consentCheck').checked){$('welcomeError').textContent='Please confirm consent before entering the simulation.';return}
  try{
    if(!demo&&!context.participant.consent_at){await post('/participant/consent',{token,consent:true});context.participant.consent_at=new Date().toISOString()}
    const first=context.exercises.find(x=>x.type==='workday'||x.delivery==='digital')||context.exercises[0];
    await startExercise(first);
  }catch(e){$('welcomeError').textContent=e.message}
}
async function startExercise(exercise){
  currentExercise=exercise;selectedEvent=null;events=[];demoActionCount=0;
  $('exerciseName').textContent=exercise.name;$('exerciseBrief').textContent=exercise.participant_brief||'Respond as you would at work.';
  $('selectionPanel').classList.add('hidden');$('noSelection').classList.remove('hidden');setupCompleteButton();
  if(demo){
    currentSession={id:'demo-session',status:'in_progress'};addEvents(demoEventBank.slice(0,2));
  }else{
    const out=await post('/participant/start',{token,exercise_id:exercise.id});currentSession=out.session;addEvents(out.events||[]);
  }
  startTimer(exercise.duration_minutes||45);show('workspaceView');renderEvents();
}
async function submitResponse(){
  if(!selectedEvent)return;
  const text=$('responseText').value.trim();if(!text){$('responseStatus').textContent='Enter a response before submitting.';return}
  $('submitResponse').disabled=true;$('responseStatus').textContent='Recording response…';
  try{
    if(demo){
      demoActionCount++;
      const incoming=[];
      if(demoActionCount===1)incoming.push(demoEventBank[2]);
      if(demoActionCount===2)incoming.push(demoEventBank[3]);
      if(demoActionCount===3)incoming.push(demoEventBank[4]);
      addEvents(incoming);
    }else{
      const out=await post('/participant/action',{token,exercise_id:currentExercise.id,event_key:selectedEvent.event_key,action_type:'response',payload:{text},occurred_at:new Date().toISOString()});
      addEvents(out.events||[]);
    }
    $('responseText').value='';$('responseStatus').textContent='Response securely recorded.';
    const card=[...document.querySelectorAll('.event-card')].find(x=>x.textContent.includes(selectedEvent.title||''));if(card)card.style.opacity='.72';
  }catch(e){$('responseStatus').textContent=e.message}finally{$('submitResponse').disabled=false}
}
async function completeExercise(){
  if(!currentExercise)return;
  try{
    if(!demo)await post('/participant/complete',{token,exercise_id:currentExercise.id});
    clearInterval(timerHandle);
    const remaining=context.exercises.filter(x=>x.sequence>currentExercise.sequence);
    $('nextExerciseList').innerHTML=remaining.length?'<div class="notice"><strong>Remaining programme components</strong><p>'+remaining.map(x=>esc(x.name)+' · '+esc(x.delivery==='live_role_player'?'facilitated':'scheduled')).join('<br>')+'</p></div>':'';
    show('exerciseCompleteView');
    $('nextExerciseButton').onclick=()=>{
      const nextDigital=remaining.find(x=>x.delivery==='digital'&&x.type!=='resimulation');
      if(nextDigital)startExercise(nextDigital).catch(e=>{$('welcomeError').textContent=e.message;show('welcomeView')});else show('finishedView');
    };
  }catch(e){$('responseStatus').textContent=e.message}
}
function wireChannels(){
  document.querySelectorAll('.rail-item').forEach(b=>b.onclick=()=>{
    activeChannel=b.dataset.channel;document.querySelectorAll('.rail-item').forEach(x=>x.classList.toggle('active',x===b));renderEvents();
  });
}
async function boot(){
  syncClock();setInterval(syncClock,30000);wireChannels();$('beginButton').onclick=begin;$('submitResponse').onclick=submitResponse;
  try{
    if(demo){context=demoContext;$('loadingMessage').textContent='Demo environment ready.';renderWelcome();return}
    if(!token)throw new Error('This participant link is incomplete. Please use the secure invitation supplied for your centre.');
    context=await post('/participant/open',{token});renderWelcome();
  }catch(e){$('loadingMessage').textContent=e.message}
}
boot();