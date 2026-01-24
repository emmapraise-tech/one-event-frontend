import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bookingService } from '@/services/booking.service';

export function useVendorBookings() {
	const queryClient = useQueryClient();

	const {
		data: bookings,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['vendor-bookings'],
		queryFn: bookingService.findAllForVendor,
	});

	const cancelBookingMutation = useMutation({
		mutationFn: bookingService.cancel,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['vendor-bookings'] });
		},
	});

	return {
		bookings,
		isLoading,
		error,
		cancelBooking: cancelBookingMutation.mutate,
		isCancelling: cancelBookingMutation.isPending,
	};
}
