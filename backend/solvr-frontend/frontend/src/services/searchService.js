import { apiClient } from "../api/apiClient";

// NOTE: unlike every other endpoint in this backend, /api/search/**
// returns a raw List<Entity> — it is NOT wrapped in ApiResponse<T>.
export const searchService = {
  async problems(keyword) {
    const res = await apiClient.get("/search/problems", {
      params: { keyword },
    });
    return res.data;
  },
  async topics(keyword) {
    const res = await apiClient.get("/search/topics", { params: { keyword } });
    return res.data;
  },
  async companies(keyword) {
    const res = await apiClient.get("/search/companies", {
      params: { keyword },
    });
    return res.data;
  },
  async tags(keyword) {
    const res = await apiClient.get("/search/tags", { params: { keyword } });
    return res.data;
  },
  async roadmaps(keyword) {
    const res = await apiClient.get("/search/roadmaps", {
      params: { keyword },
    });
    return res.data;
  },
};
