import { apiRequest } from "./api";

export const partnershipApi = {
  getAll: (params = "") =>
    apiRequest(`/admin/partnerships/${params}`),

  getDetail: (id) =>
    apiRequest(`/admin/partnerships/${id}/`),
};