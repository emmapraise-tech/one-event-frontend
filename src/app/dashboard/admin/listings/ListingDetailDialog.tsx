'use client';

import { Listing, ListingStatus } from '@/types/listing';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
	MapPin,
	Users,
	Building2,
	Phone,
	Mail,
	Globe,
	Info,
	CheckCircle,
	XCircle,
	ExternalLink,
	LayoutGrid,
	Car,
	Maximize2,
	Sparkles,
} from 'lucide-react';
import Image from 'next/legacy/image';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface ListingDetailDialogProps {
	listing: Listing | null;
	isOpen: boolean;
	onClose: () => void;
	onApprove: (id: string) => void;
	onDecline: (id: string) => void;
	isProcessing: boolean;
}

export function ListingDetailDialog({
	listing,
	isOpen,
	onClose,
	onApprove,
	onDecline,
	isProcessing,
}: ListingDetailDialogProps) {
	if (!listing) return null;

	const venueDetail = listing.venueDetail || (listing as any).details;
	const amenities = venueDetail?.amenities || [];
	const amenityList = Array.isArray(amenities)
		? amenities
		: typeof amenities === 'object'
			? Object.keys(amenities).filter((k) => (amenities as any)[k])
			: [];

	const rawHalls = listing.halls || [];
	const hallPrices = rawHalls.map((h) => Number(h.price)).filter((p) => p > 0);
	const minHallPrice = hallPrices.length > 0 ? Math.min(...hallPrices) : null;
	const startPrice = minHallPrice !== null ? minHallPrice : (Number(listing.basePrice) || 0);

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-[32px] p-0 border-none shadow-2xl">
				{/* Hero Image Section */}
				<div className="relative h-[300px] w-full">
					<Image
						src={listing.images?.[0]?.url || '/images/venue-1.jpg'}
						alt={listing.name}
						layout="fill"
						className="object-cover"
					/>
					<div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
					<div className="absolute bottom-8 left-8 right-8 flex items-end justify-between">
						<div>
							<div className="flex items-center gap-2 mb-2">
								<Badge className="bg-brand-blue text-white border-none px-3 py-1 font-bold text-[10px] uppercase tracking-wider rounded-full">
									{listing.type} • {Array.isArray(listing.category) ? listing.category.join(', ') : listing.category}
								</Badge>
								<Badge
									className={cn(
										'border-none px-3 py-1 font-bold text-[10px] uppercase tracking-wider rounded-full',
										listing.status === ListingStatus.ACTIVE
											? 'bg-emerald-500 text-white'
											: listing.status === ListingStatus.PENDING
												? 'bg-amber-500 text-white'
												: 'bg-red-500 text-white',
									)}
								>
									{listing.status}
								</Badge>
							</div>
							<h2 className="text-4xl font-black text-white tracking-tight">
								{listing.name}
							</h2>
							<div className="flex items-center gap-4 text-white/80 mt-2">
								<div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest">
									<MapPin className="h-3.5 w-3.5" />
									{listing.addressLine ? `${listing.addressLine}, ` : ''}{listing.city}, {listing.state}
								</div>
								<div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest">
									<Users className="h-3.5 w-3.5" />
									{venueDetail?.capacity || 0} Capacity
								</div>
							</div>
						</div>
						<div className="text-right">
							<p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-1">
								Listing ID
							</p>
							<p className="text-white font-mono font-bold">
								#{listing?.id ? listing.id.slice(-8).toUpperCase() : 'N/A'}
							</p>
						</div>
					</div>
				</div>

				<div className="p-10 space-y-10">
					{/* Details Grid */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-10">
						<div className="md:col-span-2 space-y-8">
							{/* Description */}
							<section>
								<h3 className="text-lg font-black text-neutral-900 mb-4 flex items-center gap-2">
									<Info className="h-5 w-5 text-brand-blue" />
									Description
								</h3>
								<div 
									className="text-neutral-600 leading-relaxed font-medium prose prose-sm max-w-none"
									dangerouslySetInnerHTML={{ __html: listing.description || 'No description provided.' }}
								/>
							</section>

							{/* Venue Specifications */}
							{listing.type === 'VENUE' && venueDetail && (
								<section>
									<h3 className="text-lg font-black text-neutral-900 mb-4 flex items-center gap-2">
										<LayoutGrid className="h-5 w-5 text-brand-blue" />
										Specifications
									</h3>
									<div className="grid grid-cols-2 gap-4">
										<div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
											<p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
												Floor Area
											</p>
											<div className="flex items-center gap-2 text-neutral-900 font-bold">
												<Maximize2 className="h-4 w-4 text-neutral-400" />
												{venueDetail.floorArea || 0} sqm
											</div>
										</div>
										<div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
											<p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
												Parking
											</p>
											<div className="flex items-center gap-2 text-neutral-900 font-bold">
												<Car className="h-4 w-4 text-neutral-400" />
												{venueDetail.parkingCap || 0} Vehicles
											</div>
										</div>
									</div>
								</section>
							)}

							{/* Amenities */}
							{amenityList.length > 0 && (
								<section>
									<h3 className="text-lg font-black text-neutral-900 mb-4 flex items-center gap-2">
										<Sparkles className="h-5 w-5 text-brand-blue" />
										Amenities
									</h3>
									<div className="flex flex-wrap gap-2">
										{amenityList.map((amenity: string) => (
											<Badge
												key={amenity}
												variant="outline"
												className="rounded-full px-4 py-1.5 font-bold border-neutral-200 text-neutral-600 bg-white shadow-xs"
											>
												{amenity}
											</Badge>
										))}
									</div>
								</section>
							)}

							{/* Halls */}
							{listing.halls && listing.halls.length > 0 && (
								<section>
									<h3 className="text-lg font-black text-neutral-900 mb-4 flex items-center gap-2">
										<Building2 className="h-5 w-5 text-brand-blue" />
										Halls & Spaces ({listing.halls.length})
									</h3>
									<div className="space-y-3">
										{listing.halls.map((hall) => (
											<div
												key={hall.id}
												className="flex items-center justify-between p-4 bg-white rounded-2xl border border-neutral-100 shadow-xs hover:border-brand-blue/30 transition-colors"
											>
												<div>
													<p className="font-bold text-neutral-900">
														{hall.name}
													</p>
													<p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
														{hall.capacity} Seated • {hall.standingCapacity || 0}{' '}
														Standing
													</p>
												</div>
												<div className="text-right">
													<p className="text-md font-black text-brand-blue">
														₦{hall.price.toLocaleString()}
													</p>
												</div>
											</div>
										))}
									</div>
								</section>
							)}
						</div>

						{/* Sidebar Info */}
						<div className="space-y-8">
							{/* Pricing Card */}
							<div className="bg-brand-blue p-8 rounded-[32px] text-white shadow-xl shadow-blue-500/20">
								<p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-1">
									Starting From
								</p>
								<div className="flex items-baseline gap-1 mb-4">
									<span className="text-4xl font-black">
										₦{(startPrice || 0).toLocaleString()}
									</span>
									<span className="text-sm font-bold text-white/60">/ Day</span>
								</div>
								<Link href={`/listings/${listing.slug}`} target="_blank">
									<Button className="w-full bg-white text-brand-blue hover:bg-neutral-50 rounded-2xl h-12 font-black shadow-lg">
										View Public Page
										<ExternalLink className="ml-2 h-4 w-4" />
									</Button>
								</Link>
							</div>

							{/* Vendor Info */}
							<div className="bg-neutral-50 p-6 rounded-[32px] border border-neutral-100">
								<h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-4">
									Partner Information
								</h4>
								<div className="space-y-4">
									<div>
										<p className="text-sm font-black text-neutral-900">
											{listing.vendor?.businessName || 'Unnamed Vendor'}
										</p>
										<p className="text-[10px] font-bold text-neutral-500 uppercase tracking-tight">
											Professional Partner
										</p>
									</div>
									<div className="space-y-3 pt-4 border-t border-neutral-100">
										<div className="flex items-center gap-3 text-neutral-600 font-medium">
											<div className="h-8 w-8 rounded-full bg-white flex items-center justify-center border border-neutral-100 shadow-xs">
												<Mail className="h-3.5 w-3.5 text-brand-blue" />
											</div>
											<span className="text-xs truncate">
												{listing.vendor?.user?.email}
											</span>
										</div>
										<div className="flex items-center gap-3 text-neutral-600 font-medium">
											<div className="h-8 w-8 rounded-full bg-white flex items-center justify-center border border-neutral-100 shadow-xs">
												<Phone className="h-3.5 w-3.5 text-brand-blue" />
											</div>
											<span className="text-xs">
												{listing.vendor?.businessPhone ||
													listing.vendor?.user?.phone ||
													'N/A'}
											</span>
										</div>
										{listing.vendor?.businessWebsite && (
											<div className="flex items-center gap-3 text-neutral-600 font-medium">
												<div className="h-8 w-8 rounded-full bg-white flex items-center justify-center border border-neutral-100 shadow-xs">
													<Globe className="h-3.5 w-3.5 text-brand-blue" />
												</div>
												<span className="text-xs truncate">
													{listing.vendor.businessWebsite}
												</span>
											</div>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Footer Actions */}
				<DialogFooter className="p-8 bg-neutral-50 border-t border-neutral-100 sm:justify-between items-center gap-4">
					<p className="text-xs font-bold text-neutral-400 max-w-[300px]">
						By approving, this listing will become live on the platform and
						searchable by all users.
					</p>
					<div className="flex gap-3 w-full sm:w-auto">
						{listing.status !== ListingStatus.REJECTED && (
							<Button
								variant="outline"
								onClick={() => onDecline(listing.id)}
								disabled={isProcessing}
								className="flex-1 sm:flex-none h-14 px-8 rounded-2xl font-black border-neutral-200 text-neutral-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
							>
								{isProcessing ? (
									<Loader2 className="h-5 w-5 animate-spin" />
								) : (
									<>
										<XCircle className="mr-2 h-5 w-5" />
										Decline Listing
									</>
								)}
							</Button>
						)}
						{listing.status !== ListingStatus.ACTIVE && (
							<Button
								onClick={() => onApprove(listing.id)}
								disabled={isProcessing}
								className="flex-1 sm:flex-none h-14 px-10 rounded-2xl font-black bg-brand-blue hover:bg-brand-blue-hover text-white shadow-xl shadow-blue-500/20"
							>
								{isProcessing ? (
									<Loader2 className="h-5 w-5 animate-spin" />
								) : (
									<>
										<CheckCircle className="mr-2 h-5 w-5" />
										Approve & Publish
									</>
								)}
							</Button>
						)}
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

const Loader2 = ({ className }: { className?: string }) => (
	<svg
		className={cn('animate-spin', className)}
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
	>
		<circle
			className="opacity-25"
			cx="12"
			cy="12"
			r="10"
			stroke="currentColor"
			strokeWidth="4"
		></circle>
		<path
			className="opacity-75"
			fill="currentColor"
			d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
		></path>
	</svg>
);
