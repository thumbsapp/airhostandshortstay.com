// engagement/alerts.js – In-app alerts, push notifications, price drop alerts
const AlertsEngine = {
    alerts: [],
    maxAlerts: 10,

    init() {
        // Load saved alerts from localStorage
        const saved = localStorage.getItem('ahss_alerts');
        if (saved) {
            this.alerts = JSON.parse(saved);
        }
        this.renderAlertsPanel();
        
        // Listen for real-time events
        document.addEventListener('realtime:update', (e) => {
            this.handleRealtimeEvent(e.detail);
        });
    },

    addAlert(alert) {
        const newAlert = {
            id: 'alert_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            timestamp: Date.now(),
            read: false,
            ...alert
        };
        this.alerts.unshift(newAlert);
        if (this.alerts.length > this.maxAlerts) {
            this.alerts.pop();
        }
        this.save();
        this.renderAlertsPanel();
        this.showNotification(newAlert);
    },

    showNotification(alert) {
        // Show toast or push
        UI.showToast(alert.message, alert.type || 'info');
        
        // Browser notification if permission granted
        if (Notification.permission === 'granted') {
            new Notification('AirHostandShortStay', {
                body: alert.message,
                icon: '/icons/app/icon-192.png'
            });
        }
    },

    handleRealtimeEvent(data) {
        switch (data.type) {
            case 'price-drop':
                this.addAlert({
                    message: `💰 Price dropped at ${MockData.getById(data.propertyId)?.name} – now $${data.newPrice}`,
                    type: 'success',
                    link: `property.html?id=${data.propertyId}`
                });
                break;
            case 'hot-home':
                this.addAlert({
                    message: `🔥 ${MockData.getById(data.propertyId)?.name} is now a Hot Home!`,
                    type: 'warning',
                    link: `property.html?id=${data.propertyId}`
                });
                break;
            case 'availability':
                const prop = MockData.getById(data.propertyId);
                if (prop && data.availability === 'green') {
                    this.addAlert({
                        message: `✨ ${prop.name} is now available!`,
                        type: 'success',
                        link: `property.html?id=${data.propertyId}`
                    });
                }
                break;
        }
    },

    renderAlertsPanel() {
        const panel = document.querySelector('.alerts-panel');
        if (!panel) return;
        
        const unread = this.alerts.filter(a => !a.read).length;
        let alertsHtml = '';
        this.alerts.slice(0, 3).forEach(alert => {
            alertsHtml += `
                <div class="alert-item ${alert.read ? 'read' : ''}" data-id="${alert.id}">
                    <i class="fas ${this.getIcon(alert.type)}"></i>
                    <span>${alert.message}</span>
                    ${alert.link ? `<a href="${alert.link}" style="margin-left:auto;">View</a>` : ''}
                </div>
            `;
        });
        
        panel.innerHTML = `
            <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
                <span><i class="fas fa-bell"></i> Alerts ${unread > 0 ? `(${unread})` : ''}</span>
                <button onclick="AlertsEngine.markAllRead()" style="font-size:0.7rem;">Mark all read</button>
            </div>
            ${alertsHtml || '<div style="color:#64748b;">No new alerts</div>'}
        `;
    },

    getIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            warning: 'fa-exclamation-triangle',
            error: 'fa-times-circle',
            info: 'fa-info-circle'
        };
        return icons[type] || 'fa-bell';
    },

    markAllRead() {
        this.alerts.forEach(a => a.read = true);
        this.save();
        this.renderAlertsPanel();
    },

    save() {
        localStorage.setItem('ahss_alerts', JSON.stringify(this.alerts));
    },

    requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }
};

document.addEventListener('DOMContentLoaded', () => AlertsEngine.init());
window.AlertsEngine = AlertsEngine;