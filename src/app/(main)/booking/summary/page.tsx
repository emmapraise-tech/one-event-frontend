'use client';

import { BookingStepper } from '@/components/booking/booking-stepper';
import { PaymentMethodSelector } from '@/components/booking/payment-method-selector';
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
	Loader2,
} from 'lucide-react';
import Image from 'next/legacy/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function BookingSummaryPage() {
	const router = useRouter();
	const [paymentMethod, setPaymentMethod] = useState('');
	const [termsAccepted, setTermsAccepted] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);
	const [bookingData, setBookingData] = useState<any>(null);

	// No need for hardcoded constants anymore as we use dynamic add-ons from bookingData

	useEffect(() => {
		const data = localStorage.getItem('bookingDetails');
		if (data) {
			setBookingData(JSON.parse(data));
		}
	}, []);

	if (!bookingData) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p className="text-neutral-500">Loading booking details...</p>
			</div>
		);
	}

	// Calculations
	const subtotal = bookingData.total;
	const vat = subtotal * 0.075;
	const grandTotal = subtotal + vat;

	const handlePayment = () => {
		setIsProcessing(true);
		// Simulate API call
		setTimeout(() => {
			router.push('/booking/confirmed');
		}, 2000);
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Breadcrumbs */}
			<div className="bg-white/50 backdrop-blur-sm py-4 border-b border-neutral-100 mb-8 sticky top-16 z-30">
				<div className="container mx-auto px-4 flex items-center gap-2 text-sm text-neutral-500">
					<Button
						variant="ghost"
						size="icon"
						className="mr-2 h-8 w-8 hover:bg-neutral-100 rounded-full"
						onClick={() => router.back()}
					>
						<ChevronRight className="h-4 w-4 rotate-180 text-neutral-900" />
					</Button>
					<Link href="/" className="hover:text-neutral-900 transition-colors">
						Home
					</Link>
					<ChevronRight className="h-4 w-4 text-neutral-400" />
					<Link
						href="/listings"
						className="hover:text-neutral-900 transition-colors"
					>
						Venues
					</Link>
					<ChevronRight className="h-4 w-4 text-neutral-400" />
					<span className="text-neutral-500 truncate max-w-[200px]">
						{bookingData.venueName || 'Venue'}
					</span>
					<ChevronRight className="h-4 w-4 text-neutral-400" />
					<span className="text-neutral-900 font-medium">Review & Payment</span>
				</div>
			</div>

			<div className="container mx-auto max-w-6xl px-4 pb-8">
				{/* Page Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-neutral-900 mb-2">
						Review & Payment
					</h1>
					<p className="text-neutral-500 mb-8">
						Review your booking details and select a payment method to confirm.
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
										src={bookingData.venueImage || '/images/listing-1.jpg'}
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
								<div className="flex items-start gap-4">
									<div className="p-3 bg-neutral-100 rounded-lg text-neutral-600">
										<Utensils className="w-6 h-6" />
									</div>
									<div className="flex-1">
										<div className="flex justify-between mb-1">
											<span className="font-bold text-neutral-900">
												Royal Nigerian Buffet
											</span>
											<span className="font-bold text-neutral-900">
												₦650,000.00
											</span>
										</div>
										<p className="text-sm text-neutral-500">
											Jollof/Fried Rice, Pounded Yam & Egusi, Chapman, 5 servers
										</p>
									</div>
								</div>
								<div className="flex items-start gap-4">
									<div className="p-3 bg-neutral-100 rounded-lg text-neutral-600">
										<Music className="w-6 h-6" />
									</div>
									<div className="flex-1">
										<div className="flex justify-between mb-1">
											<span className="font-bold text-neutral-900">
												Live Band & DJ Setup
											</span>
											<span className="font-bold text-neutral-900">
												₦350,000.00
											</span>
										</div>
										<p className="text-sm text-neutral-500">
											Full sound equipment, Stage lights, Backup generator
										</p>
									</div>
								</div>
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
										Adewale Ogunleye
									</span>
								</div>
								<div>
									<span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide block mb-1">
										EMAIL ADDRESS
									</span>
									<span className="font-medium text-neutral-900">
										adewale.o@example.com
									</span>
								</div>
								<div>
									<span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide block mb-1">
										PHONE
									</span>
									<span className="font-medium text-neutral-900">
										+234 802 345 6789
									</span>
								</div>
							</CardContent>
						</Card>

						{/* Payment Method */}
						<div className="space-y-4 pt-4">
							<div className="flex items-center justify-between">
								<h3 className="font-bold text-lg text-neutral-900">
									Select Payment Method
								</h3>
								<div className="flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-1 rounded border border-green-100">
									<Lock className="w-3 h-3" /> Secure Transaction
								</div>
							</div>
							<PaymentMethodSelector
								value={paymentMethod}
								onChange={setPaymentMethod}
							/>
						</div>
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

									<div className="flex justify-between items-center">
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
											disabled={
												!termsAccepted || !paymentMethod || isProcessing
											}
											onClick={handlePayment}
											className="w-full bg-brand-gold hover:bg-brand-gold-hover text-neutral-900 font-bold h-12 text-base shadow-sm mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
										>
											{isProcessing ? (
												<>
													<Loader2 className="mr-2 h-4 w-4 animate-spin" />
													Processing...
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
