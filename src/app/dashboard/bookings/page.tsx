'use client';

import { useVendorBookings } from '@/hooks/useVendorBookings';
import { BookingsStats } from '@/components/dashboard/bookings/BookingsStats';
import { BookingsList } from '@/components/dashboard/bookings/BookingsList';
import { Button } from '@/components/ui/button';
import { Plus, Bell } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { BookingStatus } from '@/types/booking';
import { isAfter, isBefore, addDays } from 'date-fns';

export default function BookingsPage() {
	const { bookings, isLoading, error, cancelBooking, isCancelling } =
		useVendorBookings();

	const handleCancel = (bookingId: string) => {
		if (confirm('Are you sure you want to cancel this booking?')) {
			cancelBooking(bookingId);
		}
	};

	// Calculate stats
	const stats = {
		totalRevenue:
			bookings?.reduce((acc, booking) => {
				if (
					booking.status === BookingStatus.CONFIRMED ||
					booking.status === BookingStatus.COMPLETED
				) {
					return acc + booking.totalAmount;
				}
				return acc;
			}, 0) || 0,
		pendingRequests:
			bookings?.filter((b) => b.status === BookingStatus.PENDING).length || 0,
		upcomingEvents:
			bookings?.filter((b) => {
				const date = new Date(b.bookingDate);
				const now = new Date();
				const nextWeek = addDays(now, 7);
				return isAfter(date, now) && isBefore(date, nextWeek);
			}).length || 0,
	};

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
		<div className="space-y-8 p-8">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="space-y-1">
					<h1 className="text-2xl font-bold tracking-tight">
						Bookings Management
					</h1>
					<p className="text-muted-foreground">
						Manage and track all event center bookings across Nigeria
					</p>
				</div>
				<div className="flex items-center gap-4">
					<Button variant="outline" size="icon" className="rounded-full">
						<Bell className="h-4 w-4" />
					</Button>
					<Button className="bg-blue-600 hover:bg-blue-700">
						<Plus className="mr-2 h-4 w-4" />
						Create New Booking
					</Button>
				</div>
			</div>

			{/* Stats */}
			<BookingsStats {...stats} />

			{/* List */}
			<BookingsList
				bookings={bookings || []}
				onCancel={handleCancel}
				isCancelling={isCancelling}
			/>
		</div>
	);
}
