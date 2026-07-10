import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '@/services/review.service';
import { CreateReviewData, UpdateReviewData } from '@/types/review';

export function useReviews(filters?: { listingId?: string }) {
	return useQuery({
		queryKey: ['reviews', filters],
		queryFn: () => reviewService.findAll(filters),
		enabled: !!filters,
	});
}

export function useCreateReview() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateReviewData) => reviewService.create(data),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ['reviews'] });
			queryClient.invalidateQueries({ queryKey: ['booking', variables.bookingId] });
			queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
			queryClient.invalidateQueries({ queryKey: ['listings'] });
			queryClient.invalidateQueries({ queryKey: ['listing'] });
		},
	});
}

export function useUpdateReview(bookingId?: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateReviewData }) =>
			reviewService.update(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['reviews'] });
			if (bookingId) {
				queryClient.invalidateQueries({ queryKey: ['booking', bookingId] });
			}
			queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
			queryClient.invalidateQueries({ queryKey: ['listings'] });
			queryClient.invalidateQueries({ queryKey: ['listing'] });
		},
	});
}

export function useDeleteReview(bookingId?: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => reviewService.remove(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['reviews'] });
			if (bookingId) {
				queryClient.invalidateQueries({ queryKey: ['booking', bookingId] });
			}
			queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
			queryClient.invalidateQueries({ queryKey: ['listings'] });
			queryClient.invalidateQueries({ queryKey: ['listing'] });
		},
	});
}
