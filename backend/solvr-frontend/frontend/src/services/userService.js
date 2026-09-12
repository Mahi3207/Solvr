import { apiClient, unwrap } from "../api/apiClient";

export const userService = {
  async getCurrentUser() {
    const res = await apiClient.get("/users/me");
    return unwrap(res);
  },
  async updateProfile({ name }) {
    const res = await apiClient.put("/users/me", { name });
    return unwrap(res);
  },
  async changePassword({ currentPassword, newPassword }) {
    const res = await apiClient.put("/users/change-password", {
      currentPassword,
      newPassword,
    });
    return unwrap(res);
  },
  async deleteMyAccount() {
    const res = await apiClient.delete("/users/me");
    return unwrap(res);
  },
};
