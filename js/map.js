// js/map.js
let map, markersLayer = null;
let userLocation = null;
let currentRadius = 5; // km

function initMap(containerId, initialCoords = [-1.2864, 36.8172], zoom = 13) {
  map = L.map(containerId).setView(initialCoords, zoom);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);
  markersLayer = L.layerGroup().addTo(map);
  return map;
}

function clearMarkers() {
  if(markersLayer) markersLayer.clearLayers();
}

function getMarkerColor(tier) {
  switch(tier) {
    case 'silver': return '#c0c0c0';
    case 'gold': return '#ffd700';
    case 'diamond': return '#b9f2ff';
    default: return '#6b7280';
  }
}

function createCustomIcon(tier, availability) {
  const color = getMarkerColor(tier);
  const pulseClass = availability === 'available' ? 'pulse-green' : '';
  const html = `<div style="background:${color}; width:20px; height:20px; border-radius:50%; border:3px solid white; box-shadow:0 0 12px rgba(0,0,0,0.3); ${availability === 'available' ? 'animation:pulse 1.5s infinite;' : ''}"></div>`;
  return L.divIcon({ html, className: 'custom-marker', iconSize: [26,26], popupAnchor: [0,-18] });
}

function addMarkers(propertiesArray) {
  clearMarkers();
  propertiesArray.forEach(prop => {
    if(!prop.lat || !prop.lng) return;
    const marker = L.marker([prop.lat, prop.lng], { icon: createCustomIcon(prop.tier, prop.availability) })
      .bindPopup(`<b>${prop.name}</b><br>KES ${prop.price}/night<br>Tier: ${prop.tier}<br><a href="property.html?id=${prop.id}">View</a>`);
    markersLayer.addLayer(marker);
  });
}

function filterMarkersByRadius(center, radiusKm) {
  if(!center) return;
  const filtered = properties.filter(p => {
    if(!p.lat || !p.lng) return false;
    const distance = map.distance(center, L.latLng(p.lat, p.lng)) / 1000; // km
    p.distance = distance.toFixed(1);
    return distance <= radiusKm;
  });
  addMarkers(filtered);
  // also update listings panel
  if(typeof window.updateListings === 'function') window.updateListings(filtered);
  return filtered;
}

function setUserLocation(lat, lng) {
  userLocation = L.latLng(lat, lng);
  map.setView(userLocation, 14);
  filterMarkersByRadius(userLocation, currentRadius);
}