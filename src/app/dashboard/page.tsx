'use client';

import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
	Loader2,
	Plus,
	Wallet,
	Calendar,
	Eye,
	Star,
	Building2,
	Shield,
	Users,
	ArrowUpRight,
	Activity,
	HelpCircle,
	Sparkles,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { StatsCard } from '@/components/dashboard/stats-card';
import { RevenueChart } from '@/components/dashboard/revenue-chart';
import { PendingRequests } from '@/components/dashboard/recent-activity';
import Link from 'next/link';

export default function DashboardPage() {
	const { user, isLoading } = useAuth();

	// Mock Data for Vendor
	const vendorStats = [
		{
			title: 'TOTAL EARNINGS',
			value: '₦12,450',
			trend: '12%',
			trendUp: true,
			icon: Wallet,
			bgColor: 'bg-brand-blue-soft',
			iconColor: 'text-brand-blue',
		},
		{
			title: 'TOTAL BOOKINGS',
			value: '42',
			trend: '5%',
			trendUp: true,
			icon: Calendar,
			bgColor: 'bg-purple-50',
			iconColor: 'text-purple-600',
		},
		{
			title: 'LISTING VIEWS',
			value: '1,205',
			trend: '8%',
			trendUp: true,
			icon: Eye,
			bgColor: 'bg-amber-50',
			iconColor: 'text-amber-600',
		},
		{
			title: 'AVG RATING',
			value: '4.8',
			trend: '0.2%',
			trendUp: true,
			icon: Star,
			bgColor: 'bg-emerald-50',
			iconColor: 'text-emerald-600',
		},
	];

	// Mock Data for Customer
	const customerStats = [
		{
			title: 'TOTAL SPENT',
			value: '₦4,250',
			trend: '10%',
			trendUp: false,
			icon: Wallet,
			bgColor: 'bg-brand-blue-soft',
			iconColor: 'text-brand-blue',
		},
		{
			title: 'MY BOOKINGS',
			value: '8',
			trend: '2 new',
			trendUp: true,
			icon: Calendar,
			bgColor: 'bg-purple-50',
			iconColor: 'text-purple-600',
		},
		{
			title: 'SAVED VENUES',
			value: '12',
			trend: '3 new',
			trendUp: true,
			icon: Star,
			bgColor: 'bg-amber-50',
			iconColor: 'text-amber-600',
		},
		{
			title: 'UPCOMING EVENTS',
			value: '2',
			trend: 'This week',
			trendUp: true,
			icon: Building2,
			bgColor: 'bg-emerald-50',
			iconColor: 'text-emerald-600',
		},
	];

	if (isLoading) {
		return (
			<div className="flex h-[60vh] items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-primary-blue" />
			</div>
		);
	}

	const isAdmin = user?.type === 'ADMIN';
	const isVendor = user?.type === 'VENDOR';
	const userName = user?.firstName || 'Guest';

	if (isAdmin) {
		const adminStats = [
			{
				title: 'PLATFORM REVENUE',
				value: '₦24.8M',
				trend: '15%',
				trendUp: true,
				icon: Wallet,
				bgColor: 'bg-brand-blue-soft',
				iconColor: 'text-brand-blue',
			},
			{
				title: 'PENDING LISTINGS',
				value: '12',
				trend: '4 urgent',
				trendUp: true,
				icon: Building2,
				bgColor: 'bg-amber-50',
				iconColor: 'text-amber-600',
			},
			{
				title: 'TOTAL USERS',
				value: '2,840',
				trend: '124 new',
				trendUp: true,
				icon: Star,
				bgColor: 'bg-emerald-50',
				iconColor: 'text-emerald-600',
			},
			{
				title: 'SYSTEM BOOKINGS',
				value: '184',
				trend: '8% increase',
				trendUp: true,
				icon: Calendar,
				bgColor: 'bg-blue-50',
				iconColor: 'text-blue-600',
			},
		];

		const topVendors = [
			{
				name: 'Grand Ballroom Lagos',
				sales: '₦8.4M',
				share: '₦840k',
				growth: '+12%',
			},
			{
				name: 'Victory Gardens',
				sales: '₦5.2M',
				share: '₦520k',
				growth: '+8%',
			},
			{ name: 'Sky Pavilion', sales: '₦3.8M', share: '₦380k', growth: '+15%' },
			{
				name: 'Ocean View Suites',
				sales: '₦2.9M',
				share: '₦290k',
				growth: '-2%',
			},
		];

		return (
			<div className="space-y-6 md:space-y-8 pb-12 animate-in fade-in duration-500">
				<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-6 md:p-8 rounded-3xl md:rounded-[40px] border border-neutral-100 shadow-soft">
					<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
						<div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl sm:rounded-[28px] bg-brand-blue flex items-center justify-center text-white shadow-xl shadow-blue-500/20 shrink-0">
							<Shield className="h-8 w-8 sm:h-10 sm:w-10" />
						</div>
						<div>
							<div className="flex items-center gap-2 mb-1">
								<span className="text-[10px] font-black text-brand-blue uppercase tracking-widest bg-brand-blue-soft px-2 py-0.5 rounded-full">
									System Intelligence
								</span>
							</div>
							<h1 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight leading-none">
								Command Center
							</h1>
							<p className="text-neutral-500 mt-2 font-medium italic text-sm sm:text-base">
								Monitoring the pulse of Nigeria's premium event marketplace.
							</p>
						</div>
					</div>
					<div className="flex flex-wrap gap-3">
						<Link href="/dashboard/admin/vendors">
							<Button
								variant="outline"
								className="border-neutral-200 h-14 px-8 font-black rounded-2xl transition-all hover:bg-neutral-50"
							>
								Merchant Oversight
							</Button>
						</Link>
						<Link href="/dashboard/admin/listings">
							<Button className="bg-brand-blue hover:bg-brand-blue-hover text-white shadow-xl shadow-blue-500/20 h-14 px-10 font-black rounded-2xl transition-all">
								Review Pending (12)
							</Button>
						</Link>
					</div>
				</div>

				{/* Stats Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{adminStats.map((stat, i) => (
						<StatsCard
							key={i}
							title={stat.title}
							value={stat.value}
							trend={stat.trend}
							trendUp={stat.trendUp}
							icon={stat.icon}
							bgColorClass={stat.bgColor}
							iconColorClass={stat.iconColor}
						/>
					))}
				</div>

				<div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
					{/* Left Column (Revenue & Performance) */}
					<div className="xl:col-span-8 space-y-8">
						<RevenueChart
							title="Global Ecosystem Revenue"
							description="System-wide performance tracking aggregate transaction volume"
						/>

						{/* Top Vendors Section */}
						<div className="bg-white rounded-3xl md:rounded-[40px] border border-neutral-100 shadow-soft overflow-hidden">
							<div className="p-6 md:p-8 border-b border-neutral-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
								<div>
									<h3 className="text-lg font-black text-neutral-900 font-display">
										Merchant Performance
									</h3>
									<p className="text-sm text-neutral-500">
										Individual vendor contribution to ecosystem revenue
									</p>
								</div>
								<Link href="/dashboard/earnings">
									<Button
										variant="ghost"
										className="text-brand-blue font-bold px-0 sm:px-4"
									>
										Full Ledger
									</Button>
								</Link>
							</div>
							<div className="overflow-x-auto">
								<table className="w-full text-left whitespace-nowrap min-w-[600px]">
									<thead className="bg-neutral-50/50">
										<tr>
											<th className="px-4 md:px-8 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
												Merchant
											</th>
											<th className="px-4 md:px-8 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
												Gross Sales
											</th>
											<th className="px-4 md:px-8 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
												Platform Cut
											</th>
											<th className="px-4 md:px-8 py-4 text-right"></th>
										</tr>
									</thead>
									<tbody className="divide-y divide-neutral-50">
										{topVendors.map((vendor, i) => (
											<tr
												key={i}
												className="hover:bg-neutral-50/30 transition-colors"
											>
												<td className="px-4 md:px-8 py-5">
													<div className="flex items-center gap-3">
														<div className="h-8 w-8 rounded-lg bg-brand-blue-soft flex items-center justify-center text-brand-blue font-bold shrink-0">
															{vendor.name[0]}
														</div>
														<div>
															<p className="font-bold text-neutral-900 leading-none">
																{vendor.name}
															</p>
															<p className="text-[10px] text-emerald-600 font-bold mt-1 uppercase tracking-tighter">
																{vendor.growth} Growth
															</p>
														</div>
													</div>
												</td>
												<td className="px-4 md:px-8 py-5 font-black text-neutral-900">
													{vendor.sales}
												</td>
												<td className="px-4 md:px-8 py-5 font-black text-brand-blue">
													{vendor.share}
												</td>
												<td className="px-4 md:px-8 py-5 text-right">
													<Button
														variant="ghost"
														size="sm"
														className="h-8 w-8 p-0 rounded-lg"
													>
														<ArrowUpRight className="h-4 w-4 text-neutral-400" />
													</Button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					</div>

					{/* Right Column (Insights & Actions) */}
					<div className="xl:col-span-4 space-y-8">
						{/* Quick Actions Card */}
						<div className="bg-white p-8 rounded-[40px] border border-neutral-100 shadow-soft">
							<h3 className="text-lg font-black text-neutral-900 mb-6 font-display flex items-center gap-2">
								<Sparkles className="h-5 w-5 text-brand-gold" /> Admin Quick
								Actions
							</h3>
							<div className="grid grid-cols-2 gap-3">
								<button className="flex flex-col items-center justify-center p-4 rounded-3xl bg-neutral-50 border border-neutral-100 hover:bg-brand-blue-soft hover:border-brand-blue/20 transition-all group">
									<Users className="h-6 w-6 text-neutral-400 group-hover:text-brand-blue mb-2" />
									<span className="text-[10px] font-bold text-neutral-600 group-hover:text-brand-blue uppercase">
										Verify Vendors
									</span>
								</button>
								<button className="flex flex-col items-center justify-center p-4 rounded-3xl bg-neutral-50 border border-neutral-100 hover:bg-brand-blue-soft hover:border-brand-blue/20 transition-all group">
									<Building2 className="h-6 w-6 text-neutral-400 group-hover:text-brand-blue mb-2" />
									<span className="text-[10px] font-bold text-neutral-600 group-hover:text-brand-blue uppercase">
										Audit Venues
									</span>
								</button>
								<button className="flex flex-col items-center justify-center p-4 rounded-3xl bg-neutral-50 border border-neutral-100 hover:bg-brand-blue-soft hover:border-brand-blue/20 transition-all group">
									<Wallet className="h-6 w-6 text-neutral-400 group-hover:text-brand-blue mb-2" />
									<span className="text-[10px] font-bold text-neutral-600 group-hover:text-brand-blue uppercase">
										Manage Payouts
									</span>
								</button>
								<button className="flex flex-col items-center justify-center p-4 rounded-3xl bg-neutral-50 border border-neutral-100 hover:bg-brand-blue-soft hover:border-brand-blue/20 transition-all group">
									<HelpCircle className="h-6 w-6 text-neutral-400 group-hover:text-brand-blue mb-2" />
									<span className="text-[10px] font-bold text-neutral-600 group-hover:text-brand-blue uppercase">
										Support Queue
									</span>
								</button>
							</div>
						</div>

						{/* System Health Card */}
						<div className="bg-white p-8 rounded-[40px] border border-neutral-100 shadow-soft">
							<h3 className="text-lg font-black text-neutral-900 mb-6 font-display flex items-center gap-2">
								<Activity className="h-5 w-5 text-brand-blue" /> Technical
								Health
							</h3>
							<div className="space-y-6">
								<div className="space-y-2">
									<div className="flex justify-between text-xs font-black uppercase tracking-widest">
										<span className="text-neutral-400">Database Latency</span>
										<span className="text-emerald-600">8ms</span>
									</div>
									<div className="h-2 w-full bg-neutral-50 rounded-full overflow-hidden">
										<div className="h-full w-[92%] bg-emerald-500 rounded-full" />
									</div>
								</div>
								<div className="space-y-2">
									<div className="flex justify-between text-xs font-black uppercase tracking-widest">
										<span className="text-neutral-400">Server Load</span>
										<span className="text-brand-blue">24%</span>
									</div>
									<div className="h-2 w-full bg-neutral-50 rounded-full overflow-hidden">
										<div className="h-full w-[24%] bg-brand-blue rounded-full" />
									</div>
								</div>
								<div className="space-y-2">
									<div className="flex justify-between text-xs font-black uppercase tracking-widest">
										<span className="text-neutral-400">Payout Queue</span>
										<span className="text-amber-500">14 Pend.</span>
									</div>
									<div className="h-2 w-full bg-neutral-50 rounded-full overflow-hidden">
										<div className="h-full w-[40%] bg-amber-500 rounded-full" />
									</div>
								</div>
							</div>

							<div className="mt-8 pt-6 border-t border-neutral-50 space-y-4">
								<div className="flex items-center gap-3">
									<div className="h-9 w-9 rounded-xl bg-brand-blue-soft flex items-center justify-center text-brand-blue shrink-0">
										<Users className="h-4 w-4" />
									</div>
									<div>
										<p className="text-xs font-bold text-neutral-900">
											Recent Activity
										</p>
										<p className="text-[10px] text-neutral-500">
											124 new users registered today
										</p>
									</div>
								</div>
							</div>
						</div>

						{/* Audit Logs / Info CTA */}
						<div className="bg-linear-to-br from-brand-blue to-blue-900 p-8 rounded-[40px] text-white shadow-2xl shadow-blue-500/30 relative overflow-hidden group">
							<div className="relative z-10">
								<Badge className="bg-white/20 text-white border-none font-bold text-[9px] uppercase tracking-widest mb-3">
									Security Protocol
								</Badge>
								<h3 className="font-black text-2xl mb-2 tracking-tight">
									Security Logs
								</h3>
								<p className="text-blue-100 text-sm mb-6 leading-relaxed font-medium">
									Review critical system transformations and administrative
									events.
								</p>
								<Button className="bg-white text-brand-blue hover:bg-white/90 font-black rounded-2xl h-12 w-full transition-all active:scale-95 shadow-lg">
									Open Intelligence
								</Button>
							</div>
							<Shield className="absolute -right-8 -bottom-8 h-40 w-40 text-white/10 group-hover:scale-110 transition-transform duration-700" />
						</div>
					</div>
				</div>
			</div>
		);
	}

	const stats = isVendor ? vendorStats : customerStats;

	return (
		<div className="space-y-6 md:space-y-8 pb-12">
			{/* Header Section */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
				<div className="animate-in fade-in slide-in-from-left-4 duration-500">
					<h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 flex items-center gap-3 flex-wrap">
						Welcome back, {userName}{' '}
						<span className="animate-bounce inline-block">👋</span>
					</h1>
					<p className="text-neutral-500 text-sm mt-1">
						{isVendor
							? "Here's the latest overview of your venue operations."
							: 'Explore your saved venues and manage your upcoming event bookings.'}
					</p>
				</div>
				<div className="flex gap-3 animate-in fade-in slide-in-from-right-4 duration-500">
					{isVendor ? (
						<a href="/dashboard/listings/new">
							<Button className="bg-brand-blue hover:bg-brand-blue-hover text-white shadow-lg shadow-blue-500/20 h-11 px-6 font-bold rounded-xl transition-all hover:scale-[1.02]">
								<Plus className="h-5 w-5 mr-2" />
								Add New Listing
							</Button>
						</a>
					) : (
						<>
							<Link href="/listings">
								<Button className="bg-brand-blue hover:bg-brand-blue-hover text-white shadow-lg shadow-blue-500/20 h-11 px-6 font-bold rounded-xl transition-all hover:scale-[1.02]">
									Browse Venues
								</Button>
							</Link>
							<Link href="/onboard-vendor">
								<Button
									variant="outline"
									className="border-brand-gold/30 text-brand-gold hover:bg-brand-gold/5 h-11 px-6 font-bold rounded-xl transition-all"
								>
									List your venue
								</Button>
							</Link>
						</>
					)}
				</div>
			</div>

			{/* Stats Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
				{stats.map((stat, i) => (
					<StatsCard
						key={i}
						title={stat.title}
						value={stat.value}
						trend={stat.trend}
						trendUp={stat.trendUp}
						icon={stat.icon}
						bgColorClass={stat.bgColor}
						iconColorClass={stat.iconColor}
					/>
				))}
			</div>

			{/* Main Content Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
				{/* Left Column (Main Widgets) */}
				<div className="lg:col-span-2 space-y-8">
					{isVendor ? (
						<RevenueChart />
					) : (
						<div className="bg-white rounded-3xl p-8 border border-neutral-100 shadow-sm min-h-[400px]">
							<div className="flex items-center justify-between mb-8">
								<div>
									<h2 className="text-xl font-bold text-neutral-900">
										Upcoming Bookings
									</h2>
									<p className="text-sm text-neutral-500">
										Your next secured reservations
									</p>
								</div>
								<Link href="/dashboard/my-bookings">
									<Button
										variant="ghost"
										className="text-brand-blue font-bold px-0 hover:bg-transparent"
									>
										View All Bookings
									</Button>
								</Link>
							</div>

							<div className="space-y-4">
								{/* Placeholder for real bookings */}
								{[1, 2].map((i) => (
									<div
										key={i}
										className="flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl border border-neutral-50 bg-neutral-50/30 hover:bg-white hover:shadow-md transition-all group"
									>
										<div className="flex gap-4 items-center">
											<div className="h-16 w-16 rounded-xl bg-neutral-200 overflow-hidden relative grayscale group-hover:grayscale-0 transition-all">
												<div className="absolute inset-0 bg-neutral-300 animate-pulse" />
											</div>
											<div>
												<h4 className="font-bold text-neutral-900">
													Imperial Events Plaza
												</h4>
												<p className="text-xs text-neutral-500 flex items-center gap-1 mt-1">
													<Calendar className="h-3 w-3" /> Sept 24, 2026 • 200
													Guests
												</p>
											</div>
										</div>
										<div className="mt-4 md:mt-0 flex items-center justify-between md:justify-end gap-6">
											<div className="text-right">
												<p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
													Deposit
												</p>
												<p className="text-sm font-bold text-green-600">PAID</p>
											</div>
											<Button
												size="sm"
												variant="outline"
												className="rounded-lg font-bold text-xs h-9"
											>
												Details
											</Button>
										</div>
									</div>
								))}
							</div>
						</div>
					)}
				</div>

				{/* Right Column (Side Widgets) */}
				<div className="space-y-8">
					{isVendor ? (
						<PendingRequests />
					) : (
						<div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm">
							<div className="flex items-center justify-between mb-6">
								<h3 className="font-bold text-neutral-900">Saved Venues</h3>
								<Link
									href="/listings"
									className="text-xs font-extrabold text-brand-blue uppercase tracking-wider"
								>
									Explore
								</Link>
							</div>
							<div className="space-y-5">
								{[1, 2, 3].map((i) => (
									<div key={i} className="flex gap-4 group cursor-pointer">
										<div className="h-14 w-14 bg-neutral-100 rounded-xl shrink-0 overflow-hidden relative">
											<div className="absolute inset-0 bg-neutral-200 transition-all group-hover:scale-110" />
										</div>
										<div className="flex-1 min-w-0">
											<p className="font-bold text-sm text-neutral-900 truncate group-hover:text-brand-blue transition-colors">
												Victory Gardens Lagos
											</p>
											<p className="text-xs text-neutral-500 mt-0.5">
												Victoria Island, Lagos
											</p>
											<div className="flex items-center gap-1 mt-1">
												<Star className="h-3 w-3 fill-amber-400 text-amber-400" />
												<span className="text-[10px] font-bold text-neutral-700">
													4.9
												</span>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Common Widget for both */}
					<div className="bg-linear-to-br from-brand-blue to-blue-700 p-8 rounded-3xl text-white relative overflow-hidden group shadow-xl shadow-blue-500/20">
						<div className="relative z-10">
							<h3 className="font-bold text-lg mb-2">Need Support?</h3>
							<p className="text-blue-100 text-sm mb-6 leading-relaxed">
								Our dedicated support team is here to help you with your
								bookings.
							</p>
							<Button className="bg-white text-brand-blue hover:bg-blue-50 font-bold rounded-xl h-10 px-6">
								Contact Us
							</Button>
						</div>
						<Building2 className="absolute -right-6 -bottom-6 h-32 w-32 text-white/10 group-hover:scale-110 transition-transform duration-500" />
					</div>
				</div>
			</div>
		</div>
	);
}
