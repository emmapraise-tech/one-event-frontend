import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bookingService } from '@/services/booking.service';

export function useVendorBookings(page = 1, limit = 10) {
	const queryClient = useQueryClient();

	const {
		data: paginatedData,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['vendor-bookings', page, limit],
		queryFn: () => bookingService.findAllForVendor(page, limit),
	});

	const bookings = paginatedData?.data || [];
	const meta = paginatedData?.meta;

	const cancelBookingMutation = useMutation({
		mutationFn: bookingService.cancel,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['vendor-bookings'] });
		},
	});

	return {
		bookings,
		meta,
		isLoading,
		error,
		cancelBooking: cancelBookingMutation.mutate,
		isCancelling: cancelBookingMutation.isPending,
	};
}
