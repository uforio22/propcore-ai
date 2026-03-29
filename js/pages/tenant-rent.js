// ===== PropCore AI — Tenant Portal: Rent & Payments =====

function renderTenantRent() {
  const t = window.currentTenant;
  const rentRecord = RENT_RECORDS.find(r => r.tenantName === t.name);
  const status = rentRecord ? rentRecord.status : 'Paid';
  const overdue = rentRecord ? rentRecord.daysOverdue : 0;
  const paid = rentRecord ? rentRecord.amountPaid : t.rent;
  const due = rentRecord ? rentRecord.amountDue : t.rent;
  const balance = due - paid;

  // Mock 12-month payment history
  const months = ['Apr 25','May 25','Jun 25','Jul 25','Aug 25','Sep 25','Oct 25','Nov 25','Dec 25','Jan 26','Feb 26','Mar 26'];
  const history = months.map((m, i) => ({
    month: m,
    amount: t.rent,
    status: i < 11 ? 'Paid' : status,
    paidDate: i < 11 ? m.replace(' ', ' 20') : (status === 'Paid' ? 'Mar 2026' : '—'),
    method: i % 3 === 0 ? 'Bank Transfer' : 'Standing Order',
  }));

  return `
    <h1 class="tp-page-title">Rent & Payments</h1>
    <p class="tp-page-subtitle">Manage your rent, view payment history, and make payments</p>

    <div class="tp-stats">
      <div class="tp-stat-card">
        <span class="tp-stat-label">Monthly Rent</span>
        <span class="tp-stat-value">${currencyFormat(t.rent)}</span>
        <div class="tp-stat-sub">Due 1st of each month</div>
      </div>
      <div class="tp-stat-card">
        <span class="tp-stat-label">Current Status</span>
        <span class="tp-stat-value" style="color:${status === 'Paid' ? 'var(--status-good)' : status === 'Overdue' ? 'var(--status-urgent)' : 'var(--status-warning)'}">${status}</span>
        <div class="tp-stat-sub">${overdue > 0 ? overdue + ' days overdue' : 'Up to date'}</div>
      </div>
      <div class="tp-stat-card">
        <span class="tp-stat-label">Outstanding Balance</span>
        <span class="tp-stat-value" style="color:${balance > 0 ? 'var(--status-urgent)' : 'var(--status-good)'}">${balance > 0 ? currencyFormat(balance) : '£0.00'}</span>
        <div class="tp-stat-sub">${balance > 0 ? 'Payment needed' : 'Nothing owed'}</div>
      </div>
      <div class="tp-stat-card">
        <span class="tp-stat-label">Next Due Date</span>
        <span class="tp-stat-value" style="font-size:var(--text-xl)">1 Apr</span>
        <div class="tp-stat-sub">${currencyFormat(t.rent)}</div>
      </div>
    </div>

    ${balance > 0 ? `
      <div class="tp-card" style="border-left:3px solid var(--status-urgent)">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:var(--space-3)">
          <div>
            <div style="font-weight:700;color:var(--status-urgent)">⚠️ Outstanding Balance: ${currencyFormat(balance)}</div>
            <div style="font-size:var(--text-sm);color:var(--text-secondary);margin-top:var(--space-1)">Please make a payment as soon as possible to avoid further action.</div>
          </div>
          <button class="tp-pay-btn" onclick="showPaymentModal()">💳 Make a Payment</button>
        </div>
      </div>
    ` : `
      <div class="tp-card" style="border-left:3px solid var(--status-good)">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:var(--space-3)">
          <div>
            <div style="font-weight:700;color:var(--status-good)">✅ All Paid — You're up to date</div>
            <div style="font-size:var(--text-sm);color:var(--text-secondary);margin-top:var(--space-1)">Your next rent payment of ${currencyFormat(t.rent)} is due on 1 April 2026.</div>
          </div>
          <button class="tp-pay-btn" onclick="showPaymentModal()">💳 Pay Early</button>
        </div>
      </div>
    `}

    <div class="tp-card">
      <div class="tp-card-title">📊 Payment History</div>
      <table class="tp-table">
        <thead>
          <tr>
            <th>Month</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date Paid</th>
            <th>Method</th>
          </tr>
        </thead>
        <tbody>
          ${history.reverse().map(h => `
            <tr>
              <td style="font-weight:600">${h.month}</td>
              <td>${currencyFormat(h.amount)}</td>
              <td>${h.status === 'Paid' ? '<span class="badge badge--green">Paid</span>' : h.status === 'Overdue' ? '<span class="badge badge--red">Overdue</span>' : '<span class="badge badge--amber">Due</span>'}</td>
              <td>${h.paidDate}</td>
              <td style="font-size:var(--text-xs)">${h.status === 'Paid' ? h.method : '—'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function showPaymentModal() {
  const t = window.currentTenant;
  const overlay = document.createElement('div');
  overlay.id = 'tp-pay-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:999;display:flex;align-items:center;justify-content:center';
  overlay.innerHTML = `
    <div style="background:#fff;border-radius:12px;padding:32px;max-width:420px;width:90%">
      <h3 style="font-size:var(--text-lg);font-weight:700;margin-bottom:var(--space-4)">💳 Make a Payment</h3>
      <div class="tp-form-group">
        <label class="tp-form-label">Amount</label>
        <input type="text" class="tp-form-input" value="${currencyFormat(t.rent)}" id="pay-amount">
      </div>
      <div class="tp-form-group">
        <label class="tp-form-label">Payment Method</label>
        <select class="tp-form-select" id="pay-method">
          <option>Bank Transfer</option>
          <option>Debit Card</option>
          <option>Credit Card</option>
        </select>
      </div>
      <div class="tp-form-group">
        <label class="tp-form-label">Reference</label>
        <input type="text" class="tp-form-input" value="${t.property} — ${t.name}" readonly>
      </div>
      <div style="display:flex;gap:var(--space-2);margin-top:var(--space-4)">
        <button class="tp-pay-btn" onclick="confirmPayment()" style="flex:1;justify-content:center">Confirm Payment</button>
        <button class="btn btn--secondary" onclick="document.getElementById('tp-pay-overlay').remove()" style="flex:1">Cancel</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
}

function confirmPayment() {
  document.getElementById('tp-pay-overlay').remove();
  const t = window.currentTenant;
  // Update rent record
  const rec = RENT_RECORDS.find(r => r.tenantName === t.name);
  if (rec) { rec.status = 'Paid'; rec.amountPaid = rec.amountDue; rec.daysOverdue = 0; }
  // Re-render
  document.getElementById('tp-page-content').innerHTML = renderTenantRent();
}

function initTenantRent() {}
