// web/src/context/AuthProvider.jsx
import { createContext, useContext, useMemo, useState } from "react";
import { login as apiLogin, register as apiRegister } from "../lib/api";
import { saveToken, clearToken, getToken } from "../lib/auth";

const AuthCtx = createContext(null);
export function useAuth() { return useContext(AuthCtx); }

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(getToken());

  const value = useMemo(() => ({
    token,
    isAuthed: !!token,
    async login(email, password) {
      const data = await apiLogin(email, password); // expects { access_token }
      saveToken(data.access_token);
      setToken(data.access_token);
      return true;
    },
    async register(email, password) {
      await apiRegister(email, password);
      const data = await apiLogin(email, password);
      saveToken(data.access_token);
      setToken(data.access_token);
    },
    logout() {
      clearToken();
      setToken(null);
    },
  }), [token]);

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

// Optional: also export named if you want to import { AuthProvider }
export { AuthProvider as ProviderAlias }; // (ignore if not needed)
