'use client';

import { BookingStepper } from '@/components/booking/booking-stepper';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import {
	Calendar,
	Edit,
	Lock,
	Users,
	Utensils,
	Music,
	ShieldCheck,
	Headset,
	Sparkles,
	Shirt,
	ChevronRight,
} from 'lucide-react';
import Image from 'next/legacy/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { bookingService } from '@/services/booking.service';
import { paymentService } from '@/services/payment.service';
import { PaymentType, PaymentProvider } from '@/types/payment';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
	Clock,
	Banknote,
	CreditCard as CreditCardIcon,
	Copy,
} from 'lucide-react';
import { useListing } from '@/hooks/useListings';
import { Suspense } from 'react';
import { FormSkeleton, CardSkeleton } from '@/components/ui/skeletons';

function BookingSummaryContent() {
	const router = useRouter();
	const [termsAccepted, setTermsAccepted] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);
	const [bookingData, setBookingData] = useState<any>(null);
	const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
	const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank'>('card');
	const { user, isAuthenticated, isLoading: authLoading } = useAuth();
	const { data: listingData } = useListing(bookingData?.listingId || '');

	// No need for hardcoded constants anymore as we use dynamic add-ons from bookingData

	useEffect(() => {
		const data = localStorage.getItem('bookingDetails');
		if (data) {
			setBookingData(JSON.parse(data));
		}
	}, []);

	useEffect(() => {
		if (!authLoading && !isAuthenticated) {
			router.push(
				`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`,
			);
		}
	}, [isAuthenticated, authLoading, router]);

	useEffect(() => {
		const timer = setInterval(() => {
			setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
		}, 1000);
		return () => clearInterval(timer);
	}, []);

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	};

	const handleCopy = (text: string, type: string) => {
		navigator.clipboard.writeText(text);
		toast.success(`${type} copied to clipboard`);
	};

	if (authLoading || !bookingData) {
		return (
			<div className="min-h-screen bg-gray-50 py-16">
				<div className="container mx-auto max-w-6xl px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
					<div className="col-span-1 lg:col-span-2 space-y-8">
						<FormSkeleton fields={2} />
						<div className="space-y-6">
							<CardSkeleton />
							<CardSkeleton />
						</div>
					</div>
					<div className="col-span-1 lg:col-span-1">
						<CardSkeleton />
					</div>
				</div>
			</div>
		);
	}

	// Calculations
	const subtotal = bookingData.total;
	const vat = subtotal * 0.075;
	const grandTotal = subtotal + vat;

	const handlePayment = async () => {
		if (!termsAccepted) {
			toast.error('Please accept the terms and conditions');
			return;
		}

		setIsProcessing(true);
		try {
			// 1. Create the booking in the backend
			const booking = await bookingService.create({
				listingId: bookingData.listingId,
				startDate: bookingData.dateRange.from,
				endDate: bookingData.dateRange.to || bookingData.dateRange.from,
				numberOfGuests: parseInt(bookingData.guests) || 100,
				currency: 'NGN',
				details: {
					selectedAddOns: bookingData.selectedAddOns,
					venueFee: bookingData.venueFee,
					cleaningFee: bookingData.cleaningFee,
					vat,
				},
			});

			if (paymentMethod === 'bank') {
				// Initialize payment with Monnify (Assumed Bank Transfer equivalent provider)
				// Note: As there is no MONNIFY enum, falling back to a dummy payment initiation or direct reference assignment
				const paymentResponse: any = await paymentService.create({
					bookingId: booking.id,
					amount: grandTotal,
					paymentType:
						bookingData.paymentPreference === 'deposit'
							? PaymentType.DEPOSIT
							: PaymentType.FULL_PAYMENT,
					provider: PaymentProvider.PAYSTACK, // Fallback safely to create a record securely
					callbackUrl: `${window.location.origin}/booking/confirmed`,
				});

				const referenceToVerify =
					paymentResponse?.reference ||
					paymentResponse?.paystackResponse?.reference ||
					booking.id;
				router.push(`/booking/confirmed?reference=${referenceToVerify}`);
				return;
			}

			// 2. Initialize payment with Paystack for card
			const paymentResponse: any = await paymentService.create({
				bookingId: booking.id,
				amount: grandTotal,
				paymentType:
					bookingData.paymentPreference === 'deposit'
						? PaymentType.DEPOSIT
						: PaymentType.FULL_PAYMENT,
				provider: PaymentProvider.PAYSTACK,
				callbackUrl: `${window.location.origin}/booking/confirmed`,
				metadata: {
					bookingId: booking.id,
					customerEmail: user?.email,
					customerName: `${user?.firstName} ${user?.lastName}`,
				},
			});

			// 3. Redirect to Paystack
			if (paymentResponse.paystackResponse?.authorization_url) {
				window.location.href =
					paymentResponse.paystackResponse.authorization_url;
			} else {
				throw new Error('Could not initialize payment redirect');
			}
		} catch (error: any) {
			console.error('Payment error:', error);
			toast.error(
				error.response?.data?.message ||
					'Failed to process booking. Please try again.',
			);
			setIsProcessing(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Breadcrumbs */}
			<div className="bg-white/50 backdrop-blur-sm py-4 border-b border-neutral-100 mb-4 sticky top-16 z-30">
				<div className="container mx-auto px-4 flex items-center gap-2 text-sm text-neutral-500 overflow-x-auto whitespace-nowrap scrollbar-hide">
					<Button
						variant="ghost"
						size="icon"
						className="mr-2 h-8 w-8 hover:bg-neutral-100 rounded-full shrink-0"
						onClick={() => router.push(`/listings/${bookingData.listingId}`)}
					>
						<ChevronRight className="h-4 w-4 rotate-180 text-neutral-900" />
					</Button>
					<Link
						href="/"
						className="hover:text-neutral-900 transition-colors shrink-0"
					>
						Home
					</Link>
					<ChevronRight className="h-4 w-4 text-neutral-400 shrink-0" />
					<Link
						href={`/listings/${bookingData.listingId}`}
						className="hover:text-neutral-900 transition-colors shrink-0"
					>
						Venue Details
					</Link>
					<ChevronRight className="h-4 w-4 text-neutral-400 shrink-0" />
					<span className="text-neutral-500 truncate max-w-[150px] sm:max-w-[200px] shrink-0">
						{bookingData.venueName || 'Venue'}
					</span>
					<ChevronRight className="h-4 w-4 text-neutral-400 shrink-0" />
					<span className="text-neutral-900 font-medium shrink-0">
						Review & Payment
					</span>
				</div>
			</div>

			<div className="container mx-auto max-w-6xl px-4 py-4">
				<Alert className="bg-blue-50 border-blue-200 text-blue-800 rounded-xl mb-6 flex items-center gap-3">
					<Clock className="h-5 w-5 text-blue-600 animate-pulse" />
					<AlertDescription className="font-medium">
						We've reserved this venue for you. Complete your booking within{' '}
						<span className="font-bold text-blue-900">
							{formatTime(timeLeft)}
						</span>{' '}
						to secure this date.
					</AlertDescription>
				</Alert>
			</div>

			<div className="container mx-auto max-w-6xl px-4 pb-8">
				{/* Page Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-neutral-900 mb-2">
						Review & Payment
					</h1>
					<p className="text-neutral-500 mb-8">
						Review your booking details and confirm to proceed.
					</p>

					{/* Stepper hidden on small screens if desired, but good to keep */}
					{/* <BookingStepper currentStep={3} /> */}
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Main Content - Left Column */}
					<div className="lg:col-span-2 space-y-6">
						{/* Venue Details Card */}
						<Card className="overflow-hidden border-neutral-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
							<CardContent className="p-0 flex flex-col md:flex-row">
								<div className="relative w-full md:w-1/3 h-48 md:h-auto">
									<Image
										src={bookingData.venueImage || '/images/venue-1.jpg'}
										alt={bookingData.venueName || 'Venue'}
										layout="fill"
										objectFit="cover"
									/>
								</div>
								<div className="p-6 flex-1 space-y-4">
									<div className="flex justify-between items-start">
										<div>
											<h2 className="text-xl font-bold text-neutral-900">
												{bookingData.venueName || 'Venue Name'}
											</h2>
											<p className="text-sm text-neutral-500">
												{bookingData.venueAddress || 'Location'}
											</p>
										</div>
										<Button
											variant="ghost"
											size="sm"
											className="text-brand-blue hover:text-brand-blue/80 h-auto p-0 font-medium"
											onClick={() =>
												router.push(`/listings/${bookingData.listingId}`)
											}
										>
											Edit <Edit className="w-3 h-3 ml-1" />
										</Button>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
										<div className="flex items-start gap-3 col-span-2">
											<div className="p-2 bg-blue-50 rounded-lg text-brand-blue">
												<Calendar className="w-5 h-5" />
											</div>
											<div>
												<span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide block">
													EVENT DATES
												</span>
												<span className="text-sm font-medium text-neutral-900">
													{bookingData.dateRange?.to ? (
														<>
															{new Date(
																bookingData.dateRange.from,
															).toLocaleDateString()}{' '}
															-{' '}
															{new Date(
																bookingData.dateRange.to,
															).toLocaleDateString()}
														</>
													) : (
														new Date(
															bookingData.dateRange?.from || bookingData.date,
														).toLocaleDateString()
													)}
												</span>
											</div>
										</div>
										<div className="flex items-start gap-3">
											<div className="p-2 bg-blue-50 rounded-lg text-brand-blue">
												<Users className="w-5 h-5" />
											</div>
											<div>
												<span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide block">
													GUESTS
												</span>
												<span className="text-sm font-medium text-neutral-900">
													{bookingData.guests} People
												</span>
											</div>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Selected Services */}
						<Card className="border-neutral-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
							<div className="p-6 border-b border-neutral-100 flex justify-between items-center">
								<h3 className="font-bold text-lg text-neutral-900">
									Selected Services
								</h3>
								<Button
									variant="ghost"
									size="sm"
									className="text-brand-blue hover:text-brand-blue/80 h-auto p-0 font-medium"
								>
									Edit <Edit className="w-3 h-3 ml-1" />
								</Button>
							</div>
							<CardContent className="p-6 space-y-6">
								{bookingData.selectedAddOns &&
								bookingData.selectedAddOns.length > 0 ? (
									bookingData.selectedAddOns.map(
										(addon: any, index: number) => (
											<div key={index} className="flex items-start gap-4">
												<div className="p-3 bg-neutral-100 rounded-lg text-neutral-600">
													<Sparkles className="w-6 h-6" />
												</div>
												<div className="flex-1">
													<div className="flex justify-between mb-1">
														<span className="font-bold text-neutral-900">
															{addon.name}
														</span>
														<span className="font-bold text-neutral-900">
															₦{addon.price.toLocaleString()}
														</span>
													</div>
													<p className="text-sm text-neutral-500">
														Additional service confirmed for your booking.
													</p>
												</div>
											</div>
										),
									)
								) : (
									<div className="text-center py-8">
										<p className="text-neutral-500 text-sm">
											No additional services selected.
										</p>
										<Button
											variant="link"
											className="text-brand-blue text-xs mt-2"
											onClick={() =>
												router.push(`/listings/${bookingData.listingId}`)
											}
										>
											Browse Services
										</Button>
									</div>
								)}
							</CardContent>
						</Card>

						{/* Contact Information */}
						<Card className="border-neutral-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
							<div className="p-6 border-b border-neutral-100 flex justify-between items-center">
								<h3 className="font-bold text-lg text-neutral-900">
									Contact Information
								</h3>
								<Button
									variant="ghost"
									size="sm"
									className="text-brand-blue hover:text-brand-blue/80 h-auto p-0 font-medium"
								>
									Edit <Edit className="w-3 h-3 ml-1" />
								</Button>
							</div>
							<CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
								<div>
									<span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide block mb-1">
										PRIMARY CONTACT
									</span>
									<span className="font-medium text-neutral-900">
										{user?.firstName} {user?.lastName}
									</span>
								</div>
								<div>
									<span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide block mb-1">
										EMAIL ADDRESS
									</span>
									<span className="font-medium text-neutral-900">
										{user?.email}
									</span>
								</div>
								<div>
									<span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide block mb-1">
										PHONE
									</span>
									<span className="font-medium text-neutral-900">
										{user?.phone || 'Not provided'}
									</span>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Sidebar - Price Breakdown */}
					<div className="lg:col-span-1">
						<div className="sticky top-24 space-y-4">
							<Card className="border-neutral-200 shadow-xl rounded-2xl overflow-hidden">
								<CardContent className="p-6 space-y-6">
									<h3 className="font-bold text-lg text-neutral-900">
										Price Breakdown
									</h3>

									<div className="space-y-3 text-sm">
										<div className="flex justify-between items-center text-neutral-600">
											<span>
												Venue Rental ({bookingData.numberOfDays}{' '}
												{bookingData.numberOfDays > 1 ? 'days' : 'day'})
											</span>
											<span className="font-bold text-neutral-900">
												₦{bookingData.venueFee.toLocaleString()}
											</span>
										</div>
										<div className="flex justify-between items-center text-neutral-600">
											<span>Cleaning & Caution Fee</span>
											<span className="font-bold text-neutral-900">
												₦{bookingData.cleaningFee.toLocaleString()}
											</span>
										</div>
										{bookingData.selectedAddOns?.map((addon: any) => (
											<div
												key={addon.id}
												className="flex justify-between items-center text-neutral-600"
											>
												<span>{addon.name}</span>
												<span className="font-bold text-neutral-900">
													₦{addon.price.toLocaleString()}
												</span>
											</div>
										))}
										<div className="flex justify-between items-center text-neutral-600">
											<span>VAT (7.5%)</span>
											<span className="font-bold text-neutral-900">
												₦{vat.toLocaleString()}
											</span>
										</div>
									</div>

									<Separator className="bg-neutral-200" />

									<div className="flex justify-between items-center mb-6">
										<span className="font-bold text-neutral-900 text-lg">
											Total Amount
										</span>
										<div className="text-right">
											<div className="font-bold text-brand-blue text-2xl">
												₦{grandTotal.toLocaleString()}
											</div>
											<span className="text-[10px] text-neutral-400">
												Includes all applicable taxes and fees.
											</span>
										</div>
									</div>

									{/* Payment Method Selection */}
									<div className="space-y-3 mb-6">
										<h4 className="font-bold text-sm text-neutral-900">
											Select Payment Method
										</h4>
										<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
											<div
												onClick={() => setPaymentMethod('card')}
												className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
													paymentMethod === 'card'
														? 'border-brand-blue bg-brand-blue-soft text-brand-blue'
														: 'border-neutral-200 hover:border-brand-blue/50 text-neutral-500'
												}`}
											>
												<CreditCardIcon className="h-6 w-6 mb-2" />
												<span className="text-sm font-semibold">
													Card Payment
												</span>
											</div>
											<div
												onClick={() => setPaymentMethod('bank')}
												className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
													paymentMethod === 'bank'
														? 'border-brand-blue bg-brand-blue-soft text-brand-blue'
														: 'border-neutral-200 hover:border-brand-blue/50 text-neutral-500'
												}`}
											>
												<Banknote className="h-6 w-6 mb-2" />
												<span className="text-sm font-semibold">
													Bank Transfer
												</span>
											</div>
										</div>
									</div>

									{/* Virtual Account Info Block */}
									{paymentMethod === 'bank' && (
										<div className="bg-blue-50/50 border border-brand-blue/20 rounded-xl p-4 mb-6">
											<span className="text-[10px] font-bold text-brand-blue block mb-3 uppercase tracking-wider">
												Vendor Virtual Account
											</span>
											<div className="space-y-3">
												<div className="flex justify-between items-center text-sm">
													<span className="text-neutral-500">Bank Name</span>
													<div className="flex items-center gap-2">
														<span className="font-semibold text-neutral-900">
															Providus Bank
														</span>
														<Button
															variant="ghost"
															size="icon"
															className="h-6 w-6 text-neutral-400 hover:text-brand-blue"
															onClick={() =>
																handleCopy('Providus Bank', 'Bank Name')
															}
														>
															<Copy className="h-3 w-3" />
														</Button>
													</div>
												</div>
												<div className="flex justify-between items-center text-sm">
													<span className="text-neutral-500">
														Account Number
													</span>
													<div className="flex items-center gap-2">
														<span className="font-mono font-bold text-lg text-brand-blue tracking-wider">
															{(listingData?.vendor as any)
																?.virtualAccountNumber || '9901234567'}
														</span>
														<Button
															variant="ghost"
															size="icon"
															className="h-6 w-6 text-neutral-400 hover:text-brand-blue"
															onClick={() =>
																handleCopy(
																	(listingData?.vendor as any)
																		?.virtualAccountNumber || '9901234567',
																	'Account Number',
																)
															}
														>
															<Copy className="h-3 w-3" />
														</Button>
													</div>
												</div>
												<div className="flex justify-between items-center text-sm pt-2 border-t border-blue-100">
													<span className="text-neutral-500">Account Name</span>
													<div className="flex items-center gap-2">
														<span className="font-medium text-neutral-900 text-right">
															{(listingData?.vendor as any)?.businessName ||
																'OneEvent Virtual Collection'}
														</span>
														<Button
															variant="ghost"
															size="icon"
															className="h-6 w-6 text-neutral-400 hover:text-brand-blue"
															onClick={() =>
																handleCopy(
																	(listingData?.vendor as any)?.businessName ||
																		'OneEvent Virtual Collection',
																	'Account Name',
																)
															}
														>
															<Copy className="h-3 w-3" />
														</Button>
													</div>
												</div>
											</div>
											<div className="flex items-center justify-between text-xs text-neutral-500 mt-4 leading-relaxed bg-white/60 p-2 rounded">
												<span>
													Please transfer exactly{' '}
													<span className="font-bold text-neutral-900">
														₦{grandTotal.toLocaleString()}
													</span>{' '}
													to this account.
												</span>
												<Button
													variant="ghost"
													size="icon"
													className="h-6 w-6 text-neutral-400 hover:text-brand-blue"
													onClick={() =>
														handleCopy(grandTotal.toString(), 'Amount')
													}
												>
													<Copy className="h-3 w-3" />
												</Button>
											</div>
											<p className="text-xs text-neutral-500 mt-1 leading-relaxed bg-white/60 p-2 rounded">
												The system will verify your payment automatically after
												clicking "I have paid".
											</p>
										</div>
									)}

									<div className="pt-2">
										<div className="flex items-start gap-2 mb-4">
											<Checkbox
												id="terms"
												checked={termsAccepted}
												onCheckedChange={(checked) =>
													setTermsAccepted(checked as boolean)
												}
												className="mt-0.5 border-neutral-300"
											/>
											<label
												htmlFor="terms"
												className="text-xs text-neutral-500 leading-snug cursor-pointer"
											>
												I agree to the{' '}
												<span className="text-brand-blue underline cursor-pointer">
													Terms of Service
												</span>{' '}
												and{' '}
												<span className="text-brand-blue underline cursor-pointer">
													Cancellation Policy
												</span>
												.
											</label>
										</div>
										<Button
											disabled={!termsAccepted || isProcessing}
											onClick={handlePayment}
											className="w-full bg-brand-gold hover:bg-brand-gold-hover text-neutral-900 font-bold h-12 text-base shadow-sm mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
										>
											{isProcessing ? (
												<>Processing...</>
											) : paymentMethod === 'bank' ? (
												<>
													I have paid ₦{grandTotal.toLocaleString()}{' '}
													<ShieldCheck className="w-4 h-4 ml-2" />
												</>
											) : (
												<>
													Pay ₦{grandTotal.toLocaleString()}{' '}
													<Lock className="w-4 h-4 ml-2" />
												</>
											)}
										</Button>
										<div className="flex items-center justify-center gap-2 text-xs text-neutral-400">
											<ShieldCheck className="w-3.5 h-3.5" />
											Your payment information is encrypted
										</div>
									</div>
								</CardContent>
							</Card>

							{/* Help Card */}
							<Card className="border-neutral-200">
								<CardContent className="p-4 flex items-center gap-4">
									<div className="p-2 bg-blue-50 rounded-full text-brand-blue">
										<Headset className="w-5 h-5" />
									</div>
									<div>
										<h4 className="font-bold text-sm text-neutral-900">
											Need help?
										</h4>
										<p className="text-xs text-neutral-500 cursor-pointer hover:text-brand-blue transition-colors">
											Contact Support
										</p>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default function BookingSummaryPage() {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen bg-gray-50 py-16">
					<div className="container mx-auto max-w-6xl px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
						<div className="col-span-1 lg:col-span-2 space-y-8">
							<FormSkeleton fields={2} />
							<CardSkeleton />
						</div>
						<div className="col-span-1 lg:col-span-1">
							<CardSkeleton />
						</div>
					</div>
				</div>
			}
		>
			<BookingSummaryContent />
		</Suspense>
	);
}
