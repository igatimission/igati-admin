
import { apiRequest } from "./api";

export const opportunityApi = {
  getAll(params = {}) {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        query.set(key, String(value));
      }
    });

    const suffix = query.toString() ? `?${query.toString()}` : "";
    return apiRequest(`/admin/opportunities/${suffix}`);
  },

  getDetail(id) {
    return apiRequest(`/admin/opportunities/${id}/`);
  },

  create(data) {
    return apiRequest("/admin/opportunities/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update(id, data) {
    return apiRequest(`/admin/opportunities/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  delete(id) {
    return apiRequest(`/admin/opportunities/${id}/`, {
      method: "DELETE",
    });
  },
};
