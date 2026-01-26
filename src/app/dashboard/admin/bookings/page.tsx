'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { ApiResponse } from '@/types/api';
import { Booking } from '@/types/booking';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Badge } from '@/components/ui/badge';
import { Loader2, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { BookingStatus } from '@/types/booking';

async function getAllBookings(): Promise<Booking[]> {
	const response = await api.get<ApiResponse<Booking[]>>('/admin/bookings');
	return response.data.data;
}

export default function AdminBookingsPage() {
	const {
		data: bookings,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['admin', 'bookings'],
		queryFn: getAllBookings,
	});

	if (isLoading) {
		return (
			<div className="flex h-full items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex h-full items-center justify-center text-destructive">
				Error loading bookings
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">All Bookings</h1>
				<p className="text-muted-foreground">
					View and manage all bookings in the system
				</p>
			</div>

			{bookings?.length === 0 ? (
				<EmptyState
					icon={<Calendar className="h-16 w-16" />}
					title="No bookings in the system"
					description="Bookings will appear here once customers start making reservations."
				/>
			) : (
				<div className="grid gap-4">
					{bookings?.map((booking) => (
						<Card key={booking.id}>
							<CardHeader>
								<div className="flex items-start justify-between">
									<div className="space-y-1">
										<CardTitle>
											{booking.listing?.name || 'Unknown Listing'}
										</CardTitle>
										<div className="flex items-center gap-2 text-sm text-muted-foreground">
											<Calendar className="h-4 w-4" />
											<span>
												{format(new Date(booking.bookingDate), 'PPP')}
											</span>
										</div>
										<p className="text-sm text-muted-foreground">
											Customer: {booking.customer?.firstName}{' '}
											{booking.customer?.lastName} ({booking.customer?.email})
										</p>
									</div>
									<Badge
										variant={
											booking.status === BookingStatus.CONFIRMED
												? 'default'
												: booking.status === BookingStatus.CANCELLED
													? 'destructive'
													: 'secondary'
										}
									>
										{booking.status}
									</Badge>
								</div>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-2 gap-4 text-sm">
									<div>
										<span className="text-muted-foreground">Total Amount:</span>
										<p className="font-semibold">
											{booking.currency} {booking.totalAmount.toLocaleString()}
										</p>
									</div>
									<div>
										<span className="text-muted-foreground">
											Payment Status:
										</span>
										<p className="font-semibold">
											{booking.fullPaymentPaid
												? 'Paid'
												: booking.depositPaid
													? 'Deposit Paid'
													: 'Pending'}
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
