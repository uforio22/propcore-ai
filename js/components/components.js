// ===== PropCore AI — Shared Component Helpers =====

function statusBadge(status) {
  const map = {
    'Paid': 'green', 'Occupied': 'green', 'Active': 'green', 'Completed': 'green', 'Closed': 'green', 'Offer Made': 'green',
    'Late': 'amber', 'Partially Let': 'amber', 'Partial': 'amber', 'Scheduled': 'amber', 'Contractor Assigned': 'amber', 'Qualified': 'amber', 'Booked': 'amber',
    'Overdue': 'red', 'Void': 'red', 'Expired Docs': 'red', 'Logged': 'red', 'In Progress': 'blue', 'Enquiry': 'blue',
    'Cold': 'gray', 'Completed': 'green'
  };
  const color = map[status] || 'gray';
  return `<span class="badge badge--${color}">${status}</span>`;
}

function priorityTag(priority) {
  const p = priority.toLowerCase();
  const labels = { p1: 'P1 — Emergency', p2: 'P2 — Urgent', p3: 'P3 — Routine' };
  return `<span class="priority-tag priority-tag--${p}">${labels[p] || priority}</span>`;
}

function agentBadge(agent) {
  const map = {
    'tenant': 'Tenant Support', 'maintenance': 'Maintenance', 'rent': 'Rent Chase',
    'contractor': 'Contractor Booking', 'viewings': 'Viewings'
  };
  return `<span class="agent-badge agent-badge--${agent}">${map[agent] || agent}</span>`;
}

function starRating(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return `<span class="stars">${'★'.repeat(full)}${half ? '★' : ''}${'★'.repeat(empty).split('').map(() => '<span class="star-empty">★</span>').join('')}</span> <span style="font-size:var(--text-xs);color:var(--text-muted)">${rating}</span>`;
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatDateTime(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

function timeAgo(dateStr) {
  const now = new Date('2026-03-23T14:53:00');
  const d = new Date(dateStr);
  const mins = Math.floor((now - d) / 60000);
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr${hrs > 1 ? 's' : ''} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

function searchFilter(items, query, fields) {
  if (!query) return items;
  const q = query.toLowerCase();
  return items.filter(item => fields.some(f => (item[f] || '').toLowerCase().includes(q)));
}

function initials(name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function currencyFormat(amount) {
  return '£' + amount.toLocaleString('en-GB');
}

// Mini SVG line chart (no dependencies)
function drawMiniLineChart(containerId, data, color = '#10b981') {
  const container = document.getElementById(containerId);
  if (!container) return;
  const w = container.offsetWidth || 300;
  const h = container.offsetHeight || 120;
  const max = Math.max(...data);
  const min = Math.min(...data) - 5;
  const range = max - min || 1;
  const stepX = w / (data.length - 1);

  const points = data.map((v, i) => {
    const x = i * stepX;
    const y = h - ((v - min) / range) * (h - 20) - 10;
    return `${x},${y}`;
  });

  const areaPoints = `0,${h} ${points.join(' ')} ${w},${h}`;

  container.innerHTML = `
    <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="display:block">
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${color}" stop-opacity="0.15"/>
          <stop offset="100%" stop-color="${color}" stop-opacity="0.01"/>
        </linearGradient>
      </defs>
      <polygon points="${areaPoints}" fill="url(#chartGrad)"/>
      <polyline points="${points.join(' ')}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
      ${data.map((v, i) => {
        const x = i * stepX;
        const y = h - ((v - min) / range) * (h - 20) - 10;
        return i === data.length - 1 ? `<circle cx="${x}" cy="${y}" r="3.5" fill="${color}" stroke="white" stroke-width="2"/>` : '';
      }).join('')}
    </svg>
  `;
}
