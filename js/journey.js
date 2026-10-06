// (each slot has text, remark and price).
//
// • Dates are picked from a calendar and shown as dd/mm/yyyy; stored as ISO.
//   Start date must be today or later; end date must be on/after the start.
// • EVERYTHING typed here autosaves to the browser as you go (dates, the
//   day you were on, every text / remark / price), so you can leave this
//   page and come back to exactly where you were.
// • There is no separate save step: the Summary page reads the same autosaved
//   plan, so whatever you enter here appears there straight away.

let selections = getSelections();
let activeIdx = 0;        // which day tab is open (0-based)
let activeDate = null;    // ISO date of that tab, null when no valid dates
let fpStart = null, fpEnd = null;
let dateTextBad = false;  // only possible if the calendar script failed to load
const TODAY = todayISO();
const $ = id => document.getElementById(id);

// ---- Reminder if country/hotel not chosen yet ----
function renderPickHint() {
  const el = $('pick-hint');
  if (selections.country && selections.hotel) {
    el.innerHTML = `<i class="fa-solid fa-globe"></i> ${esc(selections.country.title)} &nbsp;·&nbsp; <i class="fa-solid fa-hotel"></i> ${esc(selections.hotel.title)} — <a href="dest_hotel.html">change</a>`;
  } else {
    el.innerHTML = `You haven't picked a country/hotel yet — <a href="dest_hotel.html">choose one first</a> (you can still draft your plan below).`;
  }
}

// ---- Draft (autosaved) ----
function getDraft() {
  const d = Store.get('trip-draft', {});
  return { start: d.start || '', end: d.end || '', days: d.days || {}, activeIdx: d.activeIdx || 0 };
}
function setDraft(d) { Store.set('trip-draft', d); }

// Is the draft's date range usable? -> { days, msg, error }
function check(draft) {
  if (dateTextBad) return { days: [], msg: 'Enter dates as dd/mm/yyyy.', error: true };
  if (!draft.start || !draft.end) return { days: [], msg: 'Pick a start and end date to plan activities for each day.', error: false };
  if (draft.start < TODAY) return { days: [], msg: "Start date can't be in the past — please choose today or a later date.", error: true };
  if (draft.end < draft.start) return { days: [], msg: 'End date must be on or after the start date.', error: true };
  const n = dayDiff(draft.start, draft.end) + 1;
  if (n > 60) return { days: [], msg: 'Trips are limited to 60 days.', error: true };
  const nights = n - 1;
  return { days: dateRange(draft.start, draft.end), msg: `${n} day${n > 1 ? 's' : ''} · ${nights} night${nights === 1 ? '' : 's'} to plan.`, error: false };
}

// ---- Day fields ----
function saveActiveDayFields() {
  const draft = getDraft();
  if (!activeDate || !$('f-morning-text')) return draft;
  draft.days[activeDate] = draft.days[activeDate] || emptyDay();
  PERIODS.forEach(([k]) => {
    draft.days[activeDate][k] = {
      text: $('f-' + k + '-text').value.trim(),
      remark: $('f-' + k + '-remark').value.trim(),
      price: $('f-' + k + '-price').value.trim()
    };
  });
  draft.activeIdx = activeIdx;
  setDraft(draft);
  renderDraftCost();
  return draft;
}

const textItems = str => str.split(',').map(s => s.trim()).filter(Boolean);

function refreshChips() {
  PERIODS.forEach(([k]) => {
    const have = textItems($('f-' + k + '-text').value).map(s => s.toLowerCase());
    document.querySelectorAll(`.chip[data-k="${k}"]`).forEach(c => c.classList.toggle('on', have.includes(c.dataset.v.toLowerCase())));
  });
}

function renderDayFields() {
  const draft = getDraft();
  const day = draft.days[activeDate] || emptyDay();
  $('day-fields').innerHTML = PERIODS.map(([k, label]) => {
    const p = getPeriod(day, k);
    const chips = (window.TRIP_DATA.activities[k] || []).map(a =>
      `<button type="button" class="chip" data-k="${k}" data-v="${esc(a)}">${esc(a)}</button>`).join('');
    return `
    <fieldset><legend>${label}</legend>
      <input type="text" id="f-${k}-text" placeholder="Text — type or tap a word below" value="${esc(p.text)}">
      <div class="chips">${chips}</div>
      <input type="text" id="f-${k}-remark" placeholder="Remark" value="${esc(p.remark)}">
      <input type="number" id="f-${k}-price" placeholder="Price/person($)" min="0" step="any" value="${esc(p.price)}">
    </fieldset>`;
  }).join('');
  refreshChips();
}

// Live estimate under the day fields: air ticket + hotel × nights + daily costs
function renderDraftCost() {
  const box = $('draft-cost');
  const draft = getDraft();
  if (!check(draft).days.length) { box.innerHTML = ''; return; }
  const sel = getSelections();
  const c = tripCost({ ...draft, country: sel.country, hotel: sel.hotel });
  box.innerHTML = `<i class="fa-solid fa-sack-dollar"></i> Estimated total: <strong>${money(c.total)}</strong>
    <small><i class="fa-solid fa-plane"></i> ${money(c.air)} + <i class="fa-solid fa-hotel"></i> ${money(c.hotel)} (${c.nights} night${c.nights === 1 ? '' : 's'}) + <i class="fa-solid fa-dollar-sign"></i> ${money(c.activities)}</small>`;
}

function renderTabs() {
  const draft = getDraft();
  const c = check(draft);
  const hint = $('trip-hint');
  hint.textContent = c.msg;
  hint.classList.toggle('error', c.error);
  if (!c.days.length) {
    activeDate = null;
    $('day-tabs').innerHTML = ''; $('day-fields').innerHTML = '';
    renderDraftCost();
    return;
  }
  if (activeIdx < 0 || activeIdx >= c.days.length) activeIdx = 0;
  activeDate = c.days[activeIdx];
  $('day-tabs').innerHTML = c.days.map((d, i) =>
    `<button type="button" class="day-tab ${i === activeIdx ? 'on' : ''}" data-i="${i}">Day ${i + 1}<small>${fmtDate(d)}</small></button>`).join('');
  renderDayFields();
  renderDraftCost();
}

$('day-tabs').addEventListener('click', ev => {
  const b = ev.target.closest('.day-tab'); if (!b) return;
  saveActiveDayFields();
  activeIdx = +b.dataset.i;
  const draft = getDraft(); draft.activeIdx = activeIdx; setDraft(draft);
  renderTabs();
});

// typing in any field, or tapping a quick-pick word
$('day-fields').addEventListener('input', () => { saveActiveDayFields(); refreshChips(); });
$('day-fields').addEventListener('click', ev => {
  const chip = ev.target.closest('.chip'); if (!chip) return;
  const input = $('f-' + chip.dataset.k + '-text');
  const items = textItems(input.value);
  const i = items.findIndex(s => s.toLowerCase() === chip.dataset.v.toLowerCase());
  if (i >= 0) items.splice(i, 1); else items.push(chip.dataset.v);   // tap again to remove
  input.value = items.join(', ');
  saveActiveDayFields(); refreshChips();
});

// ---- Dates ----
function initPickers() {
  if (typeof flatpickr !== 'function') return;   // falls back to plain text boxes
  const base = { dateFormat: 'd/m/Y', allowInput: false, disableMobile: true, minDate: 'today', locale: { firstDayOfWeek: 1 } };
  fpStart = flatpickr('#trip-start', base);
  fpEnd = flatpickr('#trip-end', base);
}

// the end calendar can't go earlier than the start (or today)
function updateEndMin(startIso) {
  if (!fpEnd) return;
  fpEnd.set('minDate', startIso && startIso > TODAY ? isoToDate(startIso) : 'today');
}

// puts an ISO date into a box; dates the calendar refuses (already past) are shown as text
function setDateInput(id, iso, minIso) {
  const el = $(id), fp = id === 'trip-start' ? fpStart : fpEnd;
  if (!iso) { if (fp) fp.clear(false); else el.value = ''; return; }
  if (fp && iso >= minIso) fp.setDate(iso, false, 'Y-m-d'); else el.value = fmtDate(iso);
}

function readDate(id) {
  const v = $(id).value.trim();
  if (!v) return '';
  const iso = parseDMY(v);
  if (!iso) dateTextBad = true;
  return iso || '';
}

// fired whenever either date box changes
function onDatesChanged() {
  saveActiveDayFields();                       // flush whatever was being typed
  const draft = getDraft();
  const oldStart = draft.start;
  dateTextBad = false;
  const start = readDate('trip-start');
  updateEndMin(start);
  const end = readDate('trip-end');
  // moving the start date carries the plans along (Day 1 stays Day 1)
  if (oldStart && start && oldStart !== start) {
    const delta = dayDiff(oldStart, start), moved = {};
    Object.keys(draft.days).forEach(d => { moved[addDays(d, delta)] = draft.days[d]; });
    draft.days = moved;
  }
  draft.start = start; draft.end = end;
  setDraft(draft);
  renderTabs();
}
$('trip-start').addEventListener('change', onDatesChanged);
$('trip-end').addEventListener('change', onDatesChanged);

// belt and braces: flush on the way out (fields already save as you type)
window.addEventListener('pagehide', saveActiveDayFields);

// ---- init: restore everything that was saved ----
renderPickHint();
initPickers();
(function restore() {
  const d = getDraft();
  activeIdx = d.activeIdx;
  setDateInput('trip-start', d.start, TODAY);
  updateEndMin(d.start);
  setDateInput('trip-end', d.end, d.start > TODAY ? d.start : TODAY);
  renderTabs();
})();
