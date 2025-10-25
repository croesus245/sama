// MWG Hostel Finder - final clean implementation (hostel-only)

const state = { hostels: [], filteredHostels: [], fabMenuOpen: false };

async function loadHostels() {
    try {
        const base = window.API_BASE_URL || (typeof API_BASE === 'string' ? API_BASE : '');
        if (base) {
            const res = await fetch(`${base.replace(/\/$/, '')}/hostels`);
            if (res.ok) {
                const data = await res.json();
                state.hostels = Array.isArray(data) ? data : (data.items || []);
            }
        }
    } catch (e) {
        // network failed — fall back to demo
    }

    if (!state.hostels || state.hostels.length === 0) {
        state.hostels = [
            { id: 'h1', name: 'Campus Lodge', location: 'North Gate', price: '80,000', whatsapp: '+2348012345670', images: [], rating: 4.4 },
            { id: 'h2', name: 'Student Annex', location: 'South Gate', price: '60,000', whatsapp: '08022345678', images: [], rating: 4.1 }
        ];
    }

    state.filteredHostels = [...state.hostels];
    renderHostels(state.filteredHostels);
}

function renderHostels(list) {
    const container = document.getElementById('hostelsGrid') || document.querySelector('.hostels-grid');
    if (!container) return;
    if (!list || list.length === 0) {
        container.innerHTML = '<div class="no-hostels"><h3>No hostels found</h3><p>Try adjusting filters or refresh the page.</p></div>';
        return;
    }

    container.innerHTML = list.map(generateHostelCard).join('');
}

function generateHostelCard(h) {
    const img = (h.images && h.images[0]) || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80';
    return (`\n        <div class="hostel-card" data-id="${h.id}">\n            <div class="hostel-image" onclick="viewHostelDetails('${h.id}')">\n                <img src="${img}" alt="${h.name}" loading="lazy">\n            </div>\n            <div class="hostel-info">\n                <h3>${h.name}</h3>\n                <div class="hostel-meta">${h.location || ''} · ₦${h.price || 'N/A'}</div>\n                <div class="hostel-actions">\n                    <button class="btn" onclick="viewHostelDetails('${h.id}')">View</button>\n                    <button class="btn btn-primary" onclick="applyViaWhatsApp('${h.id}')">Apply</button>\n                </div>\n            </div>\n        </div>\n    `);
}

function viewHostelDetails(id) {
    const hostel = state.hostels.find(x => x.id === id);
    if (!hostel) return showNotification('Hostel not found', 'error');
    const html = `<div class="hostel-details"><h2>${hostel.name}</h2><p><strong>Location:</strong> ${hostel.location || 'N/A'}</p><p><strong>Price:</strong> ₦${hostel.price || 'N/A'}</p><div style="margin-top:1rem;"><button class="btn btn-primary" onclick="applyViaWhatsApp('${hostel.id}')">Contact via WhatsApp</button> <button class="btn" onclick="closeModal()">Close</button></div></div>`;
    showModal(hostel.name, html);
}

function applyViaWhatsApp(hostelId) {
    const hostel = state.hostels.find(x => x.id === hostelId) || {};
    const raw = hostel.whatsapp || hostel.contact || hostel.phone || '';
    if (!raw) return showNotification('Contact number not available', 'error');
    let digits = raw.replace(/[^0-9]/g, '');
    if (digits.startsWith('0')) digits = '234' + digits.slice(1);
    if (digits.length === 10) digits = '234' + digits;
    const message = encodeURIComponent(`Hi, I saw your hostel "${hostel.name || ''}" on MWG Hostels. Is it still available?`);
    const url = `https://wa.me/${digits}?text=${message}`;
    window.open(url, '_blank');
}

function showModal(title, contentHtml) {
    closeModal();
    const modal = document.createElement('div');
    modal.id = 'mwgModal';
    modal.className = 'mwg-modal active';
    modal.innerHTML = `<div class="mwg-modal-inner"><div class="mwg-modal-header"><h3>${title}</h3><button class="mwg-modal-close" onclick="closeModal()">×</button></div><div class="mwg-modal-body">${contentHtml}</div></div>`;
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

function closeModal() { const m = document.getElementById('mwgModal'); if (m) { m.remove(); document.body.style.overflow = ''; } }

function showNotification(text, type = 'info', ttl = 3500) { const el = document.createElement('div'); el.className = `mwg-toast mwg-toast-${type}`; el.textContent = text; document.body.appendChild(el); setTimeout(() => el.classList.add('visible'), 10); setTimeout(() => { el.classList.remove('visible'); setTimeout(() => el.remove(), 300); }, ttl); }

function initializeFAB() { const fab = document.querySelector('.floating-action-btn'); if (!fab) return; fab.addEventListener('click', (e) => { e.stopPropagation(); state.fabMenuOpen ? closeFABMenu() : showFABMenu(); }); document.addEventListener('click', closeFABMenu); }

function showFABMenu() { const fab = document.querySelector('.floating-action-btn'); if (!fab) return; const menu = document.createElement('div'); menu.className = 'fab-menu'; menu.innerHTML = '<div class="fab-item" onclick="showNotification(\'Browse hostels - no registration required\', \'success\'); closeFABMenu();">Find Hostel</div>'; fab.appendChild(menu); state.fabMenuOpen = true; }

function closeFABMenu() { const m = document.querySelector('.fab-menu'); if (m) m.remove(); state.fabMenuOpen = false; }

function filterHostels() { const val = document.getElementById('locationFilter')?.value || ''; state.filteredHostels = (!val || val === 'all') ? [...state.hostels] : state.hostels.filter(h => (h.location||'').toLowerCase() === val.toLowerCase()); renderHostels(state.filteredHostels); }

function showHostelGallery(id) { const h = state.hostels.find(x=>x.id===id); if (!h) return showNotification('No images available','info'); const images = h.images||[]; const html = images.length ? images.map(i=>`<img src="${i}" style="width:100%;margin-bottom:8px">`).join('') : '<p>No images available</p>'; showModal(h.name+' — Gallery', html); }

// Expose public functions
window.applyViaWhatsApp = applyViaWhatsApp;
window.viewHostelDetails = viewHostelDetails;
window.showNotification = showNotification;

document.addEventListener('DOMContentLoaded', () => { loadHostels(); initializeFAB(); });
