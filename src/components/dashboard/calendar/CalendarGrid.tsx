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
import { Booking } from './mockData';
interface CalendarGridProps {
	bookings: Booking[];
	onSelectBooking: (booking: Booking | null) => void;
	selectedBookingId?: string;
}

export function CalendarGrid({
	bookings,
	onSelectBooking,
	selectedBookingId,
}: CalendarGridProps) {
	const [currentDate, setCurrentDate] = useState(new Date());
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const [view, setView] = useState<'month' | 'week' | 'list'>('month');

	const monthStart = startOfMonth(currentDate);
	const monthEnd = endOfMonth(monthStart);
	const startDate = startOfWeek(monthStart);
	const endDate = endOfWeek(monthEnd);

	const weekStart = startOfWeek(currentDate);
	const weekEnd = endOfWeek(currentDate);

	const days =
		view === 'week'
			? eachDayOfInterval({ start: weekStart, end: weekEnd })
			: eachDayOfInterval({ start: startDate, end: endDate });

	const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

	const getDayBookings = (date: Date) => {
		return bookings.filter((booking) =>
			isSameDay(new Date(booking.date), date),
		);
	};

	const sortedBookings = [...bookings].sort(
		(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
	);

	const listBookings = sortedBookings.filter((b) =>
		isSameMonth(b.date, monthStart),
	);

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
							onClick={() =>
								setCurrentDate(
									view === 'month'
										? subMonths(currentDate, 1)
										: subMonths(currentDate, 1),
								)
							}
						>
							<ChevronLeft className="h-4 w-4" />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							className="h-8 w-8 hover:bg-gray-50"
							onClick={() =>
								setCurrentDate(
									view === 'month'
										? addMonths(currentDate, 1)
										: addMonths(currentDate, 1),
								)
							}
						>
							<ChevronRight className="h-4 w-4" />
						</Button>
					</div>
					<h2 className="text-lg font-bold text-gray-900 ml-2">
						{format(currentDate, 'MMMM yyyy')}
					</h2>
				</div>
				<div className="flex bg-gray-100 p-1 rounded-lg">
					<button
						onClick={() => setView('month')}
						className={cn(
							'px-3 py-1 text-sm font-medium rounded-md transition-all',
							view === 'month'
								? 'bg-white text-gray-900 shadow-sm'
								: 'text-gray-500 hover:text-gray-900',
						)}
					>
						Month
					</button>
					<button
						onClick={() => setView('week')}
						className={cn(
							'px-3 py-1 text-sm font-medium rounded-md transition-all',
							view === 'week'
								? 'bg-white text-gray-900 shadow-sm'
								: 'text-gray-500 hover:text-gray-900',
						)}
					>
						Week
					</button>
					<button
						onClick={() => setView('list')}
						className={cn(
							'px-3 py-1 text-sm font-medium rounded-md transition-all',
							view === 'list'
								? 'bg-white text-gray-900 shadow-sm'
								: 'text-gray-500 hover:text-gray-900',
						)}
					>
						List
					</button>
				</div>
			</div>

			{view !== 'list' && (
				<>
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
												isToday ? 'bg-brand-blue text-white' : 'text-gray-700',
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
															'bg-brand-blue-soft border-blue-100 text-brand-blue hover:bg-blue-100',
														booking.type === 'birthday' &&
															'bg-purple-50 border-purple-100 text-purple-700 hover:bg-purple-100',
														booking.status === 'pending' &&
															'bg-orange-50 border-orange-100 text-orange-700 hover:bg-orange-100',
														booking.status === 'blocked' &&
															'bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200',
														isSelected &&
															'ring-2 ring-brand-blue ring-offset-1',
													)}
												>
													<div className="font-bold truncate">
														{booking.title}
													</div>
													<div className="text-[10px] opacity-80 truncate">
														{booking.time}
													</div>
												</div>
											);
										})}
									</div>
								</div>
							);
						})}
					</div>
				</>
			)}

			{view === 'list' && (
				<div className="flex-1 overflow-y-auto bg-white">
					{listBookings.length === 0 ? (
						<div className="p-20 text-center">
							<p className="text-gray-400 font-medium">
								No bookings found for this month
							</p>
						</div>
					) : (
						<div className="divide-y divide-gray-100">
							{listBookings.map((booking) => (
								<div
									key={booking.id}
									onClick={() => onSelectBooking(booking)}
									className={cn(
										'p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors',
										selectedBookingId === booking.id && 'bg-brand-blue-soft/50',
									)}
								>
									<div className="flex items-center gap-4">
										<div className="h-10 w-10 rounded-lg bg-gray-100 flex flex-col items-center justify-center shrink-0">
											<span className="text-[10px] uppercase font-bold text-gray-500">
												{format(new Date(booking.date), 'MMM')}
											</span>
											<span className="text-sm font-black text-gray-900 leading-none">
												{format(new Date(booking.date), 'dd')}
											</span>
										</div>
										<div>
											<p className="font-bold text-gray-900">{booking.title}</p>
											<p className="text-xs text-gray-500">
												{booking.time} • {booking.location || 'No location'}
											</p>
										</div>
									</div>
									<div className="flex items-center gap-3">
										<span
											className={cn(
												'px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider',
												booking.status === 'confirmed'
													? 'bg-green-100 text-green-700'
													: 'bg-amber-100 text-amber-700',
											)}
										>
											{booking.status}
										</span>
										<ChevronRight className="h-4 w-4 text-gray-300" />
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			)}
		</div>
	);
}
