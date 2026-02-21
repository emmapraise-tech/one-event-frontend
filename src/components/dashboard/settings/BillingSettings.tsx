'use client';

import { useState } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
	CreditCard,
	Wallet,
	Download,
	History,
	Plus,
	ExternalLink,
	CheckCircle2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function BillingSettings() {
	const [activePlan] = useState('Pro Vendor');

	return (
		<div className="space-y-6 max-w-4xl animate-in fade-in duration-500">
			{/* Current Plan */}
			<Card className="border-none shadow-xl overflow-hidden rounded-[40px] bg-linear-to-br from-brand-blue via-blue-700 to-indigo-900 text-white relative">
				{/* Decorative elements */}
				<div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse" />
				<div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/10 rounded-full -ml-24 -mb-24 blur-2xl" />

				<CardContent className="p-10 relative z-10">
					<div className="flex flex-col md:flex-row justify-between gap-10">
						<div className="space-y-6">
							<div>
								<Badge className="bg-white/20 text-white border-none rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] mb-4 backdrop-blur-md">
									Active Subscription
								</Badge>
								<h3 className="text-4xl font-black tracking-tight mb-2">
									{activePlan}
								</h3>
								<p className="text-blue-100 font-medium opacity-80">
									Next billing cycle: March 12, 2026 • Yearly billing enabled
								</p>
							</div>
							<div className="flex flex-wrap gap-3 pt-2">
								{[
									'Unlimited Listings',
									'0% Commission',
									'Priority Support',
									'Verified Badge',
								].map((feature) => (
									<div
										key={feature}
										className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/5 rounded-2xl backdrop-blur-sm"
									>
										<CheckCircle2 className="h-4 w-4 text-emerald-400" />
										<span className="text-sm font-bold">{feature}</span>
									</div>
								))}
							</div>
						</div>

						<div className="bg-white/10 backdrop-blur-xl border border-white/10 p-8 rounded-[32px] shadow-2xl flex flex-col justify-between min-w-[280px]">
							<div className="flex items-center justify-between mb-4">
								<span className="text-xs font-bold text-blue-100 uppercase tracking-widest opacity-60">
									Annual Rate
								</span>
								<div className="h-10 w-10 bg-white/20 rounded-2xl flex items-center justify-center">
									<CreditCard className="h-5 w-5 text-white" />
								</div>
							</div>
							<div className="mb-8">
								<p className="text-4xl font-black leading-none">₦150,000</p>
								<p className="text-xs text-blue-100 mt-2 font-medium opacity-80">
									Save 20% compared to monthly
								</p>
							</div>
							<Button className="w-full bg-white text-brand-blue hover:bg-blue-50 font-black rounded-2xl h-12 shadow-xl hover:scale-[1.02] transition-all">
								Upgrade Plan
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Wallet Balance */}
				<Card className="border-neutral-100 shadow-sm overflow-hidden rounded-[32px]">
					<CardHeader className="pb-2">
						<div className="flex items-center justify-between">
							<div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
								<Wallet className="h-5 w-5" />
							</div>
							<Badge className="bg-green-50 text-green-600 text-[10px] font-bold border-none px-2 rounded-full uppercase">
								Settled
							</Badge>
						</div>
						<CardTitle className="text-base font-bold mt-4">
							Wallet Balance
						</CardTitle>
						<CardDescription>
							Available for immediate withdrawal
						</CardDescription>
					</CardHeader>
					<CardContent className="pt-4">
						<div className="flex items-baseline gap-2 mb-6">
							<span className="text-4xl font-black text-neutral-900 tracking-tighter">
								₦482,500
							</span>
							<span className="text-sm font-bold text-neutral-400">NGN</span>
						</div>
						<div className="flex gap-3">
							<Button className="flex-1 bg-brand-blue hover:bg-brand-blue-hover text-white rounded-xl font-bold h-11 transition-all active:scale-95 shadow-md shadow-blue-500/10">
								Withdraw Funds
							</Button>
							<Button
								variant="outline"
								size="icon"
								className="h-11 w-11 rounded-xl border-neutral-100"
							>
								<Plus className="h-5 w-5 text-neutral-500" />
							</Button>
						</div>
					</CardContent>
				</Card>

				{/* Payment Methods */}
				<Card className="border-neutral-100 shadow-sm overflow-hidden rounded-[32px]">
					<CardHeader className="pb-2">
						<div className="p-2 bg-blue-50 rounded-xl text-brand-blue w-fit">
							<CreditCard className="h-5 w-5" />
						</div>
						<CardTitle className="text-base font-bold mt-4">
							Payment Methods
						</CardTitle>
						<CardDescription>Default card for subscription</CardDescription>
					</CardHeader>
					<CardContent className="pt-4">
						<div className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl border border-neutral-100 mb-6">
							<div className="flex items-center gap-3">
								<div className="h-8 w-12 bg-white rounded-md border border-neutral-100 flex items-center justify-center">
									<span className="text-[10px] font-black italic text-blue-800">
										VISA
									</span>
								</div>
								<div>
									<p className="text-sm font-bold text-neutral-900">
										•••• 4242
									</p>
									<p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">
										Expires 04/28
									</p>
								</div>
							</div>
							<Badge className="bg-blue-600 text-white border-none rounded-full px-2 py-0 h-5 text-[8px] font-bold">
								DEFAULT
							</Badge>
						</div>
						<Button
							variant="outline"
							className="w-full rounded-xl border-neutral-200 font-bold h-11 text-neutral-600 hover:text-black hover:bg-neutral-50"
						>
							Update Card details
						</Button>
					</CardContent>
				</Card>
			</div>

			{/* Billing History */}
			<Card className="border-neutral-100 shadow-sm overflow-hidden rounded-[32px]">
				<CardHeader className="flex flex-row items-center justify-between border-b border-neutral-50 bg-neutral-50/30 p-8">
					<div>
						<CardTitle className="text-xl font-bold flex items-center gap-2">
							<History className="h-5 w-5 text-neutral-400" />
							Transactions
						</CardTitle>
						<CardDescription>
							Recent billing activity and payouts
						</CardDescription>
					</div>
					<Button
						variant="ghost"
						className="text-sm font-bold text-brand-blue hover:bg-brand-blue/5 h-10 px-5 rounded-xl"
					>
						View All <ExternalLink className="ml-2 h-4 w-4" />
					</Button>
				</CardHeader>
				<CardContent className="p-0">
					<div className="divide-y divide-neutral-50">
						{[
							{
								id: 'TX-9021',
								date: 'Feb 12, 2026',
								type: 'Subscription',
								amount: -15000,
								status: 'Paid',
							},
							{
								id: 'TX-8832',
								date: 'Feb 05, 2026',
								type: 'Booking Payout',
								amount: 145000,
								status: 'Settled',
							},
							{
								id: 'TX-8811',
								date: 'Jan 12, 2026',
								type: 'Subscription',
								amount: -15000,
								status: 'Paid',
							},
						].map((tx, idx) => (
							<div
								key={idx}
								className="p-6 flex items-center justify-between hover:bg-neutral-50/30 transition-colors"
							>
								<div className="flex items-center gap-4">
									<div
										className={
											tx.amount > 0
												? 'h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600'
												: 'h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-brand-blue'
										}
									>
										<Download className="h-4 w-4" />
									</div>
									<div>
										<p className="font-bold text-neutral-900">{tx.type}</p>
										<p className="text-xs text-neutral-400 font-medium">
											{tx.date} • ID: {tx.id}
										</p>
									</div>
								</div>
								<div className="text-right">
									<p
										className={
											tx.amount > 0
												? 'font-black text-emerald-600'
												: 'font-black text-neutral-900'
										}
									>
										{tx.amount > 0 ? '+' : ''}
										{tx.amount.toLocaleString()} ₦
									</p>
									<p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1">
										{tx.status}
									</p>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
