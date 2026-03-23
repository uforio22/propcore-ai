// ===== PropCore AI — Communications Page =====

function renderCommunications() {
  const allComms = ACTIVITY_FEED.map(a => ({
    ...a,
    channel: a.agent === 'rent' ? 'Email' : (Math.random() > 0.5 ? 'Email' : 'In-app'),
    status: 'Sent'
  }));

  return `
    <div class="page-header">
      <div>
        <h1 class="page-title">Communications</h1>
        <p class="page-subtitle">Full audit trail of all agent communications</p>
      </div>
      <button class="btn btn--secondary btn--sm">📊 Export Log</button>
    </div>

    <div class="filter-bar">
      <div class="topbar-search" style="position:relative">
        <svg class="search-icon" viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/></svg>
        <input type="text" class="search-input" id="comm-search" placeholder="Search communications...">
      </div>
      <button class="filter-btn active" data-agent="all">All Agents</button>
      <button class="filter-btn" data-agent="tenant">Tenant Support</button>
      <button class="filter-btn" data-agent="maintenance">Maintenance</button>
      <button class="filter-btn" data-agent="rent">Rent Chase</button>
      <button class="filter-btn" data-agent="contractor">Contractor</button>
      <button class="filter-btn" data-agent="viewings">Viewings</button>
      <select class="filter-select" id="comm-channel-filter">
        <option value="all">All Channels</option>
        <option value="Email">Email</option>
        <option value="In-app">In-app</option>
      </select>
    </div>

    <div class="card" id="comm-list">
      ${renderCommItems(allComms)}
    </div>
  `;
}

function renderCommItems(comms) {
  const iconMap = {
    tenant: { bg: '#ede9fe', color: '#6d28d9', icon: '👤' },
    maintenance: { bg: 'var(--p2-bg)', color: '#b45309', icon: '🔧' },
    rent: { bg: 'var(--status-good-bg)', color: 'var(--status-good-text)', icon: '💷' },
    contractor: { bg: 'var(--p3-bg)', color: '#1d4ed8', icon: '📋' },
    viewings: { bg: '#fce7f3', color: '#9d174d', icon: '📅' }
  };

  return comms.map(c => {
    const ic = iconMap[c.agent] || iconMap.tenant;
    return `
      <div class="comm-item" data-agent="${c.agent}" data-channel="${c.channel}">
        <div class="comm-icon" style="background:${ic.bg};color:${ic.color}">${ic.icon}</div>
        <div class="comm-body">
          <div class="comm-subject">${c.text}</div>
          <div class="comm-meta">
            ${agentBadge(c.agent)}
            <span style="font-size:var(--text-xs);color:var(--text-muted)">${c.channel}</span>
            ${c.property ? `<span style="font-size:var(--text-xs);color:var(--text-muted)">· ${c.property}</span>` : ''}
          </div>
        </div>
        <div style="text-align:right;white-space:nowrap;flex-shrink:0">
          <div style="font-size:var(--text-xs);color:var(--text-muted)">${timeAgo(c.time)}</div>
          <div style="margin-top:4px"><span class="badge badge--green" style="font-size:10px">Sent</span></div>
        </div>
      </div>
    `;
  }).join('');
}

function initCommunications() {
  setTimeout(() => {
    // Search
    document.getElementById('comm-search')?.addEventListener('input', () => filterComms());

    // Agent filter buttons
    document.querySelectorAll('.filter-bar .filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-bar .filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterComms();
      });
    });

    // Channel filter
    document.getElementById('comm-channel-filter')?.addEventListener('change', () => filterComms());
  }, 50);
}

function filterComms() {
  const query = document.getElementById('comm-search')?.value?.toLowerCase() || '';
  const agentFilter = document.querySelector('.filter-bar .filter-btn.active')?.dataset?.agent || 'all';
  const channelFilter = document.getElementById('comm-channel-filter')?.value || 'all';

  document.querySelectorAll('.comm-item').forEach(item => {
    const matchAgent = agentFilter === 'all' || item.dataset.agent === agentFilter;
    const matchChannel = channelFilter === 'all' || item.dataset.channel === channelFilter;
    const matchQuery = !query || item.textContent.toLowerCase().includes(query);
    item.style.display = (matchAgent && matchChannel && matchQuery) ? 'flex' : 'none';
  });
}
