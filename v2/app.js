// Waywise v2 — state-aware ranking + four journey stages. All data is fictional.
const scenarios = {
  disruption: {
    overline:"MORNING COMMUTE", clock:"8:06", alertClass:"", alertTitle:"North Shore Line disruption",
    alertCopy:"Reduced frequency is increasing platform crowding.", updated:"Updated 2 min ago", confidence:78,
    trip:["Wollstonecraft","Wynyard","Leave around 8:08","Arrive by 8:58"], stop:"Wollstonecraft · Platform 1",
    options:[
      { id:"take", icon:"→", iconClass:"", title:"Take the next train", subtitle:"Departs 8:11 · Platform 1", minutes:40, arrival:"8:48–8:53", seat:1, walk:6, transfers:0, reliability:68, status:"Standing likely", tone:"warn" },
      { id:"wait", icon:"Ⅱ", iconClass:"wait", title:"Wait for one train", subtitle:"Departs ~8:20 · +9 min", minutes:48, arrival:"8:56–9:00", seat:4, walk:6, transfers:0, reliability:72, status:"Seat likely", tone:"good" },
      { id:"switch", icon:"↗", iconClass:"switch", title:"Switch to Metro", subtitle:"Walk to Crows Nest · 1 transfer", minutes:49, arrival:"8:58–9:04", seat:2, walk:15, transfers:1, reliability:86, status:"Standing possible", tone:"" }
    ],
    departures:[
      { time:"8:11", line:"T1 to City", when:"in 2 min", status:"Standing likely", tone:"warn", carriages:[3,3,3,2,2,3,3,2] },
      { time:"8:20", line:"T1 to City", when:"in 11 min", status:"Seat likely", tone:"good", carriages:[1,1,2,1,1,2,1,1] }
    ],
    tip:"Rear carriages 4–5 and 8 are less full on the 8:11.",
    fallback:"If the 8:20 is cancelled: Metro from Crows Nest (12 min walk), arrive ~9:06."
  },
  normal: {
    overline:"MORNING COMMUTE", clock:"8:06", alertClass:"normal", alertTitle:"Your commute is running normally",
    alertCopy:"No disruption. Usual weekday crowding expected.", updated:"Updated now", confidence:91,
    trip:["Wollstonecraft","Wynyard","Leave around 8:08","Arrive by 8:46"], stop:"Wollstonecraft · Platform 1",
    options:[
      { id:"take",icon:"→",iconClass:"",title:"Take the next train",subtitle:"Departs 8:13 · Platform 1",minutes:28,arrival:"8:41",seat:3,walk:6,transfers:0,reliability:93,status:"Seat possible",tone:"good" },
      { id:"wait",icon:"Ⅱ",iconClass:"wait",title:"Wait for one train",subtitle:"Departs 8:21 · +8 min",minutes:36,arrival:"8:49",seat:4,walk:6,transfers:0,reliability:91,status:"Seat likely",tone:"good" },
      { id:"switch",icon:"↗",iconClass:"switch",title:"Switch to Metro",subtitle:"Walk to Crows Nest · 1 transfer",minutes:43,arrival:"8:56",seat:2,walk:15,transfers:1,reliability:92,status:"Standing possible",tone:"" }
    ],
    departures:[
      { time:"8:13", line:"T1 to City", when:"in 4 min", status:"Seat possible", tone:"good", carriages:[2,2,2,1,1,2,2,1] },
      { time:"8:21", line:"T1 to City", when:"in 12 min", status:"Seat likely", tone:"good", carriages:[1,1,1,1,1,2,1,1] }
    ],
    tip:"Front carriages usually fill first at this stop.",
    fallback:"Backup: the 8:29 train arrives 8:57."
  },
  capacity: {
    overline:"EVENING RETURN", clock:"5:30", alertClass:"capacity", alertTitle:"Buses arriving near capacity",
    alertCopy:"Only limited boarding is expected at Wynyard.", updated:"Updated 1 min ago", confidence:72,
    trip:["Wynyard","Lane Cove","Leave around 5:32","Arrive by 6:08"], stop:"Wynyard · Stand B",
    options:[
      { id:"take",icon:"→",iconClass:"",title:"Try the next bus",subtitle:"Route 288 · Stand B",minutes:34,arrival:"6:08",seat:0,walk:4,transfers:0,reliability:58,status:"Boarding constrained",tone:"warn" },
      { id:"wait",icon:"Ⅱ",iconClass:"wait",title:"Wait for the following bus",subtitle:"Expected 9 min later",minutes:43,arrival:"6:17",seat:3,walk:4,transfers:0,reliability:76,status:"Boarding likely",tone:"good" },
      { id:"switch",icon:"↗",iconClass:"switch",title:"Take a different bus",subtitle:"Route 292 · 7 min walk",minutes:42,arrival:"6:16",seat:2,walk:11,transfers:0,reliability:81,status:"Standing likely",tone:"" }
    ],
    departures:[
      { time:"5:34", line:"288 to Lane Cove", when:"in 2 min", status:"Boarding constrained", tone:"warn", carriages:[3] },
      { time:"5:43", line:"288 to Lane Cove", when:"in 11 min", status:"Boarding likely", tone:"good", carriages:[2] }
    ],
    tip:"About 25 people are queuing; roughly 8 may board the 5:34.",
    fallback:"If both are full: Route 292 from York St (7 min walk), arrive ~6:16."
  },
  evening: {
    overline:"AFTER UNI · EVENING", clock:"5:30", alertClass:"capacity", alertTitle:"Evening peak at Central",
    alertCopy:"Northbound trains are busy until about 5:45.", updated:"Updated 1 min ago", confidence:84,
    trip:["Central (UTS)","Wollstonecraft","Leave around 5:32","Arrive by 6:10"], stop:"Central · Platform 19",
    options:[
      { id:"take",icon:"→",iconClass:"",title:"Take the next train",subtitle:"Departs 5:34 · Platform 19",minutes:24,arrival:"5:58",seat:0,walk:5,transfers:0,reliability:88,status:"Packed · standing",tone:"warn" },
      { id:"wait",icon:"Ⅱ",iconClass:"wait",title:"Wait for one train",subtitle:"Departs 5:41 · +7 min",minutes:31,arrival:"6:05",seat:4,walk:5,transfers:0,reliability:86,status:"Seat likely",tone:"good" },
      { id:"switch",icon:"↗",iconClass:"switch",title:"Switch to Metro",subtitle:"Via Victoria Cross · 1 transfer",minutes:34,arrival:"6:08",seat:2,walk:12,transfers:1,reliability:90,status:"Standing possible",tone:"" }
    ],
    departures:[
      { time:"5:34", line:"T1 to Hornsby", when:"in 2 min", status:"Packed · standing", tone:"warn", carriages:[3,3,3,3,2,3,3,3] },
      { time:"5:41", line:"T1 to Hornsby", when:"in 9 min", status:"Seat likely", tone:"good", carriages:[1,2,1,1,1,1,2,1] }
    ],
    tip:"The 5:41 starts at Central, so seats are available as it pulls in.",
    fallback:"If the 5:41 is delayed: Metro via Victoria Cross, arrive ~6:08."
  }
};

const moods = {
  rushing:{ label:"Rushing", w:{ time:2.2, seat:.3, rel:1.3, walk:.6, transfer:.6 } },
  normal: { label:"Normal",  w:{ time:1,   seat:1,  rel:1,   walk:1,  transfer:1 } },
  tired:  { label:"Tired",   w:{ time:.5,  seat:2.2,rel:.8,  walk:1.6,transfer:1.3 } }
};

const weeklyRoutines = {
  mon:{ title:"Office day", note:"Regular Monday", badge:"WORK", legs:[
    {label:"OUT",route:"Wollstonecraft → Wynyard",detail:"Train · direct",time:"8:15",scenario:"disruption"},
    {label:"HOME",route:"Wynyard → Lane Cove",detail:"Bus 288",time:"17:32",scenario:"capacity"}]},
  tue:{ title:"University day", note:"Tuesday classes", badge:"STUDY", legs:[
    {label:"OUT",route:"Wollstonecraft → Wynyard",detail:"Train · direct",time:"8:15",scenario:"normal"},
    {label:"HOME",route:"Central → Wollstonecraft",detail:"Train · evening peak",time:"17:30",scenario:"evening"}]},
  wed:{ title:"Office day", note:"Regular Wednesday", badge:"WORK", legs:[
    {label:"OUT",route:"Wollstonecraft → Wynyard",detail:"Train · direct",time:"8:15",scenario:"normal"}]},
  thu:{ title:"University day", note:"Late-start Thursday", badge:"STUDY", legs:[
    {label:"HOME",route:"Central → Wollstonecraft",detail:"Train · evening peak",time:"17:30",scenario:"evening"}]},
  fri:{ title:"Remote day", note:"No commute planned", badge:"HOME", legs:[] },
  sat:{ title:"Personal trip", note:"Flexible weekend", badge:"PERSONAL", legs:[] },
  sun:{ title:"No routine", note:"Nothing saved", badge:"FREE", legs:[] }
};

const state = {
  scenario:"disruption", mood:"normal", prefs:new Set(), stage:"plan", selected:null, rating:null,
  sliders:{ time:5, seat:5, rel:5 }, learned:[], day:"mon"
};

const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const data = () => scenarios[state.scenario];
const findOption = id => data().options.find(o => o.id === id);

function weights() {
  const w = { ...moods[state.mood].w };
  w.time *= state.sliders.time / 5; w.seat *= state.sliders.seat / 5; w.rel *= state.sliders.rel / 5;
  state.learned.filter(r => r.mood === state.mood).forEach(r => { w[r.key] += r.delta; });
  if (state.prefs.has("bags")) { w.walk += 1; w.transfer += 1; w.seat += .4; }
  if (state.prefs.has("walk")) w.walk += 1.4;
  if (state.prefs.has("transfer")) w.transfer += 1.6;
  return w;
}
function score(o) {
  const w = weights();
  return -o.minutes*1.2*w.time + o.seat*8*w.seat + o.reliability*.4*w.rel - o.walk*1.5*w.walk - o.transfers*12*w.transfer;
}
const ranked = () => [...data().options].sort((a,b) => score(b) - score(a));

function tradeoff(o, fastest) {
  const extra = o.minutes - fastest.minutes;
  if (o.id === fastest.id) return "Fastest option";
  const gains = [];
  if (o.seat > fastest.seat) gains.push(o.seat >= 3 ? "a likely seat" : "more space");
  if (o.reliability > fastest.reliability + 5) gains.push("more reliability");
  return `+${extra} min ${gains.length ? "buys " + gains.join(" and ") : "with no clear gain"}`;
}
function becauseText(best) {
  const m = state.mood, bits = [];
  if (m === "tired") bits.push("you're tired, so comfort and seats count more");
  if (m === "rushing") bits.push("you're rushing, so arrival time counts most");
  if (m === "normal") bits.push("you're balancing time, comfort and reliability");
  if (state.prefs.has("bags")) bits.push("you're carrying bags");
  if (state.prefs.has("walk")) bits.push("you want less walking");
  if (state.prefs.has("transfer")) bits.push("you want to avoid transfers");
  if (state.learned.some(r => r.mood === m)) bits.push("you asked us to remember a past choice");
  return `<strong>${best.title}</strong> is recommended because ${bits.join(", ")}.`;
}

function renderPlan() {
  const d = data(), list = ranked(), best = list[0];
  const fastest = [...d.options].sort((a,b) => a.minutes - b.minutes)[0];
  $("#trip-overline").textContent = d.overline; $("#clock").textContent = d.clock;
  const al = $("#service-alert"); al.className = `alert-card ${d.alertClass}`;
  $("#alert-title").textContent = d.alertTitle; $("#alert-copy").textContent = `${d.alertCopy} ${d.updated}.`;
  $("#updated").textContent = `Live · ${d.updated.toLowerCase()}`;
  $("#confidence").innerHTML = `<i></i> ${d.confidence}% confidence`;
  const places = $$("#stage-plan .place"), times = $$("#stage-plan .trip-summary .time");
  places[0].textContent = d.trip[0]; places[1].textContent = d.trip[1];
  times[0].textContent = d.trip[2]; times[1].textContent = d.trip[3];
  $("#because").innerHTML = becauseText(best);
  $("#route-options").innerHTML = list.map(o => `
    <article class="route-card ${o.id===best.id ? "recommended" : ""}" data-route="${o.id}">
      <div class="action-icon ${o.iconClass}">${o.icon}</div>
      <div class="route-main">
        <h4>${o.title}</h4><p>${o.subtitle}</p>
        <div class="metrics">
          <span class="metric ${o.tone}">${o.status}</span>
          <span class="metric">${o.walk} min walk</span>
          <span class="metric">${o.transfers ? `${o.transfers} transfer` : "Direct"}</span>
          <span class="metric">${o.reliability}% on time</span>
        </div>
        <p class="tradeoff">${tradeoff(o, fastest)}</p>
      </div>
      <div class="route-time"><strong>${o.arrival}</strong><small>${o.minutes} min total</small></div>
      <div class="route-actions">
        <button class="primary" data-choose="${o.id}">${o.id===best.id ? "Go with this" : "Choose"}</button>
        <button class="secondary" data-detail="${o.id}">Why?</button>
      </div>
    </article>`).join("");
}

function renderPlatform() {
  const d = data(), o = findOption(state.selected) || ranked()[0];
  $("#plan-chip").innerHTML = `<span class="action-icon ${o.iconClass}">${o.icon}</span><div><small>YOUR PLAN · ${moods[state.mood].label.toUpperCase()}</small><strong>${o.title}</strong><p>${d.stop}</p></div><button class="text-button" data-goto="plan">Change</button>`;
  const target = o.id === "wait" ? 1 : 0;
  $("#departures").innerHTML = d.departures.map((dep, i) => `
    <article class="departure ${i===target && o.id!=="switch" ? "target" : ""}">
      <div class="dep-top"><strong>${dep.time}</strong><span>${dep.line}</span><em>${dep.when}</em></div>
      <div class="carriages" aria-label="Crowding by carriage">${dep.carriages.map(c => `<i class="c${c}"></i>`).join("")}</div>
      <span class="metric ${dep.tone}">${dep.status}</span>${i===target && o.id!=="switch" ? `<span class="your-pick">Your pick</span>` : ""}
    </article>`).join("");
  $("#platform-tip").innerHTML = `<span>i</span><p>${d.tip}</p>`;
  $("#fallback").innerHTML = `<p class="overline">BACKUP PLAN</p><p>${d.fallback}</p>`;
  const primary = o.id === "wait" ? "I'm waiting for this one" : o.id === "switch" ? "Head to the alternative" : "I'm boarding";
  const alt = o.id === "take" ? `<button class="secondary" data-switch="wait">Too full — I'll wait</button>`
            : o.id === "wait" ? `<button class="secondary" data-switch="take">Actually, take the next</button>` : "";
  $("#platform-actions").innerHTML = `<button class="primary full" data-goto="board">${primary}</button>${alt}`;
}

function renderBoard() {
  const d = data(), o = findOption(state.selected) || ranked()[0];
  $("#ride-title").textContent = o.title.replace(/^(Take|Wait for|Switch to|Try|Take a)\s/i, "").replace(/^the /, "");
  $("#ride-from").textContent = d.trip[0]; $("#ride-to").textContent = d.trip[1];
  $("#ride-eta").textContent = `ETA ${o.arrival}`;
  $("#ride-progress").style.width = "45%";
  $("#ride-copy").textContent = o.seat >= 3
    ? "You likely have a seat. We'll stay quiet unless something changes."
    : "We'll only notify you if a change would help you arrive on time or more comfortably.";
}

function renderArrive() {
  const o = findOption(state.selected) || ranked()[0];
  $("#arrive-copy").textContent = `You chose "${o.title}" while feeling ${moods[state.mood].label.toLowerCase()}. Arrived ${o.arrival.split("–").pop()}.`;
  $$(".rating button").forEach(b => b.classList.toggle("active", Number(b.dataset.rate) === state.rating));
  const card = $("#learn-card");
  if (!state.rating) { card.hidden = true; return; }
  card.hidden = false;
  const rule = proposedRule();
  $("#learn-title").textContent = rule.title; $("#learn-copy").textContent = rule.copy;
}
function proposedRule() {
  const o = findOption(state.selected) || ranked()[0], m = moods[state.mood].label;
  if (state.rating === 3) {
    return o.seat >= 3
      ? { title:`When you're ${m}, favour seats a little more?`, copy:"Based only on this rating. You can remove it anytime in Priorities.", key:"seat", delta:.5 }
      : { title:`When you're ${m}, favour faster options a little more?`, copy:"Based only on this rating. You can remove it anytime in Priorities.", key:"time", delta:.4 };
  }
  if (state.rating === 1) {
    return o.seat >= 3
      ? { title:`When you're ${m}, put time ahead of comfort?`, copy:"The extra wait didn't feel worth it. Remove anytime in Priorities.", key:"time", delta:.4 }
      : { title:`When you're ${m}, favour seats a little more?`, copy:"The faster option didn't feel worth it. Remove anytime in Priorities.", key:"seat", delta:.5 };
  }
  return { title:"Keep your settings as they are?", copy:"An okay trip doesn't change anything. Nothing will be learned.", key:null, delta:0 };
}

function renderLearned() {
  $("#learned-list").innerHTML = state.learned.length
    ? state.learned.map((r,i) => `<div class="learned-item"><span>${moods[r.mood].label}</span><p>${r.title.replace(/\?$/,"")}</p><button class="text-button" data-forget="${i}">Remove</button></div>`).join("")
    : `<p class="empty-learn">Nothing yet. After a trip, rate it and approve a suggestion.</p>`;
}

function renderWeek() {
  const r = weeklyRoutines[state.day];
  const legs = r.legs.length ? r.legs.map(l => `
    <button class="plan-leg" data-open="${l.scenario}"><span>${l.label}</span><div><strong>${l.route}</strong><small>${l.detail}</small></div><time>${l.time}</time></button>`).join("")
    : `<div class="no-plan"><strong>${r.title}</strong><p>${r.note}.</p></div>`;
  $("#day-plan").innerHTML = `<div class="plan-top"><div><strong>${r.title}</strong><small>${r.note}</small></div><span class="plan-badge">${r.badge}</span></div>${legs}`;
}

function setStage(stage) {
  state.stage = stage;
  if (stage !== "plan" && !state.selected) state.selected = ranked()[0].id;
  const order = ["plan","platform","board","arrive"], idx = order.indexOf(stage);
  $$(".step").forEach((b,i) => { b.classList.toggle("active", i === idx); b.classList.toggle("done", i < idx); });
  $$(".stage").forEach(s => s.classList.toggle("active", s.id === `stage-${stage}`));
  render();
  $("#today-screen").scrollTop = 0;
}
function goScreen(name) {
  $$(".nav-item").forEach(b => b.classList.toggle("active", b.dataset.screen === name));
  $$(".screen").forEach(s => s.classList.toggle("active", s.id === `${name}-screen`));
}
function render() {
  renderPlan();
  if (state.stage === "platform") renderPlatform();
  if (state.stage === "board") renderBoard();
  if (state.stage === "arrive") renderArrive();
  renderLearned();
}
function setScenario(name) {
  state.scenario = name; state.selected = null; state.rating = null;
  $$("[data-scenario]").forEach(b => b.classList.toggle("active", b.dataset.scenario === name));
}
function setMood(m) {
  state.mood = m;
  $$(".mood").forEach(b => { const on = b.dataset.mood === m; b.classList.toggle("active", on); b.setAttribute("aria-checked", String(on)); });
}
function toast(title, copy) {
  $("#toast-title").textContent = title; $("#toast-copy").textContent = copy;
  const t = $("#decision-toast"); t.classList.add("show");
  clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("show"), 2800);
}
function openSheet(o) {
  const w = weights(), m = moods[state.mood].label;
  $("#method-title").textContent = o ? o.title : "Useful detail, not a black box.";
  const rows = o ? [
    ["1","Current conditions",`${o.status}, ${o.reliability}% on-time, arrival ${o.arrival}. ${data().updated}.`],
    ["2",`Today you're ${m}`,`Time weight ×${w.time.toFixed(1)} · seat ×${w.seat.toFixed(1)} · reliability ×${w.rel.toFixed(1)}.`],
    ["3","Honest confidence",`${data().confidence}% confidence. We show a range when the network is unstable.`]
  ] : [
    ["1","Current conditions","Delay, frequency, capacity and last update."],
    ["2","How you feel today","Rushing, Normal or Tired re-weights time, seat and reliability."],
    ["3","Your approved rules","Only rules you accepted after a trip. Remove them in Priorities."]
  ];
  $("#method-body").innerHTML = rows.map(r => `<div class="method-item"><span>${r[0]}</span><div><strong>${r[1]}</strong><p>${r[2]}</p></div></div>`).join("");
  $("#sheet-backdrop").classList.add("open"); $("#method-sheet").classList.add("open");
}
function closeSheet() { $("#sheet-backdrop").classList.remove("open"); $("#method-sheet").classList.remove("open"); }

// Events
$$(".mood").forEach(b => b.addEventListener("click", () => { setMood(b.dataset.mood); render(); }));
$$(".chip").forEach(b => b.addEventListener("click", () => {
  const p = b.dataset.pref; state.prefs.has(p) ? state.prefs.delete(p) : state.prefs.add(p);
  b.classList.toggle("active", state.prefs.has(p)); b.setAttribute("aria-pressed", String(state.prefs.has(p))); render();
}));
$("#reset-context").addEventListener("click", () => {
  state.prefs = new Set(); setMood("normal");
  $$(".chip").forEach(b => { b.classList.remove("active"); b.setAttribute("aria-pressed","false"); }); render();
});
$$("[data-scenario]").forEach(b => b.addEventListener("click", () => { setScenario(b.dataset.scenario); setStage("plan"); goScreen("today"); }));
$$("[data-story]").forEach(b => b.addEventListener("click", () => {
  const tired = b.dataset.story === "tired";
  setScenario(tired ? "evening" : "disruption"); setMood(tired ? "tired" : "rushing");
  $$("[data-story]").forEach(x => x.classList.toggle("active", x === b));
  setStage("plan"); goScreen("today");
}));
$$(".step").forEach(b => b.addEventListener("click", () => setStage(b.dataset.stage)));
$("#today-screen").addEventListener("click", e => {
  const choose = e.target.closest("[data-choose]"), detail = e.target.closest("[data-detail]");
  const go = e.target.closest("[data-goto]"), sw = e.target.closest("[data-switch]");
  if (choose) { state.selected = choose.dataset.choose; state.rating = null; toast(`${findOption(state.selected).title}`, "Plan saved. Head to your stop when ready."); setStage("platform"); }
  if (detail) openSheet(findOption(detail.dataset.detail));
  if (go) setStage(go.dataset.goto);
  if (sw) { state.selected = sw.dataset.switch; toast("Plan updated", findOption(state.selected).title); renderPlatform(); }
});
$$(".rating button").forEach(b => b.addEventListener("click", () => { state.rating = Number(b.dataset.rate); renderArrive(); }));
$("#learn-yes").addEventListener("click", () => {
  const r = proposedRule();
  if (r.key) { state.learned.push({ mood:state.mood, key:r.key, delta:r.delta, title:r.title }); toast("Remembered", "See or remove it in Priorities."); }
  $("#learn-card").hidden = true; renderLearned();
});
$("#learn-no").addEventListener("click", () => { $("#learn-card").hidden = true; toast("Nothing changed", "Your settings stay the same."); });
$("#restart").addEventListener("click", () => { state.selected = null; state.rating = null; setStage("plan"); });
$("#learned-list").addEventListener("click", e => {
  const f = e.target.closest("[data-forget]"); if (!f) return;
  state.learned.splice(Number(f.dataset.forget), 1); render();
});
$$('input[type="range"]').forEach(i => i.addEventListener("input", () => {
  state.sliders[i.dataset.weight] = Number(i.value); $(`#${i.id.replace("slider","value")}`).value = i.value; render();
}));
$("#open-method").addEventListener("click", () => openSheet(null));
$("#sheet-backdrop").addEventListener("click", closeSheet);
$$('[data-action="close-sheet"]').forEach(b => b.addEventListener("click", closeSheet));
document.addEventListener("keydown", e => { if (e.key === "Escape") closeSheet(); });
$$(".nav-item").forEach(b => b.addEventListener("click", () => goScreen(b.dataset.screen)));
$$(".toggle").forEach(b => b.addEventListener("click", () => { b.classList.toggle("active"); b.setAttribute("aria-pressed", String(b.classList.contains("active"))); }));
$("[data-action='open-trip']").addEventListener("click", () => goScreen("trips"));
$$(".day").forEach(b => b.addEventListener("click", () => {
  state.day = b.dataset.day;
  $$(".day").forEach(x => { x.classList.toggle("active", x === b); x.setAttribute("aria-selected", String(x === b)); });
  renderWeek();
}));
$("#day-plan").addEventListener("click", e => {
  const leg = e.target.closest("[data-open]"); if (!leg) return;
  setScenario(leg.dataset.open); setStage("plan"); goScreen("today");
});
$("#add-routine").addEventListener("click", () => toast("Routine editor", "Not in this prototype."));

// URL params for screenshots: ?story=tired|rushing&scenario=…&mood=…&stage=…&screen=…&rate=1-3
const q = new URLSearchParams(location.search);
if (q.get("story")) $(`[data-story="${q.get("story")}"]`)?.click();
if (scenarios[q.get("scenario")]) setScenario(q.get("scenario"));
if (moods[q.get("mood")]) setMood(q.get("mood"));
if (q.get("rate")) state.rating = Number(q.get("rate"));
renderWeek();
setStage(["plan","platform","board","arrive"].includes(q.get("stage")) ? q.get("stage") : "plan");
if (["today","trips","prefs"].includes(q.get("screen"))) goScreen(q.get("screen"));
