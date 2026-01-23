// API service for Engagement Tracker API
// Handles authentication, user, dashboard, task, wallet endpoints

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://138.68.131.42:8000";
export const WS_URL = import.meta.env.VITE_WS_URL || "wss://api.partnerpulse.us/ws";

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  authToken?: string
): Promise<T> {
  console.log('apiFetch: token =', authToken); // DEBUG: log token
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
export const UserAPI = {
  get: (accessToken: string) =>
    apiFetch<any>("/api/user", {}, accessToken),
  update: (accessToken: string, data: any) =>
    apiFetch<any>("/api/user", { method: "PATCH", body: JSON.stringify(data) }, accessToken),
  getConnectedAccounts: (accessToken: string) =>
    apiFetch<any[]>("/api/user/accounts", {}, accessToken),
  connectAccount: (accessToken: string, data: any) =>
    apiFetch<any>("/api/user/accounts", { method: "POST", body: JSON.stringify(data) }, accessToken),
  disconnectAccount: (accessToken: string, id: string) =>
    apiFetch(`/api/user/accounts/${id}`, { method: "DELETE" }, accessToken),
};

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
  changePassword: (accessToken: string, data: any) =>
    apiFetch("/api/auth/password-change", { method: "POST", body: JSON.stringify(data) }, accessToken),
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
  submit: (accessToken: string, id: string, action: string) => {
    console.log("TaskAPI.submit called with:", { id, action });
    return apiFetch<any>(`/api/task/${id}/submission?action=${action}`, {
      method: "POST",
      body: JSON.stringify({})
    }, accessToken);
  },
  getSubmissionStatus: (accessToken: string, id: string) =>
    apiFetch<any>(`/api/task/${id}/submission`, {}, accessToken),
};

// Wallet endpoints
export const WalletAPI = {
  get: (accessToken: string) =>
    apiFetch<any>("/api/wallet", {}, accessToken),
  fund: (accessToken: string, amount: number) =>
    apiFetch<any>("/api/wallet/fund", { method: "POST", body: JSON.stringify({ amount }) }, accessToken),
};

// Social endpoints
export const SocialAPI = {
  list: (accessToken: string) =>
    apiFetch<any[]>("/api/social", {}, accessToken),
  delete: (accessToken: string, id: string) =>
    apiFetch(`/api/social/${id}`, { method: "DELETE" }, accessToken),
  facebookLogin: async (accessToken: string) => {
    console.log('[SocialAPI] Initiating Facebook login...');

    // Make a fetch request with Authorization header
    // The backend will handle the redirect to Facebook OAuth
    const response = await fetch(`${BASE_URL}/api/social/facebook`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
      redirect: "manual", // Don't follow redirects automatically
    });

    console.log('[SocialAPI] Response status:', response.status, response.type);

    // If backend returns a redirect, get the Location header
    // Note: With redirect: "manual", status 0 with type "opaqueredirect" means a redirect occurred
    if (response.type === 'opaqueredirect' || response.status === 0) {
      console.log('[SocialAPI] Opaque redirect detected, following redirect...');
      // For opaque redirects, we can't read headers, so we need to let browser follow it
      // But we need to ensure token is in the request. Let's try a different approach.
      sessionStorage.setItem('oauth_token', accessToken);
      window.location.href = `${BASE_URL}/api/social/facebook`;
      return;
    }

    if (response.status === 302 || response.status === 301 || response.status === 307 || response.status === 308) {
      const redirectUrl = response.headers.get("Location");
      console.log('[SocialAPI] Redirect URL:', redirectUrl);
      if (redirectUrl) {
        // Store token for when user comes back from OAuth
        sessionStorage.setItem('oauth_token', accessToken);
        window.location.href = redirectUrl;
        return;
      }
    }

    // If response is not a redirect, check if it's JSON with a URL
    if (response.ok) {
      try {
        const text = await response.text();
        console.log('[SocialAPI] Response text:', text);

        // Try to parse as JSON
        try {
          const data = JSON.parse(text);
          console.log('[SocialAPI] Response data:', data);

          // Check for redirect URL in various possible fields
          // Also check nested data object
          const redirectUrl =
            data.redirect_url ||
            data.url ||
            data.auth_url ||
            data.authorization_url ||
            data.login_url ||
            data.data?.redirect_url ||
            data.data?.url ||
            data.data?.auth_url ||
            data.data?.authorization_url ||
            data.data?.login_url;

          if (redirectUrl) {
            sessionStorage.setItem('oauth_token', accessToken);
            window.location.href = redirectUrl;
            return;
          }
        } catch (jsonError) {
          console.error('[SocialAPI] Response is not JSON');
          // Check if it's HTML (might be the OAuth page itself)
          if (text.includes('<html') || text.includes('<!DOCTYPE')) {
            console.log('[SocialAPI] Response appears to be HTML, redirecting directly');
            sessionStorage.setItem('oauth_token', accessToken);
            window.location.href = `${BASE_URL}/api/social/facebook`;
            return;
          }
        }
      } catch (e) {
        console.error('[SocialAPI] Failed to read response:', e);
      }
    }

    // Try to get error details
    let errorMessage = "Failed to initiate Facebook login";
    if (!response.bodyUsed) {
      try {
        const errorText = await response.text();
        console.log('[SocialAPI] Error response:', errorText);
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          errorMessage = errorText ? errorText.substring(0, 100) : errorMessage;
        }
      } catch (e) {
        // Ignore
      }
    }

    console.error('[SocialAPI] Failed to initiate Facebook login:', response.status, errorMessage);
    throw new Error(response.status === 401 ? "Invalid or expired token" : errorMessage);
  },
  tiktokLogin: async (accessToken: string) => {
    console.log('[SocialAPI] Initiating TikTok login...');

    const response = await fetch(`${BASE_URL}/api/social/tiktok`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
      redirect: "manual",
    });

    console.log('[SocialAPI] Response status:', response.status, response.type);

    // Handle opaque redirect
    if (response.type === 'opaqueredirect' || response.status === 0) {
      console.log('[SocialAPI] Opaque redirect detected, following redirect...');
      sessionStorage.setItem('oauth_token', accessToken);
      window.location.href = `${BASE_URL}/api/social/tiktok`;
      return;
    }

    // If backend returns a redirect, get the Location header
    if (response.status === 302 || response.status === 301 || response.status === 307 || response.status === 308) {
      const redirectUrl = response.headers.get("Location");
      console.log('[SocialAPI] Redirect URL:', redirectUrl);
      if (redirectUrl) {
        sessionStorage.setItem('oauth_token', accessToken);
        window.location.href = redirectUrl;
        return;
      }
    }

    // If response is not a redirect, check if it's JSON with a URL
    if (response.ok) {
      try {
        const text = await response.text();
        console.log('[SocialAPI] Response text:', text);

        // Try to parse as JSON
        try {
          const data = JSON.parse(text);
          console.log('[SocialAPI] Response data:', data);

          // Check for redirect URL in various possible fields
          // Also check nested data object
          const redirectUrl =
            data.redirect_url ||
            data.url ||
            data.auth_url ||
            data.authorization_url ||
            data.login_url ||
            data.data?.redirect_url ||
            data.data?.url ||
            data.data?.auth_url ||
            data.data?.authorization_url ||
            data.data?.login_url;

          if (redirectUrl) {
            sessionStorage.setItem('oauth_token', accessToken);
            window.location.href = redirectUrl;
            return;
          }
        } catch (jsonError) {
          console.error('[SocialAPI] Response is not JSON');
          // Check if it's HTML (might be the OAuth page itself)
          if (text.includes('<html') || text.includes('<!DOCTYPE')) {
            console.log('[SocialAPI] Response appears to be HTML, redirecting directly');
            sessionStorage.setItem('oauth_token', accessToken);
            window.location.href = `${BASE_URL}/api/social/tiktok`;
            return;
          }
        }
      } catch (e) {
        console.error('[SocialAPI] Failed to read response:', e);
      }
    }

    // Try to get error details
    let errorMessage = "Failed to initiate TikTok login";
    try {
      const errorText = await response.text();
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        errorMessage = errorText || errorMessage;
      }
    } catch (e) {
      // Ignore
    }

    console.error('[SocialAPI] Failed to initiate TikTok login:', response.status, errorMessage);
    throw new Error(response.status === 401 ? "Invalid or expired token" : errorMessage);
  },
};
