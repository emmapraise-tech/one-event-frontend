import api from '@/lib/axios';
import { ApiResponse } from '@/types/api';
import {
	CreateListingData,
	Listing,
	ListingFormData,
	ListingStatus,
	ListingType,
} from '@/types/listing';

export const listingService = {
	async create(data: ListingFormData, vendorId: string): Promise<Listing> {
		const formData = new FormData();

		// Text fields
		formData.append('type', data.type);
		formData.append('name', data.title);
		formData.append('slug', data.slug);
		formData.append('currency', data.currency);
		formData.append('zipCode', '00000'); // TODO: Add to form
		formData.append('streetAddress', data.addressLine);
		formData.append('city', data.city);
		formData.append('state', data.state);
		formData.append('country', data.country);

		// Optional text fields
		if (data.description) formData.append('description', data.description);
		if (data.basePrice) formData.append('basePrice', data.basePrice.toString());
		if (data.weekendPrice)
			formData.append('weekendPrice', data.weekendPrice.toString());
		if (data.weekdayPrice)
			formData.append('weekDayPrice', data.weekdayPrice.toString());

		// Categories
		if (data.categories) {
			data.categories.forEach((category) => {
				formData.append('category[]', category);
			});
		} else {
			// Fallback default if nothing selected (though validaton should handle this)
			formData.append('category[]', 'WEDDING');
		}

		// Amenities
		if (data.amenities) {
			data.amenities.forEach((amenity) => {
				// formData.append('amenities[]', amenity);
			});
		}

		// Files
		if (data.imageFiles) {
			data.imageFiles.forEach((file) => {
				formData.append('images', file);
			});
		}

		// Vendor ID from parameter
		formData.append('vendorId', vendorId);

		const response = await api.post<ApiResponse<Listing>>(
			'/listings',
			formData,
			{
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			},
		);
		return response.data.data;
	},

	async findAll(): Promise<Listing[]> {
		const response = await api.get<ApiResponse<Listing[]>>('/listings');
		return response.data.data;
	},

	async findOne(id: string): Promise<Listing> {
		const response = await api.get<ApiResponse<Listing>>(`/listings/${id}`);
		return response.data.data;
	},

	async findBySlug(slug: string): Promise<Listing> {
		const response = await api.get<ApiResponse<Listing>>(
			`/listings/slug/${slug}`,
		);
		return response.data.data;
	},

	async findByVendorId(vendorId: string): Promise<Listing[]> {
		const response = await api.get<ApiResponse<Listing[]>>(
			`/listings/vendor/${vendorId}`,
		);
		return response.data.data;
	},

	async findByType(type: ListingType): Promise<Listing[]> {
		const response = await api.get<ApiResponse<Listing[]>>(
			`/listings/type/${type}`,
		);
		return response.data.data;
	},

	async search(query: string): Promise<Listing[]> {
		const response = await api.get<ApiResponse<Listing[]>>(
			`/listings/search?q=${query}`,
		);
		return response.data.data;
	},

	async update(id: string, data: Partial<CreateListingData>): Promise<Listing> {
		const response = await api.put<ApiResponse<Listing>>(
			`/listings/${id}`,
			data,
		);
		return response.data.data;
	},

	async updateStatus(id: string, status: ListingStatus): Promise<Listing> {
		const response = await api.put<ApiResponse<Listing>>(
			`/listings/${id}/status`,
			{ status },
		);
		return response.data.data;
	},

	async remove(id: string): Promise<void> {
		await api.delete(`/listings/${id}`);
	},
};
