import { apiClient, unwrap } from "../api/apiClient";

export const companyService = {
  async getAll() {
    const res = await apiClient.get("/companies");
    return unwrap(res);
  },
  async create(payload) {
    const res = await apiClient.post("/companies", payload);
    return unwrap(res);
  },
  async update(id, payload) {
    const res = await apiClient.put(`/companies/${id}`, payload);
    return unwrap(res);
  },
  async remove(id) {
    const res = await apiClient.delete(`/companies/${id}`);
    return unwrap(res);
  },
};
