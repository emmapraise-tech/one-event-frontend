'use client';

import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Loader2,
	MapPin,
	Star,
	Heart,
	ArrowRight,
	TrendingUp,
	Users,
	Search,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Input } from '@/components/ui/input';

export default function SavedVenuesPage() {
	const { user, isLoading } = useAuth();
	const [searchQuery, setSearchQuery] = useState('');

	// Mock data for saved venues
	const savedVenues = [
		{
			id: '1',
			name: 'Lekki Event Center',
			city: 'Lekki',
			state: 'Lagos',
			rating: 4.8,
			price: 250000,
			currency: '₦',
			capacity: '500-1000',
			image:
				'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80',
			type: 'Hall',
			popular: true,
		},
		{
			id: '2',
			name: 'Victoria Imperial Suites',
			city: 'Victoria Island',
			state: 'Lagos',
			rating: 4.9,
			price: 450000,
			currency: '₦',
			capacity: '200-400',
			image:
				'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80',
			type: 'Hotel',
			popular: false,
		},
		{
			id: '3',
			name: 'Ikeja Garden Pavilion',
			city: 'Ikeja',
			state: 'Lagos',
			rating: 4.5,
			price: 150000,
			currency: '₦',
			capacity: '1000+',
			image:
				'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80',
			type: 'Garden',
			popular: true,
		},
	];

	const filteredVenues = savedVenues.filter(
		(venue) =>
			venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			venue.city.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	if (isLoading) {
		return (
			<div className="flex h-[60vh] items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
			</div>
		);
	}

	return (
		<div className="space-y-8 pb-20">
			{/* Header */}
			<div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
				<div className="animate-in fade-in slide-in-from-left-4 duration-500">
					<h1 className="text-3xl font-bold text-neutral-900 tracking-tight flex items-center gap-3">
						Saved Venues <Heart className="h-7 w-7 text-red-500 fill-red-500" />
					</h1>
					<p className="text-neutral-500 mt-1">
						Manage your shortlisted venues and compare options for your events
					</p>
				</div>
				<div className="animate-in fade-in slide-in-from-right-4 duration-500">
					<Link href="/listings">
						<Button className="bg-brand-blue hover:bg-brand-blue-hover text-white h-11 px-6 font-bold rounded-xl shadow-lg shadow-blue-500/20">
							Discover More
						</Button>
					</Link>
				</div>
			</div>

			{/* Search */}
			<div className="relative max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
				<Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
				<Input
					placeholder="Search your saved list..."
					className="pl-11 h-12 bg-white border-neutral-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-brand-blue/10 transition-all"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
			</div>

			{filteredVenues.length === 0 ? (
				<div className="bg-white rounded-[40px] border border-neutral-100 p-16 text-center shadow-sm animate-in zoom-in-95 duration-500">
					<div className="h-20 w-20 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-6">
						<Heart className="h-10 w-10 text-neutral-200" />
					</div>
					<h3 className="text-xl font-bold text-neutral-900 mb-2">
						No venues saved yet
					</h3>
					<p className="text-neutral-500 mb-8 max-w-xs mx-auto">
						Click the heart icon on any venue to add it to your shortlist for
						easy access later.
					</p>
					<Link href="/listings">
						<Button className="bg-brand-blue hover:bg-brand-blue-hover text-white h-12 px-8 font-bold rounded-2xl shadow-lg shadow-blue-500/20">
							Start Exploring
						</Button>
					</Link>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
					{filteredVenues.map((venue) => (
						<Card
							key={venue.id}
							className="group overflow-hidden rounded-[32px] border-neutral-100 shadow-md hover:shadow-xl transition-all duration-500 bg-white"
						>
							<CardContent className="p-0">
								<div className="relative h-56 overflow-hidden">
									<img
										src={venue.image}
										alt={venue.name}
										className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
									/>
									<div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-60" />

									<div className="absolute top-4 left-4 z-10 flex gap-2">
										<Badge className="bg-white/90 backdrop-blur-md text-neutral-900 border-none px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
											{venue.type}
										</Badge>
										{venue.popular && (
											<Badge className="bg-brand-gold text-white border-none px-3 py-1 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
												<TrendingUp className="h-3 w-3" /> Popular
											</Badge>
										)}
									</div>

									<button className="absolute top-4 right-4 z-10 h-10 w-10 bg-white rounded-full flex items-center justify-center text-red-500 shadow-lg hover:scale-110 transition-transform active:scale-95">
										<Heart className="h-5 w-5 fill-red-500" />
									</button>

									<div className="absolute bottom-4 left-4 right-4 text-white z-10">
										<div className="flex items-center gap-1.5 text-xs font-bold text-white/90 mb-1">
											<MapPin className="h-3 w-3 text-brand-gold" />
											{venue.city}, {venue.state}
										</div>
										<h3 className="text-xl font-bold line-clamp-1">
											{venue.name}
										</h3>
									</div>
								</div>

								<div className="p-6">
									<div className="flex items-center justify-between mb-6">
										<div className="flex items-center gap-4">
											<div className="flex items-center gap-1">
												<Star className="h-4 w-4 fill-brand-gold text-brand-gold" />
												<span className="text-sm font-bold text-neutral-900">
													{venue.rating}
												</span>
											</div>
											<div className="flex items-center gap-1 text-neutral-500">
												<Users className="h-4 w-4" />
												<span className="text-xs font-bold">
													{venue.capacity}
												</span>
											</div>
										</div>
										<div className="text-right">
											<p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider leading-none mb-1">
												Starting at
											</p>
											<p className="text-lg font-black text-brand-blue tracking-tight leading-none">
												{venue.currency}
												{venue.price.toLocaleString()}
												<span className="text-xs font-bold text-neutral-500">
													/day
												</span>
											</p>
										</div>
									</div>

									<div className="grid grid-cols-2 gap-3">
										<Button
											variant="outline"
											className="rounded-xl font-bold text-xs h-10 border-neutral-100 hover:bg-neutral-50"
										>
											Remove
										</Button>
										<Link href={`/listings/${venue.id}`} className="block">
											<Button className="w-full bg-neutral-900 hover:bg-black text-white rounded-xl font-bold text-xs h-10 group">
												Book Now{' '}
												<ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
											</Button>
										</Link>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
