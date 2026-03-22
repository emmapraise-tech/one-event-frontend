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
		
		// Map frontend ListingType to backend ListingType and ServiceType
		let backendListingType = 'VENUE';
		let backendServiceType: string | undefined = undefined;
		
		if (data.type !== ListingType.VENUE) {
			backendListingType = 'SERVICE';
			if (data.type === ListingType.PHOTOGRAPHER) backendServiceType = 'PHOTOGRAPHY';
			else if (data.type === ListingType.ENTERTAINMENT) backendServiceType = 'DJ';
			else backendServiceType = data.type;
		}

		formData.append('type', backendListingType);
		formData.append('name', data.title);
		if (data.slug) formData.append('slug', data.slug);
		formData.append('description', data.description || '');
		formData.append('addressLine', data.addressLine);
		formData.append('city', data.city);
		formData.append('state', data.state);
		formData.append('country', data.country);
		formData.append('currency', data.currency || 'NGN');
		formData.append('isPublished', 'true');
		if (data.basePrice) formData.append('basePrice', data.basePrice.toString());

		// Categories (Multiple fields with same name)
		if (data.categories) {
			data.categories.forEach((cat) => {
				formData.append('category', cat);
			});
		}

		// Details (Venue Specifics or Service Specifics)
		if (backendListingType === 'VENUE') {
			const venueDetails = {
				capacity: data.seatedCapacity || 50,
				floorArea: data.totalArea,
				parkingCap: data.parkingCap,
				hasIndoor: data.hasIndoor,
				hasOutdoor: data.hasOutdoor,
				amenities: data.amenities || [],
				zipCode: data.zipCode || '00000',
				streetAddress: data.addressLine,
				latitude: data.latitude,
				longitude: data.longitude,
			};
			formData.append('venueDetails', JSON.stringify(venueDetails));
		} else {
			const serviceDetails = {
				serviceType: backendServiceType,
				minBookingHrs: data.minBookingHrs || 1,
				specialties: data.specialties || '',
				coverageArea: data.coverageArea || '',
				coverageAreaKm: data.coverageAreaKm || 50,
			};
			formData.append('serviceDetails', JSON.stringify(serviceDetails));
		}

		// Add-ons
		if (data.addOns && data.addOns.length > 0) {
			formData.append('addOns', JSON.stringify(data.addOns));
		}

		// Form Fields
		if (data.formFields && data.formFields.length > 0) {
			formData.append('formFields', JSON.stringify(data.formFields));
		}

		// Files
		if (data.imageFiles) {
			data.imageFiles.forEach((file) => {
				formData.append('images', file);
			});
		}

		// Video URLs
		if (data.videoUrls && data.videoUrls.length > 0) {
			formData.append('videoUrls', JSON.stringify(data.videoUrls));
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

	async update(id: string, data: Partial<ListingFormData>): Promise<Listing> {
		const formData = new FormData();

		// Top-level fields mapping
		let backendListingType = undefined;
		let backendServiceType: string | undefined = undefined;

		if (data.type) {
			if (data.type !== ListingType.VENUE) {
				backendListingType = 'SERVICE';
				if (data.type === ListingType.PHOTOGRAPHER) backendServiceType = 'PHOTOGRAPHY';
				else if (data.type === ListingType.ENTERTAINMENT) backendServiceType = 'DJ';
				else backendServiceType = data.type;
			} else {
				backendListingType = 'VENUE';
			}
			formData.append('type', backendListingType);
		}

		if (data.title) formData.append('name', data.title);
		if (data.slug) formData.append('slug', data.slug);
		if (data.description !== undefined) formData.append('description', data.description || '');
		if (data.addressLine) {
			formData.append('addressLine', data.addressLine);
		}
		if (data.city) formData.append('city', data.city);
		if (data.state) formData.append('state', data.state);
		if (data.country) formData.append('country', data.country);
		if (data.currency) formData.append('currency', data.currency);
		if (data.basePrice !== undefined) formData.append('basePrice', data.basePrice.toString());

		// Categories
		if (data.categories) {
			data.categories.forEach((cat) => {
				formData.append('category', cat);
			});
		}

		// Details (Venue Specifics or Service Specifics)
		if (backendListingType === 'VENUE' || data.seatedCapacity !== undefined || data.totalArea !== undefined || data.amenities !== undefined || data.latitude !== undefined) {
			const venueDetails: any = {};
			if (data.seatedCapacity !== undefined) venueDetails.capacity = data.seatedCapacity;
			if (data.totalArea !== undefined) venueDetails.floorArea = data.totalArea;
			if (data.parkingCap !== undefined) venueDetails.parkingCap = data.parkingCap;
			if (data.hasIndoor !== undefined) venueDetails.hasIndoor = data.hasIndoor;
			if (data.hasOutdoor !== undefined) venueDetails.hasOutdoor = data.hasOutdoor;
			if (data.amenities !== undefined) venueDetails.amenities = data.amenities;
			if (data.zipCode !== undefined) venueDetails.zipCode = data.zipCode || '00000';
			if (data.addressLine) venueDetails.streetAddress = data.addressLine;
			if (data.latitude !== undefined) venueDetails.latitude = data.latitude;
			if (data.longitude !== undefined) venueDetails.longitude = data.longitude;
			
			if (Object.keys(venueDetails).length > 0) {
				formData.append('venueDetails', JSON.stringify(venueDetails));
			}
		} else if (backendListingType === 'SERVICE' || backendServiceType) {
			const serviceDetails: any = {};
			if (backendServiceType) serviceDetails.serviceType = backendServiceType;
			if (data.minBookingHrs !== undefined) serviceDetails.minBookingHrs = data.minBookingHrs;
			if (data.specialties !== undefined) serviceDetails.specialties = data.specialties;
			if (data.coverageArea !== undefined) serviceDetails.coverageArea = data.coverageArea;
			if (data.coverageAreaKm !== undefined) serviceDetails.coverageAreaKm = data.coverageAreaKm;
			
			if (Object.keys(serviceDetails).length > 0) {
				formData.append('serviceDetails', JSON.stringify(serviceDetails));
			}
		}

		// Add-ons
		if (data.addOns) {
			formData.append('addOns', JSON.stringify(data.addOns));
		}

		// Form Fields
		if (data.formFields) {
			formData.append('formFields', JSON.stringify(data.formFields));
		}

		// Files
		if (data.imageFiles && data.imageFiles.length > 0) {
			data.imageFiles.forEach((file) => {
				formData.append('images', file);
			});
		}

		const response = await api.put<ApiResponse<Listing>>(
			`/listings/${id}`,
			formData,
			{
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			},
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
