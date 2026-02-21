'use client';

import { useBooking } from '@/hooks/useBooking';
import { useVendorBookings } from '@/hooks/useVendorBookings';
import { useMyBookings } from '@/hooks/useMyBookings';
import { useAuth } from '@/hooks/useAuth';
import { UserType } from '@/types/auth';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BookingStatus } from '@/types/booking';
import { format } from 'date-fns';
import {
	ArrowLeft,
	Calendar,
	MapPin,
	Clock,
	CreditCard,
	Mail,
	Phone,
	User,
	Download,
	XCircle,
	CheckCircle2,
	MoreVertical,
	Building2,
	Receipt,
	Wifi,
	Wind,
	Car,
	Users,
	SquareStack,
	Navigation,
	ArrowUpRight,
	Check,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { use, useState } from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface PageProps {
	params: Promise<{ id: string }>;
}

export default function BookingDetailsPage({ params }: PageProps) {
	const { id } = use(params);
	const router = useRouter();
	const { user } = useAuth();
	const isCustomer = user?.type === UserType.CUSTOMER;

	const { booking, isLoading, error } = useBooking(id);
	const {
		cancelBooking: cancelVendorBooking,
		isCancelling: isCancellingVendor,
	} = useVendorBookings();
	const {
		cancelBooking: cancelCustomerBooking,
		isCancelling: isCancellingCustomer,
	} = useMyBookings();

	const cancelBooking = isCustomer
		? cancelCustomerBooking
		: cancelVendorBooking;
	const isCancelling = isCustomer ? isCancellingCustomer : isCancellingVendor;
	const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

	const handleCancel = () => {
		cancelBooking(id, {
			onSuccess: () => {
				setIsCancelDialogOpen(false);
			},
		});
	};

	if (isLoading) {
		return (
			<div className="flex h-screen items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	if (error || !booking) {
		return (
			<div className="flex flex-col h-screen items-center justify-center gap-4">
				<p className="text-destructive font-medium">
					Error loading booking details
				</p>
				<Button variant="outline" asChild>
					<Link href="/dashboard/bookings">Back to Bookings</Link>
				</Button>
			</div>
		);
	}

	const getInitials = (first?: string, last?: string) => {
		return `${first?.[0] || ''}${last?.[0] || ''}`.toUpperCase();
	};

	const getStatusColor = (status: BookingStatus) => {
		switch (status) {
			case BookingStatus.CONFIRMED:
				return 'bg-emerald-50 text-emerald-700 border-emerald-200';
			case BookingStatus.PENDING:
				return 'bg-amber-50 text-amber-700 border-amber-200';
			case BookingStatus.CANCELLED:
				return 'bg-rose-50 text-rose-700 border-rose-200';
			default:
				return 'bg-blue-50 text-blue-700 border-blue-200';
		}
	};

	return (
		<div className="min-h-screen bg-gray-50/50 pb-20">
			{/* Top Navigation Bar */}
			<div className="sticky top-0 z-30 bg-white/80 border-b border-border/60 px-8 py-4 flex items-center justify-between backdrop-blur-sm supports-backdrop-filter:bg-white/60">
				<div className="flex items-center gap-4">
					<Link
						href={isCustomer ? '/dashboard/my-bookings' : '/dashboard/bookings'}
						className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors text-muted-foreground hover:text-foreground"
						aria-label="Back to bookings"
					>
						<ArrowLeft className="h-5 w-5" />
					</Link>
					<div className="flex flex-col">
						<div className="flex items-center gap-3">
							<h1 className="text-xl font-bold tracking-tight text-gray-900">
								Booking {booking.id.slice(-7).toUpperCase()}
							</h1>
							<div
								className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${getStatusColor(booking.status)}`}
							>
								<div className="w-1.5 h-1.5 rounded-full bg-current" />
								{booking.status.charAt(0) +
									booking.status.slice(1).toLowerCase()}
							</div>
						</div>
						<span className="text-xs text-muted-foreground mt-0.5">
							{format(new Date(booking.startDate), 'EEEE, dd MMMM yyyy')}
							{booking.endDate && booking.endDate !== booking.startDate && (
								<>
									{' '}
									- {format(new Date(booking.endDate), 'EEEE, dd MMMM yyyy')}
								</>
							)}
						</span>
					</div>
				</div>

				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="sm"
						className="hidden sm:flex border-border/60"
					>
						<Download className="mr-2 h-4 w-4" />
						Download Invoice
					</Button>

					{booking.status === BookingStatus.PENDING && !isCustomer && (
						<>
							<Dialog
								open={isCancelDialogOpen}
								onOpenChange={setIsCancelDialogOpen}
							>
								<DialogTrigger asChild>
									<Button
										variant="outline"
										size="sm"
										className="border-rose-200 text-rose-700 hover:bg-rose-50 hover:text-rose-800"
									>
										<XCircle className="mr-2 h-4 w-4" />
										Reject
									</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Cancel Booking</DialogTitle>
										<DialogDescription>
											Are you sure you want to cancel this booking? This action
											cannot be undone.
										</DialogDescription>
									</DialogHeader>
									<DialogFooter>
										<Button
											variant="outline"
											onClick={() => setIsCancelDialogOpen(false)}
										>
											Keep Booking
										</Button>
										<Button
											variant="destructive"
											onClick={handleCancel}
											disabled={isCancelling}
										>
											{isCancelling ? 'Cancelling...' : 'Yes, Cancel Booking'}
										</Button>
									</DialogFooter>
								</DialogContent>
							</Dialog>

							<Button
								size="sm"
								className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shimmer"
							>
								<CheckCircle2 className="mr-2 h-4 w-4" />
								Approve Booking
							</Button>
						</>
					)}

					{isCustomer && (
						<div className="flex gap-2">
							<Button
								variant="outline"
								size="sm"
								className="hover:bg-blue-50 text-brand-blue border-brand-blue/20"
							>
								<Mail className="mr-2 h-4 w-4" />
								Contact Host
							</Button>
							{booking.status === BookingStatus.PENDING && (
								<Button
									variant="outline"
									size="sm"
									className="border-rose-200 text-rose-700 hover:bg-rose-50"
									onClick={() => setIsCancelDialogOpen(true)}
								>
									<XCircle className="mr-2 h-4 w-4" />
									Cancel Request
								</Button>
							)}
						</div>
					)}

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon" className="sm:hidden">
								<MoreVertical className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem>Download Invoice</DropdownMenuItem>
							<DropdownMenuItem className="text-destructive">
								Cancel Booking
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			<div className="max-w-7xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Left Column - Main Details */}
				<div className="lg:col-span-2 space-y-6">
					{/* Venue & Time Card */}
					<Card className="border-border/60 shadow-sm overflow-hidden">
						<CardHeader className="bg-gray-50/50 border-b border-border/60 pb-4">
							<div className="flex items-center gap-2">
								<div className="p-2 bg-white rounded-md border border-border/60 shadow-sm">
									<Building2 className="h-4 w-4 text-primary" />
								</div>
								<div>
									<CardTitle className="text-base font-semibold">
										Event Venue
									</CardTitle>
									<CardDescription className="text-xs">
										Location and timing details
									</CardDescription>
								</div>
							</div>
						</CardHeader>
						<CardContent className="p-6">
							<div className="flex flex-col md:flex-row gap-6">
								{/* Venue Image */}
								<div className="w-full md:w-48 h-32 rounded-lg border border-border/60 overflow-hidden relative group shrink-0">
									{booking.listing?.images?.[0]?.url ? (
										<img
											src={booking.listing.images[0].url}
											alt={booking.listing.name}
											className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
										/>
									) : (
										<div className="w-full h-full bg-muted flex flex-col items-center justify-center text-muted-foreground gap-2">
											<Building2 className="h-8 w-8 opacity-20" />
											<span className="text-xs font-medium opacity-60">
												No Image
											</span>
										</div>
									)}
								</div>

								<div className="flex-1 space-y-6">
									<div>
										<h3 className="text-lg font-bold text-gray-900 leading-tight">
											{booking.listing?.name}
										</h3>
										<div className="flex items-start gap-2 mt-2 text-muted-foreground">
											<MapPin className="h-4 w-4 mt-0.5 shrink-0" />
											<p className="text-sm">
												{booking.listing?.addressLine}, {booking.listing?.city},{' '}
												{booking.listing?.state}
											</p>
										</div>
									</div>

									<div className="grid grid-cols-2 gap-4">
										<div className="p-3 rounded-lg bg-gray-50 border border-border/50">
											<span className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
												<Calendar className="h-3.5 w-3.5" /> Date
											</span>
											<p className="text-sm font-semibold text-gray-900">
												{format(new Date(booking.startDate), 'MMM dd, yyyy')}
											</p>
										</div>
										<div className="p-3 rounded-lg bg-gray-50 border border-border/50">
											<p className="text-sm font-semibold text-gray-900">
												Full Day Access
											</p>
										</div>
									</div>
								</div>
							</div>

							{booking.specialRequests && (
								<div className="mt-6 pt-6 border-t border-dashed">
									<h4 className="text-sm font-medium mb-2 flex items-center gap-2">
										<span className="w-1 h-4 bg-primary rounded-full" />
										Special Requests
									</h4>
									<p className="text-sm text-muted-foreground leading-relaxed bg-blue-50/50 p-4 rounded-lg border border-blue-100/50 italic">
										"{booking.specialRequests}"
									</p>
								</div>
							)}
						</CardContent>
					</Card>

					{/* Space & Amenities Card */}
					<Card className="border-border/60 shadow-sm overflow-hidden">
						<CardHeader className="bg-gray-50/50 border-b border-border/60 pb-4">
							<div className="flex items-center gap-2">
								<div className="p-2 bg-white rounded-md border border-border/60 shadow-sm text-brand-blue">
									<SquareStack className="h-4 w-4" />
								</div>
								<div>
									<CardTitle className="text-base font-semibold">
										Space & Amenities
									</CardTitle>
									<CardDescription className="text-xs">
										Capacity and available facilities
									</CardDescription>
								</div>
							</div>
						</CardHeader>
						<CardContent className="p-6">
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
								<div className="flex flex-col gap-1">
									<span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
										Capacity
									</span>
									<div className="flex items-center gap-2">
										<Users className="h-4 w-4 text-brand-blue" />
										<span className="text-sm font-bold text-gray-900">
											{booking.listing?.venueDetail?.capacity || 'N/A'} Guests
										</span>
									</div>
								</div>
								<div className="flex flex-col gap-1">
									<span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
										Floor Area
									</span>
									<div className="flex items-center gap-2">
										<SquareStack className="h-4 w-4 text-brand-blue" />
										<span className="text-sm font-bold text-gray-900">
											{booking.listing?.venueDetail?.floorArea || 'N/A'} SQFT
										</span>
									</div>
								</div>
								<div className="flex flex-col gap-1">
									<span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
										Parking
									</span>
									<div className="flex items-center gap-2">
										<Car className="h-4 w-4 text-brand-blue" />
										<span className="text-sm font-bold text-gray-900">
											{booking.listing?.venueDetail?.parkingCap || '0'} Spaces
										</span>
									</div>
								</div>
								<div className="flex flex-col gap-1">
									<span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
										Environment
									</span>
									<div className="flex items-center gap-2 text-sm font-bold text-gray-900">
										{booking.listing?.venueDetail?.hasIndoor && (
											<div className="px-1.5 py-0.5 bg-blue-50 text-brand-blue rounded text-[10px]">
												Indoor
											</div>
										)}
										{booking.listing?.venueDetail?.hasOutdoor && (
											<div className="px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[10px]">
												Outdoor
											</div>
										)}
									</div>
								</div>
							</div>

							<Separator className="mb-6 opacity-50" />

							<div>
								<h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">
									Features & Amenities
								</h4>
								<div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
									{Array.isArray(booking.listing?.venueDetail?.amenities) ? (
										booking.listing.venueDetail.amenities.map((amenity, i) => (
											<div
												key={i}
												className="flex items-center gap-2 py-2 px-3 rounded-xl bg-gray-50/50 border border-gray-100 transition-colors hover:bg-white hover:shadow-soft"
											>
												<div className="h-5 w-5 rounded-full bg-emerald-50 flex items-center justify-center">
													<Check className="h-3 w-3 text-emerald-600" />
												</div>
												<span className="text-xs font-medium text-gray-700">
													{amenity}
												</span>
											</div>
										))
									) : typeof booking.listing?.venueDetail?.amenities ===
											'object' &&
									  booking.listing?.venueDetail?.amenities !== null ? (
										Object.entries(booking.listing.venueDetail.amenities)
											.filter(([_, value]) => value === true)
											.map(([key], i) => (
												<div
													key={i}
													className="flex items-center gap-2 py-2 px-3 rounded-xl bg-gray-50/50 border border-gray-100 transition-colors hover:bg-white hover:shadow-soft"
												>
													<div className="h-5 w-5 rounded-full bg-emerald-50 flex items-center justify-center">
														<Check className="h-3 w-3 text-emerald-600" />
													</div>
													<span className="text-xs font-medium text-gray-700 capitalize">
														{key.replace(/-/g, ' ')}
													</span>
												</div>
											))
									) : (
										<p className="text-xs text-muted-foreground italic col-span-full">
											No amenities listed.
										</p>
									)}
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Location Map Card */}
					<Card className="border-border/60 shadow-sm overflow-hidden">
						<CardHeader className="bg-gray-50/50 border-b border-border/60 pb-4">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<div className="p-2 bg-white rounded-md border border-border/60 shadow-sm text-brand-blue">
										<Navigation className="h-4 w-4" />
									</div>
									<div>
										<CardTitle className="text-base font-semibold">
											Location & Directions
										</CardTitle>
									</div>
								</div>
								<Button
									variant="ghost"
									size="sm"
									className="text-brand-blue text-xs font-bold"
									asChild
								>
									<a
										href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${booking.listing?.addressLine}, ${booking.listing?.city}`)}`}
										target="_blank"
									>
										Open Maps <ArrowUpRight className="ml-1 h-3 w-3" />
									</a>
								</Button>
							</div>
						</CardHeader>
						<CardContent className="p-0">
							<div className="relative h-64 w-full bg-slate-100 overflow-hidden">
								{/* Placeholder Map Pattern */}
								<div
									className="absolute inset-0 opacity-10"
									style={{
										backgroundImage:
											'radial-gradient(#3b82f6 0.5px, transparent 0.5px)',
										backgroundSize: '24px 24px',
									}}
								/>

								{/* Map Pin UI */}
								<div className="absolute inset-0 flex flex-col items-center justify-center">
									<div className="relative mb-2">
										<div className="absolute -inset-4 bg-brand-blue/20 rounded-full animate-ping" />
										<div className="relative bg-brand-blue text-white p-3 rounded-2xl shadow-xl shadow-blue-500/40">
											<MapPin className="h-6 w-6" />
										</div>
									</div>
									<div className="bg-white/90 backdrop-blur-md border border-white/50 px-4 py-2 rounded-xl shadow-lg flex flex-col items-center">
										<p className="text-xs font-bold text-gray-900">
											{booking.listing?.addressLine}
										</p>
										<p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black mt-0.5">
											{booking.listing?.city}, {booking.listing?.state}
										</p>
									</div>
								</div>

								{/* Navigation Overlay */}
								<div className="absolute bottom-4 left-4 right-4 bg-white/95 border border-border/40 p-4 rounded-2xl shadow-xl backdrop-blur-sm">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3">
											<div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center">
												<Building2 className="h-5 w-5 text-slate-400" />
											</div>
											<div>
												<p className="text-xs font-bold text-gray-900">
													Destination
												</p>
												<p className="text-xs text-muted-foreground truncate max-w-[200px]">
													{booking.listing?.name}
												</p>
											</div>
										</div>
										<Button className="bg-brand-blue hover:bg-brand-blue-hover text-white rounded-xl h-10 px-6 font-bold shadow-md shadow-blue-500/20">
											Get Directions
										</Button>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Payment Card */}
					<Card className="border-border/60 shadow-sm overflow-hidden">
						<CardHeader className="bg-gray-50/50 border-b border-border/60 pb-4">
							<div className="flex items-center gap-2">
								<div className="p-2 bg-white rounded-md border border-border/60 shadow-sm">
									<Receipt className="h-4 w-4 text-emerald-600" />
								</div>
								<div>
									<CardTitle className="text-base font-semibold">
										Financials
									</CardTitle>
									<CardDescription className="text-xs">
										Payment breakdown and status
									</CardDescription>
								</div>
							</div>
						</CardHeader>
						<CardContent className="p-0">
							<div className="p-6 space-y-3">
								<div className="flex items-center justify-between text-sm">
									<span className="text-muted-foreground">
										{booking.details?.venueRentalFee
											? 'Venue Rental'
											: 'Base Price'}
									</span>
									<span className="font-medium">
										{booking.currency}{' '}
										{(
											booking.details?.venueRentalFee || booking.basePrice
										).toLocaleString()}
									</span>
								</div>

								{booking.details?.selectedAddOns?.map((addon: any) => (
									<div
										key={addon.id}
										className="flex items-center justify-between text-sm"
									>
										<span className="text-muted-foreground">{addon.name}</span>
										<span className="font-medium">
											{booking.currency} {addon.price.toLocaleString()}
										</span>
									</div>
								))}

								{booking.details?.cleaningFee > 0 && (
									<div className="flex items-center justify-between text-sm">
										<span className="text-muted-foreground">Cleaning Fee</span>
										<span className="font-medium">
											{booking.currency}{' '}
											{booking.details.cleaningFee.toLocaleString()}
										</span>
									</div>
								)}

								<Separator className="my-2 opacity-50" />

								<div className="flex items-center justify-between text-sm">
									<span className="text-muted-foreground italic">Subtotal</span>
									<span className="font-bold">
										{booking.currency}{' '}
										{(
											booking.details?.subTotal || booking.basePrice
										).toLocaleString()}
									</span>
								</div>

								<div className="flex items-center justify-between text-sm">
									<span className="text-muted-foreground">Platform Fee</span>
									<span className="font-medium text-amber-600">
										+ {booking.currency} {booking.platformFee.toLocaleString()}
									</span>
								</div>

								{booking.details?.vat > 0 && (
									<div className="flex items-center justify-between text-sm">
										<span className="text-muted-foreground">VAT</span>
										<span className="font-medium text-amber-600">
											+ {booking.currency}{' '}
											{booking.details.vat.toLocaleString()}
										</span>
									</div>
								)}
							</div>

							<div className="bg-gray-50/50 p-6 border-t border-border/60">
								<div className="flex items-center justify-between mb-6">
									<span className="font-semibold text-gray-900">
										Total Amount
									</span>
									<span className="text-xl font-bold text-gray-900">
										{booking.currency} {booking.totalAmount.toLocaleString()}
									</span>
								</div>

								<div className="grid grid-cols-2 gap-4">
									{/* Deposit Status */}
									<div
										className={`relative overflow-hidden rounded-xl border p-4 ${
											booking.depositPaid
												? 'bg-white border-emerald-200'
												: 'bg-white border-border/60'
										}`}
									>
										<div className="flex items-center justify-between mb-2">
											<span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
												Deposit
											</span>
											{booking.depositPaid ? (
												<CheckCircle2 className="h-4 w-4 text-emerald-600" />
											) : (
												<div className="h-4 w-4 rounded-full border-2 border-muted" />
											)}
										</div>
										<div className="flex items-end gap-1">
											<span
												className={`text-lg font-bold ${booking.depositPaid ? 'text-emerald-700' : 'text-gray-900'}`}
											>
												{booking.depositPaid ? 'Paid' : 'Pending'}
											</span>
											<span className="text-xs text-muted-foreground mb-1">
												{(booking.depositAmount || 0).toLocaleString()}
											</span>
										</div>
										{booking.depositPaid && (
											<div className="absolute top-0 right-0 w-16 h-16 bg-emerald-50 rounded-bl-full -mr-8 -mt-8 z-0 opacity-50" />
										)}
									</div>

									{/* Full Payment Status */}
									<div
										className={`relative overflow-hidden rounded-xl border p-4 ${
											booking.fullPaymentPaid
												? 'bg-white border-emerald-200'
												: 'bg-white border-border/60'
										}`}
									>
										<div className="flex items-center justify-between mb-2">
											<span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
												Balance
											</span>
											{booking.fullPaymentPaid ? (
												<CheckCircle2 className="h-4 w-4 text-emerald-600" />
											) : (
												<div className="h-4 w-4 rounded-full border-2 border-muted" />
											)}
										</div>
										<span
											className={`text-lg font-bold ${booking.fullPaymentPaid ? 'text-emerald-700' : 'text-gray-900'}`}
										>
											{booking.fullPaymentPaid ? 'Paid' : 'Unpaid'}
										</span>
										{booking.fullPaymentPaid && (
											<div className="absolute top-0 right-0 w-16 h-16 bg-emerald-50 rounded-bl-full -mr-8 -mt-8 z-0 opacity-50" />
										)}
									</div>
								</div>

								{/* Payment Action for Customers */}
								{isCustomer &&
									booking.status === BookingStatus.CONFIRMED &&
									!booking.fullPaymentPaid && (
										<div className="mt-6 pt-6 border-t border-dashed border-border/60">
											<Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 rounded-xl shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all">
												<CreditCard className="mr-2 h-4 w-4" />
												Complete Payment
											</Button>
											<p className="text-[10px] text-center text-muted-foreground mt-2 px-6">
												Confirm your booking by completing the balance payment.
												Securely processed via OneEvent.
											</p>
										</div>
									)}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Right Column - Customer & Info */}
				<div className="space-y-6">
					<Card className="border-border/60 shadow-sm">
						<CardHeader className="bg-gray-50/50 border-b border-border/60 pb-4">
							<div className="flex items-center gap-2">
								<div className="p-2 bg-white rounded-md border border-border/60 shadow-sm">
									{isCustomer ? (
										<Building2 className="h-4 w-4 text-primary" />
									) : (
										<User className="h-4 w-4 text-primary" />
									)}
								</div>
								<div>
									<CardTitle className="text-base font-semibold">
										{isCustomer ? 'Host Information' : 'Customer'}
									</CardTitle>
								</div>
							</div>
						</CardHeader>
						<CardContent className="p-6">
							<div className="flex flex-col items-center text-center mb-6">
								<Avatar className="h-20 w-20 border-4 border-white shadow-sm mb-3">
									<AvatarImage src="" />
									<AvatarFallback className="bg-primary/5 text-primary text-xl font-bold">
										{isCustomer
											? booking.listing?.vendor?.businessName?.[0] || 'H'
											: getInitials(
													booking.customer?.firstName,
													booking.customer?.lastName,
												)}
									</AvatarFallback>
								</Avatar>
								<h3 className="text-lg font-bold text-gray-900">
									{isCustomer
										? booking.listing?.vendor?.businessName
										: `${booking.customer?.firstName} ${booking.customer?.lastName}`}
								</h3>
								<p className="text-sm text-muted-foreground">
									{isCustomer ? 'Premium Host' : 'Guest'}
								</p>
							</div>

							<div className="space-y-4">
								<a
									href={`mailto:${
										isCustomer
											? booking.listing?.vendor?.businessEmail
											: booking.customer?.email
									}`}
									className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:bg-gray-50 transition-colors group"
								>
									<div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
										<Mail className="h-4 w-4 text-blue-600" />
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-xs text-muted-foreground">
											Email Address
										</p>
										<p className="text-sm font-medium truncate">
											{isCustomer
												? booking.listing?.vendor?.businessEmail
												: booking.customer?.email}
										</p>
									</div>
								</a>

								<a
									href={`tel:${
										isCustomer
											? booking.listing?.vendor?.businessPhone
											: booking.customer?.phone
									}`}
									className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:bg-gray-50 transition-colors group"
								>
									<div className="h-8 w-8 rounded-full bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
										<Phone className="h-4 w-4 text-green-600" />
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-xs text-muted-foreground">
											Phone Number
										</p>
										<p className="text-sm font-medium truncate">
											{isCustomer
												? booking.listing?.vendor?.businessPhone
												: booking.customer?.phone}
										</p>
									</div>
								</a>
							</div>
						</CardContent>
					</Card>

					{/* Help/Support Placeholder */}
					<div className="rounded-xl bg-linear-to-br from-primary/5 to-primary/10 border border-primary/10 p-6 text-center">
						<h4 className="font-semibold text-primary mb-1">Need Help?</h4>
						<p className="text-xs text-muted-foreground mb-4">
							Issues with this booking? Contact support for assistance.
						</p>
						<Button
							variant="outline"
							size="sm"
							className="w-full bg-white border-primary/20 text-primary hover:bg-primary/5"
						>
							Contact Support
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
