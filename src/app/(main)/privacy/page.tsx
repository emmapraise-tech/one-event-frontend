import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Privacy Policy | OneEvent',
	description:
		'Read the OneEvent Privacy Policy to understand how we collect, use, and protect your data.',
};

export default function PrivacyPage() {
	return (
		<div className="flex flex-col min-h-screen">
			{/* Hero Section */}
			<section className="bg-[#0B1120] text-white py-16 md:py-20 relative">
				<div className="absolute inset-0 bg-linear-to-b from-blue-900/10 to-transparent" />
				<div className="container mx-auto px-4 relative z-10">
					<h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">
						Privacy Policy
					</h1>
					<p className="text-neutral-400">Last updated: February 28, 2026</p>
				</div>
			</section>

			{/* Content */}
			<section className="py-16 md:py-24 bg-white flex-1">
				<div className="container mx-auto px-4 max-w-4xl">
					<div className="prose prose-lg prose-neutral max-w-none">
						<h2 className="text-2xl font-bold text-neutral-900 mb-4">
							1. Introduction
						</h2>
						<p className="text-neutral-600 mb-8 leading-relaxed">
							Welcome to OneEvent ("we", "our", or "us"). We are committed to
							protecting your personal information and your right to privacy.
							This Privacy Policy explains what information we collect, how we
							use it, and what rights you have in relation to it when you visit
							our website or use our services.
						</p>

						<h2 className="text-2xl font-bold text-neutral-900 mb-4">
							2. Information We Collect
						</h2>
						<p className="text-neutral-600 mb-4 leading-relaxed">
							We collect personal information that you voluntarily provide to us
							when you register on the platform, express an interest in
							obtaining information about us or our products and services, or
							otherwise when you contact us. This includes:
						</p>
						<ul className="list-disc pl-6 text-neutral-600 mb-8 space-y-2">
							<li>
								Names, phone numbers, email addresses, and mailing addresses.
							</li>
							<li>Passwords and security data for authentication.</li>
							<li>
								Payment data required to process your bookings or earnings.
							</li>
						</ul>

						<h2 className="text-2xl font-bold text-neutral-900 mb-4">
							3. How We Use Your Information
						</h2>
						<p className="text-neutral-600 mb-4 leading-relaxed">
							We use personal information collected via our platform for a
							variety of business purposes, including:
						</p>
						<ul className="list-disc pl-6 text-neutral-600 mb-8 space-y-2">
							<li>To facilitate account creation and logon process.</li>
							<li>
								To fulfill and manage your bookings, payments, and refunds.
							</li>
							<li>
								To send administrative information to you regarding policies or
								your account.
							</li>
							<li>To improve our services and platform experience.</li>
						</ul>

						<h2 className="text-2xl font-bold text-neutral-900 mb-4">
							4. Sharing Your Information
						</h2>
						<p className="text-neutral-600 mb-8 leading-relaxed">
							We may share your data with third-party vendors, service
							providers, contractors, or agents who perform services for us or
							on our behalf and require access to such information to do that
							work (e.g., payment processing, email delivery, hosting services).
							We do not sell your personal information to third parties.
						</p>

						<h2 className="text-2xl font-bold text-neutral-900 mb-4">
							5. Contact Us
						</h2>
						<p className="text-neutral-600 mb-8 leading-relaxed">
							If you have questions or comments about this notice, you may email
							us at privacy@oneevent.com or by post to our registered office in
							Lagos, Nigeria.
						</p>
					</div>
				</div>
			</section>
		</div>
	);
}
