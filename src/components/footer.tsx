import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export function Footer() {
	return (
		<footer className="w-full border-t border-neutral-border bg-neutral-bg py-12 lg:py-16">
			<div className="container mx-auto px-4 md:px-6">
				<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
					{/* Brand */}
					<div className="flex flex-col gap-4">
						<Link href="/" className="flex items-center gap-2">
							<div className="h-6 w-6 rounded-md bg-primary-blue" />
							<span className="text-lg font-bold text-primary-blue">
								OneEvent
							</span>
						</Link>
						<p className="text-sm text-neutral-text-muted max-w-xs">
							The trusted platform for booking premium event venues and services
							in Nigeria.
						</p>
					</div>

					{/* Links Column 1 */}
					<div className="flex flex-col gap-3">
						<h4 className="font-semibold text-neutral-text-primary text-sm uppercase tracking-wider">
							Company
						</h4>
						<Link
							href="/about"
							className="text-sm text-neutral-text-muted hover:text-primary-blue transition-colors"
						>
							About Us
						</Link>
						<Link
							href="/careers"
							className="text-sm text-neutral-text-muted hover:text-primary-blue transition-colors"
						>
							Careers
						</Link>
						<Link
							href="/blog"
							className="text-sm text-neutral-text-muted hover:text-primary-blue transition-colors"
						>
							Blog
						</Link>
					</div>

					{/* Links Column 2 */}
					<div className="flex flex-col gap-3">
						<h4 className="font-semibold text-neutral-text-primary text-sm uppercase tracking-wider">
							Support
						</h4>
						<Link
							href="/help"
							className="text-sm text-neutral-text-muted hover:text-primary-blue transition-colors"
						>
							Help Center
						</Link>
						<Link
							href="/terms"
							className="text-sm text-neutral-text-muted hover:text-primary-blue transition-colors"
						>
							Terms of Service
						</Link>
						<Link
							href="/privacy"
							className="text-sm text-neutral-text-muted hover:text-primary-blue transition-colors"
						>
							Privacy Policy
						</Link>
					</div>

					{/* Socials & Newsletter Placeholder */}
					<div className="flex flex-col gap-4">
						<h4 className="font-semibold text-neutral-text-primary text-sm uppercase tracking-wider">
							Connect
						</h4>
						<div className="flex gap-4">
							<a
								href="#"
								className="h-10 w-10 rounded-full bg-white border border-neutral-border flex items-center justify-center text-neutral-text-muted hover:text-primary-blue hover:border-primary-blue transition-all"
							>
								<Twitter className="h-5 w-5" />
								<span className="sr-only">Twitter</span>
							</a>
							<a
								href="#"
								className="h-10 w-10 rounded-full bg-white border border-neutral-border flex items-center justify-center text-neutral-text-muted hover:text-primary-blue hover:border-primary-blue transition-all"
							>
								<Instagram className="h-5 w-5" />
								<span className="sr-only">Instagram</span>
							</a>
							<a
								href="#"
								className="h-10 w-10 rounded-full bg-white border border-neutral-border flex items-center justify-center text-neutral-text-muted hover:text-primary-blue hover:border-primary-blue transition-all"
							>
								<Facebook className="h-5 w-5" />
								<span className="sr-only">Facebook</span>
							</a>
						</div>
					</div>
				</div>

				<div className="mt-12 pt-8 border-t border-neutral-border flex flex-col md:flex-row justify-between items-center gap-4">
					<p className="text-sm text-neutral-text-muted">
						© {new Date().getFullYear()} OneEvent Inc. All rights reserved.
					</p>
					{/* <div className="flex gap-6">
						<span className="text-sm text-neutral-text-muted flex items-center gap-2">
							<span className="w-2 h-2 rounded-full bg-status-success"></span>
							Systems Normal
						</span>
					</div> */}
				</div>
			</div>
		</footer>
	);
}

function GlobeIcon(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<circle cx="12" cy="12" r="10" />
			<line x1="2" x2="22" y1="12" y2="12" />
			<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
		</svg>
	);
}

function MailIcon(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<rect width="20" height="16" x="2" y="4" rx="2" />
			<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
		</svg>
	);
}
