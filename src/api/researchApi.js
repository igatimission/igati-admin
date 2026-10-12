
import { apiRequest } from "./api";

export const researchApi = {
  getAll: (params = "") =>
    apiRequest(`/admin/research/${params}`),

  getDetail: (id) =>
    apiRequest(`/admin/research/${id}/`),
};
