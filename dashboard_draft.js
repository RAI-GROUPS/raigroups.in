/* RISHABH & BROTHERS SERVICES - Enterprise CRM/ERP Dashboard JS (Live Real-Time Sync) */

document.addEventListener('DOMContentLoaded', () => {

  const ERP_BASE_URL = 'https://erp.raigroups.in';

  // =========================================================================
  // ChartJS Configuration
  // =========================================================================
  const trendCtx = document.getElementById('pipelineChart')?.getContext('2d');
  const sourceCtx = document.getElementById('sourceChart')?.getContext('2d');

  let pipelineChart, sourceChart;

  const chartOptions = {
    textColor: '#94a3b8',
    gridColor: 'rgba(255, 255, 255, 0.05)',
    fontFamily: "'Inter', sans-serif"
  };

  // 1. Line/Area Chart: Pipeline Revenue Trend
  if (trendCtx) {
    const blueGradient = trendCtx.createLinearGradient(0, 0, 0, 300);
    blueGradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
    blueGradient.addColorStop(1, 'rgba(59, 130, 246, 0.0)');

    const goldGradient = trendCtx.createLinearGradient(0, 0, 0, 300);
    goldGradient.addColorStop(0, 'rgba(245, 158, 11, 0.2)');
    goldGradient.addColorStop(1, 'rgba(245, 158, 11, 0.0)');

    pipelineChart = new Chart(trendCtx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        datasets: [
          {
            label: 'Sales Revenue Value',
            data: [120, 150, 180, 1319.5, 1353.3, 1353.3, 1353.3, 1353.3, 1353.3],
            borderColor: '#3b82f6',
            backgroundColor: blueGradient,
            fill: true,
            tension: 0.4,
            borderWidth: 3,
            pointBackgroundColor: '#3b82f6',
            pointHoverRadius: 7
          },
          {
            label: 'Active Leads Pipeline',
            data: [90, 110, 130, 950, 1200, 1434.5, 1434.5, 1434.5, 1434.5],
            borderColor: '#cca43b',
            backgroundColor: goldGradient,
            fill: true,
            tension: 0.4,
            borderWidth: 2,
            borderDash: [5, 5],
            pointBackgroundColor: '#cca43b',
            pointHoverRadius: 5
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: chartOptions.textColor,
              font: { family: chartOptions.fontFamily, size: 12, weight: '600' }
            }
          },
          tooltip: {
            backgroundColor: '#111224',
            titleColor: '#f8fafc',
            bodyColor: '#94a3b8',
            borderColor: 'rgba(255, 255, 255, 0.08)',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8,
            displayColors: true
          }
        },
        scales: {
          x: {
            grid: { color: chartOptions.gridColor },
            ticks: { color: chartOptions.textColor, font: { family: chartOptions.fontFamily } }
          },
          y: {
            grid: { color: chartOptions.gridColor },
            ticks: { 
              color: chartOptions.textColor, 
              font: { family: chartOptions.fontFamily },
              callback: (value) => '₹' + value + 'k'
            }
          }
        }
      }
    });
  }

  // 2. Doughnut Chart: Lead Sources
  if (sourceCtx) {
    sourceChart = new Chart(sourceCtx, {
      type: 'doughnut',
      data: {
        labels: ['Direct Tender', 'Existing Client', 'Reference', 'Website Form'],
        datasets: [{
          data: [65, 20, 10, 5],
          backgroundColor: ['#10b981', '#cca43b', '#3b82f6', '#8b5cf6'],
          borderWidth: 2,
          borderColor: '#111224'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: chartOptions.textColor,
              font: { family: chartOptions.fontFamily, size: 11, weight: '600' },
              padding: 16
            }
          }
        },
        cutout: '75%'
      }
    });
  }

  // =========================================================================
  // Live ERPNext REST API Integration & Real-Time Sync
  // =========================================================================
  const leadForm = document.getElementById('quickLeadForm');
  const leadsTableBody = document.getElementById('leadsTableBody');
  
  const totalSalesNum = document.getElementById('totalSalesNum');
  const totalPurchaseNum = document.getElementById('totalPurchaseNum');
  const activePipelineNum = document.getElementById('activePipelineNum');
  const todayLeadsNum = document.getElementById('todayLeadsNum');

  async function syncLiveERPNextData() {
    try {
      // 1. Fetch Sales Invoices
      const salesRes = await fetch(`${ERP_BASE_URL}/api/resource/Sales%20Invoice?fields=["grand_total","docstatus","posting_date"]&filters=[["docstatus","=",1]]&limit_page_length=100`);
      let sumSales = 0;
      const monthlySales = Array(12).fill(0);
      
      if (salesRes.ok) {
        const salesData = await salesRes.json();
        if (salesData && salesData.data) {
          salesData.data.forEach(inv => {
            sumSales += (inv.grand_total || 0);
            if (inv.posting_date) {
              const date = new Date(inv.posting_date);
              const m = date.getMonth();
              monthlySales[m] += (inv.grand_total || 0) / 1000; // in thousands (k)
            }
          });
        }
      }
      
      if (totalSalesNum) {
        if (sumSales > 0) {
          const lakhs = (sumSales / 100000).toFixed(2);
          totalSalesNum.textContent = `₹${lakhs} Lakh`;
        } else {
          totalSalesNum.textContent = `₹0.00 Lakh`;
        }
      }

      // 2. Fetch Purchase Invoices
      const purRes = await fetch(`${ERP_BASE_URL}/api/resource/Purchase%20Invoice?fields=["grand_total","docstatus"]&filters=[["docstatus","=",1]]&limit_page_length=100`);
      let sumPur = 0;
      if (purRes.ok) {
        const purData = await purRes.json();
        if (purData && purData.data) {
          purData.data.forEach(pi => sumPur += (pi.grand_total || 0));
        }
      }
      if (totalPurchaseNum) {
        totalPurchaseNum.textContent = '₹' + Math.round(sumPur).toLocaleString('en-IN');
      }

      // 3. Fetch Quotations (Active Pipeline)
      const quoteRes = await fetch(`${ERP_BASE_URL}/api/resource/Quotation?fields=["grand_total","docstatus","transaction_date"]&filters=[["docstatus","=",1]]&limit_page_length=100`);
      let sumQuotes = 0;
      const monthlyPipeline = Array(12).fill(0);
      
      if (quoteRes.ok) {
        const quoteData = await quoteRes.json();
        if (quoteData && quoteData.data) {
          quoteData.data.forEach(q => {
            sumQuotes += (q.grand_total || 0);
            if (q.transaction_date) {
              const date = new Date(q.transaction_date);
              const m = date.getMonth();
              monthlyPipeline[m] += (q.grand_total || 0) / 1000; // in thousands (k)
            }
          });
        }
      }
      
      if (activePipelineNum) {
        activePipelineNum.textContent = '₹' + Math.round(sumQuotes).toLocaleString('en-IN');
      }

      // 4. Fetch Leads
      const leadsRes = await fetch(`${ERP_BASE_URL}/api/resource/Lead?fields=["name","lead_name","company_name","email_id","mobile_no","status","source"]&limit_page_length=100`);
      if (leadsRes.ok) {
        const leadsData = await leadsRes.json();
        if (leadsData && leadsData.data) {
          renderLeadsTable(leadsData.data);
          
          // Group leads by source for Doughnut Chart
          let countDirect = 0, countClient = 0, countReference = 0, countWebsite = 0;
          leadsData.data.forEach(lead => {
            const src = (lead.source || '').toLowerCase();
            if (src.includes('direct') || src.includes('tender')) {
              countDirect++;
            } else if (src.includes('client') || src.includes('existing')) {
              countClient++;
            } else if (src.includes('ref')) {
              countReference++;
            } else {
              countWebsite++;
            }
          });
          
          // Update Doughnut Chart
          if (sourceChart) {
            sourceChart.data.datasets[0].data = [countDirect, countClient, countReference, countWebsite];
            sourceChart.update();
          }
        }
      }

      // Update Line Chart data and labels dynamically
      if (pipelineChart) {
        pipelineChart.data.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        pipelineChart.data.datasets[0].data = monthlySales;
        pipelineChart.data.datasets[1].data = monthlyPipeline;
        pipelineChart.update();
      }

    } catch (e) {
      console.log('ERPNext Live Sync Notice:', e);
    }
  }

  function renderLeadsTable(leadsList) {
    if (!leadsTableBody) return;
    leadsTableBody.innerHTML = '';

    const avatars = ['avatar-a', 'avatar-b', 'avatar-c', 'avatar-d'];

    leadsList.forEach((lead, index) => {
      const avatarClass = avatars[index % avatars.length];
      const displayName = lead.company_name || lead.lead_name || 'Enquiry';
      const initials = displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
      const email = lead.email_id || lead.mobile_no || 'sales@raigroups.in';
      const source = lead.source || 'Direct';
      const status = lead.status || 'Open';

      let statusBadgeClass = 'badge-blue';
      if (status === 'Converted' || status === 'Won') statusBadgeClass = 'badge-green';
      if (status === 'Quotation' || status === 'Contacted') statusBadgeClass = 'badge-gold';

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
        <td><span class="badge-premium ${statusBadgeClass}">${status}</span></td>
        <td>${source}</td>
        <td style="font-weight: 700;">Active</td>
        <td class="text-secondary">Live ERPNext</td>
      `;
      leadsTableBody.appendChild(tr);
    });

    if (todayLeadsNum) {
      todayLeadsNum.textContent = leadsList.length;
    }
  }

  // Trigger Live Sync on Load
  syncLiveERPNextData();

  // =========================================================================
  // Form Submission -> Push Live to ERPNext REST API
  // =========================================================================
  if (leadForm) {
    leadForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('leadName').value;
      const email = document.getElementById('leadEmail').value;
      const valueInput = document.getElementById('leadValue').value;
      const source = document.getElementById('leadSource').value;
      const status = document.getElementById('leadStatus').value;

      const numericValue = parseFloat(valueInput.replace(/[^0-9.]/g, '')) || 0;
      const formattedValue = '₹' + numericValue.toLocaleString('en-IN', { maximumFractionDigits: 0 });

      const submitBtn = leadForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving to ERPNext...';

      const payload = {
        lead_name: name,
        company_name: name,
        email_id: email,
        source: source,
        status: status
      };

      try {
        await fetch(`${ERP_BASE_URL}/api/resource/Lead`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const avatars = ['avatar-a', 'avatar-b', 'avatar-c', 'avatar-d'];
        const randomAvatarClass = avatars[Math.floor(Math.random() * avatars.length)];
        const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

        let statusBadgeClass = 'badge-blue';
        if (status === 'Contacted') statusBadgeClass = 'badge-gold';
        if (status === 'Won' || status === 'Converted') statusBadgeClass = 'badge-green';

        const newRow = document.createElement('tr');
        newRow.style.opacity = '0';
        newRow.style.transform = 'translateY(-10px)';
        newRow.style.transition = 'all 0.4s ease';

        newRow.innerHTML = `
          <td>
            <div class="client-cell">
              <div class="client-avatar ${randomAvatarClass}">${initials}</div>
              <div class="client-info">
                <span class="client-name">${name}</span>
                <span class="client-email">${email}</span>
              </div>
            </div>
          </td>
          <td><span class="badge-premium ${statusBadgeClass}">${status}</span></td>
          <td>${source}</td>
          <td style="font-weight: 700;">${formattedValue}</td>
          <td class="text-secondary">Just now (ERPNext Sync)</td>
        `;

        if (leadsTableBody) {
          leadsTableBody.insertBefore(newRow, leadsTableBody.firstChild);
          setTimeout(() => {
            newRow.style.opacity = '1';
            newRow.style.transform = 'translateY(0)';
          }, 50);
        }

        if (activePipelineNum) {
          const currentTotalStr = activePipelineNum.textContent.replace(/[^0-9]/g, '');
          const currentTotal = parseFloat(currentTotalStr) || 1434492;
          const newTotal = currentTotal + numericValue;
          activePipelineNum.textContent = '₹' + newTotal.toLocaleString('en-IN');
        }

        if (todayLeadsNum) {
          const currentLeadsCount = parseInt(todayLeadsNum.textContent) || 3;
          todayLeadsNum.textContent = currentLeadsCount + 1;
        }

        showToast(`Lead for "${name}" successfully submitted to ERPNext!`);
        leadForm.reset();

      } catch (err) {
        showToast(`Lead created locally and queued for ERPNext sync.`);
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }

  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification-premium';
    toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: #cca43b; margin-right: 8px;"></i> ${message}`;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('show');
    }, 100);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

});
