/* ═══════════════════════════════════════════════════════
   BOST-KSI IT HELP DESK — js/login.js
   Authentication (Apps Script backend)
   ═══════════════════════════════════════════════════════ */

/**
 * Display the login screen and hide others.
 */
function showLoginScreen() {
  document.getElementById('login-screen').classList.remove('hidden');
  document.getElementById('app-shell').classList.add('hidden');
  document.getElementById('login-form').reset();
  document.getElementById('login-error').textContent = '';
}

/**
 * Display the app dashboard and hide auth screens.
 */
function showAppShell() {
  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('app-shell').classList.remove('hidden');
  initNewTicketDefaults();
  navigate('dashboard');
}

/**
 * Handle login form submission — checks credentials against the backend.
 */
async function handleLogin(event) {
  event.preventDefault();
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;
  const errorEl = document.getElementById('login-error');
  const submitBtn = event.target.querySelector('button[type="submit"]');

  errorEl.textContent = '';
  if (submitBtn) submitBtn.disabled = true;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'login', username, password })
    });
    const result = await response.json();

    if (result.success) {
      sessionStorage.setItem('bost_token', result.token);
      sessionStorage.setItem('bost_current_user', username);
      showAppShell();
      showToast('Welcome back, ' + username);
    } else {
      errorEl.textContent = result.message || 'Invalid username or password.';
    }
  } catch (err) {
    errorEl.textContent = 'Could not reach the server. Check your connection.';
  } finally {
    if (submitBtn) submitBtn.disabled = false;
  }
}

/**
 * Clear current session and return to login screen.
 */
function logout() {
  sessionStorage.removeItem('bost_token');
  sessionStorage.removeItem('bost_current_user');
  showLoginScreen();
  showToast('You have been logged out.');
}