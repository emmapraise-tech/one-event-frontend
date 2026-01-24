import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, MapPin, Star, Users, Utensils, Wifi, Car } from 'lucide-react';
import Link from 'next/link';
import { Listing } from '@/types/listing';

interface VenueListingCardProps {
	listing: Listing;
}

export function VenueListingCard({ listing }: VenueListingCardProps) {
	// Mock features/amenities derived from type
	const features = [
		{ label: '50-100', icon: Users },
		{ label: 'Wifi', icon: Wifi },
		{ label: 'Valet', icon: Car },
	];

	if (listing.type === 'VENUE') {
		// Add logic to customize amenities based on real listing data if available
	}

	// Format price
	const priceFormatted = listing.basePrice
		? `₦${(listing.basePrice / 1000).toFixed(1)}m`
		: '₦0';
	// Fallback for smaller amounts if needed, mockup shows "N2.5m" or "N850k"
	const priceDisplay =
		listing.basePrice && listing.basePrice < 1000000
			? `₦${(listing.basePrice / 1000).toFixed(0)}k`
			: `₦${(listing.basePrice! / 1000000).toFixed(1)}m`;

	return (
		<Card className="group overflow-hidden border-0 shadow-sm hover:shadow-md transition-all flex flex-col h-full rounded-2xl">
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
				<button className="absolute top-4 right-4 z-10 h-8 w-8 rounded-full bg-white/50 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors group/heart">
					<Heart className="h-4 w-4 text-neutral-900 group-hover/heart:fill-red-500 group-hover/heart:text-red-500 transition-colors" />
				</button>

				{/* Image Placeholder - In real app use Next/Image */}
				<div className="w-full h-full bg-neutral-200 flex items-center justify-center text-neutral-400">
					{/* Using lucide icon as placeholder if no image */}
					{listing.images && listing.images.length > 0 ? (
						<img
							src={listing.images[0].url}
							alt={listing.title}
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
						{listing.title}
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
						{listing.addressLine || 'Lekki Phase 1'}, {listing.city}
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

					<Link
						href={`/listings/${listing.slug}`}
						className="w-full max-w-[100px] inline-flex h-9 items-center justify-center rounded-lg bg-brand-blue text-sm font-semibold text-white shadow-sm hover:bg-brand-blue-hover transition-colors"
					>
						View Details
					</Link>
				</div>
			</CardContent>
		</Card>
	);
}
