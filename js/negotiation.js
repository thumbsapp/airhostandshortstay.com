// negotiation.js – Price negotiation logic, engine with state
const Negotiation = {
    activeNegotiations: {},
    init() {
        const sendBtn = document.getElementById('send-offer');
        if (sendBtn) {
            sendBtn.addEventListener('click', () => {
                const offer = parseFloat(document.getElementById('offer-amount').value);
                const propId = 'p1'; // hardcoded for property page
                this.sendOffer(propId, offer);
            });
        }
    },
    sendOffer(propertyId, amount) {
        if (!amount || amount <= 0) {
            UI.showToast('Please enter a valid amount', 'error');
            return;
        }
        const prop = MockData.getById(propertyId);
        if (!prop) return;
        // store negotiation
        this.activeNegotiations[propertyId] = {
            offer: amount,
            status: 'pending',
            timestamp: Date.now()
        };
        UI.showToast(`💰 Offer $${amount} sent to host!`, 'success');
        // simulate host response after 3-5 sec
        setTimeout(() => {
            const accept = Math.random() > 0.3; // 70% accept
            if (accept) {
                this.acceptOffer(propertyId, amount);
            } else {
                this.counterOffer(propertyId, amount);
            }
        }, 3000 + Math.random() * 2000);
    },
    acceptOffer(propertyId, amount) {
        this.activeNegotiations[propertyId].status = 'accepted';
        UI.showModal('Offer accepted!', `🎉 Host accepted $${amount}. You can now book at this price.`, 'success');
        // update UI on property page
        const feedback = document.getElementById('negotiation-feedback');
        if (feedback) {
            feedback.innerHTML = `<span style="color:#059669;">✅ Host accepted $${amount}! Book now.</span>`;
        }
    },
    counterOffer(propertyId, originalAmount) {
        const prop = MockData.getById(propertyId);
        const counter = Math.round((prop.price + originalAmount) / 2);
        this.activeNegotiations[propertyId] = {
            offer: counter,
            status: 'counter',
            timestamp: Date.now()
        };
        UI.showModal('Counter offer', `💬 Host proposes $${counter}. Do you accept?`, 'info', [
            { text: 'Accept', handler: () => this.acceptOffer(propertyId, counter) },
            { text: 'Reject', handler: () => UI.showToast('Offer declined', 'warning') },
            { text: 'Negotiate more', handler: () => this.openForProperty(propertyId) }
        ]);
    },
    openForProperty(propertyId) {
        const prop = MockData.getById(propertyId);
        if (!prop) return;
        const modalContent = `
            <h3>Negotiate price for ${prop.name}</h3>
            <p>Current price: $${prop.price}/night</p>
            <input type="number" id="negotiate-amount" placeholder="Your offer" min="10" max="${prop.price}">
            <button id="negotiate-submit">Send offer</button>
        `;
        UI.showModal('Negotiate', modalContent, 'large', null, (modal) => {
            modal.querySelector('#negotiate-submit').addEventListener('click', () => {
                const offer = parseFloat(modal.querySelector('#negotiate-amount').value);
                this.sendOffer(propertyId, offer);
                modal.remove();
            });
        });
    }
};
window.Negotiation = Negotiation;