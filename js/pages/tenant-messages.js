// ===== PropCore AI — Tenant Portal: Messages =====

function renderTenantMessages() {
  const messages = TENANT_MESSAGES[window.currentTenantId] || [];
  const unread = messages.filter(m => !m.read).length;

  return `
    <h1 class="tp-page-title">Messages</h1>
    <p class="tp-page-subtitle">${messages.length} messages · ${unread > 0 ? unread + ' unread' : 'all read'}</p>

    <div class="tp-card" style="padding:0;overflow:hidden">
      <div style="padding:var(--space-4);border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between">
        <div style="font-size:var(--text-sm);font-weight:600;display:flex;align-items:center;gap:var(--space-2)">
          💬 Conversation with PropCore
          <span style="font-size:10px;color:var(--text-muted);font-weight:400">Replies powered by AI agents</span>
        </div>
        ${unread > 0 ? `<span class="badge badge--red">${unread} new</span>` : '<span class="badge badge--green">Up to date</span>'}
      </div>

      <div class="tp-chat" id="tp-chat-container" style="padding:var(--space-4);max-height:550px">
        ${messages.map(m => {
          if (m.from === 'tenant') {
            return `
              <div class="tp-chat-bubble tp-chat-bubble--tenant">
                ${m.text}
                <div class="tp-chat-meta">${formatChatTime(m.time)}</div>
              </div>
            `;
          } else {
            return `
              <div class="tp-chat-bubble tp-chat-bubble--agent" ${!m.read ? 'style="border-left:3px solid var(--primary)"' : ''}>
                <div class="tp-chat-agent-label">🤖 ${m.agent} Agent</div>
                ${m.text}
                <div class="tp-chat-meta">${formatChatTime(m.time)} ${!m.read ? '· <strong style="color:var(--primary)">New</strong>' : ''}</div>
              </div>
            `;
          }
        }).join('')}
      </div>

      <div class="tp-compose" style="padding:var(--space-4);margin-top:0;border-top:1px solid var(--border)">
        <input type="text" class="tp-compose-input" id="tp-msg-input" placeholder="Type a message...">
        <button class="tp-pay-btn" onclick="sendTenantMessage()" style="padding:10px 20px">Send</button>
      </div>
    </div>

    <div style="text-align:center;margin-top:var(--space-4);font-size:var(--text-xs);color:var(--text-muted)">
      Messages are handled by PropCore's AI agents and logged automatically. For emergencies, call <strong>0117 456 7890</strong>.
    </div>
  `;
}

function sendTenantMessage() {
  const input = document.getElementById('tp-msg-input');
  const text = input?.value?.trim();
  if (!text) return;

  const messages = TENANT_MESSAGES[window.currentTenantId];
  if (!messages) return;

  // Add tenant message
  messages.push({
    id: 'MSG-' + Date.now(),
    from: 'tenant',
    text: text,
    time: new Date().toISOString(),
    read: true,
  });

  input.value = '';

  // Simulate AI response
  setTimeout(() => {
    messages.push({
      id: 'MSG-' + (Date.now() + 1),
      from: 'agent',
      agent: 'Tenant Support',
      text: "Thanks for your message. I've noted your query and will get back to you shortly. If this is urgent, please call us on 0117 456 7890.",
      time: new Date().toISOString(),
      read: true,
    });
    document.getElementById('tp-page-content').innerHTML = renderTenantMessages();
    initTenantMessages();
  }, 800);

  // Re-render to show the sent message
  document.getElementById('tp-page-content').innerHTML = renderTenantMessages();
  initTenantMessages();
}

function formatChatTime(isoStr) {
  const d = new Date(isoStr);
  const day = d.getDate();
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const hrs = String(d.getHours()).padStart(2, '0');
  const mins = String(d.getMinutes()).padStart(2, '0');
  return `${day} ${months[d.getMonth()]} · ${hrs}:${mins}`;
}

function initTenantMessages() {
  // Scroll chat to bottom
  setTimeout(() => {
    const chat = document.getElementById('tp-chat-container');
    if (chat) chat.scrollTop = chat.scrollHeight;

    // Mark messages as read
    const messages = TENANT_MESSAGES[window.currentTenantId] || [];
    messages.forEach(m => m.read = true);
    const badge = document.getElementById('tp-msg-badge');
    if (badge) { badge.textContent = '0'; badge.style.display = 'none'; }

    // Enter key to send
    document.getElementById('tp-msg-input')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') sendTenantMessage();
    });
  }, 50);
}
