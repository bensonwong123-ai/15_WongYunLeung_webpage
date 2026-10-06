# Personal Trip Planner

A small static site: pick a country and a hotel, plan each day, review the summary.
No build step, no server needed — open `index.html` in a browser.

## Structure

```
trip-planner/
├── index.html        Home
├── dest_hotel.html   Choose one country + one hotel
├── detail_dest.html  Details for one country / hotel (opens in the same tab from the Destination page; has a Back button)
├── journey.html      Trip dates + per-day morning/afternoon plans
├── summary.html      Everything in one place
├── css/              style.css (base), components.css (cards, forms, buttons), vendor/ (calendar styles)
├── js/
│   ├── data.js         ALL site data: pageLinks, price labels, quick-pick activities, countries, hotels
│   ├── script.js       nav bar, wizard pagination, footer with current year, resetPlannerData()
│   ├── storage.js      localStorage helpers, catalog lookups, cost calculation, trip HTML
│   ├── index.js / dest_hotel.js / detail_dest.js / journey.js / summary.js   page logic
│   └── vendor/flatpickr.min.js   calendar date picker (MIT licence, v4.6.13, bundled — no CDN needed)
└── images/           country / hotel photos, logo, favicon

Icons come from Font Awesome (CDN link in every page `<head>`).
```

## js/data.js

`js/data.js` defines `window.TRIP_DATA` and must be loaded **before** every other script
(each page already does this).

- `pageLinks` – `{ id, href, text }` for each page, in order; drives the nav bar and the Prev / Next buttons
- `activities` – the quick-pick words under each Morning / Afternoon / Night "Text" box
- `priceLabels` – wording shown beside prices (`Round-trip` for countries, `Double room daily` for hotels)
- `countries` / `hotels` – `{ id, image, title, price, description, details }`

To add a country or hotel: put its photo in `images/` (avoid `:` in file names), then add an entry to `countries` / `hotels` with a unique `id`.
Prices, ratings and amenities in the catalog are sample values — edit them freely.
Nothing else needs to change.

## Summary page

The **Print** button (<i class="fa-solid fa-print"></i>) opens the browser print dialog; choose *Save as PDF*.
Only the summary is printed — the nav bar, buttons and footer are hidden by `@media print`.
Every page carries a `dd/mm/yyyy hh:MM` print time at the top-left. `@page { margin: 0 }` suppresses the browser's own date/title/URL header and footer (their date format can't be changed), and a repeating table header/footer supplies the page margins.

## Journey page

- Dates are chosen from a calendar and shown as `dd/mm/yyyy`. The start date must be today or later; the end date can't be before the start date.
- Dates, the day you were viewing, and every Text / Remark / Price entry are autosaved in the browser as you type, and restored when you come back.
- Changing the start date moves your day plans with it (Day 1 stays Day 1).
- Use **Copy previous day** to copy the previous day's activities, remarks, and prices into the current day.
- Tap a suggested word to add it to *Text*; tap again to remove it.
- There is no save button: the plan is autosaved and the Summary page displays it directly.

## How the trip total is calculated

Shown on the Summary page (and as a live estimate on the Journey page):

| item             | formula                                                        |
|------------------|----------------------------------------------------------------|
| Air ticket       | country price (round-trip, 1 traveller)                        |
| Hotel            | hotel price (double room per night) × nights (days − 1)        |
| Daily trip cost  | sum of every Morning / Afternoon / Night price you entered     |
| **Total**        | air ticket + hotel + daily trip cost                           |

## What is saved in the browser (localStorage)

Data is cleared when `index.html` is opened directly (address bar, bookmark, new tab, reload) and when **Plan New Trip** is pressed (it asks first if a plan already exists). Using the menu or the Prev / Next buttons never clears anything.

| key             | content                                             |
|-----------------|-----------------------------------------------------|
| `selection-ids` | ids of the chosen country / hotel (looked up in js/data.js) |
| `trip-draft`    | the trip plan (dates + every day) — shown on Summary |
