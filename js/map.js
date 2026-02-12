// map.js – OSM + Leaflet, clustering, pins
const Map = {
    instance: null,
    markersLayer: null,
    init(containerId, options = {}) {
        this.instance = L.map(containerId).setView([-1.2864, 36.8172], 12); // Nairobi
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(this.instance);
        this.markersLayer = L.markerClusterGroup({ chunkedLoading: true });
        this.instance.addLayer(this.markersLayer);
        if (options.fullscreen) setTimeout(() => this.instance.invalidateSize(), 100);
        this.loadPins();
    },
    loadPins(filterTiers = ['silver','gold','diamond']) {
        this.markersLayer.clearLayers();
        const props = MockData.getProperties();
        props.forEach(p => {
            if (!filterTiers.includes(p.tier)) return;
            const icon = L.divIcon({
                className: `custom-pin ${p.tier}`,
                html: `<div class="pin-badge"><span class="availability-pulse ${p.availability}"></span>$${p.price}</div>`,
                iconSize: [60, 30]
            });
            const marker = L.marker([p.lat, p.lng], { icon }).bindPopup(`<b>${p.name}</b><br>$${p.price}/night · Tier: ${p.tier}`);
            this.markersLayer.addLayer(marker);
        });
    },
    updateRadius(km) { /* distance calc placeholder – real filter would be applied */ }
};
window.Map = Map;