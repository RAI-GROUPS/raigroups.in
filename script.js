// RISHABH & BROTHERS SERVICES - script.js
// Interactive features for B2B industrial website.

document.addEventListener('DOMContentLoaded', () => {
  
  // =========================================================================
  // Theme Toggle Logic (Light / Dark Mode)
  // =========================================================================
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;
  const themeIcon = themeToggle.querySelector('i');

  let savedTheme = null;
  try {
    savedTheme = localStorage.getItem('theme');
  } catch (e) {
    console.warn("Storage access restricted. Theme preference persistence disabled.", e);
  }
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    enableDarkMode();
  } else {
    enableLightMode();
  }

  themeToggle.addEventListener('click', () => {
    if (body.classList.contains('dark-theme')) {
      enableLightMode();
    } else {
      enableDarkMode();
    }
  });

  function enableDarkMode() {
    body.classList.add('dark-theme');
    body.classList.remove('light-theme');
    themeIcon.className = 'fa-solid fa-sun';
    try {
      localStorage.setItem('theme', 'dark');
    } catch (e) {}
  }

  function enableLightMode() {
    body.classList.add('light-theme');
    body.classList.remove('dark-theme');
    themeIcon.className = 'fa-solid fa-moon';
    try {
      localStorage.setItem('theme', 'light');
    } catch (e) {}
  }

  // =========================================================================
  // Mobile Menu Toggle
  // =========================================================================
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('navMenu');
  const menuIcon = mobileMenuBtn.querySelector('i');

  mobileMenuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    if (navMenu.classList.contains('active')) {
      menuIcon.className = 'fa-solid fa-xmark';
    } else {
      menuIcon.className = 'fa-solid fa-bars';
    }
  });

  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      menuIcon.className = 'fa-solid fa-bars';
    });
  });

  // =========================================================================
  // Active Scroll Link Highlighting
  // =========================================================================
  const sections = document.querySelectorAll('section');
  
  window.addEventListener('scroll', () => {
    let currentSection = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 150)) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });

    // Header shadow on scroll
    const header = document.querySelector('.main-header');
    if (window.scrollY > 50) {
      header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.05)';
      header.style.padding = '0';
    } else {
      header.style.boxShadow = 'none';
    }
  });

  // =========================================================================
  // Portal Drawer Sidebar Toggle (Maintained)
  // =========================================================================
  const portalSidebarToggle = document.getElementById('portalSidebarToggle');
  const portalSidebar = document.getElementById('portalSidebar');
  const portalSidebarClose = document.getElementById('portalSidebarClose');
  const sidebarOverlay = document.getElementById('sidebarOverlay');

  if (portalSidebarToggle && portalSidebar && sidebarOverlay) {
    portalSidebarToggle.addEventListener('click', () => {
      portalSidebar.classList.add('open');
      sidebarOverlay.style.display = 'block';
    });

    const closeSidebar = () => {
      portalSidebar.classList.remove('open');
      sidebarOverlay.style.display = 'none';
    };

    portalSidebarClose.addEventListener('click', closeSidebar);
    sidebarOverlay.addEventListener('click', closeSidebar);
  }

  // =========================================================================
  // Product Catalog Tabs Filter
  // =========================================================================
  const tabBtns = document.querySelectorAll('.product-tab-btn');
  const tabContents = document.querySelectorAll('.product-tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from all btns
      tabBtns.forEach(b => b.classList.remove('active'));
      // Add active to current
      btn.classList.add('active');

      const category = btn.getAttribute('data-cat');
      
      // Hide all contents
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Show matching content
      const activeContent = document.getElementById(`cat-${category}`);
      if (activeContent) {
        activeContent.classList.add('active');
      }
    });
  });

  // =========================================================================
  // Request a Quote Modal Toggle & Prefill
  // =========================================================================
  const quoteModal = document.getElementById('quoteModal');
  const quoteCTA = document.getElementById('quoteCTA');
  const heroQuoteBtn = document.getElementById('heroQuoteBtn');
  const quoteModalClose = document.getElementById('quoteModalClose');
  const quoteCategory = document.getElementById('quoteCategory');
  const productInquireBtns = document.querySelectorAll('.product-inquire-btn');

  const openQuoteModal = () => {
    quoteModal.classList.add('open');
  };

  const closeQuoteModal = () => {
    quoteModal.classList.remove('open');
  };

  if (quoteCTA) quoteCTA.addEventListener('click', openQuoteModal);
  if (heroQuoteBtn) heroQuoteBtn.addEventListener('click', openQuoteModal);
  if (quoteModalClose) quoteModalClose.addEventListener('click', closeQuoteModal);

  // Close modal when clicking outside container
  window.addEventListener('click', (e) => {
    if (e.target === quoteModal) {
      closeQuoteModal();
    }
  });

  // Handle inquiry prefilling
  productInquireBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const product = btn.getAttribute('data-product');
      if (quoteCategory) {
        // Map product string to option values
        for (let i = 0; i < quoteCategory.options.length; i++) {
          if (quoteCategory.options[i].text.includes(product) || quoteCategory.options[i].value.includes(product)) {
            quoteCategory.selectedIndex = i;
            break;
          }
        }
      }
      openQuoteModal();
    });
  });

  // =========================================================================
  // B2B Inquiry Form Submit (Contact Us)
  // =========================================================================
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const resetFormBtn = document.getElementById('resetFormBtn');

  if (contactForm && formSuccess) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Validate inputs
      const name = document.getElementById('formName').value.trim();
      const email = document.getElementById('formEmail').value.trim();
      const subject = document.getElementById('formSubject').value.trim();
      const message = document.getElementById('formMessage').value.trim();

      if (name && email && subject && message) {
        // Mock successful submit
        contactForm.classList.add('hidden');
        formSuccess.classList.remove('hidden');
      }
    });

    if (resetFormBtn) {
      resetFormBtn.addEventListener('click', () => {
        contactForm.reset();
        formSuccess.classList.add('hidden');
        contactForm.classList.remove('hidden');
      });
    }
  }

  // =========================================================================
  // Request a Quote Form Submit
  // =========================================================================
  const quoteForm = document.getElementById('quoteForm');
  const quoteSuccess = document.getElementById('quoteSuccess');
  const resetQuoteBtn = document.getElementById('resetQuoteBtn');

  if (quoteForm && quoteSuccess) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('quoteName').value.trim();
      const company = document.getElementById('quoteCompany').value.trim();
      const email = document.getElementById('quoteEmail').value.trim();
      const phone = document.getElementById('quotePhone').value.trim();
      const category = document.getElementById('quoteCategory').value;
      const message = document.getElementById('quoteMessage').value.trim();

      if (name && company && email && phone && category && message) {
        quoteForm.classList.add('hidden');
        quoteSuccess.classList.remove('hidden');
      }
    });

    if (resetQuoteBtn) {
      resetQuoteBtn.addEventListener('click', () => {
        quoteForm.reset();
        quoteSuccess.classList.add('hidden');
        quoteForm.classList.remove('hidden');
      });
    }
  }

});
