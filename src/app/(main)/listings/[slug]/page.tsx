'use client';

import { useParams } from 'next/navigation';
import { useListingBySlug } from '@/hooks/useListings';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
	Loader2,
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
} from 'lucide-react';
import { ImageGrid } from '@/components/listing/image-grid';
import { BookingSidebar } from '@/components/listing/booking-sidebar';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function ListingDetailPage() {
	const params = useParams();
	const slug = params.slug as string;
	const { data: listing, isLoading } = useListingBySlug(slug);

	if (isLoading) {
		return (
			<div className="flex h-screen items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	if (!listing) {
		return (
			<div className="flex h-screen items-center justify-center">
				<p className="text-muted-foreground">Listing not found</p>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-neutral-bg pb-20">
			{/* Breadcrumbs (Simple) */}
			{/* Breadcrumbs */}
			<div className="bg-white/50 backdrop-blur-sm py-4 border-b border-neutral-100 sticky top-16 z-30">
				<div className="container mx-auto px-4 flex items-center gap-2 text-sm text-neutral-500">
					<Link href="/" className="hover:text-neutral-900 transition-colors">
						Home
					</Link>
					<ChevronRight className="h-4 w-4 text-neutral-400" />
					<Link
						href="/listings"
						className="hover:text-neutral-900 transition-colors"
					>
						Venues
					</Link>
					<ChevronRight className="h-4 w-4 text-neutral-400" />
					<span className="text-neutral-900 font-medium truncate max-w-[300px]">
						{listing.name}
					</span>
				</div>
			</div>

			<div className="container mx-auto px-4 py-8">
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
						<span className="hidden sm:inline text-neutral-300">•</span>
						<div className="flex items-center gap-1 underline cursor-pointer hover:text-neutral-900 font-medium">
							<span>
								{listing.addressLine}, {listing.city}
							</span>
						</div>
					</div>
				</div>

				{/* Image Grid */}
				<div className="mb-10">
					<ImageGrid images={listing.images || []} title={listing.name} />
				</div>

				<div className="grid gap-12 lg:grid-cols-3">
					<div className="lg:col-span-2 space-y-10">
						{/* Host Info */}
						<div className="flex items-center justify-between border-b border-neutral-border pb-8">
							<div>
								<h2 className="text-xl font-semibold text-neutral-text-primary mb-1">
									Entire ballroom hosted by Lagos Venues
								</h2>
								<p className="text-neutral-text-muted">
									500 guests • 20,000 sq ft • 4 restrooms • Full Kitchen
								</p>
							</div>
							<Avatar className="h-14 w-14 border border-neutral-border">
								<AvatarImage src="/images/avatar-placeholder.jpg" />
								<AvatarFallback className="bg-primary-soft-blue text-primary-blue font-semibold">
									LV
								</AvatarFallback>
							</Avatar>
						</div>

						{/* Key Features */}
						<div className="space-y-6 border-b border-neutral-border pb-8">
							<FeatureItem
								icon={<ShieldCheck className="h-6 w-6 text-primary-blue" />}
								title="Premium Venue"
								description="One of the most highly rated luxury venues in Lekki."
							/>
							<FeatureItem
								icon={<DoorOpen className="h-6 w-6 text-primary-blue" />}
								title="Self check-in"
								description="Easy access code system for event planners."
							/>
							<FeatureItem
								icon={<Calendar className="h-6 w-6 text-primary-blue" />}
								title="Free cancellation for 48 hours"
								description="Get a full refund if you change your mind."
							/>
						</div>

						{/* About */}
						<div className="border-b border-neutral-border pb-8">
							<h2 className="text-xl font-semibold text-neutral-text-primary mb-4">
								About this space
							</h2>
							{listing.description ? (
								<div
									className="prose prose-neutral max-w-none w-full min-w-0 break-words text-neutral-text-muted leading-relaxed prose-headings:font-semibold prose-headings:text-neutral-text-primary prose-a:text-primary-blue prose-a:no-underline hover:prose-a:underline prose-strong:text-neutral-text-primary prose-strong:font-semibold prose-img:rounded-xl prose-img:max-w-full"
									dangerouslySetInnerHTML={{ __html: listing.description }}
								/>
							) : (
								<p className="text-neutral-text-muted leading-relaxed">
									A luxurious space perfect for traditional weddings, corporate
									events, and vibrant Owambe celebrations. The Grand Lekki
									Ballroom features 20-foot ceilings, crystal chandeliers, and
									floor-to-ceiling windows offering views of the Lekki skyline.
								</p>
							)}
							<Button
								variant="link"
								className="px-0 font-semibold text-primary-blue mt-2 hover:text-primary-blue-hover"
							>
								Show more &gt;
							</Button>
						</div>

						{/* Amenities */}
						<div className="border-b border-neutral-border pb-8">
							<h2 className="text-xl font-semibold text-neutral-text-primary mb-6">
								What this place offers
							</h2>
							<div className="grid sm:grid-cols-2 gap-4">
								<AmenityItem
									icon={<Zap className="h-5 w-5" />}
									label="24/7 Power Supply (Gen)"
								/>
								<AmenityItem
									icon={<Utensils className="h-5 w-5" />}
									label="Commercial Kitchen"
								/>
								<AmenityItem
									icon={<Home className="h-5 w-5" />}
									label="Bridal Suite"
								/>
								<AmenityItem
									icon={<Users className="h-5 w-5" />}
									label="Security Team"
								/>
							</div>
							<Button
								variant="outline"
								className="mt-6 border-primary-blue text-primary-blue hover:bg-primary-soft-blue"
							>
								Show all 32 amenities
							</Button>
						</div>

						{/* Reviews Summary */}
						<div className="pb-8">
							<div className="flex items-center gap-2 mb-6">
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
							<div className="aspect-[16/9] w-full bg-primary-soft-blue rounded-xl relative overflow-hidden border border-neutral-border">
								<div className="absolute inset-0 flex items-center justify-center text-primary-blue opacity-50">
									{/* Map Image Placeholder or Component */}
									<MapPin className="h-12 w-12" />
								</div>
							</div>
						</div>
					</div>

					{/* Right Sidebar */}
					<div>
						<div className="sticky top-32">
							<BookingSidebar
								basePrice={listing.basePrice || 0}
								currency={listing.currency || 'NGN'}
								venueName={listing.name}
								venueAddress={listing.addressLine}
								venueImage={listing.images?.[0]?.url}
							/>
						</div>
					</div>
				</div>
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
		<div className="flex gap-4">
			<div className="mt-1">{icon}</div>
			<div>
				<h3 className="font-semibold text-neutral-text-primary">{title}</h3>
				<p className="text-neutral-text-muted text-sm">{description}</p>
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
			<p className="text-neutral-text-muted text-sm leading-relaxed">
				"{text}"
			</p>
		</div>
	);
}
