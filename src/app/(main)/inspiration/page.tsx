import { Metadata } from 'next';
import { Sparkles, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export const metadata: Metadata = {
	title: 'Inspiration | OneEvent',
	description:
		'Get inspired for your next event with curated galleries and creative ideas.',
};

export default function InspirationPage() {
	return (
		<div className="flex flex-col min-h-screen">
			{/* Hero Section */}
			<section className="bg-[#0B1120] text-white py-24 md:py-32 overflow-hidden relative">
				<div className="absolute inset-0 bg-linear-to-b from-blue-900/20 to-transparent" />
				<div className="container mx-auto px-4 relative z-10 text-center">
					<h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight text-white flex items-center justify-center gap-4">
						<Sparkles className="w-10 h-10 text-brand-gold" /> Event{' '}
						<span className="text-brand-gold">Inspiration</span>
					</h1>
					<p className="text-lg md:text-xl text-neutral-300 leading-relaxed max-w-2xl mx-auto">
						Browse curated galleries, latest trends, and real events brought to
						life on OneEvent to spark ideas for your special day.
					</p>
				</div>
			</section>

			{/* Masonry/Grid Gallery Placeholder */}
			<section className="py-20 bg-white flex-1">
				<div className="container mx-auto px-4">
					{/* Categories */}
					<div className="flex flex-wrap justify-center gap-4 mb-16">
						{[
							'All',
							'Weddings',
							'Corporate',
							'Birthdays',
							'Outdoor',
							'Traditional',
						].map((cat, i) => (
							<Button
								key={i}
								variant={i === 0 ? 'default' : 'outline'}
								className={
									i === 0
										? 'bg-primary-blue hover:bg-primary-blue-hover text-white rounded-full px-8'
										: 'border-neutral-200 text-neutral-700 hover:text-primary-blue hover:border-primary-blue rounded-full px-8'
								}
							>
								{cat}
							</Button>
						))}
					</div>

					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]">
						{[
							'/images/venue-1.jpg',
							'/images/venue-2.jpg',
							'/images/venue-3.jpg',
							'/images/venue-4.jpg',
							'/images/venue_city_view_loft.png',
							'/images/venue_garden_terrace.png',
							'/images/venue_grand_horizon.png',
							'/images/venue_lakeside_pavilion.png',
						].map((imgSrc, i) => (
							<div
								key={i}
								className={`
									relative rounded-2xl overflow-hidden group bg-neutral-100 border border-neutral-200 shadow-sm hover:shadow-xl transition-all cursor-pointer
									${i === 0 || i === 3 || i === 6 ? 'md:col-span-2 md:row-span-2' : ''}
								`}
							>
								<Image
									src={imgSrc}
									alt={`Event Inspiration ${i + 1}`}
									fill
									className="object-cover group-hover:scale-105 transition-transform duration-500"
								/>
								<div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />

								<div className="absolute bottom-4 left-4 right-4 z-20 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-300">
									<div>
										<p className="text-white font-bold text-lg mb-1">
											Elegant Setting {i + 1}
										</p>
										<p className="text-neutral-300 text-sm">Lagos, Nigeria</p>
									</div>
									<button className="h-10 w-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-brand-gold transition-colors">
										<Heart className="w-5 h-5" />
									</button>
								</div>
							</div>
						))}
					</div>

					<div className="mt-16 text-center">
						<Button
							variant="outline"
							className="border-neutral-200 text-neutral-900 hover:bg-neutral-100 px-8 py-6 rounded-xl text-base font-bold transition-all"
						>
							Load More Inspiration
						</Button>
					</div>
				</div>
			</section>
		</div>
	);
}
