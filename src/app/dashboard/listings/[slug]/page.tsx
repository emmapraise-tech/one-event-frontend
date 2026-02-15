'use client';

import { useParams, useRouter } from 'next/navigation';
import { useListingBySlug } from '@/hooks/useListings';
import { useMyBookings } from '@/hooks/useMyBookings';
import { useAuth } from '@/hooks/useAuth';
import { useVendors } from '@/hooks/useVendors';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
	Loader2,
	MapPin,
	Star,
	Edit,
	Trash2,
	ArrowLeft,
	CheckCircle2,
	Clock,
	Calendar,
	Users,
	LayoutDashboard,
	Eye,
	TrendingUp,
	DollarSign,
	ChevronRight,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import Link from 'next/link';
import { ImageGrid } from '@/components/listing/image-grid';
import { AMENITY_MAP } from '@/constants/amenities';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

const bookingSchema = z.object({
	startDate: z.string().min(1, 'Start date is required'),
	endDate: z.string().optional(),
	numberOfGuests: z.number().min(1).optional(),
	specialRequests: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

export default function ListingDetailPage() {
	const params = useParams();
	const slug = params.slug as string;
	const router = useRouter();
	const { user } = useAuth();
	const { vendor } = useVendors();
	const { data: listing, isLoading } = useListingBySlug(slug);
	const { createBooking, isCreating } = useMyBookings();
	const [showBookingDialog, setShowBookingDialog] = useState(false);
	const [showAllAmenities, setShowAllAmenities] = useState(false);

	const isOwner = vendor && listing && listing.vendorId === vendor.id;

	const form = useForm<BookingFormData>({
		resolver: zodResolver(bookingSchema),
		defaultValues: {
			startDate: '',
			endDate: '',
			numberOfGuests: undefined,
			specialRequests: '',
		},
	});

	const onSubmit = async (data: BookingFormData) => {
		if (!listing) return;
		createBooking(
			{
				listingId: listing.id,
				...data,
			},
			{
				onSuccess: () => {
					setShowBookingDialog(false);
					router.push('/dashboard/bookings');
				},
			},
		);
	};

	if (isLoading) {
		return (
			<div className="flex h-screen items-center justify-center bg-gray-50/50">
				<Loader2 className="h-10 w-10 animate-spin text-brand-blue" />
			</div>
		);
	}

	if (!listing) {
		return (
			<div className="flex flex-col h-screen items-center justify-center gap-4">
				<div className="p-4 bg-red-50 rounded-full">
					<Trash2 className="h-10 w-10 text-red-500" />
				</div>
				<p className="text-xl font-bold text-gray-900">Listing not found</p>
				<Button variant="outline" onClick={() => router.back()}>
					Go Back
				</Button>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50/50 pb-20">
			{/* Header Area */}
			<div className="bg-white border-b border-gray-100 sticky top-0 z-10">
				<div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
					<button
						onClick={() => router.back()}
						className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors"
					>
						<ArrowLeft className="h-4 w-4" />
						Back
					</button>

					<div className="flex items-center gap-3">
						{isOwner && (
							<>
								<Badge
									variant="outline"
									className="bg-brand-blue-soft text-brand-blue border-brand-blue-soft/30 h-8 font-bold px-3"
								>
									OWNER VIEW
								</Badge>
								<Button
									size="sm"
									asChild
									className="bg-brand-blue hover:bg-brand-blue-hover h-9 rounded-lg font-bold"
								>
									<Link href={`/dashboard/listings/${listing.slug}/edit`}>
										<Edit className="h-4 w-4 mr-2" />
										Edit Listing
									</Link>
								</Button>
							</>
						)}
					</div>
				</div>
			</div>

			<div className="max-w-7xl mx-auto py-8 px-4">
				<div className="grid gap-8 lg:grid-cols-3">
					{/* Main Content */}
					<div className="lg:col-span-2 space-y-8">
						<div className="mb-2">
							<ImageGrid images={listing.images || []} title={listing.name} />
						</div>

						{/* Info Section */}
						<div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
							<div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
								<div className="space-y-3">
									<h1 className="text-4xl font-black text-gray-900 tracking-tight leading-tight">
										{listing.name}
									</h1>
									<div className="flex flex-wrap items-center gap-3">
										<div className="flex items-center text-gray-500 font-medium font-sans">
											<div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
												<MapPin className="mr-2 h-4 w-4 text-brand-blue" />
												<span className="text-sm">
													{listing.addressLine
														? `${listing.addressLine}, `
														: ''}
													{listing.city}, {listing.state}
												</span>
											</div>
										</div>
										{(listing.categories || listing.category)?.map((cat) => (
											<Badge
												key={cat}
												variant="secondary"
												className="bg-brand-blue-soft text-brand-blue border-none px-3 py-1 rounded-full text-xs font-bold"
											>
												{cat.charAt(0) + cat.slice(1).toLowerCase()}
											</Badge>
										))}
									</div>
								</div>

								<div className="flex items-center gap-6 bg-gray-50 p-4 rounded-2xl border border-gray-100">
									<div className="text-center">
										<div className="flex items-center justify-center text-brand-blue mb-1">
											<Star className="h-5 w-5 fill-brand-blue" />
											<span className="text-xl font-black ml-1">
												{listing.rating}
											</span>
										</div>
										<p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
											{listing.reviewCount} Reviews
										</p>
									</div>
									<div className="h-10 w-px bg-gray-200" />
									<div className="text-right font-sans">
										<p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
											Daily rate
										</p>
										<div className="text-2xl font-black text-gray-900 leading-none">
											{listing.currency} {listing.basePrice?.toLocaleString()}
										</div>
									</div>
								</div>
							</div>

							<div className="space-y-8">
								{/* Venue Specs Summary */}
								<div className="border-y border-gray-100 py-6">
									<div className="flex flex-wrap gap-y-4 gap-x-8">
										{(() => {
											const detail = listing.venueDetail || listing.details;
											if (listing.type === 'VENUE' && detail) {
												return (
													<>
														<div className="flex items-center gap-3">
															<div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center text-brand-blue">
																<Users className="h-5 w-5" />
															</div>
															<div>
																<p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
																	Capacity
																</p>
																<p className="text-sm font-bold text-gray-900">
																	{detail.capacity ||
																		detail.seatedCapacity ||
																		0}{' '}
																	Guests
																</p>
															</div>
														</div>
														<div className="flex items-center gap-3">
															<div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center text-brand-blue">
																<LayoutDashboard className="h-5 w-5" />
															</div>
															<div>
																<p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
																	Area
																</p>
																<p className="text-sm font-bold text-gray-900">
																	{detail.floorArea || detail.totalArea || 0} sq
																	ft
																</p>
															</div>
														</div>
														<div className="flex items-center gap-3">
															<div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center text-brand-blue">
																<MapPin className="h-5 w-5" />
															</div>
															<div>
																<p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
																	Setting
																</p>
																<p className="text-sm font-bold text-gray-900">
																	{detail.hasIndoor ? 'Indoor' : ''}
																	{detail.hasIndoor && detail.hasOutdoor
																		? ' & '
																		: ''}
																	{detail.hasOutdoor ? 'Outdoor' : ''}
																</p>
															</div>
														</div>
													</>
												);
											}
											return null;
										})()}
									</div>
								</div>

								<div>
									<h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
										<CheckCircle2 className="h-5 w-5 text-green-500" />
										About this service
									</h3>
									<div
										className="prose prose-base prose-blue text-gray-600 leading-relaxed font-medium opacity-90 wrap-break-word overflow-hidden"
										dangerouslySetInnerHTML={{
											__html: listing.description || '',
										}}
									/>
								</div>

								{/* Amenities Section */}
								<div className="pt-6 border-t border-gray-100">
									<h3 className="text-lg font-bold text-gray-900 mb-6">
										What this place offers
									</h3>
									<div className="grid sm:grid-cols-2 gap-y-4 gap-x-8">
										{(() => {
											const detail = listing.venueDetail || listing.details;
											const amenities = detail?.amenities || [];
											const displayAmenities = showAllAmenities
												? amenities
												: amenities.slice(0, 6);

											if (amenities.length === 0) {
												return (
													<p className="text-gray-400 italic text-sm">
														No amenities listed.
													</p>
												);
											}

											return displayAmenities.map((slug) => {
												const config = AMENITY_MAP[slug];
												if (!config) return null;
												return (
													<div
														key={slug}
														className="flex items-center gap-3 text-gray-600"
													>
														<div className="text-brand-blue">{config.icon}</div>
														<span className="text-sm font-medium">
															{config.label}
														</span>
													</div>
												);
											});
										})()}
									</div>
									{(() => {
										const detail = listing.venueDetail || listing.details;
										const amenitiesCount = detail?.amenities?.length || 0;
										if (amenitiesCount > 6) {
											return (
												<Button
													variant="outline"
													className="mt-8 border-gray-200 text-gray-900 hover:border-gray-900 font-bold rounded-xl"
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

								{/* Add-ons Section */}
								{(() => {
									const addons = listing.addOns || listing.addons;
									if (addons && addons.length > 0) {
										return (
											<div className="pt-8 border-t border-gray-100">
												<h3 className="text-lg font-bold text-gray-900 mb-6">
													Available Add-ons
												</h3>
												<div className="grid gap-3">
													{addons.map((addon) => (
														<div
															key={addon.id}
															className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100"
														>
															<div className="font-bold text-gray-900 text-sm">
																{addon.name}
															</div>
															<div className="text-brand-blue font-black">
																₦{addon.price.toLocaleString()}
															</div>
														</div>
													))}
												</div>
											</div>
										);
									}
									return null;
								})()}
							</div>
						</div>
					</div>

					{/* Sidebar Area */}
					<div className="lg:col-span-1 space-y-6">
						{isOwner ? (
							/* Management Sidebar */
							<div className="space-y-6 sticky top-24">
								<Card className="rounded-3xl border-brand-blue-soft/30 shadow-xl shadow-brand-blue/5 bg-white overflow-hidden">
									<CardHeader className="bg-brand-blue text-white p-6">
										<CardTitle className="flex items-center gap-2 text-lg font-bold">
											<LayoutDashboard className="h-5 w-5 text-brand-blue-soft" />
											Quick Management
										</CardTitle>
									</CardHeader>
									<CardContent className="p-6 space-y-6">
										<div className="grid grid-cols-2 gap-4">
											<div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
												<div className="flex items-center gap-2 text-gray-400 mb-2">
													<Eye className="h-4 w-4" />
													<span className="text-[10px] font-bold uppercase tracking-widest">
														Views
													</span>
												</div>
												<div className="text-xl font-black text-gray-900">
													1,280
												</div>
											</div>
											<div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
												<div className="flex items-center gap-2 text-gray-400 mb-2">
													<TrendingUp className="h-4 w-4" />
													<span className="text-[10px] font-bold uppercase tracking-widest">
														Growth
													</span>
												</div>
												<div className="text-xl font-black text-green-600">
													+12%
												</div>
											</div>
										</div>

										<div className="p-4 bg-brand-blue-soft rounded-2xl border border-brand-blue-soft/30 flex items-center justify-between">
											<div className="flex items-center gap-3">
												<div className="bg-white p-2 rounded-xl shadow-sm">
													<DollarSign className="h-5 w-5 text-brand-blue" />
												</div>
												<div>
													<p className="text-[10px] font-bold text-brand-blue/60 uppercase leading-none mb-1">
														Total revenue
													</p>
													<p className="text-lg font-black text-brand-blue leading-none">
														₦450k
													</p>
												</div>
											</div>
										</div>

										<div className="space-y-3">
											<Button className="w-full bg-brand-blue hover:bg-brand-blue-hover h-10 rounded-xl font-bold shadow-lg shadow-brand-blue/10">
												View Detailed Analytics
											</Button>
											<Button
												variant="outline"
												className="w-full border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700 h-12 rounded-xl font-bold"
											>
												Archive Listing
											</Button>
										</div>
									</CardContent>
								</Card>

								<div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
									<div>
										<p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
											Status
										</p>
										<p className="text-sm font-black text-gray-900">
											{listing.status}
										</p>
									</div>
									<Button
										size="sm"
										variant="ghost"
										className="text-brand-blue hover:bg-brand-blue-soft font-bold"
									>
										Change Toggle
									</Button>
								</div>
							</div>
						) : (
							/* Booking Sidebar for non-owners */
							<div className="sticky top-24">
								<Card className="rounded-3xl border-gray-100 shadow-xl overflow-hidden shadow-brand-blue/5 bg-white">
									<CardHeader className="p-8 pb-4">
										<CardTitle className="text-2xl font-black text-gray-900 leading-none">
											Ready to book?
										</CardTitle>
										<p className="text-sm font-medium text-gray-500 mt-2 italic">
											Select your date to get started.
										</p>
									</CardHeader>
									<CardContent className="p-8 pt-4">
										{user ? (
											<Dialog
												open={showBookingDialog}
												onOpenChange={setShowBookingDialog}
											>
												<DialogTrigger asChild>
													<Button
														className="w-full bg-brand-blue hover:bg-brand-blue-hover h-14 rounded-2xl font-black text-lg shadow-xl shadow-brand-blue/20"
														size="lg"
													>
														Book This Now
													</Button>
												</DialogTrigger>
												<DialogContent className="sm:max-w-md rounded-3xl p-0 border-none overflow-hidden">
													<DialogHeader className="p-8 bg-gray-900 text-white">
														<DialogTitle className="text-2xl font-black">
															Reserve your spot
														</DialogTitle>
														<DialogDescription className="text-gray-400 font-medium">
															Enter event details to check availability.
														</DialogDescription>
													</DialogHeader>
													<form
														onSubmit={form.handleSubmit(onSubmit)}
														className="p-8 space-y-6"
													>
														<div className="grid gap-2">
															<Label className="font-bold text-gray-700">
																Start Date
															</Label>
															<Input
																type="date"
																min={new Date().toISOString().split('T')[0]}
																{...form.register('startDate')}
																className="h-12 rounded-xl border-gray-100 focus:ring-blue-500/20"
															/>
														</div>

														<div className="grid gap-2">
															<Label className="font-bold text-gray-700">
																End Date (Optional)
															</Label>
															<Input
																type="date"
																min={new Date().toISOString().split('T')[0]}
																{...form.register('endDate')}
																className="h-12 rounded-xl border-gray-100 focus:ring-blue-500/20"
															/>
														</div>

														{listing.type === 'VENUE' && (
															<div className="grid gap-2">
																<Label className="font-bold text-gray-700 flex items-center gap-2 justify-center">
																	<Users className="h-4 w-4" />
																	Number of Guests
																</Label>
																<Input
																	type="number"
																	min={1}
																	{...form.register('numberOfGuests', {
																		valueAsNumber: true,
																	})}
																	className="h-12 rounded-xl"
																/>
															</div>
														)}

														<div className="pt-4 flex gap-3">
															<Button
																type="submit"
																disabled={isCreating}
																className="flex-1 h-14 bg-brand-blue hover:bg-brand-blue-hover rounded-2xl font-black shadow-lg shadow-brand-blue/20"
															>
																{isCreating ? (
																	<Loader2 className="animate-spin" />
																) : (
																	'Confirm Booking'
																)}
															</Button>
														</div>
													</form>
												</DialogContent>
											</Dialog>
										) : (
											<Button
												asChild
												className="w-full bg-brand-blue hover:bg-brand-blue-hover h-14 rounded-2xl font-black text-lg shadow-xl shadow-brand-blue/20"
												size="lg"
											>
												<Link href="/login">Sign In to Book</Link>
											</Button>
										)}
									</CardContent>
								</Card>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
