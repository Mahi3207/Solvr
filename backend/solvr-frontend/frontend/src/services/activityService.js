import { apiClient, unwrap } from "../api/apiClient";

export const activityService = {
  async getMine() {
    const res = await apiClient.get("/activity");
    return unwrap(res);
  },
  async getById(id) {
    const res = await apiClient.get(`/activity/${id}`);
    return unwrap(res);
  },
  async getByStatus(status) {
    const res = await apiClient.get(`/activity/status/${status}`);
    return unwrap(res);
  },
  async getBookmarked() {
    const res = await apiClient.get("/activity/bookmarks");
    return unwrap(res);
  },
  async getFavourites() {
    const res = await apiClient.get("/activity/favourites");
    return unwrap(res);
  },
  async getRevision() {
    const res = await apiClient.get("/activity/revision");
    return unwrap(res);
  },
  async create(payload) {
    const res = await apiClient.post("/activity", payload);
    return unwrap(res);
  },
  async update(id, payload) {
    const res = await apiClient.put(`/activity/${id}`, payload);
    return unwrap(res);
  },
  async remove(id) {
    const res = await apiClient.delete(`/activity/${id}`);
    return unwrap(res);
  },
};
