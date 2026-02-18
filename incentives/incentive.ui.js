// incentive.ui.js – UI enhancements for listing cards, property page, homepage sections

const IncentiveUI = {
    init() {
        this.injectHomepageSections();
        this.enhanceListingCards();
        this.enhancePropertyPage();
        this.enhanceFilterSidebar();
    },

    // enhance all existing listing cards with incentive badges and bonus value
    enhanceListingCards() {
        document.querySelectorAll('.property-card, .hot-card').forEach(card => {
            // get property id from card (assume data-id or link)
            const link = card.querySelector('a[href*="property.html"]') || card.querySelector('.view-deal-btn');
            if (!link) return;
            const href = link.getAttribute('href');
            const id = href ? href.split('=')[1] : null;
            if (!id) return;
            const prop = MockData.getById(id);
            if (!prop) return;

            // wrap card content if not already wrapped
            if (!card.querySelector('.listing-card-enhanced')) {
                const content = card.innerHTML;
                card.innerHTML = `<div class="listing-card-enhanced">${content}</div>`;
            }

            // find price element location to insert incentive info above price
            const priceEl = card.querySelector('.price, .price-large, .full-price');
            if (priceEl && prop.incentiveScore > 0) {
                const incentiveBadge = document.createElement('div');
                incentiveBadge.className = 'incentive-badge-container';
                incentiveBadge.innerHTML = `
                    <span class="incentive-badge">🎁 Includes $${prop.estimatedBonusValue} Bonus</span>
                    ${prop.incentives.some(i => i.type === 'cashback') ? '<span class="cashback-badge">💳 Cashback</span>' : ''}
                    ${prop.incentiveScore > 75 ? '<span class="hot-incentive-badge">🔥 High Incentive Home</span>' : ''}
                `;
                priceEl.parentNode.insertBefore(incentiveBadge, priceEl);
            }

            // limit visible incentives to 3, rest as +X more
            if (prop.incentives && prop.incentives.length > 0) {
                const incentivesContainer = document.createElement('div');
                incentivesContainer.className = 'incentive-mini-list';
                let html = '';
                prop.incentives.slice(0, 3).forEach(inc => {
                    html += `<span class="incentive-mini">${inc.description || inc.type}</span>`;
                });
                if (prop.incentives.length > 3) {
                    html += `<span class="incentive-more">+${prop.incentives.length - 3} more perks</span>`;
                }
                incentivesContainer.innerHTML = html;
                // append after price or after badges
                if (priceEl) {
                    priceEl.parentNode.insertBefore(incentivesContainer, priceEl.nextSibling);
                } else {
                    card.querySelector('.listing-card-enhanced').appendChild(incentivesContainer);
                }
            }
        });
    },

    // inject incentive breakdown section on property page
    enhancePropertyPage() {
        if (!document.querySelector('.property-detail')) return;
        const amenitiesSection = document.querySelector('.amenities-list');
        if (!amenitiesSection) return;
        const propId = new URLSearchParams(window.location.search).get('id') || 'p1';
        const prop = MockData.getById(propId);
        if (!prop) return;

        const breakdownSection = document.createElement('section');
        breakdownSection.className = 'incentive-breakdown glass-panel';
        breakdownSection.innerHTML = `
            <h3>🎁 Why Guests Love This Home</h3>
            <div class="incentive-list">
                ${prop.incentives.map(inc => `
                    <div class="incentive-item">
                        <span class="incentive-icon">${this.getIcon(inc.type)}</span>
                        <span class="incentive-desc">${inc.description || inc.type}</span>
                        <span class="incentive-value">+$${inc.value}</span>
                    </div>
                `).join('')}
            </div>
            <div class="value-breakdown">
                <h4>Value Breakdown</h4>
                <div class="value-row"><span>Stay</span><span>$${prop.price * 7}</span></div>
                <div class="value-row"><span>Cashback</span><span>$${prop.estimatedBonusValue}</span></div>
                <div class="value-row"><span>Gift Value</span><span>$${prop.incentives.filter(i => i.type === 'gift_card').reduce((s, i) => s + i.value, 0)}</span></div>
                <div class="value-row"><span>Upgrade Value</span><span>$${prop.incentives.filter(i => i.type === 'upgrade').reduce((s, i) => s + i.value, 0)}</span></div>
                <div class="value-row total"><span>Total Bonus</span><span>$${prop.estimatedBonusValue}</span></div>
            </div>
        `;
        amenitiesSection.parentNode.insertBefore(breakdownSection, amenitiesSection.nextSibling);
    },

    // add incentive filters to sidebar
    enhanceFilterSidebar() {
        const filterSidebar = document.querySelector('.filters-accordion, .search-sidebar .filters-accordion');
        if (!filterSidebar) return;
        const incentiveFilterHtml = `
            <div class="filter-group incentive-filters">
                <label>🎁 Incentives & Perks</label>
                <div class="checkbox-group">
                    <label><input type="checkbox" class="incentive-filter" value="cashback"> Cashback available</label>
                    <label><input type="checkbox" class="incentive-filter" value="score80"> Incentive Score > 80</label>
                    <label><input type="checkbox" class="incentive-filter" value="gift"> Homes with Gifts</label>
                    <label><input type="checkbox" class="incentive-filter" value="occasion"> Occasion Packages</label>
                    <label><input type="checkbox" class="incentive-filter" value="business"> Business Perks</label>
                </div>
            </div>
        `;
        // insert before apply button
        const applyBtn = filterSidebar.querySelector('#apply-filters-btn, .btn-primary');
        if (applyBtn) {
            applyBtn.insertAdjacentHTML('beforebegin', incentiveFilterHtml);
        } else {
            filterSidebar.insertAdjacentHTML('beforeend', incentiveFilterHtml);
        }

        // attach event listeners to filters
        document.querySelectorAll('.incentive-filter').forEach(cb => {
            cb.addEventListener('change', () => IncentiveFilters.applyFilters());
        });
    },

    // inject homepage sections: Top Rewarding Homes, Best Cashback, etc.
    injectHomepageSections() {
        if (!document.getElementById('homepage')) return;
        const listingsPanel = document.querySelector('.listings-panel');
        if (!listingsPanel) return;

        const properties = MockData.getProperties();
        const topRewarding = IncentiveScore.getTopRewarding(properties, 6);
        const bestCashback = IncentiveScore.getBestCashback(properties, 6);
        const familyBonus = IncentiveScore.getFamilyBonus(properties, 6);
        const businessReady = IncentiveScore.getBusinessReady(properties, 6);

        const sectionsHtml = `
            <div class="incentive-sections">
                <h2>🏆 Top Rewarding Homes</h2>
                <div class="incentive-carousel">${this.renderPropertyStrip(topRewarding)}</div>
                <h2>💸 Best Cashback Homes</h2>
                <div class="incentive-carousel">${this.renderPropertyStrip(bestCashback)}</div>
                <h2>👨‍👩‍👧 Family Bonus Homes</h2>
                <div class="incentive-carousel">${this.renderPropertyStrip(familyBonus)}</div>
                <h2>💼 Business Ready Homes</h2>
                <div class="incentive-carousel">${this.renderPropertyStrip(businessReady)}</div>
            </div>
        `;
        listingsPanel.insertAdjacentHTML('afterend', sectionsHtml);
    },

    renderPropertyStrip(properties) {
        if (!properties.length) return '<p>No properties found</p>';
        return properties.map(p => `
            <div class="incentive-strip-card" onclick="window.location.href='property.html?id=${p.id}'">
                <img src="${p.img}" alt="${p.name}">
                <div class="strip-info">
                    <h4>${p.name}</h4>
                    <span class="price">$${p.price}</span>
                    <span class="incentive-score">Score: ${p.incentiveScore}</span>
                </div>
            </div>
        `).join('');
    },

    getIcon(type) {
        const icons = {
            cashback: '💵',
            gift_card: '🎁',
            free_night: '🌙',
            upgrade: '⬆️',
            welcome_drink: '🍹',
            breakfast: '🍳',
            spa_credit: '💆',
            airport_transfer: '🚗',
            late_checkout: '⏰',
            early_checkin: '⏳',
            birthday_package: '🎂',
            anniversary_package: '💑',
            corporate_rate: '🏢',
            meeting_room_credit: '📊'
        };
        return icons[type] || '🎯';
    }
};

window.IncentiveUI = IncentiveUI;