// ===== PropCore AI — Tenant Portal Router =====

// Current tenant state
window.currentTenantId = 'T001';
window.currentTenant = TENANT_PROFILES['T001'];

// Pages
const TP_PAGES = {
  home: { render: renderTenantHome, init: initTenantHome, title: 'Home' },
  rent: { render: renderTenantRent, init: initTenantRent, title: 'Rent & Payments' },
  maintenance: { render: renderTenantMaintenance, init: initTenantMaintenance, title: 'Maintenance' },
  documents: { render: renderTenantDocuments, init: initTenantDocuments, title: 'Documents' },
  messages: { render: renderTenantMessages, init: initTenantMessages, title: 'Messages' },
  appointments: { render: renderTenantAppointments, init: initTenantAppointments, title: 'Appointments' },
};

let tpCurrentPage = 'home';

function tpNavigateTo(page) {
  if (!TP_PAGES[page]) return;
  tpCurrentPage = page;

  // Update active nav
  document.querySelectorAll('.tp-nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.page === page);
  });

  // Render page
  const content = document.getElementById('tp-page-content');
  content.innerHTML = TP_PAGES[page].render();
  TP_PAGES[page].init();

  // Update hash
  window.location.hash = page;

  // Close mobile sidebar
  document.getElementById('tp-sidebar')?.classList.remove('open');
}

function tpUpdateUI() {
  const t = window.currentTenant;

  // Greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  document.getElementById('tp-greeting').textContent = `${greeting}, ${t.name.split(' ')[0]}`;

  // Property
  document.getElementById('tp-property-label').textContent = t.property + (t.room ? ' (' + t.room + ')' : '');

  // Avatar
  document.getElementById('tp-avatar').textContent = t.name.split(' ').map(w => w[0]).join('');

  // Badges
  const tenantJobs = MAINTENANCE_JOBS.filter(j => j.tenant === t.name && !['Completed', 'Closed'].includes(j.status));
  const maintBadge = document.getElementById('tp-maint-badge');
  if (maintBadge) {
    maintBadge.textContent = tenantJobs.length;
    maintBadge.style.display = tenantJobs.length > 0 ? 'flex' : 'none';
  }

  const messages = TENANT_MESSAGES[window.currentTenantId] || [];
  const unread = messages.filter(m => !m.read).length;
  const msgBadge = document.getElementById('tp-msg-badge');
  if (msgBadge) {
    msgBadge.textContent = unread;
    msgBadge.style.display = unread > 0 ? 'flex' : 'none';
  }
}

function tpSwitchTenant(tenantId) {
  window.currentTenantId = tenantId;
  window.currentTenant = TENANT_PROFILES[tenantId];
  tpUpdateUI();
  tpNavigateTo(tpCurrentPage);
}

// Utility functions (shared with staff dashboard)
function timeAgo(isoStr) {
  const now = new Date('2026-03-24T13:48:00');
  const then = new Date(isoStr);
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 60) return diffMins + ' min ago';
  if (diffHrs < 24) return diffHrs + ' hr' + (diffHrs > 1 ? 's' : '') + ' ago';
  if (diffDays < 7) return diffDays + ' day' + (diffDays > 1 ? 's' : '') + ' ago';
  return formatDate(isoStr);
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  // Nav clicks
  document.querySelectorAll('.tp-nav-item').forEach(el => {
    el.addEventListener('click', () => tpNavigateTo(el.dataset.page));
  });

  // Tenant switcher
  document.getElementById('tenant-switcher')?.addEventListener('change', (e) => {
    tpSwitchTenant(e.target.value);
  });

  // Mobile menu
  document.getElementById('tp-menu-btn')?.addEventListener('click', () => {
    document.getElementById('tp-sidebar')?.classList.toggle('open');
  });

  // Hash routing
  const hash = window.location.hash.replace('#', '');
  const startPage = TP_PAGES[hash] ? hash : 'home';

  tpUpdateUI();
  tpNavigateTo(startPage);
});
