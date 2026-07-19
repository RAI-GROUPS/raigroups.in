// RISHABH & BROTHERS SERVICES Website Interactive Operations Script

document.addEventListener('DOMContentLoaded', () => {
  
  // =========================================================================
  // Theme Toggle Logic (Light / Dark Mode)
  // =========================================================================
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;
  const themeIcon = themeToggle.querySelector('i');

  // Check saved theme or system preference
  const savedTheme = localStorage.getItem('theme');
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
    localStorage.setItem('theme', 'dark');
  }

  function enableLightMode() {
    body.classList.add('light-theme');
    body.classList.remove('dark-theme');
    themeIcon.className = 'fa-solid fa-moon';
    localStorage.setItem('theme', 'light');
  }

  // =========================================================================
  // Mobile Menu Toggle Logic
  // =========================================================================
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('navMenu');
  const menuIcon = mobileMenuBtn.querySelector('i');

  mobileMenuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Toggle menu icon
    if (navMenu.classList.contains('active')) {
      menuIcon.className = 'fa-solid fa-xmark';
    } else {
      menuIcon.className = 'fa-solid fa-bars';
    }
  });

  // Close menu when a link is clicked
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
      header.style.padding = '5px 0';
    }
  });

  // =========================================================================
  // Contact Form Submission Handler
  // =========================================================================
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const resetFormBtn = document.getElementById('resetFormBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Get values for submission handling
      const name = document.getElementById('formName').value;
      const email = document.getElementById('formEmail').value;
      const subject = document.getElementById('formSubject').value;
      const message = document.getElementById('formMessage').value;

      // Simulate API submit delay
      const submitBtn = contactForm.querySelector('.submit-btn');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Directing to Mail...';

      setTimeout(() => {
        // Success callback animation
        contactForm.classList.add('hidden');
        formSuccess.classList.remove('hidden');
        
        // Construct mailto link and trigger
        const mailBody = `Name: ${name}\nSender Email: ${email}\n\nMessage:\n${message}`;
        const mailtoLink = `mailto:support@raigroups.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailBody)}`;
        window.location.href = mailtoLink;

        // Reset button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }, 1000);
    });
  }

  if (resetFormBtn) {
    resetFormBtn.addEventListener('click', () => {
      formSuccess.classList.add('hidden');
      contactForm.classList.remove('hidden');
      contactForm.reset();
    });
  }

  // =========================================================================
  // Scroll Animation Reveal Effects
  // =========================================================================
  const revealItems = document.querySelectorAll('.service-card, .portal-card, .about-content, .security-infocard, .contact-info, .contact-form-wrapper');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  // Apply reveal styles
  revealItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    revealObserver.observe(item);
  });

    // Inject dynamic CSS rules for animations (revealed state)
  const styleSheet = document.createElement("style");
  styleSheet.innerText = `
    .service-card.revealed, .portal-card.revealed, .about-content.revealed, .security-infocard.revealed, .contact-info.revealed, .contact-form-wrapper.revealed {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(styleSheet);

  // =========================================================================
  // Employee Sidebar Toggle
  // =========================================================================
  const empSidebarToggle = document.getElementById('empSidebarToggle');
  const empSidebar = document.getElementById('empSidebar');
  const empSidebarClose = document.getElementById('empSidebarClose');
  const sidebarOverlay = document.getElementById('sidebarOverlay');

  if (empSidebarToggle && empSidebar && empSidebarClose && sidebarOverlay) {
    const openSidebar = () => {
      empSidebar.classList.add('active');
      sidebarOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    const closeSidebar = () => {
      empSidebar.classList.remove('active');
      sidebarOverlay.classList.remove('active');
      document.body.style.overflow = '';
    };

    empSidebarToggle.addEventListener('click', openSidebar);
    empSidebarClose.addEventListener('click', closeSidebar);
    sidebarOverlay.addEventListener('click', closeSidebar);
  }

  // =========================================================================
  // Custom Login/Signup Modal
  // =========================================================================
  const loginModal = document.getElementById('loginModal');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose = document.getElementById('modalClose');
  const loginSignupBtn = document.getElementById('loginSignupBtn');
  const openPortalBtns = document.querySelectorAll('.open-portal-btn');

  if (loginModal && modalOverlay) {
    const openModal = () => {
      loginModal.classList.add('active');
      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
      loginModal.classList.remove('active');
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (loginSignupBtn) loginSignupBtn.addEventListener('click', openModal);
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
    openPortalBtns.forEach(btn => btn.addEventListener('click', openModal));
  }
});
