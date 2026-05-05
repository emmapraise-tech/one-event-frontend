'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MapPin, Calendar, Clock, User, Building, Receipt as ReceiptIcon } from 'lucide-react';
import { format } from 'date-fns';

interface ReceiptProps {
	bookingData: any;
	refCode: string;
	customerName: string;
}

export const Receipt: React.FC<ReceiptProps> = ({ bookingData, refCode, customerName }) => {
	const venueFee = bookingData.venueFee || 0;
	const addOnsTotal = bookingData.addOnsTotal || 0;
	const subtotal = venueFee + addOnsTotal;
	const serviceCharge = bookingData.serviceCharge || subtotal * 0.05;
	const vat = bookingData.vat || (subtotal + serviceCharge) * 0.075;
	const grandTotal = bookingData.totalAmount || subtotal + vat + serviceCharge;
	const amountPaid = bookingData.paymentPreference === 'deposit' 
		? (bookingData.depositAmount || (subtotal * 0.7 + serviceCharge + vat)) 
		: grandTotal;

	return (
		<div id="booking-receipt" className="bg-white p-8 max-w-2xl mx-auto border shadow-sm rounded-xl print:shadow-none print:border-none">
			{/* Header */}
			<div className="flex justify-between items-start mb-8">
				<div>
					<h1 className="text-3xl font-extrabold text-brand-blue flex items-center gap-2">
						One<span className="text-brand-gold">Event</span>
					</h1>
					<p className="text-xs text-neutral-400 mt-1 uppercase tracking-widest font-bold">Official Payment Receipt</p>
				</div>
				<div className="text-right">
					<div className="bg-brand-blue text-white px-4 py-2 rounded-lg font-bold text-sm inline-block">
						RECEIPT #{refCode.slice(-8).toUpperCase()}
					</div>
					<p className="text-sm text-neutral-500 mt-2">
						Date: {format(new Date(), 'MMMM dd, yyyy')}
					</p>
				</div>
			</div>

			<Separator className="my-8 bg-neutral-200" />

			{/* Info Grid */}
			<div className="grid grid-cols-2 gap-12 mb-10">
				<div>
					<h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-4 flex items-center gap-2">
						<User className="h-3 w-3" /> Customer Details
					</h3>
					<div className="space-y-1">
						<p className="font-bold text-neutral-900">{customerName}</p>
						<p className="text-sm text-neutral-500">Booking Reference: {refCode}</p>
					</div>
				</div>
				<div>
					<h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-4 flex items-center gap-2">
						<Building className="h-3 w-3" /> Venue Details
					</h3>
					<div className="space-y-1">
						<p className="font-bold text-neutral-900">{bookingData.venueName}</p>
						{bookingData.hallName && (
							<p className="text-sm text-neutral-600 font-medium">{bookingData.hallName}</p>
						)}
						<p className="text-sm text-neutral-500 flex items-center gap-1">
							<MapPin className="h-3 w-3" /> {bookingData.venueAddress}
						</p>
					</div>
				</div>
			</div>

			{/* Booking Details */}
			<div className="bg-neutral-50 rounded-2xl p-6 mb-10 border border-neutral-100 grid grid-cols-3 gap-4">
				<div>
					<p className="text-[10px] font-bold text-neutral-400 uppercase mb-1">Event Date</p>
					<p className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
						<Calendar className="h-3.5 w-3.5 text-brand-blue" />
						{format(new Date(bookingData.dateRange?.from || bookingData.date), 'MMM dd, yyyy')}
					</p>
				</div>
				<div>
					<p className="text-[10px] font-bold text-neutral-400 uppercase mb-1">Duration</p>
					<p className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
						<Clock className="h-3.5 w-3.5 text-brand-blue" />
						{bookingData.numberOfDays || 1} {bookingData.numberOfDays > 1 ? 'Days' : 'Day'}
					</p>
				</div>
				<div>
					<p className="text-[10px] font-bold text-neutral-400 uppercase mb-1">Guests</p>
					<p className="text-sm font-bold text-neutral-900">
						{bookingData.guests || 0} People
					</p>
				</div>
			</div>

			{/* Items Table */}
			<div className="mb-10">
				<table className="w-full text-sm">
					<thead>
						<tr className="border-b border-neutral-200">
							<th className="text-left pb-4 font-bold text-neutral-900 uppercase text-[10px]">Description</th>
							<th className="text-right pb-4 font-bold text-neutral-900 uppercase text-[10px]">Amount</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-neutral-100">
						<tr>
							<td className="py-4 text-neutral-700">
								Venue Rental Fee
								{bookingData.paymentPreference === 'deposit' && (
									<span className="ml-2 text-[10px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full font-bold">70% Deposit</span>
								)}
							</td>
							<td className="py-4 text-right font-medium text-neutral-900">
								₦ {bookingData.paymentPreference === 'deposit' ? (venueFee * 0.7).toLocaleString() : venueFee.toLocaleString()}
							</td>
						</tr>
						{bookingData.selectedAddOns?.map((addon: any, idx: number) => (
							<tr key={idx}>
								<td className="py-4 text-neutral-700">{addon.name}</td>
								<td className="py-4 text-right font-medium text-neutral-900">₦ {addon.price?.toLocaleString()}</td>
							</tr>
						))}
						<tr>
							<td className="py-4 text-neutral-700 font-medium">Service Charge (5%)</td>
							<td className="py-4 text-right font-medium text-neutral-900">₦ {serviceCharge.toLocaleString()}</td>
						</tr>
						<tr>
							<td className="py-4 text-neutral-700 font-medium">VAT (7.5%)</td>
							<td className="py-4 text-right font-medium text-neutral-900">₦ {vat.toLocaleString()}</td>
						</tr>
					</tbody>
				</table>
			</div>

			{/* Total Summary */}
			<div className="flex justify-end">
				<div className="w-64 space-y-3">
					<div className="flex justify-between text-neutral-500">
						<span>Subtotal</span>
						<span className="font-medium text-neutral-900">₦ {subtotal.toLocaleString()}</span>
					</div>
					<div className="flex justify-between text-neutral-500">
						<span>Fees & Taxes</span>
						<span className="font-medium text-neutral-900">₦ {(serviceCharge + vat).toLocaleString()}</span>
					</div>
					<Separator className="bg-neutral-200" />
					<div className="flex justify-between items-center pt-2">
						<span className="font-extrabold text-neutral-900 text-lg uppercase tracking-tight">
							{bookingData.paymentPreference === 'deposit' ? 'Paid (Deposit)' : 'Total Paid'}
						</span>
						<span className="text-2xl font-black text-brand-blue tracking-tighter">
							₦ {amountPaid.toLocaleString()}
						</span>
					</div>
				</div>
			</div>

			{/* Footer Message */}
			<div className="mt-16 text-center border-t border-dashed border-neutral-200 pt-8">
				<div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-4">
					<ReceiptIcon className="h-5 w-5" />
				</div>
				<h4 className="font-bold text-neutral-900">Thank you for your business!</h4>
				<p className="text-xs text-neutral-500 mt-1">This is an automated receipt. If you have any questions, contact support@oneevent.com</p>
				
				<div className="mt-8 opacity-30 grayscale contrast-125">
					<p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">OneEvent Platform Payment Secured</p>
				</div>
			</div>
		</div>
	);
};
