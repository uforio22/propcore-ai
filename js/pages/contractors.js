// ===== PropCore AI — Contractors Page =====

function renderContractors() {
  const activeCount = CONTRACTORS.filter(c => c.status === 'Active').length;
  const expiredCount = CONTRACTORS.filter(c => c.status === 'Expired Docs').length;

  return `
    <div class="page-header">
      <div>
        <h1 class="page-title">Contractors</h1>
        <p class="page-subtitle">${CONTRACTORS.length} contractors · ${activeCount} active · ${expiredCount} compliance issues</p>
      </div>
      <button class="btn btn--primary btn--sm">+ Add Contractor</button>
    </div>

    ${expiredCount > 0 ? `
      <div class="card" style="border-left:3px solid var(--status-urgent);margin-bottom:var(--space-5);background:var(--status-urgent-bg)">
        <div style="display:flex;align-items:center;gap:var(--space-3)">
          <span style="font-size:20px">⚠️</span>
          <div>
            <div style="font-weight:600;font-size:var(--text-sm);color:var(--status-urgent-text)">Compliance Alert</div>
            <div style="font-size:var(--text-xs);color:var(--status-urgent-text)">${expiredCount} contractor(s) with expired compliance documents. These contractors are blocked from new bookings.</div>
          </div>
        </div>
      </div>
    ` : ''}

    <div class="filter-bar">
      <div class="topbar-search" style="position:relative">
        <svg class="search-icon" viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/></svg>
        <input type="text" class="search-input" id="contractor-search" placeholder="Search contractors...">
      </div>
      <select class="filter-select" id="contractor-trade-filter">
        <option value="all">All Trades</option>
        <option value="Plumbing">Plumbing</option>
        <option value="Electrical">Electrical</option>
        <option value="General Repairs">General Repairs</option>
        <option value="Roofing">Roofing</option>
        <option value="Appliance">Appliance</option>
        <option value="Pest Control">Pest Control</option>
      </select>
      <select class="filter-select" id="contractor-status-filter">
        <option value="all">All Statuses</option>
        <option value="Active">Active</option>
        <option value="Expired Docs">Expired Docs</option>
      </select>
    </div>

    <div class="contractor-grid" id="contractor-grid">
      ${renderContractorCards(CONTRACTORS)}
    </div>

    <div class="detail-overlay" id="contractor-overlay"></div>
    <div class="detail-drawer" id="contractor-drawer">
      <div class="drawer-header">
        <h3 id="drawer-contractor-title">Contractor Details</h3>
        <button class="drawer-close" id="close-contractor-drawer">✕</button>
      </div>
      <div class="drawer-body" id="drawer-contractor-body"></div>
    </div>
  `;
}

function renderContractorCards(contractors) {
  return contractors.map(c => `
    <div class="contractor-card" onclick="openContractorDrawer('${c.id}')">
      <div class="contractor-header">
        <div class="contractor-avatar">${initials(c.contact)}</div>
        <div>
          <div class="contractor-name">${c.name}</div>
          <div class="contractor-trade">${c.trades.join(', ')}</div>
        </div>
        ${statusBadge(c.status)}
      </div>
      <div style="margin:var(--space-2) 0">${starRating(c.rating)}</div>
      <div class="contractor-stats">
        <div class="contractor-stat">
          <div class="contractor-stat-value">${c.jobsCompleted}</div>
          <div class="contractor-stat-label">Jobs Done</div>
        </div>
        <div class="contractor-stat">
          <div class="contractor-stat-value">${c.avgResponseHrs}h</div>
          <div class="contractor-stat-label">Avg Response</div>
        </div>
        <div class="contractor-stat">
          <div class="contractor-stat-value">£${c.dayRate}</div>
          <div class="contractor-stat-label">Day Rate</div>
        </div>
      </div>
    </div>
  `).join('');
}

function openContractorDrawer(id) {
  const c = CONTRACTORS.find(x => x.id === id);
  if (!c) return;

  const complianceDocs = [];
  if (c.compliance.gasSafe) complianceDocs.push({ type: 'Gas Safe Certificate', number: c.compliance.gasSafe.number, expiry: c.compliance.gasSafe.expiry });
  if (c.compliance.electricalCert) complianceDocs.push({ type: 'Electrical Certificate', number: c.compliance.electricalCert.number, expiry: c.compliance.electricalCert.expiry });
  if (c.compliance.publicLiability) complianceDocs.push({ type: 'Public Liability Insurance', number: '—', expiry: c.compliance.publicLiability.expiry });

  const isExpired = (dateStr) => new Date(dateStr) < new Date('2026-03-23');
  const jobs = MAINTENANCE_JOBS.filter(j => j.contractorId === id);

  document.getElementById('drawer-contractor-title').textContent = c.name;
  document.getElementById('drawer-contractor-body').innerHTML = `
    <div style="margin-bottom:var(--space-4)">${statusBadge(c.status)} ${starRating(c.rating)}</div>
    <div class="drawer-section">
      <div class="drawer-section-title">Contact</div>
      <div class="drawer-field"><span class="drawer-field-label">Contact Name</span><span class="drawer-field-value">${c.contact}</span></div>
      <div class="drawer-field"><span class="drawer-field-label">Email</span><span class="drawer-field-value">${c.email}</span></div>
      <div class="drawer-field"><span class="drawer-field-label">Phone</span><span class="drawer-field-value">${c.phone}</span></div>
    </div>
    <div class="drawer-section">
      <div class="drawer-section-title">Performance</div>
      <div class="drawer-field"><span class="drawer-field-label">Jobs Completed</span><span class="drawer-field-value">${c.jobsCompleted}</span></div>
      <div class="drawer-field"><span class="drawer-field-label">Avg Response</span><span class="drawer-field-value">${c.avgResponseHrs} hours</span></div>
      <div class="drawer-field"><span class="drawer-field-label">Day Rate</span><span class="drawer-field-value">£${c.dayRate}</span></div>
      <div class="drawer-field"><span class="drawer-field-label">Re-visit Rate</span><span class="drawer-field-value">${c.revisitRate}%</span></div>
      <div class="drawer-field"><span class="drawer-field-label">Service Areas</span><span class="drawer-field-value">${c.serviceAreas.join(', ')}</span></div>
    </div>
    <div class="drawer-section">
      <div class="drawer-section-title">Compliance Documents</div>
      ${complianceDocs.map(doc => `
        <div class="drawer-field">
          <span class="drawer-field-label">${doc.type}${doc.number !== '—' ? ` (${doc.number})` : ''}</span>
          <span class="drawer-field-value">${isExpired(doc.expiry) ? `<span class="badge badge--red">Expired ${formatDate(doc.expiry)}</span>` : `<span class="badge badge--green">Valid until ${formatDate(doc.expiry)}</span>`}</span>
        </div>
      `).join('')}
    </div>
    <div class="drawer-section">
      <div class="drawer-section-title">Recent Jobs (${jobs.length})</div>
      ${jobs.map(j => `
        <div class="drawer-field">
          <span class="drawer-field-label">${j.id} — ${j.issue.substring(0, 25)}...</span>
          <span class="drawer-field-value">${statusBadge(j.status)}</span>
        </div>
      `).join('') || '<p style="font-size:var(--text-sm);color:var(--text-muted)">No jobs assigned</p>'}
    </div>
  `;

  document.getElementById('contractor-overlay').classList.add('open');
  document.getElementById('contractor-drawer').classList.add('open');
}

function initContractors() {
  setTimeout(() => {
    document.getElementById('contractor-search')?.addEventListener('input', () => filterContractors());
    document.getElementById('contractor-trade-filter')?.addEventListener('change', () => filterContractors());
    document.getElementById('contractor-status-filter')?.addEventListener('change', () => filterContractors());
    document.getElementById('close-contractor-drawer')?.addEventListener('click', closeContractorDrawer);
    document.getElementById('contractor-overlay')?.addEventListener('click', closeContractorDrawer);
  }, 50);
}

function filterContractors() {
  const query = document.getElementById('contractor-search')?.value || '';
  const trade = document.getElementById('contractor-trade-filter')?.value || 'all';
  const status = document.getElementById('contractor-status-filter')?.value || 'all';
  let filtered = CONTRACTORS;
  if (query) filtered = searchFilter(filtered, query, ['name', 'contact']);
  if (trade !== 'all') filtered = filtered.filter(c => c.trades.includes(trade));
  if (status !== 'all') filtered = filtered.filter(c => c.status === status);
  document.getElementById('contractor-grid').innerHTML = renderContractorCards(filtered);
}

function closeContractorDrawer() {
  document.getElementById('contractor-overlay')?.classList.remove('open');
  document.getElementById('contractor-drawer')?.classList.remove('open');
}
