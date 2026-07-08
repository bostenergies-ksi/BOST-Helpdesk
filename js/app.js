/* ═══════════════════════════════════════════════════════
   BOST-KSI IT HELP DESK — js/app.js
   App entry point: navigation, init, toast utility
   ═══════════════════════════════════════════════════════ */

// ── AUTHENTICATION ─────────────────────────────────────

/**
 * Get all stored user credentials from localStorage.
 * @returns {Object} Dictionary of {username: password}
 */
function getStoredUsers() {
  const stored = localStorage.getItem('bost_users');
  return stored ? JSON.parse(stored) : {};
}

/**
 * Save user credentials to localStorage.
 * @param {string} username
 * @param {string} password
 */
function saveUser(username, password) {
  const users = getStoredUsers();
  users[username] = password;
  localStorage.setItem('bost_users', JSON.stringify(users));
}

/**
 * Check if a user exists and password is correct.
 */
function verifyCredentials(username, password) {
  const users = getStoredUsers();
  return users[username] === password;
}

function showSignupScreen() {
  document.getElementById('signup-screen').classList.remove('hidden');
  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('app-shell').classList.add('hidden');
  document.getElementById('signup-form').reset();
  document.getElementById('signup-error').textContent = '';
}

function showLoginScreen() {
  document.getElementById('signup-screen').classList.add('hidden');
  document.getElementById('login-screen').classList.remove('hidden');
  document.getElementById('app-shell').classList.add('hidden');
  document.getElementById('login-form').reset();
  document.getElementById('login-error').textContent = '';
}

function showAppShell() {
  document.getElementById('signup-screen').classList.add('hidden');
  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('app-shell').classList.remove('hidden');
  initNewTicketDefaults();
  navigate('dashboard');
}

function goToSignup() {
  showSignupScreen();
}

function handleSignup(event) {
  event.preventDefault();
  const username = document.getElementById('signup-username').value.trim();
  const password = document.getElementById('signup-password').value;
  const confirm = document.getElementById('signup-confirm').value;
  const errorEl = document.getElementById('signup-error');

  // Validation
  if (!username || username.length < 3) {
    errorEl.textContent = 'Username must be at least 3 characters long.';
    return;
  }

  if (!password || password.length < 6) {
    errorEl.textContent = 'Password must be at least 6 characters long.';
    return;
  }

  if (password !== confirm) {
    errorEl.textContent = 'Passwords do not match.';
    return;
  }

  const users = getStoredUsers();
  if (users[username]) {
    errorEl.textContent = 'Username already exists. Please choose another.';
    return;
  }

  // Save the new user
  saveUser(username, password);
  errorEl.textContent = '';
  showToast('✓ Account created! Please log in.');
  showLoginScreen();
}

function handleLogin(event) {
  event.preventDefault();
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;
  const errorEl = document.getElementById('login-error');

  if (verifyCredentials(username, password)) {
    errorEl.textContent = '';
    localStorage.setItem('bost_current_user', username);
    showAppShell();
    showToast('Welcome back, ' + username);
  } else {
    errorEl.textContent = 'Invalid username or password.';
  }
}

function logout() {
  localStorage.removeItem('bost_current_user');
  showLoginScreen();
  showToast('You have been logged out.');
}

// ── NAVIGATION ───────────────────────────────────────────
/**
 * Switch to a named view and update sidebar highlight.
 * @param {'dashboard'|'new'|'tickets'|'reports'} view
 */
function navigate(view) {
  // Hide all views
  document.querySelectorAll('.view')
    .forEach(v => v.classList.remove('active'));

  // Deactivate all nav items
  document.querySelectorAll('.nav-item')
    .forEach(n => n.classList.remove('active'));

  // Show target view
  document.getElementById('view-' + view).classList.add('active');

  // Highlight matching nav item
  const navEl = document.getElementById('nav-' + view);
  if (navEl) navEl.classList.add('active');

  // Update topbar title
  const titles = {
    dashboard : 'BOST-KSI IT HELP DESK — Dashboard',
    new       : 'BOST-KSI IT HELP DESK — New Ticket',
    tickets   : 'BOST-KSI IT HELP DESK — Tickets',
    reports   : 'BOST-KSI IT HELP DESK — Reports'
  };
  document.getElementById('topbar-title').textContent =
    titles[view] || 'BOST-KSI IT HELP DESK';

  // Run view-specific render functions
  if (view === 'dashboard') renderDashboard();
  if (view === 'tickets')   renderTickets();
}

// ── REFRESH ───────────────────────────────────────────────
/**
 * Re-render whichever view is currently active.
 */
function refreshAll() {
  const active = document.querySelector('.view.active')?.id?.replace('view-', '') || 'dashboard';
  navigate(active);
  showToast('✓ Refreshed');
}

// ── TOAST NOTIFICATION ────────────────────────────────────
/**
 * Show a short toast message at the bottom of the screen.
 * @param {string} msg
 */
function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2500);
}

// ── MODAL CLOSE ON BACKDROP CLICK ────────────────────────
document.getElementById('modal-overlay').addEventListener('click', function (e) {
  if (e.target === this) closeModal();
});

// ── NEW TICKET FORM DEFAULTS ──────────────────────────────
/**
 * Pre-fill today's date and current time into the New Ticket form.
 */
function initNewTicketDefaults() {
  const now = new Date();
  const pad = n => String(n).padStart(2, '0');

  document.getElementById('f-date').value =
    `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

  document.getElementById('f-time').value =
    `${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

// ── INIT ──────────────────────────────────────────────────
const users = getStoredUsers();
if (Object.keys(users).length === 0) {
  showSignupScreen();
} else {
  showLoginScreen();
}
