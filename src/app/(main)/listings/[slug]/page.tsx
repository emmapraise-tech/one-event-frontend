'use client';

import { useParams } from 'next/navigation';
import { useListingBySlug } from '@/hooks/useListings';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
	MapPin,
	Star,
	Share,
	Heart,
	Home,
	Users,
	Ruler,
	DoorOpen,
	Utensils,
	Zap,
	ShieldCheck,
	Calendar,
	ChevronRight,
	Sparkles,
} from 'lucide-react';
import { useState } from 'react';
import { ImageGrid } from '@/components/listing/image-grid';
import { BookingSidebar } from '@/components/listing/booking-sidebar';
import { ListingDetailSkeleton } from '@/components/ui/skeletons';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AMENITY_MAP } from '@/constants/amenities';

export default function ListingDetailPage() {
	const params = useParams();
	const slug = params.slug as string;
	const { data: listing, isLoading } = useListingBySlug(slug);
	const [showFullDescription, setShowFullDescription] = useState(false);
	const [showAllAmenities, setShowAllAmenities] = useState(false);

	if (isLoading) {
		return <ListingDetailSkeleton />;
	}

	if (!listing) {
		return (
			<div className="flex h-screen items-center justify-center">
				<p className="text-muted-foreground">Listing not found</p>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-neutral-bg pb-10 overflow-x-hidden w-full">
			{/* Breadcrumbs (Simple) */}
			<div className="container mx-auto px-4 pt-6 pb-12">
				{/* Breadcrumbs */}
				<div className="flex items-center gap-2 text-sm text-neutral-500 mb-4 overflow-x-auto whitespace-nowrap scrollbar-hide pb-2">
					<Link
						href="/"
						className="hover:text-neutral-900 transition-colors shrink-0"
					>
						Home
					</Link>
					<ChevronRight className="h-4 w-4 text-neutral-400 shrink-0" />
					<Link
						href="/listings"
						className="hover:text-neutral-900 transition-colors shrink-0"
					>
						Venues
					</Link>
					<ChevronRight className="h-4 w-4 text-neutral-400 shrink-0" />
					<span className="text-neutral-900 font-medium truncate max-w-[200px] sm:max-w-[300px] shrink-0">
						{listing.name}
					</span>
				</div>
				{/* Title Header */}
				<div className="mb-6">
					<div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
						<h1 className="text-3xl lg:text-4xl font-bold text-neutral-900 leading-tight">
							{listing.name}
						</h1>
						<div className="flex gap-3 shrink-0">
							<Button
								variant="outline"
								size="sm"
								className="gap-2 border-neutral-200 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 hover:border-neutral-300 rounded-lg h-10 px-4"
							>
								<Share className="h-4 w-4" />
								Share
							</Button>
							<Button
								variant="outline"
								size="sm"
								className="gap-2 border-neutral-200 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 hover:border-neutral-300 rounded-lg h-10 px-4"
							>
								<Heart className="h-4 w-4" />
								Save
							</Button>
						</div>
					</div>

					<div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-neutral-600">
						<div className="flex items-center gap-1">
							<Star className="h-4 w-4 fill-brand-gold text-brand-gold" />
							<span className="font-bold text-neutral-900">
								{listing.rating}
							</span>
							<span className="text-neutral-500">
								({listing.reviewCount} reviews)
							</span>
						</div>
						<span className="hidden sm:inline text-neutral-300">•</span>
						{listing.status === 'ACTIVE' && (
							<div className="flex items-center gap-1">
								<Badge
									variant="secondary"
									className="bg-accent-soft-gold text-brand-gold hover:bg-accent-soft-gold/80 font-normal py-0.5"
								>
									Superhost
								</Badge>
							</div>
						)}
						{(listing.categories || listing.category)?.map((cat) => (
							<div key={cat} className="flex items-center gap-1">
								<span className="hidden sm:inline text-neutral-300">•</span>
								<Badge
									variant="outline"
									className="text-neutral-500 font-normal py-0.5 border-neutral-200"
								>
									{cat.charAt(0) + cat.slice(1).toLowerCase()}
								</Badge>
							</div>
						))}
						<span className="hidden sm:inline text-neutral-300">•</span>
						<div className="flex items-center gap-1 underline cursor-pointer hover:text-neutral-900 font-medium">
							<span>
								{listing.addressLine}, {listing.city}
								{listing.state ? `, ${listing.state}` : ''}
							</span>
						</div>
					</div>
				</div>

				{/* Image Grid */}
				<div className="mb-8">
					<ImageGrid images={listing.images || []} title={listing.name} />
				</div>

				<div className="grid gap-8 lg:grid-cols-3">
					<div className="lg:col-span-2 space-y-8 min-w-0">
						{/* Host Info */}
						<div className="flex items-center justify-between border-b border-neutral-border pb-6">
							<div>
								<h2 className="text-xl font-semibold text-neutral-text-primary mb-1">
									Hosted by {listing.vendor?.businessName || 'Lagos Venues'}
								</h2>
								<div className="text-neutral-text-muted">
									{(() => {
										const detail = listing.venueDetail || listing.details;
										if (listing.type === 'VENUE' && detail) {
											return (
												<span>
													{detail.capacity || detail.seatedCapacity || 0} guests
													{detail.standingCapacity
														? ` (${detail.standingCapacity} standing)`
														: ''}{' '}
													• {detail.floorArea || detail.totalArea || 0} sq ft •{' '}
													{detail.parkingCap || 0} parking •{' '}
													{detail.hasIndoor ? 'Indoor' : ''}
													{detail.hasIndoor && detail.hasOutdoor ? ' & ' : ''}
													{detail.hasOutdoor ? 'Outdoor' : ''}
												</span>
											);
										}
										return (
											<span>
												{listing.type.charAt(0) +
													listing.type.slice(1).toLowerCase()}{' '}
												Specialist
											</span>
										);
									})()}
								</div>
							</div>
							<Avatar className="h-14 w-14 border border-neutral-border">
								<AvatarImage src={listing.vendor?.businessLogo} />
								<AvatarFallback className="bg-primary-soft-blue text-primary-blue font-semibold">
									{(listing.vendor?.businessName || 'Lagos Venues')
										.split(' ')
										.map((n) => n[0])
										.join('')
										.substring(0, 2)
										.toUpperCase()}
								</AvatarFallback>
							</Avatar>
						</div>

						{/* Key Features Highights */}
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-neutral-border pb-8">
							<FeatureItem
								icon={<ShieldCheck className="h-5 w-5" />}
								title="Premium Venue"
								description={`Highly rated luxury venue in ${listing.city || 'Lekki'}.`}
							/>
							<FeatureItem
								icon={<DoorOpen className="h-5 w-5" />}
								title="Verified Listing"
								description="Professional and reliable service provider."
							/>
							<FeatureItem
								icon={<Calendar className="h-5 w-5" />}
								title="Secure Booking"
								description="Hassle-free reservation and payment."
							/>
						</div>

						{/* About */}
						<div className="border-b border-neutral-border pb-6">
							<h2 className="text-xl font-semibold text-neutral-text-primary mb-4">
								About this space
							</h2>
							<div
								className={`relative ${!showFullDescription ? 'max-h-56 overflow-hidden' : ''}`}
							>
								{listing.description ? (
									<div
										className="prose prose-neutral max-w-full w-full overflow-x-auto min-w-0 break-words text-neutral-text-muted leading-relaxed prose-headings:font-semibold prose-headings:text-neutral-text-primary prose-a:text-primary-blue prose-a:no-underline hover:prose-a:underline prose-strong:text-neutral-text-primary prose-strong:font-semibold prose-img:rounded-xl prose-img:max-w-full"
										dangerouslySetInnerHTML={{ __html: listing.description }}
									/>
								) : (
									<p className="text-neutral-text-muted leading-relaxed">
										A luxurious space perfect for traditional weddings,
										corporate events, and vibrant Owambe celebrations. The Grand
										Lekki Ballroom features 20-foot ceilings, crystal
										chandeliers, and floor-to-ceiling windows offering views of
										the Lekki skyline.
									</p>
								)}
								{!showFullDescription && listing.description && (
									<div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-neutral-bg to-transparent pointer-events-none" />
								)}
							</div>
							{(listing.description?.length || 0) > 300 && (
								<Button
									variant="link"
									className="px-0 font-bold text-neutral-900 mt-4 hover:no-underline flex items-center gap-1 group"
									onClick={() => setShowFullDescription(!showFullDescription)}
								>
									{showFullDescription ? 'Show less' : 'Show more'}
									<ChevronRight
										className={`h-4 w-4 transition-transform ${showFullDescription ? '-rotate-90' : 'rotate-90'}`}
									/>
								</Button>
							)}
						</div>

						{/* Amenities */}
						<div className="border-b border-neutral-border pb-6">
							<h2 className="text-xl font-semibold text-neutral-text-primary mb-4">
								What this place offers
							</h2>
							<div className="grid sm:grid-cols-2 gap-4">
								{(() => {
									const detail = listing.venueDetail || listing.details;
									const rawAmenities = detail?.amenities || [];
									const amenities = Array.isArray(rawAmenities)
										? rawAmenities
										: Object.entries(rawAmenities)
												.filter(([_, v]) => v)
												.map(([k]) => k);

									if (amenities.length === 0) {
										return (
											<div className="text-neutral-500 italic">
												No amenities listed.
											</div>
										);
									}

									const displayAmenities = showAllAmenities
										? amenities
										: (amenities as any[]).slice(0, 6);

									return (displayAmenities as string[]).map((slug) => {
										const config =
											AMENITY_MAP[slug as keyof typeof AMENITY_MAP];
										if (!config) return null;
										return (
											<AmenityItem
												key={slug}
												icon={config.icon}
												label={config.label}
											/>
										);
									});
								})()}
							</div>
							{(() => {
								const detail = listing.venueDetail || listing.details;
								const rawAmenities = detail?.amenities || [];
								const amenitiesCount = Array.isArray(rawAmenities)
									? rawAmenities.length
									: Object.values(rawAmenities).filter(Boolean).length;

								if (amenitiesCount > 6) {
									return (
										<Button
											variant="outline"
											className="mt-6 border-neutral-200 text-neutral-900 hover:border-neutral-900 transition-colors px-6 h-12 font-bold rounded-xl"
											onClick={() => setShowAllAmenities(!showAllAmenities)}
										>
											{showAllAmenities
												? 'Show less'
												: `Show all ${amenitiesCount} amenities`}
										</Button>
									);
								}
								return null;
							})()}
						</div>

						{/* Reviews Summary */}
						<div className="pb-8">
							<div className="flex items-center gap-2 mb-4">
								<Star className="h-6 w-6 fill-accent-gold text-accent-gold" />
								<h2 className="text-xl font-semibold text-neutral-text-primary">
									{listing.rating} · {listing.reviewCount} Reviews
								</h2>
							</div>

							<div className="grid sm:grid-cols-2 gap-8">
								<ReviewItem
									name="Ngozi A."
									date="October 2023"
									text="Absolutely stunning venue. The lighting was perfect for our wedding reception."
								/>
								<ReviewItem
									name="Emeka O."
									date="September 2023"
									text="Great location right in Lekki. Secure parking was a big plus for our guests."
								/>
							</div>
						</div>

						{/* Map Placeholder */}
						<div className="border-t border-neutral-border pt-8">
							<h2 className="text-xl font-semibold text-neutral-text-primary mb-2">
								Where you'll be
							</h2>
							<p className="text-neutral-text-muted mb-6">
								{listing.addressLine}, {listing.city}
							</p>
							{(() => {
								const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
								const hasCoords =
									listing.latitude != null && listing.longitude != null;
								const addressQuery = `${listing.addressLine}, ${listing.city}, ${listing.state}`;
								const q = hasCoords
									? `${listing.latitude},${listing.longitude}`
									: addressQuery;

								const mapSrc = apiKey
									? `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(q)}&zoom=15`
									: `https://maps.google.com/maps?q=${encodeURIComponent(q)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

								return (
									<div className="aspect-video w-full rounded-xl relative overflow-hidden border border-neutral-border shadow-sm bg-neutral-100">
										<iframe
											width="100%"
											height="100%"
											style={{ border: 0 }}
											loading="lazy"
											allowFullScreen
											referrerPolicy="no-referrer-when-downgrade"
											src={mapSrc}
										></iframe>
									</div>
								);
							})()}
						</div>
					</div>

					{/* Right Sidebar */}
					<div className="min-w-0">
						<div className="sticky top-24">
							<BookingSidebar
								basePrice={listing.basePrice || 0}
								currency={listing.currency || 'NGN'}
								venueName={listing.name}
								venueAddress={listing.addressLine}
								venueImage={listing.images?.[0]?.url}
								addOns={listing.addOns || listing.addons}
								rating={listing.rating}
								reviewCount={listing.reviewCount}
								listingId={listing.id}
							/>
						</div>
					</div>
				</div>
			</div>

			{/* Mobile Sticky Booking Bar */}
			<div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40 flex items-center justify-between">
				<div>
					<p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wide">
						Starting at
					</p>
					<div className="text-lg font-black text-neutral-900">
						{listing.currency} {listing.basePrice?.toLocaleString()}{' '}
						<span className="text-sm font-normal text-neutral-500">/day</span>
					</div>
				</div>
				<Button
					onClick={() => {
						window.scrollTo({
							top: document.body.scrollHeight,
							behavior: 'smooth',
						});
					}}
					className="bg-brand-gold hover:bg-brand-gold-hover text-neutral-900 font-bold px-8 h-12 shadow-md rounded-xl"
				>
					Reserve
				</Button>
			</div>
		</div>
	);
}

function FeatureItem({
	icon,
	title,
	description,
}: {
	icon: React.ReactNode;
	title: string;
	description: string;
}) {
	return (
		<div className="flex flex-col gap-3 p-4 rounded-xl bg-neutral-50/50 border border-neutral-100 transition-all hover:bg-white hover:shadow-sm">
			<div className="h-10 w-10 flex items-center justify-center rounded-lg bg-blue-50 text-brand-blue shrink-0">
				{icon}
			</div>
			<div>
				<h3 className="font-bold text-sm text-neutral-900">{title}</h3>
				<p className="text-xs text-neutral-500 mt-1 leading-relaxed">
					{description}
				</p>
			</div>
		</div>
	);
}

function AmenityItem({
	icon,
	label,
}: {
	icon: React.ReactNode;
	label: string;
}) {
	return (
		<div className="flex items-center gap-3 text-neutral-text-muted">
			<div className="text-neutral-text-muted">{icon}</div>
			<span>{label}</span>
		</div>
	);
}

function ReviewItem({
	name,
	date,
	text,
}: {
	name: string;
	date: string;
	text: string;
}) {
	return (
		<div className="space-y-3">
			<div className="flex items-center gap-3">
				<Avatar>
					<AvatarFallback className="bg-neutral-100 text-neutral-text-primary">
						{name[0]}
					</AvatarFallback>
				</Avatar>
				<div>
					<div className="font-semibold text-neutral-text-primary">{name}</div>
					<div className="text-xs text-neutral-text-muted">{date}</div>
				</div>
			</div>
			<p className="text-neutral-text-muted text-sm leading-relaxed break-words">
				"{text}"
			</p>
		</div>
	);
}
