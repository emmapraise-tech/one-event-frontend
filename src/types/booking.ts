import { Listing } from './listing';
import { User } from './auth';
import { Payment } from './payment';

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export interface Booking {
  id: string;
  customerId: string;
  listingId: string;
  bookingDate: string;
  startTime?: string;
  endTime?: string;
  numberOfGuests?: number;
  specialRequests?: string;
  basePrice: number;
  platformFee: number;
  totalAmount: number;
  currency: string;
  depositAmount?: number | null;
  depositPaid: boolean;
  fullPaymentPaid: boolean;
  status: BookingStatus;
  listing?: Listing;
  customer?: User;
  payments?: Payment[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingData {
  listingId: string;
  bookingDate: string;
  startTime?: string;
  endTime?: string;
  numberOfGuests?: number;
  specialRequests?: string;
  currency?: string;
}

export interface UpdateBookingData {
  bookingDate?: string;
  startTime?: string;
  endTime?: string;
  numberOfGuests?: number;
  specialRequests?: string;
}

export interface CheckAvailabilityData {
  listingId: string;
  bookingDate: string;
  startTime?: string;
  endTime?: string;
}

export interface AvailabilityResponse {
  available: boolean;
  message?: string;
}

