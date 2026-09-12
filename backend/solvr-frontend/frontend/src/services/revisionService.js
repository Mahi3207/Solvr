import { apiClient, unwrap } from "../api/apiClient";

export const revisionService = {
  async getToday() {
    const res = await apiClient.get("/revision/today");
    return unwrap(res);
  },
  async getOverdue() {
    const res = await apiClient.get("/revision/overdue");
    return unwrap(res);
  },
  async getUpcoming() {
    const res = await apiClient.get("/revision/upcoming");
    return unwrap(res);
  },
};
