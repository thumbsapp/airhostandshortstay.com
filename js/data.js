// data.js – mock + live data adapters, meta-aggregation engine, tier-pricing engine
const MockData = {
    properties: [
        { 
            id: 'p1', lat: -1.2921, lng: 36.8219, tier: 'diamond', 
            price: 220, name: 'Sunset Villa Diani', availability: 'green', 
            hostType: 'native', img: 'images/properties/villa1.jpg', 
            amenities: ['wifi', 'pool', 'kitchen', 'ac', 'parking'],
            rating: 4.98, reviews: 128, hostName: 'Maria', 
            hotHome: true, discount: 15, installmentPrice: 55,
            metaSource: null, // native
            negotiationRate: 78
        },
        { 
            id: 'p2', lat: -1.3000, lng: 36.7800, tier: 'gold', 
            price: 145, name: 'Urban Loft Westlands', availability: 'yellow', 
            hostType: 'aggregated', img: 'images/properties/loft.jpg', 
            amenities: ['wifi', 'kitchen', 'parking'],
            rating: 4.72, reviews: 89, hostName: 'UrbanStays', 
            hotHome: true, discount: 10, installmentPrice: 36,
            metaSource: 'Booking.com', // aggregated
            negotiationRate: 62
        },
        { 
            id: 'p3', lat: -1.265, lng: 36.802, tier: 'silver', 
            price: 89, name: 'Cozy Studio Kilimani', availability: 'green', 
            hostType: 'native', img: 'images/properties/studio.jpg', 
            amenities: ['wifi', 'kitchen'],
            rating: 4.85, reviews: 210, hostName: 'James',
            hotHome: false, discount: 5, installmentPrice: 22,
            metaSource: null,
            negotiationRate: 85
        },
        { 
            id: 'p4', lat: -4.0435, lng: 39.6682, tier: 'diamond', 
            price: 410, name: 'Beachfront Diani', availability: 'red', 
            hostType: 'native', img: 'images/properties/beach.jpg', 
            amenities: ['wifi', 'pool', 'kitchen', 'ac', 'parking', 'beachfront'],
            rating: 4.95, reviews: 56, hostName: 'Diani Escapes',
            hotHome: true, discount: 20, installmentPrice: 102,
            metaSource: null,
            negotiationRate: 45
        },
        // additional properties for radius matching and clustering
        { id: 'p5', lat: -1.2833, lng: 36.8167, tier: 'silver', price: 75, name: 'CBD Crashpad', availability: 'green', hostType: 'aggregated', img: 'images/properties/cbd.jpg', amenities: ['wifi'], rating: 4.2, metaSource: 'Expedia' },
        { id: 'p6', lat: -1.3100, lng: 36.7900, tier: 'gold', price: 165, name: 'Lavington Garden', availability: 'green', hostType: 'native', img: 'images/properties/lavington.jpg', amenities: ['wifi', 'pool', 'parking'], rating: 4.9 },
        { id: 'p7', lat: -4.0500, lng: 39.6700, tier: 'diamond', price: 520, name: 'Diani Reef Villa', availability: 'yellow', hostType: 'native', img: 'images/properties/reef.jpg', amenities: ['wifi', 'pool', 'beachfront'], rating: 5.0 },
        { id: 'p8', lat: -1.245, lng: 36.825, tier: 'silver', price: 68, name: 'Ngong Road Studio', availability: 'green', hostType: 'aggregated', img: 'images/properties/ngong.jpg', amenities: ['wifi'], metaSource: 'Airbnb' },
    ],
    getProperties() { return this.properties; },
    getById(id) { return this.properties.find(p => p.id === id); },
    // meta aggregation: simulate fetching from external sources
    getAggregatedProperties() {
        return this.properties.filter(p => p.hostType === 'aggregated');
    },
    getNativeProperties() {
        return this.properties.filter(p => p.hostType === 'native');
    },
    // tier-pricing engine: returns price with tier multiplier
    getTierPrice(basePrice, tier) {
        if (tier === 'diamond') return basePrice * 1.4;
        if (tier === 'gold') return basePrice * 1.2;
        return basePrice;
    }
};
window.MockData = MockData;