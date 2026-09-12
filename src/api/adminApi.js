import { apiRequest } from "./api";




export const adminApi = {
  dashboard: () =>
    apiRequest("/admin/dashboard/"),

  organisations: (params = "") =>
    apiRequest(
      `/admin/organisations/${params}`
    ),

  pendingOrganisations: () =>
    apiRequest(
      "/admin/organisations/pending/"
    ),

    organisationReview: (slug) =>
    apiRequest(
      `/admin/organisations/${slug}/review/`
    ),

  approveOrganisation: (slug) =>
    apiRequest(
      `/admin/organisations/${slug}/approve/`,
      {
        method: "POST",
      }
    ),

  rejectOrganisation: (
    slug,
    data
  ) =>
    apiRequest(
      `/admin/organisations/${slug}/reject/`,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    ),

  requestOrganisationChanges: (
    slug,
    data
  ) =>
    apiRequest(
      `/admin/organisations/${slug}/request-changes/`,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    ),
};