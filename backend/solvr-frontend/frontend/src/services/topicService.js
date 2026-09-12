import { apiClient, unwrap } from "../api/apiClient";

export const topicService = {
  async getAll() {
    const res = await apiClient.get("/topics");
    return unwrap(res);
  },
  async getById(id) {
    const res = await apiClient.get(`/topics/${id}`);
    return unwrap(res);
  },
  async create(payload) {
    const res = await apiClient.post("/topics", payload);
    return unwrap(res);
  },
  async update(id, payload) {
    const res = await apiClient.put(`/topics/${id}`, payload);
    return unwrap(res);
  },
  async remove(id) {
    const res = await apiClient.delete(`/topics/${id}`);
    return unwrap(res);
  },
};
