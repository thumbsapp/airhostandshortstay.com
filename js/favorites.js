// favorites.js – Pins (max 5), wishlist, heart toggle, localStorage
const Favorites = {
    MAX_PINS: 5,
    initPins() {
        const favBtn = document.getElementById('favorite-btn') || document.getElementById('favorite-btn-property');
        if (favBtn) {
            favBtn.addEventListener('click', () => {
                const propertyId = new URLSearchParams(window.location.search).get('id') || 'p1';
                this.addPin(propertyId);
            });
        }
        this.loadPinsFromStorage();
        this.updateWishlistIcons();
    },
    addPin(propertyId) {
        let pins = JSON.parse(localStorage.getItem('ahss_pins') || '[]');
        if (pins.length >= this.MAX_PINS) {
            UI.showToast(`You can only pin up to ${this.MAX_PINS} properties`, 'warning');
            return false;
        }
        const prop = MockData.getById(propertyId);
        if (!prop) return false;
        if (pins.some(p => p.id === propertyId)) {
            UI.showToast('Already pinned', 'info');
            return false;
        }
        pins.push({ 
            id: prop.id, 
            name: prop.name, 
            lat: prop.lat, 
            lng: prop.lng, 
            price: prop.price, 
            tier: prop.tier,
            img: prop.img
        });
        localStorage.setItem('ahss_pins', JSON.stringify(pins));
        UI.showToast(`📍 Pinned ${prop.name} (${pins.length}/${this.MAX_PINS})`, 'success');
        this.loadPinsFromStorage();
        this.updateWishlistIcons();
        return true;
    },
    removePin(propertyId) {
        let pins = JSON.parse(localStorage.getItem('ahss_pins') || '[]');
        pins = pins.filter(p => p.id !== propertyId);
        localStorage.setItem('ahss_pins', JSON.stringify(pins));
        UI.showToast('Pin removed', 'info');
        this.loadPinsFromStorage();
        this.updateWishlistIcons();
    },
    loadPinsFromStorage() {
        const pins = JSON.parse(localStorage.getItem('ahss_pins') || '[]');
        // if map exists, show pin markers (separate layer)
        if (Map.instance && Map.markersLayer) {
            // we could add a dedicated layer; for simplicity, add to markersLayer with custom icon
            pins.forEach(pin => {
                const icon = L.divIcon({
                    className: 'custom-pin favorite-pin',
                    html: `<div><i class="fas fa-heart" style="color:#ef4444;"></i> $${pin.price}</div>`,
                    iconSize: [50, 30]
                });
                const marker = L.marker([pin.lat, pin.lng], { icon }).bindPopup(`
                    <b>${pin.name}</b><br>
                    Pinned · <button onclick="Favorites.removePin('${pin.id}')" style="background:#ef4444; color:white; border:none; padding:2px 10px; border-radius:20px;">Remove</button>
                `);
                Map.markersLayer.addLayer(marker);
            });
        }
    },
    updateWishlistIcons() {
        const pins = JSON.parse(localStorage.getItem('ahss_pins') || '[]');
        const pinnedIds = pins.map(p => p.id);
        document.querySelectorAll('.wishlist-icon, .gallery-heart, .favorite-btn').forEach(el => {
            const id = el.dataset.id || (el.closest('[data-id]')?.dataset.id);
            if (id && pinnedIds.includes(id)) {
                el.classList.remove('far');
                el.classList.add('fas');
                if (el.style) el.style.color = '#ef4444';
            } else {
                el.classList.remove('fas');
                el.classList.add('far');
                if (el.style) el.style.color = '';
            }
        });
    }
};
window.Favorites = Favorites;