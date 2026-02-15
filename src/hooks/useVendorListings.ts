import { useQuery } from "@tanstack/react-query";
import { vendorService } from "@/services/vendor.service";
import { useAuth } from "./useAuth";
import { useQueryClient } from "@tanstack/react-query";

export function useVendorListings() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { data: listings, isLoading, error } = useQuery({
		queryKey: ['my-listings'],
		queryFn: () => vendorService.getMyListings(),
        enabled: !!user,
	});

    return { listings, isLoading, error };
}