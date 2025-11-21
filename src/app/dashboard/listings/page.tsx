"use client"

import { useListings } from "@/hooks/useListings"
import { useVendors } from "@/hooks/useVendors"
import { useAuth } from "@/hooks/useAuth"
import { ListingCard } from "@/components/listings/listing-card"
import { EmptyState } from "@/components/ui/empty-state"
import { Button } from "@/components/ui/button"
import { Loader2, Plus, Store } from "lucide-react"
import Link from "next/link"
import { UserType } from "@/types/auth"

export default function ListingsPage() {
  const { user } = useAuth()
  const { vendor } = useVendors()
  const { listings, isLoading, error } = useListings()
  
  // Filter listings for vendors to show only their own
  const isVendor = user?.type === UserType.VENDOR || user?.type === UserType.ADMIN
  const vendorListings = isVendor && vendor
    ? listings?.filter((listing) => listing.vendorId === vendor.id)
    : listings

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isVendor ? "My Listings" : "Browse Services"}
          </h1>
          <p className="text-muted-foreground">
            {isVendor
              ? "Manage your service listings"
              : "Find the perfect service providers for your event."}
          </p>
        </div>
        {isVendor && (
          <Button asChild>
            <Link href="/dashboard/listings/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Listing
            </Link>
          </Button>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {vendorListings?.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>

      {vendorListings?.length === 0 && (
        <EmptyState
          icon={<Store className="h-16 w-16" />}
          title={
            isVendor
              ? "No listings yet"
              : "No listings available"
          }
          description={
            isVendor
              ? "Get started by creating your first service listing to attract customers."
              : "There are no listings available at the moment. Please check back later."
          }
          action={
            isVendor ? (
              <Button asChild>
                <Link href="/dashboard/listings/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Listing
                </Link>
              </Button>
            ) : null
          }
        />
      )}
    </div>
  )
}
