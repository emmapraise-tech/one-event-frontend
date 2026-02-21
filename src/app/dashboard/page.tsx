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
} from 'lucide-react';
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

	const isVendor = user?.type === 'VENDOR' || user?.type === 'ADMIN';
	const stats = isVendor ? vendorStats : customerStats;
	const userName = user?.firstName || 'Guest';

	return (
		<div className="space-y-8 pb-12">
			{/* Header Section */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
				<div className="animate-in fade-in slide-in-from-left-4 duration-500">
					<h1 className="text-3xl font-bold text-neutral-900 flex items-center gap-3">
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
