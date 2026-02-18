// incentive.score.js – Detailed score breakdown and ranking utilities
const IncentiveScore = {
    // get score breakdown by category
    getBreakdown(incentives = []) {
        const breakdown = {};
        Object.keys(INCENTIVE_CATEGORIES).forEach(key => {
            const cat = INCENTIVE_CATEGORIES[key];
            breakdown[cat] = { total: 0, count: 0, items: [] };
        });
        incentives.forEach(inc => {
            if (breakdown[inc.category]) {
                breakdown[inc.category].total += inc.value || 0;
                breakdown[inc.category].count++;
                breakdown[inc.category].items.push(inc);
            }
        });
        return breakdown;
    },

    // get top rewarding properties based on score
    getTopRewarding(properties, limit = 10) {
        return [...properties]
            .filter(p => p.incentiveScore > 0)
            .sort((a, b) => b.incentiveScore - a.incentiveScore)
            .slice(0, limit);
    },

    // get best cashback properties
    getBestCashback(properties, limit = 10) {
        return [...properties]
            .filter(p => p.incentives && p.incentives.some(i => i.type === 'cashback'))
            .sort((a, b) => {
                const aCashback = a.incentives.filter(i => i.type === 'cashback').reduce((s, i) => s + i.value, 0);
                const bCashback = b.incentives.filter(i => i.type === 'cashback').reduce((s, i) => s + i.value, 0);
                return bCashback - aCashback;
            })
            .slice(0, limit);
    },

    // get family bonus homes (incentives related to family: extra bed, breakfast, etc.)
    getFamilyBonus(properties, limit = 10) {
        const familyTypes = ['breakfast', 'extra_bed', 'kids_activities'];
        return [...properties]
            .filter(p => p.incentives && p.incentives.some(i => familyTypes.includes(i.type)))
            .slice(0, limit);
    },

    // get business ready homes
    getBusinessReady(properties, limit = 10) {
        const businessTypes = ['corporate_rate', 'meeting_room_credit', 'airport_transfer'];
        return [...properties]
            .filter(p => p.incentives && p.incentives.some(i => businessTypes.includes(i.type)))
            .slice(0, limit);
    }
};

window.IncentiveScore = IncentiveScore;