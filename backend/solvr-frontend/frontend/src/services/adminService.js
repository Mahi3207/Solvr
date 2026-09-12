import { apiClient, unwrap } from "../api/apiClient";

export const adminService = {
  async getAllUsers() {
    const res = await apiClient.get("/admin/users");
    return unwrap(res);
  },
  async deleteUser(id) {
    const res = await apiClient.delete(`/admin/users/${id}`);
    return unwrap(res);
  },
};
