'use client';

import Link from 'next/link';
import {
	Menu,
	LogOut,
	LayoutDashboard,
	Settings,
	Calendar,
	PlusCircle,
	User,
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
import { Logo } from '@/components/logo';

export function Header() {
	const pathname = usePathname();
	const isHome = pathname === '/';
	const [isScrolled, setIsScrolled] = useState(false);
	const { user, isAuthenticated, logout } = useAuth();

	// Mobile menu state
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 10);
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	// Determine transparency based on route and scroll state
	const isTransparent = isHome && !isScrolled;

	// Dropdown Hover Logic for Desktop
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
			className={`${isHome ? 'fixed' : 'sticky'} top-0 z-50 w-full transition-all duration-300 ${
				isTransparent
					? 'bg-transparent border-transparent py-6'
					: 'bg-white/80 backdrop-blur-md border-b border-neutral-200 shadow-sm py-4'
			}`}
		>
			<div className="container mx-auto flex items-center justify-between gap-4 px-4 md:px-6">
				{/* Logo */}
				<Logo variant={isTransparent ? 'transparent' : 'default'} />

				{/* Desktop Navigation - Centered */}
				<nav className="hidden md:flex items-center gap-1 bg-white/10 backdrop-blur-sm px-2 py-1.5 rounded-full border border-white/10 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 shadow-sm">
					{[
						{ label: 'Venues', href: '/listings' },
						{ label: 'Services', href: '/services' },
						{ label: 'Blog', href: '/blog' },
					].map((item) => (
						<Link
							key={item.label}
							href={item.href}
							className={`text-sm font-medium px-5 py-2 rounded-full transition-all duration-200 ${
								isTransparent
									? 'text-white hover:bg-white/10'
									: 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
							}`}
						>
							{item.label}
						</Link>
					))}
				</nav>

				{/* Right Actions */}
				<div className="flex items-center gap-2 z-50">
					{isAuthenticated && user ? (
						<div className="flex items-center gap-4">
							{user.type === 'CUSTOMER' && (
								<Link href="/onboard-vendor">
									<Button
										variant="outline"
										className={`hidden md:flex rounded-full px-5 font-bold border-2 transition-all ${
											isTransparent
												? 'text-white border-white/30 hover:bg-white/10'
												: 'text-brand-blue border-brand-blue/20 hover:bg-neutral-50'
										}`}
									>
										List your venue
									</Button>
								</Link>
							)}
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
											className={`relative h-10 w-10 rounded-full transition-all ${
												isTransparent
													? 'hover:bg-white/10'
													: 'hover:bg-neutral-100'
											}`}
										>
											<Avatar
												className={`h-10 w-10 border-2 transition-all ${isTransparent ? 'border-white/30' : 'border-white shadow-sm'}`}
											>
												<AvatarImage
													src={undefined} // Replace with actual user image if available
													alt={user.firstName}
													className="object-cover"
												/>
												<AvatarFallback className="bg-brand-blue text-white font-bold">
													{getInitials(user.firstName, user.lastName)}
												</AvatarFallback>
											</Avatar>
										</Button>
									</DropdownMenuTrigger>
								</div>

								<DropdownMenuContent
									className="w-64 bg-white/95 backdrop-blur-xl border-neutral-100 shadow-xl rounded-2xl p-2 mt-2"
									align="end"
									forceMount
									onMouseEnter={handleMouseEnter}
									onMouseLeave={handleMouseLeave}
								>
									<DropdownMenuLabel className="font-normal p-3 bg-neutral-50/50 rounded-xl mb-2">
										<div className="flex flex-col space-y-1">
											<p className="text-sm font-bold text-neutral-900">
												{user.firstName} {user.lastName}
											</p>
											<p className="text-xs text-neutral-500 font-medium">
												{user.email}
											</p>
										</div>
									</DropdownMenuLabel>

									<div className="grid gap-1 px-1">
										<DropdownMenuItem
											asChild
											className="rounded-lg focus:bg-neutral-100 cursor-pointer"
										>
											<Link
												href="/dashboard"
												className="flex items-center py-2.5"
											>
												<LayoutDashboard className="mr-3 h-4 w-4 text-neutral-500" />
												<span className="font-medium">Dashboard</span>
											</Link>
										</DropdownMenuItem>
										<DropdownMenuItem
											asChild
											className="rounded-lg focus:bg-neutral-100 cursor-pointer"
										>
											<Link
												href="/dashboard/my-bookings"
												className="flex items-center py-2.5"
											>
												<Calendar className="mr-3 h-4 w-4 text-neutral-500" />
												<span className="font-medium">My Bookings</span>
											</Link>
										</DropdownMenuItem>
										<DropdownMenuItem
											asChild
											className="rounded-lg focus:bg-neutral-100 cursor-pointer"
										>
											<Link
												href="/dashboard/settings"
												className="flex items-center py-2.5"
											>
												<Settings className="mr-3 h-4 w-4 text-neutral-500" />
												<span className="font-medium">Settings</span>
											</Link>
										</DropdownMenuItem>
									</div>

									<DropdownMenuSeparator className="my-2 bg-neutral-100" />

									<DropdownMenuItem
										onClick={() => logout()}
										className="text-red-500 focus:text-red-600 focus:bg-red-50 rounded-lg cursor-pointer py-2.5 m-1"
									>
										<LogOut className="mr-3 h-4 w-4" />
										<span className="font-medium">Log out</span>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					) : (
						<div className="flex items-center gap-3">
							{/* Login Link */}
							<Link href="/login">
								<Button
									variant="ghost"
									className={`hidden md:inline-flex rounded-full px-5 font-semibold transition-all ${
										isTransparent
											? 'text-white hover:bg-white/10 hover:text-white'
											: 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
									}`}
								>
									Log In
								</Button>
							</Link>

							<Link href="/register">
								<Button
									className={`hidden md:inline-flex font-bold rounded-full px-6 shadow-lg shadow-amber-500/20 transition-all ${
										isTransparent
											? 'bg-white text-brand-gold hover:bg-amber-50'
											: 'bg-brand-gold text-white hover:bg-brand-gold-hover'
									}`}
								>
									Sign Up
								</Button>
							</Link>
						</div>
					)}

					{/* Mobile Menu Button */}
					<button
						className={`md:hidden p-2 rounded-full transition-colors ${
							isTransparent
								? 'text-white hover:bg-white/20'
								: 'text-neutral-900 hover:bg-neutral-100'
						}`}
						onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
					>
						<Menu className="h-6 w-6" />
						<span className="sr-only">Toggle menu</span>
					</button>
				</div>

				{/* Mobile Navigation Dropdown - Simplified for now */}
				{isMobileMenuOpen && (
					<div className="absolute top-full left-0 right-0 bg-white border-b border-neutral-100 shadow-xl p-4 md:hidden flex flex-col gap-4 animate-in slide-in-from-top-2 z-40">
						<nav className="flex flex-col gap-2">
							<Link
								href="/listings"
								onClick={() => setIsMobileMenuOpen(false)}
								className="text-neutral-700 font-medium p-2 hover:bg-neutral-50 rounded-lg"
							>
								Venues
							</Link>
							<Link
								href="/services"
								onClick={() => setIsMobileMenuOpen(false)}
								className="text-neutral-700 font-medium p-2 hover:bg-neutral-50 rounded-lg"
							>
								Services
							</Link>
							<Link
								href="/blog"
								onClick={() => setIsMobileMenuOpen(false)}
								className="text-neutral-700 font-medium p-2 hover:bg-neutral-50 rounded-lg"
							>
								Blog
							</Link>
							<div className="h-px bg-neutral-100 my-1" />

							{/* Auth & Dashboard Links */}
							{isAuthenticated && user ? (
								<>
									<div className="p-2 mb-2 bg-neutral-50 rounded-lg">
										<p className="text-sm font-bold text-neutral-900">
											{user.firstName} {user.lastName}
										</p>
										<p className="text-xs text-neutral-500 font-medium">
											{user.email}
										</p>
									</div>
									<Link
										href="/dashboard"
										onClick={() => setIsMobileMenuOpen(false)}
										className="flex items-center text-neutral-700 font-medium p-2 hover:bg-neutral-50 rounded-lg"
									>
										<LayoutDashboard className="mr-3 h-4 w-4 text-neutral-400" />
										Dashboard
									</Link>
									<Link
										href="/dashboard/my-bookings"
										onClick={() => setIsMobileMenuOpen(false)}
										className="flex items-center text-neutral-700 font-medium p-2 hover:bg-neutral-50 rounded-lg"
									>
										<Calendar className="mr-3 h-4 w-4 text-neutral-400" />
										My Bookings
									</Link>
									<div className="h-px bg-neutral-100 my-1" />
									<button
										onClick={() => {
											setIsMobileMenuOpen(false);
											logout();
										}}
										className="flex items-center text-red-600 font-medium p-2 hover:bg-red-50 rounded-lg text-left"
									>
										<LogOut className="mr-3 h-4 w-4" />
										Log out
									</button>
								</>
							) : (
								<>
									<Link
										href="/login"
										onClick={() => setIsMobileMenuOpen(false)}
									>
										<Button
											variant="outline"
											className="w-full justify-start mb-2"
										>
											Log In
										</Button>
									</Link>
									<Link
										href="/register"
										onClick={() => setIsMobileMenuOpen(false)}
									>
										<Button className="w-full justify-start bg-brand-gold hover:bg-brand-gold-hover text-white">
											Sign Up
										</Button>
									</Link>
								</>
							)}

							{isAuthenticated && user?.type === 'CUSTOMER' && (
								<>
									<div className="h-px bg-neutral-100 my-1" />
									<Link
										href="/onboard-vendor"
										onClick={() => setIsMobileMenuOpen(false)}
										className="text-brand-gold font-bold p-2 hover:bg-amber-50 rounded-lg"
									>
										List your venue
									</Link>
								</>
							)}
							{!isAuthenticated && (
								<>
									<div className="h-px bg-neutral-100 my-1" />
									<Link
										href="/onboard-vendor"
										onClick={() => setIsMobileMenuOpen(false)}
										className="text-brand-gold font-bold p-2 hover:bg-amber-50 rounded-lg"
									>
										List your venue
									</Link>
								</>
							)}
						</nav>
					</div>
				)}
			</div>
		</header>
	);
}
