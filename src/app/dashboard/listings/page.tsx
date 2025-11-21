"use client"

import { useListings } from "@/hooks/useListings"
import { ListingCard } from "@/components/listings/listing-card"
import { Loader2 } from "lucide-react"

export default function ListingsPage() {
  const { listings, isLoading, error } = useListings()

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center text-destructive">
        Error loading listings
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Browse Services</h1>
        <p className="text-muted-foreground">
          Find the perfect service providers for your event.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {listings?.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>

      {listings?.length === 0 && (
        <div className="text-center text-muted-foreground py-12">
          No listings found. Be the first to create one!
        </div>
      )}
    </div>
  )
}
