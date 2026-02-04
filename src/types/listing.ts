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
export interface VenueDetail {
	id: string;
	capacity: number;
	floorArea: number;
	hasIndoor: boolean;
	hasOutdoor: boolean;
	parkingCap: number;
	amenities: string[];
}

export interface ListingImage {
	id: string;
	listingId: string;
	url: string;
	alt?: string;
	createdAt: Date;
	updatedAt: Date;
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
	createdAt: Date;
	updatedAt: Date;
	vendor?: Vendor;
	addOns?: AddOn[];
	venueDetail?: VenueDetail;
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
	priceStrategy: 'daily' | 'weekday_weekend';
	basePrice?: number; // Used for "Single Daily Price"
	weekdayPrice?: number;
	weekendPrice?: number;
	currency?: string;
	addressLine: string;
	city: string;
	state: string;
	zipCode: string;
	country: string;

	// Specs
	totalArea?: number;
	seatedCapacity?: number;
	standingCapacity?: number;
	parkingCap?: number;
	hasIndoor?: boolean;
	hasOutdoor?: boolean;
	amenities: string[];
	addOns: { name: string; price: number }[];

	// Media
	imageUrls: string[]; // For preview
	imageFiles: File[]; // For upload
}
