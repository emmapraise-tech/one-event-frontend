import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Terms of Service | OneEvent',
	description:
		'Read the OneEvent Terms of Service to understand the rules and guidelines for using our platform.',
};

export default function TermsPage() {
	return (
		<div className="flex flex-col min-h-screen">
			{/* Hero Section */}
			<section className="bg-[#0B1120] text-white py-16 md:py-20 relative">
				<div className="absolute inset-0 bg-linear-to-b from-blue-900/10 to-transparent" />
				<div className="container mx-auto px-4 relative z-10">
					<h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">
						Terms of Service
					</h1>
					<p className="text-neutral-400">Last updated: February 28, 2026</p>
				</div>
			</section>

			{/* Content */}
			<section className="py-16 md:py-24 bg-white flex-1">
				<div className="container mx-auto px-4 max-w-4xl">
					<div className="prose prose-lg prose-neutral max-w-none">
						<h2 className="text-2xl font-bold text-neutral-900 mb-4">
							1. Acceptance of Terms
						</h2>
						<p className="text-neutral-600 mb-8 leading-relaxed">
							By accessing and using OneEvent, you accept and agree to be bound
							by the terms and provision of this agreement. In addition, when
							using these particular services, you shall be subject to any
							posted guidelines or rules applicable to such services.
						</p>

						<h2 className="text-2xl font-bold text-neutral-900 mb-4">
							2. User Accounts
						</h2>
						<p className="text-neutral-600 mb-8 leading-relaxed">
							To use certain features of the platform, you must register for an
							account. You agree to provide accurate, current, and complete
							information during the registration process and to update such
							information to keep it accurate, current, and complete. You are
							responsible for safeguarding your password.
						</p>

						<h2 className="text-2xl font-bold text-neutral-900 mb-4">
							3. Booking and Payments
						</h2>
						<p className="text-neutral-600 mb-8 leading-relaxed">
							When you book a venue or service, you agree to pay all charges
							associated with the booking, including taxes and fees.
							Cancellation policies vary by vendor and are clearly displayed on
							each listing. You must abide by the specific cancellation and
							refund policies set by the venue or service provider.
						</p>

						<h2 className="text-2xl font-bold text-neutral-900 mb-4">
							4. Vendor Obligations
						</h2>
						<p className="text-neutral-600 mb-8 leading-relaxed">
							If you are listing a venue or service, you are responsible for
							ensuring that your listing is accurate, up-to-date, and complies
							with all local laws and regulations. You must honor all accepted
							bookings and provide the services as described in your listing.
						</p>

						<h2 className="text-2xl font-bold text-neutral-900 mb-4">
							5. Limitation of Liability
						</h2>
						<p className="text-neutral-600 mb-8 leading-relaxed">
							OneEvent acts as a marketplace to connect event organizers with
							venues and service providers. While we strive to verify our
							partners, we are not directly responsible for the quality of the
							services provided, nor any accidents or damages that occur during
							an event.
						</p>
					</div>
				</div>
			</section>
		</div>
	);
}
