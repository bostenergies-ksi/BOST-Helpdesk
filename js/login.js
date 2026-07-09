/* ═══════════════════════════════════════════════════════
   BOST-KSI IT HELP DESK — js/login.js
   Authentication (shared password)
   ═══════════════════════════════════════════════════════ */

const SHARED_PASSWORD = "Pa$$w0rd1";

function showLoginScreen() {
  document.getElementById('login-screen').classList.remove('hidden');
  document.getElementById('app-shell').classList.add('hidden');
  document.getElementById('login-form').reset();
  document.getElementById('login-error').textContent = '';
}

function showAppShell() {
  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('app-shell').classList.remove('hidden');
  initNewTicketDefaults();
  navigate('dashboard');
}

function handleLogin(event) {
  event.preventDefault();
  const password = document.getElementById('login-password').value;
  const errorEl = document.getElementById('login-error');

  if (password === SHARED_PASSWORD) {
    errorEl.textContent = '';
    sessionStorage.setItem('bost_logged_in', 'true');
    showAppShell();
    showToast('Welcome to BOST-KSI IT Help Desk');
  } else {
    errorEl.textContent = 'Incorrect password.';
  }
}

function logout() {
  sessionStorage.removeItem('bost_logged_in');
  showLoginScreen();
  showToast('You have been logged out.');
}