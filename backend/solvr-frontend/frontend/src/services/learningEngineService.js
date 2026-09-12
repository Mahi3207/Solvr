import { apiClient, unwrap } from "../api/apiClient";

export const learningEngineService = {
  async calculateMastery(activityId) {
    const res = await apiClient.post(
      `/learning-engine/activities/${activityId}/calculate`,
    );
    return unwrap(res);
  },
};
