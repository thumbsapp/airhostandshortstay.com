// data.js – mock + live adapters
const MockData = {
    properties: [
        { id: 'p1', lat: -1.2921, lng: 36.8219, tier: 'diamond', price: 220, name: 'Sunset Villa Diani', availability: 'green', hostType: 'native', img: 'images/properties/villa1.jpg' },
        { id: 'p2', lat: -1.3000, lng: 36.7800, tier: 'gold', price: 145, name: 'Urban Loft Westlands', availability: 'yellow', hostType: 'aggregated', img: 'images/properties/loft.jpg' },
        { id: 'p3', lat: -1.265, lng: 36.802, tier: 'silver', price: 89, name: 'Cozy Studio Kilimani', availability: 'green', hostType: 'native', img: 'images/properties/studio.jpg' },
        { id: 'p4', lat: -4.0435, lng: 39.6682, tier: 'diamond', price: 410, name: 'Beachfront Diani', availability: 'red', hostType: 'native', img: 'images/properties/beach.jpg' }
    ],
    getProperties() { return this.properties; },
    getById(id) { return this.properties.find(p => p.id === id); }
};
window.MockData = MockData;