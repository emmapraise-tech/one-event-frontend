'use client';

import { useState } from 'react';
import { useListings } from '@/hooks/useListings';
import { useVendors } from '@/hooks/useVendors';
import { useAuth } from '@/hooks/useAuth';
import { ListingCard } from '@/components/listings/listing-card';
import { CreateListingForm } from '@/components/listings/create-listing-form';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Loader2, Plus, Store } from 'lucide-react';
import { UserType } from '@/types/auth';

export default function ListingsPage() {
	const { user } = useAuth();
	const { vendor } = useVendors();
	const { listings, isLoading, error } = useListings();
	const [isCreateOpen, setIsCreateOpen] = useState(false);

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
				<Loader2 className="h-8 w-8 animate-spin" />
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
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						{isVendor ? 'My Listings' : 'Browse Services'}
					</h1>
					<p className="text-muted-foreground">
						{isVendor
							? 'Manage your service listings'
							: 'Find the perfect service providers for your event.'}
					</p>
				</div>
				{isVendor && (
					<Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
						<DialogTrigger asChild>
							<Button>
								<Plus className="mr-2 h-4 w-4" />
								Create Listing
							</Button>
						</DialogTrigger>
						<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
							<DialogHeader>
								<DialogTitle>Create New Listing</DialogTitle>
								<DialogDescription>
									Add a new service listing to your vendor profile
								</DialogDescription>
							</DialogHeader>
							<CreateListingForm onSuccess={() => setIsCreateOpen(false)} />
						</DialogContent>
					</Dialog>
				)}
			</div>

			<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{vendorListings?.map((listing) => (
					<ListingCard key={listing.id} listing={listing} />
				))}
			</div>

			{vendorListings?.length === 0 && (
				<EmptyState
					icon={<Store className="h-16 w-16" />}
					title={isVendor ? 'No listings yet' : 'No listings available'}
					description={
						isVendor
							? 'Get started by creating your first service listing to attract customers.'
							: 'There are no listings available at the moment. Please check back later.'
					}
					action={
						isVendor ? (
							<Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
								<DialogTrigger asChild>
									<Button>
										<Plus className="mr-2 h-4 w-4" />
										Create Your First Listing
									</Button>
								</DialogTrigger>
								<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
									<DialogHeader>
										<DialogTitle>Create New Listing</DialogTitle>
										<DialogDescription>
											Add a new service listing to your vendor profile
										</DialogDescription>
									</DialogHeader>
									<CreateListingForm onSuccess={() => setIsCreateOpen(false)} />
								</DialogContent>
							</Dialog>
						) : null
					}
				/>
			)}
		</div>
	);
}
