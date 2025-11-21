// API service for Engagement Tracker API
// Handles authentication, user, dashboard, task, wallet endpoints

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://138.68.131.42:8000";

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  authToken?: string
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...options.headers,
  };
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw { status: res.status, ...error };
  }
  return res.json();
}

// Auth endpoints
export const AuthAPI = {
  login: (data: { email: string; password: string }) =>
    apiFetch<{ access_token: string; refresh_token: string; user: any }>(
      "/api/auth/login",
      { method: "POST", body: JSON.stringify(data) }
    ),
  register: (data: { email: string; password: string; name: string; account_type: string }) =>
    apiFetch<{ access_token: string; refresh_token: string; user: any }>(
      "/api/auth/register",
      { method: "POST", body: JSON.stringify(data) }
    ),
  logout: (accessToken: string, refreshToken: string) =>
    apiFetch(
      "/api/auth/logout?refresh_token=" + encodeURIComponent(refreshToken),
      { method: "POST" },
      accessToken
    ),
  refresh: (refresh_token: string) =>
    apiFetch<{ access_token: string; refresh_token: string }>(
      "/api/auth/refresh",
      { method: "PATCH", body: JSON.stringify({ refresh_token }) }
    ),
};

// User endpoints
export const UserAPI = {
  get: (accessToken: string) =>
    apiFetch<any>("/api/user", {}, accessToken),
};

// Dashboard endpoints
export const DashboardAPI = {
  overview: (accessToken: string) =>
    apiFetch<any>("/api/dashboard/overview", {}, accessToken),
  overviewParticipant: (accessToken: string) =>
    apiFetch<any>("/api/dashboard/overview/participant", {}, accessToken),
};

// Task endpoints
export const TaskAPI = {
  getAll: (accessToken: string) =>
    apiFetch<any[]>("/api/task", {}, accessToken),
  create: (accessToken: string, data: any) =>
    apiFetch<any>("/api/task", { method: "POST", body: JSON.stringify(data) }, accessToken),
  getSocialPlatforms: (accessToken?: string) =>
    apiFetch<any[]>("/api/task/social-platform", {}, accessToken),
  getTaskTypes: (platformId: string, accessToken?: string) =>
    apiFetch<any[]>(`/api/task/task-type/${platformId}`, {}, accessToken),
  delete: (accessToken: string, id: string) =>
    apiFetch(`/api/task/${id}`, { method: "DELETE" }, accessToken),
  submit: (accessToken: string, id: string, action: string) =>
    apiFetch<any>(`/api/task/${id}/submission?action=${action}`, { method: "POST" }, accessToken),
};

// Wallet endpoints
export const WalletAPI = {
  get: (accessToken: string) =>
    apiFetch<any>("/api/wallet", {}, accessToken),
  fund: (accessToken: string, amount: number) =>
    apiFetch<any>("/api/wallet/fund", { method: "POST", body: JSON.stringify({ amount }) }, accessToken),
};
