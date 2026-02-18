// incentive.fraud.js – Anti-abuse and fraud detection UI simulation

const IncentiveFraud = {
    // check if incentive combination is allowed
    isAllowed(incentives, bookingPrice) {
        if (!incentives.length) return true;
        // max cashback percent
        const cashbackTotal = incentives.filter(i => i.type === 'cashback').reduce((sum, i) => sum + i.value, 0);
        if (cashbackTotal > FRAUD_CONFIG.MAX_CASHBACK_PERCENT) {
            return false;
        }
        // max stackable
        if (incentives.length > FRAUD_CONFIG.MAX_STACKABLE) {
            return false;
        }
        // other checks can be added
        return true;
    },

    // flag high-risk listings (visual badge)
    flagHighRisk(property) {
        if (property.incentiveScore > FRAUD_CONFIG.HIGH_RISK_SCORE_THRESHOLD) {
            return true;
        }
        // could also check number of incentives, etc.
        return false;
    },

    // add visual risk indicator to listing card
    addRiskIndicator(card, property) {
        if (this.flagHighRisk(property)) {
            const riskBadge = document.createElement('span');
            riskBadge.className = 'risk-badge';
            riskBadge.innerHTML = '⚠️ High risk (review)';
            card.querySelector('.listing-card-enhanced').appendChild(riskBadge);
        }
    },

    // simulate escrow status
    getEscrowStatus(property) {
        // placeholder: if property has incentives, show "Escrow protected"
        return property.incentives && property.incentives.length > 0 ? '✅ Escrow protected' : null;
    },

    // add escrow badge
    addEscrowBadge(card, property) {
        const status = this.getEscrowStatus(property);
        if (status) {
            const escrowBadge = document.createElement('span');
            escrowBadge.className = 'escrow-badge';
            escrowBadge.innerHTML = status;
            card.querySelector('.listing-card-enhanced').appendChild(escrowBadge);
        }
    }
};

window.IncentiveFraud = IncentiveFraud;