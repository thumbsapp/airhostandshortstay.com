// js/app.js
// Main controller – initializes everything
document.addEventListener('DOMContentLoaded', function() {
  // Update favorite counter from localStorage
  if(document.getElementById('fav-counter')) {
    document.getElementById('fav-counter').textContent = (JSON.parse(localStorage.getItem('airhost_favorites')) || []).length;
  }

  // Page specific logic
  const path = window.location.pathname;

  if(path.includes('index.html') || path === '/' || path.endsWith('/')) {
    initHomepage();
  } else if(path.includes('search.html')) {
    initSearchPage();
  } else if(path.includes('property.html')) {
    initPropertyPage();
  }

  // Global: favorites nav
  document.getElementById('favorites-nav')?.addEventListener('click', (e) => {
    e.preventDefault();
    alert(`You have ${favorites.length} favorite pins. Manage them on property pages.`);
  });

  // Dash AI toggle
  const chatToggle = document.querySelector('.chat-toggle');
  if(chatToggle) {
    chatToggle.addEventListener('click', () => {
      document.querySelector('.chat-panel')?.classList.toggle('hidden');
    });
  }
});

function initHomepage() {
  // Init map
  initMap('home-map');
  // Get user location
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation(pos.coords.latitude, pos.coords.longitude);
      },
      () => { // fallback Nairobi
        setUserLocation(-1.2864, 36.8172);
      }
    );
  } else {
    setUserLocation(-1.2864, 36.8172);
  }

  // Radius buttons
  document.querySelectorAll('.radius-buttons button').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.radius-buttons button').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentRadius = parseInt(this.dataset.radius);
      if(userLocation) filterMarkersByRadius(userLocation, currentRadius);
    });
  });

  // Locate me
  document.getElementById('locate-me')?.addEventListener('click', () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation(pos.coords.latitude, pos.coords.longitude),
      () => alert('Location access denied')
    );
  });

  // Load hot homes carousel
  const carousel = document.getElementById('hot-homes-carousel');
  if(carousel) {
    hotHomes.forEach(h => {
      const card = document.createElement('div');
      card.className = `hot-card tier-${h.tier}`;
      card.innerHTML = `
        <img src="${h.image}" alt="${h.name}" style="width:100%; height:140px; object-fit:cover; border-radius:12px;">
        <h4>${h.name}</h4>
        <span class="discount-badge">-${h.discount}%</span>
        <div class="countdown" data-expire="${h.countdown}">⏳ 02:15:33</div>
        <p>KES ${h.price}/night</p>
        <button class="btn-small book-now">Book Now</button>
      `;
      carousel.appendChild(card);
    });
  }

  // Load featured offers
  const featuredGrid = document.getElementById('featured-offers-grid');
  if(featuredGrid) {
    featuredOffers.slice(0,4).forEach(f => {
      const el = document.createElement('div');
      el.className = 'featured-card';
      el.innerHTML = `<img src="${f.image}" style="width:100%;"><h4>${f.name}</h4><p>${f.tier}</p>`;
      featuredGrid.appendChild(el);
    });
  }

  // Expose updateListings globally
  window.updateListings = function(filteredProps) {
    const container = document.getElementById('listings-container');
    if(!container) return;
    container.innerHTML = '';
    filteredProps.slice(0,8).forEach(p => {
      const card = document.createElement('div');
      card.className = `property-card tier-${p.tier}`;
      const isFav = isFavorite(p.id) ? 'fas' : 'far';
      card.innerHTML = `
        <img src="${p.image}" alt="${p.name}" style="width:100%; height:160px; object-fit:cover; border-radius:12px;">
        <div style="display:flex; justify-content:space-between;">
          <h4>${p.name}</h4>
          <i class="${isFav} fa-heart favorite-icon" data-id="${p.id}" style="color:#ef4444; cursor:pointer;"></i>
        </div>
        <span class="tier-badge ${p.tier}">${p.tier}</span>
        <span><span class="availability-dot dot-${p.availability}"></span>${p.availability}</span>
        <p><strong>KES ${p.price}</strong> / night</p>
        ${p.distance ? `<span>🚶 ${p.distance} km</span>` : ''}
        <div><span class="badge ${p.isNative ? 'native' : 'meta'}">${p.isNative ? 'Native' : 'Aggregated'}</span></div>
        <button class="lipa-btn">💚 Lipa Mdogo Mdogo</button>
      `;
      container.appendChild(card);
    });
    // Attach favorite listeners
    attachFavoriteListeners();
  };
  // initial load
  window.updateListings(properties);

  initFilters();
}

function attachFavoriteListeners() {
  document.querySelectorAll('.favorite-icon').forEach(el => {
    el.removeEventListener('click', handleFavorite);
    el.addEventListener('click', handleFavorite);
  });
}

function handleFavorite(e) {
  e.stopPropagation();
  const icon = e.currentTarget;
  const propId = parseInt(icon.dataset.id);
  if(icon.classList.contains('far')) {
    if(addFavorite(propId)) {
      icon.classList.remove('far');
      icon.classList.add('fas');
    }
  } else {
    removeFavorite(propId);
    icon.classList.remove('fas');
    icon.classList.add('far');
  }
}

function initSearchPage() {
  // Map init, filter sidebar logic (similar to homepage but condensed)
  initMap('search-map');
  setUserLocation(-1.2864,36.8172);
  // load result list with all properties
  // negotiation stubs etc.
}

function initPropertyPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const propId = parseInt(urlParams.get('id'));
  const property = properties.find(p => p.id === propId) || properties[0];
  // fill UI with property data
  document.getElementById('property-title').innerText = property.name;
  document.getElementById('meta-native-badge').innerText = property.isNative ? 'Native listing' : 'Aggregated (Meta)';
  // negotiation button
  document.getElementById('negotiate-btn')?.addEventListener('click', () => {
    document.getElementById('negotiation-ui').classList.toggle('hidden');
  });
  // Lipa Mdogo stub
}