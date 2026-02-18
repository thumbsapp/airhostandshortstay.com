// search.autocomplete.js – Destination autocomplete with mock data

const SearchAutocomplete = {
    destinations: ['Nairobi', 'Diani', 'Mombasa', 'Kilimani', 'Westlands', 'Karen', 'Lavington', 'Kisumu', 'Malindi', 'Watamu'],
    suggestions: [],

    init() {
        const input = document.getElementById('global-search-input') || document.getElementById('advanced-destination');
        if (!input) return;
        input.addEventListener('input', (e) => this.onInput(e));
        // create suggestion container
        const container = document.createElement('div');
        container.className = 'autocomplete-suggestions glass-panel';
        container.style.display = 'none';
        input.parentNode.appendChild(container);
        this.container = container;
    },

    onInput(e) {
        const value = e.target.value.toLowerCase();
        if (value.length < 2) {
            this.container.style.display = 'none';
            return;
        }
        this.suggestions = this.destinations.filter(d => d.toLowerCase().includes(value));
        this.renderSuggestions();
    },

    renderSuggestions() {
        if (this.suggestions.length === 0) {
            this.container.style.display = 'none';
            return;
        }
        this.container.innerHTML = this.suggestions.map(s => `<div class="suggestion-item">${s}</div>`).join('');
        this.container.style.display = 'block';
        this.container.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                const input = document.getElementById('global-search-input') || document.getElementById('advanced-destination');
                input.value = item.innerText;
                this.container.style.display = 'none';
            });
        });
    }
};

window.SearchAutocomplete = SearchAutocomplete;