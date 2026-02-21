'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Loader2,
	Wallet,
	History,
	ArrowUpRight,
	CheckCircle,
	Clock,
	Shield,
	Building2,
	TrendingUp,
	Download,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock Settlements Data
const mockSettlements = [
	{
		id: 'SET-001',
		vendor: 'Grand Ballroom Lagos',
		amount: 3150000,
		date: '2024-07-20',
		status: 'COMPLETED',
		method: 'Bank Transfer',
	},
	{
		id: 'SET-002',
		vendor: 'Victory Gardens',
		amount: 1800000,
		date: '2024-07-18',
		status: 'PENDING',
		method: 'Flutterwave',
	},
	{
		id: 'SET-003',
		vendor: 'Sky Pavilion',
		amount: 2400000,
		date: '2024-07-15',
		status: 'COMPLETED',
		method: 'Bank Transfer',
	},
	{
		id: 'SET-004',
		vendor: 'Ocean View Suites',
		amount: 1200000,
		date: '2024-07-10',
		status: 'FAILED',
		method: 'Flutterwave',
	},
];

export default function AdminSettlementsPage() {
	const { isLoading } = useQuery({
		queryKey: ['admin', 'settlements'],
		queryFn: async () => mockSettlements, // Mock fetch
	});

	if (isLoading) {
		return (
			<div className="flex h-[60vh] items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
			</div>
		);
	}

	return (
		<div className="space-y-8 animate-in fade-in duration-500 pb-20">
			{/* Header */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[40px] border border-neutral-100 shadow-soft">
				<div>
					<div className="flex items-center gap-2 mb-2">
						<Shield className="h-4 w-4 text-brand-blue" />
						<span className="text-[10px] font-bold text-brand-blue uppercase tracking-widest">
							Financial Clearing
						</span>
					</div>
					<h1 className="text-4xl font-black text-neutral-900 tracking-tight">
						Vendor settlements
					</h1>
					<p className="text-neutral-500 mt-1 font-medium">
						Manage platform payouts and transaction clearing cycles.
					</p>
				</div>
				<div className="flex gap-3">
					<Button className="bg-brand-blue hover:bg-brand-blue-hover text-white shadow-xl shadow-blue-500/20 h-14 px-10 font-black rounded-2xl transition-all">
						Process Batch Payout
					</Button>
				</div>
			</div>

			{/* Stats */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<Card className="border-none shadow-soft rounded-[32px] bg-white p-6">
					<p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">
						Awaiting Settlement
					</p>
					<h3 className="text-2xl font-black text-neutral-900 leading-none mb-2">
						₦4,250,000
					</h3>
					<div className="flex items-center text-xs font-bold text-amber-600">
						<Clock className="h-3 w-3 mr-1" /> 8 Vendors pending
					</div>
				</Card>
				<Card className="border-none shadow-soft rounded-[32px] bg-white p-6">
					<p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">
						Total Settled (MTD)
					</p>
					<h3 className="text-2xl font-black text-neutral-900 leading-none mb-2">
						₦28,400,000
					</h3>
					<div className="flex items-center text-xs font-bold text-emerald-600">
						<TrendingUp className="h-3 w-3 mr-1" /> +15.2% vs last month
					</div>
				</Card>
				<Card className="border-none shadow-soft rounded-[32px] bg-brand-blue p-6 text-white">
					<p className="text-[10px] font-bold text-blue-100 uppercase tracking-widest mb-2">
						Next Payout Cycle
					</p>
					<h3 className="text-2xl font-black text-white leading-none mb-2">
						July 25, 2024
					</h3>
					<div className="flex items-center text-xs font-bold text-blue-100">
						<CalendarCheck className="h-3 w-3 mr-1" /> Automated batching
					</div>
				</Card>
			</div>

			{/* Settlement Ledger */}
			<Card className="border-none shadow-soft rounded-[40px] overflow-hidden bg-white">
				<div className="p-8 border-b border-neutral-50 flex items-center justify-between">
					<div>
						<h3 className="text-lg font-black text-neutral-900">
							Settlement Ledger
						</h3>
						<p className="text-sm text-neutral-500">
							Historical record of platform-to-vendor payouts
						</p>
					</div>
					<Button
						variant="outline"
						className="rounded-xl border-neutral-200 font-bold h-10"
					>
						<Download className="mr-2 h-4 w-4" /> Export Ledger
					</Button>
				</div>
				<div className="overflow-x-auto">
					<table className="w-full text-left">
						<thead className="bg-neutral-50/50">
							<tr>
								<th className="px-8 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
									Reference
								</th>
								<th className="px-8 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
									Merchant
								</th>
								<th className="px-8 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
									Amount
								</th>
								<th className="px-8 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
									Status
								</th>
								<th className="px-8 py-4 text-right"></th>
							</tr>
						</thead>
						<tbody className="divide-y divide-neutral-50">
							{mockSettlements.map((settlement) => (
								<tr
									key={settlement.id}
									className="hover:bg-neutral-50/30 transition-colors"
								>
									<td className="px-8 py-5">
										<p className="font-bold text-neutral-900">
											{settlement.id}
										</p>
										<p className="text-[10px] text-neutral-400 uppercase font-black">
											{settlement.date}
										</p>
									</td>
									<td className="px-8 py-5">
										<div className="flex items-center gap-3">
											<div className="h-8 w-8 rounded-lg bg-brand-blue-soft flex items-center justify-center text-brand-blue font-bold shrink-0">
												{settlement.vendor[0]}
											</div>
											<span className="font-bold text-neutral-900">
												{settlement.vendor}
											</span>
										</div>
									</td>
									<td className="px-8 py-5 font-black text-neutral-900">
										₦{settlement.amount.toLocaleString()}
									</td>
									<td className="px-8 py-5">
										<Badge
											className={cn(
												'border-none px-3 py-1 font-bold text-[10px] uppercase rounded-full',
												settlement.status === 'COMPLETED'
													? 'bg-emerald-50 text-emerald-600'
													: settlement.status === 'PENDING'
														? 'bg-amber-50 text-amber-600'
														: 'bg-red-50 text-red-600',
											)}
										>
											{settlement.status}
										</Badge>
									</td>
									<td className="px-8 py-5 text-right">
										<Button
											variant="ghost"
											size="sm"
											className="h-9 font-bold text-neutral-500 hover:text-brand-blue"
										>
											Details <ArrowUpRight className="ml-1 h-3 w-3" />
										</Button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</Card>
		</div>
	);
}

function CalendarCheck(props: any) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
			<line x1="16" y1="2" x2="16" y2="6" />
			<line x1="8" y1="2" x2="8" y2="6" />
			<line x1="3" y1="10" x2="21" y2="10" />
			<path d="m9 16 2 2 4-4" />
		</svg>
	);
}
