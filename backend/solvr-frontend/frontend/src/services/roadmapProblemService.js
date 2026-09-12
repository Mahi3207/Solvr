import { apiClient, unwrap } from "../api/apiClient";

export const roadmapProblemService = {
  async getByRoadmap(roadmapId) {
    const res = await apiClient.get(`/roadmaps/${roadmapId}/problems`);
    return unwrap(res);
  },
  async getById(id) {
    const res = await apiClient.get(`/roadmap-problems/${id}`);
    return unwrap(res);
  },
  async add(roadmapId, payload) {
    const res = await apiClient.post(
      `/roadmaps/${roadmapId}/problems`,
      payload,
    );
    return unwrap(res);
  },
  async update(id, payload) {
    const res = await apiClient.put(`/roadmap-problems/${id}`, payload);
    return unwrap(res);
  },
  async remove(id) {
    const res = await apiClient.delete(`/roadmap-problems/${id}`);
    return unwrap(res);
  },
};
