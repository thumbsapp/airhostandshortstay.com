// ui.js – Modals, toasts, assistant, gallery, dynamic UI updates
const UI = {
    initAssistant() {
        document.getElementById('dash-assistant')?.addEventListener('click', ()=>{
            this.showModal('Dash AI', `
                <div style="display:flex; flex-direction:column; gap:12px;">
                    <p>✨ How can I help you today?</p>
                    <button onclick="UI.showToast('Finding diamond homes...')">Find Diamond homes</button>
                    <button onclick="UI.showToast('Applying Lipa Mdogo filter...')">Lipa Mdogo only</button>
                    <button onclick="UI.showToast('Hot Homes under $200')">Hot Homes under $200</button>
                    <button onclick="UI.showToast('AirChef available stays')">AirChef available</button>
                </div>
            `, 'large');
        });
    },
    showModal(title, content, size = 'medium', onClose, afterRender) {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay animate__animated animate__fadeIn';
        overlay.innerHTML = `
            <div class="modal animate__animated animate__zoomIn ${size}">
                <h2>${title}</h2>
                <div class="modal-content">${content}</div>
                <button class="modal-close">Close</button>
            </div>
        `;
        document.body.appendChild(overlay);
        overlay.querySelector('.modal-close').addEventListener('click', () => {
            overlay.remove();
            if (onClose) onClose();
        });
        if (afterRender) afterRender(overlay.querySelector('.modal'));
    },
    showToast(msg, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type} animate__animated animate__slideInRight`;
        toast.innerText = msg;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.classList.add('animate__fadeOut');
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    },
    initGallery() {
        const mainImg = document.getElementById('gallery-main');
        const thumbs = document.querySelectorAll('.thumbnail');
        thumbs.forEach((thumb, index) => {
            thumb.addEventListener('click', () => {
                mainImg.src = thumb.src;
                mainImg.classList.add('animate__fadeIn');
                setTimeout(() => mainImg.classList.remove('animate__fadeIn'), 500);
            });
        });
    }
};
window.UI = UI;