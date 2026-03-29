// ===== PropCore AI — Tenant Portal: Home Page =====

function renderTenantHome() {
  const t = window.currentTenant;
  const tenantJobs = MAINTENANCE_JOBS.filter(j => j.tenant === t.name);
  const openJobs = tenantJobs.filter(j => !['Completed', 'Closed'].includes(j.status));
  const messages = TENANT_MESSAGES[window.currentTenantId] || [];
  const unread = messages.filter(m => !m.read).length;
  const appointments = TENANT_APPOINTMENTS[window.currentTenantId] || [];
  const upcoming = appointments.filter(a => a.status === 'Upcoming' || a.status === 'Pending');
  const rentRecord = RENT_RECORDS.find(r => r.tenantName === t.name);
  const rentStatus = rentRecord ? rentRecord.status : 'Paid';
  const rentDue = rentRecord && rentRecord.daysOverdue > 0 ? rentRecord.daysOverdue + ' days overdue' : 'Due 1st April';

  return `
    <div class="tp-welcome">
      <h2>Welcome back, ${t.name.split(' ')[0]} 👋</h2>
      <p>Here's an overview of your tenancy at <strong>${t.property}</strong>${t.room ? ' (' + t.room + ')' : ''}.</p>
      <div class="tp-welcome-details">
        <div>
          <div class="tp-welcome-detail-label">Monthly Rent</div>
          <div class="tp-welcome-detail-value">${currencyFormat(t.rent)}</div>
        </div>
        <div>
          <div class="tp-welcome-detail-label">Lease Period</div>
          <div class="tp-welcome-detail-value">${formatDate(t.leaseStart)} — ${formatDate(t.leaseEnd)}</div>
        </div>
        <div>
          <div class="tp-welcome-detail-label">Property Manager</div>
          <div class="tp-welcome-detail-value">Sarah Mitchell</div>
        </div>
      </div>
    </div>

    <div class="tp-stats">
      <div class="tp-stat-card" onclick="tpNavigateTo('rent')" style="cursor:pointer">
        <span class="tp-stat-label">Rent Status</span>
        <span class="tp-stat-value" style="color:${rentStatus === 'Paid' ? 'var(--status-good)' : rentStatus === 'Overdue' ? 'var(--status-urgent)' : 'var(--status-warning)'}">${rentStatus}</span>
        <div class="tp-stat-sub">${rentDue}</div>
      </div>
      <div class="tp-stat-card" onclick="tpNavigateTo('maintenance')" style="cursor:pointer">
        <span class="tp-stat-label">Open Maintenance</span>
        <span class="tp-stat-value">${openJobs.length}</span>
        <div class="tp-stat-sub">${openJobs.length > 0 ? openJobs[0].issue.substring(0, 30) + '...' : 'No open jobs'}</div>
      </div>
      <div class="tp-stat-card" onclick="tpNavigateTo('messages')" style="cursor:pointer">
        <span class="tp-stat-label">Unread Messages</span>
        <span class="tp-stat-value" style="${unread > 0 ? 'color:var(--status-urgent)' : ''}">${unread}</span>
        <div class="tp-stat-sub">${unread > 0 ? unread + ' new message' + (unread > 1 ? 's' : '') : 'All read'}</div>
      </div>
      <div class="tp-stat-card" onclick="tpNavigateTo('appointments')" style="cursor:pointer">
        <span class="tp-stat-label">Upcoming Visits</span>
        <span class="tp-stat-value">${upcoming.length}</span>
        <div class="tp-stat-sub">${upcoming.length > 0 ? upcoming[0].title.substring(0, 30) + '...' : 'Nothing scheduled'}</div>
      </div>
    </div>

    <div class="tp-card">
      <div class="tp-card-title">📋 Recent Activity</div>
      <div>
        ${messages.slice(-5).reverse().map(m => `
          <div class="tp-activity-item">
            <div class="tp-activity-dot" style="background:${m.from === 'tenant' ? '#1e3a5f' : 'var(--primary)'}"></div>
            <div>
              <div class="tp-activity-text">${m.from === 'agent' ? '<strong>' + m.agent + ' Agent:</strong> ' : '<strong>You:</strong> '}${m.text.substring(0, 80)}${m.text.length > 80 ? '...' : ''}</div>
              <div class="tp-activity-time">${timeAgo(m.time)}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-4)">
      <div class="tp-card">
        <div class="tp-card-title">🔧 Open Jobs</div>
        ${openJobs.length > 0 ? openJobs.map(j => `
          <div class="tp-job-card" style="margin-bottom:var(--space-2)">
            <div class="tp-job-header">
              <div>
                <div class="tp-job-title">${j.issue}</div>
                <div class="tp-job-meta">${j.id} · ${j.trade}</div>
              </div>
              <span class="tp-job-status tp-job-status--${j.status === 'Logged' ? 'logged' : j.status === 'In Progress' ? 'progress' : 'scheduled'}">${j.status}</span>
            </div>
          </div>
        `).join('') : '<p style="font-size:var(--text-sm);color:var(--text-muted)">No open maintenance jobs — everything\'s looking good! 🎉</p>'}
      </div>
      <div class="tp-card">
        <div class="tp-card-title">📅 Upcoming Appointments</div>
        ${upcoming.length > 0 ? upcoming.map(a => `
          <div style="padding:var(--space-2) 0;border-bottom:1px solid var(--border-light)">
            <div style="font-size:var(--text-sm);font-weight:600">${a.title}</div>
            <div style="font-size:var(--text-xs);color:var(--text-muted)">${formatDate(a.date)} · ${a.time}</div>
          </div>
        `).join('') : '<p style="font-size:var(--text-sm);color:var(--text-muted)">No upcoming appointments.</p>'}
      </div>
    </div>
  `;
}

function initTenantHome() {}
