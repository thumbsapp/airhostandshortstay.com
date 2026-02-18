// incentive.dispute.js – Dispute center UI modal

const IncentiveDispute = {
    openDisputeModal(bookingId, propertyId) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal dispute-modal">
                <h3>🛡️ Dispute Center</h3>
                <p>Report an issue with your incentive or booking.</p>
                <form id="dispute-form">
                    <select name="issueType" required>
                        <option value="">Select issue type</option>
                        <option value="incentive_not_honored">Incentive not honored</option>
                        <option value="wrong_value">Incorrect incentive value</option>
                        <option value="expired">Incentive expired</option>
                        <option value="other">Other</option>
                    </select>
                    <textarea name="description" placeholder="Describe the issue..." rows="4" required></textarea>
                    <input type="text" name="bookingId" value="${bookingId || ''}" placeholder="Booking ID">
                    <div class="dispute-actions">
                        <button type="submit" class="btn-primary">Submit Dispute</button>
                        <button type="button" class="btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
                    </div>
                </form>
                <p class="dispute-note">All disputes are reviewed within 24 hours. Escrow funds are held until resolution.</p>
            </div>
        `;
        document.body.appendChild(modal);

        modal.querySelector('#dispute-form').addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Dispute submitted (simulated). We will contact you soon.');
            modal.remove();
        });
    },

    addDisputeButton(container, bookingId, propertyId) {
        const btn = document.createElement('button');
        btn.className = 'dispute-button';
        btn.innerHTML = '⚠️ Report issue';
        btn.addEventListener('click', () => this.openDisputeModal(bookingId, propertyId));
        container.appendChild(btn);
    }
};

window.IncentiveDispute = IncentiveDispute;