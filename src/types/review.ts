import { User } from './auth';

export interface Review {
	id: string;
	bookingId: string;
	customerId: string;
	rating: number;
	comment?: string | null;
	customer?: User | null;
	createdAt: string;
	updatedAt: string;
}

export interface CreateReviewData {
	bookingId: string;
	rating: number;
	comment?: string;
}

export interface UpdateReviewData {
	rating: number;
	comment?: string;
}
