// favorites.js – Pins (max 5)
const Favorites = {
    MAX_PINS: 5,
    initPins() {
        const favBtn = document.getElementById('favorite-btn');
        if (favBtn) {
            favBtn.addEventListener('click', () => {
                let pins = JSON.parse(localStorage.getItem('ahss_pins') || '[]');
                if (pins.length >= this.MAX_PINS) {
                    UI.showToast('You can only pin up to 5 properties', 'warning');
                    return;
                }
                pins.push({ id: 'p1', name: 'Sunset Villa' });
                localStorage.setItem('ahss_pins', JSON.stringify(pins));
                UI.showToast('Pinned! (max 5)', 'success');
            });
        }
    }
};
window.Favorites = Favorites;