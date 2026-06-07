'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, MapPin, Star, Users, Wifi, Car, Shield, Wind, Zap, Trees } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Listing } from '@/types/listing';

interface VenueListingCardProps {
	listing: Listing;
}

export function VenueListingCard({ listing }: VenueListingCardProps) {
	const router = useRouter();
	
	const detail = listing.venueDetail || listing.details;
	const dynamicFeatures: { label: string; icon: any }[] = [];

	if (listing.type === 'VENUE' && detail) {
		// 1. Capacity (Users icon)
		const capacity = detail.capacity || detail.seatedCapacity;
		if (capacity) {
			dynamicFeatures.push({ label: `${capacity} Guests`, icon: Users });
		}

		// 2. Amenities (Wifi / AC / Power)
		const rawAmenities = detail.amenities || [];
		const amenitiesList = Array.isArray(rawAmenities)
			? rawAmenities
			: Object.entries(rawAmenities).filter(([_, v]) => v).map(([k]) => k);

		if (amenitiesList.includes('WIFI')) {
			dynamicFeatures.push({ label: 'Wifi Available', icon: Wifi });
		} else if (amenitiesList.includes('AC')) {
			dynamicFeatures.push({ label: 'Air Conditioned', icon: Wind });
		} else if (amenitiesList.includes('POWER_247')) {
			dynamicFeatures.push({ label: '24/7 Power', icon: Zap });
		}

		// 3. Setting / Parking / Security
		if (detail.parkingCap && detail.parkingCap > 0) {
			dynamicFeatures.push({ label: `${detail.parkingCap} Parking Spots`, icon: Car });
		} else if (amenitiesList.includes('PARKING')) {
			dynamicFeatures.push({ label: 'Parking Area', icon: Car });
		} else if (amenitiesList.includes('SECURITY')) {
			dynamicFeatures.push({ label: 'Secured Zone', icon: Shield });
		} else if (detail.hasOutdoor) {
			dynamicFeatures.push({ label: 'Outdoor Garden', icon: Trees });
		}
	}

	// Fallback/fill to ensure we display exactly 3 features
	if (dynamicFeatures.length < 3) {
		const existingLabels = dynamicFeatures.map(f => f.label);
		
		if (!existingLabels.some(l => l.includes('Guest')) && (detail?.capacity || detail?.seatedCapacity)) {
			dynamicFeatures.unshift({ label: `${detail?.capacity || detail?.seatedCapacity} Guests`, icon: Users });
		} else if (dynamicFeatures.length === 0) {
			dynamicFeatures.push({ label: '50-100 Guests', icon: Users });
		}
		
		if (dynamicFeatures.length < 3 && !existingLabels.includes('Wifi Available')) {
			dynamicFeatures.push({ label: 'Wifi Available', icon: Wifi });
		}
		
		if (dynamicFeatures.length < 3 && !existingLabels.some(l => l.includes('Parking'))) {
			dynamicFeatures.push({ label: 'Secure Parking', icon: Car });
		}
	}
	
	const features = dynamicFeatures.slice(0, 3);

	const rawHalls = listing.halls || [];
	const hallPrices = rawHalls.map((h) => Number(h.price)).filter((p) => p > 0);
	const minHallPrice = hallPrices.length > 0 ? Math.min(...hallPrices) : null;
	
	const startPrice = minHallPrice !== null 
		? minHallPrice 
		: (Number(listing.basePrice) || 0);

	const priceDisplay =
		startPrice === 0
			? 'Contact for Price'
			: startPrice < 1000
				? `₦${startPrice.toLocaleString()}`
				: startPrice < 1000000
					? `₦${(startPrice / 1000).toFixed(0)}k`
					: `₦${(startPrice / 1000000).toFixed(1)}m`;

	const locationDisplay = listing.city 
		? `${listing.addressLine ? `${listing.addressLine}, ` : ''}${listing.city}${listing.state ? `, ${listing.state}` : ''}`
		: listing.addressLine || 'Lekki Phase 1';

	const handleCardClick = () => {
		router.push(`/listings/${listing.slug}`);
	};

	return (
		<Card
			onClick={handleCardClick}
			className="group overflow-hidden border-0 shadow-sm hover:shadow-md transition-all flex flex-col h-full rounded-2xl cursor-pointer"
		>
			{/* Image Header */}
			<div className="relative aspect-4/3 bg-neutral-100 overflow-hidden">
				{/* Badges */}
				<div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
					{listing.status === 'ACTIVE' && (
						<Badge className="bg-white/90 text-neutral-900 font-bold backdrop-blur-sm border-0 shadow-sm hover:bg-white text-xs px-2.5 py-1 uppercase tracking-wider">
							SUPER HOST
						</Badge>
					)}
					{/* Example 'New' badge logic could go here */}
					{/* <Badge className="bg-accent-gold text-neutral-900 border-0 font-bold text-xs w-fit">NEW</Badge> */}
				</div>

				{/* Favorite Button */}
				<button
					onClick={(e) => {
						e.stopPropagation();
						// Handle favorite logic here
					}}
					className="absolute top-4 right-4 z-10 h-8 w-8 rounded-full bg-white/50 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors group/heart"
				>
					<Heart className="h-4 w-4 text-neutral-900 group-hover/heart:fill-red-500 group-hover/heart:text-red-500 transition-colors" />
				</button>

				{/* Image Placeholder - In real app use Next/Image */}
				<div className="w-full h-full bg-neutral-200 flex items-center justify-center text-neutral-400">
					{/* Using lucide icon as placeholder if no image */}
					{listing.images && listing.images.length > 0 ? (
						<img
							src={listing.images[0].url}
							alt={listing.name}
							className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
						/>
					) : (
						<div className="flex flex-col items-center">
							<MapPin className="h-10 w-10 mb-2 opacity-20" />
							<span className="text-xs opacity-50">No Image</span>
						</div>
					)}
				</div>
			</div>

			<CardContent className="flex flex-col flex-1 p-5">
				{/* Title & Rating */}
				<div className="flex justify-between items-start mb-2">
					<h3 className="font-bold text-lg text-neutral-900 line-clamp-1 group-hover:text-primary-blue transition-colors">
						{listing.name}
					</h3>
					<div className="flex items-center gap-1 text-sm font-semibold text-neutral-900">
						<Star className="h-3.5 w-3.5 fill-accent-gold text-accent-gold" />
						<span>{listing.rating || '4.9'}</span>
						<span className="text-neutral-400 font-normal">
							({listing.reviewCount || 120})
						</span>
					</div>
				</div>

				{/* Location */}
				<div className="flex items-center gap-1.5 text-sm text-neutral-500 mb-4">
					<MapPin className="h-3.5 w-3.5 shrink-0" />
					<span className="truncate">
						{locationDisplay}
					</span>
				</div>

				{/* Amenities/Tags Row */}
				<div className="flex gap-2 mb-6 flex-wrap">
					{features.map((feature, i) => (
						<div
							key={i}
							className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-medium text-neutral-600"
						>
							<feature.icon className="h-3.5 w-3.5" />
							{feature.label}
						</div>
					))}
				</div>

				{/* Footer: Price & Action */}
				<div className="mt-auto flex items-end justify-between border-t border-neutral-100 pt-4">
					<div>
						<span className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider">
							Starting from
						</span>
						<div className="flex items-baseline gap-1">
							<span className="text-xl font-bold text-primary-blue">
								{priceDisplay}
							</span>
							<span className="text-xs text-neutral-500">/ event</span>
						</div>
					</div>

					<span className="w-full max-w-[100px] inline-flex h-9 items-center justify-center rounded-lg bg-brand-blue text-sm font-semibold text-white shadow-sm hover:bg-brand-blue-hover transition-colors pointer-events-none group-hover:bg-brand-blue-hover">
						View Details
					</span>
				</div>
			</CardContent>
		</Card>
	);
}
