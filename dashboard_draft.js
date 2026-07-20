/* RISHABH & BROTHERS SERVICES - Executive Dashboard Interactivity */

document.addEventListener('DOMContentLoaded', () => {
  
  // =========================================================================
  // Theme Switching Logic
  // =========================================================================
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;
  const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;

  // Retrieve theme preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    body.classList.add('dark-theme');
    if (themeIcon) themeIcon.className = 'fa-solid fa-sun';
  } else {
    body.classList.remove('dark-theme');
    if (themeIcon) themeIcon.className = 'fa-solid fa-moon';
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      body.classList.toggle('dark-theme');
      
      const isDark = body.classList.contains('dark-theme');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      
      if (themeIcon) {
        themeIcon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
      }

      // Update Chart Colors for Dark/Light Mode
      updateChartThemes(isDark);
    });
  }

  // =========================================================================
  // ChartJS Implementation
  // =========================================================================
  const trendCtx = document.getElementById('trendChart')?.getContext('2d');
  const categoryCtx = document.getElementById('categoryChart')?.getContext('2d');

  let trendChart, categoryChart;

  // Define colors based on theme
  const getColors = (isDark) => {
    return {
      text: isDark ? '#94a3b8' : '#64748b',
      grid: isDark ? '#1f2937' : '#e2e8f0',
      lineHigh: '#ef4444',
      lineMedium: '#d97706',
      lineLow: '#10b981',
      donutSlice: isDark ? 
        ['#3b82f6', '#fbbf24', '#10b981', '#a78bfa', '#475569'] : 
        ['#1e3a8a', '#d97706', '#10b981', '#8b5cf6', '#94a3b8']
    };
  };

  const colors = getColors(body.classList.contains('dark-theme'));

  // 1. Line Chart: Governance Gaps Trend
  if (trendCtx) {
    trendChart = new Chart(trendCtx, {
      type: 'line',
      data: {
        labels: ['May 6', 'May 13', 'May 20', 'May 27', 'Jun 3'],
        datasets: [
          {
            label: 'High Priority',
            data: [18, 22, 20, 25, 29],
            borderColor: colors.lineHigh,
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            fill: true,
            tension: 0.3,
            borderWidth: 2
          },
          {
            label: 'Medium Priority',
            data: [11, 15, 10, 18, 22],
            borderColor: colors.lineMedium,
            backgroundColor: 'rgba(217, 119, 6, 0.1)',
            fill: true,
            tension: 0.3,
            borderWidth: 2
          },
          {
            label: 'Low Priority',
            data: [4, 9, 5, 8, 12],
            borderColor: colors.lineLow,
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            fill: true,
            tension: 0.3,
            borderWidth: 2
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
              color: colors.text,
              font: { family: 'Inter', size: 12 }
            }
          }
        },
        scales: {
          x: {
            grid: { color: colors.grid },
            ticks: { color: colors.text }
          },
          y: {
            grid: { color: colors.grid },
            ticks: { color: colors.text },
            suggestedMax: 35
          }
        }
      }
    });
  }

  // 2. Donut Chart: Top Gap Categories
  if (categoryCtx) {
    categoryChart = new Chart(categoryCtx, {
      type: 'doughnut',
      data: {
        labels: ['Cost Optimization', 'Access & IAM', 'Resource Ownership', 'Encryption', 'Other'],
        datasets: [{
          data: [35, 20, 15, 15, 15],
          backgroundColor: colors.donutSlice,
          borderWidth: 2,
          borderColor: body.classList.contains('dark-theme') ? '#111827' : '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: colors.text,
              font: { family: 'Inter', size: 12 }
            }
          }
        },
        cutout: '65%'
      }
    });
  }

  // Helper function to update chart styling dynamically
  function updateChartThemes(isDark) {
    const freshColors = getColors(isDark);
    const border = isDark ? '#111827' : '#ffffff';

    if (trendChart) {
      trendChart.options.plugins.legend.labels.color = freshColors.text;
      trendChart.options.scales.x.grid.color = freshColors.grid;
      trendChart.options.scales.x.ticks.color = freshColors.text;
      trendChart.options.scales.y.grid.color = freshColors.grid;
      trendChart.options.scales.y.ticks.color = freshColors.text;
      trendChart.update();
    }

    if (categoryChart) {
      categoryChart.options.plugins.legend.labels.color = freshColors.text;
      categoryChart.data.datasets[0].backgroundColor = freshColors.donutSlice;
      categoryChart.data.datasets[0].borderColor = border;
      categoryChart.update();
    }
  }

});
