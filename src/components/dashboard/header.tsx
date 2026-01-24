'use client';

import Link from 'next/link';
import { Bell, HelpCircle, Search, Menu } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { SidebarContent } from '@/components/dashboard/sidebar';

export function DashboardHeader() {
	return (
		<header className="flex h-16 items-center justify-between border-b border-neutral-200 bg-white px-4 md:px-8">
			<div className="flex items-center gap-4 flex-1">
				{/* Mobile Menu Trigger */}
				<Sheet>
					<SheetTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="md:hidden text-neutral-500"
						>
							<Menu className="h-5 w-5" />
						</Button>
					</SheetTrigger>
					<SheetContent side="left" className="p-0 w-72">
						<SidebarContent collapsed={false} />
					</SheetContent>
				</Sheet>

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

					{/* Profile dropdown moved to Sidebar */}
				</div>
			</div>
		</header>
	);
}
