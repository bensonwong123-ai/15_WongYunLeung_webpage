// dest_hotel.js — single-select country + single-select hotel.
// Items come from data.js; the chosen ids are saved to localStorage
// so journey.html and summary.html can read the same selection.

let selections = getSelections();

function renderSet(type) {
  const singularKey = SINGULAR[type];
  const chosenId = selections[singularKey] && selections[singularKey].id;
  document.getElementById(type).innerHTML = CATALOG[type].map((p, i) => `
    <label class="item ${chosenId === p.id ? 'selected' : ''}">
      <input type="checkbox" data-type="${type}" data-id="${p.id}" ${chosenId === p.id ? 'checked' : ''}>
      <a href="detail_dest.html?type=${type}&id=${p.id}" title="View details">
        <img src="${esc(p.image)}" alt="${esc(p.title)}" data-i="${i}">
      </a>
      <div class="info">
        <h3>${esc(p.title)}</h3>
        <span class="price">${money(p.price)}</span>
        <small class="price-label">${esc(PRICE_LABEL[type])}</small>
      </div>
    </label>`).join('');

  // Fallback placeholder if an image can't load (e.g. offline)
  document.querySelectorAll(`#${type} img`).forEach(img => img.onerror = () => {
    img.onerror = null;
    const hue = (Number(img.dataset.i) * 65) % 360;
    img.src = 'data:image/svg+xml,' + encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="hsl(${hue},60%,60%)"/></svg>`);
  });
}

document.addEventListener('change', ev => {
  const cb = ev.target;
  if (!cb.matches('input[type=checkbox][data-type]')) return;
  const { type, id } = cb.dataset;
  setSelection(type, cb.checked ? id : null);
  selections = getSelections();
  renderSet(type); // re-render so only one item stays checked
});

renderSet(COUNTRIES);
renderSet(HOTELS);

// Coming back from the detail page with the browser's Back button can restore a cached
// copy of this page; re-read the saved selection so a pick made there always shows.
window.addEventListener('pageshow', ev => {
  if (!ev.persisted) return;
  selections = getSelections();
  renderSet(COUNTRIES);
  renderSet(HOTELS);
});
