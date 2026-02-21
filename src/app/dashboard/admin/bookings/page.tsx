'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { ApiResponse } from '@/types/api';
import { Booking, BookingStatus } from '@/types/booking';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Badge } from '@/components/ui/badge';
import {
	Loader2,
	Calendar,
	Shield,
	CreditCard,
	User,
	Store,
	ArrowUpRight,
} from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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
			<div className="flex h-[60vh] items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
			</div>
		);
	}

	return (
		<div className="space-y-8 animate-in fade-in duration-500">
			{/* Admin Header */}
			<div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
				<div>
					<div className="flex items-center gap-2 mb-2">
						<div className="h-6 w-6 rounded-full bg-brand-blue-soft flex items-center justify-center">
							<Shield className="h-3 w-3 text-brand-blue" />
						</div>
						<span className="text-[10px] font-bold text-brand-blue uppercase tracking-widest">
							Financial Oversight
						</span>
					</div>
					<h1 className="text-3xl font-black text-neutral-900 tracking-tight">
						Bookings
					</h1>
					<p className="text-neutral-500 mt-1 font-medium">
						Monitor all transactions and reservations across the entire
						platform.
					</p>
				</div>
				<div className="bg-white px-6 py-3 rounded-2xl shadow-soft border border-neutral-100 flex items-center gap-4">
					<div className="h-10 w-10 rounded-full bg-brand-blue-soft flex items-center justify-center text-brand-blue">
						<CreditCard className="h-5 w-5" />
					</div>
					<div>
						<p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
							Total Volume
						</p>
						<p className="text-xl font-black text-neutral-900">
							₦
							{bookings
								?.reduce((acc, b) => acc + (b.totalAmount || 0), 0)
								.toLocaleString() || 0}
						</p>
					</div>
				</div>
			</div>

			{bookings?.length === 0 ? (
				<div className="bg-white rounded-[40px] border border-neutral-100 p-20 text-center shadow-soft">
					<div className="h-20 w-20 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-6">
						<Calendar className="h-10 w-10 text-neutral-200" />
					</div>
					<h3 className="text-xl font-bold text-neutral-900 mb-2">
						No bookings yet
					</h3>
					<p className="text-neutral-500 max-w-xs mx-auto">
						Platform transaction history will appear here once customers book
						venues.
					</p>
				</div>
			) : (
				<div className="grid gap-4">
					{bookings?.map((booking) => (
						<Card
							key={booking.id}
							className="group border-none shadow-soft rounded-[32px] overflow-hidden bg-white hover:shadow-xl transition-all duration-300"
						>
							<CardContent className="p-8">
								<div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center">
									{/* Status & Date */}
									<div className="flex flex-col items-center justify-center w-full lg:w-32 h-32 rounded-[24px] bg-neutral-50 shrink-0 border border-neutral-100 group-hover:bg-brand-blue-soft group-hover:border-blue-100 transition-colors">
										<p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">
											{format(new Date(booking.startDate), 'MMM')}
										</p>
										<p className="text-3xl font-black text-neutral-900 group-hover:text-brand-blue transition-colors">
											{format(new Date(booking.startDate), 'dd')}
										</p>
										<Badge
											className={cn(
												'mt-2 border-none font-bold text-[10px] uppercase',
												booking.status === BookingStatus.CONFIRMED
													? 'bg-emerald-100 text-emerald-700'
													: booking.status === BookingStatus.CANCELLED
														? 'bg-red-100 text-red-700'
														: 'bg-amber-100 text-amber-700',
											)}
										>
											{booking.status}
										</Badge>
									</div>

									{/* Booking Details */}
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2 mb-2">
											<span className="text-[10px] font-bold text-brand-blue bg-brand-blue-soft px-2 py-0.5 rounded uppercase tracking-wider">
												Ref: {booking.id.slice(-8).toUpperCase()}
											</span>
											<span className="text-xs text-neutral-400 font-medium">
												Booked {format(new Date(booking.createdAt), 'PPP')}
											</span>
										</div>
										<h3 className="text-xl font-black text-neutral-900 mb-4 group-hover:text-brand-blue transition-colors">
											{booking.listing?.name || 'Unknown Listing'}
										</h3>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											<div className="flex items-center gap-3">
												<div className="h-10 w-10 rounded-xl bg-neutral-50 flex items-center justify-center shrink-0">
													<User className="h-4 w-4 text-neutral-400" />
												</div>
												<div>
													<p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-none mb-1">
														Customer
													</p>
													<p className="text-sm font-bold text-neutral-900 truncate">
														{booking.customer?.firstName}{' '}
														{booking.customer?.lastName}
													</p>
													<p className="text-xs text-neutral-500 truncate">
														{booking.customer?.email}
													</p>
												</div>
											</div>
											<div className="flex items-center gap-3">
												<div className="h-10 w-10 rounded-xl bg-neutral-50 flex items-center justify-center shrink-0">
													<Store className="h-4 w-4 text-neutral-400" />
												</div>
												<div>
													<p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-none mb-1">
														Vendor
													</p>
													<p className="text-sm font-bold text-neutral-900 truncate">
														{booking.listing?.vendor?.businessName ||
															'Unknown Vendor'}
													</p>
													<p className="text-xs text-neutral-500">
														Merchant Payout Pending
													</p>
												</div>
											</div>
										</div>
									</div>

									{/* Pricing & Actions */}
									<div className="w-full lg:w-auto flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-4 lg:pl-8 lg:border-l border-neutral-100">
										<div className="text-right">
											<p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-none mb-1">
												Revenue
											</p>
											<p className="text-2xl font-black text-brand-blue leading-none">
												{booking.currency}{' '}
												{booking.totalAmount.toLocaleString()}
											</p>
											<div className="mt-2 flex items-center justify-end gap-1.5 font-bold text-[10px] uppercase">
												{booking.fullPaymentPaid ? (
													<span className="text-emerald-600">
														Full Payment Paid
													</span>
												) : (
													<span className="text-amber-600">
														Payment Pending
													</span>
												)}
											</div>
										</div>
										<Link href={`/dashboard/bookings/${booking.id}`}>
											<Button className="bg-neutral-900 hover:bg-black text-white h-11 px-6 rounded-xl font-bold gap-2 shadow-lg shadow-black/5">
												Inspect
												<ArrowUpRight className="h-4 w-4" />
											</Button>
										</Link>
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

function cn(...inputs: any[]) {
	return inputs.filter(Boolean).join(' ');
}
