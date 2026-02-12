// listings/meta-aggregation.js – Meta aggregation engine for external listings
const MetaAggregation = {
    sources: {
        booking: { name: 'Booking.com', icon: '🏢', commission: 0.15 },
        expedia: { name: 'Expedia', icon: '🏨', commission: 0.18 },
        airbnb: { name: 'Airbnb', icon: '🏠', commission: 0.14 },
        vrbo: { name: 'Vrbo', icon: '🏖️', commission: 0.12 }
    },

    init() {
        // Enrich aggregated properties with source data
        MockData.properties.forEach(prop => {
            if (prop.hostType === 'aggregated' && prop.metaSource) {
                const sourceKey = prop.metaSource.toLowerCase().replace('.', '');
                prop.sourceInfo = this.sources[sourceKey] || { name: prop.metaSource, icon: '🏢', commission: 0.15 };
            }
        });
    },

    fetchExternalListings(bounds) {
        // Simulate API call to external sources
        return new Promise((resolve) => {
            setTimeout(() => {
                const externalProps = [
                    {
                        id: 'ext1', lat: -1.295, lng: 36.825, tier: 'silver',
                        price: 95, name: 'CBD Executive Apartment', availability: 'green',
                        hostType: 'aggregated', img: 'images/properties/ext1.jpg',
                        amenities: ['wifi', 'kitchen', 'ac'], rating: 4.5,
                        metaSource: 'Booking.com', sourceUrl: 'https://booking.com/hotel/123',
                        bedrooms: 2, bathrooms: 1
                    },
                    {
                        id: 'ext2', lat: -1.315, lng: 36.785, tier: 'gold',
                        price: 180, name: 'Luxury Penthouse', availability: 'yellow',
                        hostType: 'aggregated', img: 'images/properties/ext2.jpg',
                        amenities: ['wifi', 'pool', 'gym'], rating: 4.9,
                        metaSource: 'Airbnb', sourceUrl: 'https://airbnb.com/rooms/456',
                        bedrooms: 3, bathrooms: 2
                    }
                ];
                resolve(externalProps);
            }, 500);
        });
    },

    getBadgeHTML(prop) {
        if (prop.hostType === 'native') {
            return '<span class="native-badge"><i class="fas fa-check-circle"></i> Native host</span>';
        } else {
            const source = prop.sourceInfo || { name: 'Aggregated', icon: '🏢' };
            return `<span class="aggregated-badge">${source.icon} ${source.name}</span>`;
        }
    },

    trackClickout(prop) {
        // Analytics for external links
        console.log(`Clickout to ${prop.metaSource} for ${prop.name}`);
        // In production: send to analytics
        if (prop.sourceUrl) {
            window.open(prop.sourceUrl, '_blank');
        }
    }
};

window.MetaAggregation = MetaAggregation;