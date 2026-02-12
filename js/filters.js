// js/filters.js
// Filter logic – combine price, tier, amenities, bedrooms etc.
let activeFilters = {
  maxPrice: 25000,
  tiers: ['silver','gold','diamond'],
  amenities: [],
  bedrooms: 0,
  bathrooms: 0
};

function applyFilters(propertyArray) {
  return propertyArray.filter(p => {
    if(p.price > activeFilters.maxPrice) return false;
    if(!activeFilters.tiers.includes(p.tier)) return false;
    if(activeFilters.amenities.length > 0) {
      if(!activeFilters.amenities.every(a => p.amenities?.includes(a))) return false;
    }
    if(activeFilters.bedrooms > 0 && (p.bedrooms || 0) < activeFilters.bedrooms) return false;
    if(activeFilters.bathrooms > 0 && (p.bathrooms || 0) < activeFilters.bathrooms) return false;
    return true;
  });
}

// event listeners (called from app.js)
function initFilters() {
  const priceRange = document.getElementById('price-range');
  if(priceRange) {
    priceRange.addEventListener('input', (e) => {
      document.getElementById('price-display').innerText = `≤ ${e.target.value}`;
      activeFilters.maxPrice = parseInt(e.target.value);
    });
  }
  // tier checkboxes
  document.querySelectorAll('.tiers input[type=checkbox]').forEach(cb => {
    cb.addEventListener('change', () => {
      activeFilters.tiers = Array.from(document.querySelectorAll('.tiers input:checked')).map(c => c.value);
    });
  });
  // apply button
  const applyBtn = document.getElementById('apply-filters');
  if(applyBtn) {
    applyBtn.addEventListener('click', () => {
      const filtered = applyFilters(properties);
      if(map && userLocation) filterMarkersByRadius(userLocation, currentRadius);
      window.updateListings(filtered);
    });
  }
}