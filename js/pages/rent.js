// ===== PropCore AI — Rent Page =====

function renderRent() {
  const totalDue = RENT_RECORDS.reduce((s, r) => s + r.amountDue, 0);
  const totalPaid = RENT_RECORDS.reduce((s, r) => s + r.amountPaid, 0);
  const totalOutstanding = totalDue - totalPaid;
  const collectionPct = Math.round((totalPaid / totalDue) * 100);
  const overdueCount = RENT_RECORDS.filter(r => r.status === 'Overdue' || r.status === 'Partial').length;
  const lateCount = RENT_RECORDS.filter(r => r.status === 'Late').length;

  return `
    <div class="page-header">
      <div>
        <h1 class="page-title">Rent</h1>
        <p class="page-subtitle">March 2026 — ${RENT_RECORDS.length} tenants</p>
      </div>
      <div style="display:flex;gap:var(--space-2)">
        <button class="btn btn--secondary btn--sm">📊 Monthly Report</button>
        <button class="btn btn--primary btn--sm">Send Reminders</button>
      </div>
    </div>

    <div class="rent-overview-stats">
      <div class="stat-card">
        <span class="stat-label">Total Due</span>
        <span class="stat-value">${currencyFormat(totalDue)}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Collected</span>
        <span class="stat-value" style="color:var(--status-good)">${currencyFormat(totalPaid)}</span>
        <span class="stat-trend stat-trend--${collectionPct >= 95 ? 'up' : 'down'}">${collectionPct}% collection rate</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Outstanding</span>
        <span class="stat-value" style="color:var(--status-urgent)">${currencyFormat(totalOutstanding)}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Arrears Cases</span>
        <span class="stat-value" style="color:var(--status-warning)">${overdueCount + lateCount}</span>
        <span class="stat-trend" style="color:var(--text-muted)">${overdueCount} overdue · ${lateCount} late</span>
      </div>
    </div>

    <!-- Collection rate chart -->
    <div class="card" style="margin-bottom:var(--space-5)">
      <div class="card-header">
        <div>
          <h3 class="card-title">Collection Rate — 12 Month Trend</h3>
          <p class="card-subtitle">Monthly rent collection percentage</p>
        </div>
      </div>
      <div id="rent-page-chart" style="height:160px;width:100%"></div>
      <div style="display:flex;justify-content:space-between;padding-top:var(--space-2)">
        ${COLLECTION_HISTORY.map(c => `<span style="font-size:10px;color:var(--text-muted)">${c.month.split(' ')[0]}</span>`).join('')}
      </div>
    </div>

    <div class="filter-bar">
      <div class="topbar-search" style="position:relative">
        <svg class="search-icon" viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/></svg>
        <input type="text" class="search-input" id="rent-search" placeholder="Search tenants...">
      </div>
      <button class="filter-btn active" data-filter="all" id="rent-filter-all">All</button>
      <button class="filter-btn" data-filter="Paid" id="rent-filter-paid">Paid</button>
      <button class="filter-btn" data-filter="Late" id="rent-filter-late">Late</button>
      <button class="filter-btn" data-filter="Overdue" id="rent-filter-overdue">Overdue</button>
      <button class="filter-btn" data-filter="Partial" id="rent-filter-partial">Partial</button>
    </div>

    <div class="card">
      <table class="data-table">
        <thead>
          <tr>
            <th>Tenant</th>
            <th>Property</th>
            <th>Due</th>
            <th>Paid</th>
            <th>Outstanding</th>
            <th>Days Overdue</th>
            <th>Status</th>
            <th>Last Action</th>
          </tr>
        </thead>
        <tbody id="rent-tbody">
          ${renderRentRows(RENT_RECORDS)}
        </tbody>
      </table>
    </div>

    <!-- Chase detail drawer -->
    <div class="detail-overlay" id="rent-overlay"></div>
    <div class="detail-drawer" id="rent-drawer">
      <div class="drawer-header">
        <h3 id="drawer-rent-title">Rent Details</h3>
        <button class="drawer-close" id="close-rent-drawer">✕</button>
      </div>
      <div class="drawer-body" id="drawer-rent-body"></div>
    </div>
  `;
}

function renderRentRows(records) {
  return records.map(r => {
    const outstanding = r.amountDue - r.amountPaid;
    const lastAction = r.chaseActions.length ? r.chaseActions[r.chaseActions.length - 1].action : (r.status === 'Paid' ? 'Payment received' : '—');
    return `
      <tr onclick="openRentDrawer('${r.tenantId}')" style="${r.daysOverdue > 14 ? 'background:var(--status-urgent-bg)' : ''}">
        <td><span style="font-weight:500">${r.tenant}</span></td>
        <td style="font-size:var(--text-xs)">${r.property}</td>
        <td>${currencyFormat(r.amountDue)}</td>
        <td style="color:${r.amountPaid >= r.amountDue ? 'var(--status-good)' : 'var(--text)'}">${currencyFormat(r.amountPaid)}</td>
        <td style="font-weight:600;color:${outstanding > 0 ? 'var(--status-urgent)' : 'var(--text-muted)'}">${outstanding > 0 ? currencyFormat(outstanding) : '—'}</td>
        <td>${r.daysOverdue > 0 ? `<span style="color:${r.daysOverdue > 14 ? 'var(--status-urgent)' : 'var(--status-warning)'};font-weight:600">${r.daysOverdue} days</span>` : '—'}</td>
        <td>${statusBadge(r.status)}</td>
        <td style="font-size:var(--text-xs);color:var(--text-muted);max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${lastAction}</td>
      </tr>
    `;
  }).join('');
}

function openRentDrawer(tenantId) {
  const r = RENT_RECORDS.find(x => x.tenantId === tenantId);
  if (!r) return;
  const outstanding = r.amountDue - r.amountPaid;

  document.getElementById('drawer-rent-title').textContent = r.tenant;
  document.getElementById('drawer-rent-body').innerHTML = `
    <div style="margin-bottom:var(--space-4)">${statusBadge(r.status)}</div>
    <div class="drawer-section">
      <div class="drawer-section-title">Payment Summary</div>
      <div class="drawer-field"><span class="drawer-field-label">Property</span><span class="drawer-field-value">${r.property}</span></div>
      <div class="drawer-field"><span class="drawer-field-label">Amount Due</span><span class="drawer-field-value">${currencyFormat(r.amountDue)}</span></div>
      <div class="drawer-field"><span class="drawer-field-label">Amount Paid</span><span class="drawer-field-value" style="color:${r.amountPaid >= r.amountDue ? 'var(--status-good)' : 'var(--status-urgent)'}">${currencyFormat(r.amountPaid)}</span></div>
      ${outstanding > 0 ? `<div class="drawer-field"><span class="drawer-field-label">Outstanding</span><span class="drawer-field-value" style="color:var(--status-urgent);font-weight:700">${currencyFormat(outstanding)}</span></div>` : ''}
      <div class="drawer-field"><span class="drawer-field-label">Due Date</span><span class="drawer-field-value">${formatDate(r.dueDate)}</span></div>
      ${r.paidDate ? `<div class="drawer-field"><span class="drawer-field-label">Paid Date</span><span class="drawer-field-value">${formatDate(r.paidDate)}</span></div>` : ''}
      ${r.daysOverdue > 0 ? `<div class="drawer-field"><span class="drawer-field-label">Days Overdue</span><span class="drawer-field-value" style="color:var(--status-urgent);font-weight:700">${r.daysOverdue} days</span></div>` : ''}
    </div>
    ${r.chaseActions.length ? `
      <div class="drawer-section">
        <div class="drawer-section-title">Chase Timeline — ${agentBadge('rent')}</div>
        <div class="timeline">
          ${r.chaseActions.map((a, i) => `
            <div class="timeline-item">
              <div class="timeline-dot ${i === r.chaseActions.length - 1 ? 'timeline-dot--active' : 'timeline-dot--green'}"></div>
              <div class="timeline-content">
                <div class="timeline-time">${formatDate(a.date)} · ${a.channel}</div>
                <div class="timeline-text">${a.action}</div>
                <div style="font-size:10px;color:var(--text-muted)">${a.agent}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    ` : '<div class="drawer-section"><div class="drawer-section-title">Chase Timeline</div><p style="font-size:var(--text-sm);color:var(--text-muted)">No chase actions — payment received on time.</p></div>'}
    ${outstanding > 0 ? `
      <div style="display:flex;gap:var(--space-2);margin-top:var(--space-4)">
        <button class="btn btn--primary btn--sm">Send Reminder</button>
        <button class="btn btn--secondary btn--sm">Log Payment</button>
        ${r.daysOverdue > 14 ? '<button class="btn btn--danger btn--sm">Escalate to Admin</button>' : ''}
      </div>
    ` : ''}
  `;

  document.getElementById('rent-overlay').classList.add('open');
  document.getElementById('rent-drawer').classList.add('open');
}

function initRent() {
  setTimeout(() => {
    drawMiniLineChart('rent-page-chart', COLLECTION_HISTORY.map(c => c.rate), '#10b981');

    // Search
    document.getElementById('rent-search')?.addEventListener('input', () => filterRent());

    // Filter buttons
    document.querySelectorAll('#rent-filter-all, #rent-filter-paid, #rent-filter-late, #rent-filter-overdue, #rent-filter-partial').forEach(btn => {
      btn?.addEventListener('click', () => {
        document.querySelectorAll('.filter-bar .filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterRent();
      });
    });

    document.getElementById('close-rent-drawer')?.addEventListener('click', closeRentDrawer);
    document.getElementById('rent-overlay')?.addEventListener('click', closeRentDrawer);
  }, 50);
}

function filterRent() {
  const query = document.getElementById('rent-search')?.value || '';
  const statusFilter = document.querySelector('.filter-bar .filter-btn.active')?.dataset?.filter || 'all';
  let filtered = RENT_RECORDS;
  if (query) filtered = searchFilter(filtered, query, ['tenant', 'property']);
  if (statusFilter !== 'all') filtered = filtered.filter(r => r.status === statusFilter);
  document.getElementById('rent-tbody').innerHTML = renderRentRows(filtered);
}

function closeRentDrawer() {
  document.getElementById('rent-overlay')?.classList.remove('open');
  document.getElementById('rent-drawer')?.classList.remove('open');
}
