export const API_BASE_URL = `${process.env.BACKEND_API_HOST}/api/${process.env.BACKEND_API_VERSION}`;
export const API_ENDPOINTS = {
  users: {
    me: '/users/me',
    byId: (id: string) => `${API_BASE_URL}/users/${id}`,
    update: `${API_BASE_URL}/users/update`,
    updateAvatar: `${API_BASE_URL}/users/update-avatar`,
    updateCover: `${API_BASE_URL}/users/update-cover`,
    updatePassword: `${API_BASE_URL}/users/update-password`,
    delete: `${API_BASE_URL}/users/delete`,
  },

  listingTypes: {
    list: `${API_BASE_URL}/listing-types`,
    create: `${API_BASE_URL}/listing-types`,
    byId: (id: string) => `${API_BASE_URL}/listing-types/${id}`,
    update: (id: string) => `${API_BASE_URL}/listing-types/${id}`,
    delete: (id: string) => `${API_BASE_URL}/listing-types/${id}`,
  },

  propertyTypes: {
    list: `${API_BASE_URL}/property-types`,
    create: `${API_BASE_URL}/property-types`,
    byId: (id: string) => `${API_BASE_URL}/property-types/${id}`,
    update: (id: string) => `${API_BASE_URL}/property-types/${id}`,
    delete: (id: string) => `${API_BASE_URL}/property-types/${id}`,
  },

  locations: {
    regions: `${API_BASE_URL}/locations/regions`,
    cities: `${API_BASE_URL}/geographic-codes/city`,
    // cities: (regionId: string) =>
    //   `${API_BASE_URL}/locations/regions/${regionId}/cities`,
    barangays: `${API_BASE_URL}/geographic-codes/barangay`,
  },

  condominium: {
    list: `${API_BASE_URL}/condominiums`,
    create: `${API_BASE_URL}/condominiums`,
    complete: `${API_BASE_URL}/condominiums/complete`,
    draft: `${API_BASE_URL}/condominiums/draft`,
    byId: (id: string) => `${API_BASE_URL}/condominiums/${id}`,
    update: (id: string) => `${API_BASE_URL}/condominiums/${id}`,
    delete: (id: string) => `${API_BASE_URL}/condominiums/${id}`,
    byUser: (userId: string) => `${API_BASE_URL}/condominiums/user/${userId}`,
    drafts: (userId: string) =>
      `${API_BASE_URL}/condominiums/user/${userId}/drafts`,
  },

  houseAndLot: {
    list: `${API_BASE_URL}/house-and-lots`,
    create: `${API_BASE_URL}/house-and-lots`,
    complete: `${API_BASE_URL}/house-and-lots/complete`,
    draft: `${API_BASE_URL}/house-and-lots/draft`,
    byId: (id: string) => `${API_BASE_URL}/house-and-lots/${id}`,
    update: (id: string) => `${API_BASE_URL}/house-and-lots/${id}`,
    delete: (id: string) => `${API_BASE_URL}/house-and-lots/${id}`,
    byUser: (userId: string) => `${API_BASE_URL}/house-and-lots/user/${userId}`,
    drafts: (userId: string) =>
      `${API_BASE_URL}/house-and-lots/user/${userId}/drafts`,
  },

  warehouse: {
    list: `${API_BASE_URL}/warehouses`,
    create: `${API_BASE_URL}/warehouses`,
    complete: `${API_BASE_URL}/warehouses/complete`,
    draft: `${API_BASE_URL}/warehouses/draft`,
    byId: (id: string) => `/warehouses/${id}`,
    update: (id: string) => `${API_BASE_URL}/warehouses/${id}`,
    delete: (id: string) => `${API_BASE_URL}/warehouses/${id}`,
    byUser: (userId: string) => `${API_BASE_URL}/warehouses/user/${userId}`,
    drafts: (userId: string) =>
      `${API_BASE_URL}/warehouses/user/${userId}/drafts`,
  },

  vacantLot: {
    list: `${API_BASE_URL}/vacant-lots`,
    create: `${API_BASE_URL}/vacant-lots`,
    complete: `${API_BASE_URL}/vacant-lots/complete`,
    draft: `${API_BASE_URL}/vacant-lots/draft`,
    byId: (id: string) => `${API_BASE_URL}/vacant-lots/${id}`,
    update: (id: string) => `${API_BASE_URL}/vacant-lots/${id}`,
    delete: (id: string) => `${API_BASE_URL}/vacant-lots/${id}`,
    byUser: (userId: string) => `${API_BASE_URL}/vacant-lots/user/${userId}`,
    drafts: (userId: string) =>
      `${API_BASE_URL}/vacant-lots/user/${userId}/drafts`,
  },

  media: {
    upload: `${API_BASE_URL}/uploads`,
    uploadImage: `${API_BASE_URL}/media/upload-image`,
    uploadDocument: `${API_BASE_URL}/media/upload-document`,
  },

  apiKeys: {
    list: `${API_BASE_URL}/api-keys`,
    create: `${API_BASE_URL}/api-keys`,
    byId: (id: string) => `${API_BASE_URL}/api-keys/${id}`,
    update: (id: string) => `${API_BASE_URL}/api-keys/${id}`,
    delete: (id: string) => `${API_BASE_URL}/api-keys/${id}`,
  },

  jobs: {
    status: (jobId: string) => `${API_BASE_URL}/jobs/${jobId}/status`,
  },

  amenities: {
    list: `${API_BASE_URL}/amenities`,
    create: `${API_BASE_URL}/amenities`,
    byId: (id: string) => `${API_BASE_URL}/amenities/${id}`,
    update: (id: string) => `${API_BASE_URL}/amenities/${id}`,
    delete: (id: string) => `${API_BASE_URL}/amenities/${id}`,
  },

  features: {
    list: `${API_BASE_URL}/features`,
    create: `${API_BASE_URL}/features`,
    byId: (id: string) => `${API_BASE_URL}/features/${id}`,
    update: (id: string) => `${API_BASE_URL}/features/${id}`,
    delete: (id: string) => `${API_BASE_URL}/features/${id}`,
  },
} as const;

export type ApiEndpoints = typeof API_ENDPOINTS;
