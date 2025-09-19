import { createContext, useContext, useEffect, useState } from "react";
import { login as apiLogin, me as apiMe } from "./lib/api";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!token) return;
    apiMe(token).then(setUser).catch(() => { setToken(null); localStorage.removeItem("token"); });
  }, [token]);

  async function login(email, password) {
    const { access_token } = await apiLogin(email, password);
    setToken(access_token);
    localStorage.setItem("token", access_token);
    const u = await apiMe(access_token);
    setUser(u);
  }
  function logout() { setToken(null); setUser(null); localStorage.removeItem("token"); }

  return <AuthCtx.Provider value={{ token, user, login, logout }}>{children}</AuthCtx.Provider>;
}
