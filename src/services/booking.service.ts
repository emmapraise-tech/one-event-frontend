import api from '@/lib/axios';
import { ApiResponse, PaginatedData } from '@/types/api';
import {
	Booking,
	CreateBookingData,
	UpdateBookingData,
	CheckAvailabilityData,
	AvailabilityResponse,
} from '@/types/booking';

export const bookingService = {
	async checkAvailability(
		data: CheckAvailabilityData,
	): Promise<AvailabilityResponse> {
		const response = await api.post<ApiResponse<AvailabilityResponse>>(
			'/bookings/check-availability',
			data,
		);
		return response.data.data;
	},

	async create(data: CreateBookingData): Promise<Booking> {
		const response = await api.post<ApiResponse<Booking>>('/bookings', data);
		return response.data.data;
	},

	async findAllMyBookings(
		page = 1,
		limit = 10,
	): Promise<PaginatedData<Booking>> {
		const response = await api.get<ApiResponse<PaginatedData<Booking>>>(
			`/bookings?page=${page}&limit=${limit}`,
		);
		return response.data.data;
	},

	async findAll(page = 1, limit = 10): Promise<PaginatedData<Booking>> {
		const response = await api.get<ApiResponse<PaginatedData<Booking>>>(
			`/admin/bookings?page=${page}&limit=${limit}`,
		);
		return response.data.data;
	},

	async findAllForVendor(
		page = 1,
		limit = 10,
	): Promise<PaginatedData<Booking>> {
		const response = await api.get<ApiResponse<PaginatedData<Booking>>>(
			`/bookings/vendor?page=${page}&limit=${limit}`,
		);
		return response.data.data;
	},

	async findOne(id: string): Promise<Booking> {
		const response = await api.get<ApiResponse<Booking>>(`/bookings/${id}`);
		return response.data.data;
	},

	async findByListingId(
		listingId: string,
		page = 1,
		limit = 10,
	): Promise<PaginatedData<Booking>> {
		const response = await api.get<ApiResponse<PaginatedData<Booking>>>(
			`/bookings/listing/${listingId}?page=${page}&limit=${limit}`,
		);
		return response.data.data;
	},

	async update(id: string, data: UpdateBookingData): Promise<Booking> {
		const response = await api.patch<ApiResponse<Booking>>(
			`/bookings/${id}`,
			data,
		);
		return response.data.data;
	},

	async cancel(id: string): Promise<Booking> {
		const response = await api.patch<ApiResponse<Booking>>(
			`/bookings/${id}/cancel`,
		);
		return response.data.data;
	},

	async remove(id: string): Promise<void> {
		await api.delete(`/bookings/${id}`);
	},
};
