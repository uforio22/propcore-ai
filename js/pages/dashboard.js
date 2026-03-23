// ===== PropCore AI — Dashboard Page =====

function renderDashboard() {
  const totalDue = RENT_RECORDS.reduce((s, r) => s + r.amountDue, 0);
  const totalPaid = RENT_RECORDS.reduce((s, r) => s + r.amountPaid, 0);
  const collectionPct = Math.round((totalPaid / totalDue) * 100);

  const overdue1_7 = RENT_RECORDS.filter(r => r.daysOverdue > 0 && r.daysOverdue <= 7).length;
  const overdue8_14 = RENT_RECORDS.filter(r => r.daysOverdue > 7 && r.daysOverdue <= 14).length;
  const overdue14plus = RENT_RECORDS.filter(r => r.daysOverdue > 14).length;

  const openJobs = MAINTENANCE_JOBS.filter(j => !['Completed', 'Closed'].includes(j.status));
  const jobsByStatus = { Logged: 0, 'Contractor Assigned': 0, Scheduled: 0, 'In Progress': 0 };
  openJobs.forEach(j => { if (jobsByStatus[j.status] !== undefined) jobsByStatus[j.status]++; });
  const p1 = openJobs.filter(j => j.priority === 'P1').length;
  const p2 = openJobs.filter(j => j.priority === 'P2').length;
  const p3 = openJobs.filter(j => j.priority === 'P3').length;

  const occupied = PROPERTIES.filter(p => p.status === 'Occupied').length;
  const partial = PROPERTIES.filter(p => p.status === 'Partially Let').length;
  const voidProps = PROPERTIES.filter(p => p.status === 'Void');
  const occupancyRate = Math.round(((occupied + partial * 0.7) / PROPERTIES.length) * 100);

  const stages = ['Enquiry', 'Qualified', 'Booked', 'Completed', 'Offer Made'];
  const funnelData = stages.map(s => ({ stage: s, count: VIEWING_LEADS.filter(v => v.stage === s).length }));
  const activeLeads = VIEWING_LEADS.filter(v => v.stage !== 'Cold').length;

  const recentActivity = ACTIVITY_FEED.slice(0, 15);

  return `
    <div class="page-header">
      <div>
        <h1 class="page-title">Dashboard</h1>
        <p class="page-subtitle">Portfolio overview — ${formatDate('2026-03-23')}</p>
      </div>
      <div style="display:flex;gap:var(--space-2)">
        <button class="btn btn--secondary btn--sm">📊 Export Report</button>
        <button class="btn btn--primary btn--sm">+ Log Maintenance</button>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="dash-stats" style="margin-bottom:var(--space-5)">
      <div class="stat-card">
        <span class="stat-label">Total Properties</span>
        <span class="stat-value">${PROPERTIES.length}</span>
        <span class="stat-trend stat-trend--up">↑ 2 since Jan</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Active Tenants</span>
        <span class="stat-value">${TENANTS.length}</span>
        <span class="stat-trend stat-trend--up">↑ 3 since Jan</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Open Maintenance Jobs</span>
        <span class="stat-value">${openJobs.length}</span>
        <span class="stat-trend stat-trend--down">↑ 2 vs last month</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Rent Collection Rate</span>
        <span class="stat-value">${collectionPct}%</span>
        <span class="stat-trend ${collectionPct >= 95 ? 'stat-trend--up' : 'stat-trend--down'}">${collectionPct >= 95 ? '↑' : '↓'} vs 97% last month</span>
      </div>
    </div>

    <div class="dashboard-grid">
      <!-- Rent Collection -->
      <div class="dash-module dash-rent">
        <div class="dash-module-header">
          <h2 class="dash-module-title">Rent Collection — March 2026</h2>
          <a href="#rent" class="btn btn--ghost btn--sm" onclick="navigateTo('rent')">View All →</a>
        </div>
        <div class="dash-module-body">
          <div class="rent-progress">
            <div class="rent-progress-header">
              <span class="rent-amount">${currencyFormat(totalPaid)} <span style="font-size:var(--text-sm);font-weight:400;color:var(--text-muted)">of ${currencyFormat(totalDue)}</span></span>
              <span class="rent-pct">${collectionPct}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill ${collectionPct >= 95 ? 'progress-fill--green' : collectionPct >= 85 ? 'progress-fill--amber' : 'progress-fill--red'}" style="width:${collectionPct}%"></div>
            </div>
          </div>
          <div class="arrears-badges">
            <div class="arrears-badge-item">
              <div class="arrears-badge-count" style="color:var(--status-warning)">${overdue1_7}</div>
              <div class="arrears-badge-label">1–7 days</div>
            </div>
            <div class="arrears-badge-item">
              <div class="arrears-badge-count" style="color:var(--status-warning)">${overdue8_14}</div>
              <div class="arrears-badge-label">8–14 days</div>
            </div>
            <div class="arrears-badge-item">
              <div class="arrears-badge-count" style="color:var(--status-urgent)">${overdue14plus}</div>
              <div class="arrears-badge-label">14+ days</div>
            </div>
          </div>
          <div style="font-size:var(--text-xs);font-weight:600;color:var(--text-muted);text-transform:uppercase;margin-bottom:var(--space-2)">12-Month Collection Rate</div>
          <div id="rent-chart" class="mini-chart"></div>
        </div>
      </div>

      <!-- Maintenance Tracker -->
      <div class="dash-module dash-maintenance">
        <div class="dash-module-header">
          <h2 class="dash-module-title">Maintenance Tracker</h2>
          <a href="#maintenance" class="btn btn--ghost btn--sm" onclick="navigateTo('maintenance')">View All →</a>
        </div>
        <div class="dash-module-body">
          <div class="maint-status-grid">
            <div class="maint-status-item"><div class="maint-status-count" style="color:var(--status-urgent)">${jobsByStatus['Logged']}</div><div class="maint-status-label">Logged</div></div>
            <div class="maint-status-item"><div class="maint-status-count" style="color:var(--status-warning)">${jobsByStatus['Contractor Assigned']}</div><div class="maint-status-label">Assigned</div></div>
            <div class="maint-status-item"><div class="maint-status-count" style="color:var(--primary)">${jobsByStatus['Scheduled']}</div><div class="maint-status-label">Scheduled</div></div>
            <div class="maint-status-item"><div class="maint-status-count" style="color:var(--status-good)">${jobsByStatus['In Progress']}</div><div class="maint-status-label">In Progress</div></div>
          </div>
          <div class="maint-priority-row">
            <div class="maint-priority-item" style="background:var(--p1-bg)"><span style="color:var(--p1);font-weight:700">${p1}</span> <span style="font-size:var(--text-xs);color:var(--p1)">P1 Emergency</span></div>
            <div class="maint-priority-item" style="background:var(--p2-bg)"><span style="color:#b45309;font-weight:700">${p2}</span> <span style="font-size:var(--text-xs);color:#b45309">P2 Urgent</span></div>
            <div class="maint-priority-item" style="background:var(--p3-bg)"><span style="color:#1d4ed8;font-weight:700">${p3}</span> <span style="font-size:var(--text-xs);color:#1d4ed8">P3 Routine</span></div>
          </div>
          <div style="font-size:var(--text-xs);font-weight:600;color:var(--text-muted);text-transform:uppercase;margin-bottom:var(--space-2)">Overdue Jobs</div>
          <div class="maint-overdue-list">
            ${openJobs.filter(j => j.daysOpen > 3).map(j => `
              <div class="maint-overdue-item">
                <div>
                  <div style="font-weight:500;font-size:var(--text-sm)">${j.id}</div>
                  <div style="font-size:var(--text-xs);color:var(--text-muted)">${j.property}</div>
                </div>
                <div style="text-align:right">
                  ${priorityTag(j.priority)}
                  <div style="font-size:var(--text-xs);color:var(--status-urgent);font-weight:600;margin-top:2px">${j.daysOpen} days</div>
                </div>
              </div>
            `).join('') || '<div style="font-size:var(--text-sm);color:var(--text-muted);padding:var(--space-2) 0">No overdue jobs</div>'}
          </div>
        </div>
      </div>

      <!-- Occupancy & Voids -->
      <div class="dash-module dash-occupancy">
        <div class="dash-module-header">
          <h2 class="dash-module-title">Occupancy & Voids</h2>
          <a href="#properties" class="btn btn--ghost btn--sm" onclick="navigateTo('properties')">View →</a>
        </div>
        <div class="dash-module-body">
          <div class="occupancy-rate">
            <div class="occupancy-pct">${occupancyRate}%</div>
            <div class="occupancy-label">Portfolio Occupancy</div>
          </div>
          <div style="font-size:var(--text-xs);font-weight:600;color:var(--text-muted);text-transform:uppercase;margin-bottom:var(--space-2)">Void Properties (${voidProps.length})</div>
          <div class="void-list">
            ${voidProps.map(p => `
              <div class="void-item">
                <div class="void-address">${p.address}</div>
                <div class="void-meta">
                  <span>${p.type}</span>
                  <span>${currencyFormat(p.monthlyRent)}/mo</span>
                  <span style="color:var(--status-urgent)">Void</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Viewing Pipeline -->
      <div class="dash-module dash-viewings">
        <div class="dash-module-header">
          <h2 class="dash-module-title">Viewing Pipeline</h2>
          <a href="#viewings" class="btn btn--ghost btn--sm" onclick="navigateTo('viewings')">View →</a>
        </div>
        <div class="dash-module-body">
          <div class="viewing-stats">
            <div class="stat-card" style="padding:var(--space-3)">
              <span class="stat-label">Active Leads</span>
              <span class="stat-value" style="font-size:var(--text-xl)">${activeLeads}</span>
            </div>
            <div class="stat-card" style="padding:var(--space-3)">
              <span class="stat-label">Booked This Week</span>
              <span class="stat-value" style="font-size:var(--text-xl)">${VIEWING_LEADS.filter(v => v.stage === 'Booked').length}</span>
            </div>
          </div>
          <div style="font-size:var(--text-xs);font-weight:600;color:var(--text-muted);text-transform:uppercase;margin-bottom:var(--space-3)">Conversion Funnel</div>
          <div class="funnel">
            ${funnelData.map((f, i) => {
              const maxCount = Math.max(...funnelData.map(d => d.count), 1);
              const widthPct = Math.max((f.count / maxCount) * 100, 15);
              const colors = ['#3b82f6', '#6366f1', '#f59e0b', '#10b981', '#059669'];
              return `
                <div class="funnel-step">
                  <span class="funnel-label">${f.stage}</span>
                  <div class="funnel-bar" style="width:${widthPct}%;background:${colors[i]}">${f.count}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>

      <!-- Agent Activity Feed -->
      <div class="dash-module dash-activity">
        <div class="dash-module-header">
          <h2 class="dash-module-title">Agent Activity</h2>
          <a href="#communications" class="btn btn--ghost btn--sm" onclick="navigateTo('communications')">View All →</a>
        </div>
        <div class="dash-module-body" style="padding-top:var(--space-3)">
          <!-- Escalation Queue -->
          ${NOTIFICATIONS.filter(n => !n.read).length > 0 ? `
            <div style="font-size:var(--text-xs);font-weight:600;color:var(--status-urgent);text-transform:uppercase;margin-bottom:var(--space-2)">⚡ Escalation Queue (${NOTIFICATIONS.filter(n => !n.read).length})</div>
            <div class="escalation-queue">
              ${NOTIFICATIONS.filter(n => !n.read).slice(0, 3).map(n => `
                <div class="escalation-item ${n.type === 'amber' ? 'escalation-item--amber' : ''}">
                  <span class="escalation-text">${n.text.substring(0, 80)}...</span>
                  <span class="escalation-action">Review →</span>
                </div>
              `).join('')}
            </div>
          ` : ''}

          <div class="activity-filters">
            <button class="filter-btn active" data-filter="all">All</button>
            <button class="filter-btn" data-filter="tenant">Tenant</button>
            <button class="filter-btn" data-filter="maintenance">Maintenance</button>
            <button class="filter-btn" data-filter="rent">Rent</button>
            <button class="filter-btn" data-filter="contractor">Contractor</button>
            <button class="filter-btn" data-filter="viewings">Viewings</button>
          </div>
          <div class="activity-feed" id="activity-feed">
            ${recentActivity.map(a => {
              const dotColors = { tenant: 'var(--agent-tenant)', maintenance: 'var(--agent-maintenance)', rent: 'var(--agent-rent)', contractor: 'var(--agent-contractor)', viewings: 'var(--agent-viewings)' };
              return `
                <div class="activity-item" data-agent="${a.agent}">
                  <div class="activity-dot" style="background:${dotColors[a.agent]}"></div>
                  <div class="activity-body">
                    <div class="activity-text">${agentBadge(a.agent)} ${a.text}</div>
                    <div class="activity-time">${timeAgo(a.time)}</div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

function initDashboard() {
  // Draw rent collection trend chart
  setTimeout(() => {
    drawMiniLineChart('rent-chart', COLLECTION_HISTORY.map(c => c.rate), '#10b981');

    // Activity feed filters
    document.querySelectorAll('.activity-filters .filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.activity-filters .filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        document.querySelectorAll('.activity-item').forEach(item => {
          item.style.display = (filter === 'all' || item.dataset.agent === filter) ? 'flex' : 'none';
        });
      });
    });
  }, 50);
}
