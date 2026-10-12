
import { apiRequest } from "./api";

export const innovationApi = {
  getAll: (params = "") =>
    apiRequest(`/admin/innovations/${params}`),

  getDetail: (id) =>
    apiRequest(`/admin/innovations/${id}/`),
};
