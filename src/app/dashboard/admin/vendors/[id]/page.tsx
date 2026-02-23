'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { vendorService } from '@/services/vendor.service';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import {
	Loader2,
	ArrowLeft,
	Store,
	Mail,
	Phone,
	Globe,
	FileText,
	Building2,
	CreditCard,
	ShieldCheck,
	CheckCircle2,
} from 'lucide-react';

export default function AdminVendorDetailsPage() {
	const params = useParams();
	const vendorId = params?.id as string;

	const {
		data: vendor,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['admin', 'vendors', vendorId],
		queryFn: () => vendorService.findOne(vendorId),
		enabled: !!vendorId,
	});

	if (isLoading) {
		return (
			<div className="flex h-[60vh] items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
			</div>
		);
	}

	if (!vendor || error) {
		return (
			<div className="flex flex-col h-[60vh] items-center justify-center space-y-4">
				<Store className="h-16 w-16 text-neutral-300" />
				<h2 className="text-xl font-bold text-neutral-600">Vendor Not Found</h2>
				<p className="text-neutral-400">
					The vendor you are looking for does not exist or has been removed.
				</p>
				<Link href="/dashboard/admin/vendors">
					<Button variant="outline" className="mt-4">
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to Vendors
					</Button>
				</Link>
			</div>
		);
	}

	return (
		<div className="space-y-8 animate-in fade-in duration-500">
			{/* Header */}
			<div className="flex items-center gap-4 mb-6">
				<Link href="/dashboard/admin/vendors">
					<Button
						variant="ghost"
						size="icon"
						className="rounded-full hover:bg-neutral-100"
					>
						<ArrowLeft className="h-5 w-5 text-neutral-600" />
					</Button>
				</Link>
				<div>
					<h1 className="text-3xl font-black text-neutral-900 tracking-tight">
						Vendor Intelligence
					</h1>
					<p className="text-neutral-500 font-medium">
						Detailed overview and operational metrics for this merchant.
					</p>
				</div>
			</div>

			{/* Main Content */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Left Column - Profile & Quick Actions */}
				<div className="lg:col-span-1 space-y-8">
					<Card className="border-none shadow-soft rounded-[40px] overflow-hidden bg-white">
						<CardContent className="p-8 flex flex-col items-center text-center">
							<Avatar className="h-32 w-32 rounded-[32px] border border-neutral-100 shadow-sm mb-6">
								<AvatarImage src={vendor.businessLogo || ''} />
								<AvatarFallback className="bg-brand-blue-soft text-brand-blue font-black text-4xl rounded-[32px]">
									{vendor.businessName?.[0] || 'V'}
								</AvatarFallback>
							</Avatar>
							<div className="flex items-center gap-2 mb-2">
								<h2 className="text-2xl font-black text-neutral-900">
									{vendor.businessName}
								</h2>
								<ShieldCheck className="h-6 w-6 text-emerald-500" />
							</div>
							<Badge className="bg-brand-blue-soft text-brand-blue border-none font-bold text-[10px] uppercase tracking-wider px-3 py-1 mb-6">
								Verified Merchant
							</Badge>

							<div className="w-full space-y-4 pt-6 border-t border-neutral-100 text-left">
								<div className="flex items-center gap-3 text-sm font-medium text-neutral-600">
									<Mail className="h-4 w-4 text-neutral-400" />
									{vendor.businessEmail || 'No email provided'}
								</div>
								<div className="flex items-center gap-3 text-sm font-medium text-neutral-600">
									<Phone className="h-4 w-4 text-neutral-400" />
									{vendor.businessPhone || 'No phone provided'}
								</div>
								{vendor.businessWebsite && (
									<div className="flex items-center gap-3 text-sm font-medium text-neutral-600">
										<Globe className="h-4 w-4 text-neutral-400" />
										<a
											href={
												vendor.businessWebsite.startsWith('http')
													? vendor.businessWebsite
													: `https://${vendor.businessWebsite}`
											}
											target="_blank"
											rel="noopener noreferrer"
											className="hover:text-brand-blue underline-offset-4 hover:underline"
										>
											{vendor.businessWebsite}
										</a>
									</div>
								)}
								<div className="flex items-start gap-3 text-sm font-medium text-neutral-600">
									<Building2 className="h-4 w-4 text-neutral-400 shrink-0 mt-0.5" />
									<span className="leading-snug">
										{vendor.businessAddress || 'No address provided'}
									</span>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className="border-none shadow-soft rounded-[40px] overflow-hidden bg-neutral-900 text-white">
						<CardContent className="p-8">
							<h3 className="text-lg font-bold mb-4 flex items-center gap-2">
								<CheckCircle2 className="h-5 w-5 text-emerald-400" /> Vendor
								Status
							</h3>
							<p className="text-neutral-400 text-sm mb-6 leading-relaxed">
								This vendor account is fully active and compliant with platform
								policies. They are cleared to process transactions.
							</p>
							<Button className="w-full bg-white text-neutral-900 hover:bg-neutral-100 font-bold rounded-2xl h-12">
								Suspend Vendor
							</Button>
						</CardContent>
					</Card>
				</div>

				{/* Right Column - Details & Documents */}
				<div className="lg:col-span-2 space-y-8">
					{/* Description */}
					<Card className="border-none shadow-soft rounded-[40px] overflow-hidden bg-white">
						<CardContent className="p-8">
							<h3 className="text-xl font-black text-neutral-900 mb-4 flex items-center gap-2">
								<FileText className="h-5 w-5 text-brand-blue" />
								Business Description
							</h3>
							<p className="text-neutral-600 leading-relaxed font-medium">
								{vendor.businessDescription ||
									'No description provided by the vendor.'}
							</p>
						</CardContent>
					</Card>

					{/* Registration & Tax */}
					<Card className="border-none shadow-soft rounded-[40px] overflow-hidden bg-white">
						<CardContent className="p-8">
							<h3 className="text-xl font-black text-neutral-900 mb-6 flex items-center gap-2">
								<Building2 className="h-5 w-5 text-brand-blue" />
								Corporate & Tax Information
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								<div className="p-5 rounded-3xl bg-neutral-50 border border-neutral-100">
									<p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">
										CAC Number
									</p>
									<p className="font-bold text-neutral-900">
										{vendor.cacNumber || 'NOT FILED'}
									</p>
								</div>
								<div className="p-5 rounded-3xl bg-neutral-50 border border-neutral-100">
									<p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">
										RC Number
									</p>
									<p className="font-bold text-neutral-900">
										{vendor.rcNumber || 'NOT FILED'}
									</p>
								</div>
								<div className="p-5 rounded-3xl bg-neutral-50 border border-neutral-100">
									<p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">
										Tax Number (TIN)
									</p>
									<p className="font-bold text-neutral-900">
										{vendor.taxNumber || 'PENDING'}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Bank Details */}
					<Card className="border-none shadow-soft rounded-[40px] overflow-hidden bg-white">
						<CardContent className="p-8">
							<div className="flex items-center justify-between mb-6">
								<h3 className="text-xl font-black text-neutral-900 flex items-center gap-2">
									<CreditCard className="h-5 w-5 text-brand-blue" />
									Settlement Account
								</h3>
								<Badge
									variant="outline"
									className="border-emerald-200 bg-emerald-50 text-emerald-600 font-bold uppercase text-[10px]"
								>
									Verified Bank
								</Badge>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="p-6 rounded-3xl bg-gradient-to-br from-neutral-900 to-neutral-800 text-white relative overflow-hidden">
									{/* Decorative shapes */}
									<div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-16 -mt-16" />
									<div className="absolute bottom-0 left-0 w-24 h-24 bg-brand-blue/20 rounded-full blur-xl -ml-12 -mb-12" />

									<div className="relative z-10">
										<p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
											Bank Name
										</p>
										<p className="text-xl font-black mb-6">
											{vendor.bankName || 'Not Set'}
										</p>

										<div className="flex justify-between items-end">
											<div>
												<p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
													Account Number
												</p>
												<p className="text-lg font-mono tracking-wider">
													{vendor.bankAccountNumber
														? vendor.bankAccountNumber
																.replace(/(\d{4})/g, '$1 ')
																.trim()
														: '**** **** ****'}
												</p>
											</div>
										</div>
									</div>
								</div>

								<div className="flex flex-col justify-center p-6 rounded-3xl bg-neutral-50 border border-neutral-100">
									<p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">
										Account Name (Beneficiary)
									</p>
									<p className="font-black text-neutral-900 text-lg">
										{vendor.bankAccountName || 'Not Set'}
									</p>
									<div className="mt-auto pt-4 flex items-center gap-2 text-xs font-bold text-neutral-400">
										<ShieldCheck className="h-4 w-4" />
										Name exactly matches corporate registration
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
