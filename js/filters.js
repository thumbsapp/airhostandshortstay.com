// filters.js – price, tier, amenities, radius
const Filters = {
    currentRadius: 10,
    init() {
        document.getElementById('radius-range')?.addEventListener('change', (e) => {
            this.currentRadius = e.target.value;
            Map.updateRadius(this.currentRadius);
        });
        document.querySelectorAll('.tier-quickfilter .tier-badge').forEach(el => {
            el.addEventListener('click', function() {
                this.classList.toggle('active');
                Filters.applyTierFilter();
            });
        });
    },
    applyTierFilter() {
        const activeTiers = [];
        document.querySelectorAll('.tier-badge.active').forEach(el => {
            if (el.classList.contains('silver')) activeTiers.push('silver');
            if (el.classList.contains('gold')) activeTiers.push('gold');
            if (el.classList.contains('diamond')) activeTiers.push('diamond');
        });
        if (activeTiers.length === 0) activeTiers.push('silver','gold','diamond');
        Map.loadPins(activeTiers);
    },
    attachSearchListeners() {
        document.getElementById('apply-filters-btn')?.addEventListener('click', ()=>{
            Listings.loadSearchResults(true);
        });
    }
};
window.Filters = Filters;