// engagement/favorites.js – Pins, wishlist, max 5, map layer, sync
const FavoritesEngine = {
    MAX_PINS: 5,
    favorites: [],

    init() {
        this.load();
        this.setupListeners();
        this.renderPins();
    },

    load() {
        const saved = localStorage.getItem('ahss_favorites');
        this.favorites = saved ? JSON.parse(saved) : [];
    },

    save() {
        localStorage.setItem('ahss_favorites', JSON.stringify(this.favorites));
        this.renderPins();
        this.updateUI();
    },

    add(propertyId) {
        const prop = MockData.getById(propertyId);
        if (!prop) return false;
        
        if (this.favorites.length >= this.MAX_PINS) {
            UI.showToast(`You can only pin up to ${this.MAX_PINS} properties`, 'warning');
            return false;
        }
        
        if (this.favorites.some(f => f.id === propertyId)) {
            UI.showToast('Already pinned', 'info');
            return false;
        }
        
        this.favorites.push({
            id: prop.id,
            name: prop.name,
            lat: prop.lat,
            lng: prop.lng,
            price: prop.price,
            tier: prop.tier,
            img: prop.img,
            added: Date.now()
        });
        
        this.save();
        UI.showToast(`📍 Pinned ${prop.name} (${this.favorites.length}/${this.MAX_PINS})`, 'success');
        return true;
    },

    remove(propertyId) {
        this.favorites = this.favorites.filter(f => f.id !== propertyId);
        this.save();
        UI.showToast('Pin removed', 'info');
    },

    toggle(propertyId) {
        if (this.favorites.some(f => f.id === propertyId)) {
            this.remove(propertyId);
            return false;
        } else {
            return this.add(propertyId);
        }
    },

    renderPins() {
        if (!Map.instance || !Map.markersLayer) return;
        
        // Remove old favorite markers (we can identify by a class)
        Map.markersLayer.eachLayer(layer => {
            if (layer.options && layer.options.className && layer.options.className.includes('favorite-pin')) {
                Map.markersLayer.removeLayer(layer);
            }
        });
        
        this.favorites.forEach(pin => {
            const icon = L.divIcon({
                className: 'custom-pin favorite-pin',
                html: `<div><i class="fas fa-heart" style="color:#ef4444;"></i> $${pin.price}</div>`,
                iconSize: [60, 30]
            });
            const marker = L.marker([pin.lat, pin.lng], { icon }).bindPopup(`
                <b>${pin.name}</b><br>
                ⭐ Pinned · $${pin.price}/night<br>
                <button onclick="FavoritesEngine.remove('${pin.id}')" style="background:#ef4444; color:white; border:none; padding:4px 12px; border-radius:20px; margin-top:6px;">Remove pin</button>
                <button onclick="window.location.href='property.html?id=${pin.id}'" style="background:#2563eb; color:white; border:none; padding:4px 12px; border-radius:20px; margin-top:6px; margin-left:4px;">View</button>
            `);
            Map.markersLayer.addLayer(marker);
        });
    },

    updateUI() {
        // Update heart icons on property cards and detail page
        const pinnedIds = this.favorites.map(f => f.id);
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
        
        // Update favorites count in header maybe
    },

    setupListeners() {
        document.addEventListener('favorites:toggle', (e) => {
            this.toggle(e.detail);
        });
        document.addEventListener('favorites:add', (e) => {
            this.add(e.detail);
        });
        document.addEventListener('favorites:remove', (e) => {
            this.remove(e.detail);
        });
    },

    clearAll() {
        this.favorites = [];
        this.save();
        UI.showToast('All pins cleared', 'info');
    }
};

document.addEventListener('DOMContentLoaded', () => FavoritesEngine.init());
window.FavoritesEngine = FavoritesEngine;