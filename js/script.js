// script.js — shared on every page: injects nav bar, wizard pagination, footer.

const LOGO = window.TRIP_DATA.logo;
const PAGE_LINKS = window.TRIP_DATA.pageLinks;

// navigation bar
const NAV_HTML = `
<nav class="navbar">
  <div class="navbar-flex">
    <!-- 1. Left: logo -->
    <a href="${LOGO.url}"><img src="${LOGO.src}" alt="${LOGO.alt}" class="logo"/></a>

    <!-- 2. Center: Menu List -->
    <ul class="main-menu-list">
      ${PAGE_LINKS.map(l => `<li><a href="${l.href}">${l.text}</a></li>`).join('')}
    </ul>

  </div>
</nav>
`;

const PAGINATION_HTML = `
<section class="wizard-pagination" id="wizard-pagination">
  <a href="#" class="pagination-btn" id="wiz-prev">
    <i class="fa-solid fa-arrow-left"></i>
    <span class="label" id="wiz-prev-text"></span>
  </a>
  <span class="pagination-step" id="wiz-step"></span>
  <a href="#" class="pagination-btn" id="wiz-next">
    <span class="label" id="wiz-next-text"></span>
    <i class="fa-solid fa-arrow-right"></i>
  </a>
</section>
`;

const FOOTER_HTML = `
<p class="copyright">Copyright &copy; ${new Date().getFullYear()} Planning Tour Company. All rights reserved</p>
`;

// Wipes everything the planner remembers in this browser
// (chosen country / hotel and the trip plan).
// Called by index.html (opened directly, or "Plan New Trip" pressed).
// (SELECTION_IDS comes from storage.js, which every page loads; read lazily)
const plannerKeys = () => [SELECTION_IDS, 'trip-draft'];
function hasPlannerData() {
  try {
    return plannerKeys().some(k => {
      const v = JSON.parse(localStorage.getItem(k));
      if (!v) return false;
      if (k === SELECTION_IDS) return !!(v.country || v.hotel);
      return !!(v.start || v.end || Object.keys(v.days || {}).length);
    });
  } catch (e) { return false; }
}
function resetPlannerData() {
  try { plannerKeys().forEach(k => localStorage.removeItem(k)); } catch (e) { /* storage blocked */ }
}

// Menu links and Prev / Next buttons keep your data. index.html clears data when
// it is opened directly (address bar, bookmark, new tab, reload), so those
// in-site clicks leave a short-lived marker that tells Home "keep it".
const NAV_KEY = 'internal-nav';
document.addEventListener('click', ev => {
  if (!ev.target.closest('.navbar a, .wizard-pagination a')) return;
  try { sessionStorage.setItem(NAV_KEY, String(Date.now())); } catch (e) { /* ignore */ }
});
function cameFromSiteNav() {            // true once, for a click made within the last 10 s
  try {
    const t = Number(sessionStorage.getItem(NAV_KEY));
    sessionStorage.removeItem(NAV_KEY);
    return t > 0 && Date.now() - t < 10000;
  } catch (e) { return false; }
}

document.addEventListener('DOMContentLoaded', () => {
  const page = window.location.pathname.split('/').pop() || 'index.html';

  // 1. Inject Nav
  const navContainer = document.getElementById('nav-placeholder');
  if (navContainer) {
    navContainer.innerHTML = NAV_HTML;
    const activeLink = navContainer.querySelector(`a[href="${page}"]`);
    if (activeLink) activeLink.classList.add('is-active');
  }

  // 2. Inject Pagination (Prev / Step n / Next)
  const container = document.getElementById('pagination-placeholder');
  if (container) {
    container.innerHTML = PAGINATION_HTML;
    const i = PAGE_LINKS.findIndex(l => l.href === page);
    const prevEl = document.getElementById('wiz-prev');
    const nextEl = document.getElementById('wiz-next');
    if (i >= 0) {
      document.getElementById('wiz-step').textContent =
        `Step ${String(i + 1).padStart(2, '0')} / ${String(PAGE_LINKS.length).padStart(2, '0')}`;
      if (i > 0) {
        prevEl.href = PAGE_LINKS[i - 1].href;
        document.getElementById('wiz-prev-text').textContent = PAGE_LINKS[i - 1].text;
      } else prevEl.classList.add('is-hidden');
      if (i < PAGE_LINKS.length - 1) {
        nextEl.href = PAGE_LINKS[i + 1].href;
        document.getElementById('wiz-next-text').textContent = PAGE_LINKS[i + 1].text;
      } else nextEl.classList.add('is-hidden');
    }
  }

  // 3. Inject Footer
  const footerContainer = document.getElementById('footer-placeholder');
  if (footerContainer) footerContainer.innerHTML = FOOTER_HTML;
});
