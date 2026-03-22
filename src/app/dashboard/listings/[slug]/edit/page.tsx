'use client';

import { useParams } from 'next/navigation';
import { useListingBySlug } from '@/hooks/useListings';
import { ListingFormData, ListingType } from '@/types/listing';
import { Loader2 } from 'lucide-react';
import { FormSkeleton, PageHeaderSkeleton } from '@/components/ui/skeletons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ListingWizard } from '@/components/dashboard/listings/wizard/ListingWizard';

export default function EditListingPage() {
	const params = useParams();
	const slug = params.slug as string;
	const { data: listing, isLoading: isLoadingListing } = useListingBySlug(slug);

	if (isLoadingListing) {
		return (
			<div className="space-y-6">
				<PageHeaderSkeleton />
				<Card>
					<CardHeader>
						<CardTitle>Listing Details</CardTitle>
					</CardHeader>
					<CardContent>
						<FormSkeleton fields={6} />
					</CardContent>
				</Card>
			</div>
		);
	}

	if (!listing) {
		return (
			<div className="flex h-full items-center justify-center">
				<p className="text-muted-foreground">Listing not found</p>
			</div>
		);
	}

	const initialListingData: ListingFormData = {
		type: listing.type,
		categories: listing.categories || listing.category || [],
		title: listing.name,
		slug: listing.slug,
		description: listing.description || '',
		
		currency: listing.currency || 'NGN',
		basePrice: listing.basePrice !== null ? Number(listing.basePrice) : undefined,
		
		addressLine: listing.addressLine || '',
		city: listing.city || '',
		state: listing.state || '',
		zipCode: '',
		country: listing.country || 'Nigeria',
		latitude: listing.latitude,
		longitude: listing.longitude,
		
		totalArea: listing.venueDetail?.floorArea || listing.venueDetail?.totalArea,
		seatedCapacity: listing.venueDetail?.capacity || listing.venueDetail?.seatedCapacity,
		standingCapacity: listing.venueDetail?.standingCapacity,
		parkingCap: listing.venueDetail?.parkingCap,
		hasIndoor: listing.venueDetail?.hasIndoor,
		hasOutdoor: listing.venueDetail?.hasOutdoor,
		
		minBookingHrs: listing.serviceDetail?.minBookingHrs,
		specialties: listing.serviceDetail?.specialties ? (Array.isArray(listing.serviceDetail.specialties) ? listing.serviceDetail.specialties : listing.serviceDetail.specialties.split(',').map((s: string) => s.trim())) : [],
		coverageArea: listing.serviceDetail?.coverageArea,
		coverageAreaKm: listing.serviceDetail?.coverageAreaKm,

		amenities: listing.venueDetail?.amenities ? (Array.isArray(listing.venueDetail.amenities) ? listing.venueDetail.amenities : Object.entries(listing.venueDetail.amenities).filter(([_, v]) => v).map(([k]) => k)) : [],
		addOns: listing.addOns || listing.addons || [],
		formFields: listing.formFields || [],
		
		imageUrls: listing.images?.map((img: any) => img.url) || [],
		imageFiles: [],
	};

	return (
		<ListingWizard mode="edit" initialListingData={initialListingData} listingId={listing.id} />
	);
}
