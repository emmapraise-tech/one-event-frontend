'use client';

import { Button } from '@/components/ui/button';

import {
	Search,
	Calendar as CalendarIcon,
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
	Users,
	Briefcase,
	Sun,
} from 'lucide-react';
import Link from 'next/link';
import { VenueListingCard } from '@/components/listings/venue-listing-card';
import { Listing, ListingType, ListingStatus } from '@/types/listing';
import { useState } from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { useListings } from '@/hooks/useListings';

export default function Home() {
	const [date, setDate] = useState<Date>();

	const { listings, isLoading } = useListings();

	// Use real listings if available, otherwise fallback to empty array (or keep mock for dev if preferred, but user asked to use endpoint)
	// Filter for ACTIVE status andVENUE type
	const featuredVenues =
		listings
			?.filter(
				(l) =>
					l.status === ListingStatus.ACTIVE && l.type === ListingType.VENUE,
			)
			.slice(0, 4) || [];

	return (
		<div className="flex min-h-screen flex-col">
			<main className="flex-1">
				{/* HERO SECTION */}
				<section className="relative min-h-[650px] flex items-center justify-center bg-neutral-900 text-white overflow-hidden pt-20">
					{/* Background Image & Overlay */}
					<div className="absolute inset-0">
						<div className="absolute inset-0 bg-[url('/images/hero_background.png')] bg-cover bg-center" />
						<div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
						{/* Subtle animated gradient overlay for depth */}
						<div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/30" />
					</div>

					<div className="container relative z-10 px-4 text-center">
						<h1 className="text-white text-4xl md:text-7xl font-bold mb-8 tracking-tight leading-tight drop-shadow-xl">
							Find the Perfect Venue
							<br />
							<span className="text-transparent bg-clip-text bg-linear-to-r from-blue-200 to-amber-200">
								for Your Next Celebration
							</span>
						</h1>
						<p className="text-neutral-200 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed drop-shadow-md font-medium">
							From intimate gatherings in Lagos to grand weddings in Abuja.
							Discover, compare, and book verified event centers across Nigeria.
						</p>

						{/* Search Bar */}
						<div className="bg-white/95 backdrop-blur-md rounded-2xl p-2 max-w-5xl mx-auto flex flex-col md:flex-row shadow-2xl hover:shadow-black/20 transition-shadow ring-1 ring-white/20">
							<div className="flex-2 px-6 border-b md:border-b-0 md:border-r border-gray-100 py-4 md:py-3 flex items-center gap-4">
								<div className="h-10 w-10 bg-blue-50 rounded-full flex items-center justify-center shrink-0 text-blue-600">
									<MapPin className="h-5 w-5" />
								</div>
								<div className="flex flex-col items-start w-full">
									<label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">
										Location
									</label>
									<input
										type="text"
										placeholder="Where are you going?"
										className="w-full text-gray-900 font-semibold outline-none placeholder:text-gray-400 text-sm bg-transparent"
									/>
								</div>
							</div>

							<div className="flex-1.5 px-6 border-b md:border-b-0 md:border-r border-gray-100 py-4 md:py-3 flex items-center gap-4">
								<div className="h-10 w-10 bg-blue-50 rounded-full flex items-center justify-center shrink-0 text-blue-600">
									<CalendarIcon className="h-5 w-5" />
								</div>
								<div className="flex flex-col items-start w-full">
									<label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">
										Date
									</label>
									<Popover>
										<PopoverTrigger asChild>
											<button
												className={cn(
													'w-full text-left font-semibold outline-none text-sm bg-transparent truncate',
													!date ? 'text-gray-400' : 'text-gray-900',
												)}
											>
												{date ? format(date, 'PPP') : 'Add dates'}
											</button>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0" align="start">
											<Calendar
												mode="single"
												selected={date}
												onSelect={setDate}
												initialFocus
											/>
										</PopoverContent>
									</Popover>
								</div>
							</div>

							<div className="flex-1.5 px-6 border-b md:border-b-0 border-gray-100 py-4 md:py-3 flex items-center gap-4">
								<div className="h-10 w-10 bg-blue-50 rounded-full flex items-center justify-center shrink-0 text-blue-600">
									<Users className="h-5 w-5" />
								</div>
								<div className="flex flex-col items-start w-full">
									<label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">
										Guests
									</label>
									<input
										type="number"
										placeholder="Add guests"
										className="w-full text-gray-900 font-semibold outline-none placeholder:text-gray-400 text-sm bg-transparent"
									/>
								</div>
							</div>

							<div className="p-2">
								<Button className="h-full w-full md:w-auto bg-brand-gold hover:bg-brand-gold-hover text-white font-bold px-8 rounded-xl shadow-lg hover:shadow-amber-500/25 transition-all text-base transform active:scale-95">
									<Search className="h-5 w-5 md:mr-2" />
									<span className="md:inline hidden">Search</span>
									<span className="md:hidden inline">Search Venues</span>
								</Button>
							</div>
						</div>

						{/* Trust Badges */}
						<div className="flex flex-wrap justify-center gap-6 md:gap-12 mt-12 text-xs font-bold text-white/80 uppercase tracking-widest drop-shadow-sm">
							<div className="flex items-center gap-2">
								<CheckCircle2 className="h-5 w-5 text-brand-gold" /> Verified
								Vendors
							</div>
							<div className="flex items-center gap-2">
								<CheckCircle2 className="h-5 w-5 text-brand-gold" /> Secure
								Payments
							</div>
							<div className="flex items-center gap-2">
								<CheckCircle2 className="h-5 w-5 text-brand-gold" /> 24/7
								Support
							</div>
						</div>
					</div>
				</section>

				{/* EXPLORE BY CATEGORY */}
				<section className="bg-white py-20 px-4">
					<div className="container mx-auto">
						<div className="flex justify-between items-end mb-12">
							<div>
								<h2 className="text-3xl font-bold text-neutral-900 mb-2 tracking-tight">
									Explore by Category
								</h2>
								<p className="text-neutral-500">
									Browse venues tailored to your specific event needs.
								</p>
							</div>
							<Link
								href="/listings"
								className="text-primary-blue text-sm font-semibold hover:underline flex items-center group"
							>
								View all categories{' '}
								<ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
							</Link>
						</div>

						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
							{[
								{ name: 'Weddings', icon: Heart },
								{ name: 'Corporate', icon: Building2 },
								{ name: 'Parties', icon: PartyPopper },
								{ name: 'Concerts', icon: Music },
								{ name: 'Networking', icon: Briefcase },
								{ name: 'Outdoor', icon: Sun },
							].map((cat) => (
								<div
									key={cat.name}
									className="bg-neutral-50 p-6 rounded-2xl transition-all cursor-pointer flex flex-col items-center justify-center gap-4 border border-transparent hover:border-primary-blue/20 hover:bg-white hover:shadow-lg group h-40"
								>
									<div className="h-12 w-12 bg-white text-neutral-600 rounded-xl shadow-sm flex items-center justify-center group-hover:bg-primary-blue group-hover:text-white transition-colors duration-300">
										<cat.icon className="h-6 w-6" />
									</div>
									<span className="text-sm font-bold text-neutral-700 group-hover:text-neutral-900">
										{cat.name}
									</span>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* FEATURED EVENT CENTERS */}
				<section className="bg-neutral-50 py-20 px-4">
					<div className="container mx-auto">
						<div className="text-center max-w-2xl mx-auto mb-12">
							<h2 className="text-3xl font-bold text-neutral-900 mb-4 tracking-tight">
								Featured Event Centers
							</h2>
							<p className="text-neutral-500 text-lg">
								Top-rated venues chosen by our community. Experience premium
								service and exceptional spaces.
							</p>
						</div>

						<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
							{isLoading ? (
								<div className="col-span-4 text-center py-20">
									Loading venues...
								</div>
							) : featuredVenues.length > 0 ? (
								featuredVenues.map((venue) => (
									<div key={venue.id} className="h-[440px]">
										<VenueListingCard listing={venue} />
									</div>
								))
							) : (
								<div className="col-span-4 text-center py-20 text-neutral-500">
									No featured venues found at the moment.
								</div>
							)}
						</div>

						<div className="mt-16 text-center">
							<Link href="/listings">
								<Button
									variant="outline"
									className="border-neutral-200 text-neutral-900 hover:border-primary-blue hover:text-primary-blue px-10 h-14 text-base font-semibold rounded-full"
								>
									View All Venues
								</Button>
							</Link>
						</div>
					</div>
				</section>

				{/* THREE STEPS */}
				<section className="bg-white py-20 px-4">
					<div className="container mx-auto">
						<div className="text-center mb-16">
							<h2 className="text-3xl font-bold text-neutral-900 mb-4 tracking-tight">
								Three Steps to Your Event
							</h2>
							<p className="text-neutral-500 max-w-lg mx-auto text-lg">
								We&apos;ve simplified the process so you can focus on planning
								the actual event details.
							</p>
						</div>

						<div className="grid md:grid-cols-3 gap-12 relative max-w-5xl mx-auto">
							{/* Connecting Line (Desktop) */}
							<div className="hidden md:block absolute top-[40px] left-[15%] right-[15%] h-[2px] bg-neutral-100 z-0"></div>

							{[
								{
									title: '1. Discover',
									desc: 'Browse verified listings with high-res photos and transparent pricing.',
									icon: MapPin,
								},
								{
									title: '2. Book',
									desc: 'Check availability instantly and Lock your date with a 50% deposit.',
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
									className="relative z-10 flex flex-col items-center text-center group"
								>
									<div className="h-20 w-20 bg-white border-2 border-neutral-100 shadow-lg rounded-2xl flex items-center justify-center mb-6 text-neutral-400 group-hover:text-primary-blue group-hover:border-primary-blue transition-all duration-300">
										<step.icon className="h-8 w-8" />
									</div>
									<h3 className="font-bold text-xl mb-3 text-neutral-900">
										{step.title}
									</h3>
									<p className="text-neutral-500 leading-relaxed max-w-xs px-4">
										{step.desc}
									</p>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* TESTIMONIALS */}
				<section className="bg-blue-50 py-20 px-4 overflow-hidden relative">
					{/* Background Pattern */}
					<div className="absolute top-0 right-0 p-20 opacity-5">
						<PartyPopper className="h-96 w-96 text-primary-blue" />
					</div>

					<div className="container mx-auto relative z-10">
						<div className="flex justify-between items-center mb-12">
							<h2 className="text-3xl font-bold text-neutral-900 tracking-tight">
								What our users say
							</h2>
							<div className="flex gap-3">
								<Button
									variant="outline"
									size="icon"
									className="h-10 w-10 rounded-full border-neutral-200 bg-white hover:bg-neutral-50"
								>
									<ChevronLeft className="h-5 w-5" />
								</Button>
								<Button
									variant="outline"
									size="icon"
									className="h-10 w-10 rounded-full bg-primary-blue text-white border-0 hover:bg-primary-blue-hover hover:scale-105 transition-transform shadow-lg shadow-blue-500/30"
								>
									<ChevronRight className="h-5 w-5" />
								</Button>
							</div>
						</div>

						<div className="grid md:grid-cols-3 gap-8">
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
									className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100 hover:shadow-xl transition-shadow duration-300"
								>
									<div className="flex text-brand-gold mb-6 gap-1">
										{[1, 2, 3, 4, 5].map((s) => (
											<Star key={s} className="h-4 w-4 fill-current" />
										))}
									</div>
									<p className="text-neutral-700 text-lg mb-8 leading-relaxed italic font-medium">
										&quot;{t.quote}&quot;
									</p>
									<div className="flex items-center gap-4">
										<div
											className={`h-12 w-12 rounded-full flex items-center justify-center font-bold text-sm shadow-inner ${
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
											<div className="font-bold text-base text-neutral-900">
												{t.author}
											</div>
											<div className="text-sm text-neutral-500">{t.role}</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* CTA SECTION */}
				<section className="container mx-auto px-4 py-20">
					<div className="bg-[#1E3A8A] rounded-4xl overflow-hidden flex flex-col md:flex-row shadow-2xl relative">
						{/* Background Image & Overlay */}
						<div className="absolute inset-0">
							<div className="absolute inset-0 bg-[url('/images/cta_background.png')] bg-cover bg-center" />
							<div className="absolute inset-0 bg-blue-900/80 mix-blend-multiply" />
							<div className="absolute inset-0 bg-linear-to-r from-blue-950/90 to-transparent" />
						</div>

						<div className="p-10 md:p-20 md:w-1/2 flex flex-col justify-center text-white relative z-10">
							<h2 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
								List your space on <br />
								OneEvent
							</h2>
							<p className="text-blue-100 text-lg mb-10 leading-relaxed max-w-md">
								Turn your extra space into extra income. Join thousands of venue
								owners across Nigeria who trust OneEvent to manage bookings and
								payments effortlessly.
							</p>
							<div className="flex flex-col sm:flex-row gap-4">
								<Button className="bg-brand-gold hover:bg-brand-gold-hover text-white font-bold h-14 px-12 rounded-xl shadow-lg shadow-amber-500/20 text-lg border border-transparent">
									Become a Partner
								</Button>
								<Button
									variant="outline"
									className="border-white/30 text-white bg-white/5 hover:bg-white/20 h-14 px-12 rounded-xl text-lg backdrop-blur-sm transition-all"
								>
									Learn More
								</Button>
							</div>
						</div>
						<div className="md:w-1/2 min-h-[500px] relative z-10">
							{/* Image Placeholder */}
							<div className="absolute inset-0 bg-[url('/images/venue_host.png')] bg-cover bg-center"></div>
							{/* Gradient Overlay */}
							<div className="absolute inset-0 bg-linear-to-r from-[#172554] via-[#172554]/50 to-transparent md:w-3/4"></div>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}
