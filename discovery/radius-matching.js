// discovery/radius-matching.js – Uber-style radius matching & distance calculations
const RadiusMatching = {
    currentRadius: 10, // km
    userLocation: null,
    radiusCircle: null,
    maxRadius: 100,
    minRadius: 1,

    init() {
        // Listen for location updates
        document.addEventListener('geolocation:updated', (e) => {
            this.userLocation = e.detail;
            this.updateRadiusCircle();
            this.matchProperties();
        });

        // Listen for radius changes
        document.addEventListener('filters:radiusChange', (e) => {
            this.setRadius(e.detail);
        });

        // Initial location from App
        if (App.userLocation) {
            this.userLocation = App.userLocation;
            this.updateRadiusCircle();
        }
    },

    setRadius(km) {
        this.currentRadius = Math.min(Math.max(km, this.minRadius), this.maxRadius);
        this.updateRadiusCircle();
        this.matchProperties();
        // Update UI
        const radiusDisplay = document.getElementById('radius-value');
        if (radiusDisplay) radiusDisplay.innerText = `${this.currentRadius} km`;
        const radiusSelect = document.getElementById('radius-range');
        if (radiusSelect) radiusSelect.value = this.currentRadius;
    },

    updateRadiusCircle() {
        if (!Map.instance || !this.userLocation) return;
        if (this.radiusCircle) Map.instance.removeLayer(this.radiusCircle);
        this.radiusCircle = L.circle([this.userLocation.lat, this.userLocation.lng], {
            radius: this.currentRadius * 1000,
            color: '#2563eb',
            weight: 2,
            opacity: 0.6,
            fillColor: '#3b82f6',
            fillOpacity: 0.08,
            dashArray: '5, 8',
            className: 'radius-pulse'
        }).addTo(Map.instance);
        // Add pulse animation via CSS
    },

    matchProperties() {
        if (!this.userLocation) return;
        const properties = MockData.getProperties();
        const inRange = properties.filter(p => {
            const dist = this.calculateDistance(
                this.userLocation.lat, this.userLocation.lng,
                p.lat, p.lng
            );
            p.distance = dist; // attach distance
            return dist <= this.currentRadius;
        });
        // Dispatch event with matched properties
        const event = new CustomEvent('radius:matched', { detail: { properties: inRange, radius: this.currentRadius } });
        document.dispatchEvent(event);
        return inRange;
    },

    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    },

    getETA(distanceKm) {
        // Rough ETA in minutes (assuming 30 km/h average in city)
        const speed = 30; // km/h
        return Math.round((distanceKm / speed) * 60);
    },

    formatDistance(dist) {
        if (dist < 1) return `${Math.round(dist * 1000)} m`;
        return `${dist.toFixed(1)} km`;
    }
};

document.addEventListener('DOMContentLoaded', () => RadiusMatching.init());
window.RadiusMatching = RadiusMatching;