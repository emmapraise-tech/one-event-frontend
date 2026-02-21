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

		// Top-level fields
		formData.append('vendorId', vendorId);
		formData.append('type', data.type);
		formData.append('name', data.title);
		if (data.slug) formData.append('slug', data.slug);
		formData.append('description', data.description || '');
		formData.append('zipCode', data.zipCode || '00000');
		formData.append('streetAddress', data.addressLine);
		formData.append('addressLine', data.addressLine);
		formData.append('city', data.city);
		formData.append('state', data.state);
		formData.append('country', data.country);
		if (data.latitude) formData.append('latitude', data.latitude.toString());
		if (data.longitude) formData.append('longitude', data.longitude.toString());
		formData.append('currency', data.currency || 'NGN');
		formData.append('isPublished', 'true');
		formData.append(
			'isDailyPrice',
			(data.priceStrategy === 'daily').toString(),
		);

		if (data.basePrice) formData.append('basePrice', data.basePrice.toString());
		if (data.weekdayPrice)
			formData.append('weekDayPrice', data.weekdayPrice.toString());
		if (data.weekendPrice)
			formData.append('weekendPrice', data.weekendPrice.toString());

		// Categories (Multiple fields with same name)
		if (data.categories) {
			data.categories.forEach((cat) => {
				formData.append('category', cat);
			});
		}

		// Details (Venue Specifics)
		const details = {
			capacity: data.seatedCapacity,
			floorArea: data.totalArea,
			parkingCap: data.parkingCap,
			hasIndoor: data.hasIndoor,
			hasOutdoor: data.hasOutdoor,
			amenities: data.amenities,
		};
		formData.append('details', JSON.stringify(details));

		// Add-ons
		if (data.addOns && data.addOns.length > 0) {
			formData.append('addOns', JSON.stringify(data.addOns));
		}

		// Files
		if (data.imageFiles) {
			data.imageFiles.forEach((file) => {
				formData.append('images', file);
			});
		}

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

	async adminFindAll(): Promise<Listing[]> {
		const response = await api.get<ApiResponse<Listing[]>>('/admin/listings');
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
