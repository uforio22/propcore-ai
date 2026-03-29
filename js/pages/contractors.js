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
  return contractors.map(c => {
    const scoreColor = c.performanceScore >= 85 ? 'var(--status-good)' : c.performanceScore >= 70 ? 'var(--status-warning)' : 'var(--status-urgent)';

    return `
      <div class="contractor-card" onclick="openContractorDrawer('${c.id}')">
        <div class="contractor-header">
          <div class="contractor-avatar">${initials(c.contact)}</div>
          <div>
            <div class="contractor-name">${c.name}</div>
            <div class="contractor-trade">${c.trades.join(', ')}</div>
          </div>
          ${statusBadge(c.status)}
        </div>
        <div style="margin:var(--space-2) 0;display:flex;align-items:center;justify-content:space-between">
          <div>${starRating(c.rating)}</div>
          <div style="display:flex;align-items:center;gap:var(--space-1)">
            <span style="font-size:var(--text-xs);color:var(--text-muted)">Score:</span>
            <span style="font-weight:700;color:${scoreColor};font-size:var(--text-sm)">${c.performanceScore}/100</span>
          </div>
        </div>
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
            <div class="contractor-stat-value">${c.completionRate}%</div>
            <div class="contractor-stat-label">Completion</div>
          </div>
          <div class="contractor-stat">
            <div class="contractor-stat-value">£${c.dayRate}</div>
            <div class="contractor-stat-label">Day Rate</div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function openContractorDrawer(id) {
  const c = CONTRACTORS.find(x => x.id === id);
  if (!c) return;

  const rankInfo = CONTRACTOR_RANKINGS.find(r => r.id === id);
  const rank = rankInfo ? rankInfo.rank : '—';
  const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '#' + rank;
  const scoreColor = c.performanceScore >= 85 ? 'var(--status-good)' : c.performanceScore >= 70 ? 'var(--status-warning)' : 'var(--status-urgent)';

  const complianceDocs = [];
  if (c.compliance.gasSafe) complianceDocs.push({ type: 'Gas Safe Certificate', number: c.compliance.gasSafe.number, expiry: c.compliance.gasSafe.expiry });
  if (c.compliance.electricalCert) complianceDocs.push({ type: 'Electrical Certificate', number: c.compliance.electricalCert.number, expiry: c.compliance.electricalCert.expiry });
  if (c.compliance.publicLiability) complianceDocs.push({ type: 'Public Liability Insurance', number: '—', expiry: c.compliance.publicLiability.expiry });

  const isExpired = (dateStr) => new Date(dateStr) < new Date('2026-03-23');
  const jobs = MAINTENANCE_JOBS.filter(j => j.contractorId === id);

  // Get tenant feedback from completed jobs
  const feedbackJobs = jobs.filter(j => j.tenantFeedback);
  const avgFeedbackRating = feedbackJobs.length > 0 ? (feedbackJobs.reduce((s, j) => s + j.tenantFeedback.rating, 0) / feedbackJobs.length).toFixed(1) : null;

  document.getElementById('drawer-contractor-title').textContent = c.name;
  document.getElementById('drawer-contractor-body').innerHTML = `
    <div style="margin-bottom:var(--space-4)">${statusBadge(c.status)} ${starRating(c.rating)}</div>

    <!-- Performance Score -->
    <div class="drawer-section">
      <div class="drawer-section-title" style="display:flex;align-items:center;gap:var(--space-2)">🏆 Performance Ranking</div>
      <div style="background:var(--bg-secondary);border:1px solid var(--border);border-radius:var(--radius);padding:var(--space-4);margin-bottom:var(--space-3)">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-3)">
          <div>
            <span style="font-size:28px;font-weight:800;color:${scoreColor}">${c.performanceScore}</span>
            <span style="font-size:var(--text-sm);color:var(--text-muted)">/100</span>
          </div>
          <div style="font-size:24px">${medal}</div>
        </div>
        <div style="height:8px;border-radius:4px;background:var(--border);overflow:hidden;margin-bottom:var(--space-3)">
          <div style="width:${c.performanceScore}%;height:100%;background:${scoreColor};border-radius:4px;transition:width 0.3s"></div>
        </div>
        <!-- Score breakdown -->
        <div style="font-size:var(--text-xs);color:var(--text-muted);font-weight:600;text-transform:uppercase;margin-bottom:var(--space-2)">Score Breakdown</div>
        ${[
          { label: 'Tenant Rating', weight: '30%', value: c.rating + '/5', score: Math.round((c.rating / 5) * 30) },
          { label: 'Response Time', weight: '20%', value: c.avgResponseHrs + 'h avg', score: Math.round(Math.max(0, (1 - c.avgResponseHrs / 48)) * 20) },
          { label: 'Completion Rate', weight: '20%', value: c.completionRate + '%', score: Math.round((c.completionRate / 100) * 20) },
          { label: 'Re-visit Rate', weight: '15%', value: c.revisitRate + '%', score: Math.round(Math.max(0, (1 - c.revisitRate / 20)) * 15) },
          { label: 'Reliability', weight: '15%', value: c.reliabilityRate + '%', score: Math.round((c.reliabilityRate / 100) * 15) },
        ].map(item => `
          <div style="display:flex;align-items:center;gap:var(--space-2);margin-bottom:6px">
            <div style="width:110px;font-size:var(--text-xs);color:var(--text-secondary)">${item.label} (${item.weight})</div>
            <div style="flex:1;height:4px;border-radius:2px;background:var(--border);overflow:hidden">
              <div style="width:${(item.score / parseInt(item.weight)) * 100}%;height:100%;background:var(--primary);border-radius:2px"></div>
            </div>
            <div style="width:45px;font-size:var(--text-xs);font-weight:600;text-align:right;color:var(--text)">${item.score}/${parseInt(item.weight)}</div>
            <div style="width:50px;font-size:10px;color:var(--text-muted);text-align:right">${item.value}</div>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="drawer-section">
      <div class="drawer-section-title">Contact</div>
      <div class="drawer-field"><span class="drawer-field-label">Contact Name</span><span class="drawer-field-value">${c.contact}</span></div>
      <div class="drawer-field"><span class="drawer-field-label">Email</span><span class="drawer-field-value">${c.email}</span></div>
      <div class="drawer-field"><span class="drawer-field-label">Phone</span><span class="drawer-field-value">${c.phone}</span></div>
    </div>
    <div class="drawer-section">
      <div class="drawer-section-title">Performance Details</div>
      <div class="drawer-field"><span class="drawer-field-label">Jobs Completed</span><span class="drawer-field-value">${c.jobsCompleted} of ${c.totalAssigned} assigned</span></div>
      <div class="drawer-field"><span class="drawer-field-label">Avg Response</span><span class="drawer-field-value">${c.avgResponseHrs} hours</span></div>
      <div class="drawer-field"><span class="drawer-field-label">On-Time Rate</span><span class="drawer-field-value">${c.onTimeRate}%</span></div>
      <div class="drawer-field"><span class="drawer-field-label">Day Rate</span><span class="drawer-field-value">£${c.dayRate}</span></div>
      <div class="drawer-field"><span class="drawer-field-label">Re-visit Rate</span><span class="drawer-field-value" style="color:${c.revisitRate <= 4 ? 'var(--status-good)' : c.revisitRate <= 6 ? 'var(--status-warning)' : 'var(--status-urgent)'};font-weight:600">${c.revisitRate}%</span></div>
      <div class="drawer-field"><span class="drawer-field-label">Service Areas</span><span class="drawer-field-value">${c.serviceAreas.join(', ')}</span></div>
    </div>

    <!-- Tenant Feedback Summary -->
    ${feedbackJobs.length > 0 ? `
      <div class="drawer-section">
        <div class="drawer-section-title">💬 Tenant Feedback (${feedbackJobs.length} reviews)</div>
        <div style="background:var(--bg-secondary);border:1px solid var(--border);border-radius:var(--radius);padding:var(--space-3);margin-bottom:var(--space-3)">
          <div style="font-size:20px;margin-bottom:var(--space-1)">${'⭐'.repeat(Math.round(avgFeedbackRating))}</div>
          <div style="font-size:var(--text-sm);font-weight:600">${avgFeedbackRating}/5 average from ${c.feedbackCount} feedback responses</div>
        </div>
        ${feedbackJobs.map(j => `
          <div style="border-bottom:1px solid var(--border);padding:var(--space-2) 0">
            <div style="display:flex;justify-content:space-between;align-items:center">
              <span style="font-size:var(--text-xs);font-weight:600">${j.id} — ${j.tenant || 'Communal'}</span>
              <span style="font-size:var(--text-sm)">${'⭐'.repeat(j.tenantFeedback.rating)}</span>
            </div>
            <p style="font-size:var(--text-xs);color:var(--text-secondary);margin:4px 0;font-style:italic">"${j.tenantFeedback.comment}"</p>
            <div style="font-size:10px;color:var(--text-muted)">Resolved: ${j.tenantFeedback.resolved ? '✅' : '❌'} · ${formatDate(j.tenantFeedback.submittedAt)}</div>
          </div>
        `).join('')}
      </div>
    ` : ''}

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
