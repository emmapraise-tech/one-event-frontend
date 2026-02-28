import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingService } from '@/services/booking.service';
import {
	CreateBookingData,
	UpdateBookingData,
	CheckAvailabilityData,
} from '@/types/booking';

export function useMyBookings(page = 1, limit = 10) {
	const queryClient = useQueryClient();

	const {
		data: paginatedData,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['bookings', page, limit],
		queryFn: () => bookingService.findAllMyBookings(page, limit),
	});

	const bookings = paginatedData?.data || [];
	const meta = paginatedData?.meta;

	const createBookingMutation = useMutation({
		mutationFn: bookingService.create,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['bookings'] });
		},
	});

	const cancelBookingMutation = useMutation({
		mutationFn: bookingService.cancel,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['bookings'] });
		},
	});

	return {
		bookings,
		meta,
		isLoading,
		error,
		createBooking: createBookingMutation.mutate,
		isCreating: createBookingMutation.isPending,
		cancelBooking: cancelBookingMutation.mutate,
		isCancelling: cancelBookingMutation.isPending,
	};
}

export function useBooking(id: string) {
	return useQuery({
		queryKey: ['booking', id],
		queryFn: () => bookingService.findOne(id),
		enabled: !!id,
	});
}

export function useListingBookings(listingId: string, page = 1, limit = 10) {
	const {
		data: paginatedData,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['bookings', 'listing', listingId, page, limit],
		queryFn: () => bookingService.findByListingId(listingId, page, limit),
		enabled: !!listingId,
	});

	return {
		bookings: paginatedData?.data || [],
		meta: paginatedData?.meta,
		isLoading,
		error,
	};
}

export function useCheckAvailability() {
	const queryClient = useQueryClient();

	const checkAvailabilityMutation = useMutation({
		mutationFn: (data: CheckAvailabilityData) =>
			bookingService.checkAvailability(data),
	});

	return {
		checkAvailability: checkAvailabilityMutation.mutate,
		isChecking: checkAvailabilityMutation.isPending,
		availabilityResult: checkAvailabilityMutation.data,
		availabilityError: checkAvailabilityMutation.error,
	};
}
