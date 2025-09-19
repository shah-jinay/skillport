// src/lib/auth.js
const KEY = "sp_token";

export function saveToken(t) {
  if (t) localStorage.setItem(KEY, t);
}

export function getToken() {
  return localStorage.getItem(KEY);
}

export function clearToken() {
  localStorage.removeItem(KEY);
}

export function isAuthed() {
  return !!getToken();
}
