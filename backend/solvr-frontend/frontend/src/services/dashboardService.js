import { apiClient, unwrap } from "../api/apiClient";

export const dashboardService = {
  async getDashboard() {
    const res = await apiClient.get("/dashboard");
    return unwrap(res);
  },
  async getTopicAnalytics() {
    const res = await apiClient.get("/dashboard/topics");
    return unwrap(res);
  },
};
