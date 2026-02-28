import api from '@/lib/axios';
import { ApiResponse, PaginatedData } from '@/types/api';
import { CreateVendorData, Vendor } from '@/types/vendor';

export const vendorService = {
	async create(data: CreateVendorData): Promise<Vendor> {
		const response = await api.post<ApiResponse<Vendor>>('/vendors', data);
		return response.data.data;
	},

	async findAll(page = 1, limit = 10): Promise<PaginatedData<Vendor>> {
		const response = await api.get<ApiResponse<PaginatedData<Vendor>>>(
			`/vendors?page=${page}&limit=${limit}`,
		);
		return response.data.data;
	},

	async adminFindAll(page = 1, limit = 10): Promise<PaginatedData<Vendor>> {
		const response = await api.get<ApiResponse<PaginatedData<Vendor>>>(
			`/admin/vendors?page=${page}&limit=${limit}`,
		);
		return response.data.data;
	},

	async findOne(id: string): Promise<Vendor> {
		const response = await api.get<ApiResponse<Vendor>>(`/vendors/${id}`);
		return response.data.data;
	},

	async update(id: string, data: Partial<CreateVendorData>): Promise<Vendor> {
		const response = await api.put<ApiResponse<Vendor>>(`/vendors/${id}`, data);
		return response.data.data;
	},

	async getVendorBookings(page = 1, limit = 10): Promise<PaginatedData<any>> {
		const response = await api.get<ApiResponse<PaginatedData<any>>>(
			`/vendors/bookings?page=${page}&limit=${limit}`,
		);
		return response.data.data;
	},

	async remove(id: string): Promise<void> {
		await api.delete(`/vendors/${id}`);
	},

	async getMyListings(page = 1, limit = 10): Promise<PaginatedData<any>> {
		const response = await api.get<ApiResponse<PaginatedData<any>>>(
			`/vendors/listings?page=${page}&limit=${limit}`,
		);
		return response.data.data;
	},
};
