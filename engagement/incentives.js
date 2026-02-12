// engagement/incentives.js – Rewards, referrals, loyalty points, gamification
const IncentivesEngine = {
    user: {
        points: 0,
        tier: 'bronze',
        referrals: [],
        rewards: []
    },

    init() {
        this.loadUserData();
        this.updateUI();
        
        // Listen for booking events
        document.addEventListener('booking:confirmed', (e) => {
            this.addPoints(100, 'Booking confirmed');
        });
        document.addEventListener('lipa:completed', (e) => {
            this.addPoints(50, 'Lipa Mdogo payment');
        });
    },

    loadUserData() {
        const saved = localStorage.getItem('ahss_incentives_user');
        if (saved) {
            this.user = JSON.parse(saved);
        }
        this.calculateTier();
    },

    save() {
        localStorage.setItem('ahss_incentives_user', JSON.stringify(this.user));
        this.updateUI();
    },

    addPoints(amount, reason) {
        this.user.points += amount;
        this.user.rewards.push({
            id: 'reward_' + Date.now(),
            type: 'points',
            amount,
            reason,
            timestamp: Date.now()
        });
        this.calculateTier();
        this.save();
        UI.showToast(`🎉 +${amount} points! ${reason}`, 'success');
    },

    calculateTier() {
        if (this.user.points >= 1000) this.user.tier = 'platinum';
        else if (this.user.points >= 500) this.user.tier = 'gold';
        else if (this.user.points >= 200) this.user.tier = 'silver';
        else this.user.tier = 'bronze';
    },

    addReferral(referralCode) {
        // Simulate referral
        this.user.referrals.push({
            code: referralCode,
            date: Date.now(),
            status: 'pending'
        });
        this.addPoints(200, 'New referral signed up');
        this.save();
    },

    getDiscount() {
        switch (this.user.tier) {
            case 'platinum': return 0.15;
            case 'gold': return 0.1;
            case 'silver': return 0.05;
            default: return 0;
        }
    },

    updateUI() {
        // Update incentives badge in header
        const badge = document.querySelector('.incentives-badge');
        if (badge) {
            badge.innerHTML = `<i class="fas fa-gift"></i> ${this.user.points} pts · ${this.user.tier}`;
        }
        // Show tier in account menu
    },

    showReferralModal() {
        const referralLink = `https://airhostandshortstay.com/ref/${this.user.id || 'guest'}`;
        UI.showModal('Invite friends, earn rewards', `
            <p>Share your referral link and you both get $20 credit!</p>
            <div style="display:flex; margin:1rem 0;">
                <input type="text" readonly value="${referralLink}" style="flex:1; padding:0.5rem; border-radius:40px 0 0 40px; border:1px solid #e2e8f0;">
                <button onclick="navigator.clipboard.writeText('${referralLink}'); UI.showToast('Copied!')" style="border-radius:0 40px 40px 0; padding:0.5rem 1rem;">Copy</button>
            </div>
            <p style="font-size:0.9rem;">You have ${this.user.referrals.length} successful referrals.</p>
        `, 'medium');
    }
};

document.addEventListener('DOMContentLoaded', () => IncentivesEngine.init());
window.IncentivesEngine = IncentivesEngine;