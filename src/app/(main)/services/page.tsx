import { Metadata } from 'next';
import { Camera, Utensils, Music, Palette } from 'lucide-react';

export const metadata: Metadata = {
	title: 'Event Services | OneEvent',
	description:
		'Discover top-tier event services including catering, photography, decoration, and more.',
};

export default function ServicesPage() {
	return (
		<div className="flex flex-col min-h-screen">
			{/* Hero Section */}
			<section className="bg-[#0B1120] text-white py-24 md:py-32 overflow-hidden relative">
				<div className="absolute inset-0 bg-linear-to-b from-blue-900/20 to-transparent" />
				<div className="container mx-auto px-4 relative z-10 text-center">
					<h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight text-white">
						Exceptional <span className="text-brand-gold">Services</span> for
						Every Event
					</h1>
					<p className="text-lg md:text-xl text-neutral-300 leading-relaxed max-w-2xl mx-auto">
						From visionary photographers to masterful caterers, find the perfect
						professionals to bring your event to life.
					</p>
				</div>
			</section>

			{/* Services Categories */}
			<section className="py-20 bg-neutral-50 flex-1">
				<div className="container mx-auto px-4">
					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
						{[
							{
								icon: Camera,
								title: 'Photography & Video',
								desc: 'Capture every moment with professional photographers and videographers.',
							},
							{
								icon: Utensils,
								title: 'Catering & Dining',
								desc: 'Delight your guests with exquisite menus crafted by top chefs.',
							},
							{
								icon: Palette,
								title: 'Decoration & Design',
								desc: 'Transform any space into a stunning environment with expert decorators.',
							},
							{
								icon: Music,
								title: 'Entertainment',
								desc: 'Keep the energy high with DJs, live bands, and performers.',
							},
						].map((service, i) => (
							<div
								key={i}
								className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
							>
								<div className="w-16 h-16 mx-auto bg-blue-50 text-primary-blue rounded-full flex items-center justify-center mb-6">
									<service.icon className="w-8 h-8" />
								</div>
								<h3 className="text-xl font-bold text-neutral-900 mb-3">
									{service.title}
								</h3>
								<p className="text-neutral-600 leading-relaxed mb-6">
									{service.desc}
								</p>
								<div className="text-primary-blue font-semibold hover:underline cursor-pointer">
									Explore Providers &rarr;
								</div>
							</div>
						))}
					</div>

					<div className="mt-20 text-center max-w-2xl mx-auto relative p-8 bg-brand-gold rounded-3xl text-white shadow-xl overflow-hidden">
						<div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-white to-transparent"></div>
						<h2 className="text-3xl font-bold mb-4 relative z-10">
							Are you a Service Provider?
						</h2>
						<p className="text-lg mb-8 relative z-10 opacity-90">
							Join thousands of vendors connecting with clients across Nigeria.
						</p>
						<a
							href="/onboard-vendor"
							className="relative z-10 inline-block bg-white text-brand-gold px-8 py-4 rounded-xl font-bold hover:bg-neutral-50 transition-colors shadow-lg"
						>
							Become a Partner
						</a>
					</div>
				</div>
			</section>
		</div>
	);
}
