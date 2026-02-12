// app.js – bootstrap, routing, global state
const App = {
    currentPage: window.location.pathname.split('/').pop() || 'index.html',
    userLocation: null,
    favorites: [],
    initHomepage() {
        Geo.initGeolocation();
        Map.init('discovery-map', { fullscreen: true });
        Filters.init();
        Listings.loadHotHomes();
        Realtime.startPolling();
        UI.initAssistant();
    },
    initSearch() {
        Map.init('search-map', { fullscreen: false });
        Listings.loadSearchResults();
        Filters.attachSearchListeners();
    },
    initProperty() {
        LipaMdogo.init();
        Negotiation.init();
        Favorites.initPins();
        Services.initBundles();
    }
};
window.App = App;
// service worker registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js').catch(e => console.warn('SW reg failed'));
    });
}