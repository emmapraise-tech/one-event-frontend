import { Listing } from "@/types/listing"
import { Card, CardContent } from "@/components/ui/card"
import { ListingImage } from "@/components/ui/listing-image"
import { MapPin } from "lucide-react"
import Link from "next/link"

interface VenueCardProps {
  listing: Listing
}

export function VenueCard({ listing }: VenueCardProps) {
  return (
    <Link href={`/dashboard/listings/${listing.slug}`}>
      <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow h-full">
        <div className="aspect-video w-full relative">
          <ListingImage 
            src={listing.images && listing.images.length > 0 ? listing.images[0].url : undefined}
            alt={listing.images && listing.images.length > 0 ? listing.images[0].alt || listing.title : listing.title}
            type={listing.type} 
          />
        </div>
        <CardContent className="p-4">
          <h3 className="h4 mb-1">{listing.title}</h3>
          <div className="flex items-center small text-neutral-500 mb-2">
            <MapPin className="h-3 w-3 mr-1" />
            {listing.city}, {listing.state}
          </div>
          <div className="flex items-center justify-between small">
            <span className="text-neutral-500">Capacity</span>
            <span className="font-semibold" style={{ color: 'var(--primary-blue-500)' }}>
              {listing.currency} {listing.basePrice?.toLocaleString()}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

