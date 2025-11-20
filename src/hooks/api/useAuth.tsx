import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import { AuthAPI, UserAPI } from "../../services/api";

function getStoredAuth() {
  let user = localStorage.getItem("user");
  if (!user || user === "undefined") user = null;
  else {
    try {
      user = JSON.parse(user);
    } catch {
      user = null;
    }
  }
  const rawAccess = localStorage.getItem("accessToken");
  const rawRefresh = localStorage.getItem("refreshToken");
  const accessToken = rawAccess && rawAccess !== "null" && rawAccess !== "undefined" && rawAccess.trim() !== "" ? rawAccess : null;
  const refreshToken = rawRefresh && rawRefresh !== "null" && rawRefresh !== "undefined" && rawRefresh.trim() !== "" ? rawRefresh : null;
  console.log("[useAuth] getStoredAuth", { user, accessToken, refreshToken });
  return {
    user,
    accessToken,
    refreshToken,
  };
}

const AuthContext = createContext<any>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const stored = getStoredAuth();
  const [user, setUser] = useState<any>(stored.user);
  const [accessToken, setAccessToken] = useState<string | null>(stored.accessToken);
  const [refreshToken, setRefreshToken] = useState<string | null>(stored.refreshToken);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    setInitialized(true);
    console.log("[useAuth] Initialized", { user, accessToken, refreshToken });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await AuthAPI.login({ email, password });
      console.log("[useAuth] login raw response", res);
      const anyRes = (res as any).data || res; // <-- FIX: use res.data if present
      const resUser = anyRes.user ?? anyRes.profile ?? null;
      const access_token = anyRes.access_token ?? anyRes.accessToken ?? anyRes.token ?? anyRes.access ?? null;
      const refresh_token = anyRes.refresh_token ?? anyRes.refreshToken ?? anyRes.refresh ?? null;

      setAccessToken(access_token || null);
      setRefreshToken(refresh_token || null);
      if (access_token) localStorage.setItem("accessToken", access_token); else localStorage.removeItem("accessToken");
      if (refresh_token) localStorage.setItem("refreshToken", refresh_token); else localStorage.removeItem("refreshToken");

      let finalUser = resUser;
      if (!finalUser && access_token) {
        try {
          finalUser = await UserAPI.get(access_token);
        } catch {}
      }
      setUser(finalUser || null);
      localStorage.setItem("user", JSON.stringify(finalUser || null));
      console.log("[useAuth] login success", { finalUser, access_token, refresh_token });
      setLoading(false);
      return res;
    } catch (e: any) {
      setError(e?.message || "Login failed");
      setLoading(false);
      console.log("[useAuth] login error", e);
      throw e;
    }
  }, []);

  const register = useCallback(async (data: { email: string; password: string; name: string; account_type: string }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await AuthAPI.register(data);
      const anyRes = (res as any).data || res; // <-- FIX: use res.data if present
      const regUser = anyRes.user ?? anyRes.profile ?? null;
      const access_token = anyRes.access_token ?? anyRes.accessToken ?? anyRes.token ?? anyRes.access ?? null;
      const refresh_token = anyRes.refresh_token ?? anyRes.refreshToken ?? anyRes.refresh ?? null;
      setUser(regUser || null);
      setAccessToken(access_token || null);
      setRefreshToken(refresh_token || null);
      localStorage.setItem("user", JSON.stringify(regUser || null));
      if (access_token) localStorage.setItem("accessToken", access_token); else localStorage.removeItem("accessToken");
      if (refresh_token) localStorage.setItem("refreshToken", refresh_token); else localStorage.removeItem("refreshToken");
      setLoading(false);
      return res;
    } catch (e: any) {
      setError(e?.message || "Registration failed");
      setLoading(false);
      throw e;
    }
  }, []);

  const logout = useCallback(async () => {
    if (!accessToken || !refreshToken) return;
    setLoading(true);
    setError(null);
    try {
      await AuthAPI.logout(accessToken, refreshToken);
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setLoading(false);
      console.log("[useAuth] logout success");
    } catch (e: any) {
      setError(e?.message || "Logout failed");
      setLoading(false);
      console.log("[useAuth] logout error", e);
    }
  }, [accessToken, refreshToken]);

  const getUser = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const user = await UserAPI.get(accessToken);
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      setLoading(false);
      console.log("[useAuth] getUser success", user);
      return user;
    } catch (e: any) {
      setError(e?.message || "Failed to fetch user");
      setLoading(false);
      console.log("[useAuth] getUser error", e);
    }
  }, [accessToken]);

  const value = useMemo(
    () => ({
      user,
      accessToken,
      refreshToken,
      loading,
      error,
      login,
      register,
      logout,
      getUser,
      setUser,
      setAccessToken,
      setRefreshToken,
      initialized,
    }),
    [user, accessToken, refreshToken, loading, error, initialized, login, register, logout, getUser]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}
