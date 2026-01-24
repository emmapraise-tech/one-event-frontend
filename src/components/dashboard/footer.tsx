'use client';

import Link from 'next/link';

export function DashboardFooter() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="mt-auto py-6 bg-transparent">
			<div className="mx-auto w-full max-w-[1600px] px-6 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
				<p>© {currentYear} OneEvent. All rights reserved.</p>
				<div className="flex items-center gap-6">
					<Link href="#" className="hover:text-primary-blue transition-colors">
						Vendor Support
					</Link>
					<Link href="#" className="hover:text-primary-blue transition-colors">
						Terms of Service
					</Link>
					<Link href="#" className="hover:text-primary-blue transition-colors">
						Privacy Policy
					</Link>
				</div>
			</div>
		</footer>
	);
}
