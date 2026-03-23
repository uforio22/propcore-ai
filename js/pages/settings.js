// ===== PropCore AI — Settings Page =====

function renderSettings() {
  return `
    <div class="page-header">
      <div>
        <h1 class="page-title">Settings</h1>
        <p class="page-subtitle">System configuration and agent management</p>
      </div>
    </div>

    <div class="settings-layout">
      <!-- Settings Nav -->
      <div class="settings-nav">
        <div class="settings-nav-item active" data-settings="agents" onclick="switchSettingsTab('agents')">Agent Configuration</div>
        <div class="settings-nav-item" data-settings="integrations" onclick="switchSettingsTab('integrations')">Integrations</div>
        <div class="settings-nav-item" data-settings="roles" onclick="switchSettingsTab('roles')">User Roles</div>
        <div class="settings-nav-item" data-settings="notifications" onclick="switchSettingsTab('notifications')">Notifications</div>
      </div>

      <!-- Settings Content -->
      <div id="settings-content">
        ${renderAgentSettings()}
      </div>
    </div>
  `;
}

function renderAgentSettings() {
  const agents = [
    { key: 'tenant', name: 'Tenant Support Agent', desc: 'First point of contact for tenant communications. Triages, resolves, and escalates issues.', enabled: true, retries: 3, autoEscalate: true },
    { key: 'maintenance', name: 'Maintenance Logging Agent', desc: 'Captures and categorises maintenance requests. Assigns priority and tracks job status.', enabled: true, retries: 0, autoAssign: false },
    { key: 'rent', name: 'Rent Chase Agent', desc: 'Monitors rent payments and manages arrears communication. Sends automated reminders.', enabled: true, preReminder: 3, chaseDay3: true, chaseDay7: true, autoEscalate14: true },
    { key: 'contractor', name: 'Contractor Booking Agent', desc: 'Sources, schedules, and coordinates contractors for maintenance jobs.', enabled: true, autoApproveThreshold: 200, p1AutoBook: true },
    { key: 'viewings', name: 'Viewings Agent', desc: 'Manages viewing enquiries, scheduling, and follow-ups for void properties.', enabled: true, autoFollowUp: true, followUpHrs: 2 },
  ];

  return `
    <div class="settings-panel">
      <div class="settings-section">
        <h3 class="settings-section-title">AI Agent Configuration</h3>
        <p style="font-size:var(--text-sm);color:var(--text-secondary);margin-bottom:var(--space-6)">Configure each AI agent's behaviour, auto-approval thresholds, and escalation rules.</p>

        ${agents.map(a => `
          <div style="border:1px solid var(--border);border-radius:var(--radius);padding:var(--space-5);margin-bottom:var(--space-4)">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-3)">
              <div style="display:flex;align-items:center;gap:var(--space-3)">
                ${agentBadge(a.key)}
                <div>
                  <div style="font-weight:600;font-size:var(--text-md)">${a.name}</div>
                  <div style="font-size:var(--text-xs);color:var(--text-muted)">${a.desc}</div>
                </div>
              </div>
              <label class="toggle">
                <input type="checkbox" ${a.enabled ? 'checked' : ''}>
                <span class="toggle-slider"></span>
              </label>
            </div>

            ${a.key === 'tenant' ? `
              <div class="settings-row">
                <div class="settings-row-info"><div class="settings-row-label">Max Resolution Retries</div><div class="settings-row-desc">Attempts before escalating to staff</div></div>
                <input type="number" class="settings-input" value="${a.retries}" min="1" max="5" style="width:80px">
              </div>
              <div class="settings-row">
                <div class="settings-row-info"><div class="settings-row-label">Auto-Escalate Emergencies</div><div class="settings-row-desc">Immediately escalate safety, flood, gas, structural issues</div></div>
                <label class="toggle"><input type="checkbox" ${a.autoEscalate ? 'checked' : ''}><span class="toggle-slider"></span></label>
              </div>
            ` : ''}

            ${a.key === 'rent' ? `
              <div class="settings-row">
                <div class="settings-row-info"><div class="settings-row-label">Pre-Reminder (days before due)</div><div class="settings-row-desc">Send a friendly reminder before rent is due</div></div>
                <input type="number" class="settings-input" value="${a.preReminder}" min="1" max="7" style="width:80px">
              </div>
              <div class="settings-row">
                <div class="settings-row-info"><div class="settings-row-label">3-Day Chase</div><div class="settings-row-desc">Send follow-up if unpaid after 3 days</div></div>
                <label class="toggle"><input type="checkbox" ${a.chaseDay3 ? 'checked' : ''}><span class="toggle-slider"></span></label>
              </div>
              <div class="settings-row">
                <div class="settings-row-info"><div class="settings-row-label">7-Day Formal Notice</div><div class="settings-row-desc">Send formal arrears notice if unpaid after 7 days</div></div>
                <label class="toggle"><input type="checkbox" ${a.chaseDay7 ? 'checked' : ''}><span class="toggle-slider"></span></label>
              </div>
              <div class="settings-row">
                <div class="settings-row-info"><div class="settings-row-label">Auto-Escalate at 14 Days</div><div class="settings-row-desc">Notify Admin for arrears beyond 14 days</div></div>
                <label class="toggle"><input type="checkbox" ${a.autoEscalate14 ? 'checked' : ''}><span class="toggle-slider"></span></label>
              </div>
            ` : ''}

            ${a.key === 'contractor' ? `
              <div class="settings-row">
                <div class="settings-row-info"><div class="settings-row-label">Auto-Approve Threshold</div><div class="settings-row-desc">Jobs under this amount are auto-approved without PM review</div></div>
                <div style="display:flex;align-items:center;gap:var(--space-1)"><span style="font-weight:500">£</span><input type="number" class="settings-input" value="${a.autoApproveThreshold}" style="width:100px"></div>
              </div>
              <div class="settings-row">
                <div class="settings-row-info"><div class="settings-row-label">P1 Auto-Book</div><div class="settings-row-desc">Automatically book top-rated contractor for P1 emergencies</div></div>
                <label class="toggle"><input type="checkbox" ${a.p1AutoBook ? 'checked' : ''}><span class="toggle-slider"></span></label>
              </div>
            ` : ''}

            ${a.key === 'viewings' ? `
              <div class="settings-row">
                <div class="settings-row-info"><div class="settings-row-label">Auto Follow-Up</div><div class="settings-row-desc">Send follow-up email after viewings automatically</div></div>
                <label class="toggle"><input type="checkbox" ${a.autoFollowUp ? 'checked' : ''}><span class="toggle-slider"></span></label>
              </div>
              <div class="settings-row">
                <div class="settings-row-info"><div class="settings-row-label">Follow-Up Delay (hours)</div><div class="settings-row-desc">Hours after viewing before follow-up is sent</div></div>
                <input type="number" class="settings-input" value="${a.followUpHrs}" min="1" max="24" style="width:80px">
              </div>
            ` : ''}

            ${a.key === 'maintenance' ? `
              <div class="settings-row">
                <div class="settings-row-info"><div class="settings-row-label">Auto-Assign Contractors</div><div class="settings-row-desc">Automatically assign available contractors to new jobs</div></div>
                <label class="toggle"><input type="checkbox" ${a.autoAssign ? 'checked' : ''}><span class="toggle-slider"></span></label>
              </div>
            ` : ''}
          </div>
        `).join('')}

        <button class="btn btn--primary">Save Configuration</button>
      </div>
    </div>
  `;
}

function renderIntegrationsSettings() {
  return `
    <div class="settings-panel">
      <div class="settings-section">
        <h3 class="settings-section-title">Integrations</h3>
        <p style="font-size:var(--text-sm);color:var(--text-secondary);margin-bottom:var(--space-6)">Manage connections to external services.</p>

        <div class="integration-cards">
          <div class="integration-card">
            <div class="integration-header">
              <div class="integration-icon">📅</div>
              <div>
                <div class="integration-name">Google Calendar</div>
                <div class="integration-status" style="color:var(--status-good);font-weight:600">● Connected</div>
              </div>
            </div>
            <p style="font-size:var(--text-sm);color:var(--text-secondary)">Shared calendar for viewing appointments and contractor bookings. Auto-syncing enabled.</p>
            <div style="display:flex;gap:var(--space-2)">
              <button class="btn btn--secondary btn--sm">Configure</button>
              <button class="btn btn--ghost btn--sm" style="color:var(--status-urgent)">Disconnect</button>
            </div>
          </div>

          <div class="integration-card">
            <div class="integration-header">
              <div class="integration-icon">💰</div>
              <div>
                <div class="integration-name">Xero</div>
                <div class="integration-status" style="color:var(--status-good);font-weight:600">● Connected</div>
              </div>
            </div>
            <p style="font-size:var(--text-sm);color:var(--text-secondary)">Rent payment tracking and contractor invoice logging. Read-only access for Rent Chase Agent.</p>
            <div style="display:flex;gap:var(--space-2)">
              <button class="btn btn--secondary btn--sm">Configure</button>
              <button class="btn btn--ghost btn--sm" style="color:var(--status-urgent)">Disconnect</button>
            </div>
          </div>

          <div class="integration-card">
            <div class="integration-header">
              <div class="integration-icon">📧</div>
              <div>
                <div class="integration-name">Email (SMTP)</div>
                <div class="integration-status" style="color:var(--status-good);font-weight:600">● Connected</div>
              </div>
            </div>
            <p style="font-size:var(--text-sm);color:var(--text-secondary)">Outbound email for tenant communications, rent reminders, and viewing confirmations.</p>
            <div style="display:flex;gap:var(--space-2)">
              <button class="btn btn--secondary btn--sm">Configure</button>
            </div>
          </div>

          <div class="integration-card" style="border-style:dashed">
            <div class="integration-header">
              <div class="integration-icon" style="font-size:24px">+</div>
              <div>
                <div class="integration-name">QuickBooks</div>
                <div class="integration-status" style="color:var(--text-muted)">Not connected</div>
              </div>
            </div>
            <p style="font-size:var(--text-sm);color:var(--text-secondary)">Alternative accounting integration. Connect to replace or supplement Xero.</p>
            <button class="btn btn--primary btn--sm">Connect</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderRolesSettings() {
  const roles = [
    { name: 'Admin', badge: 'red', desc: 'Full system access. Receives all escalations and can override any AI decision.', perms: ['All agents and properties', 'Financial data access', 'Override AI decisions', 'Configure agent settings', 'Manage contractor database'] },
    { name: 'Property Manager', badge: 'blue', desc: 'Manages assigned properties. Approves contractor bookings and handles viewings.', perms: ['Assigned properties only', 'Approve contractor bookings', 'Manage viewings pipeline', 'Receive escalations', 'Limited dashboard access'] },
    { name: 'Maintenance Coordinator', badge: 'amber', desc: 'Manages all maintenance jobs. Communicates with contractors.', perms: ['All maintenance jobs', 'Update job statuses', 'Communicate with contractors', 'P1 emergency alerts', 'No access to financial data'] },
    { name: 'Read-only Viewer', badge: 'gray', desc: 'View-only access for oversight. Suitable for landlords and directors.', perms: ['View dashboard analytics', 'View property list', 'View job statuses', 'No actions or communications', 'No tenant personal data'] },
  ];

  return `
    <div class="settings-panel">
      <div class="settings-section">
        <h3 class="settings-section-title">User Roles & Permissions</h3>
        <p style="font-size:var(--text-sm);color:var(--text-secondary);margin-bottom:var(--space-6)">Define access levels for each staff role. The role switcher in the sidebar lets you preview the UI for each role.</p>

        <div class="roles-grid">
          ${roles.map(r => `
            <div class="role-card">
              <div style="display:flex;align-items:center;gap:var(--space-2);margin-bottom:var(--space-2)">
                <span class="badge badge--${r.badge}">${r.name}</span>
              </div>
              <div class="role-card-desc">${r.desc}</div>
              <div class="role-perm-list">
                ${r.perms.map(p => `<div class="role-perm">${p}</div>`).join('')}
              </div>
            </div>
          `).join('')}
        </div>

        <div style="margin-top:var(--space-6)">
          <h4 style="font-size:var(--text-md);font-weight:600;margin-bottom:var(--space-3)">Staff Members</h4>
          <table class="data-table">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Role</th><th>Properties</th></tr>
            </thead>
            <tbody>
              <tr><td style="font-weight:500">Sarah Mitchell</td><td>sarah@propcore.co.uk</td><td>${statusBadge('Active')}</td><td>P001–P003, P006, P009, P011</td></tr>
              <tr><td style="font-weight:500">James Whitfield</td><td>james@propcore.co.uk</td><td><span class="badge badge--blue">Property Manager</span></td><td>P004, P005, P007, P008, P010, P012</td></tr>
              <tr><td style="font-weight:500">Lisa Chen</td><td>lisa@propcore.co.uk</td><td><span class="badge badge--amber">Maintenance Coordinator</span></td><td>All properties</td></tr>
              <tr><td style="font-weight:500">Robert Davies</td><td>robert@propcore.co.uk</td><td><span class="badge badge--gray">Viewer</span></td><td>All (read-only)</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function renderNotificationSettings() {
  return `
    <div class="settings-panel">
      <div class="settings-section">
        <h3 class="settings-section-title">Notification Preferences</h3>
        <p style="font-size:var(--text-sm);color:var(--text-secondary);margin-bottom:var(--space-6)">Configure how and when you receive notifications.</p>

        <div class="settings-row">
          <div class="settings-row-info"><div class="settings-row-label">P1 Emergency Alerts</div><div class="settings-row-desc">Immediate push, email, and in-app notification</div></div>
          <label class="toggle"><input type="checkbox" checked><span class="toggle-slider"></span></label>
        </div>
        <div class="settings-row">
          <div class="settings-row-info"><div class="settings-row-label">Rent Arrears Escalations</div><div class="settings-row-desc">Notify when arrears exceed 14 days</div></div>
          <label class="toggle"><input type="checkbox" checked><span class="toggle-slider"></span></label>
        </div>
        <div class="settings-row">
          <div class="settings-row-info"><div class="settings-row-label">Contractor Compliance Alerts</div><div class="settings-row-desc">Alert when documents are expiring or expired</div></div>
          <label class="toggle"><input type="checkbox" checked><span class="toggle-slider"></span></label>
        </div>
        <div class="settings-row">
          <div class="settings-row-info"><div class="settings-row-label">Viewing Follow-Up Reminders</div><div class="settings-row-desc">Notify after viewings for follow-up action</div></div>
          <label class="toggle"><input type="checkbox" checked><span class="toggle-slider"></span></label>
        </div>
        <div class="settings-row">
          <div class="settings-row-info"><div class="settings-row-label">Daily Summary Email</div><div class="settings-row-desc">End-of-day digest of all agent actions</div></div>
          <label class="toggle"><input type="checkbox"><span class="toggle-slider"></span></label>
        </div>
        <div class="settings-row">
          <div class="settings-row-info"><div class="settings-row-label">Repeat Issue Warnings</div><div class="settings-row-desc">Alert when a property has 3+ jobs of the same type</div></div>
          <label class="toggle"><input type="checkbox" checked><span class="toggle-slider"></span></label>
        </div>

        <button class="btn btn--primary" style="margin-top:var(--space-4)">Save Preferences</button>
      </div>
    </div>
  `;
}

function switchSettingsTab(tab) {
  document.querySelectorAll('.settings-nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.settings === tab);
  });

  const content = document.getElementById('settings-content');
  switch(tab) {
    case 'agents': content.innerHTML = renderAgentSettings(); break;
    case 'integrations': content.innerHTML = renderIntegrationsSettings(); break;
    case 'roles': content.innerHTML = renderRolesSettings(); break;
    case 'notifications': content.innerHTML = renderNotificationSettings(); break;
  }
}

function initSettings() {
  // No special init needed
}
