// index.js — Home page.
//  • Opened directly (address bar, bookmark, new tab, reload)  -> clear all data.
//  • Reached with the menu or a Prev button                      -> keep the data.
//  • "Plan New Trip" -> asks first if a plan exists, then clears and opens Destination.
if (!cameFromSiteNav()) resetPlannerData();

document.querySelector('.btn-cta')?.addEventListener('click', ev => {
  if (hasPlannerData() && !confirm('You already have a trip plan in progress.\nPlan New Trip will clear it. Continue?')) {
    ev.preventDefault();                 // stay on Home, keep the plan
    return;
  }
  resetPlannerData();                    // the link's own href then opens Destination
});

const countries = window.TRIP_DATA?.[COUNTRIES] ?? [];
const heroImage = document.getElementById("hero-country-image");

let selectedCountry = countries[Math.floor(Math.random() * countries.length)];

function showCountry(country) {
  if (!country || !heroImage) return;
  selectedCountry = country;
  heroImage.src = country.image;
  heroImage.alt = `${country.title} travel destination`;
}

showCountry(selectedCountry);

heroImage?.addEventListener("click", () => {
  const otherCountries = countries.filter(country => country !== selectedCountry);
  if (otherCountries.length === 0) return;
  showCountry(otherCountries[Math.floor(Math.random() * otherCountries.length)]);
});
