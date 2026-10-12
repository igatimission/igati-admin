
import { apiRequest } from "./api";

export const knowledgeApi = {
  getAll(params = {}) {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        query.set(key, String(value));
      }
    });

    const suffix = query.toString() ? `?${query.toString()}` : "";
    return apiRequest(`/admin/knowledge/${suffix}`);
  },

  getDetail(id) {
    return apiRequest(`/admin/knowledge/${id}/`);
  },
};
