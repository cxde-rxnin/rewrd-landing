// Central API endpoints for Engagement Tracker
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://138.68.131.42:8000";

export const API_ENDPOINTS = {
  login: "/api/auth/login",
  register: "/api/auth/register",
  logout: "/api/auth/logout",
  refresh: "/api/auth/refresh",
  user: "/api/user",
  dashboardOverview: "/api/dashboard/overview",
  dashboardOverviewParticipant: "/api/dashboard/overview/participant",
  tasks: "/api/task",
  createTask: "/api/task",
  socialPlatforms: "/api/task/social-platform",
  taskTypes: (platformId: string) => `/api/task/task-type/${platformId}`,
  deleteTask: (id: string) => `/api/task/${id}`,
  submitTask: (id: string, action: string) => `/api/task/${id}/submission?action=${action}`,
  wallet: "/api/wallet",
  fundWallet: "/api/wallet/fund",
};
