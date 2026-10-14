// crowd: 1 Low · 2 Moderate · 3 High. leaveBy = latest time to leave home and still catch it (I01).
const scenarios = {
  disruption: {
    clock:"8:06", overline:"WEDNESDAY · OFFICE DAY", greeting:"Morning, Alex", alertClass:"", alertIcon:"!",
    alertTitle:"North Shore Line disruption",
    alertCopy:"Reduced frequency is increasing platform crowding. Recovery time unknown · updated 2 min ago, next update 8:15.",
    confidence:78, updated:"2 min ago", target:"8:58",
    trip:["Wollstonecraft","Wynyard","Leave from 8:08","Arrive by 8:58"],
    options:[
      { id:"take", icon:"→", iconClass:"", title:"Take the next train", subtitle:"Departs 8:14 · Platform 1", leaveBy:"8:08", minutes:48, arrival:"8:54", seat:1, crowd:3, walk:6, transfers:0, reliability:68, status:"Standing likely", tone:"warn", detail:"Fastest, but reduced frequency means it will be packed and a seat is unlikely." },
      { id:"wait", icon:"Ⅱ", iconClass:"wait", title:"Wait for one train", subtitle:"Departs 8:23 · +9 min", leaveBy:"8:17", minutes:57, arrival:"9:03", seat:4, crowd:2, walk:6, transfers:0, reliability:72, status:"Seat more likely", tone:"good", detail:"The current platform queue should clear first, so there is more room." },
      { id:"switch", icon:"↗", iconClass:"switch", title:"Switch to Metro", subtitle:"Walk to Crows Nest · 1 transfer", leaveBy:"8:09", minutes:52, arrival:"8:58", seat:2, crowd:2, walk:15, transfers:1, reliability:86, status:"Standing possible", tone:"", detail:"More reliable today, with extra walking and one transfer." }
    ]
  },
  normal: {
    clock:"8:06", overline:"WEDNESDAY · OFFICE DAY", greeting:"Morning, Alex", alertClass:"normal", alertIcon:"✓",
    alertTitle:"Your commute is running normally", alertCopy:"No current disruption. Usual weekday crowding expected · updated now.",
    confidence:91, updated:"just now", target:"8:46",
    trip:["Wollstonecraft","Wynyard","Leave from 8:08","Arrive by 8:46"],
    options:[
      { id:"take",icon:"→",iconClass:"",title:"Take the next train",subtitle:"Departs 8:15 · Platform 1",leaveBy:"8:09",minutes:35,arrival:"8:41",seat:3,crowd:2,walk:6,transfers:0,reliability:93,status:"Seat possible",tone:"good",detail:"Direct and on time, with usual weekday demand." },
      { id:"wait",icon:"Ⅱ",iconClass:"wait",title:"Wait for one train",subtitle:"Departs 8:23 · +8 min",leaveBy:"8:17",minutes:43,arrival:"8:49",seat:4,crowd:1,walk:6,transfers:0,reliability:91,status:"Seat more likely",tone:"good",detail:"Slightly quieter based on this routine's history." },
      { id:"switch",icon:"↗",iconClass:"switch",title:"Switch to Metro",subtitle:"Walk to Crows Nest · 1 transfer",leaveBy:"8:09",minutes:50,arrival:"8:56",seat:2,crowd:2,walk:15,transfers:1,reliability:92,status:"Standing possible",tone:"",detail:"Reliable, but slower door to door for this journey." }
    ]
  },
  capacity: {
    clock:"17:26", overline:"WEDNESDAY · HEADING HOME", greeting:"Evening, Alex", alertClass:"capacity", alertIcon:"!",
    alertTitle:"Buses arriving near capacity", alertCopy:"Only limited boarding expected at Wynyard. Usually eases after 18:00 · updated 1 min ago.",
    confidence:72, updated:"1 min ago", target:"18:08",
    trip:["Wynyard","Wollstonecraft","Leave from 17:30","Arrive by 18:08"],
    options:[
      { id:"take",icon:"→",iconClass:"",title:"Try the next bus",subtitle:"Route 254 · Stand B · departs 17:34",leaveBy:"17:30",minutes:42,arrival:"18:08",seat:0,crowd:3,walk:4,transfers:0,reliability:58,status:"Boarding constrained",tone:"warn",detail:"Fast if you board, but only a few passengers may be accepted." },
      { id:"wait",icon:"Ⅱ",iconClass:"wait",title:"Wait for the following bus",subtitle:"Route 254 · departs 17:43",leaveBy:"17:39",minutes:51,arrival:"18:17",seat:3,crowd:2,walk:4,transfers:0,reliability:76,status:"Boarding more likely",tone:"good",detail:"The visible queue should clear on the first bus." },
      { id:"switch",icon:"↗",iconClass:"switch",title:"Take a different bus",subtitle:"Route 265 · 7 min walk · departs 17:40",leaveBy:"17:33",minutes:50,arrival:"18:16",seat:2,crowd:2,walk:11,transfers:0,reliability:81,status:"Standing likely",tone:"",detail:"Avoids this queue, but adds seven minutes of walking." }
    ]
  }
};
const CROWD=["","Low","Moderate","High"];
const toMin=t=>{const [h,m]=t.split("–")[0].split(":").map(Number);return h*60+m;};
const lateBy=(o,target)=>Math.max(0,toMin(o.arrival.split("–").pop())-toMin(target));
const certainty=c=>c>=85?"High":c>=70?"Medium":"Low";

const state = { scenario:"disruption", prefs:new Set(["hurry"]), selected:null, day:"wed" };
const weeklyRoutines = {
  mon:{ template:"office", title:"Office day", note:"Your regular Monday", badge:"WORK", legs:[
    {label:"OUT",route:"Wollstonecraft → Wynyard",detail:"Train · direct",time:"8:15"},
    {label:"HOME",route:"Wynyard → Wollstonecraft",detail:"Bus 254 · Stand B, or train",time:"17:30"}
  ]},
  tue:{ template:"uni", title:"University day", note:"Tuesday classes", badge:"STUDY", legs:[
    {label:"OUT",route:"Wollstonecraft → UTS",detail:"Train + 9 min walk",time:"9:05"},
    {label:"HOME",route:"Central → Wollstonecraft",detail:"Train · direct",time:"16:40"}
  ]},
  wed:{ template:"office", title:"Office day", note:"Your regular Wednesday", badge:"WORK", legs:[
    {label:"OUT",route:"Wollstonecraft → Wynyard",detail:"Train · direct",time:"8:15"},
    {label:"HOME",route:"Wynyard → Wollstonecraft",detail:"Bus 254 · Stand B, or train",time:"17:30"}
  ]},
  thu:{ template:"uni", title:"University day", note:"Late-start Thursday", badge:"STUDY", legs:[
    {label:"OUT",route:"Wollstonecraft → UTS",detail:"Train + 9 min walk",time:"10:20"},
    {label:"HOME",route:"Central → Wollstonecraft",detail:"Train · direct",time:"19:10"}
  ]},
  fri:{ title:"Remote day", note:"No commute planned", badge:"HOME", legs:[] },
  sat:{ title:"Personal trip", note:"Flexible weekend plan", badge:"PERSONAL", legs:[
    {label:"OUT",route:"Home → Circular Quay",detail:"Choose around live conditions",time:"11:30"}
  ]},
  sun:{ title:"No routine", note:"Nothing saved for Sunday", badge:"FREE", legs:[] }
};
const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];

function weights(){const v=id=>+$("#"+id).value;return {time:v("time-slider")/8,seat:v("seat-slider")/6,rel:v("reliability-slider")/9,walk:v("walk-slider")/5,transfer:v("transfer-slider")/5,crowd:v("crowd-slider")/5};}
function score(option) {
  const w=weights(), late=lateBy(option,scenarios[state.scenario].target);
  let value = 100 - option.minutes*1.15*w.time + option.reliability*.28*w.rel + option.seat*2*w.seat
    - option.walk*.6*w.walk - option.transfers*8*w.transfer - option.crowd*6*w.crowd - late*1.5*w.time;
  if (state.prefs.has("hurry")) value -= option.minutes*1.1 + late*4;
  if (state.prefs.has("seat")) value += option.seat*12 - option.crowd*4;
  if (state.prefs.has("walk")) value -= option.walk*2.7;
  if (state.prefs.has("transfer")) value -= option.transfers*20;
  if (option.seat===0 && state.prefs.has("seat")) value -= 24;
  return value;
}

function renderWeeklyRoutine() {
  const routine=weeklyRoutines[state.day];
  const plan=$("#day-plan");
  if(!plan) return;
  const legs=routine.legs.length ? routine.legs.map(leg=>`
    <div class="plan-leg">
      <span>${leg.label}</span>
      <div><strong>${leg.route}</strong><small>${leg.detail}</small></div>
      <time>${leg.time}</time>
    </div>`).join("") : `<div class="no-plan"><p>No journeys saved for this day.</p><button class="primary" data-action="add-journey">+ Add a journey</button></div>`;
  plan.innerHTML=`<div class="plan-top"><div><strong>${routine.title}</strong><small>${routine.note}</small></div><span class="plan-badge">${routine.badge}</span></div>${legs}${routine.legs.length?'<button class="text-button plan-edit" data-action="edit-day">Edit this day</button>':''}`;
}

function render() {
  const data = scenarios[state.scenario];
  const ranked = [...data.options].sort((a,b) => score(b)-score(a));
  const recommended = ranked[0].id;
  const alert = $("#service-alert");
  alert.className = `alert-card ${data.alertClass}`;
  $(".alert-icon").textContent = data.alertIcon;
  $(".status-bar span").textContent = data.clock;
  $("#today-screen .app-header .overline").textContent = data.overline;
  $("#today-label").textContent = data.greeting;
  $("#alert-title").textContent = data.alertTitle;
  $("#alert-copy").textContent = data.alertCopy;
  $(".confidence-line").innerHTML = `<span>Live data · updated ${data.updated}</span><button class="certainty" id="open-certainty"><i class="c-${certainty(data.confidence).toLowerCase()}"></i> Prediction certainty: ${certainty(data.confidence)} ⓘ</button>`;
  const places = $$(".place"), times = $$(".trip-summary .time");
  places[0].textContent=data.trip[0]; places[1].textContent=data.trip[1];
  times[0].textContent=data.trip[2]; times[1].textContent=data.trip[3];

  const recOpt=ranked[0], recLate=lateBy(recOpt,data.target);
  const tradeoff = recLate && state.prefs.has("seat")
    ? `<div class="tradeoff" role="status"><b>Trade-off:</b> ${recOpt.title.toLowerCase()} is less crowded, but arrives <b>${recLate} min after</b> your ${data.target} target.<button class="text-button" id="prefer-ontime">Prioritise on-time arrival</button></div>` : "";
  $("#route-options").innerHTML = tradeoff + data.options.map(option => { const late=lateBy(option,data.target); const chosen=option.id===state.selected; return `
    <article class="route-card ${option.id===recommended ? "recommended" : ""} ${chosen ? "chosen" : ""}" data-route="${option.id}">
      <div class="action-icon ${option.iconClass}">${option.icon}</div>
      <div class="route-main">
        <h4>${option.title}</h4><p>${option.subtitle}</p>
        <p class="leave-by">Leave by <b>${option.leaveBy}</b> to catch it</p>
        <div class="metrics">
          <span class="metric crowd-${option.crowd}">Crowding: ${CROWD[option.crowd]}</span>
          <span class="metric ${option.tone}">${option.status}</span>
          <span class="metric">${option.walk} min walk</span>
          <span class="metric">${option.transfers ? `${option.transfers} transfer` : "Direct"}</span>
        </div>
      </div>
      <div class="route-time"><strong>${option.arrival}</strong><small>${late ? `<em class="late">${late} min late</em>` : "On time"}</small></div>
      <div class="route-actions">
        <button class="primary" data-choose="${option.id}">${chosen ? "Chosen ✓" : option.id===recommended ? "Choose this" : "Choose"}</button>
        ${chosen ? `<button class="secondary" data-undo="${option.id}">Undo</button>` : ""}
        <button class="secondary" data-detail="${option.id}">Why?</button>
      </div>
    </article>`; }).join("");
}

function openSheet(title, copy) {
  $("#method-title").textContent = title;
  $("#method-sheet .method-item").innerHTML = copy
    ? `<span>i</span><div><strong>Recommendation detail</strong><p>${copy}</p></div>`
    : `<span>1</span><div><strong>Current conditions</strong><p>Delay, frequency, capacity and last update.</p></div>`;
  $("#sheet-backdrop").classList.add("open");
  $("#method-sheet").classList.add("open");
}
function closeSheet() {
  $("#sheet-backdrop").classList.remove("open");
  $("#method-sheet").classList.remove("open");
  $("#scenario-sheet").classList.remove("open");
  $("#routine-sheet").classList.remove("open");
}
$("#open-scenarios").addEventListener("click",()=>{
  $("#sheet-backdrop").classList.add("open");
  $("#scenario-sheet").classList.add("open");
});
function showToast(option) {
  state.selected=option.id;
  render();
  $("#toast-title").textContent = `${option.title} saved`;
  $("#toast-copy").textContent = `Leave by ${option.leaveBy}. We'll alert you if it changes · tap Undo on the card to change.`;
  const toast=$("#decision-toast"); toast.classList.add("show");
  clearTimeout(showToast.timer); showToast.timer=setTimeout(()=>toast.classList.remove("show"),3200);
}

$$('.chip').forEach(button => button.addEventListener('click', () => {
  const pref=button.dataset.pref;
  state.prefs.has(pref) ? state.prefs.delete(pref) : state.prefs.add(pref);
  button.classList.toggle('active',state.prefs.has(pref));
  button.setAttribute('aria-pressed',String(state.prefs.has(pref)));
  render();
}));
$("#reset-context").addEventListener("click",()=>{
  state.prefs=new Set();
  $$('.chip').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-pressed','false');});
  render();
});
const SCENARIO_ALIAS={"1":"capacity","2":"disruption","3":"normal"};
function setScenario(id,persist=true){
  id=SCENARIO_ALIAS[id]||id;
  if(!scenarios[id]) return;
  state.scenario=id; state.selected=null;
  if(persist){try{localStorage.setItem('waywise-scenario',id);}catch(e){}}
  $$('.scenario').forEach(b=>{const on=b.dataset.scenario===id;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));});
  render();
}
$$('.scenario').forEach(button=>button.addEventListener('click',()=>{setScenario(button.dataset.scenario);closeSheet();}));
$("#route-options").addEventListener("click",event=>{
  const choose=event.target.closest('[data-choose]');
  const detail=event.target.closest('[data-detail]');
  if(event.target.closest('[data-undo]')){state.selected=null;render();return;}
  if(event.target.closest('#prefer-ontime')){state.prefs.delete("seat");state.prefs.add("hurry");$$('.chip').forEach(b=>{const on=state.prefs.has(b.dataset.pref);b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));});render();return;}
  const options=scenarios[state.scenario].options;
  if(choose && choose.dataset.choose===state.selected) return;
  if(choose) showToast(options.find(o=>o.id===choose.dataset.choose));
  if(detail){const o=options.find(o=>o.id===detail.dataset.detail);openSheet(o.title,o.detail);}
});
$("#open-method").addEventListener("click",()=>openSheet("Useful detail, not a black box."));
$(".confidence-line").addEventListener("click",e=>{ if(!e.target.closest('#open-certainty')) return;
  const d=scenarios[state.scenario];
  openSheet(`Prediction certainty: ${certainty(d.confidence)}`,`How sure we are that arrival times and crowding will match what's shown. It drops when services are disrupted or data is old (updated ${d.updated}). High = usually within 2 min; Medium = could be 5 min out; Low = treat as a rough guide.`); });
$("#sheet-backdrop").addEventListener("click",closeSheet);
$$('[data-action="close-sheet"]').forEach(b=>b.addEventListener('click',closeSheet));
$$('.nav-item').forEach(button=>button.addEventListener('click',()=>{
  $$('.nav-item').forEach(b=>b.classList.toggle('active',b===button));
  $$('.screen').forEach(s=>s.classList.toggle('active',s.id===`${button.dataset.screen}-screen`));
}));
$$('.toggle').forEach(button=>button.addEventListener('click',()=>{
  button.classList.toggle('active');button.setAttribute('aria-pressed',String(button.classList.contains('active')));
}));
$$('input[type="range"]').forEach(input=>input.addEventListener('input',()=>{$(`#${input.id.replace('slider','value')}`).value=input.value;}));
$("[data-action='open-trip']").addEventListener("click",()=>{
  $$('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.screen==='trips'));
  $$('.screen').forEach(s=>s.classList.toggle('active',s.id==='trips-screen'));
});
$$('.day').forEach(button=>button.addEventListener('click',()=>{
  state.day=button.dataset.day;
  $$('.day').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-selected',String(b===button));});
  renderWeeklyRoutine();
}));
const templates={
  office:{title:"Office day",badge:"WORK",dot:"work",from:"Wollstonecraft",to:"Wynyard",out:"08:15",back:"17:30",mode:"Train · direct"},
  uni:{title:"University day",badge:"STUDY",dot:"uni",from:"Wollstonecraft",to:"UTS",out:"09:10",back:"16:00",mode:"Train + 9 min walk"},
  remote:{title:"Remote day",badge:"HOME",dot:"home",none:true},
  custom:{title:"",badge:"PERSONAL",dot:"personal",from:"",to:"",out:"08:15",back:"17:30",mode:"Choose around live conditions"}
};
const dayNames={mon:"Monday",tue:"Tuesday",wed:"Wednesday",thu:"Thursday",fri:"Friday",sat:"Saturday",sun:"Sunday"};
const editor={days:new Set(),template:"custom"};
const hm=t=>t?t.replace(/^0/,""):"";
function setTemplate(id,fill=true){
  editor.template=id; const t=templates[id];
  $$('#routine-templates button').forEach(b=>b.classList.toggle('active',b.dataset.template===id));
  $("#routine-fields").hidden=!!t.none;
  if(fill&&!t.none){$("#r-name").value=t.title;$("#r-from").value=t.from;$("#r-to").value=t.to;$("#r-out").value=t.out;$("#r-back").value=t.back;}
  $("#routine-error").textContent="";
}
function syncDayToggles(){$$('#routine-days button').forEach(b=>{const on=editor.days.has(b.dataset.day);b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));});}
function openRoutineEditor(mode,templateId){
  editor.days=new Set([state.day]); syncDayToggles();
  const r=weeklyRoutines[state.day];
  $("#routine-sheet-title").textContent= mode==="edit" ? `Edit ${dayNames[state.day]}` : templateId ? `Use ${templates[templateId].title}` : "Add a journey";
  if(templateId) setTemplate(templateId);
  else if(mode==="edit" && r.legs.length){
    const out=r.legs[0], back=r.legs[1]; const [from,to]=out.route.split(" → ");
    setTemplate(r.template||"custom",false);
    $("#r-name").value=r.title;$("#r-from").value=from;$("#r-to").value=to;
    $("#r-out").value=out.time.padStart(5,"0");$("#r-back").value=back?back.time.padStart(5,"0"):"";
  } else { setTemplate("custom"); }
  $("#sheet-backdrop").classList.add("open"); $("#routine-sheet").classList.add("open");
}
$$('#routine-days button').forEach(b=>b.addEventListener('click',()=>{const d=b.dataset.day;editor.days.has(d)?editor.days.delete(d):editor.days.add(d);syncDayToggles();}));
$$('#routine-templates button').forEach(b=>b.addEventListener('click',()=>setTemplate(b.dataset.template)));
function setDot(day,dot){const i=$(`.day[data-day="${day}"] i`); if(i) i.className=dot||"";}
$("#save-routine").addEventListener("click",()=>{
  const err=$("#routine-error"); const t=templates[editor.template];
  if(!editor.days.size){err.textContent="Pick at least one day.";return;}
  let routine;
  if(t.none){ routine={title:t.title,note:"No commute planned",badge:t.badge,template:editor.template,legs:[]}; }
  else {
    const name=$("#r-name").value.trim()||"My journey", from=$("#r-from").value.trim(), to=$("#r-to").value.trim(), out=$("#r-out").value, back=$("#r-back").value;
    if(!from||!to){err.textContent="Add where you start and where you're going.";return;}
    if(!out){err.textContent="Add a leave time.";return;}
    const legs=[{label:"OUT",route:`${from} → ${to}`,detail:t.mode||"Choose around live conditions",time:hm(out)}];
    if(back) legs.push({label:"HOME",route:`${to} → ${from}`,detail:t.mode||"Choose around live conditions",time:hm(back)});
    routine={title:name,note:"Saved routine",badge:t.badge,template:editor.template,legs};
  }
  editor.days.forEach(d=>{weeklyRoutines[d]={...routine,legs:routine.legs.map(l=>({...l}))};setDot(d,t.dot);});
  closeSheet(); renderWeeklyRoutine();
  $("#toast-title").textContent="Routine saved";
  $("#toast-copy").textContent=`${routine.title} · ${[...editor.days].map(d=>dayNames[d].slice(0,3)).join(", ")}`;
  const toast=$("#decision-toast"); toast.classList.add("show");
  clearTimeout(showToast.timer); showToast.timer=setTimeout(()=>toast.classList.remove("show"),3200);
});
$("#clear-routine").addEventListener("click",()=>{
  if(!editor.days.size){$("#routine-error").textContent="Pick at least one day.";return;}
  editor.days.forEach(d=>{weeklyRoutines[d]={title:"No routine",note:"Nothing saved",badge:"FREE",legs:[]};setDot(d,"");});
  closeSheet(); renderWeeklyRoutine();
});
$("#add-routine").addEventListener("click",()=>openRoutineEditor("add"));
$("#edit-week").addEventListener("click",()=>openRoutineEditor("edit"));
$("#day-plan").addEventListener("click",e=>{ if(e.target.closest('[data-action="add-journey"]')) openRoutineEditor("add"); else if(e.target.closest('[data-action="edit-day"]')) openRoutineEditor("edit"); });
$$('.saved-trip[data-template]').forEach(c=>{const go=()=>openRoutineEditor("add",c.dataset.template);c.addEventListener('click',go);c.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go();}});});
$$('input[type="range"]').forEach(input=>input.addEventListener('input',render));

const demoParams=new URLSearchParams(location.search);
if(demoParams.get('export')==='1') document.body.classList.add('export');
let savedScenario=null;
try{savedScenario=localStorage.getItem('waywise-scenario');}catch(e){}
if(scenarios[savedScenario]) state.scenario=savedScenario;
const urlScenario=SCENARIO_ALIAS[demoParams.get('scenario')]||demoParams.get('scenario');
if(scenarios[urlScenario]) state.scenario=urlScenario;
$$('.scenario').forEach(b=>{const on=b.dataset.scenario===state.scenario;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));});
document.addEventListener('keydown',event=>{if(event.key==='Escape') closeSheet();});
const requestedScreen=demoParams.get("screen");
const requestedDay=demoParams.get("day");
if(["today","trips","prefs"].includes(requestedScreen)){
  $$('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.screen===requestedScreen));
  $$('.screen').forEach(s=>s.classList.toggle('active',s.id===`${requestedScreen}-screen`));
}
if(weeklyRoutines[requestedDay]){
  state.day=requestedDay;
  $$('.day').forEach(b=>{const active=b.dataset.day===requestedDay;b.classList.toggle('active',active);b.setAttribute('aria-selected',String(active));});
}
render();
renderWeeklyRoutine();
