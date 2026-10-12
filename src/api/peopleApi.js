
import { apiRequest } from "./api";

export const peopleApi = {
  getAll: (params = "") =>
    apiRequest(`/admin/people/${params}`),

  getDetail: (id) =>
    apiRequest(`/admin/people/${id}/`),
};
