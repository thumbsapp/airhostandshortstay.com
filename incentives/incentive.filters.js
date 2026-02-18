// incentive.filters.js – Filter extension for incentive criteria

const IncentiveFilters = {
    activeFilters: {
        cashback: false,
        score80: false,
        gift: false,
        occasion: false,
        business: false
    },

    init() {
        // load state from checkboxes
        document.querySelectorAll('.incentive-filter').forEach(cb => {
            cb.addEventListener('change', (e) => {
                this.activeFilters[e.target.value] = e.target.checked;
            });
        });
    },

    // apply incentive filters to a list of properties (after main filters)
    apply(properties) {
        let filtered = [...properties];
        if (this.activeFilters.cashback) {
            filtered = filtered.filter(p => p.incentives && p.incentives.some(i => i.type === 'cashback'));
        }
        if (this.activeFilters.score80) {
            filtered = filtered.filter(p => p.incentiveScore > 80);
        }
        if (this.activeFilters.gift) {
            filtered = filtered.filter(p => p.incentives && p.incentives.some(i => i.type === 'gift_card'));
        }
        if (this.activeFilters.occasion) {
            const occasionTypes = ['birthday_package', 'anniversary_package'];
            filtered = filtered.filter(p => p.incentives && p.incentives.some(i => occasionTypes.includes(i.type)));
        }
        if (this.activeFilters.business) {
            const businessTypes = ['corporate_rate', 'meeting_room_credit', 'airport_transfer'];
            filtered = filtered.filter(p => p.incentives && p.incentives.some(i => businessTypes.includes(i.type)));
        }
        return filtered;
    },

    // hook into existing filter apply process
    applyFilters() {
        // This function should be called after main filters are applied.
        // We can re-run the search results rendering with the filtered list.
        // We'll assume Listings.loadSearchResults accepts a filtered list.
        if (typeof Listings !== 'undefined' && Listings.loadSearchResults) {
            // Get currently filtered properties (from main filters) – we need to access them.
            // For simplicity, we'll re-fetch all properties and apply main filters + incentive filters.
            // This may duplicate main filter logic, but we can call the main filter function again.
            // We'll use a custom event to trigger a re-render.
            document.dispatchEvent(new CustomEvent('incentive:filtersChanged'));
        }
    }
};

window.IncentiveFilters = IncentiveFilters;