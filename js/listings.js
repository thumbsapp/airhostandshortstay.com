// listings.js – render property cards, carousel
const Listings = {
    loadHotHomes() {
        const container = document.getElementById('hot-carousel');
        if (!container) return;
        container.innerHTML = '';
        MockData.properties.slice(0,4).forEach(p => {
            const card = document.createElement('div');
            card.className = 'hot-card';
            card.innerHTML = `<img src="${p.img}" alt=""><div class="hot-info"><h4>${p.name}</h4><span class="price">$${p.price}</span><span class="availability-pulse ${p.availability}"></span><button class="lipa-mdogo-mini">Lipa Mdogo</button></div>`;
            container.appendChild(card);
        });
        // countdown timer
        let time = 15*60 + 32; // 15:32
        setInterval(() => {
            if (time <= 0) time = 15*60;
            time--;
            const mins = Math.floor(time/60);
            const secs = time%60;
            document.getElementById('hot-countdown').innerText = `${mins}:${secs.toString().padStart(2,'0')}`;
        }, 1000);
    },
    loadSearchResults(filtered = false) {
        const list = document.getElementById('property-list');
        if (!list) return;
        list.innerHTML = '';
        MockData.getProperties().forEach(p => {
            const el = document.createElement('div');
            el.className = 'property-card';
            el.innerHTML = `<img src="${p.img}" alt=""><div class="property-info"><h3>${p.name}</h3><span class="price">$${p.price}/night</span><div><span class="tier-badge ${p.tier}">${p.tier}</span><span class="availability-pulse ${p.availability}"></span></div><span class="host-type-badge">${p.hostType === 'native' ? '🏡 Native' : '🏢 Aggregated'}</span><div><button class="negotiation-badge">Negotiate</button><button class="installment-badge">Lipa Mdogo</button></div></div>`;
            list.appendChild(el);
        });
    }
};
window.Listings = Listings;