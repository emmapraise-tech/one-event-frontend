import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bookingService } from '@/services/booking.service';

export function useAdminBookings(page = 1, limit = 10) {
	const queryClient = useQueryClient();

	const {
		data: paginatedData,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['admin-bookings', page, limit],
		queryFn: () => bookingService.findAll(page, limit),
	});

	const bookings = paginatedData?.data || [];
	const meta = paginatedData?.meta;

	// const createBookingMutation = useMutation({
	//     mutationFn: bookingService.create,
	//     onSuccess: () => {
	//         queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
	//     },
	// });

	const cancelBookingMutation = useMutation({
		mutationFn: bookingService.cancel,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
		},
	});

	return {
		bookings,
		meta,
		isLoading,
		error,
		// createBooking: createBookingMutation.mutate,
		// isCreating: createBookingMutation.isPending,
		cancelBooking: cancelBookingMutation.mutate,
		isCancelling: cancelBookingMutation.isPending,
	};
}
