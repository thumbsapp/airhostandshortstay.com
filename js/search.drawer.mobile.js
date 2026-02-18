// search.drawer.mobile.js – Mobile bottom sheet filters and map toggle

const MobileDrawer = {
    init() {
        if (window.innerWidth > 768) return;
        this.createMapToggle();
        this.createBottomSheet();
    },

    createMapToggle() {
        const mapContainer = document.querySelector('.search-map-container');
        if (!mapContainer) return;
        const toggle = document.createElement('button');
        toggle.className = 'map-toggle-btn';
        toggle.innerHTML = '<i class="fas fa-map"></i> Show map';
        toggle.addEventListener('click', () => {
            document.querySelector('.search-layout').classList.toggle('map-fullscreen');
            toggle.innerHTML = document.querySelector('.search-layout').classList.contains('map-fullscreen') ? '<i class="fas fa-list"></i> Show list' : '<i class="fas fa-map"></i> Show map';
        });
        document.querySelector('.search-sidebar').appendChild(toggle);
    },

    createBottomSheet() {
        const filterSidebar = document.querySelector('.search-sidebar .filters-accordion');
        if (!filterSidebar) return;
        const sheet = document.createElement('div');
        sheet.className = 'mobile-bottom-sheet';
        sheet.innerHTML = `
            <div class="sheet-handle"></div>
            <div class="sheet-content">
                <h3>Filters</h3>
                <div class="sheet-filters"></div>
                <button class="apply-filters">Show results</button>
            </div>
        `;
        // clone filters into sheet
        const filtersClone = filterSidebar.cloneNode(true);
        sheet.querySelector('.sheet-filters').appendChild(filtersClone);
        document.body.appendChild(sheet);

        // drag to open/close logic (simplified)
        let startY = 0;
        sheet.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
        });
        sheet.addEventListener('touchmove', (e) => {
            const deltaY = e.touches[0].clientY - startY;
            if (deltaY > 50) {
                sheet.classList.add('closed');
            } else if (deltaY < -50) {
                sheet.classList.remove('closed');
            }
        });

        sheet.querySelector('.apply-filters').addEventListener('click', () => {
            sheet.classList.add('closed');
            // trigger filter apply
            document.getElementById('apply-filters-btn')?.click();
        });
    }
};

window.MobileDrawer = MobileDrawer;