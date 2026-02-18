// incentive.dashboard.js – Host dashboard marketing & incentives tab (simulated)

const IncentiveDashboard = {
    init() {
        // This would be called on host dashboard page
        if (!document.getElementById('host-dashboard')) return;
        this.renderIncentiveTab();
    },

    renderIncentiveTab() {
        const tabContainer = document.querySelector('.dashboard-tabs');
        if (!tabContainer) return;
        // add new tab button
        const tabButton = document.createElement('button');
        tabButton.className = 'tab-button';
        tabButton.innerText = 'Marketing & Incentives';
        tabButton.addEventListener('click', () => this.showIncentivePanel());
        tabContainer.appendChild(tabButton);

        // create panel content (initially hidden)
        const panel = document.createElement('div');
        panel.id = 'incentive-panel';
        panel.style.display = 'none';
        panel.innerHTML = `
            <div class="incentive-overview">
                <h3>Incentive Overview</h3>
                <div class="stats">
                    <div>Incentive Score: 78</div>
                    <div>Conversion Boost: +15%</div>
                    <div>Competitor Comparison: Top 10%</div>
                </div>
            </div>
            <div class="incentive-creation">
                <h3>Create New Incentive</h3>
                <form id="incentive-form">
                    <select name="type">
                        <option>Cashback</option>
                        <option>Gift Card</option>
                        <option>Free Night</option>
                    </select>
                    <input type="text" placeholder="Title" name="title">
                    <input type="number" placeholder="Value ($)" name="value">
                    <input type="date" name="startDate">
                    <input type="date" name="endDate">
                    <label><input type="checkbox" name="stackable"> Stackable</label>
                    <input type="number" placeholder="Max redemptions" name="maxRedemptions">
                    <input type="file" name="image" accept="image/*">
                    <button type="submit">Create Incentive</button>
                </form>
            </div>
            <div class="ai-suggestions">
                <h3>AI Suggestions</h3>
                <ul>
                    <li>Add "Free breakfast" to increase family bookings</li>
                    <li>Consider "Late checkout" for business travelers</li>
                </ul>
            </div>
            <div class="cost-estimator">
                <h3>Cost Estimator</h3>
                <div>Booking Price: $500</div>
                <div>Cashback: $50</div>
                <div>Platform Fee: $25</div>
                <div>Net Revenue: $425</div>
            </div>
        `;
        document.querySelector('.dashboard-content').appendChild(panel);

        // form submit simulation
        document.getElementById('incentive-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Incentive created (simulated)');
        });
    },

    showIncentivePanel() {
        document.querySelectorAll('.dashboard-panel').forEach(p => p.style.display = 'none');
        document.getElementById('incentive-panel').style.display = 'block';
    }
};

window.IncentiveDashboard = IncentiveDashboard;