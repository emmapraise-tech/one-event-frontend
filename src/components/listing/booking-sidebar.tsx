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
	Sparkles,
	List,
} from 'lucide-react';

import { Textarea } from '@/components/ui/textarea';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AddOn, FormField } from '@/types/listing';
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
	slug?: string;
	formFields?: FormField[];
	halls?: any[];
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
	slug,
	formFields = [],
	halls = [],
}: BookingSidebarProps) {
	const params = useParams();
	const router = useRouter();
	const currentSlug = slug || (params?.slug as string);
	const { isAuthenticated, isLoading: authLoading } = useAuth();
	const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
	const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
	const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
	const [availabilityMessage, setAvailabilityMessage] = useState<string>('');
	const [guests, setGuests] = useState('100-200');
	const [customGuests, setCustomGuests] = useState('');
	const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);
	const [paymentPreference, setPaymentPreference] = useState('full');
	const [customFormData, setCustomFormData] = useState<Record<string, any>>({});
	const [formErrors, setFormErrors] = useState<Record<string, string>>({});
	const [selectedHallId, setSelectedHallId] = useState<string>('');

	// Default date range: today for 1 day
	const [dateRange, setDateRange] = useState<DateRange | undefined>({
		from: new Date(),
		to: undefined,
	});

	const { data: listingBookingsPaginated } = useQuery({
		queryKey: ['bookings', 'listing', listingId, selectedHallId],
		queryFn: () => bookingService.findByListingId(listingId, selectedHallId || undefined),
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

	const selectedHall = halls.find(h => h.id === selectedHallId);
	const activePrice = selectedHall ? selectedHall.price : basePrice;

	const venueFee = activePrice * numberOfDays;
	const addOnsTotal = addOns
		.filter((addon) => selectedAddOnIds.includes(addon.id))
		.reduce((sum, addon) => sum + (addon.price || 0), 0);

	const subTotal = venueFee + addOnsTotal;
	const serviceCharge = subTotal * 0.05; // 5% Service Charge
	const vat = (subTotal + serviceCharge) * 0.075; // 7.5% VAT on (Subtotal + Service Charge)
	const total = subTotal + vat + serviceCharge;

	// Calculate deposit: 70% of subtotal + 100% of fees (SC + VAT)
	const depositAmount = subTotal * 0.7 + serviceCharge + vat;

	// Auto-select hall if only one exists
	useEffect(() => {
		if (halls && halls.length === 1 && !selectedHallId) {
			setSelectedHallId(halls[0].id);
		}
	}, [halls, selectedHallId]);

	useEffect(() => {
		const checkAvailability = async () => {
			if (!dateRange?.from || (halls.length > 0 && !selectedHallId)) {
				setIsAvailable(null);
				setAvailabilityMessage(
					halls.length > 0 && dateRange?.from
						? 'Select a hall to check availability'
						: '',
				);
				setIsCheckingAvailability(false);
				return;
			}

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
					hallId: selectedHallId || undefined,
				});

				setIsAvailable(result.available);
				setAvailabilityMessage(
					result.available
						? 'Available for these date(s)'
						: 'Already booked for these date(s)',
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
	}, [dateRange, listingId, selectedHallId]);

	const toggleAddOn = (id: string) => {
		setSelectedAddOnIds((prev) =>
			prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
		);
	};

	const handleProceed = () => {
		if (halls.length > 0 && !selectedHallId) {
			toast.error('Please select a hall to book', { id: 'booking-error' });
			return;
		}

		// Validating custom form fields
		if (formFields.length > 0) {
			const errors: Record<string, string> = {};
			for (const field of formFields) {
				if (field.required && !customFormData[field.id]) {
					errors[field.id] = `${field.label} is required`;
				}
			}
			if (Object.keys(errors).length > 0) {
				setFormErrors(errors);
				return;
			}
			setFormErrors({});
		}

		const selectedAddOnsData = addOns.filter((addon) =>
			selectedAddOnIds.includes(addon.id),
		);

		const bookingDetails = {
			venueName,
			venueAddress,
			venueImage,
			venueStartPrice: basePrice,
			venueFee,
			vat,
			serviceCharge,
			addOnsTotal,
			selectedAddOns: selectedAddOnsData,
			totalAmount: total,
			total,
			depositAmount,
			paymentPreference,
			guests: guests === 'others' ? customGuests : guests,
			dateRange: {
				from: dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined,
				to: dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined,
			},
			numberOfDays,
			date: dateRange?.from ? format(dateRange.from, 'PPP') : '',
			listingId,
			slug: currentSlug,
			hallId: selectedHallId || undefined,
			hallName: selectedHall?.name,
			formData: customFormData,
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
							₦ {activePrice.toLocaleString()}
						</span>
						<span className="text-neutral-500 text-sm"> /day</span>
					</div>

					{halls && halls.length > 0 && (
						<div className="space-y-2 mt-4">
							<Label className="text-xs font-bold text-neutral-800 uppercase tracking-wide">
								Select Hall
							</Label>
							<Select value={selectedHallId} onValueChange={setSelectedHallId}>
								<SelectTrigger className="w-full bg-white border-neutral-200">
									<SelectValue placeholder="Choose a hall" />
								</SelectTrigger>
								<SelectContent className="bg-white">
									{halls.map(hall => (
										<SelectItem key={hall.id} value={hall.id}>
											{hall.name} - ₦{hall.price.toLocaleString()} (Cap: {hall.capacity})
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					)}

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

				{/* Custom Form Fields */}
				{formFields.length > 0 && (
					<div className="space-y-4">
						<Label className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
							Additional Information
						</Label>
						<div className="space-y-5">
							{formFields.map((field) => (
								<div key={field.id} className="space-y-2">
									<Label className="text-[13px] font-bold text-neutral-800 flex items-center gap-1.5">
										{field.label}{' '}
										{field.required && <span className="text-red-500">*</span>}
									</Label>

									{field.type === 'textarea' ? (
										<Textarea
											placeholder={`Enter ${field.label.toLowerCase()}`}
											value={customFormData[field.id] || ''}
											onChange={(e) =>
												setCustomFormData({
													...customFormData,
													[field.id]: e.target.value,
												})
											}
											className={`resize-none bg-neutral-50 border-neutral-200 focus:bg-white transition-all rounded-xl ${formErrors[field.id] ? 'border-red-500 bg-red-50/30' : ''}`}
											rows={3}
										/>
									) : field.type === 'date' ? (
										<Input
											type="date"
											value={customFormData[field.id] || ''}
											onChange={(e) =>
												setCustomFormData({
													...customFormData,
													[field.id]: e.target.value,
												})
											}
											className={`bg-neutral-50 border-neutral-200 focus:bg-white transition-all rounded-xl ${formErrors[field.id] ? 'border-red-500 bg-red-50/30' : ''}`}
										/>
									) : field.type === 'color' ? (
										<div className="flex items-center gap-3">
											<Input
												type="color"
												value={customFormData[field.id] || '#000000'}
												onChange={(e) =>
													setCustomFormData({
														...customFormData,
														[field.id]: e.target.value,
													})
												}
												className="w-12 h-10 p-1 rounded-lg cursor-pointer border-neutral-200"
											/>
											<span className="text-sm font-medium text-neutral-600 uppercase">
												{customFormData[field.id] || '#000000'}
											</span>
										</div>
									) : field.type === 'checkbox' ? (
										<div className="flex items-center space-x-2 py-1">
											<Checkbox
												id={field.id}
												checked={customFormData[field.id] || false}
												onCheckedChange={(checked: boolean) =>
													setCustomFormData({
														...customFormData,
														[field.id]: checked,
													})
												}
												className="data-[state=checked]:bg-brand-blue data-[state=checked]:border-brand-blue"
											/>
											<label
												htmlFor={field.id}
												className="text-sm font-medium text-neutral-600 cursor-pointer"
											>
												{field.label}
											</label>
										</div>
									) : field.type === 'radio' ? (
										<RadioGroup
											value={customFormData[field.id] || ''}
											onValueChange={(val) =>
												setCustomFormData({
													...customFormData,
													[field.id]: val,
												})
											}
											className="grid gap-2 pt-1"
										>
											{field.options?.map((option) => (
												<div
													key={option}
													className="flex items-center space-x-2"
												>
													<RadioGroupItem
														value={option}
														id={`${field.id}-${option}`}
														className="text-brand-blue border-neutral-300"
													/>
													<Label
														htmlFor={`${field.id}-${option}`}
														className="text-sm font-medium text-neutral-600 cursor-pointer"
													>
														{option}
													</Label>
												</div>
											))}
										</RadioGroup>
									) : field.type === 'select' ? (
										<Select
											value={customFormData[field.id] || ''}
											onValueChange={(val) =>
												setCustomFormData({
													...customFormData,
													[field.id]: val,
												})
											}
										>
											<SelectTrigger
												className={`bg-neutral-50 border-neutral-200 focus:bg-white transition-all rounded-xl ${formErrors[field.id] ? 'border-red-500 bg-red-50/30' : ''}`}
											>
												<SelectValue
													placeholder={`Select ${field.label.toLowerCase()}`}
												/>
											</SelectTrigger>
											<SelectContent className="bg-white">
												{field.options?.map((option) => (
													<SelectItem key={option} value={option}>
														{option}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									) : field.type === 'image' || field.type === 'file' ? (
										<div className="space-y-2">
											<div
												className={`relative border-2 border-dashed rounded-xl p-4 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${
													customFormData[field.id]
														? 'border-brand-blue/50 bg-brand-blue/5'
														: 'border-neutral-200 bg-neutral-50 hover:bg-neutral-100 hover:border-neutral-300'
												} ${formErrors[field.id] ? 'border-red-500 bg-red-50/30' : ''}`}
												onClick={() =>
													document.getElementById(`file-${field.id}`)?.click()
												}
											>
												<input
													id={`file-${field.id}`}
													type="file"
													className="hidden"
													accept={field.type === 'image' ? 'image/*' : '*/*'}
													onChange={(e) => {
														const file = e.target.files?.[0];
														if (file) {
															// For now, we store the file name or a base64 preview
															// In a real app, you'd upload this to a server
															setCustomFormData({
																...customFormData,
																[field.id]: file.name,
															});
														}
													}}
												/>
												<div
													className={`w-8 h-8 rounded-full flex items-center justify-center ${customFormData[field.id] ? 'bg-brand-blue-soft text-brand-blue' : 'bg-white text-neutral-400 border border-neutral-100'}`}
												>
													{field.type === 'image' ? (
														<Sparkles className="h-4 w-4" />
													) : (
														<List className="h-4 w-4" />
													)}
												</div>
												<div className="text-center">
													<p className="text-[13px] font-bold text-neutral-800">
														{customFormData[field.id] ||
															`Upload ${field.type === 'image' ? 'Image' : 'Document'}`}
													</p>
													<p className="text-[11px] text-neutral-500">
														{customFormData[field.id]
															? 'Click to change file'
															: 'Maximum file size: 5MB'}
													</p>
												</div>
											</div>
										</div>
									) : (
										<Input
											type={field.type === 'number' ? 'number' : 'text'}
											placeholder={`Enter ${field.label.toLowerCase()}`}
											value={customFormData[field.id] || ''}
											onChange={(e) =>
												setCustomFormData({
													...customFormData,
													[field.id]: e.target.value,
												})
											}
											className={`bg-neutral-50 border-neutral-200 focus:bg-white transition-all rounded-xl ${formErrors[field.id] ? 'border-red-500 bg-red-50/30' : ''}`}
										/>
									)}

									{formErrors[field.id] && (
										<p className="text-[11px] text-red-500 font-bold mt-1 flex items-center gap-1">
											<AlertCircle className="h-3 w-3" /> {formErrors[field.id]}
										</p>
									)}
								</div>
							))}
						</div>
					</div>
				)}

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
										className="text-sm font-bold text-neutral-900 cursor-pointer"
									>
										Full payment of the hall
									</Label>
									<p className="text-xs text-neutral-500">
										Pay the full price for the hall booking.
									</p>
								</div>
							</div>
							<span
								className={`text-sm font-bold ${
									paymentPreference === 'full'
										? 'text-brand-blue'
										: 'text-neutral-900'
								}`}
							>
								₦ {subTotal.toLocaleString()}
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
										Deposit of the hall
									</Label>
									<p className="text-xs text-neutral-500">
										Pay a 70% deposit for the hall booking.
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
								₦ {(subTotal * 0.7).toLocaleString()}
							</span>
						</div>
					</RadioGroup>
				</div>

				<div className="bg-neutral-50 p-4 rounded-lg space-y-2 border border-neutral-100 animate-in fade-in duration-300">
					<div className="flex justify-between text-sm">
						<span className="text-neutral-500">
							Venue Fee {paymentPreference === 'deposit' ? '(70% Deposit)' : ''} (
							{numberOfDays} {numberOfDays > 1 ? 'days' : 'day'})
						</span>
						<span className="font-medium text-neutral-900">
							₦{' '}
							{paymentPreference === 'deposit'
								? (venueFee * 0.7).toLocaleString()
								: venueFee.toLocaleString()}
						</span>
					</div>
					<div className="flex justify-between text-sm">
						<span className="text-neutral-500">
							Add-ons {paymentPreference === 'deposit' ? '(70% Deposit)' : ''}
						</span>
						<span className="font-medium text-neutral-900">
							₦{' '}
							{paymentPreference === 'deposit'
								? (addOnsTotal * 0.7).toLocaleString()
								: addOnsTotal.toLocaleString()}
						</span>
					</div>
					<div className="flex justify-between text-sm">
						<span className="text-neutral-500">Service Charge (5%)</span>
						<span className="font-medium text-neutral-900">
							₦ {serviceCharge.toLocaleString()}
						</span>
					</div>
					<div className="flex justify-between text-sm">
						<span className="text-neutral-500">VAT (7.5%)</span>
						<span className="font-medium text-neutral-900">
							₦ {vat.toLocaleString()}
						</span>
					</div>
					<Separator className="my-2 bg-neutral-200" />
					<div className="flex justify-between text-base font-bold text-neutral-900">
						<span>{paymentPreference === 'deposit' ? 'Payable Now' : 'Total'}</span>
						<span className="font-bold text-brand-blue">
							₦{' '}
							{paymentPreference === 'deposit'
								? depositAmount.toLocaleString()
								: total.toLocaleString()}
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
