const scenarios = {
  disruption: {
    alertClass: "",
    alertTitle: "North Shore Line disruption",
    alertCopy: "Reduced frequency is increasing platform crowding. Updated 2 min ago.",
    confidence: 78,
    trip: ["Wollstonecraft", "Wynyard", "Leave around 8:18", "Arrive by 8:58"],
    options: [
      { id:"take", icon:"→", iconClass:"", title:"Take the next train", subtitle:"Departs 8:11 · Platform 1", minutes:40, arrival:"8:51", seat:1, walk:6, transfers:0, reliability:68, status:"Standing likely", tone:"warn", detail:"Fastest, but reduced frequency means a seat is unlikely." },
      { id:"wait", icon:"Ⅱ", iconClass:"wait", title:"Wait for one train", subtitle:"Departs around 8:20 · +9 min", minutes:48, arrival:"9:00", seat:4, walk:6, transfers:0, reliability:72, status:"Seat more likely", tone:"good", detail:"The current platform queue should clear first." },
      { id:"switch", icon:"↗", iconClass:"switch", title:"Switch to Metro", subtitle:"Walk to Crows Nest · 1 transfer", minutes:49, arrival:"8:58–9:04", seat:2, walk:15, transfers:1, reliability:86, status:"Standing possible", tone:"", detail:"More reliable today, with extra walking and one transfer." }
    ]
  },
  normal: {
    alertClass:"normal", alertTitle:"Your commute is running normally", alertCopy:"No current disruption. Usual crowding is expected. Updated now.", confidence:91,
    trip:["Wollstonecraft","Wynyard","Leave around 8:18","Arrive by 8:46"],
    options:[
      { id:"take",icon:"→",iconClass:"",title:"Take the next train",subtitle:"Departs 8:13 · Platform 1",minutes:28,arrival:"8:41",seat:3,walk:6,transfers:0,reliability:93,status:"Seat possible",tone:"good",detail:"Direct and on time, with usual weekday demand." },
      { id:"wait",icon:"Ⅱ",iconClass:"wait",title:"Wait for one train",subtitle:"Departs 8:21 · +8 min",minutes:36,arrival:"8:49",seat:4,walk:6,transfers:0,reliability:91,status:"Seat more likely",tone:"good",detail:"Slightly quieter based on this routine's history." },
      { id:"switch",icon:"↗",iconClass:"switch",title:"Switch to Metro",subtitle:"Walk to Crows Nest · 1 transfer",minutes:43,arrival:"8:56",seat:2,walk:15,transfers:1,reliability:92,status:"Standing possible",tone:"",detail:"Reliable, but slower door to door for this journey." }
    ]
  },
  capacity: {
    alertClass:"capacity", alertTitle:"Buses arriving near capacity", alertCopy:"Only limited boarding is expected at Wynyard. Updated 1 min ago.", confidence:72,
    trip:["Wynyard","Lane Cove","Leave around 5:34","Arrive by 6:08"],
    options:[
      { id:"take",icon:"→",iconClass:"",title:"Try the next bus",subtitle:"Route 288 · Stand B",minutes:34,arrival:"6:08",seat:0,walk:4,transfers:0,reliability:58,status:"Boarding constrained",tone:"warn",detail:"Fast if you board, but only a few passengers may be accepted." },
      { id:"wait",icon:"Ⅱ",iconClass:"wait",title:"Wait for the following bus",subtitle:"Expected 9 min later",minutes:43,arrival:"6:17",seat:3,walk:4,transfers:0,reliability:76,status:"Boarding more likely",tone:"good",detail:"The visible queue should clear on the first bus." },
      { id:"switch",icon:"↗",iconClass:"switch",title:"Take a different bus",subtitle:"Route 292 · 7 min walk",minutes:42,arrival:"6:16",seat:2,walk:11,transfers:0,reliability:81,status:"Standing likely",tone:"",detail:"Avoids this queue, but adds seven minutes of walking." }
    ]
  }
};

const state = { scenario:"disruption", prefs:new Set(["hurry"]), selected:null, day:"mon" };
const weeklyRoutines = {
  mon:{ title:"Office day", note:"Your regular Monday", badge:"WORK", legs:[
    {label:"OUT",route:"Wollstonecraft → Wynyard",detail:"Train · direct",time:"8:15"},
    {label:"HOME",route:"Wynyard → Wollstonecraft",detail:"Train · quieter after 6",time:"17:32"}
  ]},
  tue:{ title:"University day", note:"Tuesday classes", badge:"STUDY", legs:[
    {label:"OUT",route:"Wollstonecraft → UTS",detail:"Train + 9 min walk",time:"9:05"},
    {label:"HOME",route:"Central → Wollstonecraft",detail:"Train · direct",time:"16:40"}
  ]},
  wed:{ title:"Office day", note:"Your regular Wednesday", badge:"WORK", legs:[
    {label:"OUT",route:"Wollstonecraft → Wynyard",detail:"Train · direct",time:"8:15"},
    {label:"HOME",route:"Wynyard → Wollstonecraft",detail:"Train · direct",time:"17:32"}
  ]},
  thu:{ title:"University day", note:"Late-start Thursday", badge:"STUDY", legs:[
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

function score(option) {
  let value = 100 - option.minutes * 1.15 + option.reliability * .28 + option.seat * 2;
  if (state.prefs.has("hurry")) value -= option.minutes * 1.1;
  if (state.prefs.has("seat")) value += option.seat * 12;
  if (state.prefs.has("walk")) value -= option.walk * 2.7;
  if (state.prefs.has("transfer")) value -= option.transfers * 20;
  if (option.seat === 0 && state.prefs.has("seat")) value -= 24;
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
    </div>`).join("") : `<div class="no-plan"><strong>${routine.title}</strong><p>${routine.note}. Tap + to add a journey.</p></div>`;
  plan.innerHTML=`<div class="plan-top"><div><strong>${routine.title}</strong><small>${routine.note}</small></div><span class="plan-badge">${routine.badge}</span></div>${legs}`;
}

function render() {
  const data = scenarios[state.scenario];
  const ranked = [...data.options].sort((a,b) => score(b)-score(a));
  const recommended = ranked[0].id;
  const alert = $("#service-alert");
  alert.className = `alert-card ${data.alertClass}`;
  $("#alert-title").textContent = data.alertTitle;
  $("#alert-copy").textContent = data.alertCopy;
  $(".confidence-line span:last-child").innerHTML = `<i></i> ${data.confidence}% confidence`;
  const places = $$(".place"), times = $$(".trip-summary .time");
  places[0].textContent=data.trip[0]; places[1].textContent=data.trip[1];
  times[0].textContent=data.trip[2]; times[1].textContent=data.trip[3];

  $("#route-options").innerHTML = data.options.map(option => `
    <article class="route-card ${option.id===recommended ? "recommended" : ""}" data-route="${option.id}">
      <div class="action-icon ${option.iconClass}">${option.icon}</div>
      <div class="route-main">
        <h4>${option.title}</h4><p>${option.subtitle}</p>
        <div class="metrics">
          <span class="metric ${option.tone}">${option.status}</span>
          <span class="metric">${option.walk} min walk</span>
          <span class="metric">${option.transfers ? `${option.transfers} transfer` : "Direct"}</span>
        </div>
      </div>
      <div class="route-time"><strong>${option.arrival}</strong><small>${option.minutes} min total</small></div>
      <div class="route-actions">
        <button class="primary" data-choose="${option.id}">${option.id===recommended ? "Choose this" : "Choose"}</button>
        <button class="secondary" data-detail="${option.id}">Why?</button>
      </div>
    </article>`).join("");
}

function openSheet(title, copy) {
  $("#method-title").textContent = title;
  if (copy) {
    $("#method-sheet .method-item").innerHTML = `<span>i</span><div><strong>Recommendation detail</strong><p>${copy}</p></div>`;
  }
  $("#sheet-backdrop").classList.add("open");
  $("#method-sheet").classList.add("open");
}
function closeSheet() {
  $("#sheet-backdrop").classList.remove("open");
  $("#method-sheet").classList.remove("open");
}
function showToast(option) {
  state.selected=option.id;
  $("#toast-title").textContent = `${option.title} saved`;
  $("#toast-copy").textContent = `We’ll watch for changes before ${option.arrival}.`;
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
$$('.scenario').forEach(button=>button.addEventListener('click',()=>{
  state.scenario=button.dataset.scenario;
  $$('.scenario').forEach(b=>b.classList.toggle('active',b===button));
  render();
}));
$("#route-options").addEventListener("click",event=>{
  const choose=event.target.closest('[data-choose]');
  const detail=event.target.closest('[data-detail]');
  const options=scenarios[state.scenario].options;
  if(choose) showToast(options.find(o=>o.id===choose.dataset.choose));
  if(detail){const o=options.find(o=>o.id===detail.dataset.detail);openSheet(o.title,o.detail);}
});
$("#open-method").addEventListener("click",()=>openSheet("Useful detail, not a black box."));
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
function showRoutineEditor(){
  $("#toast-title").textContent="Routine editor";
  $("#toast-copy").textContent="Choose days, then add morning and return journeys.";
  const toast=$("#decision-toast"); toast.classList.add("show");
  clearTimeout(showToast.timer); showToast.timer=setTimeout(()=>toast.classList.remove("show"),3200);
}
$("#add-routine").addEventListener("click",showRoutineEditor);
$("#edit-week").addEventListener("click",showRoutineEditor);

const demoParams=new URLSearchParams(location.search);
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
