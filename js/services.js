// services.js – AirChef / AirRide / AirRelax – lifestyle bundling engine
const Services = {
    bundles: {
        chef: { name: 'AirChef', price: 45, discount: 10, icon: 'utensils' },
        ride: { name: 'AirRide', price: 25, discount: 5, icon: 'car-side' },
        relax: { name: 'AirRelax', price: 60, discount: 15, icon: 'spa' }
    },
    initBundles() {
        document.getElementById('add-bundles')?.addEventListener('click', ()=>{
            let total = 0;
            let bundleList = [];
            if (document.getElementById('bundle-chef')?.checked) {
                total += this.bundles.chef.price;
                bundleList.push(this.bundles.chef.name);
            }
            if (document.getElementById('bundle-ride')?.checked) {
                total += this.bundles.ride.price;
                bundleList.push(this.bundles.ride.name);
            }
            if (document.getElementById('bundle-relax')?.checked) {
                total += this.bundles.relax.price;
                bundleList.push(this.bundles.relax.name);
            }
            const discount = bundleList.length * 5; // simple discount
            const finalTotal = total - discount;
            const bundleDiv = document.getElementById('bundle-total');
            if (bundleDiv) {
                bundleDiv.innerHTML = `<strong>Bundle total:</strong> $${finalTotal} (you saved $${discount})`;
            }
            UI.showToast(`Bundles added: ${bundleList.join(', ')} — $${finalTotal}`, 'success');
        });
    },
    // for search results or other pages
    getBundlePrice(serviceId) {
        return this.bundles[serviceId]?.price || 0;
    }
};
window.Services = Services;