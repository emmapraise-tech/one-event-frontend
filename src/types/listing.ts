import { Vendor } from './vendor';

export enum ListingType {
	VENUE = 'VENUE',
	PHOTOGRAPHER = 'PHOTOGRAPHER',
	CATERING = 'CATERING',
	ENTERTAINMENT = 'ENTERTAINMENT',
	DECOR = 'DECOR',
	OTHER = 'OTHER',
}

export enum ListingCategory {
	WEDDING = 'WEDDING',
	CORPORATE = 'CORPORATE',
	PARTY = 'PARTY',
	CONCERT = 'CONCERT',
	NETWORKING = 'NETWORKING',
	OUTDOOR = 'OUTDOOR',
	OTHER = 'OTHER',
}

export enum ListingStatus {
	ACTIVE = 'ACTIVE',
	INACTIVE = 'INACTIVE',
	PENDING = 'PENDING',
}
export interface AddOn {
	id: string;
	name: string;
	price: number;
}

export interface Hall {
	id: string;
	name: string;
	capacity: number;
	standingCapacity?: number;
	hasIndoor: boolean;
	hasOutdoor: boolean;
	price: number;
	floorArea?: number;
}
export interface VenueDetail {
	id: string;
	zipCode?: string;
	streetAddress?: string;
	latitude?: number;
	longitude?: number;
	capacity?: number;
	seatedCapacity?: number;
	floorArea?: number;
	totalArea?: number;
	standingCapacity?: number;
	hasIndoor: boolean;
	hasOutdoor: boolean;
	parkingCap: number;
	amenities: string[] | Record<string, boolean>;
}

export interface ServiceDetail {
	id: string;
	serviceType: string;
	minBookingHrs?: number;
	coverageAreaKm?: number;
	coverageArea?: string;
	specialties?: string;
}

export interface ListingImage {
	id: string;
	listingId: string;
	url: string;
	alt?: string;
	createdAt: Date;
	updatedAt: Date;
	type?: string;
}

export enum ListingMediaType {
	IMAGE = 'IMAGE',
	VIDEO = 'VIDEO',
}

export interface ListingMedia {
	id: string;
	listingId: string;
	url: string;
	type: ListingMediaType;
	createdAt: Date;
	updatedAt: Date;
}

export interface FormField {
	id: string;
	type:
		| 'text'
		| 'textarea'
		| 'date'
		| 'image'
		| 'number'
		| 'color'
		| 'checkbox'
		| 'radio'
		| 'select'
		| 'file';
	label: string;
	required: boolean;
	options?: string[];
}

export interface Listing {
	id: string;
	vendorId: string;
	type: ListingType;
	name: string;
	slug: string;
	description?: string;
	status: ListingStatus;
	basePrice?: number;
	currency?: string;
	addressLine?: string;
	city?: string;
	state?: string;
	country?: string;
	latitude?: number;
	longitude?: number;
	rating: number;
	reviewCount: number;
	images?: ListingImage[];
	categories?: ListingCategory[];
	category?: ListingCategory[]; // Fallback for singular naming
	createdAt: Date;
	updatedAt: Date;
	vendor?: Vendor;
	addOns?: AddOn[];
	addons?: AddOn[]; // Fallback for lowercase
	venueDetail?: VenueDetail;
	details?: VenueDetail; // Fallback for 'details' key
	serviceDetail?: ServiceDetail;
	standing_capacity?: number; // Another potential fallback
	formFields?: FormField[];
	media?: ListingMedia[];
	halls?: Hall[];
}

export interface CreateListingData {
	vendorId: string;
	type: ListingType;
	name: string;
	slug?: string;
	category: ListingCategory[];
	description?: string;
	basePrice?: number;
	currency?: string;
	addressLine?: string;
	city?: string;
	state?: string;
	country?: string;
}

export interface ListingFormData {
	type: ListingType;
	categories: ListingCategory[];
	title: string;
	slug: string;
	description?: string;
	// Pricing
	basePrice?: number; // Used for "Single Daily Price"
	currency?: string;
	addressLine: string;
	city: string;
	state: string;
	zipCode: string;
	country: string;
	latitude?: number;
	longitude?: number;

	// Specs (Venue)
	totalArea?: number;
	seatedCapacity?: number;
	standingCapacity?: number;
	parkingCap?: number;
	hasIndoor?: boolean;
	hasOutdoor?: boolean;
	amenities: string[];

	// Specs (Service)
	minBookingHrs?: number;
	specialties: string[];
	coverageArea?: string;
	coverageAreaKm?: number;

	addOns: { name: string; price: number }[];
	formFields: FormField[];
	halls?: { name: string; capacity: number; standingCapacity?: number; hasIndoor: boolean; hasOutdoor: boolean; price: number }[];

	// Media
	imageUrls: string[]; // For preview
	imageFiles: File[]; // For upload
	videoUrls?: string[]; // For upload
}

export interface ListingFilters {
	q?: string;
	location?: string;
	minPrice?: number;
	maxPrice?: number;
	minCapacity?: number;
	maxCapacity?: number;
	categories?: string[];
	type?: ListingType;
	status?: ListingStatus;
	page?: number;
	limit?: number;
}
