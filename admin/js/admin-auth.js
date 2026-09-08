/**
 * NOVACREST HOMES LIMITED — Admin Authentication Module
 * Session verification, credential validation & route guarding
 */

const AUTH_STORAGE_KEY = 'novacrest_admin_session';
const REMEMBER_KEY = 'novacrest_admin_remembered';

// Permitted administrator accounts (can be extended or linked to backend)
const VALID_CREDENTIALS = [
  { username: 'admin', email: 'admin@novacresthomes.com', pass: 'Novacrest2026!', name: 'Executive Admin', role: 'Super Admin' },
  { username: 'joey', email: 'joey@novacresthomes.com', pass: 'Novacrest2026!', name: 'Joey Developer', role: 'System Admin' },
  { username: 'director', email: 'director@novacresthomes.com', pass: 'Novacrest2026!', name: 'Managing Director', role: 'Executive' }
];

export function isAuthenticated() {
  try {
    const sessionToken = sessionStorage.getItem(AUTH_STORAGE_KEY) || localStorage.getItem(AUTH_STORAGE_KEY);
    if (!sessionToken) return false;
    const session = JSON.parse(sessionToken);
    // Simple expiry check (24 hours)
    if (Date.now() - session.timestamp > 24 * 60 * 60 * 1000) {
      logout();
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
}

export function getCurrentUser() {
  try {
    const sessionToken = sessionStorage.getItem(AUTH_STORAGE_KEY) || localStorage.getItem(AUTH_STORAGE_KEY);
    if (!sessionToken) return null;
    return JSON.parse(sessionToken).user;
  } catch (e) {
    return null;
  }
}

export function login(identifier, password, remember = false) {
  const cleanId = (identifier || '').trim().toLowerCase();
  const cleanPass = (password || '').trim();

  const matched = VALID_CREDENTIALS.find(u => 
    (u.username.toLowerCase() === cleanId || u.email.toLowerCase() === cleanId) && u.pass === cleanPass
  );

  if (!matched) {
    return { success: false, message: 'Invalid credentials. Please verify your administrative email/username and password.' };
  }

  const sessionPayload = {
    token: 'nc_adm_' + Math.random().toString(36).substring(2) + Date.now(),
    timestamp: Date.now(),
    user: {
      name: matched.name,
      email: matched.email,
      role: matched.role
    }
  };

  const payloadStr = JSON.stringify(sessionPayload);
  if (remember) {
    localStorage.setItem(AUTH_STORAGE_KEY, payloadStr);
    localStorage.setItem(REMEMBER_KEY, cleanId);
  } else {
    sessionStorage.setItem(AUTH_STORAGE_KEY, payloadStr);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }

  return { success: true, user: sessionPayload.user };
}

export function logout() {
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem(AUTH_STORAGE_KEY);
  window.location.href = 'login.html';
}

export function requireAuth() {
  if (!isAuthenticated()) {
    const currentPath = encodeURIComponent(window.location.pathname);
    window.location.href = `login.html?redirect=${currentPath}`;
  }
}

export function redirectIfAuthenticated() {
  if (isAuthenticated()) {
    window.location.href = 'index.html';
  }
}

// Attach to window for global inline trigger fallback
if (typeof window !== 'undefined') {
  window.NovacrestAuth = {
    isAuthenticated,
    getCurrentUser,
    login,
    logout,
    requireAuth,
    redirectIfAuthenticated
  };
}
