// geolocation.js – browser GPS + fallback
const Geo = {
    initGeolocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(pos => {
                App.userLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                Map.instance.setView([pos.coords.latitude, pos.coords.longitude], 14);
                L.marker([pos.coords.latitude, pos.coords.longitude], { icon: L.divIcon({ className: 'user-location', html: '<i class="fas fa-circle-user"></i>' }) }).addTo(Map.instance);
            }, () => this.fallback());
        } else this.fallback();
    },
    fallback() {
        App.userLocation = { lat: -1.2864, lng: 36.8172 }; // Nairobi
        Map.instance.setView([-1.2864, 36.8172], 12);
    }
};
window.Geo = Geo;