'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useState } from 'react';
import {
	CalendarIcon,
	UserIcon,
	CheckCircle2,
	Star,
	Lock,
	ShieldCheck,
	X,
} from 'lucide-react';

import { useRouter } from 'next/navigation';

interface BookingSidebarProps {
	basePrice: number;
	currency: string;
	venueName?: string;
	venueAddress?: string;
	venueImage?: string;
}

export function BookingSidebar({
	basePrice,
	currency,
	venueName,
	venueAddress,
	venueImage,
}: BookingSidebarProps) {
	const router = useRouter();
	const [guests, setGuests] = useState('100-200');
	const [customGuests, setCustomGuests] = useState('');
	const [packageType, setPackageType] = useState('venue-only');
	const [paymentPreference, setPaymentPreference] = useState('full');
	const [securitySelected, setSecuritySelected] = useState(false);
	const [changingRoomSelected, setChangingRoomSelected] = useState(true);

	// Default date/time for now, could be passed or picked
	const [date, setDate] = useState('Oct 24, 2024');
	const [time, setTime] = useState('2:00 PM - 6:00 PM');

	const CLASSIC_DECOR_PRICE = 200000;
	const SECURITY_PRICE = 50000;
	const CHANGING_ROOM_PRICE = 20000;
	const CLEANING_FEE = 50000;

	const venueFee = basePrice * 4;
	const cleaningFee = CLEANING_FEE;
	const packagePrice = packageType === 'classic' ? CLASSIC_DECOR_PRICE : 0;

	const addOnsTotal =
		(securitySelected ? SECURITY_PRICE : 0) +
		(changingRoomSelected ? CHANGING_ROOM_PRICE : 0);

	const total = venueFee + cleaningFee + packagePrice + addOnsTotal;
	const deposit = total * 0.3;

	const handleProceed = () => {
		const bookingDetails = {
			venueName,
			venueAddress,
			venueImage,
			venueStartPrice: basePrice,
			venueFee,
			cleaningFee,
			packageType,
			packagePrice,
			addOnsTotal,
			securitySelected,
			changingRoomSelected,
			total,
			guests: guests === 'others' ? customGuests : guests,
			date,
			time,
		};

		localStorage.setItem('bookingDetails', JSON.stringify(bookingDetails));
		router.push('/booking/summary');
	};

	return (
		<Card className="sticky top-24 shadow-[0_6px_16px_rgba(0,0,0,0.12)] border border-neutral-200 bg-white rounded-xl overflow-hidden">
			<CardContent className="p-6 space-y-6">
				{/* Header */}
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
							Start Booking
						</span>
						<div className="flex items-center gap-1 text-xs font-semibold text-neutral-700">
							<Star className="h-3 w-3 fill-brand-gold text-brand-gold" />
							<span>4.9</span>
							<span className="text-neutral-400 font-normal">(128)</span>
						</div>
					</div>
					<div>
						<span className="text-3xl font-bold text-brand-blue">
							₦{basePrice.toLocaleString()}
						</span>
						<span className="text-neutral-500 text-sm"> / hour</span>
					</div>
					<div className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 text-xs font-medium rounded-lg border border-green-100">
						<CheckCircle2 className="h-3.5 w-3.5" />
						Available for your date
					</div>
				</div>

				{/* Date, Duration & Guests */}
				<div className="rounded-xl border border-neutral-200 overflow-hidden">
					<div className="grid grid-cols-2 border-b border-neutral-200">
						<div className="border-r border-neutral-200 p-3 hover:bg-neutral-50 transition-colors cursor-pointer">
							<label className="text-[10px] font-bold text-neutral-800 block mb-0.5 uppercase tracking-wide">
								Event Date
							</label>
							<div className="text-sm font-medium text-neutral-600 truncate">
								{date}
							</div>
						</div>
						<div className="p-3 hover:bg-neutral-50 transition-colors cursor-pointer">
							<label className="text-[10px] font-bold text-neutral-800 block mb-0.5 uppercase tracking-wide">
								Time Slot
							</label>
							<div className="text-sm font-medium text-neutral-600 truncate">
								{time}
							</div>
						</div>
					</div>

					<div className="px-3 py-2 hover:bg-neutral-50 transition-colors">
						<label className="text-[10px] font-bold text-neutral-800 block mb-0 uppercase tracking-wide">
							Guests
						</label>
						{guests === 'others' ? (
							<div className="flex items-center gap-2">
								<Input
									type="number"
									placeholder="Enter number..."
									value={customGuests}
									onChange={(e) => setCustomGuests(e.target.value)}
									className="h-6 w-full border-none shadow-none p-0 focus-visible:ring-0 bg-transparent text-sm font-normal text-neutral-600 placeholder:text-neutral-400"
									autoFocus
								/>
								<Button
									variant="ghost"
									size="icon"
									className="h-5 w-5 hover:bg-neutral-200 rounded-full"
									onClick={() => setGuests('100-200')}
								>
									<X className="h-3 w-3 text-neutral-500" />
								</Button>
							</div>
						) : (
							<Select value={guests} onValueChange={setGuests}>
								<SelectTrigger className="w-full border-none shadow-none p-0 h-6 focus:ring-0 text-left justify-start font-normal text-neutral-600 bg-transparent">
									<SelectValue placeholder="Select guests" />
								</SelectTrigger>
								<SelectContent className="bg-white z-50">
									<SelectItem value="0-50">0-50 Guests</SelectItem>
									<SelectItem value="50-100">50-100 Guests</SelectItem>
									<SelectItem value="100-200">100-200 Guests</SelectItem>
									<SelectItem value="200+">200+ Guests</SelectItem>
									<SelectItem value="others">Others</SelectItem>
								</SelectContent>
							</Select>
						)}
					</div>
				</div>

				{/* Package Selection */}
				<div className="space-y-3">
					<Label className="text-xs font-semibold text-neutral-text-muted uppercase">
						Select Package
					</Label>
					<RadioGroup
						defaultValue="venue-only"
						className="grid gap-3"
						onValueChange={setPackageType}
					>
						<div
							className={`flex items-center justify-between space-x-2 rounded-lg border p-4 cursor-pointer transition-all ${
								packageType === 'venue-only'
									? 'border-brand-blue border-2 bg-brand-blue-soft'
									: 'border-neutral-border hover:bg-neutral-bg'
							}`}
						>
							<div className="flex items-start gap-3">
								<RadioGroupItem
									value="venue-only"
									id="venue-only"
									className="mt-1 text-brand-blue border-brand-blue"
								/>
								<div>
									<Label
										htmlFor="venue-only"
										className="font-bold cursor-pointer text-neutral-900"
									>
										Venue Only
									</Label>
									<p className="text-xs text-neutral-500 mt-1">
										Empty hall, tables, chairs, AC.
									</p>
								</div>
							</div>
							<span className="text-xs font-bold text-primary-blue uppercase tracking-wide">
								Included
							</span>
						</div>

						<div
							className={`flex items-center justify-between space-x-2 rounded-lg border p-4 cursor-pointer transition-all ${
								packageType === 'classic'
									? 'border-brand-blue border-2 bg-brand-blue-soft'
									: 'border-neutral-border hover:bg-neutral-bg'
							}`}
						>
							<div className="flex items-start gap-3">
								<RadioGroupItem
									value="classic"
									id="classic"
									className="mt-1 text-primary-blue border-primary-blue"
								/>
								<div>
									<Label
										htmlFor="classic"
										className="font-bold cursor-pointer text-neutral-900"
									>
										Classic Decor
									</Label>
									<p className="text-xs text-neutral-500 mt-1">
										Includes stage design, lighting, centerpiece.
									</p>
								</div>
							</div>
							<span className="text-xs font-medium text-neutral-900">
								+₦{CLASSIC_DECOR_PRICE.toLocaleString()}
							</span>
						</div>
					</RadioGroup>
				</div>

				{/* Add-ons */}
				<div className="space-y-3">
					<Label className="text-xs font-semibold text-neutral-text-muted uppercase">
						Add-ons
					</Label>
					<div className="space-y-3">
						<div
							className={`flex items-center justify-between rounded-lg border p-4 cursor-pointer transition-all ${
								securitySelected
									? 'border-brand-blue bg-brand-blue-soft'
									: 'border-neutral-border hover:bg-neutral-bg'
							}`}
							onClick={() => setSecuritySelected(!securitySelected)}
						>
							<div className="flex items-center space-x-3">
								<Checkbox
									id="security"
									checked={securitySelected}
									onCheckedChange={(checked) =>
										setSecuritySelected(checked === true)
									}
									className="text-primary-blue border-neutral-300 data-[state=checked]:bg-brand-blue data-[state=checked]:border-brand-blue rounded data-[state=checked]:text-white"
								/>
								<label
									htmlFor="security"
									className="text-sm font-medium leading-none cursor-pointer text-neutral-700"
									onClick={(e) => e.stopPropagation()} // Prevent double toggle if label is clicked
								>
									Security Unit (4 guards)
								</label>
							</div>
							<span className="text-sm text-neutral-500">
								+₦{SECURITY_PRICE.toLocaleString()}
							</span>
						</div>
						<div
							className={`flex items-center justify-between rounded-lg border p-4 cursor-pointer transition-all ${
								changingRoomSelected
									? 'border-brand-blue bg-brand-blue-soft'
									: 'border-neutral-border hover:bg-neutral-bg'
							}`}
							onClick={() => setChangingRoomSelected(!changingRoomSelected)}
						>
							<div className="flex items-center space-x-3">
								<Checkbox
									id="changing-room"
									checked={changingRoomSelected}
									onCheckedChange={(checked) =>
										setChangingRoomSelected(checked === true)
									}
									className="text-primary-blue border-neutral-300 data-[state=checked]:bg-brand-blue data-[state=checked]:border-brand-blue rounded data-[state=checked]:text-white"
								/>
								<label
									htmlFor="changing-room"
									className="text-sm font-medium leading-none cursor-pointer text-neutral-700"
									onClick={(e) => e.stopPropagation()}
								>
									Changing Room
								</label>
							</div>
							<span className="text-sm text-neutral-500">
								+₦{CHANGING_ROOM_PRICE.toLocaleString()}
							</span>
						</div>
					</div>
				</div>

				{/* Payment Preference */}
				<div className="space-y-3">
					<div className="flex items-center justify-between">
						<Label className="text-xs font-semibold text-neutral-text-muted uppercase">
							Payment Option
						</Label>
						<span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
							Recommended
						</span>
					</div>
					<RadioGroup
						value={paymentPreference}
						onValueChange={setPaymentPreference}
						className="grid gap-3"
					>
						<div
							className={`flex items-center justify-between rounded-lg border p-4 cursor-pointer transition-all ${
								paymentPreference === 'full'
									? 'border-brand-blue border-2 bg-brand-blue-soft'
									: 'border-neutral-border hover:bg-neutral-bg'
							}`}
							onClick={() => setPaymentPreference('full')}
						>
							<div className="flex items-center space-x-3">
								<RadioGroupItem
									value="full"
									id="pay-full"
									className="text-brand-blue border-brand-blue"
								/>
								<div className="grid gap-0.5">
									<Label
										htmlFor="pay-full"
										className="text-sm font-medium text-neutral-900 cursor-pointer"
									>
										Pay In Full
									</Label>
									<p className="text-xs text-neutral-500">
										Get instant confirmation receipt.
									</p>
								</div>
							</div>
							<span
								className={`text-sm font-medium ${
									paymentPreference === 'full'
										? 'text-brand-blue'
										: 'text-neutral-900'
								}`}
							>
								₦{total.toLocaleString()}
							</span>
						</div>

						<div
							className={`flex items-center justify-between rounded-lg border p-4 cursor-pointer transition-all ${
								paymentPreference === 'deposit'
									? 'border-brand-blue border-2 bg-brand-blue-soft'
									: 'border-neutral-border hover:bg-neutral-bg'
							}`}
							onClick={() => setPaymentPreference('deposit')}
						>
							<div className="flex items-center space-x-3">
								<RadioGroupItem
									value="deposit"
									id="pay-deposit"
									className="text-brand-blue border-brand-blue"
								/>
								<div className="grid gap-0.5">
									<Label
										htmlFor="pay-deposit"
										className="text-sm font-bold text-neutral-900 cursor-pointer"
									>
										Pay Deposit (30%)
									</Label>
									<p className="text-xs text-neutral-500">
										Secure your date now, pay the rest later.
									</p>
								</div>
							</div>
							<span
								className={`text-sm font-bold ${
									paymentPreference === 'deposit'
										? 'text-brand-blue'
										: 'text-neutral-900'
								}`}
							>
								₦{deposit.toLocaleString()}
							</span>
						</div>
					</RadioGroup>
				</div>

				<div className="bg-neutral-50 p-4 rounded-lg space-y-2 border border-neutral-100">
					<div className="flex justify-between text-sm">
						<span className="text-neutral-500">Venue Fee (4hrs)</span>
						<span className="font-medium text-neutral-900">
							₦{venueFee.toLocaleString()}
						</span>
					</div>
					<div className="flex justify-between text-sm">
						<span className="text-neutral-500">Cleaning & Service</span>
						<span className="font-medium text-neutral-900">
							₦{cleaningFee.toLocaleString()}
						</span>
					</div>
					{/* Conditionally show Package Fee if selected */}
					{packageType !== 'venue-only' && (
						<div className="flex justify-between text-sm">
							<span className="text-neutral-500">Classic Decor</span>
							<span className="font-medium text-neutral-900">
								₦{packagePrice.toLocaleString()}
							</span>
						</div>
					)}
					<div className="flex justify-between text-sm">
						<span className="text-neutral-500">Add-ons</span>
						<span className="font-medium text-neutral-900">
							₦{addOnsTotal.toLocaleString()}
						</span>
					</div>
					<Separator className="my-2 bg-neutral-200" />
					<div className="flex justify-between text-base font-bold text-neutral-900">
						<span>Total</span>
						<span className="font-bold text-brand-blue">
							₦{total.toLocaleString()}
						</span>
					</div>
				</div>

				<Button
					onClick={handleProceed}
					className="w-full bg-brand-gold hover:bg-brand-gold-hover text-neutral-900 font-bold h-12 text-base shadow-sm"
				>
					Proceed to Payment →
				</Button>

				<div className="text-center space-y-4 pt-2">
					<p className="text-xs text-neutral-500">
						No charge is made until you confirm in the next step.
					</p>
					<div className="flex items-center justify-center gap-4 text-[10px] text-neutral-400 font-medium uppercase tracking-wide">
						<div className="flex items-center gap-1">
							<Lock className="h-3 w-3" /> SSL Secure
						</div>
						<div className="flex items-center gap-1">
							<ShieldCheck className="h-3 w-3" /> Verified Vendor
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
