// pricing/tier-pricing.js – Tier-based dynamic pricing engine
const TierPricing = {
    multipliers: {
        silver: 1.0,
        gold: 1.2,
        diamond: 1.5
    },
    basePriceAdjustments: {
        silver: { min: 50, max: 150 },
        gold: { min: 100, max: 300 },
        diamond: { min: 200, max: 800 }
    },

    calculatePrice(basePrice, tier, options = {}) {
        let multiplier = this.multipliers[tier] || 1.0;
        let price = basePrice * multiplier;
        
        // Seasonal adjustment
        if (options.season === 'high') price *= 1.2;
        if (options.season === 'low') price *= 0.85;
        
        // Last minute discount
        if (options.daysUntilArrival !== undefined && options.daysUntilArrival < 3) {
            price *= 0.9; // 10% last minute
        }
        
        // Length of stay discount
        if (options.nights && options.nights >= 7) price *= 0.95;
        if (options.nights && options.nights >= 28) price *= 0.85;
        
        return Math.round(price);
    },

    getTierBenefits(tier) {
        const benefits = {
            silver: ['Basic amenities', 'Self check-in', 'Standard support'],
            gold: ['All Silver', 'Enhanced amenities', 'Priority support', 'Welcome gift'],
            diamond: ['All Gold', 'Premium amenities', '24/7 concierge', 'Early check-in', 'Late checkout', 'AirChef discount 20%']
        };
        return benefits[tier] || [];
    },

    getTierBadgeHTML(tier) {
        const icons = {
            silver: '🥈',
            gold: '🥇',
            diamond: '💎'
        };
        return `<span class="tier-badge ${tier}">${icons[tier] || ''} ${tier.charAt(0).toUpperCase() + tier.slice(1)}</span>`;
    },

    // For meta aggregation: display original vs tier price
    getDisplayPrice(prop) {
        if (prop.negotiated) {
            return { price: prop.negotiatedPrice, label: 'Negotiated', class: 'negotiated-price' };
        }
        if (prop.hostType === 'aggregated' && prop.metaSource) {
            return { price: prop.price, label: `via ${prop.metaSource}`, class: 'meta-price' };
        }
        return { price: prop.price, label: `${prop.tier} tier`, class: `tier-${prop.tier}` };
    }
};

window.TierPricing = TierPricing;