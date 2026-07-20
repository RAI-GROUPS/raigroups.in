/* RISHABH & BROTHERS SERVICES - Enterprise CRM/ERP Dashboard JS */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // ChartJS Configuration
  // =========================================================================
  const trendCtx = document.getElementById('pipelineChart')?.getContext('2d');
  const sourceCtx = document.getElementById('sourceChart')?.getContext('2d');

  let pipelineChart, sourceChart;

  // Chart Styling Config
  const chartOptions = {
    textColor: '#94a3b8',
    gridColor: 'rgba(255, 255, 255, 0.05)',
    fontFamily: "'Inter', sans-serif"
  };

  // 1. Line/Area Chart: Pipeline Revenue Trend
  if (trendCtx) {
    // Create blue gradient
    const blueGradient = trendCtx.createLinearGradient(0, 0, 0, 300);
    blueGradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
    blueGradient.addColorStop(1, 'rgba(59, 130, 246, 0.0)');

    // Create gold gradient
    const goldGradient = trendCtx.createLinearGradient(0, 0, 0, 300);
    goldGradient.addColorStop(0, 'rgba(245, 158, 11, 0.2)');
    goldGradient.addColorStop(1, 'rgba(245, 158, 11, 0.0)');

    pipelineChart = new Chart(trendCtx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        datasets: [
          {
            label: 'CRM Active Pipeline',
            data: [120, 150, 180, 220, 280, 340, 390, 420, 452],
            borderColor: '#3b82f6',
            backgroundColor: blueGradient,
            fill: true,
            tension: 0.4,
            borderWidth: 3,
            pointBackgroundColor: '#3b82f6',
            pointHoverRadius: 7
          },
          {
            label: 'Weighted Forecast',
            data: [90, 110, 130, 170, 210, 260, 290, 310, 340],
            borderColor: '#f59e0b',
            backgroundColor: goldGradient,
            fill: true,
            tension: 0.4,
            borderWidth: 2,
            borderDash: [5, 5],
            pointBackgroundColor: '#f59e0b',
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
              callback: (value) => '$' + value + 'k'
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
        labels: ['Organic Search', 'Website Form', 'Direct Traffic', 'Partner Referral'],
        datasets: [{
          data: [40, 25, 20, 15],
          backgroundColor: ['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6'],
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
  // Form Submission & Live Table Updates (Interactive Prototyping)
  // =========================================================================
  const leadForm = document.getElementById('quickLeadForm');
  const leadsTableBody = document.getElementById('leadsTableBody');
  
  // Stats Elements
  const activePipelineNum = document.getElementById('activePipelineNum');
  const todayLeadsNum = document.getElementById('todayLeadsNum');

  if (leadForm && leadsTableBody) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Gather input values
      const name = document.getElementById('leadName').value;
      const email = document.getElementById('leadEmail').value;
      const valueInput = document.getElementById('leadValue').value;
      const source = document.getElementById('leadSource').value;
      const status = document.getElementById('leadStatus').value;

      // Clean value parsing
      const numericValue = parseFloat(valueInput.replace(/[^0-9.]/g, '')) || 0;
      const formattedValue = '$' + numericValue.toLocaleString('en-US', { maximumFractionDigits: 0 });

      // Form submit button animation
      const submitBtn = leadForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';

      setTimeout(() => {
        // 1. Generate Avatar Class
        const avatars = ['avatar-a', 'avatar-b', 'avatar-c', 'avatar-d'];
        const randomAvatarClass = avatars[Math.floor(Math.random() * avatars.length)];
        const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

        // 2. Generate Status Badge Class
        let statusBadgeClass = 'badge-blue';
        if (status === 'Contacted') statusBadgeClass = 'badge-gold';
        if (status === 'In Progress') statusBadgeClass = 'badge-blue';
        if (status === 'Won') statusBadgeClass = 'badge-green';
        if (status === 'Lost') statusBadgeClass = 'badge-red';

        // 3. Create new table row markup
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
          <td class="text-secondary">Just now</td>
        `;

        // Insert at the top of the table
        leadsTableBody.insertBefore(newRow, leadsTableBody.firstChild);

        // Trigger animation reflow
        setTimeout(() => {
          newRow.style.opacity = '1';
          newRow.style.transform = 'translateY(0)';
        }, 50);

        // 4. Update Stats Counters
        // Update Pipeline Value (Add new lead value to total pipeline)
        if (activePipelineNum) {
          const currentTotalStr = activePipelineNum.textContent.replace(/[^0-9]/g, '');
          const currentTotal = parseFloat(currentTotalStr) || 452800;
          const newTotal = currentTotal + numericValue;
          activePipelineNum.textContent = '$' + newTotal.toLocaleString('en-US');
        }

        // Update Today Leads Count
        if (todayLeadsNum) {
          const currentLeadsCount = parseInt(todayLeadsNum.textContent) || 28;
          todayLeadsNum.textContent = currentLeadsCount + 1;
        }

        // 5. Update Donut Chart distribution dynamically
        if (sourceChart) {
          let sourceIndex = 1; // Default to Website Form
          if (source === 'Organic Search') sourceIndex = 0;
          if (source === 'Website Form') sourceIndex = 1;
          if (source === 'Direct Traffic') sourceIndex = 2;
          if (source === 'Partner Referral') sourceIndex = 3;
          
          sourceChart.data.datasets[0].data[sourceIndex] += 1;
          sourceChart.update();
        }

        // Reset form & button state
        leadForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;

        // Show quick flash toast notification
        showToast(`Lead created successfully for ${name}!`);
      }, 800);
    });
  }

  // =========================================================================
  // Quick Custom Toast Notifications
  // =========================================================================
  function showToast(message) {
    const toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.bottom = '24px';
    toast.style.right = '24px';
    toast.style.backgroundColor = '#111224';
    toast.style.border = '1px solid var(--color-blue)';
    toast.style.boxShadow = 'var(--shadow-glow-blue)';
    toast.style.color = '#f8fafc';
    toast.style.padding = '12px 24px';
    toast.style.borderRadius = '8px';
    toast.style.zIndex = '1000';
    toast.style.fontSize = '13px';
    toast.style.fontWeight = '600';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
    toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: var(--color-green); margin-right: 8px;"></i> ${message}`;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    }, 50);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // =========================================================================
  // Mobile Sidebar Collapse Toggle
  // =========================================================================
  const sidebarCollapse = document.getElementById('sidebarCollapse');
  const sidebar = document.querySelector('.app-sidebar');
  const overlay = document.getElementById('sidebarOverlay');

  if (sidebarCollapse && sidebar && overlay) {
    sidebarCollapse.addEventListener('click', () => {
      sidebar.classList.add('active');
      overlay.classList.add('active');
    });

    overlay.addEventListener('click', () => {
      sidebar.classList.remove('active');
      overlay.classList.remove('active');
    });
  }

});
