'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
	LayoutDashboard,
	List,
	CalendarDays,
	Wallet,
	Settings,
	LogOut,
	CalendarCheck,
} from 'lucide-react';

const sidebarItems = [
	{
		title: 'Dashboard',
		href: '/dashboard',
		icon: LayoutDashboard,
	},
	{
		title: 'My Listings',
		href: '/dashboard/listings',
		icon: List,
	},
	{
		title: 'Bookings',
		href: '/dashboard/bookings',
		icon: CalendarCheck,
	},
	{
		title: 'Calendar',
		href: '/dashboard/calendar',
		icon: CalendarDays,
	},
	{
		title: 'Earnings',
		href: '/dashboard/earnings',
		icon: Wallet,
	},
	{
		title: 'Settings',
		href: '/dashboard/settings',
		icon: Settings,
	},
];

export function Sidebar() {
	const pathname = usePathname();

	return (
		<aside className="w-64 bg-white border-r border-neutral-200 flex flex-col h-screen sticky top-0 md:flex hidden">
			<div className="h-16 flex items-center px-6 border-b border-neutral-200">
				<Link href="/" className="flex items-center gap-2">
					<div className="h-8 w-8 rounded-full bg-neutral-100 flex items-center justify-center">
						{/* Logo Placeholder - Simplified for Dashboard */}
						<div className="h-4 w-4 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 opacity-50" />
					</div>
					<div className="flex flex-col">
						<span className="text-lg font-bold text-primary-blue leading-none">
							OneEvent
						</span>
						<span className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">
							Vendor Portal
						</span>
					</div>
				</Link>
			</div>

			<nav className="flex-1 py-6 px-3 space-y-1">
				{sidebarItems.map((item) => {
					// Use startsWith for nested routes, but strict check for dashboard root
					const isActive =
						item.href === '/dashboard'
							? pathname === item.href
							: pathname.startsWith(item.href);

					return (
						<Link
							key={item.href}
							href={item.href}
							className={cn(
								'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
								isActive
									? 'bg-brand-blue text-white shadow-sm'
									: 'text-neutral-600 hover:bg-neutral-50 hover:text-primary-blue',
							)}
						>
							<item.icon
								className={cn(
									'h-5 w-5',
									isActive
										? 'text-white'
										: 'text-neutral-500 group-hover:text-primary-blue',
								)}
							/>
							{item.title}
						</Link>
					);
				})}
			</nav>

			<div className="p-4 border-t border-neutral-200 mt-auto">
				<button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-600 hover:bg-red-50 hover:text-red-600 w-full transition-colors">
					<LogOut className="h-5 w-5" />
					Sign Out
				</button>
			</div>
		</aside>
	);
}
