'use client';

import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Wallet, Calendar, Eye, Star } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/stats-card';
import { RevenueChart } from '@/components/dashboard/revenue-chart';
import {
	PendingRequests,
	RecentBookingsTable,
} from '@/components/dashboard/recent-activity';

export default function DashboardPage() {
	const { user, isLoading } = useAuth();

	// Mock Data
	const stats = [
		{
			title: 'TOTAL EARNINGS',
			value: '₦12,450',
			trend: '12%',
			trendUp: true,
			icon: Wallet,
			bgColor: 'bg-blue-100',
			iconColor: 'text-blue-600',
		},
		{
			title: 'TOTAL BOOKINGS',
			value: '42',
			trend: '5%',
			trendUp: true,
			icon: Calendar,
			bgColor: 'bg-purple-100',
			iconColor: 'text-purple-600',
		},
		{
			title: 'LISTING VIEWS',
			value: '1,205',
			trend: '8%',
			trendUp: true,
			icon: Eye,
			bgColor: 'bg-orange-100',
			iconColor: 'text-orange-600',
		},
		{
			title: 'AVG RATING',
			value: '4.8',
			trend: '0.2%',
			trendUp: true,
			icon: Star,
			bgColor: 'bg-yellow-100',
			iconColor: 'text-yellow-600',
		},
	];

	if (isLoading) {
		return (
			<div className="flex h-full items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-primary-blue" />
			</div>
		);
	}

	// Fallback for user name if auth is mocked/slow
	const userName = user?.firstName || 'Sarah';

	return (
		<div className="space-y-8">
			{/* Header Section */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
						Welcome back, {userName} <span className="text-2xl">👋</span>
					</h1>
					<p className="text-neutral-500 text-sm mt-1">
						Here's what's happening with your venues today.
					</p>
				</div>
				<a href="/dashboard/listings/new">
					<Button className="bg-brand-gold hover:bg-brand-gold-hover text-white font-bold shadow-sm h-10 px-6">
						<Plus className="h-4 w-4 mr-2" />
						Add New Listing
					</Button>
				</a>
			</div>

			{/* Stats Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Left Column (Charts) */}
				<div className="lg:col-span-2 space-y-6">
					<RevenueChart />
					<div className="pt-2">
						<h3 className="text-lg font-bold text-neutral-900 mb-4">
							Recent Bookings
						</h3>
						<RecentBookingsTable />
					</div>
				</div>

				{/* Right Column (Activity/Sidebars) */}
				<div className="space-y-6">
					<PendingRequests />

					{/* Top Listings Widget */}
					<div className="bg-white p-4 rounded-xl border border-neutral-100 shadow-sm">
						<div className="flex items-center justify-between mb-4">
							<h3 className="font-bold text-neutral-900">Top Listings</h3>
							<button className="text-xs font-semibold text-primary-blue">
								Manage
							</button>
						</div>
						<div className="space-y-4">
							{[1, 2].map((i) => (
								<div key={i} className="flex gap-3">
									<div className="h-12 w-16 bg-neutral-200 rounded-lg shrink-0 overflow-hidden relative">
										{/* Placeholder for Next/Image */}
										<div className="absolute inset-0 bg-neutral-300" />
									</div>
									<div>
										<div className="font-bold text-sm text-neutral-900">
											Grand Ballroom A
										</div>
										<div className="text-xs text-neutral-500">₦2,500 / day</div>
										<div className="text-[10px] text-green-600 font-semibold mt-1">
											↗ 12 bookings this month
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
