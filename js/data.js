// ============================================================
// data.js — the single source of truth for all site data.
// Loaded BEFORE every other script on every page.
//
//   TRIP_DATA.pageLinks   page order: navigation bar + Prev / Next buttons
//   TRIP_DATA.priceLabels wording shown beside country / hotel prices
//   TRIP_DATA.activities  quick-pick words for the Journey page (per time of day)
//   TRIP_DATA.countries  destinations shown on Destination page
//   TRIP_DATA.hotels     hotels shown on Destination page
//
// To add / edit a country or hotel, change it here — no other file
// needs to be touched. Keep every "id" unique (c1, c2… / h1, h2…).
// ============================================================
window.TRIP_DATA = {

  // logo: click this logo images to return to Home (index.html)
  logo: { 
    src: "./images/logo.png", 
    alt: "TripJoy logo",
    url: "index.html"
  },

  // Page order: drives the navigation bar AND the Prev / Next wizard buttons
  pageLinks: [
    { id: 1, href: "index.html",      text: "Home" },
    { id: 2, href: "dest_hotel.html", text: "Destination" },
    { id: 3, href: "journey.html",    text: "Journey" },
    { id: 4, href: "summary.html",    text: "Summary" }
  ],

  // Text shown next to every price on the Destination / Detail / Summary pages
  priceLabels: {
    countries: "Round-trip",
    hotels: "Double room daily"
  },

  // Click-to-add words under each "Text" box on the Journey page.
  // Edit freely — one list per time of day.
  activities: {
    morning:   ["Breakfast", "Sightseeing", "Shopping", "Museum", "Hiking", "Beach", "Light Exploration"],
    afternoon: ["Lunch", "Shopping & Souvenirs", "Museum", "Café", "Theme park", "Relax"],
    night:     ["Dinner", "Shopping", "Night market", "Show", "Nightlife", "Relax", "Hotel rest", "Massage"]
  },

  countries: [
    { id: "c1",  image: "./images/Country-Japan.jpeg",       title: "Japan",         price: 1800,
      description: "Ancient temples, neon-lit cities and world-class food in one trip.",
      details: { "Capital": "Tokyo", "Language": "Japanese", "Currency": "Yen (JPY)", "Best season": "Mar–May, Oct–Nov", "Package": "7 days" } },

    { id: "c2",  image: "./images/Country-China.jpeg",       title: "China",         price: 1500,
      description: "The Great Wall, imperial palaces and futuristic skylines.",
      details: { "Capital": "Beijing", "Language": "Mandarin Chinese", "Currency": "Yuan (CNY)", "Best season": "Apr–Jun, Sep–Oct", "Package": "8 days" } },

    { id: "c3",  image: "./images/Country-India.jpeg",       title: "India",         price: 1300,
      description: "Colourful markets, grand palaces and the Taj Mahal at sunrise.",
      details: { "Capital": "New Delhi", "Language": "Hindi, English", "Currency": "Rupee (INR)", "Best season": "Oct–Mar", "Package": "9 days" } },

    { id: "c4",  image: "./images/Country-Indonesia.jpeg",   title: "Indonesia",     price: 1250,
      description: "Volcanoes, rice terraces and island beaches from Java to Bali.",
      details: { "Capital": "Jakarta", "Language": "Indonesian", "Currency": "Rupiah (IDR)", "Best season": "Apr–Oct", "Package": "7 days" } },

    { id: "c5",  image: "./images/Country-Philippines.jpeg", title: "Philippines",   price: 1150,
      description: "Turquoise lagoons, island hopping and warm hospitality.",
      details: { "Capital": "Manila", "Language": "Filipino, English", "Currency": "Peso (PHP)", "Best season": "Nov–Apr", "Package": "7 days" } },

    { id: "c6",  image: "./images/Country-Hong Kong.jpeg",  title: "Hong Kong",     price: 1400,
      description: "A dazzling harbour skyline, dim sum, trams and hiking trails.",
      details: { "Region": "Special Administrative Region", "Language": "Cantonese, English", "Currency": "HK dollar (HKD)", "Best season": "Oct–Dec", "Package": "5 days" } },

    { id: "c7",  image: "./images/Country-USA.jpeg",         title: "United States", price: 2800,
      description: "Big cities, national parks and iconic road trips coast to coast.",
      details: { "Capital": "Washington, D.C.", "Language": "English", "Currency": "US dollar (USD)", "Best season": "Apr–Jun, Sep–Oct", "Package": "10 days" } },

    { id: "c8",  image: "./images/Country-Brazil.jpeg",      title: "Brazil",        price: 2200,
      description: "Carnival spirit, Amazon rainforest and the beaches of Rio.",
      details: { "Capital": "Brasília", "Language": "Portuguese", "Currency": "Real (BRL)", "Best season": "Apr–Oct", "Package": "9 days" } },

    { id: "c9",  image: "./images/Country-Russia.jpeg",      title: "Russia",        price: 2000,
      description: "Onion-domed cathedrals, grand museums and the Trans-Siberian rail.",
      details: { "Capital": "Moscow", "Language": "Russian", "Currency": "Ruble (RUB)", "Best season": "May–Sep", "Package": "8 days" } },

    { id: "c10", image: "./images/Country-Egypt.jpeg",       title: "Egypt",         price: 1400,
      description: "Pyramids, Nile cruises and ancient temples along the desert.",
      details: { "Capital": "Cairo", "Language": "Arabic", "Currency": "Egyptian pound (EGP)", "Best season": "Oct–Apr", "Package": "8 days" } }
  ],

  hotels: [
    { id: "h1",  image: "./images/Hotel-Regal.jpeg", title: "Regal Hotel", price: 220,
      description: "A classic luxury hotel with spacious rooms and attentive service.",
      details: { "Rating": "5★", "Location": "Downtown", "Amenities": "WiFi, Pool, Spa, Breakfast", "Check-in": "3:00 PM" } },

    { id: "h2",  image: "./images/Hotel-The Peninsula.jpeg", title: "The Peninsula", price: 380,
      description: "A grand colonnaded hotel with a central tower and classic luxury service.",
      details: { "Rating": "5★", "Location": "City center", "Amenities": "WiFi, Spa, Fine dining, Pool", "Check-in": "3:00 PM" } },

    { id: "h3",  image: "./images/Hotel-Marina Bay Sands.jpeg", title: "Marina Bay Sands", price: 450,
      description: "Three towers crowned by a rooftop sky park, overlooking the Supertree gardens.",
      details: { "Rating": "5★", "Location": "Marina Bay, Singapore", "Amenities": "WiFi, Rooftop pool, Spa, Casino", "Check-in": "3:00 PM" } },

    { id: "h4",  image: "./images/Hotel-Experience Fairmont Mumbai.jpeg", title: "Fairmont Mumbai", price: 240,
      description: "A modern luxury hotel with a glowing glass-and-stone facade at dusk.",
      details: { "Rating": "5★", "Location": "Mumbai, India", "Amenities": "WiFi, Pool, Spa, Restaurant", "Check-in": "2:00 PM" } },

    { id: "h5",  image: "./images/Hotel-London.jpeg", title: "London Hotel", price: 320,
      description: "An ornate stone-fronted grand hotel with a landmark corner tower.",
      details: { "Rating": "5★", "Location": "London", "Amenities": "WiFi, Afternoon tea, Spa, Bar", "Check-in": "3:00 PM" } },

    { id: "h6",  image: "./images/Hotel-Historic.jpeg", title: "Historic Hotel", price: 520,
      description: "A classic French-style hotel on a grand historic square, under slate mansard roofs.",
      details: { "Rating": "5★", "Location": "Old town square", "Amenities": "WiFi, Spa, Restaurant, Bar", "Check-in": "3:00 PM" } },

    { id: "h7",  image: "./images/Hotel-Nacional.jpeg", title: "Nacional Hotel", price: 150,
      description: "A palm-lined landmark hotel with twin towers, where classic cars still pass by.",
      details: { "Rating": "4★", "Location": "Seafront avenue", "Amenities": "WiFi, Gardens, Pool, Restaurant", "Check-in": "2:00 PM" } },

    { id: "h8",  image: "./images/Hotel-Magical.jpeg", title: "Magical Hotel", price: 420,
      description: "A grand villa-style hotel with terraced gardens, a big pool and green hills behind.",
      details: { "Rating": "5★", "Location": "Hillside resort", "Amenities": "WiFi, Pool, Gardens, Restaurant", "Check-in": "3:00 PM" } },

    { id: "h9",  image: "./images/Hotel-iconic.jpeg", title: "Iconic Hotel", price: 260,
      description: "A towering landmark hotel with a grand stone facade in the heart of the city.",
      details: { "Rating": "4★", "Location": "Downtown", "Amenities": "WiFi, Restaurant, Bar, Gym", "Check-in": "3:00 PM" } },

    { id: "h10", image: "./images/Hotel-Kuta Bali.jpeg", title: "Kuta Bali Hotel", price: 90,
      description: "A relaxed, modern hotel built around an open courtyard, close to Kuta's beaches.",
      details: { "Rating": "3★", "Location": "Kuta, Bali", "Amenities": "WiFi, Breakfast, Courtyard", "Check-in": "2:00 PM" } }
  ]
};
