"use strict";
/* Waywise high-fidelity prototype (course v3).
   Base: mid-fi (a6da931) content and scenarios. Revised from the usability-evaluation synthesis
   (Prototype_Recommendation_List R1–R19 + Prototype_Annotated_Review pages 01–08). All data is fictional. */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const clone = o => JSON.parse(JSON.stringify(o));
const lcT = t => String(t).toLowerCase().replace(/\bmetro\b/g, "Metro");
const toMin = t => { const [h, m] = String(t).split("–")[0].split(":").map(Number); return h * 60 + m; };
const fmt = m => { m = ((m % 1440) + 1440) % 1440; return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}`; };
const pad = t => (t && t.length === 4 ? "0" + t : t || "");
const arrEnd = o => toMin(o.arrives.split("–").pop());

/* Icon set: Lucide-style 24px / 2px stroke, consistent metrics. */
const ICON = {
  walk: '<svg viewBox="0 0 24 24"><path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z"/><path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z"/><path d="M16 17h4"/><path d="M4 13h4"/></svg>',
  swap: '<svg viewBox="0 0 24 24"><path d="m21 16-4 4-4-4"/><path d="M17 20V4"/><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/></svg>',
  check: '<svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>',
  warn: '<svg viewBox="0 0 24 24"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 20h16a2 2 0 0 0 1.73-2Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
  back: '<svg viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg>',
  share: '<svg viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.59 13.51 6.83 3.98"/><path d="m15.41 6.51-6.82 3.98"/></svg>',
  flag: '<svg viewBox="0 0 24 24"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><path d="M4 22v-7"/></svg>',
  compare: '<svg viewBox="0 0 24 24"><path d="m16 3 4 4-4 4"/><path d="M20 7H4"/><path d="m8 21-4-4 4-4"/><path d="M4 17h16"/></svg>',
  bell: '<svg viewBox="0 0 24 24"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>',
  plus: '<svg viewBox="0 0 24 24"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',
  cloud: '<svg viewBox="0 0 24 24"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/><path d="m9 13 2 2 4-4"/></svg>',
  sparkle: '<svg viewBox="0 0 24 24"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg>',
  sliders: '<svg viewBox="0 0 24 24"><path d="M21 4h-7M10 4H3M21 12h-9M8 12H3M21 20h-5M12 20H3M14 2v4M8 10v4M16 18v4"/></svg>',
  route: '<svg viewBox="0 0 24 24"><circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/></svg>',
  go: '<svg viewBox="0 0 24 24"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
  clock: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
  chevD: '<svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>',
  x: '<svg viewBox="0 0 24 24"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
  edit: '<svg viewBox="0 0 24 24"><path d="M21.17 6.81a2.83 2.83 0 0 0-4-4L3.84 16.17a2 2 0 0 0-.5.83l-1.32 4.35a.5.5 0 0 0 .62.62l4.35-1.32a2 2 0 0 0 .83-.5z"/><path d="m15 5 4 4"/></svg>',
  calendar: '<svg viewBox="0 0 24 24"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>'
};

/* Transport for NSW mode language: coloured roundel + white letter, line pill in the mode colour.
   Mode colours per TfNSW open-data brand resources (train #F6891F, metro #168388, bus #00B5EF,
   ferry #5AB031, light rail #EE343F). Prototype use only. */
const MODE_LETTER = { train: "T", metro: "M", bus: "B", ferry: "F", lightrail: "L" };
const roundel = mode => `<i class="roundel r-${mode}" aria-hidden="true">${MODE_LETTER[mode] || "T"}</i>`;
const lineCode = o => (String(o.service).match(/\b(T\d|M\d|L\d|F\d{1,2}|\d{3})\b/) || [])[0] || "";
function legChain(o) {
  const segs = [];
  if (o.walkTo) segs.push(`<span class="lc-walk">${ICON.walk}${o.walkTo}</span>`);
  const code = lineCode(o);
  segs.push(`<span class="lc-mode">${roundel(o.mode)}${code ? `<b class="line-pill lp-${o.mode}">${code}</b>` : ""}</span>`);
  const m2 = String(o.service).match(/then bus (\d+)/i);
  if (m2) segs.push(`<span class="lc-mode">${roundel("bus")}<b class="line-pill lp-bus">${m2[1]}</b></span>`);
  const w2 = Math.max(0, o.walk - o.walkTo);
  if (w2) segs.push(`<span class="lc-walk">${ICON.walk}${w2}</span>`);
  return `<div class="leg-chain" aria-label="Journey legs">${segs.join('<i class="lc-sep">›</i>')}</div>`;
}

/* ---------- reference data ---------- */
const CROWD = ["", "Low", "Moderate", "High"];
const SEAT = ["Seat unlikely", "Seat unlikely", "Seat possible", "Seat likely", "Seat likely"];
const seatTone = s => (s <= 1 ? "warn" : s >= 3 ? "good" : "");
const relTone = r => (r >= 85 ? "good" : r < 70 ? "warn" : "");
const certainty = c => (c >= 85 ? "High" : c >= 70 ? "Medium" : "Low");
const W_LABEL = { time: "On time", reliability: "Predictability", seat: "Seat", crowd: "Crowding", walk: "Walking", transfer: "Transfers", wait: "Waiting" };
const CERT_RANGE = { High: "±2 min", Medium: "±5 min", Low: "±10+ min" };
const CERTAINTY_COPY = {
  High: "Arrival is usually within 2 minutes of this estimate.",
  Medium: "Arrival could be around 5 minutes different from this estimate.",
  Low: "Treat this as a rough guide; arrival could change by 10 minutes or more."
};
const PREFS = [
  { id: "sooner", label: "Arrive sooner" },
  { id: "seat", label: "Prioritise a seat" },
  { id: "walk", label: "Less walking" },
  { id: "transfer", label: "Avoid transfers" },
  { id: "reliable", label: "Predictable arrival" }
];
const MORE_PREFS = [
  { id: "wait", label: "Less waiting" },
  { id: "nobus", label: "Avoid buses" },
  { id: "nometro", label: "Avoid Metro" }
];
const SHORT = { sooner: "Sooner", seat: "Seat", walk: "Less walking", transfer: "No transfers", reliable: "Predictable", wait: "Less waiting", nobus: "No buses", nometro: "No Metro" };
const prefLabel = id => [...PREFS, ...MORE_PREFS].find(p => p.id === id)?.label || id;
const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const DAY_NAME = { mon: "Monday", tue: "Tuesday", wed: "Wednesday", thu: "Thursday", fri: "Friday", sat: "Saturday", sun: "Sunday" };
const DAY_DATE = { mon: 14, tue: 15, wed: 16, thu: 17, fri: 18, sat: 19, sun: 20 };
const fullDate = d => `${DAY_NAME[d]} ${DAY_DATE[d]} October`;
const daysText = days => DAYS.filter(d => days.includes(d)).map(d => DAY_NAME[d].slice(0, 3)).join(", ");
/* "Mon–Thu", "Mon, Tue, Thu", "Weekdays" */
const daysShort = days => {
  const idx = DAYS.map((d, i) => (days.includes(d) ? i : -1)).filter(i => i >= 0);
  if (idx.length === 7) return "Every day";
  if (idx.join() === "0,1,2,3,4") return "Weekdays";
  const out = []; let s = 0;
  for (let i = 1; i <= idx.length; i++) if (i === idx.length || idx[i] !== idx[i - 1] + 1) {
    const run = idx.slice(s, i).map(k => DAY_NAME[DAYS[k]].slice(0, 3));
    out.push(run.length >= 3 ? `${run[0]}–${run[run.length - 1]}` : run.join(", ")); s = i;
  }
  return out.join(", ");
};
const sameDays = (a, b) => DAYS.filter(d => a.includes(d)).join() === DAYS.filter(d => b.includes(d)).join();
const legDays = (j, dir) => (dir === "ret" ? j.ret?.days : j.days) || [];
const legTime = (j, dir) => (dir === "ret" ? j.ret?.time : j.out) || "";
const hasSchedule = j => legDays(j, "out").length > 0 || legDays(j, "ret").length > 0;
const allDays = j => [...new Set([...legDays(j, "out"), ...legDays(j, "ret")])];
const legSched = (j, dir) => { const d = legDays(j, dir), t = legTime(j, dir); return d.length ? `${daysShort(d)}${t ? ` · ${fmt(toMin(t))}` : ""}` : "Not scheduled"; };

/* Alex's saved preferences (persona: wants a seat home, needs predictable arrivals). */
const SEED_PREFS = ["seat", "reliable"];
/* How much each usual preference matters (1–10), set in Profile (review 08: keep the sliders and visible values).
   Starting values carry over from the mid-fi Priorities page: arrival 8, seat 6, reliability 9, walking 5, transfers 5. */
const SEED_LEVELS = { sooner: 8, seat: 6, walk: 5, transfer: 5, reliable: 9, wait: 5 };
const lv = k => (state.prefLevel[k] || 5) / 7;

/* Two layers, like adding a course before putting it in a timetable (R1–R4):
   - Saved journey = WHERE: From / To, optional return and name.
   - Weekly schedule = WHEN (optional), set per direction: outbound = days + out, return = ret.days + ret.time.
   Same split as the Today search card: From/To on top, Leave / Arrive by below. */
const SEED_JOURNEYS = [
  { id: "uni", from: "Wollstonecraft", to: "UTS (Central)", name: "University", out: "09:05", days: ["mon", "tue", "wed", "thu"], ret: { from: "UTS (Central)", to: "Wollstonecraft", time: "17:30", days: ["mon", "tue", "thu"] } },
  { id: "work", from: "UTS (Central)", to: "Chatswood", name: "Wednesday shift", out: "17:45", days: ["wed"], ret: { from: "Chatswood", to: "Wollstonecraft", time: "21:30", days: ["wed"] } },
  { id: "fri", from: "Wollstonecraft", to: "Chatswood", name: "Friday shift", out: "12:30", days: ["fri"], ret: { from: "Chatswood", to: "Wollstonecraft", time: "19:20", days: ["fri"] } }
];
/* One-date exceptions: "day|leg" → { time } or { skip }. On Wednesdays Alex goes from uni straight to work,
   so the uni return is simply not scheduled on Wednesdays (no exception needed). */
const SEED_OCC = {};

/* Scenarios follow the team's scenario cards (same content as mid-fi), with richer service detail. */
const S = {
  capacity: {
    num: 1, label: "Comfortable journey home", leg: "uni:ret", day: "tue", clock: "17:30", copy: "Classes are done. Let's find you a comfortable ride home.",
    overline: "TUESDAY · AFTER UNI", greeting: "Evening, Alex", target: null, targetLabel: "",
    alert: { tone: "amber", source: "Waywise prediction", title: "Peak-hour crowding at Central", copy: "North Shore trains are expected to be very full until about 18:00.", updated: "1 min ago", next: "17:35" },
    confidence: 74, why: "Peak-hour loads are predictable, but a held train can change crowding quickly.",
    options: [
      { id: "take", kind: "take", title: "Next train", service: "T1 North Shore Line to Hornsby", mode: "train", platform: "Platform 16", leaveBy: "17:30", walkTo: 6, departs: "17:38", arrives: "18:00", walk: 8, transfers: 0, crowd: 3, seat: 0, reliability: 84, ride: 22, cars: [3, 3, 3, 3, 3, 3, 2, 2], towards: "Hornsby" },
      { id: "wait", kind: "wait", title: "Later train", service: "T1 North Shore Line to Hornsby", mode: "train", platform: "Platform 16", leaveBy: "17:40", walkTo: 6, departs: "17:48", arrives: "18:10", walk: 8, transfers: 0, crowd: 2, seat: 4, reliability: 86, ride: 22, cars: [2, 2, 1, 1, 1, 1, 1, 2], towards: "Hornsby" },
      { id: "switch", kind: "switch", title: "Metro instead", service: "Metro M1 to Crows Nest · 12 min walk home", mode: "metro", platform: "Central Metro, Platform 1", leaveBy: "17:31", walkTo: 5, departs: "17:38", arrives: "18:12", walk: 17, transfers: 0, crowd: 2, seat: 2, reliability: 90, ride: 22, cars: [2, 2, 1, 1, 2, 2], towards: "Tallawong" }
    ]
  },
  disruption: {
    num: 2, label: "Getting to work on time", leg: "work:out", day: "wed", clock: "17:45", copy: "Uni ran late and your shift starts at 18:30.",
    overline: "WEDNESDAY · TO WORK", greeting: "Evening, Alex", target: "18:30", targetLabel: "shift start",
    alert: { tone: "red", source: "Operator update · Sydney Trains", title: "North Shore Line disruption", copy: "Reduced service is making platforms more crowded. Recovery time unknown.", updated: "2 min ago", next: "18:00" },
    confidence: 76, why: "Reduced frequency makes departures and crowding less certain than usual.",
    options: [
      { id: "take", kind: "take", title: "Next train", service: "T1 North Shore Line to Hornsby", mode: "train", platform: "Platform 16", leaveBy: "17:45", walkTo: 5, departs: "17:52", arrives: "18:22", walk: 7, transfers: 0, crowd: 3, seat: 0, reliability: 80, ride: 28, cars: [3, 3, 3, 3, 3, 3, 3, 2], towards: "Hornsby" },
      { id: "wait", kind: "wait", title: "Later train", service: "T1 North Shore Line to Hornsby", mode: "train", platform: "Platform 16", leaveBy: "17:54", walkTo: 5, departs: "18:01", arrives: "18:31", walk: 7, transfers: 0, crowd: 2, seat: 3, reliability: 78, ride: 28, cars: [3, 2, 2, 2, 1, 1, 1, 2], towards: "Hornsby" },
      { id: "switch", kind: "switch", title: "Metro + bus", service: "Metro M1, then bus 200 from Crows Nest", mode: "metro", platform: "Central Metro, Platform 1", leaveBy: "17:47", walkTo: 9, departs: "17:58", arrives: "18:24–18:34", walk: 14, transfers: 1, crowd: 2, seat: 2, reliability: 66, ride: 24, cars: [2, 2, 2, 1, 1, 2], towards: "Tallawong" }
    ]
  },
  normal: {
    num: 3, label: "Disruption on the way home", leg: "fri:ret", day: "fri", clock: "19:20", copy: "Shift's over, but your usual line is delayed.",
    overline: "FRIDAY · HEADING HOME", greeting: "Evening, Alex", target: "19:55", targetLabel: "arrive-by time",
    alert: { tone: "red", source: "Operator update · Sydney Trains", title: "Delays on your usual line", copy: "Trains delayed after an incident at Artarmon. Expected delay 20+ min; recovery time unknown.", updated: "1 min ago", next: "19:30" },
    confidence: 62, why: "The incident is still being managed, so delay estimates may change at the next update.",
    options: [
      { id: "take", kind: "wait", title: "Delayed train", service: "T1 North Shore Line to City", mode: "train", platform: "Platform 1", leaveBy: "19:20", walkTo: 4, departs: "19:45", arrives: "20:05–20:25", walk: 4, transfers: 0, crowd: 3, seat: 1, reliability: 45, ride: 8, cars: [3, 3, 3, 3, 3, 3, 3, 3], towards: "City" },
      { id: "wait", kind: "bus", title: "Bus instead", service: "Route 115 to Wollstonecraft", mode: "bus", platform: "Stand C, Victoria Ave", leaveBy: "19:22", walkTo: 4, departs: "19:28", arrives: "19:58", walk: 6, transfers: 0, crowd: 2, seat: 3, reliability: 82, ride: 28, cars: null, towards: "Wollstonecraft" },
      { id: "switch", kind: "switch", title: "Metro + walk", service: "Metro M1 to Crows Nest · 12 min walk home", mode: "metro", platform: "Chatswood Metro, Platform 2", leaveBy: "19:23", walkTo: 4, departs: "19:29", arrives: "19:53", walk: 16, transfers: 0, crowd: 2, seat: 2, reliability: 88, ride: 6, cars: [2, 1, 1, 1, 2, 2], towards: "Sydenham" }
    ]
  }
};
const LEG_SCN = { "uni:ret": "capacity", "work:out": "disruption", "fri:ret": "normal" };
const SCN_ALIAS = { "0": "newuser", "1": "capacity", "2": "disruption", "3": "normal" };

/* Generic options for journeys without a scripted scenario (e.g. a newly added journey). */
const genericCache = {};
function generic(from, to, clock) {
  const key = `${from}|${to}|${clock}`;
  if (genericCache[key]) return genericCache[key];
  const c = toMin(clock);
  const d = {
    generic: true, leg: null, overline: `${DAY_NAME[state.day].toUpperCase()} · ${state.clock}`, greeting: greet(state.clock),
    target: null, targetLabel: "",
    alert: { tone: "green", source: "Operator update", title: "Services running normally", copy: `No reported disruption between ${from} and ${to}.`, updated: "just now", next: fmt(c + 10) },
    confidence: 88, why: "Services are running to timetable and recent data is complete.",
    options: [
      { id: "take", kind: "take", title: "Next train", service: "Sydney Trains · direct", mode: "train", platform: "Platform 2", leaveBy: fmt(c), walkTo: 5, departs: fmt(c + 7), arrives: fmt(c + 33), walk: 9, transfers: 0, crowd: 2, seat: 2, reliability: 88, ride: 22, cars: [2, 2, 1, 1, 2, 2, 1, 1], towards: to },
      { id: "wait", kind: "wait", title: "Later train", service: "Sydney Trains · direct", mode: "train", platform: "Platform 2", leaveBy: fmt(c + 8), walkTo: 5, departs: fmt(c + 15), arrives: fmt(c + 41), walk: 9, transfers: 0, crowd: 1, seat: 4, reliability: 90, ride: 22, cars: [1, 1, 1, 1, 1, 2, 1, 1], towards: to },
      { id: "switch", kind: "bus", title: "Bus instead", service: "Local bus · direct", mode: "bus", platform: "Nearest stop", leaveBy: fmt(c + 3), walkTo: 3, departs: fmt(c + 10), arrives: fmt(c + 44), walk: 6, transfers: 0, crowd: 1, seat: 3, reliability: 76, ride: 31, cars: null, towards: to }
    ]
  };
  genericCache[key] = d;
  return d;
}

/* ---------- state ---------- */
const DEFAULTS = { time: 9, seat: 5, crowd: 5, reliability: 9, walk: 5, transfer: 5, wait: 5, modes: { train: true, metro: true, bus: true, ferry: true, lightrail: true } };
const state = {
  scenario: "disruption", journeys: clone(SEED_JOURNEYS), leg: "work:out", day: "wed", clock: "17:45",
  prefs: new Set(SEED_PREFS), prefDefault: new Set(SEED_PREFS), prefLevel: { ...SEED_LEVELS }, showMore: false, selected: null, phase: "options", stage: 0, tab: "today", overlay: null,
  jview: "list", schedDay: "wed", occ: clone(SEED_OCC), noCommute: new Set(),
  defaults: clone(DEFAULTS), savedDefaults: clone(DEFAULTS), alertsOn: true, sharing: null, reports: [],
  today: null, reminder: null, locPerm: null, learn: true, actionable: true, sheet: null, form: {}
};

/* ---------- derived ---------- */
function legInfo(key) {
  if (!key) return null;
  const [id, dir] = key.split(":");
  const j = state.journeys.find(x => x.id === id);
  if (!j) return null;
  if (dir === "ret") return j.ret ? { key, j, dir, from: j.ret.from, to: j.ret.to, time: j.ret.time } : null;
  return { key, j, dir, from: j.from, to: j.to, time: j.out };
}
function allLegs() {
  const legs = [];
  state.journeys.forEach(j => { legs.push(legInfo(`${j.id}:out`)); if (j.ret) legs.push(legInfo(`${j.id}:ret`)); });
  return legs;
}
function current() {
  let L = legInfo(state.leg);
  if (!L && state.today?.from && state.today?.to) L = { key: null, j: { id: null, name: "", ret: null }, dir: "out", from: state.today.from, to: state.today.to, time: "" };
  if (!L) return null;
  const from = state.today?.from || L.from, to = state.today?.to || L.to;
  const sid = LEG_SCN[state.leg];
  const routeChanged = from !== L.from || to !== L.to;
  /* A saved route is an OD preset: querying it starts from now. Schedule times only shape
     the suggested leg on Today (and the Schedule tab). */
  const usual = state.leg === state.suggested && L.time && toMin(L.time) > toMin(state.clock) ? fmt(toMin(L.time)) : state.clock;
  const leave = state.today?.time ? fmt(toMin(state.today.time)) : sid === state.scenario ? S[sid].clock : usual;
  const base = sid && !routeChanged ? shifted(S[sid], leave) : generic(from, to, leave);
  const target = state.today?.arriveBy || base.target;
  return { ...base, from, to, L, target, targetLabel: state.today?.arriveBy ? "arrive-by time" : base.targetLabel };
}
/* Same scripted service pattern, moved to another leave time (prototype data only). */
function shifted(base, leave) {
  const dt = toMin(leave) - toMin(base.clock);
  if (!dt) return base;
  const sh = t => t.split("–").map(x => fmt(toMin(x) + dt)).join("–");
  return { ...base, target: base.target ? sh(base.target) : null, options: base.options.map(o => ({ ...o, leaveBy: sh(o.leaveBy), departs: sh(o.departs), arrives: sh(o.arrives) })) };
}
const greet = c => (toMin(c) < 720 ? "Morning, Alex" : toMin(c) < 1020 ? "Afternoon, Alex" : "Evening, Alex");
const lateBy = (o, d) => (d.target ? Math.max(0, arrEnd(o) - toMin(d.target)) : 0);
const platformWait = o => Math.max(0, toMin(o.departs) - toMin(o.leaveBy) - o.walkTo);
const nextDep = (o, d) => {
  const sib = d.options.filter(x => x.mode === o.mode && toMin(x.departs) > toMin(o.departs)).sort((a, b) => toMin(a.departs) - toMin(b.departs))[0];
  return sib ? fmt(toMin(sib.departs)) : `~${fmt(toMin(o.departs) + 10)}`;
};
const totalMin = o => arrEnd(o) - toMin(o.leaveBy);
/* minutes from the earliest possible departure until arrival: waiting for a later service counts as time */
const etaMin = (o, d) => arrEnd(o) - Math.min(...d.options.map(x => toMin(x.leaveBy)));
function modeAvoided(o) {
  if (o.mode === "bus" && (state.prefs.has("nobus") || !state.defaults.modes.bus)) return true;
  if (o.mode === "metro" && (state.prefs.has("nometro") || !state.defaults.modes.metro)) return true;
  return false;
}
function score(o, d) {
  const D = state.defaults, w = { time: D.time / 8, seat: D.seat / 6, rel: D.reliability / 9, walk: D.walk / 5, transfer: D.transfer / 5, crowd: D.crowd / 5, wait: D.wait / 4 };
  const late = lateBy(o, d), wait = platformWait(o), p = state.prefs;
  let v = 100 - etaMin(o, d) * 1.15 * w.time + o.reliability * 0.28 * w.rel + o.seat * 2 * w.seat - o.walk * 0.6 * w.walk
    - o.transfers * 8 * w.transfer - o.crowd * 6 * w.crowd - late * 4 * w.time - wait * 0.5 * w.wait;
  /* Each chosen preference counts in proportion to how much it matters (Profile, 1–10). */
  if (p.has("sooner")) v -= (etaMin(o, d) * 2 + late * 4) * lv("sooner");
  if (p.has("seat")) v += (o.seat * 12 - o.crowd * 4 - (o.seat <= 1 ? 24 : 0)) * lv("seat");
  if (p.has("walk")) v -= o.walk * 2.7 * lv("walk");
  if (p.has("transfer")) v -= o.transfers * 20 * lv("transfer");
  if (p.has("reliable")) v += (o.reliability - 70) * 0.9 * lv("reliable");
  if (p.has("wait")) v -= wait * 3 * lv("wait");
  if (modeAvoided(o)) v -= 60;
  return v;
}
/* A shift start is a hard deadline: a late option is never recommended while an on-time one exists (scenario card 2). */
const hardDeadline = d => d.targetLabel === "shift start";
const hardLate = (o, d) => (hardDeadline(d) && lateBy(o, d) > 0 ? 1 : 0);
const ranked = d => [...d.options].sort((a, b) => (hardLate(a, d) - hardLate(b, d)) || (score(b, d) - score(a, d)));
/* "10–30 min late" for range arrivals, "Up to 4 min late" when the range starts on time. */
const lateText = (o, d) => {
  const late = lateBy(o, d); if (!late) return "";
  const parts = o.arrives.split("–");
  if (parts.length > 1 && d.target) { const s = Math.max(0, toMin(parts[0]) - toMin(d.target)); if (s !== late) return s ? `${s}–${late} min late` : `Up to ${late} min late`; }
  return `${late} min late`;
};
/* R12: a later service of the same mode states how much later it leaves and arrives. */
const MODE_WORD = { train: "train", metro: "metro", bus: "bus" };
function laterThanNext(o, d) {
  const first = d.options.filter(x => x.mode === o.mode).sort((a, b) => toMin(a.departs) - toMin(b.departs))[0];
  if (!first || first.id === o.id) return "";
  const dep = toMin(o.departs) - toMin(first.departs), arr = arrEnd(o) - arrEnd(first);
  if (dep <= 0) return "";
  return `Departs ${dep} min later than the next ${MODE_WORD[o.mode] || "service"}${arr !== dep ? ` · arrives ${arr} min later` : ""}`;
}
const waitText = o => (platformWait(o) ? `Wait ${platformWait(o)} min` : "No wait");
const selectedOption = d => d && d.options.find(o => o.id === state.selected);
/* The route the user is looking at: Route details shows the preview; the active journey otherwise. */
const focusId = () => (state.overlay === "details" ? state.preview || state.selected : state.selected);
const focusOption = d => d && d.options.find(o => o.id === focusId());

function conflicts(o, d) {
  const p = state.prefs, out = [], late = lateBy(o, d);
  const earliest = Math.min(...d.options.map(arrEnd));
  if (p.has("sooner") && arrEnd(o) - earliest >= 3) out.push(`Arrives ${arrEnd(o) - earliest} min later than the fastest option`);
  if (p.has("seat") && o.seat <= 1) out.push("Seat unlikely, but you chose Prioritise a seat");
  if (p.has("walk") && o.walk >= 12) out.push(`${o.walk} min walk, but you chose Less walking`);
  if (p.has("transfer") && o.transfers) out.push(`${o.transfers} transfer, but you chose Avoid transfers`);
  if (p.has("reliable") && o.reliability < 70) out.push(`Less predictable arrival (${o.reliability}% on time)`);
  if (p.has("wait") && platformWait(o) >= 8) out.push(`${platformWait(o)} min wait, but you chose Less waiting`);
  if (modeAvoided(o)) out.push(`Uses ${o.mode === "bus" ? "a bus" : "the Metro"}, which you chose to avoid`);
  if (late && !p.has("sooner")) out.push(`Arrives ${late} min after your ${d.target} ${d.targetLabel}`);
  return out;
}
function reason(o, d) {
  const p = state.prefs, late = lateBy(o, d), opts = d.options;
  const before = d.target ? toMin(d.target) - arrEnd(o) : null;
  const best = {
    sooner: arrEnd(o) <= Math.min(...opts.map(arrEnd)),
    seat: o.seat >= Math.max(...opts.map(x => x.seat)),
    walk: o.walk <= Math.min(...opts.map(x => x.walk)),
    reliable: o.reliability >= Math.max(...opts.map(x => x.reliability)),
    transfer: !o.transfers,
    wait: platformWait(o) <= Math.min(...opts.map(platformWait))
  };
  const say = {
    sooner: () => late ? `Earliest available arrival (${o.arrives}), but ${late} min after ${d.target}.` : `Arrives ${o.arrives}${before !== null ? `, ${before} min before your ${d.target} ${d.targetLabel}` : ""}.`,
    seat: () => `${SEAT[o.seat]} with ${CROWD[o.crowd].toLowerCase()} crowding${late ? `; arrives ${late} min after ${d.target}` : ""}.`,
    walk: () => `Least walking: ${o.walk} min in total.`,
    reliable: () => `Most predictable arrival: ${o.reliability}% of similar trips on time.`,
    transfer: () => "Direct service with no transfers.",
    wait: () => `Shortest wait: about ${platformWait(o)} min on the platform.`
  };
  for (const k of p) if (best[k] && say[k]) return say[k]();
  const bits = [];
  if (!late && d.target) bits.push(`arrives ${o.arrives}, before your ${d.target} ${d.targetLabel}`);
  else if (late) bits.push(`arrives ${o.arrives}, ${late} min after ${d.target}`);
  else bits.push(`arrives ${o.arrives}`);
  if (o.seat >= 3) bits.push(SEAT[o.seat].toLowerCase());
  if (o.walk <= 8) bits.push(`${o.walk} min walking`);
  if (o.reliability >= 85) bits.push(`${o.reliability}% on time`);
  return `${p.size ? "Best balance of your choices" : "Best fit for your usual preferences"}: ${bits.join(", ")}.`;
}
function tradeoff(o, d) {
  const alts = d.options.filter(x => x.id !== o.id);
  if (o.seat <= 2) {
    const better = alts.filter(x => x.seat > o.seat).sort((a, b) => b.seat - a.seat)[0];
    if (better) return `${CROWD[o.crowd]} crowding; ${o.seat <= 1 ? "standing likely" : "a seat is not certain"}. ${better.title} offers a better seat chance but arrives at ${better.arrives}.`;
  }
  const faster = alts.filter(x => arrEnd(x) < arrEnd(o)).sort((a, b) => arrEnd(a) - arrEnd(b))[0];
  if (faster) return `${faster.title} arrives earlier (${faster.arrives}) but is ${CROWD[faster.crowd].toLowerCase()}ly crowded with ${SEAT[faster.seat].toLowerCase()}.`.replace("highly", "very").replace("moderately", "moderately").replace("lowly", "lightly");
  if (o.walk >= 12) return `Includes ${o.walk} min of walking.`;
  return "No major trade-off against the other options right now.";
}
function scheduledToday(day) {
  if (state.noCommute.has(day)) return [];
  const legs = [];
  state.journeys.forEach(j => {
    [["out", j.from, j.to], ["ret", j.ret?.from, j.ret?.to]].forEach(([dir, from, to]) => {
      if (!from || !legDays(j, dir).includes(day)) return;
      const time = legTime(j, dir), key = `${j.id}:${dir}`, occ = state.occ[`${day}|${key}`] || {};
      legs.push({ key, j, dir, from, to, time: occ.time || time, base: time, skip: !!occ.skip, changed: !!occ.time });
    });
  });
  return legs.sort((a, b) => (a.time ? toMin(a.time) : 9999) - (b.time ? toMin(b.time) : 9999));
}

/* ---------- render: Today ---------- */
const norm = x => String(x || "").trim().toLowerCase();
/* Preferences: one usual set (Profile) + one-off changes for this journey (Today). */
const tempPrefs = () => JSON.stringify([...state.prefs].sort()) !== JSON.stringify([...state.prefDefault].sort());
const shortPlace = x => String(x).replace(/\s*\(.*\)/, "");
function renderToday() {
  const el = $("#screen-today"), d = current();
  $("#clock").textContent = state.clock;
  if (!d && !state.journeys.length) { el.innerHTML = renderFirstRun(); return; }
  const header = `<header class="app-header">
      <div><p class="overline">${DAY_NAME[state.day].toUpperCase()} ${DAY_DATE[state.day]} OCT · ${state.clock}</p><h2>${greet(state.clock)}</h2></div>
      <button class="avatar" data-act="tab" data-tab="profile" aria-label="Open Profile and account">AL</button>
    </header>`;
  if (!d) {
    el.innerHTML = `${header}
      <article class="search-card" aria-label="Choose a route">
        <div class="od">
          <button class="od-field" data-act="s-open" data-focus="from"><i class="od-dot from"></i><span><small>From</small><strong class="ph">Where from?</strong></span></button>
          <button class="od-field" data-act="s-open" data-focus="to"><i class="od-dot to"></i><span><small>To</small><strong class="ph">Where to?</strong></span></button>
          <i class="od-line" aria-hidden="true"></i>
        </div>
      </article>
      <p class="data-note">Nothing on your schedule right now. Tap From or To to pick a saved journey or enter a route.</p>`;
    return;
  }
  const rank = ranked(d), rec = rank[0], L = d.L;
  const seatLate = hardDeadline(d) && state.prefs.has("seat") ? d.options.filter(o => lateBy(o, d) && o.seat > rec.seat).sort((a, b) => b.seat - a.seat)[0] : null;
  const sched = scheduledToday(state.day).find(x => x.key === state.leg && !x.skip);
  const status = state.today
    ? (L.key ? `<div class="sc-cap today"><span>Changed for this journey only</span><button class="btn link sm" data-act="f-clear-today">Back to saved journey</button></div>`
      : `<div class="sc-cap today"><span>Route for this journey only</span><button class="btn link sm" data-act="save-adhoc">Save as journey</button></div>`)
    : sched && state.leg === state.suggested ? `<div class="sc-cap">${ICON.sparkle}<span>Suggested from your ${DAY_NAME[state.day]} schedule</span></div>`
      : `<div class="sc-cap plain"><span>Saved journey${L.j.name ? ` · ${esc(L.j.name)}` : ""}</span></div>`;
  const active = state.phase === "active" ? selectedOption(d) : null;
  const sharing = state.sharing && state.sharing.live ? `<div class="share-banner">${ICON.share}<span>Sharing arrival updates with <b>${esc(state.sharing.to)}</b><small>${state.sharing.until === "Until I arrive" ? "Until you arrive" : `For ${esc(state.sharing.until)}`}</small></span><button class="btn link sm" data-act="stop-share">Stop</button></div>` : "";
  const leave = fmt(Math.min(...d.options.map(o => toMin(o.leaveBy))));
  const np = state.prefs.size;

  const plist = [...PREFS, ...MORE_PREFS].filter(x => state.prefs.has(x.id)).map(x => SHORT[x.id] || x.label);
  const prefBar = np
    ? `<div class="rank-row">${tempPrefs() ? `<span class="rank-cap temp">This journey</span>` : `<span class="rank-cap">Your preferences</span>`}<button class="fchip on" data-act="prefs"><span class="fc-l">${esc(plist.slice(0, 2).join(", "))}</span>${np > 2 ? `<span>+${np - 2}</span>` : ""}<b class="chev">▾</b></button></div>`
    : `<div class="rank-row">${tempPrefs() ? `<span class="rank-cap temp">This journey</span>` : `<span class="rank-cap">Your preferences</span>`}<button class="fchip" data-act="prefs">Set what matters<b class="chev">▾</b></button></div>`;
  el.innerHTML = `${header}
    ${sharing}
    <article class="search-card" aria-label="Journey for today">
      ${status}
      <div class="od">
        <button class="od-field" data-act="s-open" data-focus="from" aria-label="Change start"><i class="od-dot from"></i><span><small>From</small><strong>${esc(d.from)}</strong></span></button>
        <button class="od-field" data-act="s-open" data-focus="to" aria-label="Change destination"><i class="od-dot to"></i><span><small>To</small><strong>${esc(d.to)}</strong></span></button>
        <i class="od-line" aria-hidden="true"></i>
        <button class="swap-fab" data-act="swap-dir" aria-label="Swap to the return direction">${ICON.swap}</button>
      </div>
      <div class="when">
        <button data-act="edit-today"><small>Leave</small><strong>${!state.today?.time && toMin(leave) <= toMin(state.clock) ? "Now" : `Today · ${leave}`}</strong></button>
        <button data-act="edit-today"><small>${d.targetLabel === "shift start" ? "Shift starts" : "Arrive by"}</small><strong>${d.target || "Any time"}</strong></button>
      </div>
    </article>

    <section class="block results">
      <div class="section-heading">
        <h3>Route options</h3>
      </div>
      ${prefBar}
      ${d.alert.tone === "green" ? "" : `<div class="alert-card ${d.alert.tone}" role="status">
        <div class="alert-icon">!</div>
        <div><span class="source">${esc(d.alert.source)}</span><strong>${esc(d.alert.title)}</strong><p>${esc(d.alert.copy)}</p><small>Updated ${d.alert.updated} · next update ${d.alert.next}</small></div>
      </div>`}
      ${lateBy(rec, d) && state.prefs.has("seat") ? `<div class="tradeoff-banner"><b>Trade-off:</b> ${esc(lcT(rec.title))} is more comfortable but arrives <b>${lateBy(rec, d)} min after</b> your ${d.target} ${d.targetLabel}.<button class="btn link sm" data-act="prefer-ontime">Prioritise on-time arrival</button></div>`  : seatLate ? `<div class="tradeoff-banner"><b>Trade-off:</b> ${esc(seatLate.title)} has a better seat chance but arrives <b>${lateBy(seatLate, d)} min after</b> your ${d.target} ${d.targetLabel}, so the ${esc(lcT(rec.title))} is recommended.</div>` : ""}
      <div class="route-options">${[rec, ...d.options.filter(o => o.id !== rec.id)].map(o => routeCard(o, d, rec)).join("")}</div>
    </section>
    <p class="data-note">Arrival times, crowding and seat chances are estimates, not guarantees. Always follow official transport advice.</p>`;
}
function savedItem(l) {
  return `<button class="saved-item" data-act="use-leg" data-leg="${l.key}" data-from="${esc(norm(l.from))}" data-to="${esc(norm(l.to))}">
    <span class="si-icon">${ICON.route}</span>
    <span class="si-main"><b>${esc(l.from)} → ${esc(l.to)}</b><small>${esc(l.j.name || "Saved route")}${l.dir === "ret" ? " · return" : ""}</small></span>
    <span class="si-when">${l.time && legDays(l.j, l.dir).length ? fmt(toMin(l.time)) : ""}</span></button>`;
}
/* Change journey: full-height layer above Today (Google Maps search pattern). Today underneath is not re-rendered. */
function openSearch(focus) {
  const d = current();
  state.search = { from: d?.from || "", to: d?.to || "" };
  const today = scheduledToday(state.day).filter(l => !l.skip && l.time);
  const todayKeys = new Set(today.map(l => l.key));
  const others = allLegs().filter(l => !todayKeys.has(l.key));
  const lay = $("#search-layer");
  lay.innerHTML = `
    <div class="sl-top">
      <button class="sl-back" data-act="s-close" aria-label="Back">${ICON.back}</button>
      <div class="sl-od">
        <label><i class="od-dot from"></i><input data-s="from" value="${esc(state.search.from)}" placeholder="Where from?" autocomplete="off"></label>
        <label><i class="od-dot to"></i><input data-s="to" value="${esc(state.search.to)}" placeholder="Where to?" autocomplete="off"></label>
      </div>
      <button class="sl-swap" data-act="s-swap" aria-label="Swap From and To">${ICON.swap}</button>
    </div>
    <div class="sl-body">
      <button class="btn primary full s-go" data-act="s-go" hidden>Show options for this route</button>
      ${today.length ? `<p class="overline sl-h">TODAY · ${DAY_NAME[state.day].toUpperCase()}</p><div class="saved-list">${today.map(l => savedItem(l)).join("")}</div>` : ""}
      ${others.length ? `<p class="overline sl-h">OTHER SAVED JOURNEYS</p><div class="saved-list">${others.map(l => savedItem(l)).join("")}</div>` : ""}
      <p class="no-match" hidden>No saved journey matches. Tap “Show options” to plan this route for this journey only.</p>
      <button class="btn link sm sl-add" data-act="add-journey">${ICON.plus} Add journey</button>
    </div>`;
  lay.classList.add("open");
  filterSaved(true);
  const inp = lay.querySelector(`[data-s="${focus || "to"}"]`);
  if (inp) setTimeout(() => { inp.focus({ preventScroll: true }); inp.select(); }, 220);
}
function closeSearch() { state.search = null; $("#search-layer").classList.remove("open"); }
function filterSaved(initial) {
  const q = state.search; if (!q) return;
  const d = current();
  const untouched = initial || (d && q.from === d.from && q.to === d.to);
  const f = untouched ? "" : norm(q.from), t = untouched ? "" : norm(q.to);
  let shown = 0;
  $$("#search-layer .saved-item").forEach(b => { const ok = (!f || b.dataset.from.includes(f)) && (!t || b.dataset.to.includes(t)); b.hidden = !ok; shown += ok; });
  $$("#search-layer .saved-list").forEach(l => { const h = l.previousElementSibling; if (h && h.classList.contains("sl-h")) h.hidden = ![...l.children].some(c => !c.hidden); });
  const nm = $("#search-layer .no-match"); if (nm) nm.hidden = shown > 0;
  const go = $("#search-layer .s-go"); if (go) go.hidden = untouched || !(q.from.trim() && q.to.trim());
}
/* Short label for the Recommended strip; the full sentence lives in Route details. */
function reasonShort(o, d) {
  const opts = d.options, p = state.prefs;
  if (hardDeadline(d) && !lateBy(o, d) && opts.some(x => lateBy(x, d))) return "on time for your shift";
  const checks = [
    ["seat", o.seat >= Math.max(...opts.map(x => x.seat)) && o.seat >= 3, "best seat chance"],
    ["sooner", arrEnd(o) <= Math.min(...opts.map(arrEnd)), "arrives earliest"],
    ["reliable", o.reliability >= Math.max(...opts.map(x => x.reliability)), "most predictable"],
    ["walk", o.walk <= Math.min(...opts.map(x => x.walk)), "least walking"],
    ["wait", platformWait(o) <= Math.min(...opts.map(platformWait)), "shortest wait"]
  ];
  for (const [k, ok, t] of checks) if (p.has(k) && ok) return t;
  for (const [, ok, t] of checks) if (ok) return t;
  return "best overall fit";
}
const journeyProgress = () => Math.max(6, state.stage / 3 * 100);
const ACTION_PHRASE = { take: "take this train", wait: "wait for this one", switch: "switch to this route", bus: "take the bus" };
const actionPhrase = o => (o.mode === "bus" ? "take the bus" : ACTION_PHRASE[o.kind] || "take this one");
function routeCard(o, d, rec) {
  const isRec = o.id === rec.id, live = state.phase === "active" && o.id === state.selected, late = lateBy(o, d), p = state.prefs;
  let conf = conflicts(o, d).filter(c => !c.startsWith("Arrives"));
  if (isRec && hardDeadline(d) && !lateBy(o, d) && d.options.some(x => lateBy(x, d))) conf = conf.map(c => c.startsWith("Seat unlikely") ? "Seat unlikely — your shift start comes first" : c);
  const kind = { take: ICON.go, wait: ICON.clock, switch: ICON.swap, bus: ICON.swap }[o.kind] || ICON.go;
  const strip = live ? `<div class="rec-strip live-strip"><span class="pulse"></span>In progress · ${STAGES[state.stage]}</div>`
    : isRec ? `<div class="rec-strip">${ICON.sparkle}<span><b>Recommended · ${actionPhrase(o)}</b> — ${reasonShort(o, d)}</span></div>` : "";
  const mid = live
    ? `<div class="jprog-cap"><b>${STAGES[state.stage]}</b><span>arrives <b>${o.arrives}</b></span></div>
      <ol class="stepper mini" aria-label="Journey progress">${STAGES.map((st, i) => `<li class="${i < state.stage ? "done" : i === state.stage ? "now" : ""}"><i>${i < state.stage ? ICON.check : i + 1}</i></li>`).join("")}</ol>`
    : `<p class="rc-times">Leave by <b>${o.leaveBy}</b> · Departs <b>${o.departs}</b> · ${waitText(o)}</p>${laterThanNext(o, d) ? `<p class="rc-later">${ICON.clock}<span>${laterThanNext(o, d)}</span></p>` : ""}`;
  return `<article class="route-card${isRec ? " recommended" : ""}${live ? " live" : ""}" data-route="${o.id}" data-act="open-route" data-id="${o.id}" role="button" tabindex="0" aria-label="${esc(o.title)}: view route details">
    ${strip}
    <div class="rc-body">
      <div class="rc-top">
        <div class="rc-main">
          ${legChain(o)}
          <h4><i class="kind-ic">${kind}</i>${esc(o.title)}</h4>
        </div>
        <div class="rc-arrive"><small>Arrives</small><strong class="${o.arrives.length > 5 ? "range" : ""}${late ? " late" : ""}">${o.arrives}</strong>${late ? `<em class="late">${lateText(o, d)}</em>` : d.target ? `<em class="ontime">On time</em>` : "<em>estimate</em>"}</div>
      </div>
      ${mid}
      <div class="rc-status">
        <span class="st crowd-${o.crowd}">${CROWD[o.crowd]} crowding</span>
        <span class="st ${seatTone(o.seat)}">${SEAT[o.seat]}</span>
        <span class="st ${relTone(o.reliability)}">${o.reliability}% on time</span>
        ${p.has("walk") ? `<span class="st">${o.walk} min walk</span>` : ""}
        ${p.has("transfer") ? `<span class="st">${o.transfers ? `${o.transfers} transfer` : "Direct"}</span>` : ""}
      </div>
      ${conf.length ? `<p class="conflict">${ICON.warn}<span>${esc(conf[0])}</span></p>` : ""}
      <div class="rc-foot">
        <span class="why-link">Details ›</span>
        ${live ? `<button class="btn primary sm" data-act="open-active">View journey</button>`
      : state.phase === "active" ? ""
        : `<button class="btn primary sm" data-act="start-route" data-id="${o.id}">Start</button>`}
      </div>
    </div>
  </article>`;
}
function renderFirstRun() {
  return `
    <header class="app-header">
      <div><p class="overline">WELCOME TO WAYWISE</p><h2>Hi, Alex</h2></div>
      <button class="avatar" data-act="tab" data-tab="profile" aria-label="Open Profile and account">AL</button>
    </header>
    <article class="empty-hero">
      <span class="empty-icon">${ICON.plus}</span>
      <h3>Add your first journey</h3>
      <p>Tell us where you start and where you're going. Usual times and a weekly schedule are optional, so you can add them later.</p>
      <label class="field"><span>From <b>*</b></span><input id="q-from" placeholder="e.g. Wollstonecraft" autocomplete="off"></label>
      <label class="field"><span>To <b>*</b></span><input id="q-to" placeholder="e.g. UTS (Central)" autocomplete="off"></label>
      <p class="form-error" id="q-error" role="alert"></p>
      <button class="btn primary full" data-act="quick-save">Save journey</button>
      <button class="btn link full" data-act="add-journey">More options (return trip, weekly schedule)</button>
    </article>
    <div class="empty-points">
      <p>${ICON.check} Compare taking, waiting or switching on every trip</p>
      <p>${ICON.check} See crowding and seat chances before you leave</p>
      <p>${ICON.check} Saved to your account and available on your other devices</p>
    </div>`;
}

/* ---------- render: Saved journeys ---------- */
/* Journeys view = the routes (where). Schedule view = when they repeat. Each direction has its own days and time. */
function renderJourneys() {
  const el = $("#screen-journeys"), list = state.jview === "list";
  const legRow = (j, dir) => {
    const to = dir === "ret" ? j.ret.to : j.to, on = legDays(j, dir).length;
    return `<button class="leg-row" data-act="use-leg" data-leg="${j.id}:${dir}" aria-label="Show routes to ${esc(to)} now"><span class="lr-ic">${dir === "ret" ? ICON.swap : ICON.route}</span><span class="lr-main"><b>${dir === "ret" ? "Return to" : "To"} ${esc(shortPlace(to))}</b><small class="${on ? "on" : ""}">${ICON.calendar}${legSched(j, dir)}</small></span><span class="lr-go">Routes ›</span></button>`;
  };
  const cards = state.journeys.length ? state.journeys.map(j => `
    <article class="jcard">
      <div class="jtop"><div><strong>${esc(j.from)} → ${esc(j.to)}</strong>${j.name ? `<small>${esc(j.name)}</small>` : ""}</div></div>
      <div class="leg-rows">${legRow(j, "out")}${j.ret ? legRow(j, "ret") : ""}</div>
      <div class="jfoot">
        <button class="btn link sm" data-act="edit-saved" data-id="${j.id}">${ICON.edit}Edit journey</button>
        <button class="btn link sm" data-act="sched-open" data-id="${j.id}">${hasSchedule(j) ? `${ICON.calendar}Edit schedule` : `${ICON.plus}Add to schedule`}</button>
      </div>
    </article>`).join("")
    : `<article class="empty-card"><strong>No saved journeys yet</strong><p>Save a route once and reuse it any day. Adding it to your schedule is optional.</p><button class="btn primary sm" data-act="add-journey">${ICON.plus} Add journey</button></article>`;
  el.innerHTML = `
    <header class="app-header">
      <div><p class="overline">YOUR ROUTES</p><h2>Saved journeys</h2></div>
      ${list && state.journeys.length ? `<button class="btn primary sm add-btn" data-act="add-journey">${ICON.plus} Add journey</button>` : ""}
    </header>
    <div class="segmented" role="tablist">
      <button role="tab" class="${list ? "active" : ""}" data-act="jview" data-view="list">Journeys</button>
      <button role="tab" class="${list ? "" : "active"}" data-act="jview" data-view="schedule">Schedule</button>
    </div>
    ${list ? `<div class="jlist">${cards}</div>` : renderSchedule()}`;
}
function renderSchedule() {
  const day = state.schedDay, dn = DAY_NAME[day], legs = scheduledToday(day);
  const strip = DAYS.map(dd => {
    const has = scheduledToday(dd).some(l => !l.skip);
    return `<button class="day${dd === day ? " active" : ""}" data-act="sched-day" data-day="${dd}" aria-label="${fullDate(dd)}"><small>${DAY_NAME[dd][0]}</small><strong>${DAY_DATE[dd]}</strong><i class="${has ? "on" : ""}${state.noCommute.has(dd) ? " off" : ""}"></i></button>`;
  }).join("");
  const add = `<button class="btn ghost sm full add-day" data-act="pick-open">${ICON.plus} Add to ${dn}</button>`;
  let body;
  if (state.noCommute.has(day)) {
    body = `<div class="no-plan"><strong>No commute on this date</strong><p>Suggestions and alerts are paused for ${fullDate(day)} only.</p><button class="btn ghost sm" data-act="toggle-nocommute">Restore scheduled journeys</button></div>`;
  } else if (!legs.length) {
    body = `<div class="no-plan"><strong>Nothing scheduled</strong><p>Add a saved journey to ${dn}s, or use any saved journey from Today without a schedule.</p></div>${add}`;
  } else {
    body = legs.map(l => `
      <button class="occ${l.skip ? " skipped" : ""}" data-act="occ-menu" data-key="${l.key}">
        <time>${l.time ? fmt(toMin(l.time)) : "—"}</time>
        <span class="occ-main"><strong>${esc(l.from)} → ${esc(l.to)}</strong><small>${l.skip ? "Removed for this date" : l.changed ? `Changed for this date · usually ${fmt(toMin(l.base))}` : esc(l.j.name || "Saved journey")}</small></span>
        <i>›</i>
      </button>`).join("") + add + `<button class="btn link sm full nocommute" data-act="toggle-nocommute">No commute on this date</button>`;
  }
  return `<p class="hint">Tap a journey to change its time or remove it, for this date or every week.</p>
    <div class="week-picker">${strip}</div>
    <article class="day-card"><p class="overline">${fullDate(day).toUpperCase()}</p>${body}</article>`;
}

/* ---------- render: Profile ---------- */
const MODES = [["train", "Train"], ["metro", "Metro"], ["bus", "Bus"], ["ferry", "Ferry"], ["lightrail", "Light rail"]];
/* Profile = one page: account status, default travel preferences, alerts. Saved journeys stay in their own tab. */
function renderProfile() {
  const el = $("#screen-profile"), n = state.journeys.length;
  const row = p => {
    const on = state.prefDefault.has(p.id), l = state.prefLevel[p.id];
    return `<div class="pref-item${on ? " on" : ""}"><button class="pref-row${on ? " on" : ""}" data-act="pref-def" data-pref="${p.id}" role="checkbox" aria-checked="${on}"><i>${on ? ICON.check : ""}</i><span>${p.label}</span>${on ? `<output id="lvl-${p.id}">${l}</output>` : ""}</button>
      ${on ? `<div class="pref-level"><input type="range" min="1" max="10" step="1" value="${l}" data-level="${p.id}" aria-label="How much ${p.label} matters, 1 to 10"><div class="scale"><span>1 · Less important</span><span>10 · More important</span></div></div>` : ""}</div>`;
  };
  const toggle = (k, t, sub) => `<div class="toggle-card"><span><span><strong>${t}</strong><small>${sub}</small></span></span><button class="toggle${state[k] ? " active" : ""}" data-act="toggle" data-key="${k}" aria-pressed="${state[k]}" aria-label="${t}"><i></i></button></div>`;
  el.innerHTML = `
    <header class="app-header"><div><p class="overline">PROFILE &amp; ACCOUNT</p><h2>Alex</h2></div><span class="avatar big">AL</span></header>
    <article class="account-card"><div class="acc-row">${ICON.cloud}<div><strong>Saved to your account</strong><small>alex.commuter@email.com<br>${n ? `${n} saved journey${n > 1 ? "s" : ""}, your schedule and preferences sync` : "Your preferences sync"} across your devices.</small></div></div></article>
    <section class="block">
      <div class="sec-head"><p class="overline">USUAL PREFERENCES</p><span class="saved-state">${ICON.check}Saved</span></div>
      <p class="hint">Tick what matters, then set how much (1–10). These start every journey; changes on Today apply to that journey only, unless you save them to your usual preferences.</p>
      <article class="pref-group"><div class="pref-list">${[...PREFS, MORE_PREFS[0]].map(row).join("")}</div></article>
      <div class="pref-card"><strong>Transport modes</strong><small>Turn off modes you'd rather not use. We'll explain if no route avoids them.</small>
        <div class="mode-chips">${MODES.map(([k, l]) => `<button class="chip${state.defaults.modes[k] ? " active" : ""}" data-act="mode" data-mode="${k}" role="checkbox" aria-checked="${state.defaults.modes[k]}"><i>${state.defaults.modes[k] ? ICON.check : ""}</i>${l}</button>`).join("")}</div>
      </div>
      ${toggle("learn", "Learn from my choices", "Suggest changes to my usual preferences; never change them without asking")}
      <div class="profile-links"><button class="btn link sm" data-act="method">How recommendations work ›</button><button class="btn link sm" data-act="reset-defaults">Reset preferences</button></div>
    </section>
    <section class="block">
      <p class="overline">ALERTS</p>
      ${toggle("actionable", "Actionable alerts only", "Notify me only when switching or waiting may help")}
      <p class="hint">To mute a single journey, turn off Alerts in its Route details.</p>
    </section>
    <section class="block demo-only">
      <p class="overline">PROTOTYPE</p>
      <button class="btn ghost full" data-act="scenarios">Switch demo scenario</button>
    </section>`;
}

/* ---------- render: Journey details + active ---------- */
function carriageDiagram(o, d) {
  if (!o.cars) return `<div class="cars-unavailable"><strong>Carriage-level data isn't available for buses.</strong><p>Whole-service estimate: crowding ${CROWD[o.crowd].toLowerCase()}, ${SEAT[o.seat].toLowerCase()}.</p></div>`;
  const best = o.cars.map((c, i) => [c, i]).filter(([c]) => c === Math.min(...o.cars)).map(([, i]) => i + 1);
  const reports = state.reports.filter(r => r.option === o.id);
  return `<div class="cars-wrap">
    <div class="cars-dir"><span>◀ Front of train</span><span>towards ${esc(o.towards)}</span></div>
    <div class="cars" role="img" aria-label="Estimated crowding by carriage">
      ${o.cars.map((c, i) => `<div class="car c${c}${reports.some(r => r.car === i + 1) ? " reported" : ""}"><b>${i + 1}</b><span>${["", "Low", "Med", "High"][c]}</span></div>`).join("")}
    </div>
    <div class="cars-legend"><span><i class="c1"></i>Low · seats likely</span><span><i class="c2"></i>Moderate</span><span><i class="c3"></i>High · standing</span></div>
    <p class="cars-tip"><b>${Math.min(...o.cars) === 1 ? "Best chance of a seat" : "Least crowded"}:</b> carriage${best.length > 1 ? "s" : ""} ${best.length > 2 ? `${best[0]}–${best[best.length - 1]}` : best.join(" and ")}${best[0] > o.cars.length / 2 ? " (rear of the train)" : " (front of the train)"}.</p>
    <p class="cars-meta">Waywise estimate · updated ${d.alert.updated}</p>
    ${reports.map(r => `<p class="passenger-report"><span>Passenger report</span> Carriage ${r.car}: ${esc(r.cat)}${r.note ? ` — “${esc(r.note)}”` : ""} · just now</p>`).join("")}
  </div>`;
}
function legsTimeline(o, d) {
  const steps = [
    { icon: ICON.walk, t: `Walk ${o.walkTo} min to ${o.platform}`, s: `Leave ${d.from} by ${o.leaveBy}${platformWait(o) ? ` · then about ${platformWait(o)} min wait` : ""}` },
    { icon: roundel(o.mode), t: o.service, s: `Departs ${o.departs} · about ${o.ride} min${o.transfers ? ` · ${o.transfers} transfer` : ""} · next service ${nextDep(o, current())}` },
    { icon: ICON.walk, t: `Walk ${Math.max(0, o.walk - o.walkTo)} min to ${d.to}`, s: `Arrive ${o.arrives} (estimate)` }
  ];
  return `<ol class="timeline">${steps.map(s => `<li><span class="tl-icon">${s.icon}</span><div><strong>${esc(s.t)}</strong><small>${esc(s.s)}</small></div></li>`).join("")}</ol>`;
}
/* "Why this route?" lives inside Route details (was a separate sheet). */
function whyDetails(o, d) {
  const conf = conflicts(o, d), c = certainty(d.confidence), p = [...state.prefs];
  return `<details class="why-details"><summary>Why this route?</summary>
    <p class="sheet-lede">${p.length ? `Ranked with your preferences (<b>${p.map(k => SEED_LEVELS[k] ? `${prefLabel(k)} ${state.prefLevel[k]}/10` : prefLabel(k)).join(", ")}</b>). ` : ""}${esc(reason(o, d))}</p>
    ${conf.map(x => `<p class="conflict">${ICON.warn}<span>${esc(x)}</span></p>`).join("")}
    <div class="why-block"><strong>The trade-off</strong><p>${esc(tradeoff(o, d))}</p></div>
    <div class="why-block"><strong>How reliable is this estimate?</strong>
      <p><i class="dot c-${c.toLowerCase()}"></i><b>${c}.</b> ${CERTAINTY_COPY[c]} ${esc(d.why)}</p>
      <small>${esc(d.alert.source)} · updated ${d.alert.updated}. Estimates, not guarantees.</small></div>
    <button class="btn link sm" data-act="method">How recommendations work ›</button>
  </details>`;
}
const STAGES = ["Walk to platform", "Board", "On board", "Arrived"];
/* Journey drawer: one surface with phases — preview (decide), active (execute), arrived.
   Same skeleton in every phase: header → time card → phase body → carriage → actions → CTA. */
function renderJourney() {
  const d = current(), o = focusOption(d), el = $("#screen-details");
  if (!o) { el.innerHTML = ""; return; }
  const started = state.phase === "active";
  const live = started && o.id === state.selected;
  const cur = started ? selectedOption(d) : null;
  const late = lateBy(o, d), st = state.stage, arrived = live && st === 3;
  const status = live
    ? `<span class="live-pill"><span class="pulse"></span>${arrived ? "Arrived" : "In progress"}</span>`
    : started ? `<span class="status-pill">Not your current route</span>` : "";
  let switchDiff = "";
  if (started && !live && cur) {
    const a = arrEnd(o) - arrEnd(cur), parts = [];
    parts.push(a === 0 ? "Same arrival as your current route" : a > 0 ? `Arrives ${a} min later than your current route` : `Arrives ${-a} min earlier than your current route`);
    if (o.seat !== cur.seat) parts.push(o.seat > cur.seat ? "better seat chance" : "lower seat chance");
    if (o.walk !== cur.walk) parts.push(o.walk > cur.walk ? `${o.walk - cur.walk} min more walking` : `${cur.walk - o.walk} min less walking`);
    switchDiff = `<p class="switch-diff">${ICON.compare}<span>${parts.join(" · ")}</span></p>`;
  }
  const wait = toMin(o.departs) - toMin(state.clock);
  const next = [
    { t: `Walk to ${o.platform}`, s: `${o.service} departs ${o.departs}${wait > 0 ? ` (in ${wait} min)` : ""}`, b: "I'm on the platform" },
    { t: `Board ${o.mode === "bus" ? "the bus" : `carriage ${o.cars ? o.cars.indexOf(Math.min(...o.cars)) + 1 : ""}`}`.trim(), s: o.cars ? "Fewest people expected near the " + (o.cars.indexOf(Math.min(...o.cars)) + 1 > o.cars.length / 2 ? "rear" : "front") : "Whole-bus estimate only", b: "I've boarded" },
    { t: "On board", s: `Arriving ${o.arrives}. No action needed unless something changes.`, b: "I've arrived" },
    { t: `You've arrived at ${d.to}`, s: "Thanks for travelling with Waywise.", b: null }
  ][st];
  const liveBody = `
    <ol class="stepper">${STAGES.map((s, i) => `<li class="${i < st ? "done" : i === st ? "now" : ""}"><i>${i < st ? ICON.check : i + 1}</i><span>${s}</span></li>`).join("")}</ol>
    <article class="next-card"><p class="overline">${st < 3 ? "NEXT STEP" : "DONE"}</p><strong>${esc(next.t)}</strong><p>${esc(next.s)}</p>
      ${next.b ? `<button class="btn primary sm" data-act="advance">${next.b}</button>` : `<button class="btn primary sm" data-act="end">End journey</button>`}</article>
    ${st === 1 || st === 2 ? reminderCard(o, d) : ""}
    ${st < 2 ? `<button class="board-help" data-act="compare" data-mode="board">${ICON.warn}<span><b>Too full to board, or delayed?</b><small>See the next service and other routes with their trade-offs</small></span><i>›</i></button>` : ""}`;
  const cta = live ? ""
    : started ? `<button class="btn primary full" data-act="switch-ask" data-id="${o.id}">Switch to this route</button>`
      : `<button class="btn primary full" data-act="start">Start journey</button>`;
  const keep = el.querySelector(".drawer-body")?.scrollTop || 0;
  el.innerHTML = `
    <div class="drawer-top"><button class="grab" data-act="close-drawer" aria-label="${live ? "Collapse" : "Close"}"></button><button class="drawer-x" data-act="close-drawer" aria-label="${live ? "Collapse to mini bar" : "Close"}">${live ? ICON.chevD : "×"}</button></div>
    <div class="drawer-body">
    <p class="overline">${live ? "YOUR JOURNEY" : "ROUTE DETAILS"}</p>
    <h2 class="title">${esc(o.title)}</h2>
    <p class="muted">${esc(d.from)} → ${esc(d.to)}</p>
    ${status}
    ${live && state.sharing?.live ? `<div class="share-banner">${ICON.share}<span>Sharing arrival updates with <b>${esc(state.sharing.to)}</b><small>${state.sharing.until === "Until I arrive" ? "Until you arrive" : `For ${esc(state.sharing.until)}`}</small></span><button class="btn link sm" data-act="stop-share">Stop</button></div>` : ""}
    <article class="summary-card${live ? " live" : ""}">
      <div class="timegrid big">
        <div><small>Leave by</small><strong>${o.leaveBy}</strong></div>
        <div><small>Departs</small><strong>${o.departs}</strong><em>${esc(o.platform)}</em></div>
        <div><small>Arrives</small><strong>${o.arrives}</strong>${late ? `<em class="late">${lateText(o, d)}</em>` : d.target ? `<em class="ontime">On time</em>` : ""}</div>
      </div>
      <button class="conf-row" data-act="certainty" aria-label="How reliable is this estimate?"><i class="c-${certainty(d.confidence).toLowerCase()}"></i>Arrival estimate confidence: <b>${certainty(d.confidence)}</b> · updated ${d.alert.updated}<span class="conf-more">›</span></button>
    </article>
    ${switchDiff}
    ${live ? liveBody : legsTimeline(o, d) + whyDetails(o, d)}
    ${!arrived ? `<section class="block"><p class="overline">CROWDING BY CARRIAGE</p><h3>Where to board</h3>${carriageDiagram(o, d)}</section>` : ""}
    ${live ? "" : `<div class="toggle-card"><span>${ICON.bell}<span><strong>Alerts for this journey</strong><small>${state.alertsOn ? "On: we'll tell you if this service is delayed or gets too crowded." : "Off: you won't be notified about changes to this journey."}</small></span></span><button class="toggle${state.alertsOn ? " active" : ""}" data-act="toggle" data-key="alertsOn" aria-pressed="${state.alertsOn}"><i></i></button></div>`}
    <div class="action-list">
      ${arrived ? "" : `<button data-act="compare">${ICON.compare}<span>Compare alternatives</span><i>›</i></button>`}
      <button data-act="report">${ICON.flag}<span>Report carriage conditions</span><i>›</i></button>
      <button data-act="share">${ICON.share}<span>${state.sharing?.live ? "Sharing arrival updates" : "Share journey"}</span><i>›</i></button>
    </div>
    ${live && st < 3 ? `<button class="btn ghost full danger end-btn" data-act="end-ask">End journey</button><p class="hint center">You can end the journey at any time.</p>` : ""}
    </div>
    ${cta ? `<div class="drawer-foot">${cta}</div>` : ""}`;
  el.querySelector(".drawer-body").scrollTop = keep;
}
/* Arrival reminder (extra, not in the evaluation list): needs location, falls back to the timetable. */
function reminderCard(o, d) {
  const at = fmt(arrEnd(o) - 4), r = state.reminder, perm = state.locPerm;
  const on = !!r;
  const sub = !on ? `We'll tell you when to get ready, one stop before ${esc(d.to)}.`
    : r === "location" ? `On · using your location${perm === "once" ? " (this trip only)" : ""}. One stop before ${esc(d.to)}, about ${at}.`
      : `On · by timetable, about ${at}. Less accurate without location.`;
  return `<div class="toggle-card reminder${on ? " on" : ""}"><span>${ICON.bell}<span><strong>Arrival reminder</strong><small>${sub}</small>
      ${r === "timetable" ? `<button class="btn link sm" data-act="perm-ask">Use my location instead</button>` : ""}</span></span>
    <button class="toggle${on ? " active" : ""}" data-act="reminder" aria-pressed="${on}"><i></i></button></div>`;
}

/* ---------- sheets ---------- */
function openSheet(kind, arg, keepScroll) {
  state.sheet = { kind, arg };
  const sh = $("#sheet"), top = keepScroll ? $(".sheet-body", sh)?.scrollTop || 0 : 0;
  sh.innerHTML = `<button class="sheet-handle" data-act="close-sheet" aria-label="Close"></button><button class="sheet-x" data-act="close-sheet" aria-label="Close">×</button><div class="sheet-body">${SHEETS[kind](arg)}</div>`;
  /* Primary actions move into a fixed footer below the scrolling body (position:sticky drifts on iOS). */
  const body = $(".sheet-body", sh), act = body.lastElementChild;
  if (act && act.classList.contains("sheet-actions")) sh.appendChild(act);
  body.scrollTop = top;
  $("#backdrop").classList.add("open"); sh.classList.add("open");
}
function closeSheet() { state.sheet = null; $("#backdrop").classList.remove("open"); $("#sheet").classList.remove("open"); }
function refreshSheet() { if (state.sheet) openSheet(state.sheet.kind, state.sheet.arg, true); }

const SHEETS = {
  prefs() {
    const row = p => { const on = state.prefs.has(p.id); return `<button class="pref-row${on ? " on" : ""}" data-act="pref" data-pref="${p.id}" role="checkbox" aria-checked="${on}"><i>${on ? ICON.check : ""}</i><span>${p.label}</span></button>`; };
    const n = state.prefs.size;
    const dirty = JSON.stringify([...state.prefs].sort()) !== JSON.stringify([...state.prefDefault].sort());
    return `<p class="overline">YOUR PREFERENCES</p><h3>What matters to you?</h3>
      <p class="hint">Select all that apply · applies to this journey only.</p>
      <div class="pref-list">${PREFS.map(row).join("")}</div>
      <p class="overline sl-h">MORE</p>
      <div class="pref-list">${MORE_PREFS.map(row).join("")}</div>
      <div class="sheet-actions">
        <button class="btn primary full" data-act="close-sheet">Done${n ? ` · ${n} selected` : ""}</button>
        ${dirty ? `<div class="split"><button class="btn link sm" data-act="reset-prefs">Reset</button><button class="btn link sm" data-act="save-default">Save to usual preferences</button></div>` : ""}
      </div>`;
  },
  switchConfirm(id) {
    const d = current(), o = d.options.find(x => x.id === id), cur = selectedOption(d);
    const a = cur ? arrEnd(o) - arrEnd(cur) : 0;
    return `<p class="overline">SWITCH ROUTE</p><h3>Switch to ${esc(lcT(o.title))}?</h3>
      <p class="sheet-lede">Your current journey (${esc(cur ? lcT(cur.title) : "")}) ends and this one starts from your current step. ${a === 0 ? "Arrival stays the same" : a > 0 ? `You'd arrive <b>${a} min later</b>` : `You'd arrive <b>${-a} min earlier</b>`} (${o.arrives}).${state.sharing?.live ? ` <b>${esc(state.sharing.to)}</b> keeps getting updates on the new route.` : ""}${state.reminder ? " Your arrival reminder moves to the new route." : ""}</p>
      <div class="sheet-actions"><button class="btn primary full" data-act="switch-to" data-id="${o.id}">Switch route</button><button class="btn ghost full" data-act="close-sheet">Keep current journey</button></div>`;
  },
  endConfirm() {
    const o = selectedOption(current());
    return `<p class="overline">END JOURNEY</p><h3>End this journey?</h3>
      <p class="sheet-lede">${esc(o.title)}. Alerts${state.reminder ? " and your arrival reminder" : ""} will stop.${state.sharing?.live ? ` <b>${esc(state.sharing.to)}</b> will stop getting arrival updates.` : ""}</p>
      <div class="sheet-actions"><button class="btn primary full danger-fill" data-act="end">End journey</button><button class="btn ghost full" data-act="close-sheet">Keep going</button></div>`;
  },
  method() {
    return `<p class="overline">HOW RECOMMENDATIONS WORK</p><h3>Useful detail, not a black box</h3>
      <div class="method-item"><span>1</span><div><strong>Current conditions</strong><p>Delays, frequency, crowding and when the data was last updated. Operator updates are labelled separately from Waywise predictions.</p></div></div>
      <div class="method-item"><span>2</span><div><strong>Your preferences</strong><p>Your usual preferences start every journey, and each counts as much as you set it in Profile (1–10). Changes on Today apply to that journey only, unless you save them to your usual preferences.</p></div></div>
      <div class="method-item"><span>3</span><div><strong>Arrival estimate confidence</strong><p>How closely arrival times and crowding are likely to match what's shown.</p></div></div>
      <button class="btn ghost full" data-act="close-sheet">Done</button>`;
  },
  certainty() {
    const d = current(), c = certainty(d.confidence);
    return `<p class="overline">ARRIVAL ESTIMATE CONFIDENCE</p><h3>How reliable is this estimate?</h3>
      <p class="sheet-lede"><i class="dot c-${c.toLowerCase()}"></i><b>${c}.</b> ${CERTAINTY_COPY[c]}</p>
      <p class="sheet-lede">${esc(d.why)}</p>
      <ul class="legend-list"><li><b>High</b> usually within 2 min</li><li><b>Medium</b> could be about 5 min different</li><li><b>Low</b> treat as a rough guide</li></ul>
      <p class="hint">${esc(d.alert.source)} · updated ${d.alert.updated} · next update ${d.alert.next}</p>
      <button class="btn ghost full" data-act="close-sheet">Done</button>`;
  },
  compare(mode) {
    const d = current(), cur = focusOption(d);
    const alts = d.options.filter(o => o.id !== cur.id);
    const diff = o => {
      const a = arrEnd(o) - arrEnd(cur), parts = [];
      parts.push(a === 0 ? "same arrival" : a > 0 ? `arrives ${a} min later` : `arrives ${-a} min earlier`);
      if (o.seat !== cur.seat) parts.push(o.seat > cur.seat ? "better seat chance" : "lower seat chance");
      if (o.walk !== cur.walk) parts.push(o.walk > cur.walk ? `${o.walk - cur.walk} min more walking` : `${cur.walk - o.walk} min less walking`);
      if (o.transfers !== cur.transfers) parts.push(o.transfers > cur.transfers ? `${o.transfers} transfer` : "no transfer");
      return parts.join(" · ");
    };
    return `<p class="overline">${mode === "board" ? "CAN'T BOARD OR DELAYED?" : "COMPARE ALTERNATIVES"}</p><h3>Other ways to ${esc(d.to)}</h3>
      <p class="sheet-lede">Compared with <b>${esc(lcT(cur.title))}</b> (arrives ${cur.arrives}).${mode === "board" ? " If this service is too full to board, the next service and other routes are below." : ""}</p>
      ${alts.map(o => `<article class="alt-card"><div><strong>${esc(o.title)}</strong><small>Departs ${o.departs} · arrives ${o.arrives} · ${CROWD[o.crowd].toLowerCase()} crowding</small><p>${diff(o)}</p></div>
        <button class="btn primary sm" data-act="${state.phase === "active" ? "switch-ask" : "switch-to"}" data-id="${o.id}">${state.phase === "active" ? "Switch" : "View"}</button></article>`).join("")}
      <button class="btn ghost full" data-act="close-sheet">Keep ${esc(lcT(cur.title))}</button>`;
  },
  report(step) {
    const d = current(), o = focusOption(d), f = state.form;
    if (step === "done") return `<p class="overline">REPORT SENT</p><h3>Thanks for letting us know</h3>
      <p class="sheet-lede">Your report about carriage ${f.car} is now shown to other riders on this service as a <b>passenger report</b>, separate from ${o.mode === "bus" ? "operator" : "Sydney Trains"} information.</p>
      <button class="btn primary full" data-act="close-sheet">Done</button>`;
    const cats = ["More crowded than shown", "Cleanliness", "Damaged or unavailable seats", "Something else"];
    const n = o.cars ? o.cars.length : 0;
    return `<p class="overline">REPORT CARRIAGE CONDITIONS</p><h3>${esc(o.service)}</h3>
      <p class="hint">Departs ${o.departs} · ${esc(o.platform)}</p>
      ${n ? `<p class="form-label">Which carriage?</p><div class="car-pick">${Array.from({ length: n }, (_, i) => `<button class="${f.car === i + 1 ? "active" : ""}" data-act="r-car" data-car="${i + 1}">${i + 1}</button>`).join("")}</div>` : `<p class="hint">Buses don't have carriages; your report applies to the whole bus.</p>`}
      <p class="form-label">What's the problem?</p>
      <div class="cat-pick">${cats.map(c => `<button class="chip single${f.cat === c ? " active" : ""}" role="radio" aria-checked="${f.cat === c}" data-act="r-cat" data-cat="${c}"><i>${f.cat === c ? ICON.check : ""}</i>${c}</button>`).join("")}</div>
      <label class="field"><span>Comment (optional)</span><textarea id="r-note" rows="2" placeholder="e.g. Seats in the middle section are wet">${esc(f.note || "")}</textarea></label>
      <p class="hint">Reports are labelled as passenger reports and kept separate from operator information.</p>
      <div class="sheet-actions"><button class="btn primary full" data-act="r-submit" ${f.cat && (f.car || !n) ? "" : "disabled"}>Send report</button><button class="btn ghost full" data-act="close-sheet">Cancel</button></div>`;
  },
  share() {
    const d = current(), o = focusOption(d), f = state.form;
    const to = f.to || "Mum", live = !!f.live, until = f.until || "Until I arrive";
    const msg = `I'm taking the ${o.departs} ${o.service.split(" · ")[0]} from ${d.from}. Estimated arrival at ${d.to}: ${o.arrives}.`;
    return `<p class="overline">SHARE JOURNEY</p><h3>Let someone know when you'll arrive</h3>
      <p class="form-label">Share with</p>
      <div class="cat-pick">${["Mum", "Sam (manager)", "Copy link"].map(x => `<button class="chip single${to === x ? " active" : ""}" role="radio" aria-checked="${to === x}" data-act="s-to" data-to="${x}"><i>${to === x ? ICON.check : ""}</i>${x}</button>`).join("")}</div>
      <p class="form-label">What to share</p>
      <div class="radio-list">
        <button class="${live ? "" : "active"}" data-act="s-live" data-live="0"><i></i><span><strong>Arrival time once</strong><small>A one-off message with your route and estimated arrival.</small></span></button>
        <button class="${live ? "active" : ""}" data-act="s-live" data-live="1"><i></i><span><strong>Live arrival updates</strong><small>Updates when your estimated arrival changes or you switch route. Shares progress by stop, not your exact location.</small></span></button>
      </div>
      ${live ? `<p class="form-label">For how long?</p><div class="cat-pick">${["Until I arrive", "30 min", "1 hour"].map(x => `<button class="chip single${until === x ? " active" : ""}" role="radio" aria-checked="${until === x}" data-act="s-until" data-until="${x}"><i>${until === x ? ICON.check : ""}</i>${x}</button>`).join("")}</div>` : ""}
      <div class="msg-preview"><small>Preview</small><p>${esc(msg)}${live ? " You'll get updates if this changes." : ""}</p></div>
      <div class="sheet-actions"><button class="btn primary full" data-act="s-send">${live ? "Start sharing" : "Send"}</button><button class="btn ghost full" data-act="close-sheet">Cancel</button></div>`;
  },
  scenarios() {
    return `<p class="overline">DEMO CONTROLS · FICTIONAL DATA</p><h3>Switch scenario</h3>
      <div class="scenario-options">${[["newuser", "0 · First-time user"], ["capacity", "1 · Comfortable journey home"], ["disruption", "2 · Getting to work on time"], ["normal", "3 · Disruption on the way home"]]
        .map(([k, l]) => `<button class="scenario${state.scenario === k ? " active" : ""}" data-scenario="${k}">${l}</button>`).join("")}</div>
      <button class="btn ghost full" data-act="close-sheet">Done</button>`;
  },
  form(mode) { return journeyForm(mode); }
};

/* Journey forms. Saved journey = WHERE (From/To, return). Schedule = WHEN (days + time per direction).
   Every sheet names its scope: this saved journey / every week / one date (R3, R4, R7; review pages 05–07). */
const schedLeg = key => scheduledToday(state.schedDay).find(x => x.key === key);
const dayToggles = (set, sel) => `<div class="day-toggles">${DAYS.map(dd => `<button class="${sel.includes(dd) ? "active" : ""}" data-act="f-day" data-set="${set}" data-day="${dd}" aria-pressed="${sel.includes(dd)}" aria-label="${DAY_NAME[dd]}">${DAY_NAME[dd][0]}</button>`).join("")}</div>`;
function openSched(id, preDay) {
  const j = state.journeys.find(x => x.id === id);
  const days = [...j.days], retDays = [...(j.ret?.days || [])];
  if (preDay) { if (!days.includes(preDay)) days.push(preDay); if (j.ret && !retDays.includes(preDay)) retDays.push(preDay); }
  state.form = { id, days, out: j.out || "", retDays, retTime: j.ret?.time || "", retSame: !j.ret || sameDays(days, retDays) };
  openSheet("form", "sched");
}
function journeyForm(mode) {
  const f = state.form, err = `<p class="form-error" id="f-error" role="alert">${esc(f.error || "")}</p>`;
  const cancel = `<button class="btn ghost full" data-act="close-sheet">Cancel</button>`;
  const radio = (scope, on, t, sub) => `<button class="${on ? "active" : ""}" data-act="f-scope" data-scope="${scope}"><i></i><span><strong>${t}</strong><small>${sub}</small></span></button>`;
  if (mode === "add" || mode === "edit-saved") {
    const isAdd = mode === "add", autoName = f.from && f.to ? `${f.from} → ${f.to}` : "From → To";
    return `<p class="overline">SAVED JOURNEY · WHERE</p><h3>${isAdd ? "Add journey" : "Edit saved journey"}</h3>
      ${isAdd ? `<p class="hint">Start with where you go. Days and times are optional; you can add them next.</p>`
        : `<p class="scope-note">Changes this route everywhere it's used, including scheduled dates. Days and times live in its schedule.</p>`}
      <div class="field-row swap-row">
        <label class="field"><span>From <b>*</b></span><input data-f="from" value="${esc(f.from || "")}" placeholder="e.g. Wollstonecraft" autocomplete="off"></label>
        <button class="swap-btn" data-act="f-swap" aria-label="Swap From and To">${ICON.swap}</button>
        <label class="field"><span>To <b>*</b></span><input data-f="to" value="${esc(f.to || "")}" placeholder="e.g. Chatswood" autocomplete="off"></label>
      </div>
      <p class="auto-name">Journey name: <b id="auto-name">${esc(autoName)}</b></p>
      <label class="field"><span>Custom name (optional)</span><input data-f="name" value="${esc(f.name || "")}" placeholder="e.g. Friday shift" autocomplete="off"></label>
      <label class="check"><input type="checkbox" data-f="hasRet" ${f.hasRet ? "checked" : ""}> I also travel back</label>
      ${f.hasRet ? `<div class="field-row"><label class="field"><span>Return from</span><input data-f="retFrom" value="${esc(f.retFrom || "")}" placeholder="Same as To" autocomplete="off"></label><label class="field"><span>Return to</span><input data-f="retTo" value="${esc(f.retTo || "")}" placeholder="Same as From" autocomplete="off"></label></div>` : ""}
      ${isAdd ? "" : `<button class="btn link sm danger-text" data-act="delete-ask">Delete this journey</button>`}
      ${err}
      <div class="sheet-actions"><button class="btn primary full" data-act="f-save">Save journey</button>${cancel}</div>`;
  }
  if (mode === "added") {
    const j = state.journeys.find(x => x.id === f.id);
    return `<span class="saved-ok">${ICON.check}</span><p class="overline">JOURNEY SAVED</p><h3>${esc(j.from)} → ${esc(j.to)}</h3>
      <p class="sheet-lede">${j.ret ? "Return trip included. " : ""}You can use it from Today any time.</p>
      <div class="next-q"><strong>Do you travel this regularly?</strong><p>Add days and times, and Waywise will suggest it on Today and alert you to changes before you leave.</p></div>
      <div class="sheet-actions"><button class="btn primary full" data-act="sched-open" data-id="${j.id}">Add to schedule</button><button class="btn link full" data-act="use-leg" data-leg="${j.id}:out">Show routes now</button><button class="btn ghost full" data-act="close-sheet">Not now</button></div>`;
  }
  if (mode === "sched") {
    const j = state.journeys.find(x => x.id === f.id), had = hasSchedule(j);
    const rd = f.retSame ? f.days : f.retDays, any = f.days.length || (j.ret && rd.length);
    return `<p class="overline">WEEKLY SCHEDULE · WHEN</p><h3>${had ? "Edit schedule" : "Add to schedule"}</h3>
      <p class="sheet-lede">${esc(j.from)} → ${esc(j.to)}${j.name ? ` · ${esc(j.name)}` : ""}</p>
      <section class="sched-leg"><p class="form-label">${ICON.route}To ${esc(shortPlace(j.to))}</p>
        ${dayToggles("out", f.days)}
        <label class="field"><span>Leave at</span><input type="time" data-f="out" value="${pad(f.out)}"></label></section>
      ${j.ret ? `<section class="sched-leg"><p class="form-label">${ICON.swap}Return to ${esc(shortPlace(j.ret.to))}</p>
        <label class="check"><input type="checkbox" data-f="retSame" ${f.retSame ? "checked" : ""}> Same days as going</label>
        ${f.retSame ? "" : dayToggles("ret", f.retDays)}
        <label class="field"><span>Leave at</span><input type="time" data-f="retTime" value="${pad(f.retTime)}"></label></section>` : ""}
      <p class="scope-note">${any ? "Repeats every week. Waywise suggests it on Today on these days and alerts you before you leave. To change one date only, tap it in Schedule." : "No days selected. The journey stays saved and can be used any day."}</p>
      ${err}
      <div class="sheet-actions"><button class="btn primary full" data-act="f-save-sched">Save schedule</button>${had ? `<button class="btn link full danger-text" data-act="f-remove-sched">Remove from schedule</button>` : ""}${cancel}</div>`;
  }
  if (mode === "pick") {
    const day = state.schedDay, dn = DAY_NAME[day];
    const items = state.journeys.map(j => {
      const full = legDays(j, "out").includes(day) && (!j.ret || legDays(j, "ret").includes(day));
      const sub = full ? `Already on ${dn}s` : hasSchedule(j) ? `Scheduled ${daysShort(allDays(j))}` : j.name ? `${esc(j.name)} · not scheduled` : "Not scheduled";
      return `<button class="saved-item" data-act="pick-journey" data-id="${j.id}" ${full ? "disabled" : ""}><span class="si-icon">${ICON.route}</span><span class="si-main"><b>${esc(j.from)} → ${esc(j.to)}</b><small>${sub}</small></span><i class="si-chev">›</i></button>`;
    }).join("");
    return `<p class="overline">SCHEDULE · ${dn.toUpperCase()}</p><h3>Add to ${dn}</h3>
      <p class="hint">${items ? `Pick a saved journey, then set its time. It repeats every ${dn}; you can still change or remove a single date.` : "Save the journey first, then choose its days and time."}</p>
      ${items ? `<div class="saved-list">${items}</div>` : ""}
      <button class="btn ${items ? "link" : "primary"} sm sl-add" data-act="add-journey" data-day="${day}">${ICON.plus} New journey</button>`;
  }
  if (mode === "occ") {
    const l = schedLeg(f.key); if (!l) return "";
    return `<p class="overline">${fullDate(state.schedDay).toUpperCase()}</p><h3>${esc(l.from)} → ${esc(l.to)}</h3>
      <p class="sheet-lede">${l.skip ? "Removed for this date." : `Leave at ${fmt(toMin(l.time))}${l.changed ? `, changed for this date (usually ${fmt(toMin(l.base))})` : ""}.`}${l.j.name ? ` ${esc(l.j.name)}.` : ""}</p>
      <p class="overline sl-h">THIS TRIP</p>
      <div class="action-list">${l.skip
        ? `<button data-act="unskip" data-key="${l.key}">${ICON.check}<span>Restore for this date</span><i>›</i></button>`
        : `<button data-act="use-leg" data-leg="${l.key}">${ICON.route}<span>Show routes now</span><i>›</i></button>
          <button data-act="occ-time">${ICON.clock}<span>Change time</span><i>›</i></button>
          <button data-act="occ-remove">${ICON.x}<span>Remove from schedule</span><i>›</i></button>`}</div>
      <p class="overline sl-h">THE ROUTE ITSELF</p>
      <div class="action-list"><button data-act="edit-saved" data-id="${l.j.id}">${ICON.edit}<span>Edit saved journey</span><i>›</i></button></div>
      <p class="hint">Changes From, To or the name everywhere this journey is used.</p>`;
  }
  if (mode === "occ-time") {
    const l = schedLeg(f.key), every = f.scope === "every", dn = DAY_NAME[state.schedDay];
    return `<p class="overline">CHANGE TIME</p><h3>${esc(l.from)} → ${esc(l.to)}</h3>
      <label class="field"><span>Leave at</span><input type="time" data-f="time" value="${pad(f.time)}"></label>
      <p class="form-label">Apply to</p>
      <div class="radio-list">
        ${radio("one", !every, `Only ${fullDate(state.schedDay)}`, `Other ${dn}s stay at ${fmt(toMin(l.base))}.`)}
        ${radio("every", every, `Every week · ${daysShort(legDays(l.j, l.dir))}`, "Changes the usual time in your schedule.")}
      </div>
      ${l.changed && !every ? `<button class="btn link sm" data-act="f-occ-reset">Go back to the usual time (${fmt(toMin(l.base))})</button>` : ""}
      ${err}
      <div class="sheet-actions"><button class="btn primary full" data-act="f-save-occ">${every ? "Save for every week" : "Save for this date"}</button>${cancel}</div>`;
  }
  if (mode === "occ-remove") {
    const l = schedLeg(f.key), every = f.scope === "every", dn = DAY_NAME[state.schedDay];
    return `<p class="overline">REMOVE FROM SCHEDULE</p><h3>${esc(l.from)} → ${esc(l.to)}</h3>
      <div class="radio-list">
        ${radio("one", !every, `Only ${fullDate(state.schedDay)}`, "No suggestion or alerts that day. You can restore it.")}
        ${radio("every", every, `Every ${dn}`, `Takes ${dn} out of this journey's weekly schedule.`)}
      </div>
      <p class="scope-note">The saved journey stays. You can still use it from Today any time.</p>
      <div class="sheet-actions"><button class="btn primary full danger-fill" data-act="f-remove-occ">${every ? `Remove every ${dn}` : "Remove this date"}</button>${cancel}</div>`;
  }
  if (mode === "delete") {
    const j = state.journeys.find(x => x.id === f.id);
    return `<p class="overline">DELETE JOURNEY</p><h3>Delete ${esc(j.from)} → ${esc(j.to)}?</h3>
      <p class="sheet-lede">${hasSchedule(j) ? "It will also be removed from your schedule. " : ""}This can't be undone.</p>
      <div class="sheet-actions"><button class="btn primary full danger-fill" data-act="f-delete">Delete journey</button>${cancel}</div>`;
  }
  if (mode === "edit-today") {
    return `<p class="overline">THIS JOURNEY ONLY</p><h3>Time for this journey</h3>
      <div class="field-row"><label class="field"><span>Leave at</span><input type="time" data-f="time" value="${pad(f.time)}"></label><label class="field"><span>Arrive by (optional)</span><input type="time" data-f="arriveBy" value="${pad(f.arriveBy)}"></label></div>
      <p class="scope-note">Only this journey changes. Your saved journey and schedule stay the same.</p>
      ${err}
      <div class="sheet-actions"><button class="btn primary full" data-act="f-save-today">Use for this journey</button>${state.today?.time ? `<button class="btn link full" data-act="f-now">Leave now</button>` : ""}${state.today && current()?.L.key ? `<button class="btn link full" data-act="f-clear-today">Go back to the saved journey</button>` : ""}<button class="btn ghost full" data-act="close-sheet">Cancel</button></div>`;
  }
  return "";
}

/* Simulated iOS location permission prompt (prototype only). */
function openPerm() {
  const d = current();
  $("#perm").innerHTML = `<div class="perm-box" role="alertdialog" aria-labelledby="perm-t">
    <strong id="perm-t">Allow “Waywise” to use your location?</strong>
    <p>Used on this device to remind you one stop before ${esc(d.to)}. Shared journeys only show progress by stop, never your exact location.</p>
    <button data-act="perm" data-v="always">Allow While Using App</button>
    <button data-act="perm" data-v="once">Allow Once</button>
    <button data-act="perm" data-v="deny">Don't Allow</button></div>`;
  $("#perm").classList.add("open");
}
/* ---------- toast ---------- */
function toast(title, copy, action) {
  const t = $("#toast");
  t.innerHTML = `<span class="t-icon">${ICON.check}</span><div><strong>${esc(title)}</strong>${copy ? `<p>${esc(copy)}</p>` : ""}</div>${action ? `<button class="btn link sm" data-act="${action.act}" ${action.attrs || ""}>${action.label}</button>` : ""}`;
  t.classList.add("show");
  clearTimeout(toast.timer); toast.timer = setTimeout(() => t.classList.remove("show"), action ? 4200 : 2400);
}

/* ---------- navigation ---------- */
function show() {
  $$(".screen:not(.drawer)").forEach(s => s.classList.toggle("active", s.id === `screen-${state.tab}`));
  $$(".screen.drawer").forEach(s => s.classList.toggle("open", s.id === `screen-${state.overlay}`));
  $("#drawer-backdrop").classList.toggle("open", !!state.overlay);
  $$(".nav-item").forEach(b => b.classList.toggle("active", b.dataset.tab === state.tab));
  renderAll();
}
function renderMini() {
  const d = current(), o = state.phase === "active" ? selectedOption(d) : null, m = $("#mini-bar");
  const showIt = o && state.overlay !== "details";
  m.classList.toggle("show", !!showIt);
  if (showIt) m.innerHTML = `<span class="pulse"></span><span class="mb-main"><b>In progress · ${esc(o.title)}</b><small>${STAGES[state.stage]} · arrives ${o.arrives}</small><span class="jprog mini"><span style="width:${journeyProgress()}%"></span></span></span><span class="mb-open">Open ›</span>`;
}
function renderAll() {
  renderToday(); renderJourneys(); renderProfile(); renderMini();
  if (state.overlay === "details") renderJourney();
}
function setTab(tab) { state.tab = tab; state.overlay = null; show(); $(`#screen-${tab}`).scrollTop = 0; }
function openOverlay(name) { state.overlay = name; show(); const s = $(`#screen-${name}`); s.scrollTop = 0; const b = $(".drawer-body", s); if (b) b.scrollTop = 0; }

function resetJourneyState() { state.prefs = new Set(state.prefDefault); state.selected = null; state.preview = null; state.phase = "options"; state.stage = 0; state.today = null; state.sharing = null; state.reports = []; state.overlay = null; }
/* If today's suggested journey is skipped or the day is marked "No commute", Today goes back to an empty card. */
function syncSuggestion() {
  if (state.leg && state.leg === state.suggested && !state.today && !scheduledToday(state.day).some(l => l.key === state.leg && !l.skip)) { state.leg = null; state.suggested = null; resetJourneyState(); }
}
function useLeg(key) {
  if (!legInfo(key)) return;
  const changed = key !== state.leg;
  state.leg = key; resetJourneyState();
  const L = legInfo(key);
  setTab("today");
  if (changed) toast(`${L.from} → ${L.to}`, "Showing routes for this journey.");
}
function setScenario(id) {
  id = SCN_ALIAS[id] || id;
  if (id !== "newuser" && !S[id]) return;
  state.scenario = id; resetJourneyState();
  state.occ = clone(SEED_OCC); state.noCommute = new Set(); state.form = {}; state.prefDefault = id === "newuser" ? new Set() : new Set(SEED_PREFS); state.prefs = new Set(state.prefDefault); state.prefLevel = { ...SEED_LEVELS };
  if (id === "newuser") { state.journeys = []; state.leg = null; state.day = "tue"; state.clock = "08:40"; state.schedDay = "tue"; }
  else { const s = S[id]; state.journeys = clone(SEED_JOURNEYS); state.day = s.day; state.leg = scheduledToday(s.day).some(l => l.key === s.leg && !l.skip) ? s.leg : null; state.suggested = state.leg; state.clock = s.clock; state.schedDay = s.day; }
  $$(".demo-notes .scenario").forEach(b => b.classList.toggle("active", b.dataset.scenario === id));
  try { localStorage.setItem("waywise-hifi-scenario", id); } catch (e) { }
  closeSheet(); closeSearch(); setTab("today");
}

/* ---------- actions ---------- */
let navTimer;
const A = {
  tab: b => setTab(b.dataset.tab),
  "close-sheet": () => closeSheet(),
  pref: b => { const k = b.dataset.pref; state.prefs.has(k) ? state.prefs.delete(k) : state.prefs.add(k); renderAll(); refreshSheet(); },
  "more-prefs": () => { state.showMore = !state.showMore; renderToday(); },
  "reset-prefs": () => { state.prefs = new Set(state.prefDefault); renderAll(); refreshSheet(); },
  "save-default": () => { state.prefDefault = new Set(state.prefs); renderAll(); refreshSheet(); toast("Saved to usual preferences", "Every journey now starts with these."); },
  "pref-def": b => { const k = b.dataset.pref; const on = state.prefDefault.has(k); on ? state.prefDefault.delete(k) : state.prefDefault.add(k); on ? state.prefs.delete(k) : state.prefs.add(k); renderAll(); toast("Saved", "Your usual preferences are saved to your account."); },
  "prefer-ontime": () => { state.prefs.delete("seat"); state.prefs.add("sooner"); renderToday(); },
  method: () => openSheet("method"),
  certainty: () => openSheet("certainty"),
  "start-route": b => { state.preview = b.dataset.id; A.start(); },
  "open-route": b => { state.preview = b.dataset.id; closeSheet(); openOverlay("details"); },
  "back-routes": () => { state.overlay = null; show(); },
  "close-drawer": () => { state.overlay = null; show(); },
  "end-ask": () => openSheet("endConfirm"),
  "switch-ask": b => openSheet("switchConfirm", b.dataset.id),
  reminder: () => {
    if (state.reminder) { state.reminder = null; renderJourney(); return; }
    if (state.locPerm === "allowed") { state.reminder = "location"; renderJourney(); toast("Arrival reminder on", "Using your location."); return; }
    openPerm();
  },
  "perm-ask": () => openPerm(),
  perm: b => {
    const v = b.dataset.v; $("#perm").classList.remove("open");
    if (v === "deny") { state.locPerm = "denied"; state.reminder = "timetable"; toast("Reminder by timetable", "Location is off, so the reminder may be less accurate."); }
    else { state.locPerm = v === "once" ? "once" : "allowed"; state.reminder = "location"; toast("Arrival reminder on", "Using your location only on this device."); }
    renderJourney(); renderMini();
  },
  start: () => { state.selected = state.preview; state.phase = "active"; state.stage = 0; state.reminder = null; openOverlay("details"); toast("Journey started", state.alertsOn ? "We'll alert you if anything changes." : "Alerts are off for this journey."); },
  "open-active": () => { state.preview = state.selected; openOverlay("details"); },
  advance: () => { state.stage = Math.min(3, state.stage + 1); if (state.stage === 3 && state.sharing?.live && state.sharing.until === "Until I arrive") { state.sharing = null; toast("Sharing stopped", "You've arrived, so arrival updates ended automatically."); } renderAll(); },
  end: () => { const wasSharing = state.sharing?.live; closeSheet(); resetJourneyState(); state.reminder = null; setTab("today"); toast("Journey ended", wasSharing ? "Arrival updates stopped." : ""); },
  compare: b => openSheet("compare", b.dataset.mode),
  "switch-to": b => {
    const d = current(), o = d.options.find(x => x.id === b.dataset.id);
    closeSheet();
    if (state.phase !== "active") { state.preview = o.id; renderJourney(); $("#screen-details .drawer-body").scrollTop = 0; toast(`Showing ${lcT(o.title)}`, `Arrives ${o.arrives}.`); return; }
    state.selected = o.id; state.preview = o.id; state.stage = Math.min(state.stage, 1); openOverlay("details");
    toast(`Switched to ${lcT(o.title)}`, state.sharing?.live ? `Arrival ${o.arrives}. ${state.sharing.to} has been updated.` : `Arrives ${o.arrives}.`);
  },
  report: () => { const o = focusOption(current()); state.form = { car: o.cars ? null : 0 }; openSheet("report"); },
  "r-car": b => { state.form.car = +b.dataset.car; refreshSheet(); },
  "r-cat": b => { state.form.note = $("#r-note")?.value; state.form.cat = b.dataset.cat; refreshSheet(); },
  "r-submit": () => {
    const f = state.form; f.note = $("#r-note")?.value.trim();
    state.reports.push({ option: focusId(), car: f.car, cat: f.cat, note: f.note });
    openSheet("report", "done"); renderAll();
  },
  share: () => { state.form = { to: "Mum", live: !!state.sharing?.live, until: state.sharing?.until || "Until I arrive" }; openSheet("share"); },
  "s-to": b => { state.form.to = b.dataset.to; refreshSheet(); },
  "s-live": b => { state.form.live = b.dataset.live === "1"; refreshSheet(); },
  "s-until": b => { state.form.until = b.dataset.until; refreshSheet(); },
  "s-send": () => {
    const f = state.form; closeSheet();
    if (f.live) { state.sharing = { to: f.to, live: true, until: f.until }; toast(`Sharing with ${f.to}`, `${f.until}. Stop any time from the journey screen.`); }
    else toast(f.to === "Copy link" ? "Link copied" : `Sent to ${f.to}`, "Your estimated arrival was shared once.");
    renderAll();
  },
  "stop-share": () => { state.sharing = null; renderAll(); toast("Sharing stopped", "No further updates will be sent."); },
  toggle: b => { const k = b.dataset.key; state[k] = !state[k]; renderAll(); },
  scenarios: () => openSheet("scenarios"),
  "use-leg": b => { closeSearch(); closeSheet(); useLeg(b.dataset.leg); },
  prefs: () => openSheet("prefs"),
  "s-open": b => openSearch(b.dataset.focus),
  "s-close": () => closeSearch(),
  "open-schedule": () => { state.jview = "schedule"; state.schedDay = state.day; setTab("journeys"); },
  "s-swap": () => { const q = state.search; [q.from, q.to] = [q.to, q.from]; $('#search-layer [data-s="from"]').value = q.from; $('#search-layer [data-s="to"]').value = q.to; filterSaved(); },
  "s-go": () => {
    const q = state.search, from = q.from.trim(), to = q.to.trim();
    if (!from || !to) return;
    const match = allLegs().find(l => norm(l.from) === norm(from) && norm(l.to) === norm(to));
    closeSearch();
    if (match) { useLeg(match.key); return; }
    state.leg = null; resetJourneyState(); state.today = { from, to }; setTab("today");
    toast("Route for this journey only", "Not saved. Use Save as journey to keep it.");
  },
  "save-adhoc": () => { const d = current(); state.form = { from: d.from, to: d.to, name: "", out: "", hasRet: false, days: [] }; openSheet("form", "add"); },
  "swap-dir": () => {
    const d = current(), L = d.L;
    const ret = (L.dir === "out" ? (L.j.ret ? `${L.j.id}:ret` : null) : `${L.j.id}:out`) || allLegs().find(l => norm(l.from) === norm(d.to) && norm(l.to) === norm(d.from))?.key;
    if (ret) { useLeg(ret); return; }
    state.today = { ...(state.today || {}), from: d.to, to: d.from };
    if (L.key && state.today.from === L.from && state.today.to === L.to && !state.today.time && !state.today.arriveBy) state.today = null;
    state.selected = null; state.phase = "options"; renderToday();
    toast("Swapped for this journey", L.key ? "Your saved journey is unchanged." : "");
  },
  jview: b => { state.jview = b.dataset.view; renderJourneys(); },
  "sched-day": b => { state.schedDay = b.dataset.day; renderJourneys(); },
  "pick-open": () => { state.form = {}; openSheet("form", "pick"); },
  "pick-journey": b => openSched(b.dataset.id, state.schedDay),
  "sched-open": b => openSched(b.dataset.id),
  "occ-menu": b => { state.form = { key: b.dataset.key }; openSheet("form", "occ"); },
  "occ-time": () => { const l = schedLeg(state.form.key); state.form = { key: l.key, time: l.time, scope: "one" }; openSheet("form", "occ-time"); },
  "occ-remove": () => { state.form = { key: state.form.key, scope: "one" }; openSheet("form", "occ-remove"); },
  "f-scope": b => { state.form.scope = b.dataset.scope; state.form.error = ""; refreshSheet(); },
  unskip: b => { const k = `${state.schedDay}|${b.dataset.key}`; if (state.occ[k]) delete state.occ[k].skip; closeSheet(); renderAll(); toast("Restored", `${fullDate(state.schedDay)} is back on your schedule.`); },
  "toggle-nocommute": () => { const d = state.schedDay; state.noCommute.has(d) ? state.noCommute.delete(d) : state.noCommute.add(d); syncSuggestion(); renderAll(); },
  "mode": b => { const k = b.dataset.mode; state.defaults.modes[k] = !state.defaults.modes[k]; state.savedDefaults = clone(state.defaults); renderProfile(); renderToday(); },
  "save-defaults": () => { state.savedDefaults = clone(state.defaults); renderAll(); toast("Preferences saved", "Saved to your account. Applies to new journeys."); },
  "reset-defaults": () => { state.prefs = new Set(); state.prefDefault = new Set(); state.prefLevel = { ...SEED_LEVELS }; state.defaults = clone(DEFAULTS); state.savedDefaults = clone(DEFAULTS); renderAll(); toast("Preferences reset"); },
  "quick-save": () => {
    const from = $("#q-from").value.trim(), to = $("#q-to").value.trim();
    if (!from || !to) { $("#q-error").textContent = "Add where you start and where you're going."; return; }
    const id = "j" + Date.now();
    state.journeys.push({ id, from, to, name: "", out: "", days: [], ret: null });
    state.leg = `${id}:out`; resetJourneyState(); setTab("today");
    toast("Journey saved", "Here are today's options. A schedule is optional.", { act: "sched-open", attrs: `data-id="${id}"`, label: "Add to schedule" });
  },
  "add-journey": b => { state.form = { from: "", to: "", name: "", hasRet: false, preDay: b?.dataset?.day || "" }; openSheet("form", "add"); },
  "edit-saved": b => {
    const j = state.journeys.find(x => x.id === b.dataset.id);
    state.form = { id: j.id, from: j.from, to: j.to, name: j.name, hasRet: !!j.ret, retFrom: j.ret?.from, retTo: j.ret?.to };
    openSheet("form", "edit-saved");
  },
  "delete-ask": () => openSheet("form", "delete"),
  "f-delete": () => {
    const id = state.form.id, j = state.journeys.find(x => x.id === id);
    state.journeys = state.journeys.filter(x => x.id !== id);
    if (state.leg?.startsWith(`${id}:`)) { state.leg = null; state.suggested = null; resetJourneyState(); }
    closeSheet(); renderAll(); toast("Journey deleted", `${j.from} → ${j.to}`);
  },
  "edit-today": () => { const d = current(); if (!d) return; const leave = fmt(Math.min(...d.options.map(o => toMin(o.leaveBy)))); state.form = { time: leave, arriveBy: d.target || "", orig: { time: leave, arriveBy: d.target || "" } }; openSheet("form", "edit-today"); },
  "f-swap": () => { const f = state.form; [f.from, f.to] = [f.to, f.from]; refreshSheet(); },
  "f-day": b => { const f = state.form, k = b.dataset.set === "ret" ? "retDays" : "days", d = b.dataset.day; f[k] = f[k].includes(d) ? f[k].filter(x => x !== d) : [...f[k], d]; f.error = ""; refreshSheet(); },
  "f-save": () => {
    const f = state.form, mode = state.sheet.arg;
    if (!f.from?.trim() || !f.to?.trim()) { f.error = "Add where you start and where you're going."; refreshSheet(); return; }
    const from = f.from.trim(), to = f.to.trim(), name = (f.name || "").trim();
    const retFrom = (f.retFrom || to).trim(), retTo = (f.retTo || from).trim();
    if (mode === "add") {
      const id = "j" + Date.now();
      state.journeys.push({ id, from, to, name, out: "", days: [], ret: f.hasRet ? { from: retFrom, to: retTo, time: "", days: [] } : null });
      if (!state.leg) { state.leg = `${id}:out`; resetJourneyState(); }
      renderAll();
      /* Step 2 (optional): straight into the schedule when the user came from "Add to <day>", otherwise ask. */
      if (f.preDay) openSched(id, f.preDay);
      else { state.form = { id }; openSheet("form", "added"); }
    } else {
      const j = state.journeys.find(x => x.id === f.id);
      Object.assign(j, { from, to, name, ret: f.hasRet ? { from: retFrom, to: retTo, time: j.ret?.time || "", days: j.ret?.days || [] } : null });
      if (!j.ret && state.leg === `${j.id}:ret`) state.leg = `${j.id}:out`;
      closeSheet(); renderAll(); toast("Saved journey updated", `${j.from} → ${j.to}`);
    }
  },
  "f-save-occ": () => {
    const f = state.form, l = schedLeg(f.key), k = `${state.schedDay}|${f.key}`;
    if (!f.time) { f.error = "Add a leave time."; refreshSheet(); return; }
    if (f.scope === "every") {
      if (l.dir === "ret") l.j.ret.time = f.time; else l.j.out = f.time;
      if (state.occ[k]) delete state.occ[k].time;
      closeSheet(); renderAll(); toast("Saved for every week", `${daysShort(legDays(l.j, l.dir))} at ${fmt(toMin(f.time))}`);
    } else {
      if (toMin(f.time) === toMin(l.base)) { if (state.occ[k]) delete state.occ[k].time; }
      else state.occ[k] = { ...(state.occ[k] || {}), time: f.time };
      closeSheet(); renderAll(); toast("Saved for this date", `${fullDate(state.schedDay)} only. Other ${DAY_NAME[state.schedDay]}s stay the same.`);
    }
  },
  "f-occ-reset": () => { const k = `${state.schedDay}|${state.form.key}`; if (state.occ[k]) delete state.occ[k].time; closeSheet(); renderAll(); toast("Back to the usual time"); },
  "f-remove-occ": () => {
    const f = state.form, l = schedLeg(f.key), day = state.schedDay, k = `${day}|${f.key}`;
    if (f.scope === "every") {
      if (l.dir === "ret") l.j.ret.days = l.j.ret.days.filter(d => d !== day); else l.j.days = l.j.days.filter(d => d !== day);
      delete state.occ[k];
      toast(`Removed from every ${DAY_NAME[day]}`, "The saved journey stays.");
    } else { state.occ[k] = { ...(state.occ[k] || {}), skip: true }; toast("Removed for this date", `${fullDate(day)} only. You can restore it.`); }
    closeSheet(); syncSuggestion(); renderAll();
  },
  "f-save-sched": () => {
    const f = state.form, j = state.journeys.find(x => x.id === f.id);
    const out = DAYS.filter(d => f.days.includes(d)), ret = j.ret ? DAYS.filter(d => (f.retSame ? f.days : f.retDays).includes(d)) : [];
    if (out.length && !f.out) { f.error = `Add a leave time for the trip to ${shortPlace(j.to)}.`; refreshSheet(); return; }
    if (ret.length && !f.retTime) { f.error = "Add a leave time for the return trip."; refreshSheet(); return; }
    j.days = out; j.out = f.out || ""; if (j.ret) Object.assign(j.ret, { days: ret, time: f.retTime || "" });
    closeSheet(); syncSuggestion(); renderAll();
    toast(hasSchedule(j) ? "Schedule saved" : "No days selected", hasSchedule(j) ? `${j.from} → ${j.to} · ${daysShort(allDays(j))}` : "The journey is still saved.");
  },
  "f-remove-sched": () => { const j = state.journeys.find(x => x.id === state.form.id); j.days = []; if (j.ret) j.ret.days = []; closeSheet(); syncSuggestion(); renderAll(); toast("Removed from schedule", "The journey is still saved."); },
  "f-save-today": () => {
    const f = state.form, t = { ...(state.today || {}) };
    if (f.time && f.time !== pad(f.orig.time) && fmt(toMin(f.time)) !== f.orig.time) t.time = f.time;
    if ((f.arriveBy || "") !== (f.orig.arriveBy || "") && fmt(toMin(f.arriveBy || "0:00")) !== f.orig.arriveBy) t.arriveBy = f.arriveBy ? fmt(toMin(f.arriveBy)) : null;
    state.today = Object.keys(t).some(k => t[k]) ? t : null;
    state.selected = null; state.phase = "options";
    closeSheet(); renderAll();
    toast("Changed for this journey", "Your saved journey is unchanged.");
  },
  "f-now": () => {
    const t = { ...(state.today || {}) }; delete t.time;
    state.today = Object.keys(t).some(k => t[k]) ? t : null;
    state.selected = null; state.phase = "options";
    closeSheet(); renderAll(); toast("Leaving now");
  },
  "f-clear-today": () => { state.today = null; closeSheet(); renderAll(); }
};

/* ---------- events ---------- */
(() => {
  let y0 = null, el = null;
  document.addEventListener("touchstart", e => { const t = e.target.closest(".drawer-top"); if (!t) return; el = t.closest(".drawer"); y0 = e.touches[0].clientY; el.style.transition = "none"; }, { passive: true });
  document.addEventListener("touchmove", e => { if (y0 === null) return; const dy = Math.max(0, e.touches[0].clientY - y0); el.style.transform = `translateY(${dy}px)`; }, { passive: true });
  document.addEventListener("touchend", e => { if (y0 === null) return; const dy = e.changedTouches[0].clientY - y0; el.style.transition = ""; el.style.transform = ""; y0 = null; if (dy > 90) A["close-drawer"](); });
})();
$("#phone").addEventListener("scroll", e => { if (e.target.id === "phone") { e.target.scrollTop = 0; e.target.scrollLeft = 0; } });
document.addEventListener("click", e => {
  const sc = e.target.closest("[data-scenario]");
  if (sc) { setScenario(sc.dataset.scenario); return; }
  const a = e.target.closest("[data-act]");
  if (!a || a.disabled) return;
  const fn = A[a.dataset.act];
  if (fn) { e.preventDefault(); fn(a, e); }
});
document.addEventListener("input", e => {
  const lvIn = e.target.closest("[data-level]");
  if (lvIn) { state.prefLevel[lvIn.dataset.level] = +lvIn.value; const o = $(`#lvl-${lvIn.dataset.level}`); if (o) o.textContent = lvIn.value; return; }
  const si = e.target.closest("[data-s]");
  if (si && state.search) { state.search[si.dataset.s] = si.value; filterSaved(); return; }
  const f = e.target.closest("[data-f]");
  if (f) {
    const k = f.dataset.f;
    state.form[k] = f.type === "checkbox" ? f.checked : f.value;
    if (k === "retSame") { if (!f.checked) state.form.retDays = [...state.form.days]; refreshSheet(); return; }
    if (k === "hasRet") { if (f.checked) { state.form.retFrom = state.form.retFrom || state.form.to; state.form.retTo = state.form.retTo || state.form.from; } refreshSheet(); return; }
    if (k === "from" || k === "to") { const n = $("#auto-name"); if (n) n.textContent = state.form.from && state.form.to ? `${state.form.from} → ${state.form.to}` : "From → To"; }
  }
});
document.addEventListener("change", e => {
  const lvIn = e.target.closest("[data-level]");
  if (lvIn) { renderToday(); renderMini(); toast("Saved", `${prefLabel(lvIn.dataset.level)}: ${lvIn.value}/10. Saved to your account.`); }
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape") { closeSheet(); closeSearch(); }
  if ((e.key === "Enter" || e.key === " ") && e.target.matches?.('.route-card[data-act]')) { e.preventDefault(); A["open-route"](e.target); }
  if (e.key === "Enter" && e.target.closest("[data-s]")) A["s-go"]();
});

/* ---------- boot (URL params for screenshots: ?scenario=0-3&screen=today|journeys|schedule|profile|details|active&sheet=why|compare|report|share|add|sched|pick|added|occ&prefs=a,b&select=id) ---------- */
(function boot() {
  const q = new URLSearchParams(location.search);
  let sc = null; try { sc = localStorage.getItem("waywise-hifi-scenario"); } catch (e) { }
  sc = SCN_ALIAS[q.get("scenario")] || q.get("scenario") || sc || "disruption";
  setScenario(S[sc] || sc === "newuser" ? sc : "disruption");
  if (q.get("prefs")) q.get("prefs").split(",").forEach(p => state.prefs.add(p));
  if (q.get("select")) state.preview = q.get("select");
  const screen = q.get("screen");
  if (screen === "schedule") { state.jview = "schedule"; setTab("journeys"); }
  else if (["today", "journeys", "profile"].includes(screen)) setTab(screen);
  else if (screen === "details" && state.preview) openOverlay("details");
  else if (screen === "active" && state.preview) { state.selected = state.preview; state.phase = "active"; state.stage = +(q.get("stage") || 0); openOverlay("details"); }
  else renderAll();
  const sheet = q.get("sheet");
  if (sheet === "add") A["add-journey"]();
  else if (sheet === "sched" && state.journeys.some(j => j.id === (q.get("id") || "uni"))) openSched(q.get("id") || "uni");
  else if (sheet === "pick") A["pick-open"]();
  else if (sheet === "added" && state.journeys.some(j => j.id === (q.get("id") || "fri"))) { state.form = { id: q.get("id") || "fri" }; openSheet("form", "added"); }
  else if (sheet === "occ") { const l = scheduledToday(state.schedDay)[0]; if (l) A["occ-menu"]({ dataset: { key: l.key } }); }
  else if (sheet === "why" && current()) { state.preview = state.preview || ranked(current())[0].id; openOverlay("details"); }
  else if (sheet && state.preview && ["compare", "report", "share"].includes(sheet)) A[sheet]({ dataset: {} });
  else if (sheet === "edit-today") A["edit-today"]();
  if (q.get("export") === "1") document.body.classList.add("export");
})();
