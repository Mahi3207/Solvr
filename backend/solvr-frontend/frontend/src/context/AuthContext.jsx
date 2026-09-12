import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { authService } from "../services/authService";
import { tokenStorage } from "../api/apiClient";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    if (!tokenStorage.getAccessToken()) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const profile = await authService.getMe();
      setUser(profile);
    } catch {
      tokenStorage.clear();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();

    // If the interceptor gives up on refreshing, log this tab out.
    const onForceLogout = () => setUser(null);
    window.addEventListener("solvr:logout", onForceLogout);
    return () => window.removeEventListener("solvr:logout", onForceLogout);
  }, [loadUser]);

  const login = useCallback(async ({ email, password }) => {
    await authService.login({ email, password });
    const profile = await authService.getMe();
    setUser(profile);
    return profile;
  }, []);

  const register = useCallback(async ({ name, email, password }) => {
    return authService.register({ name, email, password });
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    const profile = await authService.getMe();
    setUser(profile);
    return profile;
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      isAdmin: user?.role === "ADMIN",
      login,
      register,
      logout,
      refreshProfile,
    }),
    [user, loading, login, register, logout, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
