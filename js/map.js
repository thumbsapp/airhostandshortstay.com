// map.js – OSM + Leaflet, clustering, radius matching, real-time pins, distance calculations
const Map = {
    instance: null,
    markersLayer: null,
    radiusCircle: null,
    userMarker: null,
    init(containerId, options = {}) {
        this.instance = L.map(containerId).setView([-1.2864, 36.8172], 12);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(this.instance);
        this.markersLayer = L.markerClusterGroup({ 
            chunkedLoading: true,
            spiderfyOnMaxZoom: true,
            showCoverageOnHover: false,
            zoomToBoundsOnClick: true,
            iconCreateFunction: function(cluster) {
                return L.divIcon({ 
                    html: '<div class="marker-cluster">' + cluster.getChildCount() + '</div>',
                    className: 'marker-cluster-wrapper',
                    iconSize: [36, 36] 
                });
            }
        });
        this.instance.addLayer(this.markersLayer);
        if (options.fullscreen) setTimeout(() => this.instance.invalidateSize(), 150);
        this.loadPins();
        // radius matching: default circle
        if (App.userLocation) {
            this.drawRadiusCircle(App.userLocation.lat, App.userLocation.lng, 10);
        }
    },
    loadPins(filterTiers = ['silver','gold','diamond'], filterRadius = null) {
        this.markersLayer.clearLayers();
        let props = MockData.getProperties();
        // radius filter
        if (filterRadius && App.userLocation) {
            props = props.filter(p => {
                const dist = App.distance(App.userLocation.lat, App.userLocation.lng, p.lat, p.lng);
                return dist <= filterRadius;
            });
        }
        props.forEach(p => {
            if (!filterTiers.includes(p.tier)) return;
            const icon = L.divIcon({
                className: `custom-pin ${p.tier}`,
                html: `<div class="pin-badge">
                            <span class="availability-pulse ${p.availability}"></span>
                            <span>$${p.price}</span>
                            ${p.hotHome ? '<i class="fas fa-bolt" style="color:#f59e0b; margin-left:2px;"></i>' : ''}
                        </div>`,
                iconSize: [70, 30]
            });
            const marker = L.marker([p.lat, p.lng], { icon })
                .bindPopup(`
                    <b>${p.name}</b><br>
                    $${p.price}/night · ${p.tier} tier<br>
                    <span class="availability-pulse ${p.availability}"></span> ${p.availability === 'green' ? 'Available now' : p.availability === 'yellow' ? 'Limited' : 'Booked'}<br>
                    ${p.hostType === 'native' ? '🏡 Native host' : '🏢 Aggregated'}<br>
                    <button onclick="window.location.href='property.html?id=${p.id}'" style="background:#2563eb; color:white; border:none; padding:4px 12px; border-radius:20px; margin-top:6px;">View</button>
                `);
            this.markersLayer.addLayer(marker);
        });
    },
    drawRadiusCircle(lat, lng, radiusKm) {
        if (this.radiusCircle) this.instance.removeLayer(this.radiusCircle);
        this.radiusCircle = L.circle([lat, lng], {
            radius: radiusKm * 1000,
            color: '#2563eb',
            weight: 2,
            opacity: 0.5,
            fillColor: '#3b82f6',
            fillOpacity: 0.1
        }).addTo(this.instance);
    },
    updateRadius(km) {
        if (App.userLocation) {
            this.drawRadiusCircle(App.userLocation.lat, App.userLocation.lng, km);
            this.loadPins(Filters.activeTiers, km);
        }
    },
    setUserLocation(lat, lng) {
        if (this.userMarker) this.instance.removeLayer(this.userMarker);
        this.userMarker = L.marker([lat, lng], { 
            icon: L.divIcon({ 
                className: 'user-location',
                html: '<i class="fas fa-circle-user" style="font-size:32px; color:#2563eb; filter: drop-shadow(0 0 8px #3b82f6);"></i>',
                iconSize: [32, 32]
            })
        }).addTo(this.instance).bindPopup('You are here');
        this.instance.setView([lat, lng], 14);
        this.drawRadiusCircle(lat, lng, Filters.currentRadius || 10);
    }
};
window.Map = Map;