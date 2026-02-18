// geolocation.js – browser GPS + fallback + continuous tracking
const Geo = {
    watchId: null,
    initGeolocation() {
        if (navigator.geolocation) {
            // high accuracy
            this.watchId = navigator.geolocation.watchPosition(pos => {
                App.userLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                if (Map.instance) {
                    Map.setUserLocation(pos.coords.latitude, pos.coords.longitude);
                }
                UI.showToast('📍 Location updated', 'info');
            }, err => {
                console.warn('Geolocation error', err);
                this.fallback();
            }, {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            });
        } else this.fallback();
    },
    fallback() {
        App.userLocation = { lat: -1.2864, lng: 36.8172 }; // Nairobi
        if (Map.instance) {
            Map.setUserLocation(-1.2864, 36.8172);
        }
        UI.showToast('Using approximate location (Nairobi)', 'warning');
    },
    stopWatching() {
        if (this.watchId) navigator.geolocation.clearWatch(this.watchId);
    }
};
window.Geo = Geo;