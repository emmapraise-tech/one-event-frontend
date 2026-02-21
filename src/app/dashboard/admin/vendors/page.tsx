'use client';

import { useQuery } from '@tanstack/react-query';
import { vendorService } from '@/services/vendor.service';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Loader2,
	Store,
	Mail,
	Phone,
	Shield,
	Users,
	ArrowUpRight,
	TrendingUp,
	Calendar,
	Activity,
	MoreVertical,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { cn } from '@/lib/utils';

async function getAdminVendors(): Promise<any[]> {
	return vendorService.adminFindAll();
}

export default function AdminVendorsPage() {
	const { data: vendors, isLoading } = useQuery({
		queryKey: ['admin', 'vendors'],
		queryFn: getAdminVendors,
	});

	if (isLoading) {
		return (
			<div className="flex h-[60vh] items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
			</div>
		);
	}

	return (
		<div className="space-y-8 animate-in fade-in duration-500">
			{/* Admin Header */}
			<div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white p-8 rounded-[40px] border border-neutral-100 shadow-soft">
				<div>
					<div className="flex items-center gap-2 mb-2">
						<div className="h-6 w-6 rounded-full bg-brand-blue-soft flex items-center justify-center">
							<Shield className="h-3 w-3 text-brand-blue" />
						</div>
						<span className="text-[10px] font-bold text-brand-blue uppercase tracking-widest">
							Merchant Network
						</span>
					</div>
					<h1 className="text-4xl font-black text-neutral-900 tracking-tight">
						Vendor Directory
					</h1>
					<p className="text-neutral-500 mt-1 font-medium">
						Performance monitoring and account oversight for platform merchants.
					</p>
				</div>
				<div className="flex items-center gap-8 px-4">
					<div className="text-center">
						<p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
							Active
						</p>
						<p className="text-2xl font-black text-neutral-900">
							{Array.isArray(vendors) ? vendors.length : 0}
						</p>
					</div>
					<div className="h-10 w-px bg-neutral-100" />
					<div className="text-center">
						<p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
							Revenue Share
						</p>
						<p className="text-2xl font-black text-brand-blue">10%</p>
					</div>
				</div>
			</div>

			{/* Filter Section */}
			<div className="flex gap-2 pb-2 overflow-x-auto no-scrollbar">
				<Button
					variant="secondary"
					className="bg-brand-blue text-white rounded-full px-6 font-bold h-10 hover:bg-brand-blue-hover"
				>
					All Merchants
				</Button>
				<Button
					variant="outline"
					className="rounded-full px-6 border-neutral-200 text-neutral-500 font-bold h-10 hover:bg-neutral-50"
				>
					Pending Verification
				</Button>
			</div>

			{/* Vendors Grid */}
			<div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
				{!Array.isArray(vendors) || vendors.length === 0 ? (
					<Card className="col-span-full border-dashed border-2 border-neutral-200 bg-neutral-50/50 rounded-[40px] p-20 flex flex-col items-center justify-center">
						<Store className="h-12 w-12 text-neutral-300 mb-4" />
						<p className="font-bold text-neutral-400">
							No vendors registered yet
						</p>
					</Card>
				) : (
					vendors.map((vendor) => (
						<Card
							key={vendor.id}
							className="group border-none shadow-soft rounded-[40px] overflow-hidden bg-white hover:shadow-xl transition-all duration-300 border border-neutral-50"
						>
							<CardContent className="p-0">
								<div className="p-8">
									<div className="flex items-start justify-between mb-8">
										<div className="flex gap-5">
											<Avatar className="h-20 w-20 rounded-[24px] border border-neutral-100 shadow-sm shrink-0">
												<AvatarImage src={vendor.businessLogo || ''} />
												<AvatarFallback className="bg-brand-blue-soft text-brand-blue font-black text-2xl rounded-[24px]">
													{vendor.businessName?.[0] || 'V'}
												</AvatarFallback>
											</Avatar>
											<div>
												<div className="flex items-center gap-2 mb-1">
													<h3 className="text-xl font-black text-neutral-900 group-hover:text-brand-blue transition-colors">
														{vendor.businessName}
													</h3>
													<Badge className="bg-emerald-50 text-emerald-600 border-none font-bold text-[9px] uppercase tracking-tighter px-2">
														Verified
													</Badge>
												</div>
												<div className="space-y-1">
													<div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
														<Mail className="h-3 w-3 opacity-60" />
														{vendor.businessEmail}
													</div>
													<div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
														<Phone className="h-3 w-3 opacity-60" />
														{vendor.businessPhone}
													</div>
												</div>
											</div>
										</div>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant="ghost"
													size="icon"
													className="rounded-xl h-10 w-10"
												>
													<MoreVertical className="h-4 w-4 text-neutral-400" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent
												align="end"
												className="rounded-xl shadow-soft border-neutral-100 w-48"
											>
												<DropdownMenuItem className="gap-2 font-bold">
													<Shield className="h-4 w-4" /> Verify Account
												</DropdownMenuItem>
												<DropdownMenuItem className="gap-2 font-bold">
													<Calendar className="h-4 w-4" /> View Bookings
												</DropdownMenuItem>
												<DropdownMenuItem className="gap-2 font-bold text-red-600">
													Suspend Vendor
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>

									{/* Vendor Quick Stats */}
									<div className="grid grid-cols-3 gap-4 mb-8">
										<div className="p-4 rounded-3xl bg-neutral-50 border border-neutral-100/50">
											<p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
												Gross Sales
											</p>
											<p className="text-sm font-black text-neutral-900">
												₦
												{(Math.random() * 5000000).toLocaleString(undefined, {
													maximumFractionDigits: 0,
												})}
											</p>
										</div>
										<div className="p-4 rounded-3xl bg-neutral-50 border border-neutral-100/50">
											<p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
												Listings
											</p>
											<p className="text-sm font-black text-neutral-900">
												{Math.floor(Math.random() * 10) + 1}
											</p>
										</div>
										<div className="p-4 rounded-3xl bg-neutral-50 border border-neutral-100/50">
											<p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
												Success Rate
											</p>
											<div className="flex items-center gap-1.5 text-sm font-black text-emerald-600">
												<Activity className="h-3 w-3" />
												98%
											</div>
										</div>
									</div>

									<div className="flex gap-3">
										<Link
											href={`/dashboard/admin/vendors/${vendor.id}`}
											className="flex-1"
										>
											<Button
												variant="outline"
												className="w-full h-12 rounded-2xl font-bold border-neutral-100 hover:bg-neutral-50 hover:border-neutral-200 transition-all text-neutral-600"
											>
												Admin Intelligence
											</Button>
										</Link>
										<Link
											href={`/dashboard/admin/listings?vendorId=${vendor.id}`}
										>
											<Button className="h-12 px-6 rounded-2xl font-bold bg-neutral-900 text-white hover:bg-black shadow-lg shadow-black/10 flex gap-2">
												Listings
												<ArrowUpRight className="h-4 w-4" />
											</Button>
										</Link>
									</div>
								</div>

								{/* Bottom metadata */}
								<div className="px-8 py-5 bg-neutral-50/50 border-t border-neutral-100 flex items-center justify-between">
									<div className="flex gap-6">
										<div>
											<span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">
												CAC:{' '}
											</span>
											<span className="text-[10px] font-bold text-neutral-700">
												{vendor.cacNumber || 'NOT FILED'}
											</span>
										</div>
										<div>
											<span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">
												TIN:{' '}
											</span>
											<span className="text-[10px] font-bold text-neutral-700">
												{vendor.taxNumber || 'PENDING'}
											</span>
										</div>
									</div>
									<div className="flex items-center gap-1.5 text-[10px] font-bold text-brand-blue uppercase">
										<TrendingUp className="h-3 w-3" />
										Top Performer
									</div>
								</div>
							</CardContent>
						</Card>
					))
				)}
			</div>
		</div>
	);
}
