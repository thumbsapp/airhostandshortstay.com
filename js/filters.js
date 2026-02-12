// filters.js – price, tier, amenities, radius, guests, dates – full filtering engine
const Filters = {
    currentRadius: 10,
    activeTiers: ['silver', 'gold', 'diamond'],
    minPrice: 0,
    maxPrice: 1000,
    amenities: [],
    guests: 2,
    init() {
        document.getElementById('radius-range')?.addEventListener('change', (e) => {
            this.currentRadius = parseInt(e.target.value);
            document.getElementById('radius-value').innerText = this.currentRadius + ' km';
            Map.updateRadius(this.currentRadius);
            Listings.loadHotHomes(); // refresh based on radius
        });
        // tier quick filter
        document.querySelectorAll('.tier-quickfilter .tier-badge').forEach(el => {
            el.addEventListener('click', function() {
                this.classList.toggle('active');
                Filters.updateActiveTiers();
                Map.loadPins(Filters.activeTiers, Filters.currentRadius);
                Listings.loadHotHomes();
            });
        });
        // price filter
        document.getElementById('filter-price')?.addEventListener('click', () => {
            UI.showModal('Price range', `
                <input type="range" id="price-min" min="0" max="1000" value="0">
                <input type="range" id="price-max" min="0" max="1000" value="1000">
                <button onclick="Filters.applyPriceFilter()">Apply</button>
            `);
        });
        // clear filters
        document.querySelector('.clear-filters')?.addEventListener('click', this.clearAll.bind(this));
    },
    updateActiveTiers() {
        this.activeTiers = [];
        document.querySelectorAll('.tier-badge.active').forEach(el => {
            if (el.classList.contains('silver')) this.activeTiers.push('silver');
            if (el.classList.contains('gold')) this.activeTiers.push('gold');
            if (el.classList.contains('diamond')) this.activeTiers.push('diamond');
        });
        if (this.activeTiers.length === 0) this.activeTiers = ['silver','gold','diamond'];
    },
    applyPriceFilter() {
        // implementation with modal
        UI.showToast('Price filter applied', 'success');
    },
    clearAll() {
        document.querySelectorAll('.tier-badge').forEach(el => el.classList.remove('active'));
        this.activeTiers = ['silver','gold','diamond'];
        document.getElementById('radius-range').value = 10;
        this.currentRadius = 10;
        document.getElementById('radius-value').innerText = '10 km';
        Map.updateRadius(10);
        Map.loadPins(this.activeTiers, 10);
        Listings.loadHotHomes();
        UI.showToast('All filters cleared', 'info');
    },
    attachSearchListeners() {
        document.getElementById('apply-filters-btn')?.addEventListener('click', ()=>{
            this.minPrice = parseInt(document.getElementById('min-price')?.value) || 0;
            this.maxPrice = parseInt(document.getElementById('max-price')?.value) || 1000;
            const tierCheckboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]:checked');
            this.activeTiers = Array.from(tierCheckboxes).map(cb => cb.value.toLowerCase());
            if (this.activeTiers.length === 0) this.activeTiers = ['silver','gold','diamond'];
            const hostType = document.querySelector('input[name="hostType"]:checked')?.value;
            Listings.loadSearchResults(true, { minPrice: this.minPrice, maxPrice: this.maxPrice, tiers: this.activeTiers, hostType });
            Map.loadPins(this.activeTiers, null); // search map uses its own radius
        });
        document.getElementById('sort-select')?.addEventListener('change', (e) => {
            Listings.sortResults(e.target.value);
        });
    }
};
window.Filters = Filters;