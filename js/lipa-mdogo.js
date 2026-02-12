// lipa-mdogo.js – installment payment UI logic
const LipaMdogo = {
    init() {
        const lipaBtn = document.getElementById('lipa-btn');
        if (lipaBtn) {
            lipaBtn.addEventListener('click', () => {
                UI.showModal('Lipa Mdogo Mdogo', 'Pay in 4 interest-free installments. First payment today.');
            });
        }
        document.querySelectorAll('.lipa-mdogo-mini').forEach(btn => {
            btn.addEventListener('click', () => {
                UI.showToast('Installment plan selected', 'info');
            });
        });
    }
};
window.LipaMdogo = LipaMdogo;