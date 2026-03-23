// ===== PropCore AI — Maintenance Page =====

function renderMaintenance() {
  const statuses = ['Logged', 'Contractor Assigned', 'Scheduled', 'In Progress', 'Completed', 'Closed'];
  const openJobs = MAINTENANCE_JOBS.filter(j => !['Completed', 'Closed'].includes(j.status));

  return `
    <div class="page-header">
      <div>
        <h1 class="page-title">Maintenance</h1>
        <p class="page-subtitle">${openJobs.length} open jobs · ${MAINTENANCE_JOBS.length} total</p>
      </div>
      <div style="display:flex;gap:var(--space-2)">
        <button class="btn btn--secondary btn--sm">📊 Export</button>
        <button class="btn btn--primary btn--sm">+ Log New Job</button>
      </div>
    </div>

    <div class="maintenance-layout">
      <!-- Stats Row -->
      <div class="maintenance-stats">
        <div class="stat-card">
          <span class="stat-label">P1 Emergency</span>
          <span class="stat-value" style="color:var(--p1)">${MAINTENANCE_JOBS.filter(j => j.priority === 'P1' && !['Completed','Closed'].includes(j.status)).length}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">P2 Urgent</span>
          <span class="stat-value" style="color:var(--p2)">${MAINTENANCE_JOBS.filter(j => j.priority === 'P2' && !['Completed','Closed'].includes(j.status)).length}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">P3 Routine</span>
          <span class="stat-value" style="color:var(--p3)">${MAINTENANCE_JOBS.filter(j => j.priority === 'P3' && !['Completed','Closed'].includes(j.status)).length}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Avg. Resolution</span>
          <span class="stat-value">3.2 days</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Overdue</span>
          <span class="stat-value" style="color:var(--status-urgent)">${openJobs.filter(j => j.daysOpen > 3).length}</span>
        </div>
      </div>

      <!-- Filter bar -->
      <div class="filter-bar">
        <div class="topbar-search" style="position:relative">
          <svg class="search-icon" viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/></svg>
          <input type="text" class="search-input" id="maint-search" placeholder="Search jobs...">
        </div>
        <select class="filter-select" id="maint-priority-filter">
          <option value="all">All Priorities</option>
          <option value="P1">P1 — Emergency</option>
          <option value="P2">P2 — Urgent</option>
          <option value="P3">P3 — Routine</option>
        </select>
        <select class="filter-select" id="maint-trade-filter">
          <option value="all">All Trades</option>
          <option value="Plumbing">Plumbing</option>
          <option value="Electrical">Electrical</option>
          <option value="General Repairs">General Repairs</option>
          <option value="Roofing">Roofing</option>
          <option value="Appliance">Appliance</option>
          <option value="Pest Control">Pest Control</option>
        </select>
      </div>

      <!-- Kanban Board -->
      <div class="kanban-board" id="maint-kanban">
        ${statuses.map(status => {
          const jobs = MAINTENANCE_JOBS.filter(j => j.status === status);
          return `
            <div class="kanban-column">
              <div class="kanban-column-header">
                <span class="kanban-column-title">${status}</span>
                <span class="kanban-column-count">${jobs.length}</span>
              </div>
              <div class="kanban-column-body">
                ${jobs.map(j => `
                  <div class="kanban-card" onclick="openMaintDrawer('${j.id}')">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-1)">
                      <span style="font-size:var(--text-xs);font-weight:600;color:var(--text-muted)">${j.id}</span>
                      ${priorityTag(j.priority)}
                    </div>
                    <div class="kanban-card-title">${j.issue.length > 40 ? j.issue.substring(0, 40) + '...' : j.issue}</div>
                    <div class="kanban-card-meta">
                      <span>${j.property.split(',')[0]}</span>
                      <span>·</span>
                      <span>${j.trade}</span>
                      ${j.daysOpen > 3 ? `<span style="color:var(--status-urgent);font-weight:600">${j.daysOpen}d</span>` : ''}
                    </div>
                    ${j.contractor ? `<div style="font-size:10px;color:var(--text-muted);margin-top:var(--space-1)">🔧 ${j.contractor}</div>` : ''}
                  </div>
                `).join('')}
                ${jobs.length === 0 ? '<div style="font-size:var(--text-xs);color:var(--text-muted);text-align:center;padding:var(--space-4)">No jobs</div>' : ''}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <div class="detail-overlay" id="maint-overlay"></div>
    <div class="detail-drawer" id="maint-drawer">
      <div class="drawer-header">
        <h3 id="drawer-maint-title">Job Details</h3>
        <button class="drawer-close" id="close-maint-drawer">✕</button>
      </div>
      <div class="drawer-body" id="drawer-maint-body"></div>
    </div>
  `;
}

function openMaintDrawer(id) {
  const j = MAINTENANCE_JOBS.find(x => x.id === id);
  if (!j) return;

  const statusTimeline = [
    { status: 'Logged', date: j.logged, done: true },
    { status: 'Contractor Assigned', date: j.contractorId ? j.logged : null, done: !!j.contractorId },
    { status: 'Scheduled', date: j.scheduledDate, done: ['Scheduled','In Progress','Completed','Closed'].includes(j.status) },
    { status: 'In Progress', date: null, done: ['In Progress','Completed','Closed'].includes(j.status) },
    { status: 'Completed', date: j.completedDate, done: ['Completed','Closed'].includes(j.status) },
    { status: 'Closed', date: j.closedDate, done: j.status === 'Closed' },
  ];

  document.getElementById('drawer-maint-title').textContent = j.id;
  document.getElementById('drawer-maint-body').innerHTML = `
    <div style="margin-bottom:var(--space-4)">${priorityTag(j.priority)} ${statusBadge(j.status)}</div>
    <div class="drawer-section">
      <div class="drawer-section-title">Job Information</div>
      <div class="drawer-field"><span class="drawer-field-label">Issue</span><span class="drawer-field-value" style="text-align:right;max-width:60%">${j.issue}</span></div>
      <div class="drawer-field"><span class="drawer-field-label">Property</span><span class="drawer-field-value">${j.property}</span></div>
      ${j.room ? `<div class="drawer-field"><span class="drawer-field-label">Room</span><span class="drawer-field-value">${j.room}</span></div>` : ''}
      <div class="drawer-field"><span class="drawer-field-label">Area</span><span class="drawer-field-value">${j.area}</span></div>
      <div class="drawer-field"><span class="drawer-field-label">Trade</span><span class="drawer-field-value">${j.trade}</span></div>
      <div class="drawer-field"><span class="drawer-field-label">Reported By</span><span class="drawer-field-value">${j.tenant || 'Staff'}</span></div>
      <div class="drawer-field"><span class="drawer-field-label">Logged</span><span class="drawer-field-value">${formatDateTime(j.logged)}</span></div>
      ${j.contractor ? `<div class="drawer-field"><span class="drawer-field-label">Contractor</span><span class="drawer-field-value">${j.contractor}</span></div>` : ''}
      ${j.scheduledDate ? `<div class="drawer-field"><span class="drawer-field-label">Scheduled</span><span class="drawer-field-value">${formatDate(j.scheduledDate)}</span></div>` : ''}
      <div class="drawer-field"><span class="drawer-field-label">Days Open</span><span class="drawer-field-value" style="${j.daysOpen > 3 ? 'color:var(--status-urgent);font-weight:700' : ''}">${j.daysOpen} days</span></div>
    </div>
    <div class="drawer-section">
      <div class="drawer-section-title">Notes</div>
      <p style="font-size:var(--text-sm);color:var(--text-secondary);line-height:1.6">${j.notes}</p>
    </div>
    <div class="drawer-section">
      <div class="drawer-section-title">Status Timeline</div>
      <div class="timeline">
        ${statusTimeline.map(s => `
          <div class="timeline-item">
            <div class="timeline-dot ${s.done ? 'timeline-dot--green' : ''}"></div>
            <div class="timeline-content">
              <div class="timeline-text" style="${s.done ? '' : 'color:var(--text-muted)'}">${s.status}</div>
              ${s.date ? `<div class="timeline-time">${formatDateTime(s.date)}</div>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  document.getElementById('maint-overlay').classList.add('open');
  document.getElementById('maint-drawer').classList.add('open');
}

function initMaintenance() {
  setTimeout(() => {
    document.getElementById('close-maint-drawer')?.addEventListener('click', closeMaintDrawer);
    document.getElementById('maint-overlay')?.addEventListener('click', closeMaintDrawer);
  }, 50);
}

function closeMaintDrawer() {
  document.getElementById('maint-overlay')?.classList.remove('open');
  document.getElementById('maint-drawer')?.classList.remove('open');
}
