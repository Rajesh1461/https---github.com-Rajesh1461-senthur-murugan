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

  // Contact form -> mailto fallback
  function setupForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = (document.getElementById('name') || {}).value || '';
      const email = (document.getElementById('email') || {}).value || '';
      const phone = (document.getElementById('phone') || {}).value || '';
      const message = (document.getElementById('message') || {}).value || '';
      const subject = `Website enquiry from ${name}`;
      const body = `Name: ${name}%0D%0AEmail: ${email}%0D%0APhone: ${phone}%0D%0A%0D%0AMessage:%0D%0A${encodeURIComponent(message)}`;
      const mail = cfg.email || 'contact@senthurmurugan.com';
      window.location.href = `mailto:${mail}?subject=${encodeURIComponent(subject)}&body=${body}`;
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


