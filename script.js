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
  
  const loginTabBtn = document.getElementById('loginTabBtn');
  const signupTabBtn = document.getElementById('signupTabBtn');
  const modalLoginForm = document.getElementById('modalLoginForm');
  const modalSignupForm = document.getElementById('modalSignupForm');
  const modalBody = document.getElementById('modalBody');
  const modalTitle = document.getElementById('modalTitle');

  const openModal = () => {
    loginModal.classList.add('active');
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    renderModalContent();
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

  // Tab switching
  const switchTab = (tab) => {
    const loginBtn = document.getElementById('loginTabBtn');
    const signupBtn = document.getElementById('signupTabBtn');
    const loginForm = document.getElementById('modalLoginForm');
    const signupForm = document.getElementById('modalSignupForm');
    const title = document.getElementById('modalTitle');

    if (tab === 'login') {
      if (loginBtn) loginBtn.classList.add('active');
      if (signupBtn) signupBtn.classList.remove('active');
      if (loginForm) loginForm.classList.remove('hidden');
      if (signupForm) signupForm.classList.add('hidden');
      if (title) title.innerText = "Customer & Vendor Login";
    } else {
      if (loginBtn) loginBtn.classList.remove('active');
      if (signupBtn) signupBtn.classList.add('active');
      if (loginForm) loginForm.classList.add('hidden');
      if (signupForm) signupForm.classList.remove('hidden');
      if (title) title.innerText = "Create a RAIGROUPS Account";
    }
  };

  // Render Modal Content based on login state
  const renderModalContent = () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userName = localStorage.getItem('userName') || 'Client';
    const userEmail = localStorage.getItem('userEmail') || '';

    // Update Header Button text
    if (isLoggedIn && loginSignupBtn) {
      loginSignupBtn.innerHTML = `<i class="fa-solid fa-user"></i> ${userName}`;
      loginSignupBtn.style.background = 'linear-gradient(135deg, var(--secondary-color), var(--primary-color))';
    } else if (loginSignupBtn) {
      loginSignupBtn.innerHTML = 'Login / Signup';
      loginSignupBtn.style.background = 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))';
    }

    if (isLoggedIn) {
      // Show Profile View
      modalBody.innerHTML = `
        <div class="profile-view">
          <div class="profile-avatar">
            <i class="fa-solid fa-user-tie"></i>
          </div>
          <h4>Welcome, ${userName}!</h4>
          <p>${userEmail}</p>
          <div class="profile-actions">
            <a href="https://erp.raigroups.in/me" target="_blank" class="btn btn-primary" style="width: 100%; justify-content: center; text-decoration: none;">
              <i class="fa-solid fa-chart-line"></i> Open Client Dashboard
            </a>
            <button id="logoutBtn" class="btn btn-secondary" style="width: 100%; justify-content: center; border: 1px solid var(--border-color); background: var(--bg-secondary); color: var(--text-main); margin-top: 10px;">
              <i class="fa-solid fa-right-from-bracket"></i> Log Out
            </button>
          </div>
        </div>
      `;
      // Re-bind logout handler
      document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    } else {
      // Restore forms
      modalBody.innerHTML = `
        <!-- Tab Headers -->
        <div class="modal-tabs" id="modalTabs">
          <button id="loginTabBtn" class="tab-btn active">Login</button>
          <button id="signupTabBtn" class="tab-btn">Sign Up</button>
        </div>

        <!-- Login Form -->
        <div id="modalLoginForm" class="modal-form-content">
          <form id="websiteLoginForm">
            <div class="form-group">
              <label for="modalEmail">Email Address</label>
              <input type="email" id="modalEmail" name="usr" required placeholder="Enter your registered email">
            </div>
            <div class="form-group">
              <label for="modalPassword">Password</label>
              <input type="password" id="modalPassword" name="pwd" required placeholder="Enter your password">
            </div>
            <div class="login-error-msg" id="loginErrorMsg" style="color: var(--card-red-glow); font-size: 13px; margin: 8px 0; font-weight: 600;"></div>
            <button type="submit" class="btn btn-primary submit-btn" style="width: 100%; justify-content: center; margin-top: 15px;">
              <i class="fa-solid fa-right-to-bracket"></i> Login to Portal
            </button>
          </form>
          <div class="form-divider" style="text-align: center; margin: 15px 0; position: relative;">
            <span style="background: var(--bg-primary); padding: 0 10px; color: var(--text-muted); font-size: 12px; z-index: 1; position: relative;">OR</span>
            <div style="position: absolute; top: 50%; left: 0; right: 0; border-top: 1px solid var(--border-color); z-index: 0;"></div>
          </div>
          <a href="https://erp.raigroups.in/login#login-with-email-link" target="_blank" class="btn btn-secondary" style="width: 100%; justify-content: center; border: 1px solid var(--border-color); background: var(--bg-secondary); color: var(--text-main);">
            <i class="fa-solid fa-envelope"></i> Login with Email Link
          </a>
        </div>

        <!-- Signup Form -->
        <div id="modalSignupForm" class="modal-form-content hidden">
          <form id="websiteSignupForm">
            <div class="form-group">
              <label for="signupName">Full Name</label>
              <input type="text" id="signupName" required placeholder="Enter your name">
            </div>
            <div class="form-group">
              <label for="signupEmail">Email Address</label>
              <input type="email" id="signupEmail" required placeholder="Enter your email">
            </div>
            <div class="signup-error-msg" id="signupErrorMsg" style="color: var(--card-red-glow); font-size: 13px; margin: 8px 0; font-weight: 600;"></div>
            <button type="submit" class="btn btn-primary submit-btn" style="width: 100%; justify-content: center; margin-top: 15px;">
              <i class="fa-solid fa-user-plus"></i> Register Account
            </button>
          </form>
        </div>
      `;
      // Re-bind tab and form handlers
      document.getElementById('loginTabBtn').addEventListener('click', () => switchTab('login'));
      document.getElementById('signupTabBtn').addEventListener('click', () => switchTab('signup'));
      document.getElementById('websiteLoginForm').addEventListener('submit', handleLoginSubmit);
      document.getElementById('websiteSignupForm').addEventListener('submit', handleSignupSubmit);
    }
  };

  // Login handler
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const email = document.getElementById('modalEmail').value;
    const password = document.getElementById('modalPassword').value;
    const errorMsg = document.getElementById('loginErrorMsg');
    const submitBtn = e.target.querySelector('.submit-btn');

    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Authenticating...';
    if (errorMsg) errorMsg.innerText = '';

    const formData = new FormData();
    formData.append('usr', email);
    formData.append('pwd', password);

    fetch('https://erp.raigroups.in/api/method/login', {
      method: 'POST',
      body: formData,
      credentials: 'include'
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Unauthorized');
      }
    })
    .then(data => {
      // Login successful!
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userName', data.full_name || 'Client');
      localStorage.setItem('userEmail', email);
      renderModalContent();
    })
    .catch(err => {
      console.warn("API Login failed/blocked, falling back to standard redirect:", err);
      // Fallback: If API fails (e.g., CORS), redirect to ERPNext login screen directly
      window.open('https://erp.raigroups.in/login', '_blank');
      closeModal();
    })
    .finally(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    });
  };

  // Signup handler
  const handleSignupSubmit = (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const errorMsg = document.getElementById('signupErrorMsg');
    const submitBtn = e.target.querySelector('.submit-btn');

    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Registering...';
    if (errorMsg) errorMsg.innerText = '';

    const formData = new FormData();
    formData.append('email', email);
    formData.append('full_name', name);

    fetch('https://erp.raigroups.in/api/method/frappe.core.doctype.user.user.sign_up', {
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return response.json().then(data => { throw new Error(data.message || 'Signup failed'); });
      }
    })
    .then(data => {
      alert("Registration Successful! Please check your email for verification.");
      switchTab('login');
    })
    .catch(err => {
      console.warn("API Signup failed/blocked, redirecting to sign up page:", err);
      window.open('https://erp.raigroups.in/login#signup', '_blank');
      closeModal();
    })
    .finally(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    });
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    
    // Call server logout
    fetch('https://erp.raigroups.in/api/method/logout', { method: 'POST', credentials: 'include' })
    .finally(() => {
      renderModalContent();
      closeModal();
    });
  };

  // Initial render of header button state
  renderModalContent();
});
