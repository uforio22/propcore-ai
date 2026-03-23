// ===== PropCore AI — Main Application Router =====

(function() {
  'use strict';

  // Page renderers
  const pages = {
    dashboard:      { render: renderDashboard, init: initDashboard },
    properties:     { render: renderProperties, init: initProperties },
    tenants:        { render: renderTenants, init: initTenants },
    maintenance:    { render: renderMaintenance, init: initMaintenance },
    contractors:    { render: renderContractors, init: initContractors },
    viewings:       { render: renderViewings, init: initViewings },
    rent:           { render: renderRent, init: initRent },
    communications: { render: renderCommunications, init: initCommunications },
    settings:       { render: renderSettings, init: initSettings },
  };

  let currentPage = 'dashboard';

  // ---- Router ----
  function navigateTo(page) {
    if (!pages[page]) return;
    currentPage = page;
    window.location.hash = page;

    // Update nav active state
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.page === page);
    });

    // Render page
    const content = document.getElementById('page-content');
    content.innerHTML = pages[page].render();
    content.scrollTop = 0;

    // Init page (attach event listeners, draw charts, etc.)
    if (pages[page].init) pages[page].init();

    // Close mobile sidebar
    document.getElementById('sidebar')?.classList.remove('open');
  }

  // Expose globally
  window.navigateTo = navigateTo;

  // ---- Notifications ----
  function initNotifications() {
    const trigger = document.getElementById('notification-trigger');
    const dropdown = document.getElementById('notification-dropdown');
    const notifList = document.getElementById('notif-list');

    // Populate
    notifList.innerHTML = NOTIFICATIONS.map(n => `
      <div class="notif-item ${n.read ? '' : 'unread'}">
        <div class="notif-dot notif-dot--${n.type}"></div>
        <div class="notif-body">
          <div class="notif-text">${n.text}</div>
          <div class="notif-time">${n.time}</div>
        </div>
      </div>
    `).join('');

    // Toggle dropdown
    trigger?.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown?.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!dropdown?.contains(e.target) && !trigger?.contains(e.target)) {
        dropdown?.classList.remove('open');
      }
    });

    // Mark all read
    document.querySelector('.notif-mark-read')?.addEventListener('click', () => {
      document.querySelectorAll('.notif-item.unread').forEach(item => item.classList.remove('unread'));
      document.getElementById('notification-count').textContent = '0';
      document.getElementById('notification-count').style.display = 'none';
    });
  }

  // ---- Mobile Menu ----
  function initMobileMenu() {
    document.getElementById('mobile-menu-btn')?.addEventListener('click', () => {
      document.getElementById('sidebar')?.classList.toggle('open');
    });
  }

  // ---- Sidebar Navigation ----
  function initNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const page = item.dataset.page;
        if (page) navigateTo(page);
      });
    });
  }

  // ---- Role Switcher ----
  function initRoleSwitcher() {
    const roleSelect = document.getElementById('role-select');
    const roleLabel = document.getElementById('user-role-label');
    const roleLabels = {
      admin: 'Admin',
      property_manager: 'Property Manager',
      maintenance_coordinator: 'Maintenance Coordinator',
      viewer: 'Read-only Viewer'
    };

    roleSelect?.addEventListener('change', () => {
      const role = roleSelect.value;
      roleLabel.textContent = roleLabels[role];

      // Show/hide nav items based on role
      const navItems = document.querySelectorAll('.nav-item');
      navItems.forEach(item => {
        const page = item.dataset.page;
        let visible = true;

        if (role === 'maintenance_coordinator') {
          visible = ['dashboard', 'maintenance', 'contractors', 'communications'].includes(page);
        } else if (role === 'viewer') {
          visible = ['dashboard', 'properties', 'maintenance'].includes(page);
        } else if (role === 'property_manager') {
          // PMs see everything except settings
          visible = page !== 'settings';
        }
        // Admin sees everything

        item.style.display = visible ? 'flex' : 'none';
      });

      // Always show settings for admin
      if (role === 'admin') {
        document.querySelectorAll('.nav-item').forEach(i => i.style.display = 'flex');
      }

      // Navigate to dashboard if current page is hidden
      const currentNav = document.querySelector(`.nav-item[data-page="${currentPage}"]`);
      if (currentNav && currentNav.style.display === 'none') {
        navigateTo('dashboard');
      }
    });
  }

  // ---- Global Search ----
  function initGlobalSearch() {
    const searchInput = document.getElementById('global-search');
    searchInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) {
          // Simple global search — navigate to most likely page
          const lq = query.toLowerCase();
          if (lq.includes('rent') || lq.includes('arrear') || lq.includes('payment')) {
            navigateTo('rent');
          } else if (lq.includes('maint') || lq.includes('repair') || lq.includes('job')) {
            navigateTo('maintenance');
          } else if (lq.includes('view') || lq.includes('lead') || lq.includes('enquir')) {
            navigateTo('viewings');
          } else if (lq.includes('contract') || lq.includes('plumb') || lq.includes('electri')) {
            navigateTo('contractors');
          } else {
            // Check if it matches a tenant or property
            const matchTenant = TENANTS.find(t => t.name.toLowerCase().includes(lq) || t.email.toLowerCase().includes(lq));
            if (matchTenant) {
              navigateTo('tenants');
            } else {
              const matchProperty = PROPERTIES.find(p => p.address.toLowerCase().includes(lq));
              if (matchProperty) {
                navigateTo('properties');
              } else {
                navigateTo('tenants');
              }
            }
          }
        }
      }
    });
  }

  // ---- Init ----
  function init() {
    initNavigation();
    initNotifications();
    initMobileMenu();
    initRoleSwitcher();
    initGlobalSearch();

    // Route from hash or default to dashboard
    const hash = window.location.hash.replace('#', '');
    navigateTo(hash && pages[hash] ? hash : 'dashboard');
  }

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
