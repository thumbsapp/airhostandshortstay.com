// services/airride.js – AirRide: airport transfers and local rides
const AirRide = {
    vehicleTypes: [
        { id: 'standard', name: 'Standard', capacity: 3, price: 25, icon: 'car' },
        { id: 'premium', name: 'Premium', capacity: 4, price: 45, icon: 'car-side' },
        { id: 'van', name: 'Van', capacity: 7, price: 65, icon: 'van-shuttle' }
    ],

    init() {
        document.addEventListener('airride:request', (e) => {
            this.showRideOptions(e.detail.propertyId);
        });
    },

    showRideOptions(propertyId) {
        let optionsHtml = '';
        this.vehicleTypes.forEach(v => {
            optionsHtml += `
                <div class="ride-option" data-type="${v.id}">
                    <i class="fas fa-${v.icon}"></i>
                    <div>
                        <strong>${v.name}</strong> · up to ${v.capacity} pax
                    </div>
                    <span class="price">$${v.price}</span>
                    <button class="btn-ride-select">Select</button>
                </div>
            `;
        });

        UI.showModal('AirRide – Transfers & Rides', `
            <div class="airride-modal">
                <p>Choose your ride for airport transfer or local travel.</p>
                <div class="ride-list">
                    ${optionsHtml}
                </div>
                <div class="bundle-option" style="margin-top:1rem;">
                    <label><input type="checkbox" id="bundle-ride-property"> Add AirRide to your stay</label>
                </div>
            </div>
        `, 'medium', null, (modal) => {
            modal.querySelectorAll('.btn-ride-select').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const option = e.target.closest('.ride-option');
                    const type = option.dataset.type;
                    const vehicle = this.vehicleTypes.find(v => v.id === type);
                    UI.showToast(`🚗 ${vehicle.name} selected – $${vehicle.price}`, 'success');
                    const bundleCheck = modal.querySelector('#bundle-ride-property');
                    if (bundleCheck) bundleCheck.checked = true;
                });
            });
        });
    }
};

window.AirRide = AirRide;