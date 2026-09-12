import { apiClient, unwrap } from "../api/apiClient";

export const problemService = {
  async getAll() {
    const res = await apiClient.get("/problems");
    return unwrap(res);
  },
  async getById(id) {
    const res = await apiClient.get(`/problems/${id}`);
    return unwrap(res);
  },
  async create(payload) {
    const res = await apiClient.post("/problems", payload);
    return unwrap(res);
  },
  async update(id, payload) {
    const res = await apiClient.put(`/problems/${id}`, payload);
    return unwrap(res);
  },
  async remove(id) {
    const res = await apiClient.delete(`/problems/${id}`);
    return unwrap(res);
  },
};
