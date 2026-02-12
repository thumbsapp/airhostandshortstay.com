// favorites.js – Pins (max 5), store in localStorage, sync with map
const Favorites = {
    MAX_PINS: 5,
    initPins() {
        const favBtn = document.getElementById('favorite-btn') || document.getElementById('favorite-btn-property');
        if (favBtn) {
            favBtn.addEventListener('click', () => {
                this.addPin('p1'); // property page specific
            });
        }
        this.loadPinsFromStorage();
    },
    addPin(propertyId) {
        let pins = JSON.parse(localStorage.getItem('ahss_pins') || '[]');
        if (pins.length >= this.MAX_PINS) {
            UI.showToast(`You can only pin up to ${this.MAX_PINS} properties`, 'warning');
            return;
        }
        const prop = MockData.getById(propertyId);
        if (!prop) return;
        // avoid duplicates
        if (pins.some(p => p.id === propertyId)) {
            UI.showToast('Already pinned', 'info');
            return;
        }
        pins.push({ id: prop.id, name: prop.name, lat: prop.lat, lng: prop.lng, price: prop.price, tier: prop.tier });
        localStorage.setItem('ahss_pins', JSON.stringify(pins));
        UI.showToast(`📍 Pinned ${prop.name} (${pins.length}/${this.MAX_PINS})`, 'success');
        this.loadPinsFromStorage();
    },
    removePin(propertyId) {
        let pins = JSON.parse(localStorage.getItem('ahss_pins') || '[]');
        pins = pins.filter(p => p.id !== propertyId);
        localStorage.setItem('ahss_pins', JSON.stringify(pins));
        UI.showToast('Pin removed', 'info');
        this.loadPinsFromStorage();
    },
    loadPinsFromStorage() {
        const pins = JSON.parse(localStorage.getItem('ahss_pins') || '[]');
        // if map exists, show pin markers
        if (Map.instance && Map.markersLayer) {
            // remove old pin layer? we can add a separate layer
            // for simplicity, just add them as special markers
            pins.forEach(pin => {
                const icon = L.divIcon({
                    className: 'custom-pin favorite-pin',
                    html: `<div><i class="fas fa-heart" style="color:#ef4444;"></i> $${pin.price}</div>`,
                    iconSize: [50, 30]
                });
                const marker = L.marker([pin.lat, pin.lng], { icon }).bindPopup(`<b>${pin.name}</b><br>Pinned · <button onclick="Favorites.removePin('${pin.id}')">Remove</button>`);
                // check if marker already exists? we can just add; cluster group handles.
                Map.markersLayer.addLayer(marker);
            });
        }
    }
};
window.Favorites = Favorites;