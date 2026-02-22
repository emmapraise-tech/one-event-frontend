'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { bookingService } from '@/services/booking.service';
import { useAuth } from '@/hooks/useAuth';
import { CalendarGrid } from '@/components/dashboard/calendar/CalendarGrid';
import { CalendarHeader } from '@/components/dashboard/calendar/CalendarHeader';
import { CalendarStats } from '@/components/dashboard/calendar/CalendarStats';
import { BookingDetailsSidebar } from '@/components/dashboard/calendar/BookingDetailsSidebar';
import { Booking as CalendarBooking } from '@/components/dashboard/calendar/mockData';
import { BookingStatus } from '@/types/booking';
import { Loader2 } from 'lucide-react';

export default function CalendarPage() {
	const { user } = useAuth();
	const [selectedBooking, setSelectedBooking] =
		useState<CalendarBooking | null>(null);

	const { data: apiBookings, isLoading } = useQuery({
		queryKey: ['bookings', 'calendar', user?.type],
		queryFn: () =>
			user?.type === 'ADMIN'
				? bookingService.findAll()
				: bookingService.findAllForVendor(),
		enabled: !!user,
	});

	// Map API bookings to Calendar format
	const mappedBookings: CalendarBooking[] = (apiBookings || []).map((b) => ({
		id: b.id,
		title: b.listing?.name || 'Event Booking',
		date: new Date(b.startDate),
		time: b.endDate
			? `${new Date(b.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(b.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
			: new Date(b.startDate).toLocaleTimeString([], {
					hour: '2-digit',
					minute: '2-digit',
				}),
		location: b.listing?.city || 'Unknown',
		type: (b.listing?.type?.toLowerCase() as any) || 'other',
		status:
			b.status === BookingStatus.CONFIRMED
				? 'confirmed'
				: b.status === BookingStatus.PENDING
					? 'pending'
					: 'inquiry',
		clientName: b.customer
			? `${b.customer.firstName} ${b.customer.lastName}`
			: 'Guest',
		totalCost: b.totalAmount,
		paidAmount: b.fullPaymentPaid
			? b.totalAmount
			: b.depositPaid
				? b.depositAmount || 0
				: 0,
	}));

	if (isLoading) {
		return (
			<div className="flex h-[60vh] items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	return (
		<div className="flex h-[calc(100vh-64px)] overflow-hidden">
			{/* Main Content Area */}
			<div className="flex-1 flex flex-col h-full overflow-hidden">
				<div className="p-4 sm:p-6 space-y-4 sm:space-y-6 flex-1 overflow-y-auto no-scrollbar">
					<CalendarHeader />
					<CalendarStats bookings={mappedBookings} />

					{/* Grow grid to fill remaining space */}
					<div className="flex-1 pb-6 min-h-[500px] overflow-x-auto w-full">
						<div className="min-w-[700px] h-full">
							<CalendarGrid
								bookings={mappedBookings}
								onSelectBooking={setSelectedBooking}
								selectedBookingId={selectedBooking?.id}
							/>
						</div>
					</div>
				</div>
			</div>

			{/* Right Sidebar - Conditional or Responsive */}
			{selectedBooking && (
				<div className="hidden lg:block h-full border-l border-gray-100">
					<BookingDetailsSidebar
						booking={selectedBooking}
						onClose={() => setSelectedBooking(null)}
					/>
				</div>
			)}
		</div>
	);
}
