'use client';

import { Calendar, TrendingUp, AlertCircle, CreditCard } from 'lucide-react';
import { Booking } from './mockData';
import { isSameMonth, isAfter, startOfToday } from 'date-fns';

interface CalendarStatsProps {
	bookings: Booking[];
}

export function CalendarStats({ bookings }: CalendarStatsProps) {
	const upcomingEvents = bookings.filter(
		(b) => b.status === 'confirmed' && isAfter(b.date, startOfToday()),
	).length;
	const pendingRequests = bookings.filter((b) => b.status === 'pending').length;
	const monthlyRevenue = bookings
		.filter((b) => isSameMonth(b.date, new Date()) && b.status === 'confirmed')
		.reduce((sum, b) => sum + b.totalCost, 0);

	return (
		<div className="grid gap-4 md:grid-cols-3">
			<div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
				<div className="flex items-center gap-4">
					<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-blue-soft text-brand-blue">
						<Calendar className="h-6 w-6" />
					</div>
					<div>
						<p className="text-sm font-medium text-muted-foreground">
							Upcoming Events
						</p>
						<h3 className="text-2xl font-bold text-gray-900">
							{upcomingEvents}
						</h3>
					</div>
				</div>
				<div className="mt-4 flex items-center text-xs font-medium text-emerald-600">
					<TrendingUp className="mr-1 h-3 w-3" />
					<span>Active schedule</span>
				</div>
			</div>

			<div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
				<div className="flex items-center gap-4">
					<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-blue-soft text-brand-blue">
						<CreditCard className="h-6 w-6" />
					</div>
					<div>
						<p className="text-sm font-medium text-muted-foreground">
							Total Revenue (Month)
						</p>
						<h3 className="text-2xl font-bold text-gray-900">
							₦{monthlyRevenue.toLocaleString()}
						</h3>
					</div>
				</div>
				<div className="mt-4 flex items-center text-xs font-medium text-muted-foreground">
					<span>Target: ₦6,000,000</span>
				</div>
			</div>

			<div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
				<div className="flex items-center gap-4">
					<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
						<AlertCircle className="h-6 w-6" />
					</div>
					<div>
						<p className="text-sm font-medium text-muted-foreground">
							Pending Requests
						</p>
						<h3 className="text-2xl font-bold text-gray-900">
							{pendingRequests}
						</h3>
					</div>
				</div>
				<div className="mt-4 flex items-center text-xs font-medium text-orange-600">
					<span>Action required</span>
				</div>
			</div>
		</div>
	);
}
