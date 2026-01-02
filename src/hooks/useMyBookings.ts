import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingService } from '@/services/booking.service';
import {
  CreateBookingData,
  UpdateBookingData,
  CheckAvailabilityData,
} from '@/types/booking';

export function useMyBookings() {
  const queryClient = useQueryClient();

  const { data: bookings, isLoading, error } = useQuery({
    queryKey: ['bookings'],
    queryFn: bookingService.findAllMyBookings,
  });

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

export function useListingBookings(listingId: string) {
  return useQuery({
    queryKey: ['bookings', 'listing', listingId],
    queryFn: () => bookingService.findByListingId(listingId),
    enabled: !!listingId,
  });
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

