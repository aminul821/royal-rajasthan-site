// main.js - site utilities: theme, smooth nav, contact form

(function () {
  'use strict';

  // Theme toggle (kept on window in case you use onclick="toggleTheme()")
  window.toggleTheme = function () {
    document.body.classList.toggle('dark-mode');
  };

  // Smooth scroll for nav links
  function setupSmoothNav() {
    const links = document.querySelectorAll('nav a[href^="#"]');
    links.forEach(link => {
      link.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        const target = href ? document.querySelector(href) : null;
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  // Contact form validation
  function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    // Prefer unique IDs in HTML:
    // <input id="contactName"> <input id="contactEmail"> <textarea id="contactMessage">
    const nameInput = document.getElementById('contactName') || contactForm.querySelector('[name="name"]');
    const emailInput = document.getElementById('contactEmail') || contactForm.querySelector('[name="email"]');
    const msgInput   = document.getElementById('contactMessage') || contactForm.querySelector('[name="message"]');

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = nameInput && nameInput.value.trim();
      const email = emailInput && emailInput.value.trim();
      const message = msgInput && msgInput.value.trim();

      if (name && email && message) {
        alert('Thank you, ' + name + '! Your message has been received.');
        contactForm.reset();
      } else {
        alert('Please fill in all fields.');
      }
    });
  }

  // Run when DOM is ready
  document.addEventListener('DOMContentLoaded', function () {
    setupSmoothNav();
    setupContactForm();
  });
})();
