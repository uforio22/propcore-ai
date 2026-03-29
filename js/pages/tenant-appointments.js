// ===== PropCore AI — Tenant Portal: Appointments =====

function renderTenantAppointments() {
  const appointments = TENANT_APPOINTMENTS[window.currentTenantId] || [];
  const upcoming = appointments.filter(a => a.status === 'Upcoming' || a.status === 'Pending' || a.status === 'In Progress');
  const past = appointments.filter(a => a.status === 'Completed' || a.status === 'Done');

  return `
    <h1 class="tp-page-title">Appointments</h1>
    <p class="tp-page-subtitle">${upcoming.length} upcoming · ${past.length} completed</p>

    ${upcoming.length > 0 ? `
      <div class="tp-card">
        <div class="tp-card-title">📅 Upcoming Appointments</div>
        ${upcoming.map(a => {
          const d = new Date(a.date);
          const day = d.getDate();
          const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
          const month = months[d.getMonth()];
          const weekdays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
          const weekday = weekdays[d.getDay()];
          const typeIcon = a.type === 'Contractor Visit' ? '🔧' : a.type === 'Inspection' ? '🔍' : '📋';
          const statusColor = a.status === 'Upcoming' ? 'var(--primary)' : a.status === 'In Progress' ? 'var(--status-warning)' : 'var(--text-muted)';

          return `
            <div class="tp-apt-card">
              <div class="tp-apt-date">
                <div class="tp-apt-day">${day}</div>
                <div class="tp-apt-month">${month}</div>
                <div style="font-size:10px;color:var(--text-muted);margin-top:2px">${weekday}</div>
              </div>
              <div class="tp-apt-details">
                <div class="tp-apt-title">${typeIcon} ${a.title}</div>
                <div class="tp-apt-info">
                  <div>🕐 ${a.time}</div>
                  <div>👤 ${a.who}</div>
                  ${a.notes ? `<div style="margin-top:var(--space-2);padding-top:var(--space-2);border-top:1px solid var(--border-light);font-size:11px;color:var(--text-muted)">${a.notes}</div>` : ''}
                </div>
              </div>
              <div>
                <span style="display:inline-block;padding:4px 10px;border-radius:var(--radius-full);font-size:11px;font-weight:600;color:${statusColor};background:${a.status === 'Upcoming' ? 'var(--status-good-bg)' : a.status === 'In Progress' ? 'var(--status-warning-bg)' : 'var(--bg-secondary)'}">${a.status === 'Pending' ? '⏳ Pending' : a.status === 'In Progress' ? '🔧 In Progress' : '✅ Confirmed'}</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    ` : `
      <div class="tp-card" style="text-align:center;padding:var(--space-8)">
        <div style="font-size:40px;margin-bottom:var(--space-3)">📅</div>
        <div style="font-weight:600;margin-bottom:var(--space-2)">No upcoming appointments</div>
        <div style="font-size:var(--text-sm);color:var(--text-muted)">You'll see contractor visits, inspections, and other scheduled events here.</div>
      </div>
    `}

    ${past.length > 0 ? `
      <div class="tp-card">
        <div class="tp-card-title">✅ Past Appointments</div>
        ${past.map(a => `
          <div style="display:flex;gap:var(--space-3);padding:var(--space-3) 0;border-bottom:1px solid var(--border-light)">
            <div style="font-size:var(--text-xs);color:var(--text-muted);min-width:60px">${formatDate(a.date)}</div>
            <div>
              <div style="font-size:var(--text-sm);font-weight:500">${a.title}</div>
              <div style="font-size:var(--text-xs);color:var(--text-muted)">${a.who}</div>
            </div>
          </div>
        `).join('')}
      </div>
    ` : ''}

    <div class="tp-card" style="background:var(--bg-secondary)">
      <div style="font-size:var(--text-sm);color:var(--text-secondary)">
        <strong>ℹ️ Access instructions:</strong> For all contractor visits, please ensure someone is home to provide access. If you can't make the time, message us and we'll reschedule.
      </div>
    </div>
  `;
}

function initTenantAppointments() {}
