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
		<div className="min-h-screen bg-gray-50 pb-20">
			{/* Breadcrumbs (Simple) */}
			<div className="border-b bg-white">
				<div className="container mx-auto flex h-14 items-center gap-2 px-4 text-sm text-muted-foreground">
					<Link href="/" className="hover:text-foreground">
						Home
					</Link>
					<span>/</span>
					<Link href="/listings" className="hover:text-foreground">
						Venues
					</Link>
					<span>/</span>
					<span className="text-foreground truncate max-w-[200px]">
						{listing.title}
					</span>
				</div>
			</div>

			<div className="container mx-auto px-4 py-8">
				{/* Title Header */}
				<div className="mb-6">
					<h1 className="text-3xl font-bold text-gray-900 font-display">
						{listing.title}
					</h1>
					<div className="flex flex-wrap items-center justify-between gap-4 mt-2">
						<div className="flex flex-wrap items-center gap-4 text-sm">
							<div className="flex items-center gap-1">
								<Star className="h-4 w-4 fill-accent text-accent" />
								<span className="font-bold text-foreground">
									{listing.rating}
								</span>
								<span className="text-muted-foreground underline cursor-pointer">
									({listing.reviewCount} reviews)
								</span>
							</div>
							<span className="hidden sm:inline text-gray-300">•</span>
							{listing.status === 'ACTIVE' && (
								<div className="flex items-center gap-1 text-accent font-medium">
									<Badge
										variant="secondary"
										className="bg-accent/10 text-accent font-normal hover:bg-accent/20"
									>
										Superhost
									</Badge>
								</div>
							)}
							<span className="hidden sm:inline text-gray-300">•</span>
							<div className="flex items-center gap-1 text-muted-foreground">
								<MapPin className="h-4 w-4" />
								<span>
									{listing.addressLine}, {listing.city}
								</span>
							</div>
						</div>

						<div className="flex gap-2">
							<Button variant="outline" size="sm" className="gap-2">
								<Share className="h-4 w-4" />
								Share
							</Button>
							<Button variant="outline" size="sm" className="gap-2">
								<Heart className="h-4 w-4" />
								Save
							</Button>
						</div>
					</div>
				</div>

				{/* Image Grid */}
				<div className="mb-10">
					<ImageGrid images={listing.images || []} title={listing.title} />
				</div>

				<div className="grid gap-12 lg:grid-cols-3">
					{/* Left Content */}
					<div className="lg:col-span-2 space-y-10">
						{/* Host Info */}
						<div className="flex items-center justify-between border-b pb-8">
							<div>
								<h2 className="text-xl font-bold text-gray-900 mb-1">
									Entire ballroom hosted by Lagos Venues
								</h2>
								<p className="text-gray-500">
									500 guests • 20,000 sq ft • 4 restrooms • Full Kitchen
								</p>
							</div>
							<Avatar className="h-14 w-14 border border-gray-200">
								<AvatarImage src="/images/avatar-placeholder.jpg" />
								<AvatarFallback className="bg-orange-100 text-orange-600">
									LV
								</AvatarFallback>
							</Avatar>
						</div>

						{/* Key Features */}
						<div className="space-y-6 border-b pb-8">
							<FeatureItem
								icon={<ShieldCheck className="h-6 w-6 text-gray-600" />}
								title="Premium Venue"
								description="One of the most highly rated luxury venues in Lekki."
							/>
							<FeatureItem
								icon={<DoorOpen className="h-6 w-6 text-gray-600" />}
								title="Self check-in"
								description="Easy access code system for event planners."
							/>
							<FeatureItem
								icon={<Calendar className="h-6 w-6 text-gray-600" />}
								title="Free cancellation for 48 hours"
								description="Get a full refund if you change your mind."
							/>
						</div>

						{/* About */}
						<div className="border-b pb-8">
							<h2 className="text-xl font-bold text-gray-900 mb-4 font-display">
								About this space
							</h2>
							<p className="text-gray-600 leading-relaxed">
								{listing.description ||
									'A luxurious space perfect for traditional weddings, corporate events, and vibrant Owambe celebrations. The Grand Lekki Ballroom features 20-foot ceilings, crystal chandeliers, and floor-to-ceiling windows offering views of the Lekki skyline.'}
							</p>
							<Button
								variant="link"
								className="px-0 font-bold text-primary mt-2"
							>
								Show more &gt;
							</Button>
						</div>

						{/* Amenities */}
						<div className="border-b pb-8">
							<h2 className="text-xl font-bold text-gray-900 mb-6 font-display">
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
							<Button variant="outline" className="mt-6">
								Show all 32 amenities
							</Button>
						</div>

						{/* Reviews Summary */}
						<div className="pb-8">
							<div className="flex items-center gap-2 mb-6">
								<Star className="h-6 w-6 fill-accent text-accent" />
								<h2 className="text-xl font-bold text-gray-900 font-display">
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
						<div className="border-t pt-8">
							<h2 className="text-xl font-bold text-gray-900 mb-2 font-display">
								Where you'll be
							</h2>
							<p className="text-gray-500 mb-6">
								{listing.addressLine}, {listing.city}
							</p>
							<div className="aspect-[16/9] w-full bg-blue-50 rounded-xl relative overflow-hidden border border-gray-200">
								<div className="absolute inset-0 flex items-center justify-center text-blue-300">
									{/* Map Image Placeholder or Component */}
									<MapPin className="h-12 w-12" />
								</div>
							</div>
						</div>
					</div>

					{/* Right Sidebar */}
					<div>
						<BookingSidebar
							basePrice={listing.basePrice || 0}
							currency={listing.currency || 'NGN'}
						/>
						<div className="mt-6 flex items-center justify-center gap-4 text-xs text-muted-foreground">
							<div className="flex items-center gap-1">
								<ShieldCheck className="h-3 w-3" /> SSL Secure
							</div>
							<div className="flex items-center gap-1">
								<ShieldCheck className="h-3 w-3" /> Verified Vendor
							</div>
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
				<h3 className="font-semibold text-gray-900">{title}</h3>
				<p className="text-gray-500 text-sm">{description}</p>
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
		<div className="flex items-center gap-3 text-gray-600">
			{icon}
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
					<AvatarFallback>{name[0]}</AvatarFallback>
				</Avatar>
				<div>
					<div className="font-semibold text-gray-900">{name}</div>
					<div className="text-xs text-gray-500">{date}</div>
				</div>
			</div>
			<p className="text-gray-600 text-sm leading-relaxed">"{text}"</p>
		</div>
	);
}
