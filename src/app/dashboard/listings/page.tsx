'use client';

import { useListings } from '@/hooks/useListings';
import { useVendors } from '@/hooks/useVendors';
import { useAuth } from '@/hooks/useAuth';
import { ListingCard } from '@/components/listings/listing-card';
import { EmptyState } from '@/components/ui/empty-state';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Store } from 'lucide-react';
import { UserType } from '@/types/auth';
import Link from 'next/link';
import { useVendorListings } from '@/hooks/useVendorListings';

export default function ListingsPage() {
	const { user } = useAuth();
	const { vendor } = useVendors();
	const { listings, isLoading, error } = useVendorListings();

	// Filter listings for vendors to show only their own
	const isVendor =
		user?.type === UserType.VENDOR || user?.type === UserType.ADMIN;
	const vendorListings =
		isVendor && vendor
			? listings?.filter((listing) => listing.vendorId === vendor.id)
			: listings;

	if (isLoading) {
		return (
			<div className="flex h-full items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex h-full items-center justify-center text-destructive">
				Error loading listings
			</div>
		);
	}

	return (
		<div className="space-y-10 pb-10">
			<div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
				<div className="space-y-2">
					<Badge
						variant="outline"
						className="bg-brand-blue-soft text-brand-blue border-brand-blue-soft/30 font-bold px-3 py-1 mb-2"
					>
						{isVendor ? 'VENDOR PORTAL' : 'EXPLORE'}
					</Badge>
					<h1 className="text-4xl font-black tracking-tight text-gray-900 leading-none">
						{isVendor ? 'My Listings' : 'Browse Services'}
					</h1>
					<p className="text-lg font-medium text-gray-500 max-w-2xl">
						{isVendor
							? 'Effortlessly manage your professional services and optimize your revenue.'
							: 'Discover world-class venues and event professionals for your next big moment.'}
					</p>
				</div>
				{isVendor && (
					<Link href="/dashboard/listings/new">
						<Button className="bg-brand-blue hover:bg-brand-blue-hover text-white shadow-xl shadow-brand-blue/10 h-14 px-8 rounded-2xl font-black text-base transition-all active:scale-95 group">
							<Plus className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
							Create New Listing
						</Button>
					</Link>
				)}
			</div>

			<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
				{vendorListings?.map((listing) => (
					<ListingCard key={listing.id} listing={listing} />
				))}
			</div>

			{vendorListings?.length === 0 && (
				<div className="bg-white rounded-[40px] border border-dashed border-gray-200 p-20 text-center">
					<div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
						<Store className="h-10 w-10 text-gray-300" />
					</div>
					<h2 className="text-2xl font-black text-gray-900 mb-2">
						{isVendor ? 'No listings found' : 'Nothing here yet'}
					</h2>
					<p className="text-gray-500 font-medium mb-8 max-w-sm mx-auto">
						{isVendor
							? 'Your marketplace is currently empty. Start growing your business by adding your first listing today.'
							: "We couldn't find any active listings matching your criteria. Check back later!"}
					</p>
					{isVendor && (
						<Link href="/dashboard/listings/new">
							<Button className="bg-brand-blue hover:bg-brand-blue-hover text-white shadow-xl shadow-brand-blue/10 h-14 px-10 rounded-2xl font-black">
								<Plus className="mr-2 h-5 w-5" />
								Launch Your First Listing
							</Button>
						</Link>
					)}
				</div>
			)}
		</div>
	);
}
