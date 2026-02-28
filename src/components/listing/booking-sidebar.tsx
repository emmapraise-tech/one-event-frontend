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
import { useState, useEffect, useMemo } from 'react';
import {
	format,
	differenceInDays,
	eachDayOfInterval,
	startOfDay,
} from 'date-fns';
import { DateRange } from 'react-day-picker';
import { Calendar } from '@/components/ui/calendar';
import { useQuery } from '@tanstack/react-query';
import { LoginModal } from '@/components/auth/login-modal';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import {
	Loader2,
	CheckCircle2,
	Star,
	Lock,
	ShieldCheck,
	X,
	AlertCircle,
} from 'lucide-react';

import { useRouter } from 'next/navigation';
import { AddOn } from '@/types/listing';
import { bookingService } from '@/services/booking.service';
import { useAuth } from '@/hooks/useAuth';

interface BookingSidebarProps {
	basePrice: number;
	currency: string;
	venueName?: string;
	venueAddress?: string;
	addOns?: AddOn[];
	venueImage?: string;
	rating?: number;
	reviewCount?: number;
	listingId: string;
}

export function BookingSidebar({
	basePrice,
	currency,
	venueName,
	venueAddress,
	venueImage,
	rating = 0,
	reviewCount = 0,
	addOns = [],
	listingId,
}: BookingSidebarProps) {
	const router = useRouter();
	const { isAuthenticated, isLoading: authLoading } = useAuth();
	const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
	const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
	const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
	const [availabilityMessage, setAvailabilityMessage] = useState<string>('');
	const [guests, setGuests] = useState('100-200');
	const [customGuests, setCustomGuests] = useState('');
	const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);
	const [paymentPreference, setPaymentPreference] = useState('full');

	// Default date range: today for 1 day
	const [dateRange, setDateRange] = useState<DateRange | undefined>({
		from: new Date(),
		to: undefined,
	});

	const { data: listingBookingsPaginated } = useQuery({
		queryKey: ['bookings', 'listing', listingId],
		queryFn: () => bookingService.findByListingId(listingId),
	});

	const listingBookings = listingBookingsPaginated?.data || [];

	const disabledDates = useMemo(() => {
		let dates: Date[] = [];
		if (!listingBookings.length) return dates;
		listingBookings.forEach((booking: any) => {
			if (booking.status === 'CONFIRMED' || booking.status === 'PENDING') {
				try {
					const start = new Date(booking.startDate);
					const end = new Date(booking.endDate);
					dates = [...dates, ...eachDayOfInterval({ start, end })];
				} catch (e) {}
			}
		});
		return dates;
	}, [listingBookings]);

	const disabledDateMatcher = useMemo(() => {
		return [{ before: startOfDay(new Date()) }, ...disabledDates];
	}, [disabledDates]);

	const numberOfDays =
		dateRange?.from && dateRange?.to
			? differenceInDays(dateRange.to, dateRange.from) + 1
			: 1;

	const CLEANING_FEE = 50000;

	const venueFee = basePrice * numberOfDays;
	const cleaningFee = CLEANING_FEE;

	const addOnsTotal = addOns
		.filter((addon) => selectedAddOnIds.includes(addon.id))
		.reduce((sum, addon) => sum + (addon.price || 0), 0);

	const total = venueFee + cleaningFee + addOnsTotal;
	const deposit = total * 0.7;

	useEffect(() => {
		const checkAvailability = async () => {
			if (!dateRange?.from) return;

			setIsCheckingAvailability(true);
			setIsAvailable(null);

			try {
				const startDate = format(dateRange.from, 'yyyy-MM-dd');
				const endDate = dateRange.to
					? format(dateRange.to, 'yyyy-MM-dd')
					: startDate;

				const result = await bookingService.checkAvailability({
					listingId,
					startDate,
					endDate,
				});

				setIsAvailable(result.available);
				setAvailabilityMessage(
					result.available
						? 'Venue is available for these dates'
						: 'Venue is already booked for these dates',
				);
			} catch (error) {
				console.error('Error checking availability:', error);
				setIsAvailable(false);
				setAvailabilityMessage('Could not verify availability');
			} finally {
				setIsCheckingAvailability(false);
			}
		};

		checkAvailability();
	}, [dateRange, listingId]);

	const toggleAddOn = (id: string) => {
		setSelectedAddOnIds((prev) =>
			prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
		);
	};

	const handleProceed = () => {
		const selectedAddOnsData = addOns.filter((addon) =>
			selectedAddOnIds.includes(addon.id),
		);

		const bookingDetails = {
			venueName,
			venueAddress,
			venueImage,
			venueStartPrice: basePrice,
			venueFee,
			cleaningFee,
			addOnsTotal,
			selectedAddOns: selectedAddOnsData,
			total,
			guests: guests === 'others' ? customGuests : guests,
			dateRange,
			numberOfDays,
			date: dateRange?.from ? format(dateRange.from, 'PPP') : '',
			listingId,
		};

		localStorage.setItem('bookingDetails', JSON.stringify(bookingDetails));

		if (!isAuthenticated) {
			setIsLoginModalOpen(true);
			return;
		}

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
							<span>{rating}</span>
							<span className="text-neutral-400 font-normal">
								({reviewCount})
							</span>
						</div>
					</div>
					<div>
						<span className="text-3xl font-bold text-brand-blue">
							₦ {basePrice.toLocaleString()}
						</span>
						<span className="text-neutral-500 text-sm"> /day</span>
					</div>

					{isCheckingAvailability ? (
						<div className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg border border-blue-100">
							<Loader2 className="h-3.5 w-3.5 animate-spin" />
							Checking availability...
						</div>
					) : isAvailable === true ? (
						<div className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 text-xs font-medium rounded-lg border border-green-100">
							<CheckCircle2 className="h-3.5 w-3.5" />
							{availabilityMessage}
						</div>
					) : isAvailable === false ? (
						<div className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-700 text-xs font-medium rounded-lg border border-red-100">
							<AlertCircle className="h-3.5 w-3.5" />
							{availabilityMessage}
						</div>
					) : null}
				</div>

				{/* Date Selection */}
				<div className="rounded-xl border border-neutral-200 overflow-hidden">
					<div className="flex border-b border-neutral-200">
						{/* Start Date Popover */}
						<Popover>
							<PopoverTrigger asChild>
								<div className="flex-1 p-3 hover:bg-neutral-50 transition-colors border-r border-neutral-200 cursor-pointer">
									<label className="text-[10px] font-bold text-neutral-800 block mb-0.5 uppercase tracking-wide">
										Start Date
									</label>
									<div className="text-sm font-medium text-neutral-600 truncate">
										{dateRange?.from
											? format(dateRange.from, 'LLL dd, y')
											: 'Pick a date'}
									</div>
								</div>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0" align="start">
								<Calendar
									initialFocus
									mode="single"
									defaultMonth={dateRange?.from}
									selected={dateRange?.from}
									onSelect={(date) => {
										setDateRange((prev) => ({
											from: date,
											to:
												prev?.to && date && date > prev.to
													? undefined
													: prev?.to,
										}));
									}}
									numberOfMonths={1}
									disabled={disabledDateMatcher}
									modifiers={{
										booked: disabledDates,
										past: { before: startOfDay(new Date()) },
									}}
									modifiersClassNames={{
										booked:
											'bg-red-100 !text-red-600 font-semibold line-through rounded-md opacity-100',
										past: 'opacity-40 text-neutral-400',
									}}
								/>
							</PopoverContent>
						</Popover>

						{/* End Date Popover */}
						<Popover>
							<PopoverTrigger asChild>
								<div className="flex-1 p-3 hover:bg-neutral-50 transition-colors cursor-pointer">
									<label className="text-[10px] font-bold text-neutral-800 block mb-0.5 uppercase tracking-wide">
										End Date
									</label>
									<div className="text-sm font-medium text-neutral-600 truncate">
										{dateRange?.to
											? format(dateRange.to, 'LLL dd, y')
											: 'Pick a date'}
									</div>
								</div>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0" align="start">
								<Calendar
									initialFocus
									mode="single"
									defaultMonth={dateRange?.to || dateRange?.from}
									selected={dateRange?.to}
									onSelect={(date) => {
										setDateRange((prev) => ({
											from: prev?.from,
											to: date,
										}));
									}}
									numberOfMonths={1}
									disabled={[
										{ before: dateRange?.from || startOfDay(new Date()) },
										...disabledDates,
									]}
									modifiers={{
										booked: disabledDates,
										past: { before: startOfDay(new Date()) },
									}}
									modifiersClassNames={{
										booked:
											'bg-red-100 !text-red-600 font-semibold line-through rounded-md opacity-100',
										past: 'opacity-40 text-neutral-400',
									}}
								/>
							</PopoverContent>
						</Popover>
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

				{/* Add-ons */}
				{addOns.length > 0 && (
					<div className="space-y-3">
						<Label className="text-xs font-semibold text-neutral-text-muted uppercase">
							Add-ons
						</Label>
						<div className="space-y-3">
							{addOns.map((addon) => {
								const isSelected = selectedAddOnIds.includes(addon.id);
								return (
									<div
										key={addon.id}
										className={`flex items-center justify-between rounded-lg border p-4 cursor-pointer transition-all ${
											isSelected
												? 'border-brand-blue bg-brand-blue-soft'
												: 'border-neutral-border hover:bg-neutral-bg'
										}`}
										onClick={() => toggleAddOn(addon.id)}
									>
										<div className="flex items-center space-x-3 pointer-events-none">
											<Checkbox
												id={addon.id}
												checked={isSelected}
												className="text-primary-blue border-neutral-300 data-[state=checked]:bg-brand-blue data-[state=checked]:border-brand-blue rounded data-[state=checked]:text-white"
											/>
											<label
												htmlFor={addon.id}
												className="text-sm font-medium leading-none cursor-pointer text-neutral-700"
											>
												{addon.name}
											</label>
										</div>
										<span className="text-sm font-semibold text-neutral-600 shrink-0">
											+ ₦ {addon.price.toLocaleString()}
										</span>
									</div>
								);
							})}
						</div>
					</div>
				)}

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
								<div className="grid gap-0.5 max-w-[200px] sm:max-w-none">
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
								₦ {total.toLocaleString()}
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
								<div className="grid gap-0.5 max-w-[200px] sm:max-w-none">
									<Label
										htmlFor="pay-deposit"
										className="text-sm font-bold text-neutral-900 cursor-pointer"
									>
										Pay Deposit (70%)
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
								₦ {deposit.toLocaleString()}
							</span>
						</div>
					</RadioGroup>
				</div>

				<div className="bg-neutral-50 p-4 rounded-lg space-y-2 border border-neutral-100">
					<div className="flex justify-between text-sm">
						<span className="text-neutral-500">
							Venue Fee ({numberOfDays} {numberOfDays > 1 ? 'days' : 'day'})
						</span>
						<span className="font-medium text-neutral-900">
							₦ {venueFee.toLocaleString()}
						</span>
					</div>
					<div className="flex justify-between text-sm">
						<span className="text-neutral-500">Cleaning & Service</span>
						<span className="font-medium text-neutral-900">
							₦ {cleaningFee.toLocaleString()}
						</span>
					</div>

					<div className="flex justify-between text-sm">
						<span className="text-neutral-500">Add-ons</span>
						<span className="font-medium text-neutral-900">
							₦ {addOnsTotal.toLocaleString()}
						</span>
					</div>
					<Separator className="my-2 bg-neutral-200" />
					<div className="flex justify-between text-base font-bold text-neutral-900">
						<span>Total</span>
						<span className="font-bold text-brand-blue">
							₦ {total.toLocaleString()}
						</span>
					</div>
				</div>

				<Button
					onClick={handleProceed}
					disabled={
						authLoading || isCheckingAvailability || isAvailable === false
					}
					className="w-full bg-brand-gold hover:bg-brand-gold-hover text-neutral-900 font-bold h-12 text-base shadow-sm"
				>
					{authLoading ? (
						<Loader2 className="h-4 w-4 animate-spin mr-2" />
					) : null}
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

			<LoginModal
				isOpen={isLoginModalOpen}
				onOpenChange={setIsLoginModalOpen}
				onSuccess={() => router.push('/booking/summary')}
			/>
		</Card>
	);
}
