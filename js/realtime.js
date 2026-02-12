// realtime.js – live updates (polling / WS-ready)
const Realtime = {
    interval: null,
    startPolling() {
        this.interval = setInterval(() => {
            // simulate availability changes
            const randomIdx = Math.floor(Math.random() * MockData.properties.length);
            const prop = MockData.properties[randomIdx];
            const states = ['green','yellow','red'];
            prop.availability = states[Math.floor(Math.random() * states.length)];
            // update UI if needed
            UI.showToast('Availability updated for ' + prop.name, 'info');
        }, 15000); // every 15s
    },
    stopPolling() {
        clearInterval(this.interval);
    }
};
window.Realtime = Realtime;