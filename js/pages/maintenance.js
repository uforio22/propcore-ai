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
                    ${j.tenantFeedback ? `<div style="font-size:10px;margin-top:var(--space-1);color:var(--status-good)">⭐ ${j.tenantFeedback.rating}/5 feedback</div>` : ''}
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

  // Build completion report section
  let completionHTML = '';
  if (j.completionReport) {
    const cr = j.completionReport;
    completionHTML = `
      <div class="drawer-section">
        <div class="drawer-section-title" style="display:flex;align-items:center;gap:var(--space-2)">
          <span style="color:var(--status-good)">✅</span> Contractor Completion Report
        </div>
        <div style="background:var(--status-good-bg);border:1px solid #d1fae5;border-radius:var(--radius);padding:var(--space-4);margin-bottom:var(--space-3)">
          <div class="drawer-field"><span class="drawer-field-label">Work Done</span></div>
          <p style="font-size:var(--text-sm);color:var(--text-secondary);line-height:1.6;margin:var(--space-1) 0 var(--space-3) 0">${cr.workDone}</p>
          <div class="drawer-field"><span class="drawer-field-label">Parts Used</span><span class="drawer-field-value" style="max-width:60%;text-align:right">${cr.partsUsed}</span></div>
          <div class="drawer-field"><span class="drawer-field-label">Parts Cost</span><span class="drawer-field-value">${cr.partsCost > 0 ? currencyFormat(cr.partsCost) : 'None'}</span></div>
          <div class="drawer-field"><span class="drawer-field-label">Time on Site</span><span class="drawer-field-value">${cr.timeOnSite}</span></div>
          <div class="drawer-field"><span class="drawer-field-label">Photos Attached</span><span class="drawer-field-value">${cr.photos ? '📷 Yes' : 'No'}</span></div>
          <div class="drawer-field"><span class="drawer-field-label">Submitted</span><span class="drawer-field-value">${formatDateTime(cr.submittedAt)}</span></div>
        </div>
      </div>
    `;
  } else if (['In Progress', 'Scheduled', 'Contractor Assigned'].includes(j.status) && j.contractor) {
    completionHTML = `
      <div class="drawer-section">
        <div class="drawer-section-title" style="display:flex;align-items:center;gap:var(--space-2)">
          <span style="color:var(--status-warning)">⏳</span> Completion Report
        </div>
        <div style="background:var(--status-warning-bg);border:1px solid #fef3c7;border-radius:var(--radius);padding:var(--space-4)">
          <p style="font-size:var(--text-sm);color:var(--text-secondary);margin:0 0 var(--space-2) 0">Awaiting contractor completion report from <strong>${j.contractor}</strong>.</p>
          <p style="font-size:var(--text-xs);color:var(--text-muted);margin:0">The contractor will submit a report when the job is done, including work completed, parts used, time on site, and photos. If no report is submitted:</p>
          <div style="margin-top:var(--space-2);font-size:var(--text-xs);color:var(--text-muted)">
            <div style="padding:2px 0">• <strong>+24 hrs:</strong> Automatic reminder sent to contractor</div>
            <div style="padding:2px 0">• <strong>+48 hrs:</strong> Second reminder, PM notified</div>
            <div style="padding:2px 0">• <strong>+72 hrs:</strong> Escalated — contractor flagged as unresponsive</div>
          </div>
        </div>
      </div>
    `;
  }

  // Build tenant feedback section
  let feedbackHTML = '';
  if (j.tenantFeedback) {
    const tf = j.tenantFeedback;
    const stars = '⭐'.repeat(tf.rating) + '☆'.repeat(5 - tf.rating);
    feedbackHTML = `
      <div class="drawer-section">
        <div class="drawer-section-title" style="display:flex;align-items:center;gap:var(--space-2)">
          <span>💬</span> Tenant Feedback
        </div>
        <div style="background:var(--bg-secondary);border:1px solid var(--border);border-radius:var(--radius);padding:var(--space-4)">
          <div style="font-size:20px;margin-bottom:var(--space-2)">${stars}</div>
          <div style="font-size:var(--text-sm);font-weight:600;margin-bottom:var(--space-1)">${tf.rating}/5 — ${tf.rating >= 4 ? 'Satisfied' : tf.rating >= 3 ? 'Neutral' : 'Unsatisfied'}</div>
          <p style="font-size:var(--text-sm);color:var(--text-secondary);line-height:1.6;margin:var(--space-2) 0;font-style:italic">"${tf.comment}"</p>
          <div class="drawer-field" style="margin-top:var(--space-2)"><span class="drawer-field-label">Issue Resolved?</span><span class="drawer-field-value">${tf.resolved ? '<span class="badge badge--green">Yes</span>' : '<span class="badge badge--red">No — Job Reopened</span>'}</span></div>
          <div style="font-size:var(--text-xs);color:var(--text-muted);margin-top:var(--space-2)">Feedback submitted ${formatDateTime(tf.submittedAt)}</div>
        </div>
      </div>
    `;
  } else if (['Completed'].includes(j.status)) {
    feedbackHTML = `
      <div class="drawer-section">
        <div class="drawer-section-title" style="display:flex;align-items:center;gap:var(--space-2)">
          <span style="color:var(--status-warning)">⏳</span> Tenant Feedback
        </div>
        <div style="background:var(--status-warning-bg);border:1px solid #fef3c7;border-radius:var(--radius);padding:var(--space-4)">
          <p style="font-size:var(--text-sm);color:var(--text-secondary);margin:0">Feedback request sent to tenant. Awaiting response...</p>
          <p style="font-size:var(--text-xs);color:var(--text-muted);margin-top:var(--space-2)">A feedback email will be automatically sent 2 hours after job completion asking for a star rating, comments, and whether the issue was fully resolved.</p>
        </div>
      </div>
    `;
  }

  // Build PM email preview for completed/closed jobs
  let emailPreviewHTML = '';
  if (j.completionReport && (j.status === 'Completed' || j.status === 'Closed')) {
    const cr = j.completionReport;
    const tf = j.tenantFeedback;
    const pm = j.property.includes('Manor') || j.property.includes('Clifton') || j.property.includes('Park') ? 'Sarah Mitchell' : 'James Whitfield';
    emailPreviewHTML = `
      <div class="drawer-section">
        <div class="drawer-section-title" style="display:flex;align-items:center;gap:var(--space-2)">
          <span>📧</span> PM Completion Email
          <span class="badge badge--green" style="font-size:10px">Sent</span>
        </div>
        <div style="background:white;border:1px solid var(--border);border-radius:var(--radius);padding:var(--space-4);font-family:var(--font-body)">
          <div style="border-bottom:1px solid var(--border);padding-bottom:var(--space-3);margin-bottom:var(--space-3)">
            <div style="font-size:var(--text-xs);color:var(--text-muted)">To: ${pm} &lt;${pm.split(' ')[0].toLowerCase()}@propcore.co.uk&gt;</div>
            <div style="font-size:var(--text-sm);font-weight:600;margin-top:var(--space-1)">✅ Job Completed — ${j.id} · ${j.issue.substring(0, 40)}</div>
          </div>
          <div style="font-size:var(--text-xs);line-height:1.8;color:var(--text-secondary)">
            <div><strong>Job:</strong> ${j.id} — ${j.issue}</div>
            <div><strong>Priority:</strong> ${j.priority}</div>
            <div><strong>Property:</strong> ${j.property}</div>
            ${j.tenant ? `<div><strong>Tenant:</strong> ${j.tenant}${j.room ? ' (' + j.room + ')' : ''}</div>` : ''}
            <div><strong>Logged:</strong> ${formatDate(j.logged)}</div>
            <div><strong>Contractor:</strong> ${j.contractor}</div>
            <div><strong>Completed:</strong> ${formatDate(j.completedDate)}</div>
            <div><strong>Time on site:</strong> ${cr.timeOnSite}</div>
            <div style="margin-top:var(--space-2)"><strong>Work done:</strong></div>
            <div style="padding-left:var(--space-2);border-left:2px solid var(--border);margin:var(--space-1) 0">${cr.workDone}</div>
            <div style="margin-top:var(--space-2)"><strong>Parts/Cost:</strong> ${cr.partsUsed} ${cr.partsCost > 0 ? '— ' + currencyFormat(cr.partsCost) : ''}</div>
            ${cr.photos ? '<div><strong>Photos:</strong> 📷 Attached</div>' : ''}
            ${tf ? `
              <div style="margin-top:var(--space-3);padding-top:var(--space-3);border-top:1px solid var(--border)">
                <strong>Tenant Feedback:</strong> ${'⭐'.repeat(tf.rating)}${'☆'.repeat(5 - tf.rating)} (${tf.rating}/5)
                <div style="font-style:italic;margin-top:var(--space-1)">"${tf.comment}"</div>
                <div style="margin-top:var(--space-1)">Issue resolved: ${tf.resolved ? '✅ Yes' : '❌ No — job reopened'}</div>
              </div>
            ` : '<div style="margin-top:var(--space-2);color:var(--status-warning)">Tenant feedback pending...</div>'}
          </div>
          <div style="margin-top:var(--space-3);padding-top:var(--space-3);border-top:1px solid var(--border);font-size:10px;color:var(--text-muted);font-style:italic">
            This email was generated automatically by PropCore AI Maintenance Agent
          </div>
        </div>
      </div>
    `;
  }

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
    ${completionHTML}
    ${feedbackHTML}
    ${emailPreviewHTML}
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
    <div style="display:flex;gap:var(--space-2);margin-top:var(--space-4);flex-wrap:wrap">
      ${!j.completionReport && j.contractor && !['Completed','Closed'].includes(j.status) ? '<button class="btn btn--primary btn--sm" onclick="showCompletionForm(\'' + j.id + '\')">✓ Submit Completion</button>' : ''}
      ${j.status === 'Completed' ? '<button class="btn btn--primary btn--sm" onclick="closeJob(\'' + j.id + '\')">Close Job</button>' : ''}
      ${['Logged'].includes(j.status) ? '<button class="btn btn--primary btn--sm">Assign Contractor</button>' : ''}
      <button class="btn btn--secondary btn--sm">Contact Tenant</button>
    </div>
  `;

  document.getElementById('maint-overlay').classList.add('open');
  document.getElementById('maint-drawer').classList.add('open');
}

// Mock completion form
function showCompletionForm(jobId) {
  const j = MAINTENANCE_JOBS.find(x => x.id === jobId);
  if (!j) return;

  document.getElementById('drawer-maint-body').innerHTML = `
    <div style="margin-bottom:var(--space-4)">
      <a style="font-size:var(--text-sm);color:var(--primary);cursor:pointer;text-decoration:none" onclick="openMaintDrawer('${jobId}')">← Back to job</a>
    </div>
    <div class="drawer-section">
      <div class="drawer-section-title">Submit Completion Report — ${jobId}</div>
      <p style="font-size:var(--text-sm);color:var(--text-secondary);margin-bottom:var(--space-4)">Complete this form to mark the job as done. The property manager will receive a full breakdown email, and the tenant will be sent a feedback request.</p>

      <div style="margin-bottom:var(--space-3)">
        <label style="font-size:var(--text-sm);font-weight:600;display:block;margin-bottom:var(--space-1)">Work Done <span style="color:var(--status-urgent)">*</span></label>
        <textarea id="completion-work" class="settings-input" rows="4" style="width:100%;resize:vertical" placeholder="Describe what was done in detail...">${j.notes.split('.')[0]}. Repaired and tested — working normally.</textarea>
      </div>

      <div style="margin-bottom:var(--space-3)">
        <label style="font-size:var(--text-sm);font-weight:600;display:block;margin-bottom:var(--space-1)">Parts Used</label>
        <input type="text" id="completion-parts" class="settings-input" style="width:100%" placeholder="e.g. Replacement valve (x1), pipe fittings (x3)" value="">
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-3);margin-bottom:var(--space-3)">
        <div>
          <label style="font-size:var(--text-sm);font-weight:600;display:block;margin-bottom:var(--space-1)">Parts Cost (£)</label>
          <input type="number" id="completion-cost" class="settings-input" style="width:100%" placeholder="0" value="0">
        </div>
        <div>
          <label style="font-size:var(--text-sm);font-weight:600;display:block;margin-bottom:var(--space-1)">Time on Site <span style="color:var(--status-urgent)">*</span></label>
          <input type="text" id="completion-time" class="settings-input" style="width:100%" placeholder="e.g. 2.5 hours" value="">
        </div>
      </div>

      <div style="margin-bottom:var(--space-4)">
        <label style="font-size:var(--text-sm);font-weight:600;display:flex;align-items:center;gap:var(--space-2);cursor:pointer">
          <input type="checkbox" id="completion-photos"> Photos attached
        </label>
      </div>

      <div style="background:var(--bg-secondary);border-radius:var(--radius);padding:var(--space-3);margin-bottom:var(--space-4);font-size:var(--text-xs);color:var(--text-muted)">
        <strong>What happens next:</strong>
        <div style="margin-top:var(--space-1)">1. Job moves to "Completed" status</div>
        <div>2. PM receives full breakdown email with your report</div>
        <div>3. Tenant receives feedback request (2hr delay)</div>
        <div>4. Once tenant responds, feedback is appended to PM report</div>
      </div>

      <div style="display:flex;gap:var(--space-2)">
        <button class="btn btn--primary" onclick="submitCompletion('${jobId}')">Submit Completion Report</button>
        <button class="btn btn--secondary" onclick="openMaintDrawer('${jobId}')">Cancel</button>
      </div>
    </div>
  `;
}

// Mock submission
function submitCompletion(jobId) {
  const j = MAINTENANCE_JOBS.find(x => x.id === jobId);
  if (!j) return;

  const workDone = document.getElementById('completion-work')?.value;
  const timeOnSite = document.getElementById('completion-time')?.value;

  if (!workDone || !timeOnSite) {
    alert('Please fill in Work Done and Time on Site — these are required fields.');
    return;
  }

  // Mock the completion
  j.completionReport = {
    workDone: workDone,
    partsUsed: document.getElementById('completion-parts')?.value || 'None',
    partsCost: parseInt(document.getElementById('completion-cost')?.value) || 0,
    timeOnSite: timeOnSite,
    photos: document.getElementById('completion-photos')?.checked || false,
    submittedAt: new Date().toISOString()
  };
  j.status = 'Completed';
  j.completedDate = new Date().toISOString().split('T')[0];

  // Re-render maintenance page
  document.getElementById('page-content').innerHTML = renderMaintenance();
  initMaintenance();

  // Open drawer with completed job
  setTimeout(() => openMaintDrawer(jobId), 100);
}

function closeJob(jobId) {
  const j = MAINTENANCE_JOBS.find(x => x.id === jobId);
  if (!j) return;
  j.status = 'Closed';
  j.closedDate = new Date().toISOString().split('T')[0];
  document.getElementById('page-content').innerHTML = renderMaintenance();
  initMaintenance();
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
