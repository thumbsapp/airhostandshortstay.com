// discovery/realtime-engine.js – Uber-style real-time discovery engine
// WebSocket simulation, live availability, instant map updates, push-ready
const RealtimeEngine = {
    ws: null,
    subscribers: [],
    pollingInterval: null,
    useWebSocket: false, // set to true if actual WS endpoint
    endpoint: 'wss://api.airhostandshortstay.com/realtime',
    mockInterval: 5000, // 5 seconds mock updates

    init() {
        console.log('⚡ RealtimeEngine initializing...');
        if (this.useWebSocket) {
            this.connectWebSocket();
        } else {
            this.startPolling();
        }
        // Listen for custom events from other engines
        document.addEventListener('realtime:subscribe', (e) => this.subscribe(e.detail));
        document.addEventListener('realtime:unsubscribe', (e) => this.unsubscribe(e.detail));
    },

    connectWebSocket() {
        try {
            this.ws = new WebSocket(this.endpoint);
            this.ws.onopen = () => {
                console.log('🔌 WebSocket connected');
                UI.showToast('✨ Live updates enabled', 'success');
            };
            this.ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                this.handleMessage(data);
            };
            this.ws.onclose = () => {
                console.log('🔌 WebSocket disconnected, retrying in 3s...');
                setTimeout(() => this.connectWebSocket(), 3000);
            };
        } catch (e) {
            console.warn('WebSocket failed, falling back to polling', e);
            this.startPolling();
        }
    },

    startPolling() {
        console.log('🔄 RealtimeEngine polling started');
        this.pollingInterval = setInterval(() => {
            this.mockUpdates();
        }, this.mockInterval);
    },

    mockUpdates() {
        // Simulate real-time availability changes, hot homes, price drops
        const randomProp = MockData.properties[Math.floor(Math.random() * MockData.properties.length)];
        const oldAvailability = randomProp.availability;
        const newAvailability = this.randomAvailability();
        if (oldAvailability !== newAvailability) {
            randomProp.availability = newAvailability;
            this.broadcast({
                type: 'availability',
                propertyId: randomProp.id,
                availability: newAvailability,
                timestamp: Date.now()
            });
        }

        // Random hot home promotion
        if (Math.random() > 0.7) {
            const hotProp = MockData.properties[Math.floor(Math.random() * MockData.properties.length)];
            if (!hotProp.hotHome) {
                hotProp.hotHome = true;
                hotProp.hotHomeExpiry = Date.now() + 3600000; // 1 hour
                this.broadcast({
                    type: 'hot-home',
                    propertyId: hotProp.id,
                    hot: true,
                    expiry: hotProp.hotHomeExpiry
                });
            }
        }

        // Random price drop
        if (Math.random() > 0.8) {
            const discountProp = MockData.properties[Math.floor(Math.random() * MockData.properties.length)];
            const discount = Math.floor(Math.random() * 15) + 5; // 5-20%
            discountProp.discount = discount;
            discountProp.price = Math.round(discountProp.price * (1 - discount/100));
            this.broadcast({
                type: 'price-drop',
                propertyId: discountProp.id,
                discount: discount,
                newPrice: discountProp.price
            });
        }
    },

    randomAvailability() {
        const states = ['green', 'yellow', 'red'];
        return states[Math.floor(Math.random() * states.length)];
    },

    handleMessage(data) {
        this.broadcast(data);
    },

    broadcast(data) {
        // Notify all subscribers
        this.subscribers.forEach(cb => cb(data));
        // Also dispatch DOM event for UI
        const event = new CustomEvent('realtime:update', { detail: data });
        document.dispatchEvent(event);

        // Specific handlers
        switch (data.type) {
            case 'availability':
                this.handleAvailabilityUpdate(data);
                break;
            case 'hot-home':
                this.handleHotHomeUpdate(data);
                break;
            case 'price-drop':
                this.handlePriceDrop(data);
                break;
        }
    },

    handleAvailabilityUpdate(data) {
        // Update map pins if on discovery/search
        if (Map.instance) {
            Map.loadPins(Filters.activeTiers, Filters.currentRadius);
        }
        // Update listing cards
        if (document.getElementById('property-list')) {
            Listings.loadSearchResults();
        }
        // Show toast for high-impact changes
        const prop = MockData.getById(data.propertyId);
        if (prop && (prop.availability === 'green' || prop.availability === 'red')) {
            UI.showToast(`⚡ ${prop.name} is now ${prop.availability === 'green' ? 'available' : 'booked'}`, 'info');
        }
    },

    handleHotHomeUpdate(data) {
        Listings.loadHotHomes();
        if (data.hot) {
            const prop = MockData.getById(data.propertyId);
            UI.showToast(`🔥 ${prop.name} is now a Hot Home!`, 'success');
        }
    },

    handlePriceDrop(data) {
        Listings.loadHotHomes();
        Listings.loadSearchResults();
        const prop = MockData.getById(data.propertyId);
        UI.showToast(`💰 Price dropped at ${prop.name} – now $${data.newPrice}`, 'success');
    },

    subscribe(callback) {
        if (typeof callback === 'function') {
            this.subscribers.push(callback);
        }
    },

    unsubscribe(callback) {
        this.subscribers = this.subscribers.filter(cb => cb !== callback);
    },

    stop() {
        if (this.pollingInterval) clearInterval(this.pollingInterval);
        if (this.ws) this.ws.close();
    }
};

// Auto-init when DOM ready
document.addEventListener('DOMContentLoaded', () => RealtimeEngine.init());

window.RealtimeEngine = RealtimeEngine;