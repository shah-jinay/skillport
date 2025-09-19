export async function logVisit(path) {
  try {
    await fetch("http://localhost:8000/events/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path }),
    });
  } catch (e) {
    console.error("Failed to log visit:", e);
  }
}
export async function fetchJobs({ search = "", sponsorship } = {}) {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (sponsorship !== undefined) params.set("sponsorship", sponsorship);
  const res = await fetch(`/api/jobs?${params.toString()}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function fetchCompanies() {
  const res = await fetch("/api/companies");
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function register(email, password) {
  const r = await fetch("/api/auth/register", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ email, password }) });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function login(email, password) {
  const r = await fetch("/api/auth/login", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ email, password }) });
  if (!r.ok) throw new Error(await r.text());
  return r.json(); // {access_token}
}

export async function me(token) {
  const r = await fetch("/api/auth/me", { headers:{ Authorization:`Bearer ${token}` } });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}
