import api from '@/lib/axios';
import { ApiResponse, PaginatedData } from '@/types/api';
import {
	CreateListingData,
	Listing,
	ListingFormData,
	ListingStatus,
	ListingType,
	ListingFilters,
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

	async findAll(filters: ListingFilters = {}): Promise<PaginatedData<Listing>> {
		const queryParams = new URLSearchParams();
		if (filters.page) queryParams.append('page', filters.page.toString());
		if (filters.limit) queryParams.append('limit', filters.limit.toString());
		if (filters.q) queryParams.append('q', filters.q);
		if (filters.location) queryParams.append('location', filters.location);
		if (filters.minPrice !== undefined)
			queryParams.append('minPrice', filters.minPrice.toString());
		if (filters.maxPrice !== undefined)
			queryParams.append('maxPrice', filters.maxPrice.toString());
		if (filters.minCapacity !== undefined)
			queryParams.append('minCapacity', filters.minCapacity.toString());
		if (filters.maxCapacity !== undefined)
			queryParams.append('maxCapacity', filters.maxCapacity.toString());
		if (filters.type) queryParams.append('type', filters.type);
		if (filters.status) queryParams.append('status', filters.status);
		if (filters.categories && filters.categories.length > 0) {
			queryParams.append('categories', filters.categories.join(','));
		}

		const queryString = queryParams.toString();
		const url = `/listings${queryString ? `?${queryString}` : ''}`;

		const response = await api.get<ApiResponse<PaginatedData<Listing>>>(url);
		return response.data.data;
	},

	async adminFindAll(
		filters: ListingFilters = {},
	): Promise<PaginatedData<Listing>> {
		const queryParams = new URLSearchParams();
		if (filters.page) queryParams.append('page', filters.page.toString());
		if (filters.limit) queryParams.append('limit', filters.limit.toString());
		// ... add other admin filters if needed in the future

		const queryString = queryParams.toString();
		const url = `/admin/listings${queryString ? `?${queryString}` : ''}`;

		const response = await api.get<ApiResponse<PaginatedData<Listing>>>(url);
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

	async findByVendorId(
		vendorId: string,
		page = 1,
		limit = 10,
	): Promise<PaginatedData<Listing>> {
		const response = await api.get<ApiResponse<PaginatedData<Listing>>>(
			`/listings/vendor/${vendorId}?page=${page}&limit=${limit}`,
		);
		return response.data.data;
	},

	async findByType(
		type: ListingType,
		page = 1,
		limit = 10,
	): Promise<PaginatedData<Listing>> {
		const response = await api.get<ApiResponse<PaginatedData<Listing>>>(
			`/listings/type/${type}?page=${page}&limit=${limit}`,
		);
		return response.data.data;
	},

	async search(
		query: string,
		filters: ListingFilters = {},
	): Promise<PaginatedData<Listing>> {
		const queryParams = new URLSearchParams();
		queryParams.append('q', query);
		if (filters.page) queryParams.append('page', filters.page.toString());
		if (filters.limit) queryParams.append('limit', filters.limit.toString());
		if (filters.location) queryParams.append('location', filters.location);
		if (filters.minPrice !== undefined)
			queryParams.append('minPrice', filters.minPrice.toString());
		if (filters.maxPrice !== undefined)
			queryParams.append('maxPrice', filters.maxPrice.toString());
		if (filters.minCapacity !== undefined)
			queryParams.append('minCapacity', filters.minCapacity.toString());
		if (filters.maxCapacity !== undefined)
			queryParams.append('maxCapacity', filters.maxCapacity.toString());
		if (filters.type) queryParams.append('type', filters.type);
		if (filters.status) queryParams.append('status', filters.status);
		if (filters.categories && filters.categories.length > 0) {
			queryParams.append('categories', filters.categories.join(','));
		}

		const response = await api.get<ApiResponse<PaginatedData<Listing>>>(
			`/listings/search?${queryParams.toString()}`,
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
