// services/airchef.js – AirChef: private chef booking service
const AirChef = {
    chefs: [
        { id: 'chef1', name: 'Chef Amina', specialty: 'Swahili cuisine', pricePerMeal: 45, rating: 4.9 },
        { id: 'chef2', name: 'Chef John', specialty: 'Grill & BBQ', pricePerMeal: 55, rating: 4.8 },
        { id: 'chef3', name: 'Chef Lucia', specialty: 'Italian', pricePerMeal: 60, rating: 5.0 }
    ],
    menuOptions: ['Breakfast', 'Lunch', 'Dinner', 'Full day'],

    init() {
        document.addEventListener('airchef:request', (e) => {
            this.showChefSelection(e.detail.propertyId);
        });
    },

    showChefSelection(propertyId) {
        let chefHtml = '';
        this.chefs.forEach(chef => {
            chefHtml += `
                <div class="chef-card" data-chef-id="${chef.id}">
                    <h4>${chef.name}</h4>
                    <p>⭐ ${chef.rating} · ${chef.specialty}</p>
                    <p class="price">$${chef.pricePerMeal}/meal</p>
                    <button class="btn-chef-select">Select</button>
                </div>
            `;
        });

        UI.showModal('AirChef – Private Chef', `
            <div class="airchef-modal">
                <p>Enhance your stay with a personal chef.</p>
                <div class="chef-grid">
                    ${chefHtml}
                </div>
                <div class="bundle-option" style="margin-top:1rem;">
                    <label><input type="checkbox" id="bundle-chef-property"> Add AirChef to your booking</label>
                </div>
            </div>
        `, 'large', null, (modal) => {
            modal.querySelectorAll('.btn-chef-select').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const chefCard = e.target.closest('.chef-card');
                    const chefId = chefCard.dataset.chefId;
                    const chef = this.chefs.find(c => c.id === chefId);
                    UI.showToast(`👨‍🍳 ${chef.name} selected!`, 'success');
                    // Add to bundle
                    const bundleCheck = modal.querySelector('#bundle-chef-property');
                    if (bundleCheck) bundleCheck.checked = true;
                });
            });
        });
    },

    calculatePrice(chefId, meals, nights) {
        const chef = this.chefs.find(c => c.id === chefId);
        if (!chef) return 0;
        return chef.pricePerMeal * meals * nights;
    }
};

window.AirChef = AirChef;