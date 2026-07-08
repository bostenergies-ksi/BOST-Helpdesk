/* ═══════════════════════════════════════════════════════
   BOST-KSI IT HELP DESK — js/login.js
   Authentication, signup, and credential management
   ═══════════════════════════════════════════════════════ */

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

/**
 * Display the signup screen and hide others.
 */
function showSignupScreen() {
  document.getElementById('signup-screen').classList.remove('hidden');
  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('app-shell').classList.add('hidden');
  document.getElementById('signup-form').reset();
  document.getElementById('signup-error').textContent = '';
}

/**
 * Display the login screen and hide others.
 */
function showLoginScreen() {
  document.getElementById('signup-screen').classList.add('hidden');
  document.getElementById('login-screen').classList.remove('hidden');
  document.getElementById('app-shell').classList.add('hidden');
  document.getElementById('login-form').reset();
  document.getElementById('login-error').textContent = '';
}

/**
 * Display the app dashboard and hide auth screens.
 */
function showAppShell() {
  document.getElementById('signup-screen').classList.add('hidden');
  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('app-shell').classList.remove('hidden');
  initNewTicketDefaults();
  navigate('dashboard');
}

/**
 * Transition from login to signup screen.
 */
function goToSignup() {
  showSignupScreen();
}

/**
 * Handle signup form submission.
 */
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

/**
 * Handle login form submission.
 */
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

/**
 * Clear current session and return to login screen.
 */
function logout() {
  localStorage.removeItem('bost_current_user');
  showLoginScreen();
  showToast('You have been logged out.');
}
