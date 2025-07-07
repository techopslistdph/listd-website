import { PropertyDetail } from '../../server/propety/type';

export interface ListingResponse {
  success: boolean;
  data: PropertyDetail[];
  message?: string;
  error?: {
    message: string;
  };
}
