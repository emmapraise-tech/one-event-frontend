import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { DollarSign, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { ListingFormData } from '../ListingWizard';

interface StepProps {
	formData: ListingFormData;
	updateFormData: (data: Partial<ListingFormData>) => void;
	onNext: () => void;
	onBack: () => void;
	isFirstStep: boolean;
	isLastStep: boolean;
}

export function PricingStep({
	formData,
	updateFormData,
	onNext, // This will likely be "Publish" or similar for the last step
	onBack,
}: StepProps) {
	// Local state for calendar interactions (simple single date toggling for now to block dates)
	// In a real app, this might be a date range picker or multi-select
	const [blockedDates, setBlockedDates] = useState<Date[]>([
		new Date(2023, 9, 3),
	]); // Mock initial blocked date

	const toggleDate = (day: number) => {
		const date = new Date(2023, 9, day);
		// check if exists
		const exists = blockedDates.some(
			(d) =>
				d.getDate() === day && d.getMonth() === 9 && d.getFullYear() === 2023,
		);

		if (exists) {
			setBlockedDates((prev) =>
				prev.filter(
					(d) =>
						!(
							d.getDate() === day &&
							d.getMonth() === 9 &&
							d.getFullYear() === 2023
						),
				),
			);
		} else {
			setBlockedDates((prev) => [...prev, date]);
		}
	};

	const isBlocked = (day: number) => {
		return blockedDates.some(
			(d) =>
				d.getDate() === day && d.getMonth() === 9 && d.getFullYear() === 2023,
		);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onNext();
	};

	const handleStrategyChange = (isSinglePrice: boolean) => {
		updateFormData({
			priceStrategy: isSinglePrice ? 'daily' : 'weekday_weekend',
			// Optional: Clear or reset separate/base prices if needed, keeping simple for now
		});
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div className="flex items-center gap-2 mb-6">
				<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
					<DollarSign className="h-5 w-5" />
				</div>
				<h2 className="text-lg font-semibold">Pricing & Availability</h2>
			</div>

			<div className="grid gap-12 lg:grid-cols-[360px_1fr]">
				{/* Pricing Section */}
				<div className="space-y-8">
					{/* Strategy Toggle */}
					<div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
						<div className="flex items-start gap-3">
							<div className="flex h-6 items-center">
								<input
									id="price-strategy"
									name="price-strategy"
									type="checkbox"
									className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
									checked={formData.priceStrategy === 'daily'}
									onChange={(e) => handleStrategyChange(e.target.checked)}
								/>
							</div>
							<div className="text-sm">
								<label
									htmlFor="price-strategy"
									className="font-medium text-gray-900 cursor-pointer"
								>
									I use the same price for all days
								</label>
								<p className="text-gray-500 mt-1">
									Check this if your pricing is flat regardless of whether it's
									a weekday or weekend.
								</p>
							</div>
						</div>
					</div>

					{formData.priceStrategy === 'weekday_weekend' ? (
						<div className="space-y-6 animate-in slide-in-from-top-2 duration-300">
							<div className="grid gap-3">
								<Label
									htmlFor="weekdayPrice"
									className="text-base font-medium text-gray-700"
								>
									Weekday Price (Mon-Thu)
								</Label>
								<div className="relative shadow-sm">
									<div className="flex">
										<div className="flex items-center justify-center border border-r-0 border-gray-200 rounded-l-lg bg-gray-50 px-4 text-gray-500 font-medium min-w-[48px]">
											₦
										</div>
										<Input
											id="weekdayPrice"
											type="number"
											className="rounded-l-none rounded-r-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 text-base h-12"
											placeholder="0.00"
											value={formData.weekdayPrice || ''}
											onChange={(e) =>
												updateFormData({ weekdayPrice: Number(e.target.value) })
											}
										/>
									</div>
								</div>
							</div>

							<div className="grid gap-3">
								<Label
									htmlFor="weekendPrice"
									className="text-base font-medium text-gray-700"
								>
									Weekend Price (Fri-Sun)
								</Label>
								<div className="relative shadow-sm">
									<div className="flex">
										<div className="flex items-center justify-center border border-r-0 border-gray-200 rounded-l-lg bg-gray-50 px-4 text-gray-500 font-medium min-w-[48px]">
											₦
										</div>
										<Input
											id="weekendPrice"
											type="number"
											className="rounded-l-none rounded-r-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 text-base h-12"
											placeholder="0.00"
											value={formData.weekendPrice || ''}
											onChange={(e) =>
												updateFormData({ weekendPrice: Number(e.target.value) })
											}
										/>
									</div>
								</div>
							</div>
						</div>
					) : (
						<div className="grid gap-3 animate-in slide-in-from-top-2 duration-300">
							<Label
								htmlFor="basePrice"
								className="text-base font-medium text-gray-700"
							>
								Daily Price
							</Label>
							<div className="relative shadow-sm">
								<div className="flex">
									<div className="flex items-center justify-center border border-r-0 border-gray-200 rounded-l-lg bg-gray-50 px-4 text-gray-500 font-medium min-w-[48px]">
										₦
									</div>
									<Input
										id="basePrice"
										type="number"
										className="rounded-l-none rounded-r-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 text-base h-12"
										placeholder="0.00"
										value={formData.basePrice || ''}
										onChange={(e) =>
											updateFormData({ basePrice: Number(e.target.value) })
										}
									/>
								</div>
							</div>
						</div>
					)}

					<div className="grid gap-3">
						<div className="flex items-center justify-between">
							<Label
								htmlFor="cleaningFee"
								className="text-base font-medium text-gray-700"
							>
								Cleaning Fee
							</Label>
							<span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
								Optional
							</span>
						</div>
						<div className="relative shadow-sm">
							<div className="flex">
								<div className="flex items-center justify-center border border-r-0 border-gray-200 rounded-l-lg bg-gray-50 px-4 text-gray-500 font-medium min-w-[48px]">
									$
								</div>
								<Input
									id="cleaningFee"
									type="number"
									className="rounded-l-none rounded-r-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 text-base h-12"
									placeholder="0.00"
								/>
							</div>
						</div>
					</div>
				</div>

				{/* Calendar Section */}
				<div className="space-y-3">
					<Label className="text-base font-medium text-gray-700">
						Availability Calendar
					</Label>
					<div className="rounded-2xl border border-gray-200 p-6 bg-white shadow-sm select-none">
						<div className="mb-6 flex items-center justify-between">
							<span className="text-lg font-bold text-gray-900">
								October 2023
							</span>
							<div className="flex gap-2">
								<Button
									variant="outline"
									size="icon"
									className="h-9 w-9 border-gray-200 hover:bg-gray-50 hover:text-blue-600"
								>
									<ChevronLeft className="h-5 w-5" />
								</Button>
								<Button
									variant="outline"
									size="icon"
									className="h-9 w-9 border-gray-200 hover:bg-gray-50 hover:text-blue-600"
								>
									<ChevronRight className="h-5 w-5" />
								</Button>
							</div>
						</div>

						{/* Simple Custom Calendar Grid Mockup matching design */}
						<div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-400 mb-4 uppercase tracking-wider">
							<div>Su</div>
							<div>Mo</div>
							<div>Tu</div>
							<div>We</div>
							<div>Th</div>
							<div>Fr</div>
							<div>Sa</div>
						</div>
						<div className="grid grid-cols-7 gap-3 text-center text-sm font-medium">
							{/* Empty days */}
							<div className="h-10 p-2 text-gray-200">28</div>
							<div className="h-10 p-2 text-gray-200">29</div>
							<div className="h-10 p-2 text-gray-200">30</div>
							{/* Days */}
							{Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
								const blocked = isBlocked(day);
								return (
									<div
										key={day}
										onClick={() => toggleDate(day)}
										className={`
											h-10 w-10 flex items-center justify-center rounded-lg cursor-pointer mx-auto transition-all duration-200
											${
												blocked
													? 'bg-blue-600 text-white shadow-md shadow-blue-200 scale-105'
													: 'hover:bg-gray-100 hover:text-blue-600 text-gray-700'
											}
										`}
									>
										{day}
									</div>
								);
							})}
						</div>

						<div className="mt-8 rounded-xl bg-blue-50 p-4 text-sm text-blue-700 flex items-start gap-3">
							<Info className="h-5 w-5 shrink-0 mt-0.5" />
							<span>
								Select dates to block them from being booked. Currently
								selecting: <strong>{blockedDates.length} days blocked</strong>.
							</span>
						</div>
					</div>
				</div>
			</div>

			<div className="flex justify-between pt-4">
				<Button type="button" variant="outline" onClick={onBack}>
					Back
				</Button>
				{/* Button logic handled in wrapper mostly, but good to have here too */}
			</div>
		</form>
	);
}
