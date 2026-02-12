// listings/availability-engine.js – Real-time availability, calendar, blocking
const AvailabilityEngine = {
    calendars: {},
    blockedDates: {},

    init() {
        // Initialize calendars for properties
        MockData.properties.forEach(prop => {
            this.calendars[prop.id] = this.generateMockCalendar(prop);
        });
        
        // Listen for booking events
        document.addEventListener('booking:confirmed', (e) => {
            this.blockDates(e.detail.propertyId, e.detail.checkIn, e.detail.checkOut);
        });
    },

    generateMockCalendar(prop) {
        // Simulate availability for next 90 days
        const calendar = {};
        const today = new Date();
        for (let i = 0; i < 90; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];
            // Random availability: 70% chance available
            calendar[dateStr] = Math.random() > 0.3 ? 'available' : 'booked';
        }
        // Set current availability based on prop.availability
        const todayStr = today.toISOString().split('T')[0];
        if (prop.availability === 'green') calendar[todayStr] = 'available';
        else if (prop.availability === 'yellow') calendar[todayStr] = 'limited';
        else calendar[todayStr] = 'booked';
        
        return calendar;
    },

    checkAvailability(propertyId, checkIn, checkOut) {
        const calendar = this.calendars[propertyId];
        if (!calendar) return false;
        
        const dates = this.getDatesBetween(checkIn, checkOut);
        for (let date of dates) {
            if (calendar[date] !== 'available') {
                return false;
            }
        }
        return true;
    },

    blockDates(propertyId, checkIn, checkOut) {
        const calendar = this.calendars[propertyId];
        if (!calendar) return;
        const dates = this.getDatesBetween(checkIn, checkOut);
        dates.forEach(date => {
            calendar[date] = 'booked';
        });
        // Update property availability status
        const prop = MockData.getById(propertyId);
        if (prop) {
            const today = new Date().toISOString().split('T')[0];
            if (calendar[today] === 'booked') prop.availability = 'red';
            else if (calendar[today] === 'available') prop.availability = 'green';
            else prop.availability = 'yellow';
        }
    },

    getDatesBetween(start, end) {
        const dates = [];
        let currentDate = new Date(start);
        const endDate = new Date(end);
        while (currentDate <= endDate) {
            dates.push(currentDate.toISOString().split('T')[0]);
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dates;
    },

    getAvailableProperties(checkIn, checkOut) {
        return MockData.properties.filter(prop => {
            return this.checkAvailability(prop.id, checkIn, checkOut);
        });
    }
};

window.AvailabilityEngine = AvailabilityEngine;