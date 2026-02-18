// search.advanced.js – Advanced search UI with sticky bar, date picker, guests

const AdvancedSearch = {
    init() {
        this.injectStickySearchBar();
        this.initAutocomplete();
        this.initDatePicker();
        this.initGuestsSelector();
    },

    injectStickySearchBar() {
        const navbar = document.querySelector('.main-nav');
        if (!navbar) return;
        const searchBar = document.createElement('div');
        searchBar.className = 'sticky-search-bar glass-panel';
        searchBar.innerHTML = `
            <div class="search-fields">
                <div class="destination-field">
                    <i class="fas fa-search"></i>
                    <input type="text" id="advanced-destination" placeholder="Where to?" value="Nairobi">
                </div>
                <div class="date-field" id="advanced-date-range">
                    <i class="fas fa-calendar"></i>
                    <span>Mar 2 – Mar 9</span>
                </div>
                <div class="guests-field" id="advanced-guests">
                    <i class="fas fa-user"></i>
                    <span>2 guests</span>
                </div>
                <button class="search-advanced-btn"><i class="fas fa-arrow-right"></i></button>
            </div>
            <div class="flexible-dates">
                <label><input type="checkbox" id="flexible-dates"> I'm flexible</label>
            </div>
        `;
        navbar.parentNode.insertBefore(searchBar, navbar.nextSibling);
    },

    initAutocomplete() {
        // simple simulation: attach to destination input
        const destInput = document.getElementById('advanced-destination');
        if (!destInput) return;
        destInput.addEventListener('input', (e) => {
            // In real implementation, would show dropdown
            console.log('Autocomplete:', e.target.value);
        });
    },

    initDatePicker() {
        const dateField = document.getElementById('advanced-date-range');
        if (!dateField) return;
        dateField.addEventListener('click', () => {
            alert('Date picker would open here (simulated)');
        });
    },

    initGuestsSelector() {
        const guestsField = document.getElementById('advanced-guests');
        if (!guestsField) return;
        guestsField.addEventListener('click', () => {
            // simple popup
            const guestSelector = document.createElement('div');
            guestSelector.className = 'guest-selector-popup glass-panel';
            guestSelector.innerHTML = `
                <div>Adults <input type="number" value="2" min="1" max="10"></div>
                <div>Children <input type="number" value="0" min="0" max="10"></div>
                <div>Infants <input type="number" value="0" min="0" max="5"></div>
                <button class="apply-guests">Apply</button>
            `;
            guestsField.appendChild(guestSelector);
            guestSelector.querySelector('.apply-guests').addEventListener('click', () => {
                guestsField.querySelector('span').innerText = '2 guests'; // simplified
                guestSelector.remove();
            });
        });
    }
};

window.AdvancedSearch = AdvancedSearch;