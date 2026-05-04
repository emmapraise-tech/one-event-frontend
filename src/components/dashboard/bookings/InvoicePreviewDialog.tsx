import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Booking } from '@/types/booking';
import { Printer, Download, X } from 'lucide-react';
import { format } from 'date-fns';

interface InvoicePreviewDialogProps {
	isOpen: boolean;
	onClose: () => void;
	booking: Booking;
	isCustomer: boolean;
}

export function InvoicePreviewDialog({
	isOpen,
	onClose,
	booking,
	isCustomer,
}: InvoicePreviewDialogProps) {
	if (!booking) return null;

	const handlePrint = () => {
		window.print();
	};

	const invoiceNumber = `INV-${booking.id.slice(-7).toUpperCase()}`;
	const currentDate = format(new Date(), 'MMM dd, yyyy');
	const bookingDate = format(new Date(booking.startDate), 'MMM dd, yyyy');

	const customerName = `${booking.customer?.firstName || ''} ${
		booking.customer?.lastName || ''
	}`.trim();
	const vendorName = booking.listing?.vendor?.businessName || 'OneEvent Host';

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="sm:max-w-3xl p-0 border-none rounded-3xl overflow-hidden shadow-2xl bg-gray-50 flex flex-col h-[90vh] sm:h-auto sm:max-h-[90vh]">
				{/* Header Actions - Not visible in print */}
				<div className="p-4 bg-white border-b flex justify-between items-center shrink-0 print:hidden sticky top-0 z-10">
					<DialogTitle className="text-lg font-bold text-gray-900">
						Invoice Preview
					</DialogTitle>
					<div className="flex gap-2">
						<Button
							variant="outline"
							onClick={onClose}
							className="rounded-xl hidden sm:flex"
						>
							Close
						</Button>
						<Button
							onClick={handlePrint}
							className="rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white shadow-md shadow-brand-blue/20"
						>
							<Printer className="mr-2 h-4 w-4" />
							Print / Save as PDF
						</Button>
					</div>
				</div>

				{/* Invoice Content - This is what gets printed */}
				<div className="p-6 sm:p-12 overflow-y-auto print:p-0 print:m-0 print:bg-white bg-white w-full mx-auto" id="printable-invoice">
					{/* Custom print styles to hide everything else */}
					<style dangerouslySetInnerHTML={{__html: `
						@media print {
							body * {
								visibility: hidden;
							}
							#printable-invoice, #printable-invoice * {
								visibility: visible;
							}
							#printable-invoice {
								position: absolute;
								left: 0;
								top: 0;
								width: 100%;
							}
						}
					`}} />

					<div className="flex justify-between items-start mb-12">
						<div>
							<h1 className="text-3xl font-black text-gray-900 tracking-tight">
								INVOICE
							</h1>
							<p className="text-gray-500 font-medium mt-1">
								{invoiceNumber}
							</p>
						</div>
						<div className="text-right">
							<div className="text-2xl font-black text-brand-blue">OneEvent</div>
							<p className="text-sm text-gray-500 mt-1">oneevent.com</p>
						</div>
					</div>

					<div className="grid sm:grid-cols-2 gap-8 mb-12">
						<div className="space-y-4">
							<div>
								<p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
									Billed To
								</p>
								<p className="text-base font-bold text-gray-900">
									{customerName || 'Guest User'}
								</p>
								<p className="text-sm text-gray-500">
									{booking.customer?.email}
								</p>
								{booking.customer?.phone && (
									<p className="text-sm text-gray-500">
										{booking.customer.phone}
									</p>
								)}
							</div>
						</div>
						<div className="space-y-4 sm:text-right">
							<div>
								<p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
									From
								</p>
								<p className="text-base font-bold text-gray-900">
									{vendorName}
								</p>
								<p className="text-sm text-gray-500">
									{booking.listing?.vendor?.businessEmail}
								</p>
								{booking.listing?.vendor?.businessPhone && (
									<p className="text-sm text-gray-500">
										{booking.listing.vendor.businessPhone}
									</p>
								)}
							</div>
							<div className="pt-2">
								<p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
									Event Date
								</p>
								<p className="text-sm font-semibold text-gray-900">
									{bookingDate}
								</p>
							</div>
						</div>
					</div>

					<div className="mb-12">
						<table className="w-full text-left border-collapse">
							<thead>
								<tr className="border-b-2 border-gray-100">
									<th className="py-3 text-xs font-bold text-gray-400 uppercase tracking-widest">
										Description
									</th>
									<th className="py-3 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">
										Amount
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-100">
								<tr>
									<td className="py-4">
										<p className="font-bold text-gray-900">Venue Rental</p>
										<p className="text-sm text-gray-500">
											{booking.listing?.name}{booking.hall ? ` - ${booking.hall.name}` : ''}
										</p>
									</td>
									<td className="py-4 text-right font-medium text-gray-900">
										{booking.currency} {(booking.details?.venueRentalFee || booking.basePrice).toLocaleString()}
									</td>
								</tr>

								{booking.details?.selectedAddOns?.map((addon: any) => (
									<tr key={addon.id}>
										<td className="py-4">
											<p className="font-bold text-gray-900">{addon.name}</p>
											<p className="text-sm text-gray-500">Add-on service</p>
										</td>
										<td className="py-4 text-right font-medium text-gray-900">
											{booking.currency} {addon.price.toLocaleString()}
										</td>
									</tr>
								))}

								{/* Cleaning Fee Removed */}
							</tbody>
						</table>
					</div>

					<div className="flex justify-end">
						<div className="w-full sm:w-1/2 space-y-3">
							<div className="flex justify-between text-sm">
								<span className="text-gray-500">Subtotal</span>
								<span className="font-medium text-gray-900">
									{booking.currency} {(
										(booking.details?.venueRentalFee || Number(booking.basePrice)) + 
										(booking.details?.selectedAddOns?.reduce((sum: number, a: any) => sum + Number(a.price), 0) || 0)
									).toLocaleString()}
								</span>
							</div>

							{(!isCustomer || booking.platformFee > 0) && (
								<div className="flex justify-between text-sm">
									<span className="text-gray-500">Service Charge (5%)</span>
									<span className="font-medium text-gray-900">
										{booking.currency} {Number(booking.platformFee).toLocaleString()}
									</span>
								</div>
							)}

							{booking.details?.vat > 0 && (
								<div className="flex justify-between text-sm">
									<span className="text-gray-500">VAT (7.5%)</span>
									<span className="font-medium text-gray-900">
										{booking.currency} {booking.details.vat.toLocaleString()}
									</span>
								</div>
							)}

							<div className="pt-4 border-t-2 border-gray-100 flex justify-between items-center">
								<span className="text-base font-bold text-gray-900">Total</span>
								<span className="text-2xl font-black text-brand-blue">
									{booking.currency} {(
										((booking.details?.venueRentalFee || Number(booking.basePrice)) + 
										(booking.details?.selectedAddOns?.reduce((sum: number, a: any) => sum + Number(a.price), 0) || 0)) +
										(booking.details?.vat || 0) +
										Number(booking.platformFee)
									).toLocaleString()}
								</span>
							</div>
							
							<div className="flex justify-between text-sm pt-2">
								<span className="text-gray-500">Amount Paid</span>
								<span className="font-medium text-emerald-600">
									{booking.currency} {
										(booking.fullPaymentPaid ? booking.totalAmount : (booking.depositPaid ? (booking.depositAmount || 0) : 0)).toLocaleString()
									}
								</span>
							</div>
							
							{!booking.fullPaymentPaid && (
								<div className="flex justify-between text-sm font-bold text-rose-600">
									<span>Balance Due</span>
									<span>
										{booking.currency} {
											(booking.totalAmount - (booking.depositPaid ? (booking.depositAmount || 0) : 0)).toLocaleString()
										}
									</span>
								</div>
							)}
						</div>
					</div>

					<div className="mt-16 pt-8 border-t border-gray-100 text-center text-sm text-gray-400">
						<p>Thank you for your business!</p>
						<p className="mt-1">If you have any questions about this invoice, please contact support.</p>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
