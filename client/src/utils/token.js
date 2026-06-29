export function isTokenExpired(token) {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload.exp) return true;
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export function getStoredAuth() {
  const token = localStorage.getItem('token');
  const userRaw = localStorage.getItem('user');

  if (!token || !userRaw || isTokenExpired(token)) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return { user: null, token: null };
  }

  return { user: JSON.parse(userRaw), token };
}
