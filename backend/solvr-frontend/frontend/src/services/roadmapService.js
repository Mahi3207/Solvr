import { apiClient, unwrap } from "../api/apiClient";

export const roadmapService = {
  async getAll() {
    const res = await apiClient.get("/roadmaps");
    return unwrap(res);
  },
  async getById(id) {
    const res = await apiClient.get(`/roadmaps/${id}`);
    return unwrap(res);
  },
  async create(payload) {
    const res = await apiClient.post("/roadmaps", payload);
    return unwrap(res);
  },
  async update(id, payload) {
    const res = await apiClient.put(`/roadmaps/${id}`, payload);
    return unwrap(res);
  },
  async remove(id) {
    const res = await apiClient.delete(`/roadmaps/${id}`);
    return unwrap(res);
  },
};
