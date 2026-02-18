// lipa-mdogo.js – Installment payment UI logic, Lipa Mdogo engine
const LipaMdogo = {
    init() {
        const lipaBtn = document.getElementById('lipa-btn');
        if (lipaBtn) {
            lipaBtn.addEventListener('click', () => {
                this.showPlan('p1');
            });
        }
    },
    showPlan(propertyId) {
        const prop = MockData.getById(propertyId);
        if (!prop) return;
        const price = prop.price;
        const installment = Math.ceil(price / 4);
        const plan = `
            <div class="installment-plan">
                <p><strong>Lipa Mdogo Mdogo</strong> — 4 interest-free installments</p>
                <ul>
                    <li>Today: $${installment}</li>
                    <li>Week 2: $${installment}</li>
                    <li>Week 4: $${installment}</li>
                    <li>Week 6: $${installment}</li>
                </ul>
                <p>Total: $${price} (no extra fees)</p>
                <button id="confirm-lipa" class="btn-lipa">Confirm plan</button>
            </div>
        `;
        UI.showModal('Lipa Mdogo Mdogo', plan, 'medium', null, (modal) => {
            modal.querySelector('#confirm-lipa')?.addEventListener('click', () => {
                UI.showToast('✅ Lipa Mdogo plan activated! First payment due now.', 'success');
                modal.remove();
                // record in incentives
                Incentives.addOffer('Lipa Mdogo booking credit $10');
            });
        });
    },
    calculateInstallments(amount) {
        return {
            installments: 4,
            perInstallment: Math.ceil(amount / 4),
            total: amount
        };
    }
};
window.LipaMdogo = LipaMdogo;