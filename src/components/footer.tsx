import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Facebook, Instagram, Twitter, Linkedin, Mail } from 'lucide-react';
import { Logo } from '@/components/logo';

export function Footer() {
	return (
		<footer className="w-full bg-[#0B1120] border-t border-white/10 pt-20 pb-10">
			<div className="container mx-auto px-4 md:px-6">
				<div className="grid gap-12 lg:grid-cols-4 mb-16">
					{/* Brand Column */}
					<div className="flex flex-col gap-6">
						<Link href="/" className="flex items-center gap-2">
							<Logo variant="dark" />
						</Link>
						<p className="text-neutral-400 leading-relaxed max-w-sm">
							The trusted platform for booking premium event venues and services
							across Nigeria. Discover, compare, and book with confidence.
						</p>
						<div className="flex gap-4 mt-2">
							<SocialLink href="#" icon={Twitter} label="Twitter" />
							<SocialLink href="#" icon={Instagram} label="Instagram" />
							<SocialLink href="#" icon={Facebook} label="Facebook" />
							<SocialLink href="#" icon={Linkedin} label="LinkedIn" />
						</div>
					</div>

					{/* Company Column */}
					<div className="flex flex-col gap-6">
						<h4 className="font-bold text-white tracking-wide">Company</h4>
						<ul className="flex flex-col gap-4">
							<FooterLink href="/about">About Us</FooterLink>
							<FooterLink href="/careers">Careers</FooterLink>
							<FooterLink href="/partners">Become a Partner</FooterLink>
							<FooterLink href="/blog">Blog</FooterLink>
						</ul>
					</div>

					{/* Discover Column */}
					<div className="flex flex-col gap-6">
						<h4 className="font-bold text-white tracking-wide">Discover</h4>
						<ul className="flex flex-col gap-4">
							<FooterLink href="/venues">Browse Venues</FooterLink>
							<FooterLink href="/services">Event Services</FooterLink>
							<FooterLink href="/cities">Cities</FooterLink>
							<FooterLink href="/inspiration">Inspiration</FooterLink>
						</ul>
					</div>

					{/* Newsletter Column */}
					<div className="flex flex-col gap-6">
						<h4 className="font-bold text-white tracking-wide">Stay Updated</h4>
						<p className="text-neutral-400 text-sm mb-2">
							Subscribe to get special offers, free giveaways, and
							once-in-a-lifetime deals.
						</p>
						<div className="flex flex-col gap-3">
							<div className="relative">
								<Mail className="absolute left-3 top-3 h-5 w-5 text-neutral-500" />
								<Input
									type="email"
									placeholder="Enter your email"
									className="bg-white/5 border-white/10 text-white pl-10 h-11 focus-visible:ring-primary-blue focus-visible:border-primary-blue rounded-xl placeholder:text-neutral-500"
								/>
							</div>
							<Button className="w-full bg-primary-blue hover:bg-primary-blue-hover text-white h-11 rounded-xl font-semibold shadow-lg shadow-blue-900/20">
								Subscribe
							</Button>
						</div>
					</div>
				</div>

				<div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
					<p className="text-sm text-neutral-500">
						© {new Date().getFullYear()} OneEvent Inc. All rights reserved.
					</p>
					<div className="flex gap-8">
						<Link
							href="/privacy"
							className="text-sm text-neutral-500 hover:text-white transition-colors"
						>
							Privacy Policy
						</Link>
						<Link
							href="/terms"
							className="text-sm text-neutral-500 hover:text-white transition-colors"
						>
							Terms of Service
						</Link>
						<Link
							href="/cookies"
							className="text-sm text-neutral-500 hover:text-white transition-colors"
						>
							Cookies Settings
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}

function SocialLink({
	href,
	icon: Icon,
	label,
}: {
	href: string;
	icon: any;
	label: string;
}) {
	return (
		<a
			href={href}
			className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-primary-blue hover:border-primary-blue transition-all duration-300"
			aria-label={label}
		>
			<Icon className="h-5 w-5" />
		</a>
	);
}

function FooterLink({
	href,
	children,
}: {
	href: string;
	children: React.ReactNode;
}) {
	return (
		<li>
			<Link
				href={href}
				className="text-neutral-400 hover:text-white transition-colors hover:translate-x-1 inline-block duration-200"
			>
				{children}
			</Link>
		</li>
	);
}
