// ===== PropCore AI — Tenant Portal: Maintenance =====

function renderTenantMaintenance() {
  const t = window.currentTenant;
  const allJobs = MAINTENANCE_JOBS.filter(j => j.tenant === t.name);
  const openJobs = allJobs.filter(j => !['Completed', 'Closed'].includes(j.status));
  const pastJobs = allJobs.filter(j => ['Completed', 'Closed'].includes(j.status));

  const statusLabel = (s) => {
    const map = {
      'Logged': { cls: 'logged', icon: '📝', text: 'Logged — Waiting for contractor assignment' },
      'Contractor Assigned': { cls: 'scheduled', icon: '👷', text: 'Contractor assigned — scheduling in progress' },
      'Scheduled': { cls: 'scheduled', icon: '📅', text: 'Scheduled' },
      'In Progress': { cls: 'progress', icon: '🔧', text: 'In progress — contractor on site' },
      'Completed': { cls: 'completed', icon: '✅', text: 'Completed' },
      'Closed': { cls: 'closed', icon: '✔️', text: 'Closed' },
    };
    return map[s] || { cls: 'logged', icon: '📝', text: s };
  };

  return `
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:var(--space-5);flex-wrap:wrap;gap:var(--space-3)">
      <div>
        <h1 class="tp-page-title">Maintenance</h1>
        <p class="tp-page-subtitle" style="margin-bottom:0">${openJobs.length} open job${openJobs.length !== 1 ? 's' : ''} · ${pastJobs.length} completed</p>
      </div>
      <button class="tp-pay-btn" onclick="showReportIssueForm()">🔧 Report an Issue</button>
    </div>

    <!-- Report Issue Form (hidden initially) -->
    <div id="tp-report-form" style="display:none">
      <div class="tp-card" style="border-left:3px solid var(--primary)">
        <div class="tp-card-title">🔧 Report a New Issue</div>
        <div class="tp-form-group">
          <label class="tp-form-label">What's the issue? *</label>
          <input type="text" class="tp-form-input" id="report-issue" placeholder="e.g. Boiler not working, leak under sink, broken window handle">
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-3)">
          <div class="tp-form-group">
            <label class="tp-form-label">Category</label>
            <select class="tp-form-select" id="report-category">
              <option>Plumbing</option>
              <option>Electrical</option>
              <option>Heating</option>
              <option>General Repairs</option>
              <option>Pest Control</option>
              <option>Appliance</option>
              <option>Other</option>
            </select>
          </div>
          <div class="tp-form-group">
            <label class="tp-form-label">Urgency</label>
            <select class="tp-form-select" id="report-urgency">
              <option value="routine">Routine — can wait a few days</option>
              <option value="urgent">Urgent — needs attention today or tomorrow</option>
              <option value="emergency">Emergency — no heating, flooding, gas leak</option>
            </select>
          </div>
        </div>
        <div class="tp-form-group">
          <label class="tp-form-label">More details</label>
          <textarea class="tp-form-textarea" id="report-details" placeholder="Describe the issue in more detail — when it started, how bad it is, where exactly..."></textarea>
        </div>
        <div class="tp-form-group">
          <label class="tp-form-label" style="display:flex;align-items:center;gap:var(--space-2);cursor:pointer">
            <input type="file" id="report-photos" accept="image/*" multiple style="display:none">
            <span class="btn btn--secondary btn--sm" onclick="document.getElementById('report-photos').click()">📷 Attach Photos</span>
            <span id="report-photo-count" style="font-size:var(--text-xs);color:var(--text-muted)">No photos attached</span>
          </label>
        </div>
        <div style="background:var(--bg-secondary);border-radius:var(--radius);padding:var(--space-3);margin-bottom:var(--space-4);font-size:var(--text-xs);color:var(--text-muted)">
          <strong>What happens next:</strong> Our AI maintenance agent will assess the urgency, assign a priority level, and find the best available contractor for your issue. You'll receive updates here as the job progresses.
        </div>
        <div style="display:flex;gap:var(--space-2)">
          <button class="tp-pay-btn" onclick="submitIssueReport()">Submit Report</button>
          <button class="btn btn--secondary" onclick="hideReportIssueForm()">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Open Jobs -->
    ${openJobs.length > 0 ? `
      <div class="tp-card">
        <div class="tp-card-title">🔧 Open Jobs</div>
        ${openJobs.map(j => {
          const sl = statusLabel(j.status);
          return `
            <div class="tp-job-card">
              <div class="tp-job-header">
                <div>
                  <div class="tp-job-title">${j.issue}</div>
                  <div class="tp-job-meta">${j.id} · ${j.trade} · Logged ${formatDate(j.logged)}</div>
                </div>
                <span class="tp-job-status tp-job-status--${sl.cls}">${sl.icon} ${j.status}</span>
              </div>
              <div style="background:var(--bg-secondary);border-radius:var(--radius);padding:var(--space-3);margin-top:var(--space-2)">
                <div style="font-size:var(--text-sm);color:var(--text-secondary)">${sl.text}</div>
                ${j.contractor ? `<div style="font-size:var(--text-xs);color:var(--text-muted);margin-top:var(--space-1)">Contractor: <strong>${j.contractor}</strong></div>` : ''}
                ${j.scheduledDate ? `<div style="font-size:var(--text-xs);color:var(--primary);font-weight:600;margin-top:var(--space-1)">📅 Scheduled: ${formatDate(j.scheduledDate)}</div>` : ''}
              </div>
              ${j.notes ? `<div style="font-size:var(--text-xs);color:var(--text-muted);margin-top:var(--space-2);line-height:1.5">${j.notes}</div>` : ''}
            </div>
          `;
        }).join('')}
      </div>
    ` : ''}

    <!-- Past Jobs -->
    ${pastJobs.length > 0 ? `
      <div class="tp-card">
        <div class="tp-card-title">✅ Completed Jobs</div>
        ${pastJobs.map(j => `
          <div class="tp-job-card">
            <div class="tp-job-header">
              <div>
                <div class="tp-job-title">${j.issue}</div>
                <div class="tp-job-meta">${j.id} · ${j.trade} · Completed ${j.completedDate ? formatDate(j.completedDate) : '—'}</div>
              </div>
              <span class="tp-job-status tp-job-status--completed">✅ ${j.status}</span>
            </div>
            ${j.completionReport ? `
              <div style="background:var(--status-good-bg);border-radius:var(--radius);padding:var(--space-3);margin-top:var(--space-2);font-size:var(--text-xs);color:var(--text-secondary);line-height:1.5">
                <strong>Work done:</strong> ${j.completionReport.workDone}
              </div>
            ` : ''}
            ${j.tenantFeedback ? `
              <div style="font-size:var(--text-xs);color:var(--text-muted);margin-top:var(--space-2)">Your feedback: ${'⭐'.repeat(j.tenantFeedback.rating)} — "${j.tenantFeedback.comment}"</div>
            ` : `
              <div style="margin-top:var(--space-2)"><button class="btn btn--secondary btn--sm" style="font-size:11px">Leave Feedback</button></div>
            `}
          </div>
        `).join('')}
      </div>
    ` : ''}

    ${openJobs.length === 0 && pastJobs.length === 0 ? `
      <div class="tp-card" style="text-align:center;padding:var(--space-8)">
        <div style="font-size:40px;margin-bottom:var(--space-3)">🏠</div>
        <div style="font-weight:600;margin-bottom:var(--space-2)">No maintenance jobs</div>
        <div style="font-size:var(--text-sm);color:var(--text-muted);margin-bottom:var(--space-4)">Everything's looking good! If something needs fixing, tap the button above to report it.</div>
      </div>
    ` : ''}
  `;
}

function showReportIssueForm() {
  document.getElementById('tp-report-form').style.display = 'block';
  document.getElementById('tp-report-form').scrollIntoView({ behavior: 'smooth' });
}

function hideReportIssueForm() {
  document.getElementById('tp-report-form').style.display = 'none';
}

function submitIssueReport() {
  const issue = document.getElementById('report-issue')?.value;
  if (!issue) { alert('Please describe the issue.'); return; }

  const category = document.getElementById('report-category')?.value || 'General Repairs';
  const urgency = document.getElementById('report-urgency')?.value || 'routine';
  const details = document.getElementById('report-details')?.value || '';
  const t = window.currentTenant;

  const priorityMap = { emergency: 'P1', urgent: 'P2', routine: 'P3' };
  const newId = 'MJ-2026-' + String(MAINTENANCE_JOBS.length + 1).padStart(3, '0');

  MAINTENANCE_JOBS.push({
    id: newId,
    propertyId: t.propertyId,
    property: t.property,
    tenant: t.name,
    issue: issue,
    trade: category,
    priority: priorityMap[urgency],
    status: 'Logged',
    logged: new Date().toISOString(),
    contractorId: null,
    contractor: null,
    area: 'Private',
    room: t.room,
    scheduledDate: null,
    daysOpen: 0,
    notes: details,
    completionReport: null,
    tenantFeedback: null,
  });

  hideReportIssueForm();
  document.getElementById('tp-page-content').innerHTML = renderTenantMaintenance();

  // Update badge
  const openCount = MAINTENANCE_JOBS.filter(j => j.tenant === t.name && !['Completed','Closed'].includes(j.status)).length;
  const badge = document.getElementById('tp-maint-badge');
  if (badge) { badge.textContent = openCount; badge.style.display = openCount > 0 ? 'flex' : 'none'; }
}

function initTenantMaintenance() {
  setTimeout(() => {
    document.getElementById('report-photos')?.addEventListener('change', (e) => {
      const count = e.target.files.length;
      document.getElementById('report-photo-count').textContent = count > 0 ? count + ' photo' + (count > 1 ? 's' : '') + ' attached' : 'No photos attached';
    });
  }, 50);
}
