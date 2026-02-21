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
	startDate: string;
	endDate?: string;
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
	details?: any;
	createdAt: string;
	updatedAt: string;
}

export interface CreateBookingData {
	listingId: string;
	startDate: string;
	endDate?: string;
	numberOfGuests?: number;
	specialRequests?: string;
	currency?: string;
	details?: any;
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
	startDate: string;
	endDate: string;
}

export interface AvailabilityResponse {
	available: boolean;
	message?: string;
}
