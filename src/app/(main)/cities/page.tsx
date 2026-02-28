import { Metadata } from 'next';
import { MapPin } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
	title: 'Cities | OneEvent',
	description:
		'Explore premium event venues available in major cities across Nigeria.',
};

export default function CitiesPage() {
	return (
		<div className="flex flex-col min-h-screen">
			{/* Hero Section */}
			<section className="bg-[#0B1120] text-white py-24 md:py-32 overflow-hidden relative">
				<div className="absolute inset-0 bg-linear-to-b from-blue-900/20 to-transparent" />
				<div className="container mx-auto px-4 relative z-10 text-center">
					<h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight text-white">
						Discover Venues by <span className="text-brand-gold">City</span>
					</h1>
					<p className="text-lg md:text-xl text-neutral-300 leading-relaxed max-w-2xl mx-auto">
						From the bustling streets of Lagos to the serene capital of Abuja,
						find the perfect location near you.
					</p>
				</div>
			</section>

			{/* Cities Grid */}
			<section className="py-20 bg-neutral-50 flex-1">
				<div className="container mx-auto px-4">
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
						{[
							{
								name: 'Lagos',
								venues: '1,200+',
								desc: "The heartbeat of Nigeria's event scene.",
							},
							{
								name: 'Abuja',
								venues: '850+',
								desc: 'Elegant spaces in the capital city.',
							},
							{
								name: 'Port Harcourt',
								venues: '420+',
								desc: 'Premium venues in the Garden City.',
							},
							{
								name: 'Ibadan',
								venues: '340+',
								desc: 'Historic and modern event centers.',
							},
							{
								name: 'Enugu',
								venues: '210+',
								desc: 'Beautiful spaces in the Coal City.',
							},
							{
								name: 'Kano',
								venues: '150+',
								desc: 'Grand halls and event complexes.',
							},
						].map((city, i) => (
							<Link
								href={`/listings?location=${city.name}`}
								key={i}
								className="group overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all border border-neutral-100 block"
							>
								<div className="h-48 bg-neutral-200 relative overflow-hidden">
									{/* Placeholder Image Layer */}
									<div className="absolute inset-0 bg-linear-to-b from-transparent to-black/60 group-hover:to-black/80 transition-colors z-10" />
									<div className="absolute bottom-4 left-4 z-20 text-white">
										<h3 className="text-2xl font-bold flex items-center gap-2">
											<MapPin className="w-5 h-5 text-brand-gold" />
											{city.name}
										</h3>
									</div>
								</div>
								<div className="p-6">
									<div className="flex justify-between items-center mb-2">
										<span className="text-neutral-500 font-medium">
											{city.desc}
										</span>
									</div>
									<div className="text-primary-blue font-bold">
										{city.venues} Venues Available &rarr;
									</div>
								</div>
							</Link>
						))}
					</div>
				</div>
			</section>
		</div>
	);
}
