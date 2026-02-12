// negotiation.js – price negotiation logic
const Negotiation = {
    init() {
        const sendBtn = document.getElementById('send-offer');
        if (sendBtn) {
            sendBtn.addEventListener('click', (e) => {
                const offer = document.getElementById('offer-amount').value;
                if (offer > 0) {
                    UI.showToast(`Offer $${offer} sent! Host will reply soon.`, 'success');
                    // mock accept after 3 sec
                    setTimeout(() => {
                        UI.showModal('Offer accepted!', `Host accepted $${offer}. Proceed to book.`);
                    }, 3000);
                }
            });
        }
    }
};
window.Negotiation = Negotiation;