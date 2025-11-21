import { Listing } from "@/types/listing"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ListingImage } from "@/components/ui/listing-image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Star, Edit } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { useVendors } from "@/hooks/useVendors"
import { UserType } from "@/types/auth"

interface ListingCardProps {
  listing: Listing
}

export function ListingCard({ listing }: ListingCardProps) {
  const { user } = useAuth()
  const { vendor } = useVendors()
  const isVendor = user?.type === UserType.VENDOR || user?.type === UserType.ADMIN
  const isOwner = isVendor && vendor && listing.vendorId === vendor.id

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="aspect-video w-full relative">
        <ListingImage 
          src={listing.images && listing.images.length > 0 ? listing.images[0].url : undefined}
          alt={listing.images && listing.images.length > 0 ? listing.images[0].alt || listing.title : listing.title}
          type={listing.type} 
        />
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="line-clamp-1">{listing.title}</CardTitle>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="mr-1 h-3 w-3" />
              {listing.city}, {listing.state}
            </div>
          </div>
          <Badge variant={listing.status === 'ACTIVE' ? 'default' : 'secondary'}>
            {listing.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {listing.description}
        </p>
        <div className="mt-4 flex items-center gap-4 text-sm">
          <div className="flex items-center">
            <Star className="mr-1 h-4 w-4 fill-primary text-primary" />
            <span className="font-medium">{listing.rating}</span>
            <span className="text-muted-foreground ml-1">({listing.reviewCount})</span>
          </div>
          <div className="font-medium">
            {listing.currency} {listing.basePrice?.toLocaleString()}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button asChild className="flex-1">
          <Link href={`/dashboard/listings/${listing.slug}`}>View Details</Link>
        </Button>
        {isOwner && (
          <Button asChild variant="outline" size="icon">
            <Link href={`/dashboard/listings/${listing.slug}/edit`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
