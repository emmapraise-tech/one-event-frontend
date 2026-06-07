import { Listing } from "@/types/listing"
import { Card, CardContent } from "@/components/ui/card"
import { ListingImage } from "@/components/ui/listing-image"
import { MapPin } from "lucide-react"
import Link from "next/link"

interface PopularVenueCardProps {
  listing: Listing
}

export function PopularVenueCard({ listing }: PopularVenueCardProps) {
  const rawHalls = listing.halls || [];
  const hallPrices = rawHalls.map((h) => Number(h.price)).filter((p) => p > 0);
  const minHallPrice = hallPrices.length > 0 ? Math.min(...hallPrices) : null;
  const startPrice = minHallPrice !== null ? minHallPrice : (Number(listing.basePrice) || 0);

  const detail = listing.venueDetail || listing.details;
  const capacity = detail?.capacity || detail?.seatedCapacity;

  return (
    <Link href={`/listings/${listing.slug}`}>
      <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow min-w-[280px] flex flex-col">
        <div className="aspect-video w-full relative">
          <ListingImage 
            src={listing.images && listing.images.length > 0 ? listing.images[0].url : undefined}
            alt={listing.images && listing.images.length > 0 ? listing.images[0].alt || listing.name : listing.name}
            type={listing.type} 
          />
        </div>
        <CardContent className="p-4 flex flex-col flex-1 justify-between">
          <div>
            <h3 className="h4 mb-1 line-clamp-1">{listing.name}</h3>
            <div className="flex items-center small text-neutral-500 mb-2">
              <MapPin className="h-3 w-3 mr-1 shrink-0" />
              <span className="truncate">{listing.city}, {listing.state}</span>
            </div>
          </div>
          <div className="space-y-1.5 pt-2 border-t border-neutral-100 mt-2">
            <div className="flex items-center justify-between small text-neutral-600">
              <span>Capacity</span>
              <span className="font-semibold text-neutral-800">
                {capacity ? `${capacity} guests` : 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between small text-neutral-600">
              <span>Starting from</span>
              <span className="font-semibold" style={{ color: 'var(--primary-blue-500)' }}>
                {listing.currency || '₦'} {startPrice.toLocaleString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

