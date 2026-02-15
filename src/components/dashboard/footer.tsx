'use client';

import Link from 'next/link';

export function DashboardFooter() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="border-t border-neutral-200 bg-white h-20 flex items-center">
			<div className="w-full px-4 md:px-8">
				<div className="flex flex-col md:flex-row items-center justify-between gap-6">
					<div className="flex flex-col items-center md:items-start gap-2">
						<p className="text-sm font-semibold text-neutral-900">
							OneEvent for Vendors
						</p>
						<p className="text-xs text-neutral-500">
							© {currentYear} OneEvent Inc. Empowering local businesses.
						</p>
					</div>

					<div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
						<Link
							href="/dashboard/support"
							className="text-xs font-bold text-neutral-500 hover:text-brand-blue transition-colors uppercase tracking-wider"
						>
							Support Center
						</Link>
						<Link
							href="/terms"
							className="text-xs font-bold text-neutral-500 hover:text-brand-blue transition-colors uppercase tracking-wider"
						>
							Terms
						</Link>
						<Link
							href="/privacy"
							className="text-xs font-bold text-neutral-500 hover:text-brand-blue transition-colors uppercase tracking-wider"
						>
							Privacy
						</Link>
						<Link
							href="/cookies"
							className="text-xs font-bold text-neutral-500 hover:text-brand-blue transition-colors uppercase tracking-wider"
						>
							Cookies
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
