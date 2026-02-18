// incentive.engine.js – Core engine to compute scores and attach to listings
import { INCENTIVE_WEIGHTS, FRAUD_CONFIG } from './incentive.config.js';

const IncentiveEngine = {
    // compute incentive score (0-100) for a listing based on its incentives array
    computeScore(incentives = []) {
        if (!incentives.length) return 0;
        let totalScore = 0;
        const categorySums = {};
        // initialize category sums
        Object.keys(INCENTIVE_WEIGHTS).forEach(cat => categorySums[cat] = 0);
        // sum values per category
        incentives.forEach(inc => {
            const cat = inc.category;
            if (categorySums.hasOwnProperty(cat)) {
                categorySums[cat] += inc.value || 0;
            }
        });
        // weighted sum, normalized to 100
        let weighted = 0;
        Object.keys(categorySums).forEach(cat => {
            weighted += categorySums[cat] * INCENTIVE_WEIGHTS[cat];
        });
        // simple normalization: assume max possible sum is 500 (example), cap at 100
        totalScore = Math.min(100, weighted / 5);
        return Math.round(totalScore);
    },

    // compute total estimated bonus value in dollars
    computeTotalBonusValue(incentives = [], basePrice = 0) {
        if (!incentives.length) return 0;
        let total = 0;
        incentives.forEach(inc => {
            if (inc.type === 'cashback') {
                total += basePrice * (inc.value / 100);
            } else {
                total += inc.value || 0;
            }
        });
        return Math.round(total * 100) / 100;
    },

    // attach incentive data to listing object (non-destructive)
    enhanceListing(listing) {
        if (!listing.incentives) listing.incentives = [];
        listing.incentiveScore = this.computeScore(listing.incentives);
        listing.estimatedBonusValue = this.computeTotalBonusValue(listing.incentives, listing.price);
        listing.verifiedIncentive = listing.incentives.length > 0; // placeholder, could be based on host verification
        return listing;
    },

    // enhance all listings
    enhanceAllListings(properties) {
        properties.forEach(prop => this.enhanceListing(prop));
        return properties;
    }
};

window.IncentiveEngine = IncentiveEngine;