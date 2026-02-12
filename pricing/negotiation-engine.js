// pricing/negotiation-engine.js – Advanced price negotiation with state, AI, counter-offers
const NegotiationEngine = {
    activeNegotiations: {},
    maxNegotiations: 5,
    responseTimeAvg: 4500, // ms

    init() {
        // Listen for UI triggers
        document.addEventListener('negotiation:request', (e) => {
            this.startNegotiation(e.detail.propertyId, e.detail.offer);
        });
    },

    startNegotiation(propertyId, initialOffer) {
        const prop = MockData.getById(propertyId);
        if (!prop) return;

        // Check if already negotiating
        if (this.activeNegotiations[propertyId]) {
            UI.showToast('You already have an active negotiation for this property', 'warning');
            return;
        }

        // Validate offer
        if (!initialOffer || initialOffer < prop.price * 0.5) {
            UI.showToast('Offer must be at least 50% of asking price', 'error');
            return;
        }
        if (initialOffer > prop.price * 1.5) {
            UI.showToast('Offer exceeds reasonable range', 'error');
            return;
        }

        // Create negotiation session
        const session = {
            id: this.generateId(),
            propertyId,
            propertyName: prop.name,
            hostType: prop.hostType,
            originalPrice: prop.price,
            currentOffer: initialOffer,
            status: 'pending',
            timestamp: Date.now(),
            messages: [],
            counterCount: 0
        };

        this.activeNegotiations[propertyId] = session;
        UI.showToast(`💰 Negotiation started for ${prop.name} with $${initialOffer}`, 'success');
        
        // Simulate host thinking
        setTimeout(() => this.hostRespond(propertyId), this.getResponseTime(prop));
    },

    hostRespond(propertyId) {
        const session = this.activeNegotiations[propertyId];
        if (!session) return;

        const prop = MockData.getById(propertyId);
        // Host acceptance logic based on tier, host type, offer
        const acceptanceProb = this.calculateAcceptanceProbability(prop, session.currentOffer);
        const random = Math.random();

        if (random < acceptanceProb) {
            this.acceptOffer(propertyId);
        } else if (session.counterCount < 2) {
            this.counterOffer(propertyId);
        } else {
            this.rejectOffer(propertyId);
        }
    },

    calculateAcceptanceProbability(prop, offer) {
        let prob = 0.5;
        // Better chance if offer is closer to original price
        const ratio = offer / prop.price;
        if (ratio >= 0.9) prob += 0.3;
        else if (ratio >= 0.8) prob += 0.15;
        else if (ratio <= 0.6) prob -= 0.2;

        // Diamond hosts are less flexible
        if (prop.tier === 'diamond') prob -= 0.1;
        if (prop.tier === 'silver') prob += 0.1;
        
        // Native hosts more flexible
        if (prop.hostType === 'native') prob += 0.15;
        else prob -= 0.1;
        
        // Random factor
        prob += (Math.random() * 0.2) - 0.1;
        
        return Math.min(Math.max(prob, 0.1), 0.95);
    },

    counterOffer(propertyId) {
        const session = this.activeNegotiations[propertyId];
        const prop = MockData.getById(propertyId);
        // Host proposes counter: average of original and current offer, with slight randomness
        const counter = Math.round((prop.price + session.currentOffer) / 2 * (0.9 + Math.random() * 0.2));
        
        session.status = 'counter';
        session.counterOffer = counter;
        session.counterCount++;
        
        // Add message
        session.messages.push({
            sender: 'host',
            message: `How about $${counter}?`,
            timestamp: Date.now()
        });

        UI.showModal('Counter offer', `
            <div class="counter-offer-modal">
                <h3>💬 Host proposes $${counter}</h3>
                <p>Original: $${prop.price} · Your offer: $${session.currentOffer}</p>
                <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                    <button onclick="NegotiationEngine.acceptCounter('${propertyId}')" class="btn-success">Accept $${counter}</button>
                    <button onclick="NegotiationEngine.rejectOffer('${propertyId}')" class="btn-danger">Decline</button>
                    <button onclick="NegotiationEngine.counterAgain('${propertyId}')" class="btn-secondary">Counter again</button>
                </div>
            </div>
        `, 'medium');
    },

    acceptCounter(propertyId) {
        const session = this.activeNegotiations[propertyId];
        if (session && session.counterOffer) {
            session.currentOffer = session.counterOffer;
            this.acceptOffer(propertyId);
        }
    },

    counterAgain(propertyId) {
        const session = this.activeNegotiations[propertyId];
        if (!session) return;
        
        UI.showPrompt('Enter your counter offer ($)', (newOffer) => {
            newOffer = parseFloat(newOffer);
            if (isNaN(newOffer) || newOffer <= 0) {
                UI.showToast('Please enter a valid amount', 'error');
                return;
            }
            session.currentOffer = newOffer;
            session.counterCount++;
            session.messages.push({
                sender: 'guest',
                message: `I offer $${newOffer}`,
                timestamp: Date.now()
            });
            UI.showToast(`Counter offer $${newOffer} sent`, 'info');
            setTimeout(() => this.hostRespond(propertyId), this.getResponseTime(MockData.getById(propertyId)));
        });
    },

    acceptOffer(propertyId) {
        const session = this.activeNegotiations[propertyId];
        if (!session) return;
        session.status = 'accepted';
        session.acceptedAt = Date.now();
        
        // Update property price temporarily (could be used for booking)
        const prop = MockData.getById(propertyId);
        prop.negotiatedPrice = session.currentOffer;
        prop.negotiated = true;
        
        UI.showModal('Offer accepted!', `
            🎉 Host accepted $${session.currentOffer}!
            You can now book at this price. This offer is valid for 24 hours.
            <button onclick="window.location.href='property.html?id=${propertyId}'" class="btn-primary" style="margin-top: 1rem;">Book now</button>
        `, 'success');
        
        delete this.activeNegotiations[propertyId];
    },

    rejectOffer(propertyId) {
        const session = this.activeNegotiations[propertyId];
        if (!session) return;
        session.status = 'rejected';
        UI.showToast(`Host declined your offer for ${session.propertyName}`, 'info');
        delete this.activeNegotiations[propertyId];
    },

    getResponseTime(prop) {
        // Faster response for native hosts, diamond hosts slower
        let base = this.responseTimeAvg;
        if (prop.hostType === 'native') base *= 0.7;
        if (prop.tier === 'diamond') base *= 1.5;
        if (prop.tier === 'silver') base *= 0.8;
        return base + (Math.random() * 2000 - 1000);
    },

    generateId() {
        return 'neg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    }
};

document.addEventListener('DOMContentLoaded', () => NegotiationEngine.init());
window.NegotiationEngine = NegotiationEngine;