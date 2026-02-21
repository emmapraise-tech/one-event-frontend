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
	ChevronsLeft,
	ChevronsRight,
	Heart,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSidebar } from '@/providers/sidebar-provider';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

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
		roles: ['VENDOR', 'ADMIN'],
	},
	{
		title: 'Bookings',
		href: '/dashboard/bookings',
		icon: CalendarCheck,
		roles: ['VENDOR', 'ADMIN'],
	},
	{
		title: 'My Bookings',
		href: '/dashboard/my-bookings',
		icon: CalendarDays,
		roles: ['CUSTOMER', 'VENDOR', 'ADMIN'],
	},
	{
		title: 'Calendar',
		href: '/dashboard/calendar',
		icon: CalendarDays,
		roles: ['VENDOR', 'ADMIN'],
	},
	{
		title: 'Earnings',
		href: '/dashboard/earnings',
		icon: Wallet,
		roles: ['VENDOR', 'ADMIN'],
	},
	{
		title: 'Saved',
		href: '/dashboard/saved',
		icon: Heart,
		roles: ['CUSTOMER', 'VENDOR', 'ADMIN'],
	},
	{
		title: 'Settings',
		href: '/dashboard/settings',
		icon: Settings,
		roles: ['CUSTOMER', 'VENDOR', 'ADMIN'],
	},
];

export function SidebarContent({ collapsed }: { collapsed?: boolean }) {
	const pathname = usePathname();
	const { user, logout } = useAuth();
	const { isCollapsed: globalCollapsed } = useSidebar();

	// Force expanded logic if provided, otherwise use global context
	const isCollapsed = collapsed !== undefined ? collapsed : globalCollapsed;

	const getInitials = (firstName?: string, lastName?: string) => {
		return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
	};

	return (
		<div className="flex flex-col h-full w-full">
			<div
				className={cn(
					'h-16 flex items-center border-b border-neutral-200 transition-all duration-300',
					isCollapsed ? 'justify-center px-2' : 'px-6',
				)}
			>
				<Link href="/" className="flex items-center gap-2">
					<div className="h-8 w-8 rounded-full bg-neutral-100 flex items-center justify-center shrink-0">
						<div className="h-4 w-4 rounded-full bg-linear-to-tr from-blue-500 to-purple-500 opacity-50" />
					</div>
					{!isCollapsed && (
						<div className="flex flex-col animate-in fade-in duration-300">
							<span className="text-lg font-bold text-primary-blue leading-none">
								OneEvent
							</span>
							<span className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">
								Vendor Portal
							</span>
						</div>
					)}
				</Link>
			</div>

			<nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
				<TooltipProvider>
					{sidebarItems
						.filter(
							(item) => !item.roles || item.roles.includes(user?.type as any),
						)
						.map((item) => {
							const isActive =
								item.href === '/dashboard'
									? pathname === item.href
									: pathname.startsWith(item.href);

							const LinkContent = (
								<Link
									href={item.href}
									className={cn(
										'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative group',
										isActive
											? 'bg-brand-blue text-white shadow-sm'
											: 'text-neutral-600 hover:bg-neutral-50 hover:text-primary-blue',
										isCollapsed && 'justify-center px-2',
									)}
								>
									<item.icon
										className={cn(
											'h-5 w-5 shrink-0',
											isActive
												? 'text-white'
												: 'text-neutral-500 group-hover:text-primary-blue',
										)}
									/>
									{!isCollapsed && (
										<span className="animate-in fade-in duration-300 truncate">
											{item.title}
										</span>
									)}
								</Link>
							);

							if (isCollapsed) {
								return (
									<Tooltip key={item.href} delayDuration={0}>
										<TooltipTrigger asChild>{LinkContent}</TooltipTrigger>
										<TooltipContent side="right">{item.title}</TooltipContent>
									</Tooltip>
								);
							}

							return <div key={item.href}>{LinkContent}</div>;
						})}
				</TooltipProvider>
			</nav>

			{user && (
				<div
					className={cn(
						'h-20 border-t border-neutral-200 mt-auto flex items-center px-4 transition-all duration-300',
						isCollapsed && 'px-2 justify-center',
					)}
				>
					<div
						className={cn(
							'flex items-center gap-3 w-full transition-all',
							isCollapsed && 'justify-center',
						)}
					>
						<Avatar className="h-9 w-9 border border-gray-200 shrink-0">
							<AvatarImage src="" />
							<AvatarFallback className="bg-primary-blue/10 text-primary-blue text-xs font-bold">
								{getInitials(user.firstName, user.lastName)}
							</AvatarFallback>
						</Avatar>
						{!isCollapsed && (
							<div className="flex-1 min-w-0 animate-in fade-in duration-300">
								<p className="text-sm font-semibold truncate leading-none text-gray-900">
									{user.firstName} {user.lastName}
								</p>
								<p className="text-xs text-muted-foreground truncate leading-none mt-1 capitalize">
									{user.type.toLowerCase()}
								</p>
							</div>
						)}
						{!isCollapsed && (
							<button
								onClick={() => logout()}
								className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded-md hover:bg-red-50"
								title="Sign Out"
								aria-label="Sign Out"
							>
								<LogOut className="h-4 w-4" />
							</button>
						)}
					</div>
				</div>
			)}
		</div>
	);
}

export function Sidebar() {
	const { isCollapsed, toggleCollapse } = useSidebar();

	return (
		<aside
			className={cn(
				'bg-white border-r border-neutral-200 flex flex-col h-screen sticky top-0 hidden md:flex transition-all duration-300 ease-in-out z-40 group/sidebar',
				isCollapsed ? 'w-20' : 'w-64',
			)}
		>
			<SidebarContent />

			{/* Collapse Toggle - Absolute positioned on border */}
			<Button
				variant="outline"
				size="icon"
				onClick={toggleCollapse}
				className="absolute -right-4 top-20 h-8 w-8 rounded-full border border-neutral-200 shadow-sm bg-white text-neutral-500 hover:text-primary-blue z-50 hidden group-hover/sidebar:flex transition-opacity"
			>
				{isCollapsed ? (
					<ChevronsRight className="h-4 w-4" />
				) : (
					<ChevronsLeft className="h-4 w-4" />
				)}
			</Button>
		</aside>
	);
}
