'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listingService } from '@/services/listing.service';
import { Listing, ListingStatus } from '@/types/listing';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Loader2,
	List,
	CheckCircle,
	XCircle,
	MapPin,
	Shield,
	Eye,
	Building2,
	Users,
	Sparkles,
	Clock,
	AlertCircle,
	ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/legacy/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { PageHeaderSkeleton, CardSkeleton } from '@/components/ui/skeletons';

export default function AdminListingsPage() {
	const queryClient = useQueryClient();
	const { data: paginatedData, isLoading } = useQuery({
		queryKey: ['admin', 'listings'],
		queryFn: () => listingService.adminFindAll(),
	});

	const listings = paginatedData?.data || [];

	const statusMutation = useMutation({
		mutationFn: ({ id, status }: { id: string; status: ListingStatus }) =>
			listingService.updateStatus(id, status),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['admin', 'listings'] });
			toast.success('Listing status updated successfully');
		},
		onError: () => {
			toast.error('Failed to update listing status');
		},
	});

	if (isLoading) {
		return (
			<div className="space-y-8 animate-in fade-in duration-500 pb-20">
				<PageHeaderSkeleton />
				<div className="grid gap-8">
					<CardSkeleton />
					<CardSkeleton />
				</div>
			</div>
		);
	}

	const safeListings = Array.isArray(listings) ? listings : [];
	const pendingCount = safeListings.filter(
		(l) => l.status === ListingStatus.PENDING,
	).length;

	return (
		<div className="space-y-8 animate-in fade-in duration-500 pb-20">
			{/* Admin Header */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[40px] border border-neutral-100 shadow-soft">
				<div>
					<div className="flex items-center gap-2 mb-2">
						<Shield className="h-4 w-4 text-brand-blue" />
						<span className="text-[10px] font-bold text-brand-blue uppercase tracking-widest">
							Inventory Management
						</span>
					</div>
					<h1 className="text-4xl font-black text-neutral-900 tracking-tight">
						Listings Pipeline
					</h1>
					<p className="text-neutral-500 mt-1 font-medium">
						Quality control and verification for platform venue inventory.
					</p>
				</div>
				<div className="flex gap-4">
					<div className="bg-amber-50 px-6 py-3 rounded-2xl border border-amber-100 flex items-center gap-3">
						<Clock className="h-5 w-5 text-amber-600" />
						<div>
							<p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest leading-none mb-1">
								Attention Required
							</p>
							<p className="text-xl font-black text-amber-700 leading-none">
								{pendingCount}
							</p>
						</div>
					</div>
					<div className="bg-brand-blue-soft px-6 py-3 rounded-2xl border border-blue-100 flex items-center gap-3">
						<Building2 className="h-5 w-5 text-brand-blue" />
						<div>
							<p className="text-[10px] font-bold text-brand-blue uppercase tracking-widest leading-none mb-1">
								Total System
							</p>
							<p className="text-xl font-black text-brand-blue leading-none">
								{safeListings.length}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Filter Tabs */}
			<div className="flex gap-2 overflow-x-auto no-scrollbar">
				<Button
					variant="secondary"
					className="rounded-full h-10 px-6 font-bold bg-brand-blue text-white"
				>
					All Stream
				</Button>
				<Button
					variant="outline"
					className="rounded-full h-10 px-6 font-bold border-neutral-200 text-neutral-500"
				>
					Pending
				</Button>
			</div>

			{/* Listings Feed */}
			<div className="grid gap-8">
				{safeListings.length === 0 ? (
					<div className="p-20 text-center bg-white rounded-[40px] border-2 border-dashed border-neutral-100 shadow-soft">
						<List className="h-12 w-12 text-neutral-200 mx-auto mb-4" />
						<p className="font-bold text-neutral-400">
							No listings in the pipeline
						</p>
					</div>
				) : (
					safeListings.map((listing) => (
						<Card
							key={listing.id}
							className="group overflow-hidden rounded-[40px] border-none shadow-soft bg-white transition-all hover:shadow-xl border border-neutral-50"
						>
							<CardContent className="p-0">
								<div className="flex flex-col xl:flex-row">
									{/* Gallery Preview */}
									<div className="relative w-full xl:w-[400px] h-[300px] shrink-0 overflow-hidden">
										<Image
											src={listing.images?.[0]?.url || '/images/venue-1.jpg'}
											alt={listing.name}
											layout="fill"
											className="object-cover transition-transform duration-1000 group-hover:scale-110"
										/>
										<div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
										<div className="absolute top-6 left-6 z-10 flex gap-2">
											<Badge
												className={cn(
													'border-none px-3 py-1 font-bold text-[10px] uppercase tracking-wider rounded-full shadow-lg',
													listing.status === ListingStatus.ACTIVE
														? 'bg-emerald-500 text-white'
														: listing.status === ListingStatus.PENDING
															? 'bg-amber-500 text-white'
															: 'bg-neutral-500 text-white',
												)}
											>
												{listing.status}
											</Badge>
										</div>
									</div>

									{/* Management Info */}
									<div className="flex-1 p-10 flex flex-col justify-between">
										<div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
											<div className="space-y-2">
												<div className="flex items-center gap-2">
													<span className="text-[10px] font-black text-brand-blue bg-brand-blue-soft px-2 py-0.5 rounded-full uppercase tracking-tighter">
														{listing.type} • {listing.category}
													</span>
													<span className="text-[10px] font-bold text-neutral-400">
														ID: {listing.id.slice(-8).toUpperCase()}
													</span>
												</div>
												<h3 className="text-3xl font-black text-neutral-900 group-hover:text-brand-blue transition-colors tracking-tight">
													{listing.name}
												</h3>
												<div className="flex items-center gap-4 text-neutral-500">
													<div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest opacity-80">
														<MapPin className="h-3.5 w-3.5" />
														{listing.city}, {listing.state}
													</div>
													<div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest opacity-80">
														<Users className="h-3.5 w-3.5" />
														{listing.venueDetail?.capacity || 0} Capacity
													</div>
												</div>
											</div>

											<div className="text-right">
												<p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1 leading-none">
													Market Rate
												</p>
												<p className="text-3xl font-black text-brand-blue leading-none mb-2">
													₦{(listing.basePrice || 0).toLocaleString()}
												</p>
											</div>
										</div>

										<div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-10 border-t border-neutral-50">
											<div className="flex flex-wrap gap-2">
												<Link
													href={`/listings/${listing.slug}`}
													target="_blank"
												>
													<Button
														variant="outline"
														className="h-12 px-6 rounded-2xl font-bold border-neutral-100 hover:bg-neutral-50 group/btn"
													>
														Public Preview
														<ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
													</Button>
												</Link>
											</div>

											<div className="flex gap-4 w-full sm:w-auto">
												{listing.status === ListingStatus.PENDING && (
													<>
														<Button
															onClick={() =>
																statusMutation.mutate({
																	id: listing.id,
																	status: ListingStatus.ACTIVE,
																})
															}
															disabled={statusMutation.isPending}
															className="flex-1 sm:flex-none h-14 px-10 rounded-2xl font-black bg-brand-blue hover:bg-brand-blue-hover text-white shadow-xl shadow-blue-500/20 text-md tracking-tight"
														>
															<CheckCircle className="mr-2 h-5 w-5" />
															Verify & Publish
														</Button>
													</>
												)}
											</div>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					))
				)}
			</div>
		</div>
	);
}
