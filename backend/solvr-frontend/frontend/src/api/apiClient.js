import axios from "axios";

/**
 * ------------------------------------------------------------------
 * MULTI-TAB AUTH STORAGE
 * ------------------------------------------------------------------
 * We deliberately use `sessionStorage` (not `localStorage`) for tokens.
 * `sessionStorage` is scoped per browser TAB (technically per top-level
 * browsing context), so:
 *   - Tab 1 logged in as User A and Tab 2 logged in as User B never
 *     see each other's tokens.
 *   - Logging out in one tab does not clear tokens in another tab.
 *   - Opening a fresh tab always starts logged-out (by design — this
 *     mirrors how most banking/finance apps behave for safety).
 *
 * Trade-off: duplicating a tab (Ctrl+Shift+... "duplicate tab") copies
 * sessionStorage into the new tab, so that specific action *will* carry
 * the session over — this is standard browser behavior and is called
 * out in the README.
 * ------------------------------------------------------------------
 */
const ACCESS_TOKEN_KEY = "solvr_access_token";
const REFRESH_TOKEN_KEY = "solvr_refresh_token";
const USER_EMAIL_KEY = "solvr_user_email";

export const tokenStorage = {
  getAccessToken: () => sessionStorage.getItem(ACCESS_TOKEN_KEY),
  getRefreshToken: () => sessionStorage.getItem(REFRESH_TOKEN_KEY),
  getEmail: () => sessionStorage.getItem(USER_EMAIL_KEY),
  setTokens: ({ accessToken, refreshToken, email }) => {
    if (accessToken) sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    if (email) sessionStorage.setItem(USER_EMAIL_KEY, email);
  },
  setAccessToken: (accessToken) => {
    sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  },
  clear: () => {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(USER_EMAIL_KEY);
  },
};

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach access token to every request
apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ------------------------------------------------------------------
// Refresh-on-401 logic.
// The backend's POST /auth/refresh takes `refreshToken` as a query
// param (not a JSON body) and only returns a new accessToken — the
// refresh token itself is not rotated.
// ------------------------------------------------------------------
let isRefreshing = false;
let pendingQueue = [];

function resolveQueue(error, token) {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  pendingQueue = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    const isAuthEndpoint =
      originalRequest?.url?.includes("/auth/login") ||
      originalRequest?.url?.includes("/auth/register") ||
      originalRequest?.url?.includes("/auth/refresh");

    if (status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      const refreshToken = tokenStorage.getRefreshToken();

      if (!refreshToken) {
        tokenStorage.clear();
        window.dispatchEvent(new CustomEvent("solvr:logout"));
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Queue this request until the in-flight refresh resolves
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        }).then((newToken) => {
          originalRequest._retry = true;
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post(
          `${BASE_URL}/auth/refresh`,
          null,
          { params: { refreshToken } }
        );
        const newAccessToken = response.data?.data?.accessToken;

        if (!newAccessToken) throw new Error("No access token in refresh response");

        tokenStorage.setAccessToken(newAccessToken);
        resolveQueue(null, newAccessToken);
        isRefreshing = false;

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        resolveQueue(refreshError, null);
        isRefreshing = false;
        tokenStorage.clear();
        window.dispatchEvent(new CustomEvent("solvr:logout"));
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Every backend response is wrapped in ApiResponse<T>:
 *   { success, message, data }
 * This helper unwraps `.data.data` and normalizes errors into a
 * plain { message, fieldErrors? } shape components can render.
 */
export function unwrap(response) {
  return response.data?.data;
}

export function toErrorMessage(error) {
  const data = error?.response?.data;
  if (data?.message && typeof data.message === "string") return data.message;
  if (data?.data && typeof data.data === "object") {
    // Validation errors: { field: message }
    const firstKey = Object.keys(data.data)[0];
    if (firstKey) return data.data[firstKey];
  }
  if (error?.message) return error.message;
  return "Something went wrong. Please try again.";
}

export function getFieldErrors(error) {
  const data = error?.response?.data;
  if (data?.data && typeof data.data === "object" && !Array.isArray(data.data)) {
    return data.data;
  }
  return null;
}
