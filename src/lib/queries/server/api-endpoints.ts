export const API_BASE_URL = `${process.env.BACKEND_API_HOST}/api`;
export const API_ENDPOINTS = {
  users: {
    me: `${API_BASE_URL}/users/profile`,
    update: `${API_BASE_URL}/users/profile`,
    listing: (status: string) =>
      `${API_BASE_URL}/users/listings?status=${status}`,
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
  },

  warehouse: {
    list: `${API_BASE_URL}/warehouses`,
    create: `${API_BASE_URL}/warehouses`,
    complete: `${API_BASE_URL}/warehouses/complete`,
    draft: `${API_BASE_URL}/warehouses/draft`,
    byId: (id: string) => `${API_BASE_URL}/warehouses/${id}`,
    update: (id: string) => `${API_BASE_URL}/warehouses/${id}`,
    delete: (id: string) => `${API_BASE_URL}/warehouses/${id}`,
    byUser: (userId: string) => `${API_BASE_URL}/warehouses/user/${userId}`,
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
  },

  media: {
    upload: `${API_BASE_URL}/uploads`,
    uploadImage: `${API_BASE_URL}/media/upload-image`,
    uploadDocument: `${API_BASE_URL}/media/upload-document`,
  },

  nearby: {
    list: (lat: number, lng: number) =>
      `${API_BASE_URL}/properties/nearby?latitude=${lat}&longitude=${lng}`,
  },

  amenities: {
    list: `${API_BASE_URL}/amenities`,
  },

  features: {
    list: `${API_BASE_URL}/features`,
  },

  building: {
    autoComplete: `${API_BASE_URL}/buildings/autocomplete`,
    details: (placeId: string) =>
      `${API_BASE_URL}/buildings/details/${placeId}`,
    nearby: `${API_BASE_URL}/buildings/nearby`,
  },
} as const;

export type ApiEndpoints = typeof API_ENDPOINTS;
