import { useQuery } from '@tanstack/react-query';
import { vendorService } from '@/services/vendor.service';
import { useAuth } from './useAuth';
import { useQueryClient } from '@tanstack/react-query';

export function useVendorListings(page = 1, limit = 10) {
	const { user } = useAuth();
	const queryClient = useQueryClient();

	const {
		data: paginatedData,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['my-listings', page, limit],
		queryFn: () => vendorService.getMyListings(page, limit),
		enabled: !!user,
	});

	return {
		listings: paginatedData?.data || [],
		meta: paginatedData?.meta,
		isLoading,
		error,
	};
}
