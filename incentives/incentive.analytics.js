// incentive.analytics.js – Track incentive views, clicks, conversions (simulated)

const IncentiveAnalytics = {
    events: [],

    track(eventName, data) {
        const event = {
            event: eventName,
            timestamp: Date.now(),
            data: data,
            userId: localStorage.getItem('ahss_user_id') || 'guest'
        };
        this.events.push(event);
        console.log('📊 Incentive Analytics:', event);
        // In production, send to server
        localStorage.setItem('ahss_analytics', JSON.stringify(this.events.slice(-50)));
    },

    trackImpression(propertyId, incentiveType) {
        this.track('incentive_impression', { propertyId, incentiveType });
    },

    trackClick(propertyId, incentiveType) {
        this.track('incentive_click', { propertyId, incentiveType });
    },

    trackConversion(bookingId, incentiveIds) {
        this.track('incentive_conversion', { bookingId, incentiveIds });
    },

    getTopIncentives(limit = 5) {
        // simulated top incentives
        return [
            { type: 'cashback', count: 120 },
            { type: 'gift_card', count: 85 },
            { type: 'free_night', count: 42 }
        ];
    }
};

window.IncentiveAnalytics = IncentiveAnalytics;