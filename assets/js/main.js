(function () {
  const cfg = window.SM_CONFIG || {};

  // Set dynamic contact links
  function applyContact() {
    const tel = document.getElementById('tel-link');
    const mail = document.getElementById('mail-link');
    const wa = document.getElementById('whatsapp-contact');
    const waFloat = document.getElementById('floating-wa');
    const socialWa = document.getElementById('social-whatsapp');
    const socialFb = document.getElementById('social-facebook');
    const socialLn = document.getElementById('social-linkedin');
    const addr = document.getElementById('office-address');
    const map = document.getElementById('gmap');

    if (tel && cfg.phoneForTel) tel.href = `tel:${cfg.phoneForTel}`;
    if (tel && cfg.phoneDisplay) tel.textContent = cfg.phoneDisplay;
    if (mail && cfg.email) mail.href = `mailto:${cfg.email}`;
    if (wa && cfg.whatsappNumber) wa.href = `https://wa.me/${cfg.whatsappNumber}`;
    if (waFloat && cfg.whatsappNumber) waFloat.href = `https://wa.me/${cfg.whatsappNumber}?text=${encodeURIComponent('Hello! I would like to know more.')} `;
    if (socialWa && cfg.whatsappNumber) socialWa.href = `https://wa.me/${cfg.whatsappNumber}`;
    if (socialFb && cfg.social && cfg.social.facebook) socialFb.href = cfg.social.facebook;
    if (socialLn && cfg.social && cfg.social.linkedin) socialLn.href = cfg.social.linkedin;
    if (addr && cfg.officeAddress) addr.textContent = cfg.officeAddress;
    if (map && cfg.googleMapsQuery) map.src = `https://www.google.com/maps?q=${encodeURIComponent(cfg.googleMapsQuery)}&output=embed`;

    const year = document.getElementById('year');
    if (year) year.textContent = String(new Date().getFullYear());
  }

  // Mobile nav toggle
  function setupNav() {
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.getElementById('primary-menu');
    if (!toggle || !menu) return;
    toggle.addEventListener('click', function () {
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!expanded));
      menu.classList.toggle('is-open');
    });
    // Close on link click (mobile)
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Scroll reveal
  function setupReveal() {
    const elems = document.querySelectorAll('.reveal-on-scroll');
    if (!('IntersectionObserver' in window) || !elems.length) {
      elems.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    elems.forEach(function (el) { io.observe(el); });
  }

  // Property enquire buttons -> WhatsApp prefill
  function setupPropertyEnquiry() {
    const buttons = document.querySelectorAll('.enquire-btn');
    if (!buttons.length || !cfg.whatsappNumber) return;
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const title = this.getAttribute('data-title') || 'the property';
        const msg = `Hello, I am interested in ${title}. Please share details.`;
        window.open(`https://wa.me/${cfg.whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
      });
    });
  }

     // Success popup function
   function showSuccessPopup(message) {
     // Remove existing popup if any
     const existingPopup = document.querySelector('.success-popup');
     if (existingPopup) {
       existingPopup.remove();
     }

     // Remove existing overlay if any
     const existingOverlay = document.querySelector('.popup-overlay');
     if (existingOverlay) {
       existingOverlay.remove();
     }

     // Create popup container
     const popup = document.createElement('div');
     popup.className = 'success-popup';
     popup.style.cssText = `
       position: fixed;
       top: 50%;
       left: 50%;
       transform: translate(-50%, -50%);
       background: white;
       padding: 2rem;
       border-radius: 12px;
       box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
       z-index: 10000;
       max-width: 400px;
       text-align: center;
       border: 2px solid #4CAF50;
     `;

     // Create popup content
     popup.innerHTML = `
       <div style="margin-bottom: 1rem;">
         <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
           <circle cx="12" cy="12" r="10" fill="#4CAF50"/>
           <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
         </svg>
       </div>
       <h3 style="margin: 0 0 1rem 0; color: #333; font-size: 1.25rem;">Success!</h3>
       <p style="margin: 0 0 1.5rem 0; color: #666; line-height: 1.5;">${message}</p>
       <button onclick="this.parentElement.remove()" style="
         background: #4CAF50;
         color: white;
         border: none;
         padding: 0.75rem 1.5rem;
         border-radius: 6px;
         cursor: pointer;
         font-size: 1rem;
         font-weight: 500;
         transition: background 0.3s;
       " onmouseover="this.style.background='#45a049'" onmouseout="this.style.background='#4CAF50'">
         OK
       </button>
     `;

     // Create overlay
     const overlay = document.createElement('div');
     overlay.className = 'popup-overlay';
     overlay.style.cssText = `
       position: fixed;
       top: 0;
       left: 0;
       width: 100%;
       height: 100%;
       background: rgba(0, 0, 0, 0.5);
       z-index: 9999;
     `;

     // Add to page
     document.body.appendChild(overlay);
     document.body.appendChild(popup);

     // Auto-remove after 5 seconds
     setTimeout(() => {
       if (popup.parentElement) {
         popup.remove();
         overlay.remove();
       }
     }, 5000);

     // Close on overlay click
     overlay.addEventListener('click', () => {
       popup.remove();
       overlay.remove();
     });
   }

   // EmailJS fallback function
   function sendEmailWithEmailJS(name, email, phone, message, submitBtn, originalText) {
     if (!window.EmailJS) {
       showSuccessPopup('There was an issue sending your message. Please try again or contact us directly.');
       submitBtn.textContent = originalText;
       submitBtn.disabled = false;
       return;
     }

     // Initialize EmailJS if not already done
     if (!window.EmailJS.init) {
       window.EmailJS.init("YOUR_PUBLIC_KEY"); // Replace with your EmailJS public key
     }

     const templateParams = {
       to_email: 'senthurmuruganrealtors@gmail.com,rajeshkumar757575@gmail.com,ks.udhaya1886@gmail.com',
       from_name: name,
       from_email: email,
       phone: phone,
       message: message,
       subject: `New Contact Form Submission from ${name}`
     };

     window.EmailJS.send('service_id', 'template_id', templateParams)
       .then(function(response) {
         showSuccessPopup('Thank you! Your message has been sent successfully via EmailJS.');
         document.getElementById('contact-form').reset();
       })
       .catch(function(error) {
         console.error('EmailJS error:', error);
         showSuccessPopup('There was an issue sending your message. Please try again or contact us directly.');
       })
       .finally(function() {
         submitBtn.textContent = originalText;
         submitBtn.disabled = false;
       });
   }

   // WhatsApp notification function
   function sendWhatsAppNotification(name, email, phone, message) {
     // You can use different WhatsApp API services
     // Option 1: Using WhatsApp Business API (requires setup)
     // Option 2: Using a webhook service like Zapier
     // Option 3: Using a third-party service
     
     const whatsappMessage = `🔔 *New Contact Form Submission*
     
*Name:* ${name}
*Email:* ${email}
*Phone:* ${phone || 'Not provided'}
*Message:* ${message}

*Time:* ${new Date().toLocaleString('en-IN')}
*Source:* Website Contact Form`;

     // Option 1: Direct WhatsApp API (requires API key setup)
     if (cfg.whatsappApiKey && cfg.whatsappPhoneNumber) {
       fetch('https://api.whatsapp.com/v1/messages', {
         method: 'POST',
         headers: {
           'Authorization': `Bearer ${cfg.whatsappApiKey}`,
           'Content-Type': 'application/json'
         },
         body: JSON.stringify({
           messaging_product: 'whatsapp',
           to: cfg.whatsappPhoneNumber,
           type: 'text',
           text: { body: whatsappMessage }
         })
       }).catch(error => {
         console.log('WhatsApp API error:', error);
       });
     }
     
     // Option 2: Using a webhook service (easier to set up)
     if (cfg.webhookUrl) {
       fetch(cfg.webhookUrl, {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json'
         },
         body: JSON.stringify({
           name: name,
           email: email,
           phone: phone,
           message: message,
           timestamp: new Date().toISOString()
         })
       }).catch(error => {
         console.log('Webhook error:', error);
       });
     }
   }

   // Contact form validation and email sending
   function setupForm() {
     const form = document.getElementById('contact-form');
     if (!form) return;

    // Validation functions
    function validateName(name) {
      return name.trim().length >= 3;
    }

    function validateEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }

    function validatePhone(phone) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      return phoneRegex.test(phone.replace(/\s/g, ''));
    }

    function validateMessage(message) {
      return message.trim().length >= 3;
    }

    function showError(field, message) {
      const errorDiv = field.parentNode.querySelector('.error-message') || document.createElement('div');
      errorDiv.className = 'error-message';
      errorDiv.style.color = '#e74c3c';
      errorDiv.style.fontSize = '0.875rem';
      errorDiv.style.marginTop = '0.25rem';
      errorDiv.textContent = message;
      
      if (!field.parentNode.querySelector('.error-message')) {
        field.parentNode.appendChild(errorDiv);
      }
      field.style.borderColor = '#e74c3c';
    }

    function clearError(field) {
      const errorDiv = field.parentNode.querySelector('.error-message');
      if (errorDiv) {
        errorDiv.remove();
      }
      field.style.borderColor = '';
    }

    // Real-time validation
    const nameField = document.getElementById('name');
    const emailField = document.getElementById('email');
    const phoneField = document.getElementById('phone');
    const messageField = document.getElementById('message');

    if (nameField) {
      nameField.addEventListener('blur', function() {
        if (this.value && !validateName(this.value)) {
          showError(this, 'Name must be at least 3 characters long');
        } else {
          clearError(this);
        }
      });
    }

    if (emailField) {
      emailField.addEventListener('blur', function() {
        if (this.value && !validateEmail(this.value)) {
          showError(this, 'Please enter a valid email address');
        } else {
          clearError(this);
        }
      });
    }

    if (phoneField) {
      phoneField.addEventListener('blur', function() {
        if (this.value && !validatePhone(this.value)) {
          showError(this, 'Please enter a valid phone number');
        } else {
          clearError(this);
        }
      });
    }

    if (messageField) {
      messageField.addEventListener('blur', function() {
        if (this.value && !validateMessage(this.value)) {
          showError(this, 'Message must be at least 3 characters long');
        } else {
          clearError(this);
        }
      });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      const name = (nameField || {}).value || '';
      const email = (emailField || {}).value || '';
      const phone = (phoneField || {}).value || '';
      const message = (messageField || {}).value || '';
      
      // Clear previous errors
      [nameField, emailField, phoneField, messageField].forEach(field => {
        if (field) clearError(field);
      });

      // Validate all fields
      let isValid = true;
      
      if (!validateName(name)) {
        showError(nameField, 'Name must be at least 3 characters long');
        isValid = false;
      }
      
      if (!validateEmail(email)) {
        showError(emailField, 'Please enter a valid email address');
        isValid = false;
      }
      
      if (!validatePhone(phone)) {
        showError(phoneField, 'Please enter a valid phone number');
        isValid = false;
      }
      
      if (!validateMessage(message)) {
        showError(messageField, 'Message must be at least 3 characters long');
        isValid = false;
      }

      if (!isValid) {
        return;
      }

             // Show loading state
       const submitBtn = form.querySelector('button[type="submit"]');
       const originalText = submitBtn.textContent;
       submitBtn.textContent = 'Sending...';
       submitBtn.disabled = true;

       // Submit form to multiple Web3Forms endpoints
       const formData1 = new FormData(form);
       const formData2 = new FormData(form);
       const formData3 = new FormData(form);
       
       // Update access keys for second and third emails
       formData2.set('access_key', '6d0f670b-9891-4377-8a2f-c9d582561731');
       formData3.set('access_key', '8effb86b-8278-4797-8b4a-c481a838f4a8');
       
       // Submit to first endpoint (senthurmuruganrealtors@gmail.com)
       const promise1 = fetch('https://api.web3forms.com/submit', {
         method: 'POST',
         body: formData1
       }).then(response => response.json());
       
       // Submit to second endpoint (rajeshkumar757575@gmail.com)
       const promise2 = fetch('https://api.web3forms.com/submit', {
         method: 'POST',
         body: formData2
       }).then(response => response.json());
       
       // Submit to third endpoint (ks.udhaya1886@gmail.com)
       const promise3 = fetch('https://api.web3forms.com/submit', {
         method: 'POST',
         body: formData3
       }).then(response => response.json());
       
       // Wait for all three submissions
       Promise.all([promise1, promise2, promise3])
         .then(results => {
           console.log('Web3Forms responses:', results);
           const successCount = results.filter(result => result.success).length;
           
           if (successCount > 0) {
             // Send WhatsApp notification
             sendWhatsAppNotification(name, email, phone, message);
             showSuccessPopup(`Thank you! Your message has been sent successfully to ${successCount} team members. We will get back to you soon.`);
             form.reset();
           } else {
             throw new Error('All form submissions failed');
           }
         })
         .catch(error => {
           console.error('Error:', error);
           // Fallback to EmailJS if Web3Forms fails
           console.log('Trying EmailJS fallback...');
           sendEmailWithEmailJS(name, email, phone, message, submitBtn, originalText);
         })
         .finally(() => {
           if (!window.EmailJS) {
             submitBtn.textContent = originalText;
             submitBtn.disabled = false;
           }
         });
    });
  }

  // Add header shadow on scroll for subtle effect
  function setupHeaderShadow() {
    const header = document.querySelector('.site-header');
    if (!header) return;
    function update() {
      const scrolled = window.scrollY > 12;
      header.style.boxShadow = scrolled ? '0 6px 20px rgba(2,12,27,0.08)' : 'none';
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  document.addEventListener('DOMContentLoaded', function () {
    applyContact();
    setupNav();
    setupReveal();
    setupPropertyEnquiry();
    setupForm();
    setupHeaderShadow();
    // Initialize Lottie hero if present
    try {
      var lottieContainer = document.getElementById('hero-lottie');
      if (lottieContainer && window.lottie) {
        window.lottie.loadAnimation({
          container: lottieContainer,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          path: 'assets/images/home.json',
          rendererSettings: {
            progressiveLoad: true,
            preserveAspectRatio: 'xMidYMid meet'
          }
        });
      }
    } catch (e) {
      // no-op
    }
  });
})();


