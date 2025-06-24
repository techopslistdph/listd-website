export interface UserProfileResponse {
  success: boolean;
  data: UserProfile;
}

export interface UserProfile {
  id: string;
  clerkId: string;
  name: string;
  email: string;
  profile: UserProfileDetails;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfileDetails {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  companyName: string;
  avatarUrl: string;
  governmentIdUrl: string;
  availableInWhatsapp: boolean;
  address: string;
  longitude: number;
  latitude: number;
  createdAt: string;
  updatedAt: string;
}
