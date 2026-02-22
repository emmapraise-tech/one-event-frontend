import { Listing } from '@/types/listing';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { ListingImage } from '@/components/ui/listing-image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Edit } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useVendors } from '@/hooks/useVendors';
import { UserType } from '@/types/auth';
import { cn } from '@/lib/utils';

interface ListingCardProps {
	listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
	const { user } = useAuth();
	const { vendor } = useVendors();
	const isVendor =
		user?.type === UserType.VENDOR || user?.type === UserType.ADMIN;
	const isOwner = isVendor && vendor && listing.vendorId === vendor.id;

	return (
		<Card className="group overflow-hidden h-full flex flex-col border-gray-100 hover:border-brand-blue/20 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] bg-white rounded-2xl">
			<div className="aspect-4/3 w-full relative overflow-hidden">
				<ListingImage
					src={
						listing.images && listing.images.length > 0
							? listing.images[0].url
							: undefined
					}
					alt={
						listing.images && listing.images.length > 0
							? listing.images[0].alt || listing.name
							: listing.name
					}
					type={listing.type}
				/>
				<div className="absolute top-3 left-3 flex gap-2">
					<Badge className="bg-white/90 backdrop-blur-md text-gray-900 border-none shadow-sm hover:bg-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
						{listing.type}
					</Badge>
					{listing.status && (
						<Badge
							className={cn(
								'border-none shadow-sm text-[10px] font-bold uppercase tracking-wider px-2 py-0.5',
								listing.status === 'ACTIVE'
									? 'bg-green-500 text-white'
									: 'bg-gray-500 text-white',
							)}
						>
							{listing.status}
						</Badge>
					)}
				</div>
				<div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
					<p className="text-white text-xs font-medium line-clamp-2">
						{listing.addressLine}
					</p>
				</div>
			</div>

			<CardHeader className="p-5 pb-2">
				<div className="flex justify-between items-start gap-2">
					<div className="space-y-1.5 min-w-0">
						<CardTitle className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-brand-blue transition-colors">
							{listing.name}
						</CardTitle>
						<div className="flex items-center text-xs font-medium text-gray-500">
							<MapPin className="mr-1 h-3 w-3 text-brand-blue" />
							{listing.city}, {listing.state}
						</div>
					</div>
					<div className="flex items-center bg-brand-blue-soft px-2 py-1 rounded-lg">
						<Star className="mr-1 h-3.5 w-3.5 fill-brand-blue text-brand-blue" />
						<span className="text-xs font-bold text-brand-blue">
							{listing.rating}
						</span>
					</div>
				</div>
			</CardHeader>

			<CardContent className="p-5 pt-2 flex-1">
				<div
					className="text-sm text-gray-600 line-clamp-2 leading-relaxed h-10 [&>p]:inline"
					dangerouslySetInnerHTML={{ __html: listing.description || '' }}
				/>
				<div className="mt-4 flex items-center justify-between">
					<div className="flex flex-col">
						<span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
							Starting from
						</span>
						<div className="flex items-baseline gap-1">
							<span className="text-xl font-black text-gray-900">
								{listing.currency} {listing.basePrice?.toLocaleString()}
							</span>
							<span className="text-xs font-medium text-gray-500">/day</span>
						</div>
					</div>
				</div>
			</CardContent>

			<CardFooter className="p-5 pt-0 flex gap-3">
				<Button
					asChild
					className="flex-1 bg-brand-blue hover:bg-brand-blue-hover text-white rounded-xl h-11 font-bold shadow-sm transition-all active:scale-95"
				>
					<Link href={`/dashboard/listings/${listing.slug}`}>Manage</Link>
				</Button>
				{isOwner && (
					<Button
						asChild
						variant="outline"
						size="icon"
						className="h-11 w-11 rounded-xl border-gray-200 hover:border-brand-blue/50 hover:bg-brand-blue-soft hover:text-brand-blue transition-all active:scale-95"
					>
						<Link href={`/dashboard/listings/${listing.slug}/edit`}>
							<Edit className="h-5 w-5" />
						</Link>
					</Button>
				)}
			</CardFooter>
		</Card>
	);
}
