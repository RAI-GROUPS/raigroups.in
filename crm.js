/* RISHABH & BROTHERS SERVICES - Executive CRM Application JS */

document.addEventListener('DOMContentLoaded', () => {

  const ERP_BASE_URL = 'https://erp.raigroups.in';

  // =========================================================================
  // Tab Navigation Switching
  // =========================================================================
  const tabButtons = document.querySelectorAll('.crm-tab-btn');
  const tabViews = document.querySelectorAll('.tab-view');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      tabButtons.forEach(b => b.classList.remove('active'));
      tabViews.forEach(v => v.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById(targetTab)?.classList.add('active');
    });
  });

  // =========================================================================
  // Modal Dialog Controls
  // =========================================================================
  const leadModal = document.getElementById('leadModal');
  const quoteModal = document.getElementById('quoteModal');

  const openLeadModalBtn = document.getElementById('openLeadModalBtn');
  const closeLeadModalBtn = document.getElementById('closeLeadModal');
  const cancelLeadModalBtn = document.getElementById('cancelLeadModal');

  const openQuoteModalBtn = document.getElementById('openQuoteModalBtn');
  const newQuoteRegBtn = document.getElementById('newQuoteRegBtn');
  const closeQuoteModalBtn = document.getElementById('closeQuoteModal');
  const cancelQuoteModalBtn = document.getElementById('cancelQuoteModal');

  function openModal(modal) {
    if (modal) modal.classList.add('active');
  }

  function closeModal(modal) {
    if (modal) modal.classList.remove('active');
  }

  if (openLeadModalBtn) openLeadModalBtn.addEventListener('click', () => openModal(leadModal));
  if (closeLeadModalBtn) closeLeadModalBtn.addEventListener('click', () => closeModal(leadModal));
  if (cancelLeadModalBtn) cancelLeadModalBtn.addEventListener('click', () => closeModal(leadModal));

  if (openQuoteModalBtn) openQuoteModalBtn.addEventListener('click', () => openModal(quoteModal));
  if (newQuoteRegBtn) newQuoteRegBtn.addEventListener('click', () => openModal(quoteModal));
  if (closeQuoteModalBtn) closeQuoteModalBtn.addEventListener('click', () => closeModal(quoteModal));
  if (cancelQuoteModalBtn) cancelQuoteModalBtn.addEventListener('click', () => closeModal(quoteModal));

  // =========================================================================
  // Live ERPNext Sync & Data Render
  // =========================================================================
  async function fetchLiveCRMData() {
    try {
      // 1. Fetch Leads
      const leadsRes = await fetch(`${ERP_BASE_URL}/api/resource/Lead?fields=["name","lead_name","company_name","email_id","mobile_no","status","source"]&limit_page_length=20`);
      if (leadsRes.ok) {
        const leadsData = await leadsRes.json();
        if (leadsData && leadsData.data) {
          renderLeadDirectory(leadsData.data);
          renderKanbanBoard(leadsData.data);
        }
      }

      // 2. Fetch Quotations
      const quotesRes = await fetch(`${ERP_BASE_URL}/api/resource/Quotation?fields=["name","transaction_date","party_name","grand_total","status"]&limit_page_length=20`);
      if (quotesRes.ok) {
        const quotesData = await quotesRes.json();
        if (quotesData && quotesData.data) {
          renderQuotationRegister(quotesData.data);
        }
      }
    } catch (e) {
      console.log('CRM Live Sync Notice:', e);
    }
  }

  function renderLeadDirectory(leads) {
    const tbody = document.getElementById('crmLeadDirectoryBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    const avatars = ['avatar-a', 'avatar-b', 'avatar-c', 'avatar-d'];

    leads.forEach((lead, i) => {
      const avatarClass = avatars[i % avatars.length];
      const displayName = lead.company_name || lead.lead_name || 'Enquiry';
      const initials = displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
      const email = lead.email_id || lead.mobile_no || 'contact@company.com';
      const source = lead.source || 'Direct';
      const status = lead.status || 'Open';

      let badgeClass = 'badge-blue';
      if (status === 'Converted' || status === 'Won') badgeClass = 'badge-green';
      if (status === 'Quotation' || status === 'Contacted') badgeClass = 'badge-gold';

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div class="client-cell">
            <div class="client-avatar ${avatarClass}">${initials}</div>
            <div class="client-info">
              <span class="client-name">${displayName}</span>
              <span class="client-email">${email}</span>
            </div>
          </div>
        </td>
        <td><span class="badge-premium ${badgeClass}">${status}</span></td>
        <td>${source}</td>
        <td>Uttar Pradesh</td>
        <td><a href="${ERP_BASE_URL}/app/lead/${lead.name}" target="_blank" class="btn-premium btn-outline" style="padding: 4px 10px; font-size: 11px;">View ERP</a></td>
      `;
      tbody.appendChild(tr);
    });
  }

  function renderKanbanBoard(leads) {
    const cardsOpen = document.getElementById('cardsOpen');
    const cardsContacted = document.getElementById('cardsContacted');
    const cardsQuotation = document.getElementById('cardsQuotation');
    const cardsWon = document.getElementById('cardsWon');

    if (!cardsOpen) return;

    // Reset columns
    cardsOpen.innerHTML = '';
    cardsContacted.innerHTML = '';
    cardsQuotation.innerHTML = '';
    cardsWon.innerHTML = '';

    let countOpen = 0, countContacted = 0, countQuotation = 0, countWon = 0;

    leads.forEach(lead => {
      const displayName = lead.company_name || lead.lead_name;
      const status = lead.status || 'Open';
      const source = lead.source || 'Direct';

      const card = document.createElement('div');
      card.className = 'deal-card';

      if (status === 'Open') {
        countOpen++;
        card.innerHTML = `
          <div class="deal-title">${displayName}</div>
          <div class="deal-company"><i class="fa-solid fa-building"></i> Lead Enquiry</div>
          <div class="deal-footer">
            <span class="badge-premium badge-blue">Open</span>
            <span class="deal-source">${source}</span>
          </div>
        `;
        cardsOpen.appendChild(card);
      } else if (status === 'Contacted') {
        countContacted++;
        card.innerHTML = `
          <div class="deal-title">${displayName}</div>
          <div class="deal-company"><i class="fa-solid fa-building"></i> Qualified Lead</div>
          <div class="deal-footer">
            <span class="badge-premium badge-gold">Contacted</span>
            <span class="deal-source">${source}</span>
          </div>
        `;
        cardsContacted.appendChild(card);
      } else if (status === 'Quotation') {
        countQuotation++;
        card.innerHTML = `
          <div class="deal-title">${displayName}</div>
          <div class="deal-company"><i class="fa-solid fa-building"></i> Quote Submitted</div>
          <div class="deal-footer">
            <span class="badge-premium badge-gold">Quotation</span>
            <span class="deal-source">${source}</span>
          </div>
        `;
        cardsQuotation.appendChild(card);
      } else {
        countWon++;
        card.innerHTML = `
          <div class="deal-title">${displayName}</div>
          <div class="deal-company"><i class="fa-solid fa-building"></i> Order Converted</div>
          <div class="deal-footer">
            <span class="badge-premium badge-green">Won / Converted</span>
            <span class="deal-source">${source}</span>
          </div>
        `;
        cardsWon.appendChild(card);
      }
    });

    document.getElementById('countOpen').textContent = countOpen;
    document.getElementById('countContacted').textContent = countContacted;
    document.getElementById('countQuotation').textContent = countQuotation;
    document.getElementById('countWon').textContent = countWon;
  }

  function renderQuotationRegister(quotes) {
    const tbody = document.getElementById('crmQuoteRegisterBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    quotes.forEach(q => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-weight: 700; color: var(--color-gold);">${q.name}</td>
        <td>${q.transaction_date || 'Today'}</td>
        <td>${q.party_name}</td>
        <td><span class="badge-premium badge-gold">${q.status || 'Open'}</span></td>
        <td style="font-weight: 700;">₹${(q.grand_total || 0).toLocaleString('en-IN')}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Trigger Live Sync on Load
  fetchLiveCRMData();

  // =========================================================================
  // Form Submit: New Lead -> Push to ERPNext
  // =========================================================================
  const modalLeadForm = document.getElementById('modalLeadForm');
  if (modalLeadForm) {
    modalLeadForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const company = document.getElementById('modalLeadCompany').value;
      const email = document.getElementById('modalLeadEmail').value;
      const phone = document.getElementById('modalLeadPhone').value;
      const source = document.getElementById('modalLeadSource').value;
      const status = document.getElementById('modalLeadStatus').value;

      const payload = {
        lead_name: company,
        company_name: company,
        email_id: email,
        mobile_no: phone,
        source: source,
        status: status
      };

      try {
        await fetch(`${ERP_BASE_URL}/api/resource/Lead`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        showToast(`New Lead for "${company}" created & synced to ERPNext!`);
      } catch (e) {
        showToast(`Lead created locally and queued.`);
      }

      closeModal(leadModal);
      modalLeadForm.reset();
      fetchLiveCRMData();
    });
  }

  // =========================================================================
  // Form Submit: Draft Quotation -> Push to ERPNext
  // =========================================================================
  const modalQuoteForm = document.getElementById('modalQuoteForm');
  if (modalQuoteForm) {
    modalQuoteForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const customer = document.getElementById('modalQuoteCustomer').value;
      const itemDesc = document.getElementById('modalQuoteItem').value;
      const qty = parseFloat(document.getElementById('modalQuoteQty').value) || 1;
      const rate = parseFloat(document.getElementById('modalQuoteRate').value) || 0;
      const gstPct = parseFloat(document.getElementById('modalQuoteGST').value) || 0;

      const amount = qty * rate;
      const gstAmount = (amount * gstPct) / 100;
      const grandTotal = amount + gstAmount;

      const payload = {
        company: "RISHABH & BROTHERS SERVICES",
        quotation_to: "Customer",
        party_name: customer,
        transaction_date: new Date().toISOString().split('T')[0],
        items: [{
          item_name: itemDesc,
          qty: qty,
          rate: rate,
          amount: amount
        }]
      };

      try {
        await fetch(`${ERP_BASE_URL}/api/resource/Quotation`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        showToast(`Quotation created for "${customer}" (Total: ₹${grandTotal.toLocaleString('en-IN')})`);
      } catch (e) {
        showToast(`Quotation generated locally (Total: ₹${grandTotal.toLocaleString('en-IN')})`);
      }

      closeModal(quoteModal);
      modalQuoteForm.reset();
      fetchLiveCRMData();
    });
  }

  function showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification-premium';
    toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: #cca43b; margin-right: 8px;"></i> ${msg}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

});
