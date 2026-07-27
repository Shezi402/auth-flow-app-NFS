import { createContext, useContext, useEffect, useState } from "react";
import { apiRequest } from "../api/apiClient.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while we check for an existing token

  // On first load, if a token exists, validate it against the backend
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    apiRequest("/auth/me", { auth: true })
      .then((data) => setUser(data.user))
      .catch(() => {
        localStorage.removeItem("token"); // stale/expired token
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const signup = async ({ name, email, password }) => {
    const data = await apiRequest("/auth/signup", {
      method: "POST",
      body: { name, email, password },
    });
    localStorage.setItem("token", data.token);
    setUser(data.user);
    return data;
  };

  const login = async ({ email, password }) => {
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: { email, password },
    });
    localStorage.setItem("token", data.token);
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    try {
      await apiRequest("/auth/logout", { method: "POST", auth: true });
    } catch {
      // even if the network call fails, clear the client-side session
    } finally {
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
