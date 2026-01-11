import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Search,
	Calendar,
	CalendarCheck,
	MapPin,
	CheckCircle2,
	ChevronRight,
	ChevronLeft,
	Star,
	Heart,
	Building2,
	PartyPopper,
	Music,
	Utensils,
	Camera,
} from 'lucide-react';
import Link from 'next/link';
import { VenueListingCard } from '@/components/listings/venue-listing-card';
import { Listing } from '@/types/listing';

export default function Home() {
	// Mock Data for Featured Venues
	const featuredVenues: Listing[] = [
		{
			id: '1',
			title: 'The Grand Horizon Hall',
			slug: 'grand-horizon-hall',
			description: 'Luxury event center',
			addressLine: 'Victoria Island',
			city: 'Lagos',
			basePrice: 5000000,
			currency: 'NGN',
			rating: 4.8,
			reviewCount: 120,
			images: ['/images/venue-1.jpg'],
			status: 'ACTIVE',
			type: 'VENUE',
			hostId: 'host1',
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		{
			id: '2',
			title: 'City View Loft',
			slug: 'city-view-loft',
			description: 'Modern loft space',
			addressLine: 'Maitama',
			city: 'Abuja',
			basePrice: 2000000,
			currency: 'NGN',
			rating: 4.6,
			reviewCount: 85,
			images: ['/images/venue-2.jpg', '/images/venue-2.jpg'],
			status: 'ACTIVE',
			type: 'VENUE',
			hostId: 'host2',
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		{
			id: '3',
			title: 'Garden Terrace',
			slug: 'garden-terrace',
			description: 'Beautiful outdoor space',
			addressLine: 'Ikeja GRA',
			city: 'Lagos',
			basePrice: 1500000,
			currency: 'NGN',
			rating: 4.9,
			reviewCount: 200,
			images: [],
			status: 'ACTIVE',
			type: 'VENUE',
			hostId: 'host3',
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		{
			id: '4',
			title: 'Lakeside Pavilion',
			slug: 'lakeside-pavilion',
			description: 'Waterfront venue',
			addressLine: 'Jabi Lake',
			city: 'Abuja',
			basePrice: 4000000,
			currency: 'NGN',
			rating: 4.7,
			reviewCount: 95,
			images: [],
			status: 'ACTIVE',
			type: 'VENUE',
			hostId: 'host4',
			createdAt: new Date(),
			updatedAt: new Date(),
		},
	];

	return (
		<div className="flex min-h-screen flex-col">
			<main className="flex-1">
				{/* HERO SECTION */}
				<section className="relative min-h-[600px] flex items-center justify-center bg-[#111827] text-white overflow-hidden pt-20">
					{/* Background Gradient / Blur */}
					<div className="absolute inset-0 bg-[#0F172A]">
						<div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]" />
						<div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px]" />
					</div>

					<div className="container relative z-10 px-4 text-center">
						<h1 className="text-white text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
							Find the Perfect Venue
							<br />
							for Your Next Celebration
						</h1>
						<p className="text-white text-lg md:text-xl mb-10 max-w-2xl mx-auto">
							From intimate gatherings in Lagos to grand weddings in Abuja.
							Discover, compare, and book verified event centers across Nigeria.
						</p>

						{/* Search Bar */}
						<div className="bg-white rounded-lg p-2 max-w-3xl mx-auto flex flex-col md:flex-row gap-2 shadow-xl">
							<div className="flex-1 flex items-center px-4 border-b md:border-b-0 md:border-r border-gray-200 py-3 md:py-0">
								<MapPin className="h-5 w-5 text-gray-400 mr-3" />
								<input
									type="text"
									placeholder="Location or Venue Name"
									className="w-full text-gray-900 outline-none placeholder:text-gray-400"
								/>
							</div>
							<div className="flex-1 flex items-center px-4 border-b md:border-b-0 border-gray-200 py-3 md:py-0">
								<Calendar className="h-5 w-5 text-gray-400 mr-3" />
								<input
									type="text"
									placeholder="Date"
									className="w-full text-gray-900 outline-none placeholder:text-gray-400"
								/>
							</div>
							<Button className="bg-brand-gold hover:bg-brand-gold-hover text-white font-bold px-8 h-12 md:h-auto rounded-md w-full md:w-auto">
								Search
							</Button>
						</div>

						{/* Trust Badges */}
						<div className="flex justify-center gap-6 mt-10 text-xs font-semibold text-brand-gold uppercase tracking-wider">
							<div className="flex items-center gap-1.5">
								<CheckCircle2 className="h-4 w-4" /> Verified Vendors
							</div>
							<div className="flex items-center gap-1.5">
								<CheckCircle2 className="h-4 w-4" /> Secure Payments
							</div>
							<div className="flex items-center gap-1.5">
								<CheckCircle2 className="h-4 w-4" /> 24/7 Support
							</div>
						</div>
					</div>
				</section>

				{/* EXPLORE BY CATEGORY */}
				<section className="bg-neutral-50 py-20 px-4">
					<div className="container mx-auto">
						<div className="flex justify-between items-end mb-10">
							<div>
								<h2 className="text-2xl font-bold text-neutral-900 mb-2">
									Explore by Category
								</h2>
								<p className="text-neutral-500">
									Browse venues tailored to your specific event needs.
								</p>
							</div>
							<Link
								href="/listings"
								className="text-primary-blue text-sm font-semibold hover:underline flex items-center"
							>
								View all categories <ChevronRight className="h-4 w-4 ml-1" />
							</Link>
						</div>

						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
							{[
								{ name: 'Weddings', icon: Heart },
								{ name: 'Corporate', icon: Building2 },
								{ name: 'Parties', icon: PartyPopper },
								{ name: 'Concerts', icon: Music },
								{ name: 'Dining', icon: Utensils },
								{ name: 'Studios', icon: Camera },
							].map((cat) => (
								<div
									key={cat.name}
									className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col items-center justify-center gap-4 border border-transparent hover:border-primary-blue/20 group h-32"
								>
									<div className="h-10 w-10 bg-primary-soft-blue text-primary-blue rounded-full flex items-center justify-center group-hover:bg-primary-blue group-hover:text-white transition-colors">
										<cat.icon className="h-5 w-5" />
									</div>
									<span className="text-sm font-semibold text-neutral-900">
										{cat.name}
									</span>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* FEATURED EVENT CENTERS */}
				<section className="bg-white py-20 px-4">
					<div className="container mx-auto">
						<div className="text-center max-w-2xl mx-auto mb-16">
							<h2 className="text-3xl font-bold text-neutral-900 mb-4">
								Featured Event Centers
							</h2>
							<p className="text-neutral-500">
								Top-rated venues chosen by our community. Experience premium
								service and exceptional spaces.
							</p>
						</div>

						<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
							{featuredVenues.map((venue) => (
								<div key={venue.id} className="h-[420px]">
									<VenueListingCard listing={venue} />
								</div>
							))}
						</div>

						<div className="mt-12 text-center">
							<Link href="/listings">
								<Button
									variant="outline"
									className="border-neutral-200 text-neutral-900 hover:border-primary-blue hover:text-primary-blue px-8 h-12"
								>
									View All Venues
								</Button>
							</Link>
						</div>
					</div>
				</section>

				{/* THREE STEPS */}
				<section className="bg-white py-20 px-4 border-t border-neutral-100">
					<div className="container mx-auto">
						<div className="text-center mb-16">
							<h2 className="text-2xl font-bold text-neutral-900 mb-4">
								Three Steps to Your Event
							</h2>
							<p className="text-neutral-500 max-w-lg mx-auto">
								We've simplified the process so you can focus on planning the
								actual event details.
							</p>
						</div>

						<div className="grid md:grid-cols-3 gap-12 relative">
							{/* Connecting Line (Desktop) */}
							<div className="hidden md:block absolute top-[28px] left-[15%] right-[15%] h-[2px] bg-neutral-100 z-0"></div>

							{[
								{
									title: '1. Discover',
									desc: 'Browse verified listings with high-res photos and transparent pricing.',
									icon: MapPin,
								},
								{
									title: '2. Book',
									desc: 'Check availability instantly and secure your date with a small deposit.',
									icon: CalendarCheck,
								},
								{
									title: '3. Celebrate',
									desc: 'Enjoy your event knowing everything is confirmed and secure.',
									icon: PartyPopper,
								},
							].map((step, i) => (
								<div
									key={i}
									className="relative z-10 flex flex-col items-center text-center"
								>
									<div className="h-14 w-14 bg-white border border-neutral-100 shadow-sm rounded-full flex items-center justify-center mb-6 text-primary-blue">
										<step.icon className="h-6 w-6" />
									</div>
									<h3 className="font-bold text-lg mb-3 text-neutral-900">
										{step.title}
									</h3>
									<p className="text-sm text-neutral-500 leading-relaxed max-w-xs">
										{step.desc}
									</p>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* TESTIMONIALS */}
				<section className="bg-neutral-50 py-20 px-4">
					<div className="container mx-auto">
						<div className="flex justify-between items-center mb-10">
							<h2 className="text-2xl font-bold text-neutral-900">
								What our users say
							</h2>
							<div className="flex gap-2">
								<Button
									variant="outline"
									size="icon"
									className="h-8 w-8 rounded-full border-neutral-200"
								>
									<ChevronLeft className="h-4 w-4" />
								</Button>
								<Button
									variant="outline"
									size="icon"
									className="h-8 w-8 rounded-full bg-primary-blue text-white border-0 hover:bg-primary-blue-hover"
								>
									<ChevronRight className="h-4 w-4" />
								</Button>
							</div>
						</div>

						<div className="grid md:grid-cols-3 gap-6">
							{[
								{
									quote:
										'The platform is incredibly intuitive. I found a stunning hall for our traditional wedding in Lagos in less than an hour.',
									author: 'Chioma Okafor',
									role: 'Event Planner',
									initial: 'CO',
								},
								{
									quote:
										'As a venue owner in Ibadan, OneEvent has transformed my business. The dashboard is easy to use.',
									author: 'Babatunde Alabi',
									role: 'Venue Owner',
									initial: 'BA',
								},
								{
									quote:
										"OneEvent's filters helped us narrow down options quickly. We found our dream garden venue!",
									author: 'Zainab Ahmed',
									role: 'Bride-to-be',
									initial: 'ZA',
								},
							].map((t, i) => (
								<div
									key={i}
									className="bg-white p-8 rounded-xl shadow-sm border border-neutral-100"
								>
									<div className="flex text-brand-gold mb-4 gap-1">
										{[1, 2, 3, 4, 5].map((s) => (
											<Star key={s} className="h-3 w-3 fill-current" />
										))}
									</div>
									<p className="text-neutral-600 text-sm mb-6 leading-relaxed italic">
										"{t.quote}"
									</p>
									<div className="flex items-center gap-3">
										<div
											className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-xs ${
												i === 0
													? 'bg-blue-100 text-blue-600'
													: i === 1
													? 'bg-green-100 text-green-600'
													: 'bg-purple-100 text-purple-600'
											}`}
										>
											{t.initial}
										</div>
										<div>
											<div className="font-bold text-sm text-neutral-900">
												{t.author}
											</div>
											<div className="text-xs text-neutral-400">{t.role}</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* CTA SECTION */}
				<section className="container mx-auto px-4 py-20">
					<div className="bg-[#1E3A8A] rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl">
						<div className="p-10 md:p-16 md:w-1/2 flex flex-col justify-center text-white">
							<h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
								List your space on OneEvent
							</h2>
							<p className="text-white text-lg mb-8 leading-relaxed">
								Turn your extra space into extra income. Join thousands of venue
								owners across Nigeria who trust OneEvent to manage bookings and
								payments effortlessly.
							</p>
							<div className="flex gap-4">
								<Button className="bg-brand-gold hover:bg-brand-gold-hover text-white font-bold h-12 px-8">
									Become a Host
								</Button>
								<Button
									variant="outline"
									className="border-white/20 text-white hover:bg-white/10 h-12 px-8"
								>
									Learn More
								</Button>
							</div>
						</div>
						<div className="md:w-1/2 min-h-[400px] relative">
							{/* Image Placeholder */}
							<div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1632&q=80')] bg-cover bg-center"></div>
							{/* Subtle gradient for text readability if needed on mobile, but image is on side in desktop */}
							<div className="absolute inset-0 bg-black/10"></div>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}
