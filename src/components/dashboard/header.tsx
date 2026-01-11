'use client';

import Link from 'next/link';
import {
	Bell,
	HelpCircle,
	Search,
	LogOut,
	LayoutDashboard,
	Settings,
	Calendar,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function DashboardHeader() {
	const { user, isAuthenticated, logout } = useAuth();

	// Dropdown Hover Logic
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	let closeTimeout: NodeJS.Timeout;

	const handleMouseEnter = () => {
		clearTimeout(closeTimeout);
		setIsMenuOpen(true);
	};

	const handleMouseLeave = () => {
		closeTimeout = setTimeout(() => {
			setIsMenuOpen(false);
		}, 200);
	};

	// Helper to get initials
	const getInitials = (firstName?: string, lastName?: string) => {
		if (!firstName) return 'U';
		return `${firstName[0]}${lastName ? lastName[0] : ''}`.toUpperCase();
	};

	return (
		<header className="flex h-16 items-center justify-between border-b border-neutral-200 bg-white px-8">
			<div className="flex items-center gap-4 flex-1">
				<div className="relative w-96 hidden md:block">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
					<Input
						placeholder="Search bookings, guests, venues..."
						className="pl-9 bg-neutral-50 border-neutral-200"
					/>
				</div>
			</div>

			<div className="flex items-center gap-6">
				<div className="flex items-center gap-3">
					<Button
						variant="ghost"
						size="icon"
						className="text-neutral-500 hover:text-primary-blue relative"
					>
						<Bell className="h-5 w-5" />
						<span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border-2 border-white"></span>
					</Button>
					<Button
						variant="ghost"
						size="icon"
						className="text-neutral-500 hover:text-primary-blue"
					>
						<HelpCircle className="h-5 w-5" />
					</Button>

					{user ? (
						<DropdownMenu
							open={isMenuOpen}
							onOpenChange={setIsMenuOpen}
							modal={false}
						>
							<div
								onMouseEnter={handleMouseEnter}
								onMouseLeave={handleMouseLeave}
								className="py-2"
							>
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										className="relative h-10 w-10 rounded-full"
									>
										<Avatar className="h-10 w-10 border border-neutral-200">
											<AvatarImage
												src={undefined}
												alt={user.firstName}
												className="object-cover"
											/>
											<AvatarFallback className="bg-brand-blue/10 text-brand-blue font-bold">
												{getInitials(user.firstName, user.lastName)}
											</AvatarFallback>
										</Avatar>
									</Button>
								</DropdownMenuTrigger>
							</div>

							<DropdownMenuContent
								className="w-56 bg-white"
								align="end"
								forceMount
								onMouseEnter={handleMouseEnter}
								onMouseLeave={handleMouseLeave}
							>
								<DropdownMenuLabel className="font-normal">
									<div className="flex flex-col space-y-1">
										<p className="text-sm font-medium leading-none">
											{user.firstName} {user.lastName}
										</p>
										<p className="text-xs leading-none text-muted-foreground">
											{user.email}
										</p>
									</div>
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem asChild>
									<Link href="/dashboard" className="cursor-pointer">
										<LayoutDashboard className="mr-2 h-4 w-4" />
										<span>Dashboard</span>
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem asChild>
									<Link
										href="/dashboard/my-bookings"
										className="cursor-pointer"
									>
										<Calendar className="mr-2 h-4 w-4" />
										<span>My Bookings</span>
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem asChild>
									<Link href="/dashboard/settings" className="cursor-pointer">
										<Settings className="mr-2 h-4 w-4" />
										<span>Settings</span>
									</Link>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									onClick={() => logout()}
									className="text-red-600 focus:text-red-600 cursor-pointer"
								>
									<LogOut className="mr-2 h-4 w-4" />
									<span>Log out</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					) : (
						<div className="h-10 w-10 rounded-full bg-neutral-200 flex items-center justify-center overflow-hidden border border-neutral-200">
							<div className="h-full w-full bg-[#E5E7EB]" />
						</div>
					)}
				</div>
			</div>
		</header>
	);
}
