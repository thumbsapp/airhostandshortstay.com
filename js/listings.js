// listings.js – Tripping/HomeToGo style card rendering, wishlist, meta-aggregation, native-hosts
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
                        <button class="lipa-mdogo-mini" data-id="${p.id}"><i class="fas fa-coins"></i> Lipa Mdogo</button>
                        <button class="negotiation-mini" data-id="${p.id}"><i class="fas fa-hand-holding-usd"></i> Negotiate</button>
                        <i class="far fa-heart wishlist-icon" data-id="${p.id}" style="margin-left: auto;"></i>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
        // attach listeners
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
        container.querySelectorAll('.wishlist-icon').forEach(icon => {
            icon.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                Favorites.addPin(id);
                e.currentTarget.classList.remove('far');
                e.currentTarget.classList.add('fas');
                e.currentTarget.style.color = '#ef4444';
            });
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
        // Tripping.com style sorting / display
        props.forEach(p => {
            const el = document.createElement('div');
            el.className = 'property-card';
            el.innerHTML = `
                <img src="${p.img}" alt="${p.name}" loading="lazy">
                <div class="property-info">
                    <div style="display: flex; justify-content: space-between;">
                        <h3>${p.name}</h3>
                        <i class="far fa-heart wishlist-icon" data-id="${p.id}" style="font-size:1.2rem;"></i>
                    </div>
                    <div class="property-meta">
                        <span><i class="fas fa-star" style="color: #fbbf24;"></i> ${p.rating || 4.8}</span>
                        <span>· ${p.reviews || 100}+ reviews</span>
                        <span>· ${p.bedrooms || 2} BD</span>
                        <span>· ${p.bathrooms || 2} BA</span>
                    </div>
                    <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; margin: 0.4rem 0;">
                        <span class="tier-badge ${p.tier}">${p.tier}</span>
                        <span class="availability-pulse ${p.availability}"></span>
                        <span class="${p.hostType === 'native' ? 'native-badge' : 'aggregated-badge'} host-badge">
                            ${p.hostType === 'native' ? '🏡 Native host' : '🏢 ' + (p.metaSource || 'Aggregated')}
                        </span>
                        ${p.hotHome ? '<span class="hot-badge"><i class="fas fa-bolt"></i> Hot</span>' : ''}
                    </div>
                    <div class="amenity-icons" style="display: flex; gap: 0.3rem; font-size: 0.7rem; color: #64748b;">
                        ${p.amenities ? p.amenities.slice(0,3).map(a => `<i class="fas fa-${a}"></i>`).join('') : ''}
                        ${p.amenities && p.amenities.length > 3 ? `<span>+${p.amenities.length-3}</span>` : ''}
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.5rem;">
                        <div>
                            <span class="price-large">$${p.price}</span> <span style="color: #64748b;">/night</span>
                        </div>
                        <div style="display: flex; gap: 0.4rem;">
                            <span class="installment-badge-sm"><i class="fas fa-coins"></i> Lipa Mdogo</span>
                            <span class="negotiation-badge-sm"><i class="fas fa-hand-holding-usd"></i> Negotiate</span>
                        </div>
                    </div>
                    <button class="view-deal-btn" data-id="${p.id}">View deal <i class="fas fa-arrow-right"></i></button>
                </div>
            `;
            list.appendChild(el);
        });

        // attach listeners
        list.querySelectorAll('.view-deal-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                window.location.href = `property.html?id=${id}`;
            });
        });
        list.querySelectorAll('.wishlist-icon').forEach(icon => {
            icon.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = e.currentTarget.dataset.id;
                Favorites.addPin(id);
                e.currentTarget.classList.remove('far');
                e.currentTarget.classList.add('fas');
                e.currentTarget.style.color = '#ef4444';
            });
        });
        list.querySelectorAll('.installment-badge-sm').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const card = e.currentTarget.closest('.property-card');
                const id = card.querySelector('.view-deal-btn')?.dataset.id;
                if (id) LipaMdogo.showPlan(id);
            });
        });
        list.querySelectorAll('.negotiation-badge-sm').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const card = e.currentTarget.closest('.property-card');
                const id = card.querySelector('.view-deal-btn')?.dataset.id;
                if (id) Negotiation.openForProperty(id);
            });
        });

        // update result count
        const countEl = document.getElementById('result-count');
        if (countEl) countEl.innerText = `${props.length} vacation rentals`;
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

    sortResults(criteria) {
        UI.showToast(`Sorted by: ${criteria}`, 'info');
        // re-render with sorting
        this.loadSearchResults(true, Filters.lastAppliedFilters);
    }
};
window.Listings = Listings;