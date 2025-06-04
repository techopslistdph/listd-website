export const API_BASE_URL = `${process.env.BACKEND_API_HOST}/api/${process.env.BACKEND_API_VERSION}`

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
    cities: (regionId: string) => `${API_BASE_URL}/locations/regions/${regionId}/cities`,
    barangays: (cityId: string) => `${API_BASE_URL}/locations/cities/${cityId}/barangays`,
  },

  condominium: {
    list: `${API_BASE_URL}/condominium`,
    create: `${API_BASE_URL}/condominium`,
    complete: `${API_BASE_URL}/condominium/complete`,
    draft: `${API_BASE_URL}/condominium/draft`,
    byId: (id: string) => `${API_BASE_URL}/condominium/${id}`,
    update: (id: string) => `${API_BASE_URL}/condominium/${id}`,
    delete: (id: string) => `${API_BASE_URL}/condominium/${id}`,
    byUser: (userId: string) => `${API_BASE_URL}/condominium/user/${userId}`,
    drafts: (userId: string) => `${API_BASE_URL}/condominium/user/${userId}/drafts`,
  },

  houseAndLot: {
    list: `${API_BASE_URL}/house-and-lot`,
    create: `${API_BASE_URL}/house-and-lot`,
    complete: `${API_BASE_URL}/house-and-lot/complete`,
    draft: `${API_BASE_URL}/house-and-lot/draft`,
    byId: (id: string) => `${API_BASE_URL}/house-and-lot/${id}`,
    update: (id: string) => `${API_BASE_URL}/house-and-lot/${id}`,
    delete: (id: string) => `${API_BASE_URL}/house-and-lot/${id}`,
    byUser: (userId: string) => `${API_BASE_URL}/house-and-lot/user/${userId}`,
    drafts: (userId: string) => `${API_BASE_URL}/house-and-lot/user/${userId}/drafts`,
  },

  warehouse: {
    list: `${API_BASE_URL}/warehouse`,
    create: `${API_BASE_URL}/warehouse`,
    complete: `${API_BASE_URL}/warehouse/complete`,
    draft: `${API_BASE_URL}/warehouse/draft`,
    byId: (id: string) => `/warehouse/${id}`,
    update: (id: string) => `${API_BASE_URL}/warehouse/${id}`,
    delete: (id: string) => `${API_BASE_URL}/warehouse/${id}`,
    byUser: (userId: string) => `${API_BASE_URL}/warehouse/user/${userId}`,
    drafts: (userId: string) => `${API_BASE_URL}/warehouse/user/${userId}/drafts`,
  },

  vacantLot: {
    list: `${API_BASE_URL}/vacant-lot`,
    create: `${API_BASE_URL}/vacant-lot`,
    complete: `${API_BASE_URL}/vacant-lot/complete`,
    draft: `${API_BASE_URL}/vacant-lot/draft`,
    byId: (id: string) => `${API_BASE_URL}/vacant-lot/${id}`,
    update: (id: string) => `${API_BASE_URL}/vacant-lot/${id}`,
    delete: (id: string) => `${API_BASE_URL}/vacant-lot/${id}`,
    byUser: (userId: string) => `${API_BASE_URL}/vacant-lot/user/${userId}`,
    drafts: (userId: string) => `${API_BASE_URL}/vacant-lot/user/${userId}/drafts`,
  },


  media: {
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
} as const

export type ApiEndpoints = typeof API_ENDPOINTS 