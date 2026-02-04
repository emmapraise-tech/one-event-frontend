'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
	Calendar,
	CheckCircle,
	Copy,
	CreditCard,
	Download,
	Home,
	MapPin,
	ShieldCheck,
	Sparkles,
	Users,
} from 'lucide-react';
import Image from 'next/legacy/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function BookingConfirmedPage() {
	const [bookingData, setBookingData] = useState<any>(null);
	const [refCode, setRefCode] = useState('');

	useEffect(() => {
		const data = localStorage.getItem('bookingDetails');
		if (data) {
			setBookingData(JSON.parse(data));
			// Generate a random-ish ref code if not already existing,
			// or just static for demo since it's a new load
			setRefCode(
				'#OE-' + Math.floor(100000 + Math.random() * 900000).toString(),
			);
		}
	}, []);

	if (!bookingData) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p className="text-neutral-500">Loading confirmation...</p>
			</div>
		);
	}

	// Calculations (re-derived or saved - re-deriving is safer if simple)
	const subtotal = bookingData.total;
	const vat = subtotal * 0.075;
	const grandTotal = subtotal + vat;

	const copyToClipboard = () => {
		navigator.clipboard.writeText(refCode);
		// Could add toast here
	};

	return (
		<div className="min-h-screen bg-neutral-bg py-12 px-4">
			<div className="container mx-auto max-w-3xl">
				{/* Success Header */}
				<div className="text-center mb-10">
					<div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-green-100 mb-6 relative animate-in zoom-in-50 duration-500">
						<div className="absolute inset-0 bg-green-200 rounded-full animate-ping opacity-25"></div>
						<div className="absolute -top-2 -right-2">
							<Sparkles className="h-8 w-8 text-brand-gold animate-bounce" />
						</div>
						<CheckCircle className="h-12 w-12 text-green-600 relative z-10" />
					</div>
					<h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-3 tracking-tight">
						Booking Confirmed!
					</h1>
					<p className="text-neutral-500 text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
						Get ready to celebrate! Your reservation at{' '}
						<span className="font-bold text-neutral-900">
							{bookingData.venueName}
						</span>{' '}
						is officially secured.
					</p>
					<p className="text-sm text-neutral-400 mt-4 bg-neutral-50 inline-block px-4 py-1 rounded-full border border-neutral-100">
						Confirmation sent to{' '}
						<span className="font-semibold text-neutral-700">
							alex.morgan@example.com
						</span>
					</p>
				</div>

				{/* Reference Code Bar */}
				<div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-lg mx-auto">
					<span className="text-sm font-bold text-neutral-400 tracking-wider uppercase">
						Ref Code
					</span>
					<div className="flex items-center gap-3">
						<span className="text-2xl font-bold text-neutral-900 tracking-tight">
							{refCode}
						</span>
						<Button
							variant="ghost"
							size="icon"
							onClick={copyToClipboard}
							className="text-neutral-400 hover:text-brand-blue"
						>
							<Copy className="h-4 w-4" />
						</Button>
					</div>
				</div>

				{/* Main Card */}
				<Card className="overflow-hidden border-neutral-200 shadow-2xl rounded-3xl ring-1 ring-neutral-200/50">
					{/* Venue Image Banner */}
					<div className="relative h-64 w-full">
						<Image
							src={bookingData.venueImage || '/images/listing-1.jpg'}
							alt={bookingData.venueName || 'Venue'}
							layout="fill"
							objectFit="cover"
						/>
						<div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-green-700 flex items-center gap-1.5 shadow-sm">
							<div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
							UPCOMING
						</div>
					</div>

					<CardContent className="p-0">
						{/* Venue Details Header */}
						<div className="p-8 border-b border-neutral-100">
							<div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
								<div>
									<h2 className="text-2xl font-bold text-neutral-900 mb-1">
										{bookingData.venueName}
									</h2>
									<div className="flex items-center gap-1.5 text-neutral-500 text-sm">
										<MapPin className="h-4 w-4" />
										{bookingData.venueAddress}
									</div>
								</div>
								<div className="flex items-center gap-1 bg-brand-gold/10 px-2 py-1 rounded text-xs font-bold text-brand-gold-darker">
									<Sparkles className="h-3 w-3 fill-current" />
									4.9
								</div>
							</div>

							<div className="flex flex-wrap gap-4">
								<div className="flex items-center gap-3 bg-neutral-50 px-4 py-3 rounded-lg border border-neutral-100 flex-1 min-w-[300px]">
									<div className="p-2 bg-white rounded-md shadow-sm text-brand-blue">
										<Calendar className="h-5 w-5" />
									</div>
									<div>
										<span className="text-[10px] font-bold text-neutral-400 uppercase block">
											Event Date(s)
										</span>
										<span className="text-sm font-semibold text-neutral-900">
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
							</div>
						</div>

						{/* Split Columns */}
						<div className="grid md:grid-cols-2">
							{/* Left: Check-in / Booking Details */}
							<div className="p-8 border-b md:border-b-0 md:border-r border-neutral-100 space-y-8">
								<h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-6 flex items-center gap-2">
									<ShieldCheck className="h-4 w-4" /> Booking Details
								</h3>

								<div className="space-y-6">
									<div className="flex items-start gap-4">
										<div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-brand-blue shrink-0">
											<Users className="h-5 w-5" />
										</div>
										<div>
											<span className="block font-bold text-neutral-900 text-sm">
												{bookingData.guests} Guests
											</span>
											<span className="text-xs text-neutral-500">
												Estimated attendee count
											</span>
										</div>
									</div>

									{bookingData.selectedAddOns?.length > 0 && (
										<div className="flex items-start gap-4">
											<div className="h-10 w-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
												<Sparkles className="h-5 w-5" />
											</div>
											<div>
												<span className="block font-bold text-neutral-900 text-sm">
													Add-ons Included
												</span>
												<span className="text-xs text-neutral-500 line-clamp-2">
													{bookingData.selectedAddOns
														.map((a: any) => a.name)
														.join(', ')}
												</span>
											</div>
										</div>
									)}
								</div>
							</div>

							{/* Right: Payment Summary */}
							<div className="p-8 bg-neutral-50/50">
								<h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-6 flex items-center gap-2">
									<CreditCard className="h-4 w-4" /> Payment Summary
								</h3>

								<div className="space-y-3 text-sm mb-6">
									<div className="flex justify-between text-neutral-600">
										<span>
											Venue Rental ({bookingData.numberOfDays}{' '}
											{bookingData.numberOfDays > 1 ? 'days' : 'day'})
										</span>
										<span className="font-medium text-neutral-900">
											₦{bookingData.venueFee.toLocaleString()}
										</span>
									</div>
									<div className="flex justify-between text-neutral-600">
										<span>Add-ons & Services</span>
										<span className="font-medium text-neutral-900">
											₦
											{(
												bookingData.addOnsTotal + bookingData.cleaningFee
											).toLocaleString()}
										</span>
									</div>
									<div className="flex justify-between text-neutral-600">
										<span>VAT (7.5%)</span>
										<span className="font-medium text-neutral-900">
											₦{vat.toLocaleString()}
										</span>
									</div>
								</div>

								<Separator className="bg-neutral-200 mb-6" />

								<div className="flex justify-between items-end mb-6">
									<span className="font-bold text-neutral-900">Total Paid</span>
									<span className="text-2xl font-bold text-brand-blue">
										₦{grandTotal.toLocaleString()}
									</span>
								</div>

								<div className="bg-white border border-neutral-200 rounded-lg p-3 flex items-center gap-3 shadow-sm">
									<div className="h-8 w-12 bg-neutral-100 rounded border border-neutral-200 flex items-center justify-center">
										<div className="h-4 w-6 bg-blue-900/20 rounded-sm" />{' '}
										{/* Visaish placeholeder */}
									</div>
									<div className="text-xs">
										<p className="font-medium text-neutral-900">
											Paid with Card
										</p>
										<p className="text-neutral-500">ending in 4242</p>
									</div>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Footer Actions */}
				<div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
					<div className="flex gap-4 w-full sm:w-auto">
						<Button
							variant="outline"
							className="flex-1 sm:flex-none gap-2 h-12 rounded-xl border-neutral-200 text-neutral-700 hover:bg-neutral-50"
						>
							<Calendar className="h-4 w-4" />
							Add to Calendar
						</Button>
						<Button
							variant="outline"
							className="flex-1 sm:flex-none gap-2 h-12 rounded-xl border-neutral-200 text-neutral-700 hover:bg-neutral-50"
						>
							<Download className="h-4 w-4" />
							Receipt
						</Button>
					</div>
					<Button className="w-full sm:w-auto gap-2 bg-brand-gold hover:bg-brand-gold-hover text-white h-12 px-8 rounded-xl font-bold shadow-lg shadow-amber-500/20">
						Return to Dashboard
						<Home className="h-4 w-4" />
					</Button>
				</div>

				<div className="mt-12 text-center text-sm text-neutral-500">
					<p>
						Need to make changes?{' '}
						<Link
							href="#"
							className="font-medium text-brand-blue hover:underline"
						>
							Manage your booking
						</Link>{' '}
						or{' '}
						<Link
							href="#"
							className="font-medium text-brand-blue hover:underline"
						>
							contact support
						</Link>
						.
					</p>
				</div>
			</div>
		</div>
	);
}
