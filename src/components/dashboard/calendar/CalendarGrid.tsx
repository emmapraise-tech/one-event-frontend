'use client';

import { useState } from 'react';
import {
	format,
	startOfMonth,
	endOfMonth,
	eachDayOfInterval,
	startOfWeek,
	endOfWeek,
	isSameMonth,
	isSameDay,
	addMonths,
	subMonths,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { bookings, Booking } from './mockData'; // We'll create this next

interface CalendarGridProps {
	onSelectBooking: (booking: Booking | null) => void;
	selectedBookingId?: string;
}

export function CalendarGrid({
	onSelectBooking,
	selectedBookingId,
}: CalendarGridProps) {
	const [currentDate, setCurrentDate] = useState(new Date(2023, 9, 1)); // Oct 2023 per design
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);

	const monthStart = startOfMonth(currentDate);
	const monthEnd = endOfMonth(monthStart);
	const startDate = startOfWeek(monthStart);
	const endDate = endOfWeek(monthEnd);

	const days = eachDayOfInterval({
		start: startDate,
		end: endDate,
	});

	const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

	const getDayBookings = (date: Date) => {
		return bookings.filter((booking) =>
			isSameDay(new Date(booking.date), date),
		);
	};

	return (
		<div className="flex flex-col h-full bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
			{/* Controls */}
			<div className="flex items-center justify-between p-4 border-b border-gray-100">
				<div className="flex items-center gap-2">
					<div className="flex items-center rounded-md border border-gray-200 bg-white shadow-sm">
						<Button
							variant="ghost"
							size="icon"
							className="h-8 w-8 hover:bg-gray-50"
							onClick={() => setCurrentDate(subMonths(currentDate, 1))}
						>
							<ChevronLeft className="h-4 w-4" />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							className="h-8 w-8 hover:bg-gray-50"
							onClick={() => setCurrentDate(addMonths(currentDate, 1))}
						>
							<ChevronRight className="h-4 w-4" />
						</Button>
					</div>
					<h2 className="text-lg font-bold text-gray-900 ml-2">
						{format(currentDate, 'MMMM yyyy')}
					</h2>
				</div>
				<div className="flex bg-gray-100 p-1 rounded-lg">
					<button className="px-3 py-1 text-sm font-medium bg-white text-gray-900 rounded-md shadow-sm">
						Month
					</button>
					<button className="px-3 py-1 text-sm font-medium text-gray-500 hover:text-gray-900">
						Week
					</button>
					<button className="px-3 py-1 text-sm font-medium text-gray-500 hover:text-gray-900">
						List
					</button>
				</div>
			</div>

			{/* Grid Header */}
			<div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50/50">
				{weekDays.map((day) => (
					<div
						key={day}
						className="py-3 text-center text-sm font-semibold text-gray-500"
					>
						{day}
					</div>
				))}
			</div>

			{/* Grid Body */}
			<div className="grid grid-cols-7 flex-1 auto-rows-fr bg-gray-100 gap-px">
				{days.map((day, dayIdx) => {
					const dayBookings = getDayBookings(day);
					const isCurrentMonth = isSameMonth(day, monthStart);
					// const isSelected = selectedDate && isSameDay(day, selectedDate);
					const isToday = isSameDay(day, new Date());

					return (
						<div
							key={day.toString()}
							className={cn(
								'min-h-[120px] bg-white p-2 transition-colors hover:bg-gray-50 relative group',
								!isCurrentMonth && 'bg-gray-50/30 text-gray-400',
							)}
							onClick={() => setSelectedDate(day)}
						>
							<div className="flex items-start justify-between">
								<span
									className={cn(
										'text-sm font-medium h-7 w-7 flex items-center justify-center rounded-full',
										isToday ? 'bg-primary text-white' : 'text-gray-700',
									)}
								>
									{format(day, 'd')}
								</span>
							</div>

							<div className="mt-2 space-y-1.5">
								{dayBookings.map((booking) => {
									const isSelected = selectedBookingId === booking.id;
									return (
										<div
											key={booking.id}
											onClick={(e) => {
												e.stopPropagation();
												onSelectBooking(booking);
											}}
											className={cn(
												'px-2 py-1.5 rounded-md border text-xs font-medium cursor-pointer transition-all shadow-sm',
												booking.type === 'wedding' &&
													'bg-blue-50 border-blue-100 text-blue-700 hover:bg-blue-100',
												booking.type === 'birthday' &&
													'bg-blue-50 border-blue-100 text-blue-700 hover:bg-blue-100', // Using blue for confirmed events per design
												booking.status === 'pending' &&
													'bg-orange-50 border-orange-100 text-orange-700 hover:bg-orange-100',
												booking.status === 'blocked' &&
													'bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200',
												isSelected && 'ring-2 ring-primary ring-offset-1',
											)}
										>
											<div className="font-bold truncate">{booking.title}</div>
											<div className="text-[10px] opacity-80 truncate">
												{booking.time}
											</div>
											{booking.location && (
												<div className="text-[10px] opacity-70 truncate mt-0.5">
													• {booking.location}
												</div>
											)}
										</div>
									);
								})}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
