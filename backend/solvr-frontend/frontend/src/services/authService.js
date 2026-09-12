import { apiClient, unwrap, tokenStorage } from "../api/apiClient";

export const authService = {
  async register({ name, email, password }) {
    const res = await apiClient.post("/auth/register", {
      name,
      email,
      password,
    });
    return unwrap(res);
  },

  async login({ email, password }) {
    const res = await apiClient.post("/auth/login", { email, password });
    const data = unwrap(res); // { accessToken, refreshToken }
    tokenStorage.setTokens({ ...data, email });
    return data;
  },

  async logout() {
    const email = tokenStorage.getEmail();
    try {
      if (email) {
        await apiClient.post("/auth/logout", null, { params: { email } });
      }
    } finally {
      tokenStorage.clear();
    }
  },

  async forgotPassword(email) {
    const res = await apiClient.post("/auth/forgot-password", { email });
    return unwrap(res);
  },

  async resetPassword({ token, newPassword }) {
    const res = await apiClient.post("/auth/reset-password", {
      token,
      newPassword,
    });
    return unwrap(res);
  },

  async getMe() {
    const res = await apiClient.get("/users/me");
    return unwrap(res);
  },
};
