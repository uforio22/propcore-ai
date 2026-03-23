// ===== PropCore AI — Properties Page =====

function renderProperties() {
  return `
    <div class="page-header">
      <div>
        <h1 class="page-title">Properties</h1>
        <p class="page-subtitle">${PROPERTIES.length} properties in portfolio</p>
      </div>
      <button class="btn btn--primary btn--sm">+ Add Property</button>
    </div>

    <div class="filter-bar">
      <div class="topbar-search" style="position:relative">
        <svg class="search-icon" viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/></svg>
        <input type="text" class="search-input" id="property-search" placeholder="Search properties...">
      </div>
      <button class="filter-btn active" data-filter="all">All (${PROPERTIES.length})</button>
      <button class="filter-btn" data-filter="Flat">Flats</button>
      <button class="filter-btn" data-filter="House">Houses</button>
      <button class="filter-btn" data-filter="HMO">HMOs</button>
      <button class="filter-btn" data-filter="Student Let">Student Lets</button>
      <select class="filter-select" id="property-status-filter">
        <option value="all">All Statuses</option>
        <option value="Occupied">Occupied</option>
        <option value="Partially Let">Partially Let</option>
        <option value="Void">Void</option>
      </select>
    </div>

    <div class="property-grid" id="property-grid">
      ${renderPropertyCards(PROPERTIES)}
    </div>

    <!-- Detail Drawer -->
    <div class="detail-overlay" id="property-overlay"></div>
    <div class="detail-drawer" id="property-drawer">
      <div class="drawer-header">
        <h3 id="drawer-property-title">Property Details</h3>
        <button class="drawer-close" id="close-property-drawer">✕</button>
      </div>
      <div class="drawer-body" id="drawer-property-body"></div>
    </div>
  `;
}

function renderPropertyCards(properties) {
  return properties.map(p => `
    <div class="property-card" data-property-id="${p.id}" onclick="openPropertyDrawer('${p.id}')">
      <div class="property-card-header">
        <div>
          <div class="property-address">${p.address}</div>
          <div class="property-type">${p.postcode} · ${p.type}</div>
        </div>
        ${statusBadge(p.status)}
      </div>
      <div class="property-details">
        <div class="property-detail">
          <span class="property-detail-label">Monthly Rent</span>
          <span class="property-detail-value">${currencyFormat(p.monthlyRent)}</span>
        </div>
        <div class="property-detail">
          <span class="property-detail-label">Tenants</span>
          <span class="property-detail-value">${p.tenantCount}</span>
        </div>
        <div class="property-detail">
          <span class="property-detail-label">Bedrooms</span>
          <span class="property-detail-value">${p.bedrooms}</span>
        </div>
        <div class="property-detail">
          <span class="property-detail-label">Assigned PM</span>
          <span class="property-detail-value">${p.assignedPM.split(' ')[0]}</span>
        </div>
      </div>
    </div>
  `).join('');
}

function openPropertyDrawer(id) {
  const p = PROPERTIES.find(x => x.id === id);
  if (!p) return;
  const tenants = TENANTS.filter(t => t.propertyId === id);
  const jobs = MAINTENANCE_JOBS.filter(j => j.propertyId === id);

  document.getElementById('drawer-property-title').textContent = p.address;
  document.getElementById('drawer-property-body').innerHTML = `
    <div class="drawer-section">
      <div class="drawer-section-title">Property Information</div>
      <div class="drawer-field"><span class="drawer-field-label">Address</span><span class="drawer-field-value">${p.address}</span></div>
      <div class="drawer-field"><span class="drawer-field-label">Postcode</span><span class="drawer-field-value">${p.postcode}</span></div>
      <div class="drawer-field"><span class="drawer-field-label">Type</span><span class="drawer-field-value">${p.type}</span></div>
      <div class="drawer-field"><span class="drawer-field-label">Status</span><span class="drawer-field-value">${statusBadge(p.status)}</span></div>
      <div class="drawer-field"><span class="drawer-field-label">Monthly Rent</span><span class="drawer-field-value">${currencyFormat(p.monthlyRent)}</span></div>
      <div class="drawer-field"><span class="drawer-field-label">Bedrooms</span><span class="drawer-field-value">${p.bedrooms}</span></div>
      <div class="drawer-field"><span class="drawer-field-label">Bathrooms</span><span class="drawer-field-value">${p.bathrooms}</span></div>
      <div class="drawer-field"><span class="drawer-field-label">Assigned PM</span><span class="drawer-field-value">${p.assignedPM}</span></div>
    </div>
    <div class="drawer-section">
      <div class="drawer-section-title">Tenants (${tenants.length})</div>
      ${tenants.length ? tenants.map(t => `
        <div class="drawer-field">
          <span class="drawer-field-label">${t.name}${t.room ? ' — ' + t.room : ''}</span>
          <span class="drawer-field-value">${statusBadge(t.rentStatus)}</span>
        </div>
      `).join('') : '<p style="font-size:var(--text-sm);color:var(--text-muted)">No tenants — property is void</p>'}
    </div>
    <div class="drawer-section">
      <div class="drawer-section-title">Maintenance History (${jobs.length})</div>
      ${jobs.length ? jobs.slice(0, 5).map(j => `
        <div class="drawer-field">
          <span class="drawer-field-label">${j.id} — ${j.issue.substring(0, 30)}...</span>
          <span class="drawer-field-value">${statusBadge(j.status)}</span>
        </div>
      `).join('') : '<p style="font-size:var(--text-sm);color:var(--text-muted)">No maintenance jobs</p>'}
    </div>
  `;

  document.getElementById('property-overlay').classList.add('open');
  document.getElementById('property-drawer').classList.add('open');
}

function initProperties() {
  setTimeout(() => {
    // Search
    const searchInput = document.getElementById('property-search');
    if (searchInput) {
      searchInput.addEventListener('input', () => filterProperties());
    }

    // Type filter
    document.querySelectorAll('.filter-bar .filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-bar .filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterProperties();
      });
    });

    // Status filter
    const statusFilter = document.getElementById('property-status-filter');
    if (statusFilter) statusFilter.addEventListener('change', () => filterProperties());

    // Drawer close
    document.getElementById('close-property-drawer')?.addEventListener('click', closePropertyDrawer);
    document.getElementById('property-overlay')?.addEventListener('click', closePropertyDrawer);
  }, 50);
}

function filterProperties() {
  const query = document.getElementById('property-search')?.value || '';
  const typeFilter = document.querySelector('.filter-bar .filter-btn.active')?.dataset.filter || 'all';
  const statusFilter = document.getElementById('property-status-filter')?.value || 'all';

  let filtered = PROPERTIES;
  if (query) filtered = searchFilter(filtered, query, ['address', 'postcode', 'type', 'assignedPM']);
  if (typeFilter !== 'all') filtered = filtered.filter(p => p.type === typeFilter);
  if (statusFilter !== 'all') filtered = filtered.filter(p => p.status === statusFilter);

  document.getElementById('property-grid').innerHTML = renderPropertyCards(filtered);
}

function closePropertyDrawer() {
  document.getElementById('property-overlay')?.classList.remove('open');
  document.getElementById('property-drawer')?.classList.remove('open');
}
