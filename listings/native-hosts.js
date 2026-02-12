// listings/native-hosts.js – Native host verification and benefits
const NativeHosts = {
    verifiedHosts: ['Maria', 'James', 'Diani Escapes'],
    verificationBadge: '✅ Verified native host',

    init() {
        // Mark native hosts as verified
        MockData.properties.forEach(prop => {
            if (prop.hostType === 'native') {
                prop.hostVerified = this.verifiedHosts.includes(prop.hostName);
                prop.hostBadge = prop.hostVerified ? this.verificationBadge : '🏡 Native host';
            }
        });
    },

    getHostBadge(prop) {
        if (prop.hostType !== 'native') return null;
        if (prop.hostVerified) {
            return `<span class="verified-badge"><i class="fas fa-check-circle"></i> Verified native host</span>`;
        }
        return `<span class="native-badge">🏡 Native host</span>`;
    },

    getNativeBenefits() {
        return [
            'Direct booking, no middleman fees',
            'Local expertise & personalized service',
            'Support local entrepreneurs',
            'Often more flexible cancellation'
        ];
    },

    // Encourage native hosts
    promoteNativeFilter() {
        UI.showToast('✨ Filter by Native hosts to support local and save fees', 'info');
    }
};

window.NativeHosts = NativeHosts;