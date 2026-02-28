import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Cookie Policy | OneEvent',
	description:
		'Learn about how OneEvent uses cookies and similar tracking technologies.',
};

export default function CookiesPage() {
	return (
		<div className="flex flex-col min-h-screen">
			{/* Hero Section */}
			<section className="bg-[#0B1120] text-white py-16 md:py-20 relative">
				<div className="absolute inset-0 bg-linear-to-b from-blue-900/10 to-transparent" />
				<div className="container mx-auto px-4 relative z-10">
					<h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">
						Cookie Policy
					</h1>
					<p className="text-neutral-400">Last updated: February 28, 2026</p>
				</div>
			</section>

			{/* Content */}
			<section className="py-16 md:py-24 bg-white flex-1">
				<div className="container mx-auto px-4 max-w-4xl">
					<div className="prose prose-lg prose-neutral max-w-none">
						<h2 className="text-2xl font-bold text-neutral-900 mb-4">
							1. What Are Cookies?
						</h2>
						<p className="text-neutral-600 mb-8 leading-relaxed">
							Cookies are small data files that are placed on your computer or
							mobile device when you visit a website. Cookies are widely used by
							website owners in order to make their websites work, or to work
							more efficiently, as well as to provide reporting information.
						</p>

						<h2 className="text-2xl font-bold text-neutral-900 mb-4">
							2. Why Do We Use Cookies?
						</h2>
						<p className="text-neutral-600 mb-4 leading-relaxed">
							We use first-party and third-party cookies for several reasons.
							Some cookies are required for technical reasons in order for our
							platform to operate, and we refer to these as "essential" or
							"strictly necessary" cookies. Other cookies enable us to track and
							target the interests of our users to enhance the experience on our
							platform.
						</p>
						<ul className="list-disc pl-6 text-neutral-600 mb-8 space-y-2">
							<li>
								<strong className="text-neutral-900">Essential Cookies:</strong>{' '}
								Crucial for the basic functions of the website, like logging in
								or secure transactions.
							</li>
							<li>
								<strong className="text-neutral-900">
									Performance and Functionality Cookies:
								</strong>{' '}
								Used to enhance the performance and functionality of our
								platform but are non-essential.
							</li>
							<li>
								<strong className="text-neutral-900">
									Analytics and Customization Cookies:
								</strong>{' '}
								Collect information that is used in aggregate form to help us
								understand how our platform is being used.
							</li>
						</ul>

						<h2 className="text-2xl font-bold text-neutral-900 mb-4">
							3. How Can You Control Cookies?
						</h2>
						<p className="text-neutral-600 mb-8 leading-relaxed">
							You have the right to decide whether to accept or reject cookies.
							You can exercise your cookie rights by setting your preferences in
							the Cookie Consent Manager. You can also set or amend your web
							browser controls to accept or refuse cookies. If you choose to
							reject cookies, you may still use our website though your access
							to some functionality and areas of our website may be restricted.
						</p>
					</div>
				</div>
			</section>
		</div>
	);
}
