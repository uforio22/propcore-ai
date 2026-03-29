// ===== PropCore AI — Tenant Portal: Documents =====

function renderTenantDocuments() {
  const docs = TENANT_DOCUMENTS[window.currentTenantId] || [];
  const categories = ['Tenancy', 'Safety', 'Correspondence'];

  return `
    <h1 class="tp-page-title">Documents</h1>
    <p class="tp-page-subtitle">${docs.length} documents available for your tenancy</p>

    ${categories.map(cat => {
      const catDocs = docs.filter(d => d.category === cat);
      if (catDocs.length === 0) return '';
      return `
        <div class="tp-card">
          <div class="tp-card-title">${cat === 'Tenancy' ? '📋' : cat === 'Safety' ? '🔒' : '✉️'} ${cat} Documents</div>
          ${catDocs.map(d => `
            <div class="tp-doc-item">
              <div class="tp-doc-icon">${d.icon}</div>
              <div class="tp-doc-info">
                <div class="tp-doc-name">${d.name}</div>
                <div class="tp-doc-date">${d.type} · ${formatDate(d.date)} · ${d.fileType}</div>
              </div>
              <button class="tp-doc-download" onclick="alert('Download: ${d.name}\\n\\nThis is a demo — in production this would download the actual ${d.fileType} file.')">⬇ Download</button>
            </div>
          `).join('')}
        </div>
      `;
    }).join('')}

    <div class="tp-card" style="background:var(--bg-secondary);text-align:center;padding:var(--space-6)">
      <div style="font-size:var(--text-sm);color:var(--text-muted)">Need a document that's not listed here?</div>
      <button class="btn btn--secondary btn--sm" style="margin-top:var(--space-2)" onclick="tpNavigateTo('messages')">💬 Message the Agency</button>
    </div>
  `;
}

function initTenantDocuments() {}
