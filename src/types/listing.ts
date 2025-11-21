import { Vendor } from './vendor';

export enum ListingType {
  VENUE = 'VENUE',
  PHOTOGRAPHER = 'PHOTOGRAPHER',
  CATERING = 'CATERING',
  ENTERTAINMENT = 'ENTERTAINMENT',
  DECOR = 'DECOR',
  OTHER = 'OTHER',
}

export enum ListingStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
}

export interface Listing {
  id: string;
  vendorId: string;
  type: ListingType;
  title: string;
  slug: string;
  description?: string;
  status: ListingStatus;
  basePrice?: number;
  currency?: string;
  addressLine?: string;
  city?: string;
  state?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  vendor?: Vendor;
}

export interface CreateListingData {
  type: ListingType;
  title: string;
  description?: string;
  basePrice?: number;
  currency?: string;
  addressLine?: string;
  city?: string;
  state?: string;
  country?: string;
}
