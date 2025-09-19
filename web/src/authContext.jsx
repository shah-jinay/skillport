import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getToken, setToken as saveToken, clearToken as wipeToken } from "./auth";
import { me, login as apiLogin, register as apiRegister } from "./lib/api";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getToken());
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!token);

  // load current user when token changes
  useEffect(() => {
    let cancel = false;
    async function run() {
      if (!token) { setUser(null); setLoading(false); return; }
      setLoading(true);
      try {
        const u = await me(token);
        if (!cancel) setUser(u);
      } catch {
        if (!cancel) { setUser(null); setToken(null); wipeToken(); }
      } finally {
        if (!cancel) setLoading(false);
      }
    }
    run();
    const onChange = () => setToken(getToken());
    window.addEventListener("auth-token-changed", onChange);
    return () => { cancel = true; window.removeEventListener("auth-token-changed", onChange); };
  }, [token]);

  const value = useMemo(() => ({
    user,
    token,
    loading,
    isAuthed: !!user,
    roles: new Set(user?.roles?.map(r => r.name) || []),
    async login(email, password) {
      const { access_token } = await apiLogin(email, password);
      saveToken(access_token);
    },
    async register(email, password) {
      const res = await apiRegister(email, password);
      // optionally auto-login
      const { access_token } = await apiLogin(email, password);
      saveToken(access_token);
      return res;
    },
    logout() {
      wipeToken();
    },
  }), [user, token, loading]);

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
