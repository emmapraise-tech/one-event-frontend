'use client';

import { useMyBookings } from '@/hooks/useMyBookings';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Loader2,
	Calendar,
	MapPin,
	X,
	Search,
	Filter,
	ArrowRight,
	Clock,
	CheckCircle2,
	AlertCircle,
} from 'lucide-react';
import { BookingStatus } from '@/types/booking';
import { format } from 'date-fns';
import { useCreatePayment } from '@/hooks/usePayments';
import { useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export default function BookingsPage() {
	const { bookings, isLoading, error, cancelBooking, isCancelling } =
		useMyBookings();
	const { user } = useAuth();
	const { createPayment, isCreating } = useCreatePayment();
	const [filter, setFilter] = useState<'ALL' | BookingStatus>('ALL');
	const [searchQuery, setSearchQuery] = useState('');

	const filteredBookings = bookings?.filter((booking) => {
		const matchesStatus = filter === 'ALL' || booking.status === filter;
		const matchesSearch =
			booking.listing?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			booking.id.toLowerCase().includes(searchQuery.toLowerCase());
		return matchesStatus && matchesSearch;
	});

	const handleCancel = (bookingId: string) => {
		if (confirm('Are you sure you want to cancel this booking?')) {
			cancelBooking(bookingId);
		}
	};

	const handlePayment = (bookingId: string) => {
		createPayment(
			{ bookingId, callbackUrl: window.location.origin + '/booking/confirmed' },
			{
				onSuccess: (response: any) => {
					if (response.paystackResponse?.authorization_url) {
						window.location.href = response.paystackResponse.authorization_url;
					}
				},
			},
		);
	};

	const getStatusColor = (status: BookingStatus) => {
		switch (status) {
			case BookingStatus.CONFIRMED:
				return 'bg-green-100 text-green-700 border-green-200';
			case BookingStatus.CANCELLED:
				return 'bg-red-100 text-red-700 border-red-200';
			case BookingStatus.PENDING:
				return 'bg-amber-100 text-amber-700 border-amber-200';
			case BookingStatus.COMPLETED:
				return 'bg-blue-100 text-blue-700 border-blue-200';
			default:
				return 'bg-neutral-100 text-neutral-700 border-neutral-200';
		}
	};

	const getStatusIcon = (status: BookingStatus) => {
		switch (status) {
			case BookingStatus.CONFIRMED:
				return <CheckCircle2 className="h-3 w-3 mr-1" />;
			case BookingStatus.CANCELLED:
				return <AlertCircle className="h-3 w-3 mr-1" />;
			case BookingStatus.PENDING:
				return <Clock className="h-3 w-3 mr-1" />;
			default:
				return null;
		}
	};

	if (isLoading) {
		return (
			<div className="flex h-[60vh] items-center justify-center">
				<div className="flex flex-col items-center gap-4">
					<Loader2 className="h-10 w-10 animate-spin text-brand-blue" />
					<p className="text-neutral-500 font-medium animate-pulse">
						Fetching your bookings...
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-8 pb-20">
			{/* Header section */}
			<div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
				<div className="animate-in fade-in slide-in-from-left-4 duration-500">
					<h1 className="text-3xl font-bold text-neutral-900 tracking-tight">
						My Bookings
					</h1>
					<p className="text-neutral-500 mt-1">
						Track and manage your venue reservations and payments
					</p>
				</div>

				<div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-right-4 duration-500">
					{(['ALL', ...Object.values(BookingStatus)] as const).map((s) => (
						<button
							key={s}
							onClick={() => setFilter(s)}
							className={cn(
								'px-4 py-2 rounded-full text-xs font-bold transition-all border whitespace-nowrap',
								filter === s
									? 'bg-brand-blue text-white border-brand-blue shadow-md shadow-blue-500/20 scale-105'
									: 'bg-white text-neutral-500 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50',
							)}
						>
							{s.charAt(0) + s.slice(1).toLowerCase().replace(/_/g, ' ')}
						</button>
					))}
				</div>
			</div>

			{/* Search and Filters */}
			<div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
				<div className="relative flex-1 group">
					<Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 group-focus-within:text-brand-blue transition-colors" />
					<Input
						placeholder="Search by venue name or booking ID..."
						className="pl-11 h-12 bg-white border-neutral-200 rounded-2xl focus:ring-2 focus:ring-brand-blue/10 transition-all"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
				<Button
					variant="outline"
					className="h-12 px-6 rounded-2xl border-neutral-200 text-neutral-600 gap-2 font-bold"
				>
					<Filter className="h-4 w-4" />
					Filters
				</Button>
			</div>

			{filteredBookings?.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-20 bg-white rounded-[40px] border border-neutral-100 shadow-sm animate-in zoom-in-95 duration-500">
					<div className="h-24 w-24 bg-neutral-50 rounded-full flex items-center justify-center mb-6">
						<Calendar className="h-10 w-10 text-neutral-300" />
					</div>
					<h3 className="text-xl font-bold text-neutral-900 mb-2">
						No bookings found
					</h3>
					<p className="text-neutral-500 max-w-xs text-center mb-8">
						{searchQuery || filter !== 'ALL'
							? "We couldn't find any bookings matching your current filters."
							: "You haven't made any bookings yet. Start exploring premium venues."}
					</p>
					<Link href="/listings">
						<Button className="bg-brand-blue hover:bg-brand-blue-hover text-white h-12 px-8 font-bold rounded-2xl shadow-lg shadow-blue-500/20">
							Browse Venues <ArrowRight className="ml-2 h-4 w-4" />
						</Button>
					</Link>
				</div>
			) : (
				<div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
					{filteredBookings?.map((booking) => (
						<Card
							key={booking.id}
							className="overflow-hidden border-neutral-100 shadow-md hover:shadow-xl transition-all duration-300 rounded-[32px] group"
						>
							<CardContent className="p-0">
								<div className="flex flex-col md:flex-row">
									{/* Image/Status Section */}
									<div className="md:w-64 h-48 md:h-auto bg-neutral-100 relative overflow-hidden shrink-0">
										<div className="absolute inset-0 bg-neutral-200 group-hover:scale-110 transition-transform duration-700" />
										<div className="absolute top-4 left-4 z-10">
											<Badge
												className={cn(
													'px-3 py-1.5 rounded-full border shadow-sm flex items-center font-bold text-[10px] uppercase tracking-wider',
													getStatusColor(booking.status),
												)}
											>
												{getStatusIcon(booking.status)}
												{booking.status.replace(/_/g, ' ')}
											</Badge>
										</div>
									</div>

									{/* Info Section */}
									<div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
										<div>
											<div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
												<div>
													<p className="text-[10px] font-bold text-brand-blue uppercase tracking-[0.2em] mb-1">
														Booking #{booking.id.slice(-8).toUpperCase()}
													</p>
													<h3 className="text-2xl font-bold text-neutral-900 group-hover:text-brand-blue transition-colors">
														{booking.listing?.name || 'Premium Venue'}
													</h3>
												</div>
												<div className="text-right">
													<p className="text-xs text-neutral-500 mb-1">
														Total Paid
													</p>
													<p className="text-2xl font-black text-neutral-900 tracking-tight">
														{booking.currency}{' '}
														{booking.totalAmount.toLocaleString()}
													</p>
												</div>
											</div>

											<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
												<div className="flex items-center gap-3">
													<div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
														<Calendar className="h-5 w-5" />
													</div>
													<div>
														<p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
															Date & Time
														</p>
														<p className="text-sm font-bold text-neutral-700">
															{format(
																new Date(booking.startDate),
																'MMM d, yyyy',
															)}
														</p>
													</div>
												</div>

												<div className="flex items-center gap-3">
													<div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
														<MapPin className="h-5 w-5" />
													</div>
													<div>
														<p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
															Location
														</p>
														<p className="text-sm font-bold text-neutral-700 truncate max-w-[150px]">
															{booking.listing?.city},{' '}
															{booking.listing?.state || 'Nigeria'}
														</p>
													</div>
												</div>

												<div className="flex items-center gap-3">
													<div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
														<CheckCircle2 className="h-5 w-5" />
													</div>
													<div>
														<p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
															Payment Status
														</p>
														<p className="text-sm font-bold text-neutral-700">
															{booking.fullPaymentPaid
																? 'Paid in Full'
																: booking.depositPaid
																	? 'Deposit Paid'
																	: 'Pending'}
														</p>
													</div>
												</div>
											</div>
										</div>

										<div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-neutral-100">
											<div className="flex flex-wrap items-center gap-4 w-full sm:w-auto justify-center sm:justify-start">
												<Button
													variant="ghost"
													className="text-neutral-500 hover:text-neutral-900 font-bold px-0 h-auto"
												>
													View Receipt
												</Button>
												<span className="h-4 w-px bg-neutral-200 hidden sm:block" />
												<Button
													variant="ghost"
													className="text-neutral-500 hover:text-neutral-900 font-bold px-0 h-auto"
												>
													Contact Host
												</Button>
											</div>

											<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto mt-4 sm:mt-0">
												{booking.status !== BookingStatus.CANCELLED &&
													booking.status !== BookingStatus.COMPLETED && (
														<Button
															variant="ghost"
															className="text-red-500 hover:text-red-600 hover:bg-red-50 font-bold rounded-xl px-6 w-full sm:w-auto"
															onClick={() => handleCancel(booking.id)}
															disabled={isCancelling}
														>
															Cancel
														</Button>
													)}

												{!booking.fullPaymentPaid &&
													booking.status === BookingStatus.CONFIRMED && (
														<Button
															className="bg-brand-blue hover:bg-brand-blue-hover text-white font-bold rounded-xl px-8 h-11 w-full sm:w-auto"
															onClick={() => handlePayment(booking.id)}
															disabled={isCreating}
														>
															{isCreating ? (
																<Loader2 className="animate-spin h-4 w-4" />
															) : (
																'Complete Payment'
															)}
														</Button>
													)}

												<Link
													href={`/dashboard/bookings/${booking.id}`}
													className="w-full sm:w-auto"
												>
													<Button className="bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-xl px-8 h-11 w-full relative sm:shrink-0 block sm:inline-block">
														Details
													</Button>
												</Link>
											</div>
										</div>
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
