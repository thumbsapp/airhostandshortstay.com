// wishlist.js – Wishlist system using localStorage

const Wishlist = {
    key: 'ahss_wishlist',

    init() {
        this.load();
        this.updateHearts();
        this.setupObservers();
    },

    load() {
        this.items = JSON.parse(localStorage.getItem(this.key)) || [];
    },

    save() {
        localStorage.setItem(this.key, JSON.stringify(this.items));
        this.updateHearts();
    },

    add(propertyId) {
        if (!this.items.includes(propertyId)) {
            this.items.push(propertyId);
            this.save();
            UI.showToast('❤️ Added to wishlist', 'success');
        }
    },

    remove(propertyId) {
        this.items = this.items.filter(id => id !== propertyId);
        this.save();
        UI.showToast('Removed from wishlist', 'info');
    },

    toggle(propertyId) {
        if (this.items.includes(propertyId)) {
            this.remove(propertyId);
        } else {
            this.add(propertyId);
        }
    },

    isWishlisted(propertyId) {
        return this.items.includes(propertyId);
    },

    updateHearts() {
        document.querySelectorAll('.wishlist-icon, .heart-icon, .favorite-btn').forEach(el => {
            const id = el.dataset.id || (el.closest('[data-id]')?.dataset.id);
            if (id) {
                if (this.isWishlisted(id)) {
                    el.classList.remove('far');
                    el.classList.add('fas');
                    el.style.color = '#ef4444';
                } else {
                    el.classList.remove('fas');
                    el.classList.add('far');
                    el.style.color = '';
                }
            }
        });
    },

    setupObservers() {
        // listen for new cards being added
        const observer = new MutationObserver(() => this.updateHearts());
        observer.observe(document.body, { childList: true, subtree: true });
    }
};

window.Wishlist = Wishlist;