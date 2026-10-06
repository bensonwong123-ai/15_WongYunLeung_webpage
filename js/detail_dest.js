// detail_dest.js — bigger image + full info for one country or hotel.
// Reads the item straight from data.js (so it also works when opened
// directly), and lets you select/deselect it from here too.

const params = new URLSearchParams(location.search);
const type = params.get('type');   // COUNTRIES | HOTELS
const id = params.get('id');
const box = document.getElementById('detail');
const item = findItem(type, id);

if (!item) {
  box.innerHTML = '<p class="empty">Item not found. Go back to the Destination page and pick an item.</p>';
} else {
  document.title = item.title + ' — Trip Planner';
  const rows = Object.entries(item.details || {})
    .map(([k, v]) => `<li><span class="detail-key">${esc(k)}</span><span class="detail-value">${esc(v)}</span></li>`).join('');

  box.innerHTML = `
    <article class="detail">
      <img id="big" src="${esc(item.image)}" alt="${esc(item.title)}">
      <div class="info">
        <p class="count">${type === HOTELS ? '<i class="fa-solid fa-hotel"></i> Hotel' : '<i class="fa-solid fa-globe"></i> Country'}</p>
        <h1>${esc(item.title)}</h1>
        <p class="price big-price">${money(item.price)} <small>${esc(PRICE_LABEL[type])}</small></p>
        <p>${esc(item.description || '')}</p>
        <ul class="detail-list">${rows}</ul>
        <button id="toggle"></button>
      </div>
    </article>`;

  const singularKey = SINGULAR[type];
  const btn = document.getElementById('toggle');
  const isSelected = () => {
    const s = getSelections()[singularKey];
    return !!s && s.id === id;
  };
  const paint = () => { btn.textContent = isSelected() ? '✓ Selected (click to deselect)' : `Select as your ${singularKey}`; };
  btn.onclick = () => {
    setSelection(type, isSelected() ? null : id); // selecting replaces any previous choice
    paint();
  };
  paint();
}
