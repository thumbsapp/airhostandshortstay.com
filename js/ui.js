// ui.js – Modals, toasts, assistant
const UI = {
    initAssistant() {
        document.getElementById('dash-assistant')?.addEventListener('click', ()=>{
            this.showModal('Dash AI', 'How can I help? Try "find a diamond home with pool"');
        });
    },
    showModal(title, msg) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `<div class="modal"><h3>${title}</h3><p>${msg}</p><button onclick="this.closest('.modal-overlay').remove()">Close</button></div>`;
        document.body.appendChild(modal);
    },
    showToast(msg, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerText = msg;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 4000);
    }
};
window.UI = UI;