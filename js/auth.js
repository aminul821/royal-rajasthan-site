// auth.js - login / sign up for login.html and signup.html
//
// This is a static site with no backend, so accounts are kept in the
// browser's localStorage (demo only). Passwords are stored as SHA-256 hashes,
// never as plain text. Replace with a real server before using in production.

(function () {
  'use strict';

  const USERS_KEY = 'rr_users';
  const SESSION_KEY = 'rr_current_user';

  function getUsers() {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  async function hashPassword(password) {
    const data = new TextEncoder().encode(password);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(digest))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  function showMessage(text, type) {
    const box = document.getElementById('authMessage');
    if (!box) return;
    box.textContent = text;
    box.className = 'message ' + type;
  }

  // "Show" / "Hide" buttons next to password fields
  function setupShowPassword() {
    document.querySelectorAll('.show-pass').forEach(btn => {
      const input = btn.parentElement.querySelector('input');
      if (!input) return;
      btn.addEventListener('click', function () {
        const hidden = input.type === 'password';
        input.type = hidden ? 'text' : 'password';
        btn.textContent = hidden ? 'Hide' : 'Show';
      });
    });
  }

  function setupLoginForm() {
    const form = document.getElementById('loginForm');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const id = document.getElementById('username').value.trim().toLowerCase();
      const password = document.getElementById('password').value;

      if (!id || !password) {
        showMessage('Please enter your username/email and password.', 'error');
        return;
      }

      const users = getUsers();
      // Accept either the email or the name used at sign up
      const email = users[id] ? id : Object.keys(users).find(k => users[k].name.toLowerCase() === id);
      const user = email && users[email];

      if (!user || user.passwordHash !== await hashPassword(password)) {
        showMessage('Invalid username/email or password.', 'error');
        return;
      }

      localStorage.setItem(SESSION_KEY, email);
      showMessage('Welcome back, ' + user.name + '! Redirecting...', 'success');
      setTimeout(function () { window.location.href = 'index.html'; }, 1000);
    });
  }

  function setupSignupForm() {
    const form = document.getElementById('signupForm');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const name = document.getElementById('signupName').value.trim();
      const email = document.getElementById('signupEmail').value.trim().toLowerCase();
      const password = document.getElementById('signupPassword').value;
      const confirm = document.getElementById('signupConfirm').value;

      if (!name || !email || !password || !confirm) {
        showMessage('Please fill in all fields.', 'error');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showMessage('Please enter a valid email address.', 'error');
        return;
      }
      if (password.length < 6) {
        showMessage('Password must be at least 6 characters.', 'error');
        return;
      }
      if (password !== confirm) {
        showMessage('Passwords do not match.', 'error');
        return;
      }

      const users = getUsers();
      if (users[email]) {
        showMessage('An account with this email already exists. Please log in.', 'error');
        return;
      }

      users[email] = { name: name, passwordHash: await hashPassword(password) };
      saveUsers(users);

      showMessage('Account created! Redirecting to login...', 'success');
      setTimeout(function () { window.location.href = 'login.html'; }, 1000);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupShowPassword();
    setupLoginForm();
    setupSignupForm();
  });
})();
