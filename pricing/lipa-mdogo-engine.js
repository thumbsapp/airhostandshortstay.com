// pricing/lipa-mdogo-engine.js – Installment payment engine, flexible plans
const LipaMdogoEngine = {
    plans: {
        '4weeks': { installments: 4, frequency: 'weekly', interest: 0, label: '4 weekly installments' },
        '8weeks': { installments: 8, frequency: 'weekly', interest: 0.05, label: '8 weekly installments (5% fee)' },
        '3months': { installments: 3, frequency: 'monthly', interest: 0, label: '3 monthly installments' },
        '6months': { installments: 6, frequency: 'monthly', interest: 0.1, label: '6 monthly installments (10% fee)' }
    },
    defaultPlan: '4weeks',

    init() {
        document.addEventListener('lipa:request', (e) => {
            this.showPlanSelector(e.detail.propertyId);
        });
    },

    calculateInstallments(propertyId, planKey = this.defaultPlan) {
        const prop = MockData.getById(propertyId);
        if (!prop) return null;
        const plan = this.plans[planKey];
        const total = prop.price * (1 + plan.interest);
        const perInstallment = total / plan.installments;
        return {
            propertyId,
            propertyName: prop.name,
            total,
            perInstallment: Math.ceil(perInstallment * 100) / 100,
            installments: plan.installments,
            frequency: plan.frequency,
            interest: plan.interest,
            planLabel: plan.label
        };
    },

    showPlanSelector(propertyId) {
        const prop = MockData.getById(propertyId);
        if (!prop) return;

        let optionsHtml = '';
        for (const [key, plan] of Object.entries(this.plans)) {
            const calc = this.calculateInstallments(propertyId, key);
            optionsHtml += `
                <div class="lipa-plan-option" data-plan="${key}">
                    <input type="radio" name="lipa-plan" id="plan-${key}" value="${key}" ${key === this.defaultPlan ? 'checked' : ''}>
                    <label for="plan-${key}">
                        <strong>${plan.label}</strong><br>
                        <span>${calc.installments} x $${calc.perInstallment}</span>
                        ${plan.interest > 0 ? `<span class="interest-badge">+${plan.interest*100}% interest</span>` : '<span class="interest-free">Interest-free</span>'}
                    </label>
                </div>
            `;
        }

        UI.showModal(`Lipa Mdogo Mdogo – ${prop.name}`, `
            <div class="lipa-modal">
                <p class="price-tag">$${prop.price}/night · Total stay $${prop.price * 7} (7 nights)</p>
                <div class="plan-selector">
                    ${optionsHtml}
                </div>
                <button id="confirm-lipa-plan" class="btn-lipa" style="width:100%; margin-top:1.5rem;">Confirm plan</button>
            </div>
        `, 'large', null, (modal) => {
            modal.querySelector('#confirm-lipa-plan').addEventListener('click', () => {
                const selected = modal.querySelector('input[name="lipa-plan"]:checked');
                if (selected) {
                    const planKey = selected.value;
                    const calc = this.calculateInstallments(propertyId, planKey);
                    UI.showToast(`✅ Lipa Mdogo plan activated: ${calc.installments} payments of $${calc.perInstallment}`, 'success');
                    // Record in incentives
                    IncentivesEngine.addReward('lipa_mdogo_first', 'First Lipa Mdogo booking – $10 credit', 10);
                    modal.remove();
                }
            });
        });
    },

    processPayment(propertyId, planKey) {
        // In production: integrate with payment gateway
        const calc = this.calculateInstallments(propertyId, planKey);
        console.log('Processing Lipa Mdogo payment:', calc);
        // Simulate success
        return { success: true, transactionId: 'lipa_' + Date.now() };
    }
};

window.LipaMdogoEngine = LipaMdogoEngine;