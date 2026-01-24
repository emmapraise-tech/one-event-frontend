'use client';

import { useState } from 'react';
import { Booking, BookingStatus } from '@/types/booking';
import { format } from 'date-fns';
import {
	Search,
	Filter,
	MoreVertical,
	Calendar as CalendarIcon,
	CheckCircle2,
	XCircle,
	Clock,
	Eye,
	Download,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

interface BookingsListProps {
	bookings: Booking[];
	onCancel: (id: string) => void;
	isCancelling: boolean;
}

export function BookingsList({
	bookings,
	onCancel,
	isCancelling,
}: BookingsListProps) {
	const [filterStatus, setFilterStatus] = useState<BookingStatus | 'ALL'>(
		'ALL',
	);
	const [searchQuery, setSearchQuery] = useState('');

	const filteredBookings = bookings.filter((booking) => {
		const matchesStatus =
			filterStatus === 'ALL' || booking.status === filterStatus;
		const matchesSearch =
			booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
			booking.listing?.title
				.toLowerCase()
				.includes(searchQuery.toLowerCase()) ||
			booking.customer?.firstName
				?.toLowerCase()
				.includes(searchQuery.toLowerCase()) ||
			booking.customer?.lastName
				?.toLowerCase()
				.includes(searchQuery.toLowerCase()) ||
			booking.customer?.email.toLowerCase().includes(searchQuery.toLowerCase());

		return matchesStatus && matchesSearch;
	});

	// Mock avatar colors or function
	const getInitials = (first?: string, last?: string) => {
		return `${first?.[0] || ''}${last?.[0] || ''}`.toUpperCase();
	};

	const statusColors: Record<BookingStatus, string> = {
		[BookingStatus.CONFIRMED]: 'bg-green-100 text-green-700 hover:bg-green-100',
		[BookingStatus.PENDING]:
			'bg-orange-100 text-orange-700 hover:bg-orange-100',
		[BookingStatus.CANCELLED]: 'bg-red-100 text-red-700 hover:bg-red-100',
		[BookingStatus.COMPLETED]: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
	};

	const paymentStatusColors = (booking: Booking) => {
		if (booking.fullPaymentPaid) return 'bg-green-100 text-green-700';
		if (booking.depositPaid) return 'bg-yellow-100 text-yellow-700';
		if (booking.status === BookingStatus.CANCELLED)
			return 'bg-red-100 text-red-700'; // Refunded logic?
		return 'bg-gray-100 text-gray-700';
	};

	const paymentStatusText = (booking: Booking) => {
		if (booking.fullPaymentPaid) return 'Paid';
		if (booking.depositPaid) return 'Deposit';
		if (booking.status === BookingStatus.CANCELLED) return 'Refunded'; // Mock logic
		return 'Pending';
	};

	return (
		<div className="space-y-6">
			{/* Filters */}
			<div className="flex flex-col sm:flex-row gap-4">
				<div className="relative flex-1">
					<Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Search by ID, Customer, or Center"
						className="pl-9 bg-background border-border/60"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
				<div className="flex gap-2">
					<Button
						variant="outline"
						className="w-[180px] justify-start text-left font-normal text-muted-foreground border-border/60"
					>
						<CalendarIcon className="mr-2 h-4 w-4" />
						Select dates
					</Button>
					<Button variant="outline" className="border-border/60">
						<Filter className="mr-2 h-4 w-4" />
						More Filters
					</Button>
				</div>
			</div>

			{/* Tabs */}
			<div className="flex gap-2 pb-2 overflow-x-auto">
				{(
					[
						'ALL',
						BookingStatus.CONFIRMED,
						BookingStatus.PENDING,
						BookingStatus.CANCELLED,
					] as const
				).map((status) => (
					<button
						key={status}
						onClick={() => setFilterStatus(status)}
						className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
							filterStatus === status
								? 'bg-primary text-primary-foreground'
								: 'bg-white text-muted-foreground hover:bg-gray-100 border border-border/60'
						}`}
					>
						{status === 'ALL'
							? 'All Bookings'
							: status.charAt(0) + status.slice(1).toLowerCase()}
					</button>
				))}
			</div>

			{/* Table */}
			<div className="border border-border/60 rounded-xl bg-white overflow-hidden shadow-sm">
				<div className="overflow-x-auto">
					<table className="w-full text-sm text-left">
						<thead className="text-xs text-muted-foreground uppercase bg-gray-50/50 border-b border-border/60">
							<tr>
								<th className="px-6 py-4 font-semibold tracking-wider">ID</th>
								<th className="px-6 py-4 font-semibold tracking-wider">
									Customer
								</th>
								<th className="px-6 py-4 font-semibold tracking-wider">
									Event Center
								</th>
								<th className="px-6 py-4 font-semibold tracking-wider">
									Date & Time
								</th>
								<th className="px-6 py-4 font-semibold tracking-wider">
									Amount
								</th>
								<th className="px-6 py-4 font-semibold tracking-wider">
									Payment
								</th>
								<th className="px-6 py-4 font-semibold tracking-wider">
									Status
								</th>
								<th className="px-6 py-4 font-semibold tracking-wider text-right">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100">
							{filteredBookings.length === 0 ? (
								<tr>
									<td
										colSpan={8}
										className="px-6 py-12 text-center text-muted-foreground"
									>
										No bookings found.
									</td>
								</tr>
							) : (
								filteredBookings.map((booking) => (
									<tr
										key={booking.id}
										className="hover:bg-gray-50/50 transition-colors"
									>
										<td className="px-6 py-4 font-medium text-gray-900">
											#{booking.id.slice(-7).toUpperCase()}
										</td>
										<td className="px-6 py-4">
											<div className="flex items-center gap-3">
												<Avatar className="h-9 w-9 border border-border/60">
													<AvatarImage src="" />
													<AvatarFallback className="bg-primary/5 text-primary text-xs font-medium">
														{getInitials(
															booking.customer?.firstName,
															booking.customer?.lastName,
														)}
													</AvatarFallback>
												</Avatar>
												<div>
													<div className="font-medium text-gray-900">
														{booking.customer?.firstName}{' '}
														{booking.customer?.lastName}
													</div>
													<div className="text-xs text-muted-foreground">
														{booking.customer?.email}
													</div>
												</div>
											</div>
										</td>
										<td className="px-6 py-4">
											<div className="font-medium text-gray-900">
												{booking.listing?.title}
											</div>
										</td>
										<td className="px-6 py-4">
											<div className="flex flex-col">
												<span className="font-medium text-gray-900">
													{format(
														new Date(booking.bookingDate),
														'dd MMM, yyyy',
													)}
												</span>
												{booking.startTime && (
													<span className="text-xs text-muted-foreground mt-0.5">
														{format(new Date(booking.startTime), 'p')}
													</span>
												)}
											</div>
										</td>
										<td className="px-6 py-4 font-medium text-gray-900">
											{booking.currency} {booking.totalAmount.toLocaleString()}
										</td>
										<td className="px-6 py-4">
											<Badge
												variant="secondary"
												className={`${paymentStatusColors(booking)} border-0 px-2 py-0.5 rounded-md font-medium`}
											>
												{paymentStatusText(booking)}
											</Badge>
										</td>
										<td className="px-6 py-4">
											<div
												className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
													booking.status === BookingStatus.CONFIRMED
														? 'bg-emerald-50 text-emerald-700 border-emerald-200'
														: booking.status === BookingStatus.PENDING
															? 'bg-amber-50 text-amber-700 border-amber-200'
															: booking.status === BookingStatus.CANCELLED
																? 'bg-rose-50 text-rose-700 border-rose-200'
																: 'bg-blue-50 text-blue-700 border-blue-200'
												}`}
											>
												<span
													className={`h-1.5 w-1.5 rounded-full ${
														booking.status === BookingStatus.CONFIRMED
															? 'bg-emerald-600'
															: booking.status === BookingStatus.PENDING
																? 'bg-amber-600'
																: booking.status === BookingStatus.CANCELLED
																	? 'bg-rose-600'
																	: 'bg-blue-600'
													}`}
												/>
												{booking.status.charAt(0) +
													booking.status.slice(1).toLowerCase()}
											</div>
										</td>
										<td className="px-6 py-4 text-right">
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														variant="ghost"
														size="icon"
														className="h-8 w-8 text-muted-foreground hover:text-foreground"
													>
														<MoreVertical className="h-4 w-4" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end" className="w-48">
													<DropdownMenuItem asChild>
														<Link href={`/dashboard/bookings/${booking.id}`}>
															<Eye className="mr-2 h-4 w-4" />
															View Details
														</Link>
													</DropdownMenuItem>
													<DropdownMenuItem>
														<Download className="mr-2 h-4 w-4" />
														Download Invoice
													</DropdownMenuItem>
													{booking.status === BookingStatus.PENDING && (
														<DropdownMenuItem
															className="text-red-600 focus:text-red-600"
															onClick={() => onCancel(booking.id)}
															disabled={isCancelling}
														>
															<XCircle className="mr-2 h-4 w-4" />
															Cancel Booking
														</DropdownMenuItem>
													)}
												</DropdownMenuContent>
											</DropdownMenu>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
