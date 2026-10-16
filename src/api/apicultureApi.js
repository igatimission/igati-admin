
import { apiRequest } from "./api";

export const apicultureApi = {
  getAdminApplications(params = {}) {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== "" &&
        value !== "all"
      ) {
        query.set(key, String(value));
      }
    });

    const suffix = query.toString() ? `?${query.toString()}` : "";

    return apiRequest(`/apiculture/admin/applications/${suffix}`);
  },

  reviewApplication(id, payload) {
    return apiRequest(`/apiculture/admin/applications/${id}/review/`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },
};
