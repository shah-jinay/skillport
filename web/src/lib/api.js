import { getToken } from "./auth";

const API_BASE = "/api"; // use Vite proxy; keeps dev/prod simple

function buildQS(params = {}) {
  const p = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    p.set(k, String(v));
  });
  return p.toString();
}

// Generic fetch with optional auth
export async function apiFetch(path, opts = {}) {
  const headers = { "Content-Type": "application/json", ...(opts.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...opts, headers });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }
  return res.status === 204 ? null : res.json();
}

// ---- Visits (Phase 0)
export async function logVisit(path) {
  // hit backend directly (outside proxy) is also fine; proxy version shown:
  try {
    await fetch(`${API_BASE}/events/visit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path }),
    });
  } catch (e) {
    console.error("Failed to log visit:", e);
  }
}

// ---- Jobs
export async function fetchJobs(params = {}) {
  const qs = buildQS(params);
  return apiFetch(`/jobs${qs ? `?${qs}` : ""}`);
}

export async function fetchJob(id) {
  return apiFetch(`/jobs/${id}`);
}

export async function fetchJobsCount(params = {}) {
  const qs = buildQS(params);
  return apiFetch(`/jobs/count${qs ? `?${qs}` : ""}`);
}

export async function createJob(payload) {
  return apiFetch(`/jobs`, { method: "POST", body: JSON.stringify(payload) });
}

// ---- Companies
export async function fetchCompanies() {
  return apiFetch(`/companies`);
}

// ---- Stats
export async function fetchJobsByLocation() {
  return apiFetch(`/stats/jobs/by-location`);
}

export async function fetchVisaByCompany() {
  return apiFetch(`/stats/visa/by-company`);
}

// ---- Auth
export async function register(email, password) {
  return apiFetch(`/auth/register`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function login(email, password) {
  // returns { access_token }
  return apiFetch(`/auth/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function me(tokenOverride) {
  // Sometimes you might want to pass a token explicitly for a one-off call.
  const headers = {};
  const t = tokenOverride || getToken();
  if (t) headers.Authorization = `Bearer ${t}`;
  const res = await fetch(`${API_BASE}/auth/me`, { headers });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
