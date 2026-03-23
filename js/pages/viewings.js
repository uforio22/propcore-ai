// ===== PropCore AI — Viewings Page =====

function renderViewings() {
  const stages = ['Enquiry', 'Qualified', 'Booked', 'Completed', 'Offer Made', 'Cold'];
  const activeLeads = VIEWING_LEADS.filter(v => v.stage !== 'Cold').length;

  return `
    <div class="page-header">
      <div>
        <h1 class="page-title">Viewings</h1>
        <p class="page-subtitle">${activeLeads} active leads · ${VIEWING_LEADS.length} total</p>
      </div>
      <button class="btn btn--primary btn--sm">+ New Lead</button>
    </div>

    <div class="viewings-layout">
      <!-- Stats -->
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:var(--space-3)">
        <div class="stat-card">
          <span class="stat-label">Active Leads</span>
          <span class="stat-value">${activeLeads}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Viewings Booked</span>
          <span class="stat-value">${VIEWING_LEADS.filter(v => v.stage === 'Booked').length}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Offers Made</span>
          <span class="stat-value" style="color:var(--status-good)">${VIEWING_LEADS.filter(v => v.stage === 'Offer Made').length}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Conversion Rate</span>
          <span class="stat-value">${Math.round((VIEWING_LEADS.filter(v => v.stage === 'Offer Made').length / VIEWING_LEADS.length) * 100)}%</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Cold Leads</span>
          <span class="stat-value" style="color:var(--text-muted)">${VIEWING_LEADS.filter(v => v.stage === 'Cold').length}</span>
        </div>
      </div>

      <!-- Filter -->
      <div class="filter-bar">
        <div class="topbar-search" style="position:relative">
          <svg class="search-icon" viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/></svg>
          <input type="text" class="search-input" id="viewing-search" placeholder="Search leads...">
        </div>
        <select class="filter-select" id="viewing-property-filter">
          <option value="all">All Properties</option>
          ${[...new Set(VIEWING_LEADS.map(v => v.property))].map(p => `<option value="${p}">${p}</option>`).join('')}
        </select>
      </div>

      <!-- Pipeline Board -->
      <div class="kanban-board">
        ${stages.map(stage => {
          const leads = VIEWING_LEADS.filter(v => v.stage === stage);
          const stageColors = { 'Enquiry': 'var(--primary)', 'Qualified': '#6366f1', 'Booked': 'var(--status-warning)', 'Completed': '#10b981', 'Offer Made': '#059669', 'Cold': 'var(--text-muted)' };
          return `
            <div class="kanban-column">
              <div class="kanban-column-header">
                <span class="kanban-column-title" style="display:flex;align-items:center;gap:var(--space-2)">
                  <span style="width:8px;height:8px;border-radius:50%;background:${stageColors[stage]}"></span>
                  ${stage}
                </span>
                <span class="kanban-column-count">${leads.length}</span>
              </div>
              <div class="kanban-column-body">
                ${leads.map(v => `
                  <div class="kanban-card" onclick="openViewingDrawer('${v.id}')">
                    <div class="kanban-card-title">${v.name}</div>
                    <div class="kanban-card-meta">
                      <span>${v.property.split(',')[0]}</span>
                    </div>
                    <div style="margin-top:var(--space-2);font-size:var(--text-xs);color:var(--text-muted)">
                      <div>Budget: ${currencyFormat(v.budget)}/mo</div>
                      <div>Move-in: ${formatDate(v.moveIn)}</div>
                      ${v.viewingDate ? `<div>Viewing: ${formatDateTime(v.viewingDate)}</div>` : ''}
                    </div>
                  </div>
                `).join('')}
                ${leads.length === 0 ? '<div style="font-size:var(--text-xs);color:var(--text-muted);text-align:center;padding:var(--space-4)">No leads</div>' : ''}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <div class="detail-overlay" id="viewing-overlay"></div>
    <div class="detail-drawer" id="viewing-drawer">
      <div class="drawer-header">
        <h3 id="drawer-viewing-title">Lead Details</h3>
        <button class="drawer-close" id="close-viewing-drawer">✕</button>
      </div>
      <div class="drawer-body" id="drawer-viewing-body"></div>
    </div>
  `;
}

function openViewingDrawer(id) {
  const v = VIEWING_LEADS.find(x => x.id === id);
  if (!v) return;

  document.getElementById('drawer-viewing-title').textContent = v.name;
  document.getElementById('drawer-viewing-body').innerHTML = `
    <div style="margin-bottom:var(--space-4)">${statusBadge(v.stage)}</div>
    <div class="drawer-section">
      <div class="drawer-section-title">Contact Information</div>
      <div class="drawer-field"><span class="drawer-field-label">Email</span><span class="drawer-field-value">${v.email}</span></div>
      <div class="drawer-field"><span class="drawer-field-label">Phone</span><span class="drawer-field-value">${v.phone}</span></div>
    </div>
    <div class="drawer-section">
      <div class="drawer-section-title">Qualification Details</div>
      <div class="drawer-field"><span class="drawer-field-label">Property</span><span class="drawer-field-value">${v.property}</span></div>
      <div class="drawer-field"><span class="drawer-field-label">Budget</span><span class="drawer-field-value">${currencyFormat(v.budget)}/month</span></div>
      <div class="drawer-field"><span class="drawer-field-label">Move-in Date</span><span class="drawer-field-value">${formatDate(v.moveIn)}</span></div>
      <div class="drawer-field"><span class="drawer-field-label">Occupants</span><span class="drawer-field-value">${v.occupants}</span></div>
      <div class="drawer-field"><span class="drawer-field-label">Requirements</span><span class="drawer-field-value" style="text-align:right;max-width:55%">${v.requirements}</span></div>
      <div class="drawer-field"><span class="drawer-field-label">Assigned PM</span><span class="drawer-field-value">${v.assignedPM}</span></div>
    </div>
    <div class="drawer-section">
      <div class="drawer-section-title">Viewing Timeline</div>
      <div class="timeline">
        <div class="timeline-item">
          <div class="timeline-dot timeline-dot--green"></div>
          <div class="timeline-content">
            <div class="timeline-time">${formatDate(v.enquiryDate)}</div>
            <div class="timeline-text">${agentBadge('viewings')} Enquiry received</div>
          </div>
        </div>
        ${v.viewingDate ? `
          <div class="timeline-item">
            <div class="timeline-dot timeline-dot--active"></div>
            <div class="timeline-content">
              <div class="timeline-time">${formatDateTime(v.viewingDate)}</div>
              <div class="timeline-text">${agentBadge('viewings')} Viewing ${new Date(v.viewingDate) < new Date('2026-03-23') ? 'completed' : 'scheduled'}</div>
            </div>
          </div>
        ` : ''}
        ${v.followUp ? `
          <div class="timeline-item">
            <div class="timeline-dot timeline-dot--active"></div>
            <div class="timeline-content">
              <div class="timeline-text">${agentBadge('viewings')} ${v.followUp}</div>
            </div>
          </div>
        ` : ''}
      </div>
    </div>
    <div class="drawer-section">
      <div class="drawer-section-title">Notes</div>
      <p style="font-size:var(--text-sm);color:var(--text-secondary);line-height:1.6">${v.notes}</p>
    </div>
    <div style="display:flex;gap:var(--space-2);margin-top:var(--space-4)">
      ${v.stage === 'Completed' ? '<button class="btn btn--primary btn--sm">✓ Mark Interested</button>' : ''}
      ${v.stage === 'Enquiry' ? '<button class="btn btn--primary btn--sm">Qualify Lead</button>' : ''}
      ${v.stage === 'Qualified' ? '<button class="btn btn--primary btn--sm">Book Viewing</button>' : ''}
      <button class="btn btn--secondary btn--sm">Send Message</button>
    </div>
  `;

  document.getElementById('viewing-overlay').classList.add('open');
  document.getElementById('viewing-drawer').classList.add('open');
}

function initViewings() {
  setTimeout(() => {
    document.getElementById('close-viewing-drawer')?.addEventListener('click', closeViewingDrawer);
    document.getElementById('viewing-overlay')?.addEventListener('click', closeViewingDrawer);
  }, 50);
}

function closeViewingDrawer() {
  document.getElementById('viewing-overlay')?.classList.remove('open');
  document.getElementById('viewing-drawer')?.classList.remove('open');
}
