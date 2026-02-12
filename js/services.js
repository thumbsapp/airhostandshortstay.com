// services.js – AirChef / AirRide / AirRelax
const Services = {
    initBundles() {
        document.getElementById('add-bundles')?.addEventListener('click', ()=>{
            let total = 0;
            if (document.getElementById('bundle-chef')?.checked) total += 45;
            if (document.getElementById('bundle-ride')?.checked) total += 25;
            if (document.getElementById('bundle-relax')?.checked) total += 60;
            UI.showToast(`Bundles added: $${total} extra`, 'success');
        });
    }
};
window.Services = Services;