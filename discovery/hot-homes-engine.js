// discovery/hot-homes-engine.js – Hot Homes urgency engine
// Determines which properties are "hot" based on views, bookings, availability
const HotHomesEngine = {
    checkInterval: 30000, // 30 seconds
    intervalId: null,
    hotThresholds: {
        viewMultiplier: 0.3,
        bookingVelocity: 2, // bookings per hour
        discountThreshold: 10,
        lowAvailability: 'green'
    },

    init() {
        this.calculateHotScores();
        this.intervalId = setInterval(() => this.calculateHotScores(), this.checkInterval);
        // Listen for booking events
        document.addEventListener('booking:created', (e) => this.onBooking(e.detail));
    },

    calculateHotScores() {
        const properties = MockData.getProperties();
        properties.forEach(prop => {
            let score = 0;
            // Factor 1: Availability (green = higher chance)
            if (prop.availability === 'green') score += 30;
            else if (prop.availability === 'yellow') score += 10;
            else score -= 20;
            
            // Factor 2: Discount
            if (prop.discount) score += prop.discount * 2;
            
            // Factor 3: Tier (diamond more likely to be hot)
            if (prop.tier === 'diamond') score += 15;
            else if (prop.tier === 'gold') score += 8;
            
            // Factor 4: Recent views (simulated)
            const views = prop.recentViews || Math.floor(Math.random() * 50);
            score += views * 0.2;
            
            // Factor 5: Native host (better experience)
            if (prop.hostType === 'native') score += 10;
            
            // Determine hot status
            const wasHot = prop.hotHome;
            prop.hotHome = score > 60;
            
            // If newly hot, set expiry and notify
            if (!wasHot && prop.hotHome) {
                prop.hotHomeExpiry = Date.now() + 3600000; // 1 hour
                this.notifyHotHome(prop);
            }
            
            // Remove hot status if expired
            if (prop.hotHomeExpiry && Date.now() > prop.hotHomeExpiry) {
                prop.hotHome = false;
                delete prop.hotHomeExpiry;
            }
            
            prop.hotScore = score;
        });
        
        // Update UI
        Listings.loadHotHomes();
        this.updateHotCountdowns();
    },

    notifyHotHome(prop) {
        UI.showToast(`🔥 ${prop.name} is now a Hot Home! Limited time.`, 'success');
        // Dispatch event for analytics
        const event = new CustomEvent('hothomes:new', { detail: prop });
        document.dispatchEvent(event);
    },

    onBooking(bookingData) {
        // Increase booking velocity for the property
        const prop = MockData.getById(bookingData.propertyId);
        if (prop) {
            prop.recentBookings = (prop.recentBookings || 0) + 1;
            // Immediately recalc
            this.calculateHotScores();
        }
    },

    updateHotCountdowns() {
        const hotProps = MockData.properties.filter(p => p.hotHome);
        hotProps.forEach(prop => {
            if (prop.hotHomeExpiry) {
                const timeLeft = prop.hotHomeExpiry - Date.now();
                if (timeLeft > 0) {
                    const mins = Math.floor(timeLeft / 60000);
                    const secs = Math.floor((timeLeft % 60000) / 1000);
                    // Update UI elements with countdown
                    const countdownEl = document.getElementById(`hot-countdown-${prop.id}`);
                    if (countdownEl) {
                        countdownEl.innerText = `${mins}:${secs.toString().padStart(2,'0')}`;
                    }
                }
            }
        });
    },

    stop() {
        clearInterval(this.intervalId);
    }
};

document.addEventListener('DOMContentLoaded', () => HotHomesEngine.init());
window.HotHomesEngine = HotHomesEngine;