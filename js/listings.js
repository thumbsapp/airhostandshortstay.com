// listings.js – render listings & cards, hot-homes-engine, meta-aggregation, native-hosts
const Listings = {
    loadHotHomes() {
        const container = document.getElementById('hot-carousel');
        if (!container) return;
        container.innerHTML = '';
        const hotProps = MockData.properties.filter(p => p.hotHome === true).slice(0, 6);
        hotProps.forEach(p => {
            const card = document.createElement('div');
            card.className = 'hot-card glass-panel';
            card.innerHTML = `
                <img src="${p.img}" alt="${p.name}" loading="lazy">
                <div class="hot-info">
                    <h4>${p.name}</h4>
                    <span class="price">$${p.price}<small>/night</small></span>
                    <div class="badge-row">
                        <span class="tier-badge ${p.tier}">${p.tier}</span>
                        <span class="availability-pulse ${p.availability}"></span>
                        ${p.hostType === 'native' ? '<span class="native-badge">🏡 Native</span>' : '<span class="aggregated-badge">🏢 Aggregated</span>'}
                    </div>
                    <div class="action-row">
                        <button class="lipa-mdogo-mini" data-id="${p.id}">Lipa Mdogo</button>
                        <button class="negotiation-mini" data-id="${p.id}">Negotiate</button>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
        // attach event listeners
        container.querySelectorAll('.lipa-mdogo-mini').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                LipaMdogo.showPlan(id);
            });
        });
        container.querySelectorAll('.negotiation-mini').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                Negotiation.openForProperty(id);
            });
        });
    },
    loadFeaturedOffers() {
        const grid = document.getElementById('featured-grid');
        if (!grid) return;
        grid.innerHTML = '';
        const featured = MockData.properties.filter(p => p.discount > 10).slice(0, 3);
        featured.forEach(p => {
            const card = document.createElement('div');
            card.className = 'featured-card';
            card.innerHTML = `
                <span class="discount-badge">-${p.discount}%</span>
                <img src="${p.img}" alt="">
                <h5>${p.name}</h5>
                <span class="price">$${p.price}</span>
            `;
            grid.appendChild(card);
        });
    },
    loadSearchResults(filtered = false, filters = {}) {
        const list = document.getElementById('property-list');
        if (!list) return;
        list.innerHTML = '';
        let props = MockData.getProperties();
        if (filtered) {
            if (filters.minPrice !== undefined) props = props.filter(p => p.price >= filters.minPrice);
            if (filters.maxPrice !== undefined) props = props.filter(p => p.price <= filters.maxPrice);
            if (filters.tiers && filters.tiers.length) props = props.filter(p => filters.tiers.includes(p.tier));
            if (filters.hostType && filters.hostType !== 'any') props = props.filter(p => p.hostType === filters.hostType);
        }
        props.forEach(p => {
            const el = document.createElement('div');
            el.className = 'property-card';
            el.innerHTML = `
                <img src="${p.img}" alt="${p.name}" loading="lazy">
                <div class="property-info">
                    <h3>${p.name}</h3>
                    <div class="price-row">
                        <span class="price">$${p.price}<small>/night</small></span>
                        ${p.discount ? `<span class="discount-tag">-${p.discount}%</span>` : ''}
                    </div>
                    <div class="meta-row">
                        <span class="tier-badge ${p.tier}">${p.tier}</span>
                        <span class="availability-pulse ${p.availability}"></span>
                        <span class="host-badge ${p.hostType}">
                            ${p.hostType === 'native' ? '🏡 Native' : '🏢 ' + (p.metaSource || 'Aggregated')}
                        </span>
                        ${p.hotHome ? '<span class="hot-badge"><i class="fas fa-bolt"></i> Hot</span>' : ''}
                    </div>
                    <div class="amenity-icons">
                        ${p.amenities.slice(0,3).map(a => `<i class="fas fa-${a}"></i>`).join('')}
                        ${p.amenities.length > 3 ? `<span>+${p.amenities.length-3}</span>` : ''}
                    </div>
                    <div class="action-buttons">
                        <button class="negotiation-badge" data-id="${p.id}"><i class="fas fa-hand-holding-usd"></i> Negotiate</button>
                        <button class="installment-badge" data-id="${p.id}"><i class="fas fa-coins"></i> Lipa Mdogo</button>
                        <button class="favorite-pin" data-id="${p.id}"><i class="far fa-heart"></i> Pin</button>
                    </div>
                </div>
            `;
            list.appendChild(el);
        });
        // attach listeners
        list.querySelectorAll('.negotiation-badge').forEach(btn => {
            btn.addEventListener('click', (e) => Negotiation.openForProperty(e.currentTarget.dataset.id));
        });
        list.querySelectorAll('.installment-badge').forEach(btn => {
            btn.addEventListener('click', (e) => LipaMdogo.showPlan(e.currentTarget.dataset.id));
        });
        list.querySelectorAll('.favorite-pin').forEach(btn => {
            btn.addEventListener('click', (e) => Favorites.addPin(e.currentTarget.dataset.id));
        });
    },
    sortResults(criteria) {
        // implement sorting logic
        UI.showToast(`Sorted by: ${criteria}`, 'info');
    }
};
window.Listings = Listings;