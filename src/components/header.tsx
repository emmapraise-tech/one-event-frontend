'use client';

import Link from 'next/link';
import {
	Menu,
	LogOut,
	LayoutDashboard,
	Settings,
	Calendar,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { useAuth } from '@/hooks/useAuth';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function Header() {
	const pathname = usePathname();
	const isHome = pathname === '/';
	const [isScrolled, setIsScrolled] = useState(false);
	const { user, isAuthenticated, logout } = useAuth();

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 20);
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	// Transparent if on Home AND not scrolled. Otherwise white.
	const isTransparent = false; //isHome && !isScrolled;

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
		<header
			className={`sticky top-0 z-50 w-full transition-all duration-300 ${
				isTransparent
					? 'bg-transparent border-transparent'
					: 'bg-white border-b border-neutral-200 shadow-sm'
			}`}
		>
			<div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6 relative">
				{/* Logo */}
				<Link href="/" className="flex items-center gap-2 group">
					<div
						className={`h-8 w-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105 ${
							isTransparent ? 'bg-white' : 'bg-primary-blue'
						}`}
					>
						<span
							className={`font-bold text-lg ${
								isTransparent ? 'text-primary-blue' : 'text-white'
							}`}
						>
							O
						</span>
					</div>
					<span
						className={`text-xl font-bold tracking-tight ${
							isTransparent ? 'text-white' : 'text-primary-blue'
						}`}
					>
						OneEvent
					</span>
				</Link>

				{/* Desktop Navigation - Centered */}
				<nav className="hidden md:flex items-center gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
					{[
						{ label: 'Find Venues', href: '/listings' },
						{ label: 'For Vendors', href: '/list-your-business' },
						{ label: 'Stories', href: '/stories' },
					].map((item) => (
						<Link
							key={item.label}
							href={item.href}
							className={`text-sm font-semibold transition-colors ${
								isTransparent
									? 'text-white hover:text-white/80'
									: 'text-neutral-text-primary hover:text-primary-blue'
							}`}
						>
							{item.label}
						</Link>
					))}
				</nav>

				{/* CTA & Mobile Menu */}
				<div className="flex items-center gap-4">
					{isAuthenticated && user ? (
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
						<>
							{/* Login Link */}
							<Link
								href="/login"
								className={`text-sm font-semibold hidden md:block ${
									isTransparent
										? 'text-white hover:text-white/90'
										: 'text-neutral-text-primary hover:text-primary-blue'
								}`}
							>
								Log In
							</Link>

							<Button
								asChild
								className={`hidden md:inline-flex font-bold ${
									isTransparent
										? 'bg-brand-blue text-white hover:bg-brand-blue-hover'
										: 'bg-brand-blue text-white hover:bg-brand-blue-hover'
								}`}
							>
								<Link href="/register">Sign Up</Link>
							</Button>
						</>
					)}

					{/* Mobile Menu Button - Show this even if logged in for nav links */}
					<button
						className={`md:hidden p-2 ${
							isTransparent ? 'text-white' : 'text-neutral-600'
						}`}
					>
						<Menu className="h-6 w-6" />
						<span className="sr-only">Toggle menu</span>
					</button>
				</div>
			</div>
		</header>
	);
}
