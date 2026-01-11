import Link from 'next/link';
import Image from 'next/legacy/image';
import { ShieldCheck, BadgeCheck, Landmark } from 'lucide-react';

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2">
			{/* Left: Image Sidebar */}
			<div className="relative hidden lg:block h-full min-h-screen bg-neutral-900 text-white overflow-hidden">
				<div className="absolute inset-0">
					<Image
						src="/images/auth-sidebar.png"
						alt="Event Venue"
						layout="fill"
						objectFit="cover"
						className="opacity-60"
						priority
					/>
					<div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-black/10" />
				</div>

				<div className="relative z-10 h-full flex flex-col justify-between p-12">
					<div className="flex items-center gap-2 font-bold text-xl tracking-tight">
						<Landmark className="h-6 w-6 text-brand-gold" />
						<span>EventSpace</span>
					</div>

					<div className="space-y-6 max-w-lg">
						<h1 className="text-4xl font-bold leading-tight">
							Find the perfect space for your next event
						</h1>
						<p className="text-lg text-neutral-300">
							Join thousands of users booking and listing top-tier event centers
							around the globe.
						</p>

						<div className="flex items-center gap-4 pt-4">
							<div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-sm font-medium">
								<BadgeCheck className="h-4 w-4 text-brand-gold" />
								Verified Venues
							</div>
							<div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-sm font-medium">
								<ShieldCheck className="h-4 w-4 text-brand-gold" />
								Secure Booking
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Right: Content */}
			<div className="flex flex-col bg-white">
				{/* Mobile Header */}
				<div className="lg:hidden p-6 flex items-center justify-between border-b border-neutral-100">
					<Link
						href="/"
						className="flex items-center gap-2 font-bold text-lg tracking-tight text-neutral-900"
					>
						<Landmark className="h-5 w-5 text-brand-blue" />
						<span>EventSpace</span>
					</Link>
				</div>

				{/* Form Area */}
				<div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-20 xl:px-32 relative">
					{/* Desktop Header Logo (Absolute or separate) - Design shows logo top left of white area maybe? 
              Actually design doesn't clearly show logo on white side, but typical to have "Home" or Logo links.
              I will add a simplified header or just rely on the content. 
              Checking the image again: "EventSpace" logo top left of the WHITE area is standard.
          */}
					<div className="hidden lg:flex absolute top-8 left-8 lg:left-12">
						{/* Maybe keep it clean or add breadcrumbs/help links */}
						<div className="flex items-center gap-6 text-sm font-medium text-neutral-500">
							<Link
								href="/"
								className="hover:text-brand-blue transition-colors"
							>
								Venues
							</Link>
							{/* <Link
								href="/"
								className="hover:text-brand-blue transition-colors"
							>
								Vendors
							</Link> */}
							<Link
								href="/"
								className="hover:text-brand-blue transition-colors"
							>
								Help
							</Link>
						</div>
					</div>

					<div className="hidden lg:flex absolute top-8 right-8 lg:right-12">
						{/* Maybe Login button if on Register page? Handled by tabs actually */}
					</div>

					<div className="w-full max-w-md mx-auto">{children}</div>
				</div>
			</div>
		</div>
	);
}
