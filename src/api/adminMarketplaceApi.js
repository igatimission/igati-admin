import { apiRequest } from './api';

const query = (params = {}) => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== '' && value !== undefined && value !== null) search.set(key, String(value));
  });
  return search.toString() ? `?${search}` : '';
};

export const adminMarketplaceApi = {
  list: (params = {}) => apiRequest(`/admin/marketplace/listings/${query(params)}`),
  detail: (id) => apiRequest(`/admin/marketplace/listings/${id}/`),
  action: (id, action) => apiRequest(`/admin/marketplace/listings/${id}/action/`, {
    method: 'PATCH', body: JSON.stringify({ action }),
  }),
};