import api from '@/lib/axios';
import { ApiResponse } from '@/types/api';
import { Review, CreateReviewData, UpdateReviewData } from '@/types/review';

export const reviewService = {
	async create(data: CreateReviewData): Promise<Review> {
		const response = await api.post<ApiResponse<Review>>('/reviews', data);
		return response.data.data;
	},

	async findAll(params?: { listingId?: string }): Promise<Review[]> {
		const queryParams = new URLSearchParams();
		if (params?.listingId) {
			queryParams.append('listingId', params.listingId);
		}
		const queryString = queryParams.toString();
		const response = await api.get<ApiResponse<Review[]>>(
			`/reviews${queryString ? `?${queryString}` : ''}`
		);
		return response.data.data;
	},

	async findOne(id: string): Promise<Review> {
		const response = await api.get<ApiResponse<Review>>(`/reviews/${id}`);
		return response.data.data;
	},

	async update(id: string, data: UpdateReviewData): Promise<Review> {
		const response = await api.patch<ApiResponse<Review>>(`/reviews/${id}`, data);
		return response.data.data;
	},

	async remove(id: string): Promise<Review> {
		const response = await api.delete<ApiResponse<Review>>(`/reviews/${id}`);
		return response.data.data;
	},
};
