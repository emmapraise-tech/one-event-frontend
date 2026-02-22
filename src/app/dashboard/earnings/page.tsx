'use client';

import { useAuth } from '@/hooks/useAuth';
import {
	Download,
	Upload,
	Wallet,
	HelpCircle,
	Shield,
	TrendingUp,
	Users,
	ArrowUpRight,
	Building2,
	DollarSign,
	PieChart,
	ArrowDownRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EarningsStats } from '@/components/dashboard/earnings/EarningsStats';
import { EarningsChart } from '@/components/dashboard/earnings/EarningsChart';
import {
	TransactionHistory,
	TransactionStatus,
	TransactionType,
} from '@/components/dashboard/earnings/TransactionHistory';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// Mock Data
const mockStats = {
	totalRevenue: 2540000,
	pendingPayouts: 150000,
	availableForPayout: 450000,
	revenueGrowth: 12.5,
};

const mockChartData = [
	{ name: 'Jan', total: 150000 },
	{ name: 'Feb', total: 230000 },
	{ name: 'Mar', total: 180000 },
	{ name: 'Apr', total: 320000 },
	{ name: 'May', total: 450000 },
	{ name: 'Jun', total: 380000 },
	{ name: 'Jul', total: 520000 },
];

const mockTransactions = [
	{
		id: 'TX-001',
		date: '2024-07-15T10:30:00',
		description: 'Booking Payment - Wedding Reception',
		amount: 350000,
		type: TransactionType.INFLOW,
		status: TransactionStatus.COMPLETED,
		reference: 'REF-892301',
	},
	{
		id: 'TX-002',
		date: '2024-07-12T14:15:00',
		description: 'Payout to Bank Account',
		amount: 200000,
		type: TransactionType.OUTFLOW,
		status: TransactionStatus.COMPLETED,
		reference: 'PAY-112233',
	},
];

const vendorEarningsMock = [
	{
		id: 'V-001',
		businessName: 'Grand Ballroom Lagos',
		revenue: 4500000,
		commission: 450000,
		growth: '+12%',
	},
	{
		id: 'V-002',
		businessName: 'Lekki Gardens Event Center',
		revenue: 2800000,
		commission: 280000,
		growth: '+5%',
	},
	{
		id: 'V-003',
		businessName: 'Victory Imperial Suites',
		revenue: 5200000,
		commission: 520000,
		growth: '+18%',
	},
	{
		id: 'V-004',
		businessName: 'Ikeja Pavilion',
		revenue: 1500000,
		commission: 150000,
		growth: '-2%',
	},
];

export default function EarningsPage() {
	const { user } = useAuth();
	const isAdmin = user?.type === 'ADMIN';

	if (isAdmin) {
		return (
			<div className="min-h-screen pb-20 animate-in fade-in duration-500">
				{/* Admin Header */}
				<div className="bg-white p-8 rounded-b-[40px] border-b border-neutral-100 shadow-soft mb-8">
					<div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
						<div>
							<div className="flex items-center gap-2 mb-2">
								<PieChart className="h-4 w-4 text-indigo-600" />
								<span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">
									Revenue Intelligence
								</span>
							</div>
							<h1 className="text-4xl font-black text-neutral-900 tracking-tight">
								System earnings
							</h1>
							<p className="text-neutral-500 mt-1 font-medium italic">
								Aggregate platform performance and commission tracking.
							</p>
						</div>
						<div className="flex gap-3">
							<Link href="/dashboard/admin/settlements">
								<Button className="bg-neutral-900 text-white hover:bg-black h-14 px-8 font-black rounded-2xl transition-all shadow-xl shadow-black/10">
									Manage Settlements
								</Button>
							</Link>
						</div>
					</div>
				</div>

				<div className="px-8 space-y-8">
					{/* Stats Grid */}
					<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
						<Card className="border-none shadow-soft rounded-[32px] bg-white p-6">
							<p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">
								Gross Marketplace Volume
							</p>
							<h3 className="text-2xl font-black text-neutral-900 leading-none mb-2">
								₦48.2M
							</h3>
							<div className="flex items-center text-xs font-bold text-emerald-600">
								<TrendingUp className="h-3 w-3 mr-1" /> +12.5% MTD
							</div>
						</Card>
						<Card className="border-none shadow-soft rounded-[32px] bg-indigo-600 p-6 text-white">
							<p className="text-[10px] font-bold text-indigo-100 uppercase tracking-widest mb-2">
								Platform Revenue (10%)
							</p>
							<h3 className="text-2xl font-black text-white leading-none mb-2">
								₦4.82M
							</h3>
							<div className="flex items-center text-xs font-bold text-indigo-100">
								<ArrowUpRight className="h-3 w-3 mr-1" /> On target
							</div>
						</Card>
						<Card className="border-none shadow-soft rounded-[32px] bg-white p-6">
							<p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">
								Active Subscriptions
							</p>
							<h3 className="text-2xl font-black text-neutral-900 leading-none mb-2">
								₦840k
							</h3>
							<div className="flex items-center text-xs font-bold text-neutral-400">
								<Users className="h-3 w-3 mr-1" /> 42 Premium vendors
							</div>
						</Card>
						<Card className="border-none shadow-soft rounded-[32px] bg-white p-6">
							<p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">
								Refund Allowance
							</p>
							<h3 className="text-2xl font-black text-rose-600 leading-none mb-2">
								₦225k
							</h3>
							<div className="flex items-center text-xs font-bold text-rose-400">
								<ArrowDownRight className="h-3 w-3 mr-1" /> 0.5% vs volume
							</div>
						</Card>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						<div className="lg:col-span-2 space-y-8">
							<EarningsChart data={mockChartData} />

							{/* Vendor Contributions */}
							<Card className="border-none shadow-soft rounded-[40px] overflow-hidden bg-white">
								<div className="p-8 border-b border-neutral-50 flex items-center justify-between">
									<div>
										<h3 className="text-lg font-black text-neutral-900">
											Revenue Contribution
										</h3>
										<p className="text-sm text-neutral-500">
											Breakdown of platform fees by vendor performance
										</p>
									</div>
									<Button
										variant="outline"
										className="rounded-xl border-neutral-200 font-bold h-10"
									>
										Export Report
									</Button>
								</div>
								<div className="overflow-x-auto">
									<table className="w-full text-left">
										<thead className="bg-neutral-50/50">
											<tr>
												<th className="px-8 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
													Merchant
												</th>
												<th className="px-8 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
													Aggregate Sales
												</th>
												<th className="px-8 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
													Platform Cut
												</th>
												<th className="px-8 py-4 text-right"></th>
											</tr>
										</thead>
										<tbody className="divide-y divide-neutral-50 text-sm">
											{vendorEarningsMock.map((v) => (
												<tr
													key={v.id}
													className="hover:bg-neutral-50/30 transition-colors"
												>
													<td className="px-8 py-5">
														<div className="flex items-center gap-3">
															<div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold shrink-0">
																{v.businessName[0]}
															</div>
															<div>
																<p className="font-bold text-neutral-900 leading-none">
																	{v.businessName}
																</p>
																<p className="text-[10px] text-emerald-600 font-bold mt-1 uppercase tracking-tighter">
																	{v.growth} This Month
																</p>
															</div>
														</div>
													</td>
													<td className="px-8 py-5 font-black text-neutral-900">
														₦{v.revenue.toLocaleString()}
													</td>
													<td className="px-8 py-5 font-black text-indigo-600">
														₦{v.commission.toLocaleString()}
													</td>
													<td className="px-8 py-5 text-right">
														<Button
															variant="ghost"
															size="sm"
															className="h-8 w-8 p-0"
														>
															<ArrowUpRight className="h-4 w-4 text-neutral-400" />
														</Button>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</Card>
						</div>

						<div className="space-y-8">
							<div className="bg-white p-8 rounded-[40px] border border-neutral-100 shadow-soft">
								<h3 className="text-lg font-black text-neutral-900 mb-6 flex items-center gap-2">
									<DollarSign className="h-5 w-5 text-indigo-600" /> Fee
									Controls
								</h3>
								<div className="space-y-6">
									<div className="flex justify-between items-center p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
										<div>
											<p className="text-xs font-bold text-neutral-900">
												Core Commission
											</p>
											<p className="text-[10px] text-neutral-500">
												Standard platform fee
											</p>
										</div>
										<span className="text-xl font-black text-indigo-600">
											10%
										</span>
									</div>
									<div className="flex justify-between items-center p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
										<div>
											<p className="text-xs font-bold text-neutral-900">
												Lead Processing
											</p>
											<p className="text-[10px] text-neutral-500">
												Verified lead charge
											</p>
										</div>
										<span className="text-xl font-black text-neutral-900">
											₦500
										</span>
									</div>
									<Button
										variant="outline"
										className="w-full rounded-2xl h-12 font-black border-neutral-200"
									>
										Adjust System Fees
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50/50 pb-20">
			{/* Vendor View (Unchanged) */}
			<div className="sticky top-0 z-30 bg-white/80 border-b border-border/60 px-4 sm:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-sm">
				<div>
					<h1 className="text-xl font-bold tracking-tight text-gray-900">
						Earnings
					</h1>
					<p className="text-xs text-muted-foreground mt-0.5">
						Manage your revenue and payouts
					</p>
				</div>
				<div className="flex items-center gap-2 w-full sm:w-auto">
					<Button className="w-full sm:w-auto bg-brand-blue hover:bg-brand-blue-hover text-white shadow-sm h-10 px-6 font-bold rounded-lg transition-colors">
						<Upload className="mr-2 h-4 w-4" /> Request Payout
					</Button>
				</div>
			</div>

			<div className="w-full p-4 sm:p-8 space-y-8">
				<EarningsStats {...mockStats} />
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<div className="lg:col-span-2">
						<EarningsChart data={mockChartData} />
					</div>
					<div className="rounded-xl border border-border/60 bg-white shadow-sm p-6">
						<h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
							<Wallet className="h-4 w-4 text-primary" /> Settlement Account
						</h3>
						<div className="p-4 rounded-lg border border-border/50 bg-gray-50 flex flex-col gap-3">
							<div className="flex items-center justify-between">
								<span className="text-xs text-muted-foreground">Status</span>
								<span className="text-sm font-bold text-emerald-600">
									Active
								</span>
							</div>
						</div>
					</div>
				</div>
				<TransactionHistory transactions={mockTransactions} />
			</div>
		</div>
	);
}
