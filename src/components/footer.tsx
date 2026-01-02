import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export function Footer() {
	return (
		<footer className="w-full border-t bg-background py-12 text-sm text-muted-foreground">
			<div className="container mx-auto grid gap-8 px-4 md:grid-cols-2 lg:grid-cols-4">
				{/* Brand */}
				<div className="flex flex-col gap-4">
					<Link
						href="/"
						className="flex items-center gap-2 font-bold text-foreground"
					>
						<div className="h-6 w-6 rounded-full bg-primary" />{' '}
						{/* Placeholder Logo */}
						OneEvent
					</Link>
					<p>© 2023 OneEvent Inc.</p>
				</div>

				{/* Links Column 1 */}
				<div className="flex flex-col gap-2">
					<Link href="/privacy" className="hover:text-foreground">
						Privacy
					</Link>
					<Link href="/terms" className="hover:text-foreground">
						Terms
					</Link>
					<Link href="/sitemap" className="hover:text-foreground">
						Sitemap
					</Link>
				</div>

				{/* Links Column 2 */}
				<div className="flex flex-col gap-2">
					<Link href="/support" className="hover:text-foreground">
						Support
					</Link>
				</div>

				{/* Socials & Language */}
				<div className="flex flex-col gap-4 items-end">
					<div className="flex gap-4">
						<GlobeIcon className="h-5 w-5" />
						<MailIcon className="h-5 w-5" />
					</div>
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
