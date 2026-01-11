'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
	Calendar,
	CheckCircle,
	Clock,
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
				'#OE-' + Math.floor(100000 + Math.random() * 900000).toString()
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
				<div className="text-center mb-8">
					<div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100 mb-6">
						<CheckCircle className="h-10 w-10 text-green-600" />
					</div>
					<h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2">
						Booking Confirmed!
					</h1>
					<p className="text-neutral-500 text-lg">
						Your reservation at{' '}
						<span className="font-semibold text-neutral-900">
							{bookingData.venueName}
						</span>{' '}
						is secured.
					</p>
					<p className="text-sm text-neutral-400 mt-2">
						A confirmation email has been sent to{' '}
						<span className="font-medium text-neutral-600">
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
				<Card className="overflow-hidden border-neutral-200 shadow-lg">
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
								<div className="flex items-center gap-3 bg-neutral-50 px-4 py-3 rounded-lg border border-neutral-100 flex-1 min-w-[200px]">
									<div className="p-2 bg-white rounded-md shadow-sm text-brand-blue">
										<Calendar className="h-5 w-5" />
									</div>
									<div>
										<span className="text-[10px] font-bold text-neutral-400 uppercase block">
											Date
										</span>
										<span className="text-sm font-semibold text-neutral-900">
											Oct 24, 2024
										</span>
									</div>
								</div>
								<div className="flex items-center gap-3 bg-neutral-50 px-4 py-3 rounded-lg border border-neutral-100 flex-1 min-w-[200px]">
									<div className="p-2 bg-white rounded-md shadow-sm text-brand-blue">
										<Clock className="h-5 w-5" />
									</div>
									<div>
										<span className="text-[10px] font-bold text-neutral-400 uppercase block">
											Time
										</span>
										<span className="text-sm font-semibold text-neutral-900">
											5:00 PM - 11:00 PM
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

									<div className="flex items-start gap-4">
										<div className="h-10 w-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
											<Home className="h-5 w-5" />
										</div>
										<div>
											<span className="block font-bold text-neutral-900 text-sm">
												{bookingData.packageType === 'classic'
													? 'Classic Decor Package'
													: 'Venue Only'}
											</span>
											<span className="text-xs text-neutral-500">
												{bookingData.packageType === 'classic'
													? 'Includes stage design & lighting'
													: 'Standard hall rental'}
											</span>
										</div>
									</div>

									{(bookingData.securitySelected ||
										bookingData.changingRoomSelected) && (
										<div className="flex items-start gap-4">
											<div className="h-10 w-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
												<Sparkles className="h-5 w-5" />
											</div>
											<div>
												<span className="block font-bold text-neutral-900 text-sm">
													Add-ons Included
												</span>
												<span className="text-xs text-neutral-500">
													{[
														bookingData.securitySelected && 'Security',
														bookingData.changingRoomSelected && 'Changing Room',
													]
														.filter(Boolean)
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
										<span>Venue Rental</span>
										<span className="font-medium text-neutral-900">
											₦{bookingData.venueFee.toLocaleString()}
										</span>
									</div>
									<div className="flex justify-between text-neutral-600">
										<span>Add-ons & Services</span>
										<span className="font-medium text-neutral-900">
											₦
											{(
												bookingData.packagePrice +
												bookingData.addOnsTotal +
												bookingData.cleaningFee
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
						<Button variant="outline" className="flex-1 sm:flex-none gap-2">
							<Calendar className="h-4 w-4" />
							Add to Calendar
						</Button>
						<Button variant="outline" className="flex-1 sm:flex-none gap-2">
							<Download className="h-4 w-4" />
							Receipt
						</Button>
					</div>
					<Button className="w-full sm:w-auto gap-2 bg-brand-blue hover:bg-brand-blue-hover">
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
