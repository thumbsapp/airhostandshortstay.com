// app.js – bootstrap, routing, global state, engines initialization
const App = {
    currentPage: window.location.pathname.split('/').pop() || 'index.html',
    userLocation: null,
    favorites: JSON.parse(localStorage.getItem('ahss_pins') || '[]'),
    incentives: {
        offers: 2,
        credit: 0
    },
    initHomepage() {
        Geo.initGeolocation();
        Map.init('discovery-map', { fullscreen: true });
        Filters.init();
        Listings.loadHotHomes();
        Listings.loadFeaturedOffers();
        Realtime.startPolling();
        UI.initAssistant();
        Alerts.init();   // new alerts engine
        Incentives.init(); // new incentives engine
    },
    initSearch() {
        Map.init('search-map', { fullscreen: false });
        Listings.loadSearchResults();
        Filters.attachSearchListeners();
        Realtime.subscribeToListings(); // real-time updates on search
    },
    initProperty() {
        LipaMdogo.init();
        Negotiation.init();
        Favorites.initPins();
        Services.initBundles();
        UI.initGallery();
    },
    // global helpers
    distance(lat1, lon1, lat2, lon2) {
        const R = 6371; // km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }
};
window.App = App;
// service worker registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js').catch(e => console.warn('SW reg failed'));
    });
}
// Alerts engine (embedded in app for simplicity, but can be separate)
const Alerts = {
    init() {
        // populate alerts panel
        const panel = document.querySelector('.alerts-panel');
        if (panel) {
            panel.innerHTML = `
                <div class="alert-item"><i class="fas fa-bell"></i> Price drop: 15% at Sunset Villa</div>
                <div class="alert-item"><i class="fas fa-tag"></i> New: Lipa Mdogo on 20+ homes</div>
                <div class="alert-item"><i class="fas fa-bolt"></i> Hot Home: Urban Loft - 3 bookings last hour</div>
            `;
        }
    },
    addAlert(msg, type = 'info') {
        UI.showToast(msg, type);
    }
};
window.Alerts = Alerts;
// Incentives engine
const Incentives = {
    init() {
        // load user incentives from localStorage
        const offers = localStorage.getItem('ahss_incentives');
        if (offers) App.incentives = JSON.parse(offers);
        this.updateBadge();
    },
    updateBadge() {
        const badge = document.querySelector('.incentives-badge');
        if (badge) badge.innerHTML = `<i class="fas fa-gift"></i> ${App.incentives.offers} offers`;
    },
    addOffer(description) {
        App.incentives.offers++;
        localStorage.setItem('ahss_incentives', JSON.stringify(App.incentives));
        this.updateBadge();
        UI.showToast(`🎁 New offer: ${description}`, 'success');
    }
};
window.Incentives = Incentives;