import { apiClient, unwrap } from "../api/apiClient";

export const tagService = {
  async getAll() {
    const res = await apiClient.get("/tags");
    return unwrap(res);
  },
  async create(payload) {
    const res = await apiClient.post("/tags", payload);
    return unwrap(res);
  },
  async update(id, payload) {
    const res = await apiClient.put(`/tags/${id}`, payload);
    return unwrap(res);
  },
  async remove(id) {
    const res = await apiClient.delete(`/tags/${id}`);
    return unwrap(res);
  },
};
