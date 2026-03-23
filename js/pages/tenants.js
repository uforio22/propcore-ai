// ===== PropCore AI — Tenants Page =====

function renderTenants() {
  return `
    <div class="page-header">
      <div>
        <h1 class="page-title">Tenants</h1>
        <p class="page-subtitle">${TENANTS.length} active tenants across ${PROPERTIES.filter(p => p.status !== 'Void').length} properties</p>
      </div>
      <button class="btn btn--primary btn--sm">+ Add Tenant</button>
    </div>

    <div class="filter-bar">
      <div class="topbar-search" style="position:relative">
        <svg class="search-icon" viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/></svg>
        <input type="text" class="search-input" id="tenant-search" placeholder="Search tenants...">
      </div>
      <select class="filter-select" id="tenant-rent-filter">
        <option value="all">All Rent Statuses</option>
        <option value="Paid">Paid</option>
        <option value="Late">Late</option>
        <option value="Overdue">Overdue</option>
      </select>
    </div>

    <div class="card">
      <table class="data-table" id="tenants-table">
        <thead>
          <tr>
            <th>Tenant</th>
            <th>Property</th>
            <th>Room</th>
            <th>Lease End</th>
            <th>Rent</th>
            <th>Status</th>
            <th>Last Contact</th>
          </tr>
        </thead>
        <tbody id="tenants-tbody">
          ${renderTenantRows(TENANTS)}
        </tbody>
      </table>
    </div>

    <div class="detail-overlay" id="tenant-overlay"></div>
    <div class="detail-drawer" id="tenant-drawer">
      <div class="drawer-header">
        <h3 id="drawer-tenant-title">Tenant Details</h3>
        <button class="drawer-close" id="close-tenant-drawer">✕</button>
      </div>
      <div class="drawer-body" id="drawer-tenant-body"></div>
    </div>
  `;
}

function renderTenantRows(tenants) {
  return tenants.map(t => `
    <tr onclick="openTenantDrawer('${t.id}')">
      <td>
        <div class="tenant-row">
          <div class="tenant-avatar">${initials(t.name)}</div>
          <div>
            <div class="tenant-name">${t.name}</div>
            <div style="font-size:var(--text-xs);color:var(--text-muted)">${t.email}</div>
          </div>
        </div>
      </td>
      <td style="font-size:var(--text-sm)">${t.property}</td>
      <td>${t.room || '—'}</td>
      <td>${formatDate(t.leaseEnd)}</td>
      <td style="font-weight:600">${currencyFormat(t.rentAmount)}</td>
      <td>${statusBadge(t.rentStatus)}</td>
      <td style="font-size:var(--text-xs);color:var(--text-muted)">${formatDate(t.lastContact)}</td>
    </tr>
  `).join('');
}

function openTenantDrawer(id) {
  const t = TENANTS.find(x => x.id === id);
  if (!t) return;
  const rent = RENT_RECORDS.find(r => r.tenantId === id);
  const jobs = MAINTENANCE_JOBS.filter(j => j.propertyId === t.propertyId && (j.tenant === t.name || j.area === 'Communal'));

  document.getElementById('drawer-tenant-title').textContent = t.name;
  document.getElementById('drawer-tenant-body').innerHTML = `
    <div class="drawer-section">
      <div class="drawer-section-title">Contact Information</div>
      <div class="drawer-field"><span class="drawer-field-label">Email</span><span class="drawer-field-value">${t.email}</span></div>
      <div class="drawer-field"><span class="drawer-field-label">Phone</span><span class="drawer-field-value">${t.phone}</span></div>
    </div>
    <div class="drawer-section">
      <div class="drawer-section-title">Tenancy Details</div>
      <div class="drawer-field"><span class="drawer-field-label">Property</span><span class="drawer-field-value">${t.property}</span></div>
      ${t.room ? `<div class="drawer-field"><span class="drawer-field-label">Room</span><span class="drawer-field-value">${t.room}</span></div>` : ''}
      <div class="drawer-field"><span class="drawer-field-label">Lease Period</span><span class="drawer-field-value">${formatDate(t.leaseStart)} — ${formatDate(t.leaseEnd)}</span></div>
      <div class="drawer-field"><span class="drawer-field-label">Monthly Rent</span><span class="drawer-field-value">${currencyFormat(t.rentAmount)}</span></div>
      <div class="drawer-field"><span class="drawer-field-label">Rent Status</span><span class="drawer-field-value">${statusBadge(t.rentStatus)}</span></div>
    </div>
    ${rent && rent.chaseActions.length ? `
      <div class="drawer-section">
        <div class="drawer-section-title">Rent Chase Timeline</div>
        <div class="timeline">
          ${rent.chaseActions.map((a, i) => `
            <div class="timeline-item">
              <div class="timeline-dot ${i === rent.chaseActions.length - 1 ? 'timeline-dot--active' : ''}"></div>
              <div class="timeline-content">
                <div class="timeline-time">${formatDate(a.date)} · ${a.channel}</div>
                <div class="timeline-text">${a.action}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}
    <div class="drawer-section">
      <div class="drawer-section-title">Maintenance Jobs (${jobs.length})</div>
      ${jobs.length ? jobs.map(j => `
        <div class="drawer-field">
          <span class="drawer-field-label">${j.id} — ${j.issue.substring(0, 25)}...</span>
          <span class="drawer-field-value">${statusBadge(j.status)}</span>
        </div>
      `).join('') : '<p style="font-size:var(--text-sm);color:var(--text-muted)">No maintenance jobs</p>'}
    </div>
    <div class="drawer-section">
      <div class="drawer-section-title">Communication History</div>
      <div class="timeline">
        <div class="timeline-item">
          <div class="timeline-dot timeline-dot--green"></div>
          <div class="timeline-content">
            <div class="timeline-time">${formatDate(t.lastContact)}</div>
            <div class="timeline-text">${agentBadge('tenant')} Last contact — general enquiry resolved</div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('tenant-overlay').classList.add('open');
  document.getElementById('tenant-drawer').classList.add('open');
}

function initTenants() {
  setTimeout(() => {
    document.getElementById('tenant-search')?.addEventListener('input', () => filterTenants());
    document.getElementById('tenant-rent-filter')?.addEventListener('change', () => filterTenants());
    document.getElementById('close-tenant-drawer')?.addEventListener('click', closeTenantDrawer);
    document.getElementById('tenant-overlay')?.addEventListener('click', closeTenantDrawer);
  }, 50);
}

function filterTenants() {
  const query = document.getElementById('tenant-search')?.value || '';
  const rentFilter = document.getElementById('tenant-rent-filter')?.value || 'all';
  let filtered = TENANTS;
  if (query) filtered = searchFilter(filtered, query, ['name', 'email', 'property', 'room']);
  if (rentFilter !== 'all') filtered = filtered.filter(t => t.rentStatus === rentFilter);
  document.getElementById('tenants-tbody').innerHTML = renderTenantRows(filtered);
}

function closeTenantDrawer() {
  document.getElementById('tenant-overlay')?.classList.remove('open');
  document.getElementById('tenant-drawer')?.classList.remove('open');
}
