// ============================================================
// storage.js — shared by dest_hotel / detail / journey / summary.
// Reads/writes localStorage so choices survive page navigation.
// The catalog itself (countries + hotels) lives in data.js;
// localStorage only remembers WHICH item ids you picked.
// Also holds the cost calculation used by Journey + Summary.
// ============================================================

// Escape user-entered text before inserting it as HTML
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// HK$1,234.50
const money = n => 'HK$' + (Number(n) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Simple get/set wrapper around localStorage (JSON in, JSON out)
const Store = {
  get(key, fallback) {
    try {
      const v = JSON.parse(localStorage.getItem(key));
      return v ?? fallback;
    } catch (e) {
      return fallback;
    }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage full / blocked */ }
  }
};

// ---- Captions (declared once; use these instead of typing the strings) ----
const SELECTION_IDS = 'selection-ids';   // localStorage key holding { country: id|null, hotel: id|null }
const COUNTRIES = 'countries';           // catalog type / URL ?type= / element id on Destination page
const HOTELS = 'hotels';

// ---- Catalog (from data.js) ----
const CATALOG = { [COUNTRIES]: window.TRIP_DATA[COUNTRIES], [HOTELS]: window.TRIP_DATA[HOTELS] };
const PRICE_LABEL = window.TRIP_DATA.priceLabels;   // { countries: 'Round-trip', hotels: 'Double room daily' }
const SINGULAR = { [COUNTRIES]: 'country', [HOTELS]: 'hotel' };

function findItem(type, id) {
  return (CATALOG[type] || []).find(p => p.id === id) || null;
}

// ---- Selections: stored as ids, resolved against data.js ----
//   'selection-ids' -> { country: 'c1'|null, hotel: 'h1'|null }
function getSelections() {
  const ids = Store.get(SELECTION_IDS, { country: null, hotel: null });
  return {
    country: findItem(COUNTRIES, ids.country),
    hotel: findItem(HOTELS, ids.hotel)
  };
}

function setSelection(type, id) { // id = null to clear
  const ids = Store.get(SELECTION_IDS, { country: null, hotel: null });
  ids[SINGULAR[type]] = id;
  Store.set(SELECTION_IDS, ids);
}

// The time-of-day slots used on the Journey page (each has text, remark, price)
// (label is HTML: an icon + the word)
const PERIODS = [
  ['morning',   '<i class="fa-regular fa-alarm-clock"></i> Morning'],
  ['afternoon', '<i class="fa-solid fa-sun"></i> Afternoon'],
  ['night',     '<i class="fa-solid fa-moon"></i> Night']
];

// Keys used across pages:
//   'selection-ids' -> { country: id|null, hotel: id|null }
//   'trip-draft'    -> { start, end, days: { 'YYYY-MM-DD': { morning:{text,remark,price}, afternoon:{…}, night:{…} } } }

function emptyPeriod() { return { text: '', remark: '', price: '' }; }

function emptyDay() {
  const d = {};
  PERIODS.forEach(([k]) => { d[k] = emptyPeriod(); });
  return d;
}

// Safe read of one period — older saved data has no "night" / "price"
function getPeriod(day, k) {
  return { ...emptyPeriod(), ...((day && day[k]) || {}) };
}

// ---- Dates ----
// Stored internally as ISO text 'YYYY-MM-DD' (sorts correctly, timezone-safe);
// shown to people as dd/mm/yyyy.
const toISO = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const todayISO = () => toISO(new Date());
const isoToDate = iso => new Date(iso + 'T00:00:00');

function fmtDate(iso) {            // '2026-10-01' -> '01/10/2026'
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
  return m ? `${m[3]}/${m[2]}/${m[1]}` : '';
}

function parseDMY(str) {           // '01/10/2026' -> '2026-10-01' (null if not a real date)
  const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(String(str || '').trim());
  if (!m) return null;
  const d = +m[1], mo = +m[2], y = +m[3];
  const dt = new Date(y, mo - 1, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== mo - 1 || dt.getDate() !== d) return null;
  return toISO(dt);
}

function fmtDateTime(d = new Date()) {   // -> '05/10/2026 14:07' (dd/mm/yyyy hh:MM, 24-hour)
  const p = n => String(n).padStart(2, '0');
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

function addDays(iso, n) {
  const d = isoToDate(iso);
  d.setDate(d.getDate() + n);
  return toISO(d);
}

function dayDiff(a, b) {           // whole days from a to b
  return Math.round((isoToDate(b) - isoToDate(a)) / 864e5);
}

function dateRange(start, end) {
  const out = [];
  let d = isoToDate(start);
  const last = isoToDate(end);
  while (d <= last && out.length < 60) { out.push(toISO(d)); d.setDate(d.getDate() + 1); }
  return out;
}

// The list of days a trip covers: the full start→end range when dates are
// valid, otherwise whatever days have been filled in
function tripDayList(t) {
  if (t.start && t.end && t.end >= t.start) return dateRange(t.start, t.end);
  return Object.keys(t.days || {}).sort();
}

// ---- Cost ----
//   air ticket  = country price (round-trip, 1 traveller)
//   hotel       = hotel price (double room per night) × nights  (nights = days − 1)
//   activities  = sum of every Morning / Afternoon / Night price
function tripCost(t) {
  const days = tripDayList(t);
  const nights = Math.max(days.length - 1, 0);
  const air = Number(t.country && t.country.price) || 0;
  const hotelRate = Number(t.hotel && t.hotel.price) || 0;
  const hotel = hotelRate * nights;
  const perDay = days.map(d => PERIODS.reduce((sum, [k]) => sum + (Number(getPeriod(t.days && t.days[d], k).price) || 0), 0));
  const activities = perDay.reduce((a, b) => a + b, 0);
  return { days, nights, air, hotelRate, hotel, perDay, activities, total: air + hotel + activities };
}

function costHTML(t) {
  const c = tripCost(t);
  const country = t.country ? esc(t.country.title) : '—';
  const hotel = t.hotel ? esc(t.hotel.title) : '—';
  return `
    <div class="cost">
      <h4><i class="fa-solid fa-sack-dollar"></i> Cost</h4>
      <ul class="cost-list">
        <li><span class="cost-label"><i class="fa-solid fa-plane"></i> Air ticket · ${esc(PRICE_LABEL[COUNTRIES])} · ${country}</span><span class="cost-value">${money(c.air)}</span></li>
        <li><span class="cost-label"><i class="fa-solid fa-hotel"></i> Hotel · ${hotel} · ${money(c.hotelRate)} × ${c.nights} night${c.nights === 1 ? '' : 's'}</span><span class="cost-value">${money(c.hotel)}</span></li>
        <li><span class="cost-label"><i class="fa-solid fa-dollar-sign"></i> Daily trip cost · ${c.days.length} day${c.days.length === 1 ? '' : 's'}</span><span class="cost-value">${money(c.activities)}</span></li>
        <li class="total"><span class="cost-label">Total</span><span class="cost-value">${money(c.total)}</span></li>
      </ul>
    </div>`;
}

// Renders one trip (or a draft) as HTML: header line + one block per day + cost
function tripHTML(t, opts = {}) {
  const country = t.country ? esc(t.country.title) : '—';
  const hotel = t.hotel ? esc(t.hotel.title) : '—';
  const c = tripCost(t);
  return `
    <div class="entry trip">
      <header>
        <span><i class="fa-solid fa-globe"></i> ${country} &nbsp;·&nbsp; <i class="fa-solid fa-hotel"></i> ${hotel}</span>
      </header>
      <p class="hint">${esc(fmtDate(t.start) || '?')} → ${esc(fmtDate(t.end) || '?')} (${c.days.length} day${c.days.length === 1 ? '' : 's'})</p>
      ${c.days.map((d, j) => `
        <div class="trip-day">
          <strong>Day ${j + 1} · ${esc(fmtDate(d))}</strong>
          <span class="day-cost">${money(c.perDay[j])}</span>
          <ul>${PERIODS.map(([k, label]) => {
            const p = getPeriod(t.days && t.days[d], k);
            return `
            <li><strong>${label}:</strong> ${esc(p.text) || '—'}
              ${Number(p.price) ? `<span class="li-price">${money(p.price)}</span>` : ''}
              ${p.remark ? `<small>Remark: ${esc(p.remark)}</small>` : ''}
            </li>`;
          }).join('')}
          </ul>
        </div>`).join('')}
      ${costHTML(t)}
    </div>`;
}
