
import { apiRequest } from "./api";

export const projectApi = {
  getAll: (params = "") =>
    apiRequest(`/admin/projects/${params}`),

  getDetail: (id) =>
    apiRequest(`/admin/projects/${id}/`),
};
