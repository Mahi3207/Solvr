import { apiClient, unwrap } from "../api/apiClient";

export const reviewService = {
  async create(payload) {
    const res = await apiClient.post("/reviews", payload);
    return unwrap(res);
  },
  async getById(id) {
    const res = await apiClient.get(`/reviews/${id}`);
    return unwrap(res);
  },
  async getByProblem(problemId) {
    const res = await apiClient.get(`/reviews/problem/${problemId}`);
    return unwrap(res);
  },
  async remove(id) {
    const res = await apiClient.delete(`/reviews/${id}`);
    return unwrap(res);
  },
};
