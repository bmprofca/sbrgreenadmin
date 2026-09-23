import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authApi, clearToken, setToken } from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("sbrgreen_admin_token");
    if (!token) {
      setLoading(false);
      return;
    }
    authApi
      .me()
      .then((res) => setAdmin(res.data.admin))
      .catch(() => clearToken())
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo(
    () => ({
      admin,
      loading,
      async login(username, password) {
        const res = await authApi.login(username, password);
        setToken(res.data.token);
        setAdmin(res.data.admin);
        return res;
      },
      logout() {
        clearToken();
        setAdmin(null);
      },
    }),
    [admin, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
