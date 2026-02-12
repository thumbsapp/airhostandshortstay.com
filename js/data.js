// js/data.js
// MOCK PROPERTIES — full dataset for AirHost & ShortStay
const properties = [
  {
    id: 1,
    name: 'Silver Serenity Apartment',
    lat: -1.2921, lng: 36.8219, // Nairobi
    price: 4500,
    tier: 'silver',
    availability: 'available', // green
    distance: 0.8,
    image: 'images/placeholder-property.svg',
    amenities: ['wifi','kitchen'],
    isNative: true,
    discount: 15,
    countdown: '2025-03-15T18:00:00',
    bedrooms: 2,
    bathrooms: 1,
    guests: 4,
    description: 'Cozy silver-tier stay with fast WiFi.'
  },
  {
    id: 2,
    name: 'Gold Heights Penthouse',
    lat: -1.2864, lng: 36.8172,
    price: 12500,
    tier: 'gold',
    availability: 'later', // yellow
    distance: 1.2,
    image: 'images/placeholder-property.svg',
    amenities: ['wifi','ac','pool','generator'],
    isNative: true,
    discount: 0,
    countdown: null,
    bedrooms: 3,
    bathrooms: 2,
    guests: 6,
  },
  {
    id: 3,
    name: 'Diamond Sky Villa',
    lat: -1.2956, lng: 36.8145,
    price: 35000,
    tier: 'diamond',
    availability: 'available',
    distance: 2.1,
    image: 'images/placeholder-property.svg',
    amenities: ['wifi','ac','pool','pet','kitchen','generator'],
    isNative: false, // meta listing (aggregated)
    discount: 25,
    countdown: '2025-03-14T22:00:00',
    bedrooms: 5,
    bathrooms: 4,
    guests: 12,
  },
  // add more to make dataset rich
  {
    id: 4,
    name: 'Mombasa Beach Silver',
    lat: -4.0435, lng: 39.6682,
    price: 6800,
    tier: 'silver',
    availability: 'booked',
    distance: null,
    image: 'images/placeholder-property.svg',
    amenities: ['wifi','kitchen','pet'],
    isNative: true,
  },
  {
    id: 5,
    name: 'Dar es Salaam Gold Loft',
    lat: -6.7924, lng: 39.2083,
    price: 14500,
    tier: 'gold',
    availability: 'available',
    distance: null,
    image: 'images/placeholder-property.svg',
    amenities: ['wifi','ac','pool'],
    isNative: false,
  },
  {
    id: 6,
    name: 'Kigali Diamond Heights',
    lat: -1.9441, lng: 30.0619,
    price: 28500,
    tier: 'diamond',
    availability: 'later',
    distance: null,
    image: 'images/placeholder-property.svg',
    amenities: ['wifi','ac','generator','kitchen'],
    isNative: true,
  }
];

// hot homes (subset with discount & countdown)
const hotHomes = properties.filter(p => p.discount && p.discount > 0);

// featured offers: diamond & gold with high price
const featuredOffers = properties.filter(p => p.tier === 'diamond' || (p.tier === 'gold' && p.price > 10000));

// favorites in localStorage (max 5)
let favorites = JSON.parse(localStorage.getItem('airhost_favorites')) || [];

function saveFavorites() {
  localStorage.setItem('airhost_favorites', JSON.stringify(favorites));
  const counter = document.getElementById('fav-counter');
  if(counter) counter.textContent = favorites.length;
}

function addFavorite(propId) {
  if(favorites.length >= 5) { alert('You can only pin up to 5 favorites.'); return false; }
  if(!favorites.includes(propId)) { favorites.push(propId); saveFavorites(); return true; }
  return false;
}

function removeFavorite(propId) {
  favorites = favorites.filter(id => id !== propId);
  saveFavorites();
}

function isFavorite(propId) {
  return favorites.includes(propId);
}