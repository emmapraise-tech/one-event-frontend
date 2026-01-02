import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {bookingService} from "@/services/booking.service";

export function useAdminBookings() {
    const queryClient = useQueryClient();

    const { data: bookings, isLoading, error } = useQuery({
        queryKey: ['admin-bookings'],
        queryFn: bookingService.findAll,
    });

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
        isLoading,
        error,
        // createBooking: createBookingMutation.mutate,
        // isCreating: createBookingMutation.isPending,
        cancelBooking: cancelBookingMutation.mutate,
        isCancelling: cancelBookingMutation.isPending,
    };
}