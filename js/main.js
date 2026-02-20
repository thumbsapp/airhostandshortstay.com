// main.js – module entry point, imports all original scripts in order

// ===== js/ files (same folder) =====
import './app.js';
import './data.js';
import './geolocation.js';
import './map.js';
import './filters.js';
import './realtime.js';
import './listings.js';
import './negotiation.js';
import './lipa-mdogo.js';
import './favorites.js';
import './services.js';
import './ui.js';

// ===== discovery/ =====
import '../discovery/realtime-engine.js';
import '../discovery/radius-matching.js';
import '../discovery/hot-homes-engine.js';

// ===== pricing/ =====
import '../pricing/negotiation-engine.js';
import '../pricing/lipa-mdogo-engine.js';
import '../pricing/tier-pricing.js';

// ===== listings/ =====
import '../listings/meta-aggregation.js';
import '../listings/native-hosts.js';
import '../listings/availability-engine.js';

// ===== services/ =====
import '../services/airchef.js';
import '../services/airride.js';
import '../services/airrelax.js';

// ===== engagement/ =====
import '../engagement/alerts.js';
import '../engagement/incentives.js';
import '../engagement/favorites.js';

// ===== incentives/ =====
import '../incentives/incentive.config.js';
import '../incentives/incentive.engine.js';
import '../incentives/incentive.score.js';
import '../incentives/incentive.ui.js';
import '../incentives/incentive.filters.js';
import '../incentives/incentive.fraud.js';
import '../incentives/incentive.dashboard.js';
import '../incentives/incentive.dispute.js';
import '../incentives/incentive.analytics.js';

// ===== root-level scripts =====
import '../search.advanced.js';
import '../search.autocomplete.js';
import '../search.drawer.mobile.js';
import '../wishlist.js';

// ===== original inline initialization =====
function runInit() {
    // Ensure all globals are attached (they are, via window assignments in imported scripts)
    App.initHomepage();
    // Initialize new modules
    if (typeof IncentiveEngine !== 'undefined') IncentiveEngine.enhanceAllListings(MockData.properties);
    if (typeof IncentiveUI !== 'undefined') IncentiveUI.init();
    if (typeof IncentiveFilters !== 'undefined') IncentiveFilters.init();
    if (typeof AdvancedSearch !== 'undefined') AdvancedSearch.init();
    if (typeof SearchAutocomplete !== 'undefined') SearchAutocomplete.init();
    if (typeof MobileDrawer !== 'undefined') MobileDrawer.init();
    if (typeof Wishlist !== 'undefined') Wishlist.init();
}

// Execute after DOM is ready (preserves original timing)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runInit);
} else {
    runInit();
}
