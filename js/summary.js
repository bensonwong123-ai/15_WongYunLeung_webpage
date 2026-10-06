// summary.js — read-only view of your selections (resolved from js/data.js)
// and your trip plan (the same autosaved plan the Journey page edits), with a
// full cost breakdown (air ticket + hotel × nights + daily trip costs = total).

function pickCard(p, type) {
  if (!p) return '<p class="empty">Nothing selected yet.</p>';
  return `
    <div class="pick-card">
      <img src="${esc(p.image)}" alt="${esc(p.title)}">
      <div><h3>${esc(p.title)}</h3><span class="price">${money(p.price)}</span> <small class="price-label">${esc(PRICE_LABEL[type])}</small></div>
    </div>`;
}

function show() {
  const sel = getSelections();
  document.getElementById('country').innerHTML = pickCard(sel.country, COUNTRIES);
  document.getElementById('hotel').innerHTML = pickCard(sel.hotel, HOTELS);

  // The plan is the autosaved Journey draft — nothing to "save" separately.
  const plan = Store.get('trip-draft', { start: '', end: '', days: {} });
  const hasPlan = plan.start || plan.end ||
    Object.values(plan.days || {}).some(d => PERIODS.some(([k]) => { const p = getPeriod(d, k); return p.text || p.remark || p.price; }));
  const total = document.getElementById('summary-total');
  total.textContent = hasPlan ? `Total ${money(tripCost({ ...plan, country: sel.country, hotel: sel.hotel }).total)}` : '';
  document.getElementById('plan').innerHTML = hasPlan
    ? tripHTML({ ...plan, country: sel.country, hotel: sel.hotel })
    : '<p class="empty">No trip plan yet — add your dates and daily plans on the <a href="journey.html">Journey page</a>.</p>';
}

document.getElementById('clear').onclick = () => {
  if (!confirm('Clear the selected country/hotel and the trip plan?')) return;
  resetPlannerData();
  show();
};

// Print the summary -> in the print dialog choose "Save as PDF".
// Nav bar, buttons and footer are hidden by @media print in components.css;
// the document title becomes the suggested PDF file name.
// The top-left stamp (dd/mm/yyyy hh:MM) is refreshed at the moment of printing,
// whether Print is pressed or Ctrl+P is used.
const printStamp = document.getElementById('print-stamp');
window.addEventListener('beforeprint', () => { printStamp.textContent = fmtDateTime(); });

document.getElementById('print-summary').onclick = () => {
  const oldTitle = document.title;
  document.title = 'Trip-Summary-' + todayISO();
  window.print();
  document.title = oldTitle;
};

show();
