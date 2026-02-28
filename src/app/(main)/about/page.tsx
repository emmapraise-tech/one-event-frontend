import { Metadata } from 'next';
import { Building2, Users, ShieldCheck, HeartPulse } from 'lucide-react';
import Image from 'next/image';

export const metadata: Metadata = {
	title: 'About Us | OneEvent',
	description:
		'Learn more about OneEvent, the premier platform for booking event venues and services in Nigeria.',
};

export default function AboutPage() {
	return (
		<div className="flex flex-col min-h-screen">
			{/* Hero Section */}
			<section className="bg-[#0B1120] text-white py-24 md:py-32 overflow-hidden relative">
				<div className="absolute inset-0 bg-linear-to-b from-blue-900/20 to-transparent" />
				<div className="container mx-auto px-4 relative z-10">
					<div className="max-w-3xl mx-auto text-center">
						<h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight text-white">
							Redefining Event Planning in{' '}
							<span className="text-brand-gold">Nigeria</span>
						</h1>
						<p className="text-lg md:text-xl text-neutral-300 leading-relaxed mb-8">
							We are on a mission to connect event organizers with the perfect
							venues and top-tier services, making unforgettable celebrations
							accessible to everyone.
						</p>
					</div>
				</div>
			</section>

			{/* Our Story */}
			<section className="py-20 bg-white">
				<div className="container mx-auto px-4">
					<div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
						<div className="md:w-1/2">
							<div className="aspect-square md:aspect-4/3 rounded-3xl overflow-hidden bg-neutral-100 border border-neutral-200 shadow-xl relative grid place-items-center">
								<Image
									src="/images/about_us_hero.png"
									alt="Our Team"
									fill
									className="object-cover"
								/>
							</div>
						</div>
						<div className="md:w-1/2">
							<h2 className="text-3xl font-bold text-neutral-900 mb-6">
								Our Story
							</h2>
							<p className="text-lg text-neutral-600 mb-6 leading-relaxed">
								Founded with the vision to simplify the fragmented event
								industry, OneEvent began as a small directory of venues in
								Lagos. Today, we've grown into a comprehensive platform serving
								thousands of users across Nigeria.
							</p>
							<p className="text-lg text-neutral-600 leading-relaxed">
								Whether it's a traditional wedding, a corporate conference, or
								an intimate birthday party, we believe that the right setting
								and services are the foundation of any successful event. We
								built OneEvent to provide transparency, convenience, and trust.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Core Values */}
			<section className="py-20 bg-neutral-50">
				<div className="container mx-auto px-4">
					<div className="text-center max-w-2xl mx-auto mb-16">
						<h2 className="text-3xl font-bold text-neutral-900 mb-4">
							Our Core Values
						</h2>
						<p className="text-lg text-neutral-500">
							The principles that guide everything we do.
						</p>
					</div>
					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
						{[
							{
								icon: ShieldCheck,
								title: 'Trust & Transparency',
								desc: 'We verify every listing to ensure what you see is what you get, with no hidden fees.',
							},
							{
								icon: Users,
								title: 'Community First',
								desc: 'We build relationships that foster growth for both venue owners and event planners.',
							},
							{
								icon: Building2,
								title: 'Premium Quality',
								desc: 'We partner with the best venues and service providers to guarantee exceptional experiences.',
							},
							{
								icon: HeartPulse,
								title: 'Passion for Events',
								desc: "We are driven by the joy of bringing people together to celebrate life's special moments.",
							},
						].map((value, i) => (
							<div
								key={i}
								className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100 text-center hover:shadow-md transition-shadow"
							>
								<div className="w-14 h-14 mx-auto bg-blue-50 text-primary-blue rounded-xl flex items-center justify-center mb-6">
									<value.icon className="w-7 h-7" />
								</div>
								<h3 className="text-xl font-bold text-neutral-900 mb-3">
									{value.title}
								</h3>
								<p className="text-neutral-600 leading-relaxed">{value.desc}</p>
							</div>
						))}
					</div>
				</div>
			</section>
		</div>
	);
}
