import { useQuery } from '@tanstack/react-query';
import { bookingService } from '@/services/booking.service';
import { Booking } from '@/types/booking';

export function useBooking(id: string) {
	const {
		data: booking,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['booking', id],
		queryFn: () => bookingService.findOne(id),
		enabled: !!id,
	});

	return {
		booking,
		isLoading,
		error,
	};
}
