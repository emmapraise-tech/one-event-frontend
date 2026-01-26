import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listingService } from '@/services/listing.service';
import { CreateListingData, ListingType, ListingStatus } from '@/types/listing';

export function useListings() {
	const queryClient = useQueryClient();

	const {
		data: listings,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['listings'],
		queryFn: listingService.findAll,
	});

	const createListingMutation = useMutation({
		mutationFn: ({ data, vendorId }: { data: any; vendorId: string }) =>
			listingService.create(data, vendorId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['listings'] });
		},
	});

	const updateListingMutation = useMutation({
		mutationFn: ({
			id,
			data,
		}: {
			id: string;
			data: Partial<CreateListingData>;
		}) => listingService.update(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['listings'] });
		},
	});

	return {
		listings,
		isLoading,
		error,
		createListing: createListingMutation.mutate,
		isCreating: createListingMutation.isPending,
		updateListing: updateListingMutation.mutate,
		isUpdating: updateListingMutation.isPending,
	};
}

export function useListing(id: string) {
	return useQuery({
		queryKey: ['listing', id],
		queryFn: () => listingService.findOne(id),
		enabled: !!id,
	});
}

export function useListingBySlug(slug: string) {
	return useQuery({
		queryKey: ['listing', 'slug', slug],
		queryFn: () => listingService.findBySlug(slug),
		enabled: !!slug,
	});
}
