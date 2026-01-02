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
import { CalendarIcon, UserIcon } from 'lucide-react';

interface BookingSidebarProps {
	basePrice: number;
	currency: string;
}

export function BookingSidebar({ basePrice, currency }: BookingSidebarProps) {
	const [guests, setGuests] = useState('100-200');
	const [packageType, setPackageType] = useState('venue-only');

	// Mock calculations
	const venueFee = 600000;
	const cleaningFee = 50000;
	const addOns = 20000;
	const total = venueFee + cleaningFee + addOns;
	const deposit = total * 0.3;

	return (
		<Card className="sticky top-24 shadow-lg border-0 ring-1 ring-gray-200">
			<CardContent className="p-6 space-y-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div>
						<span className="text-xl font-bold text-gray-900">
							{currency} {venueFee.toLocaleString()}
						</span>
						<span className="text-gray-500 text-sm"> / hour</span>
					</div>
					<div className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
						Available Now
					</div>
				</div>

				{/* Date & Time */}
				<div className="grid grid-cols-2 rounded-lg border border-gray-200 overflow-hidden">
					<div className="border-r border-gray-200 p-3">
						<label className="text-xs font-semibold text-gray-500 block mb-1">
							CHECK-IN
						</label>
						<div className="text-sm font-medium text-gray-900">Oct 12</div>
					</div>
					<div className="p-3">
						<label className="text-xs font-semibold text-gray-500 block mb-1">
							DURATION
						</label>
						<div className="text-sm font-medium text-gray-900">4 Hours</div>
					</div>
				</div>

				{/* Guests */}
				<div className="space-y-2">
					<Label className="text-xs font-semibold text-gray-500 uppercase">
						Number of Guests
					</Label>
					<Select value={guests} onValueChange={setGuests}>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="0-50">0-50 Guests</SelectItem>
							<SelectItem value="50-100">50-100 Guests</SelectItem>
							<SelectItem value="100-200">100-200 Guests</SelectItem>
							<SelectItem value="200+">200+ Guests</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Package Selection */}
				<div className="space-y-3">
					<Label className="text-xs font-semibold text-gray-500 uppercase">
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
									? 'border-primary bg-blue-50/50'
									: 'hover:bg-gray-50'
							}`}
						>
							<div className="flex items-start gap-3">
								<RadioGroupItem
									value="venue-only"
									id="venue-only"
									className="mt-1"
								/>
								<div>
									<Label
										htmlFor="venue-only"
										className="font-semibold cursor-pointer"
									>
										Venue Only
									</Label>
									<p className="text-xs text-gray-500 mt-1">
										Empty hall, tables, chairs, AC.
									</p>
								</div>
							</div>
							<span className="text-xs font-bold text-primary">Included</span>
						</div>

						<div
							className={`flex items-center justify-between space-x-2 rounded-lg border p-4 cursor-pointer transition-all ${
								packageType === 'classic'
									? 'border-primary bg-blue-50/50'
									: 'hover:bg-gray-50'
							}`}
						>
							<div className="flex items-start gap-3">
								<RadioGroupItem value="classic" id="classic" className="mt-1" />
								<div>
									<Label
										htmlFor="classic"
										className="font-semibold cursor-pointer"
									>
										Classic Decor
									</Label>
									<p className="text-xs text-gray-500 mt-1">
										Includes stage design, lighting, centerpiece.
									</p>
								</div>
							</div>
							<span className="text-xs font-medium text-gray-900">
								+₦200,000
							</span>
						</div>
					</RadioGroup>
				</div>

				{/* Add-ons */}
				<div className="space-y-3">
					<Label className="text-xs font-semibold text-gray-500 uppercase">
						Add-ons
					</Label>
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-2">
								<Checkbox id="security" />
								<label
									htmlFor="security"
									className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
								>
									Security Unit (4 guards)
								</label>
							</div>
							<span className="text-sm text-gray-500">+₦50,000</span>
						</div>
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-2">
								<Checkbox id="changing-room" defaultChecked />
								<label
									htmlFor="changing-room"
									className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
								>
									Changing Room
								</label>
							</div>
							<span className="text-sm text-gray-500">+₦20,000</span>
						</div>
					</div>
				</div>

				{/* Payment Preference */}
				<div className="space-y-3">
					<Label className="text-xs font-semibold text-gray-500 uppercase">
						Payment Preference
					</Label>
					<RadioGroup defaultValue="deposit" className="grid gap-3">
						<div className="flex items-center justify-between rounded-lg border p-4">
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="deposit" id="pay-deposit" />
								<div className="grid gap-0.5">
									<Label
										htmlFor="pay-deposit"
										className="text-sm font-semibold"
									>
										Pay Deposit (30%)
									</Label>
									<p className="text-xs text-gray-500">
										Secure your date now, pay the rest later.
									</p>
								</div>
							</div>
							<span className="text-sm font-bold text-primary">
								₦{deposit.toLocaleString()}
							</span>
						</div>
						<div className="flex items-center justify-between rounded-lg border p-4">
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="full" id="pay-full" />
								<div className="grid gap-0.5">
									<Label htmlFor="pay-full" className="text-sm font-medium">
										Pay In Full
									</Label>
									<p className="text-xs text-gray-500">
										Get instant confirmation receipt.
									</p>
								</div>
							</div>
							<span className="text-sm font-medium text-gray-900">
								₦{total.toLocaleString()}
							</span>
						</div>
					</RadioGroup>
				</div>

				<div className="bg-gray-50 p-4 rounded-lg space-y-2">
					<div className="flex justify-between text-sm">
						<span className="text-gray-600">Venue Fee (4hrs)</span>
						<span className="font-medium text-gray-900">
							₦{venueFee.toLocaleString()}
						</span>
					</div>
					<div className="flex justify-between text-sm">
						<span className="text-gray-600">Cleaning & Service</span>
						<span className="font-medium text-gray-900">
							₦{cleaningFee.toLocaleString()}
						</span>
					</div>
					<div className="flex justify-between text-sm">
						<span className="text-gray-600">Add-ons</span>
						<span className="font-medium text-gray-900">
							₦{addOns.toLocaleString()}
						</span>
					</div>
					<Separator className="my-2" />
					<div className="flex justify-between text-base font-bold">
						<span>Total</span>
						<span>₦{total.toLocaleString()}</span>
					</div>
				</div>

				<Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold h-12 text-base">
					Proceed to Payment →
				</Button>

				<p className="text-center text-xs text-muted-foreground">
					By proceeding, you agree to the{' '}
					<span className="underline cursor-pointer">cancellation policy</span>.
				</p>
			</CardContent>
		</Card>
	);
}
