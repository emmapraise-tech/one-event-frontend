"use client"

import { useState } from "react"
import { useListings } from "@/hooks/useListings"
import { PopularVenueCard } from "@/components/listings/popular-venue-card"
import { VenueCard } from "@/components/listings/venue-card"
import { EmptyState } from "@/components/ui/empty-state"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, Search, Calendar, Building2, Map } from "lucide-react"
import { ListingStatus, ListingType } from "@/types/listing"

export default function ListingsLandingPage() {
  const { listings, isLoading, error } = useListings()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedCapacity, setSelectedCapacity] = useState<string>("all")
  const [selectedPrice, setSelectedPrice] = useState<string>("all")
  const [selectedDate, setSelectedDate] = useState<string>("")

  // Filter to show only ACTIVE listings
  let activeListings = listings?.filter(
    (listing) => listing.status === ListingStatus.ACTIVE
  ) || []

  // Apply search filter
  if (searchQuery) {
    activeListings = activeListings.filter(
      (listing) =>
        listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.state?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  // Apply type filter
  if (selectedType !== "all") {
    activeListings = activeListings.filter(
      (listing) => listing.type === selectedType
    )
  }

  // Get popular venues (first 4 active listings)
  const popularVenues = activeListings.slice(0, 4)

  // Get remaining venues for the main grid
  const remainingVenues = activeListings.slice(4)

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center text-destructive">
        Error loading listings
      </div>
    )
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Main Search Area */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-6">
            <h1 className="h1 text-foreground">
              Find the perfect venue for your next event
            </h1>
            
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search locations"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 body"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => {
                  const input = document.createElement("input")
                  input.type = "date"
                  input.click()
                }}
              >
                <Calendar className="h-4 w-4" />
                Date
              </Button>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {Object.values(ListingType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedCapacity} onValueChange={setSelectedCapacity}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Capacity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Capacity</SelectItem>
                  <SelectItem value="0-100">0-100</SelectItem>
                  <SelectItem value="101-200">101-200</SelectItem>
                  <SelectItem value="201+">201+</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedPrice} onValueChange={setSelectedPrice}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="0-300">$0 - $300</SelectItem>
                  <SelectItem value="301-1000">$301 - $1000</SelectItem>
                  <SelectItem value="1001+">$1001+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Image/Map Placeholder */}
          <div className="hidden lg:block">
            <div
              className="w-full h-[400px] rounded-lg border border-border flex items-center justify-center overflow-hidden relative"
              style={{
                background: `linear-gradient(to bottom right, var(--primary-blue-100), var(--accent-purple-100))`,
              }}
            >
              <div className="text-center">
                <Map className="h-16 w-16 mx-auto mb-3" style={{ color: 'var(--primary-blue-500)' }} />
                <span className="small text-muted-foreground">Map View</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Venues Section */}
      {popularVenues.length > 0 ? (
        <div className="bg-muted py-12">
          <div className="container mx-auto px-4">
            <h2 className="h2 text-foreground mb-6">Popular venues</h2>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {popularVenues.map((listing) => (
                <PopularVenueCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        </div>
      ) : activeListings.length === 0 && (
        <div className="bg-muted py-12">
          <div className="container mx-auto px-4">
            <EmptyState
              icon={<Building2 className="h-16 w-16" />}
              title="No popular venues available"
              description="Check back later for featured event spaces and venues."
            />
          </div>
        </div>
      )}

      {/* Main Content: Filters + Venues Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="h3 text-foreground">Filters</h2>
                <button
                  onClick={() => {
                    setSelectedType("all")
                    setSelectedCapacity("all")
                    setSelectedPrice("all")
                    setSearchQuery("")
                  }}
                  className="text-sm hover:underline"
                  style={{ color: 'var(--primary-blue-500)' }}
                >
                  Clear all
                </button>
              </div>

              {/* Date Filter */}
              <div>
                <label className="small text-foreground mb-2 block">
                  Date
                </label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Type Filter */}
              <div>
                <label className="small text-foreground mb-2 block">
                  Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "Conference", value: ListingType.VENUE },
                    { label: "Wedding", value: ListingType.VENUE },
                    { label: "Party", value: ListingType.ENTERTAINMENT },
                  ].map(({ label, value }) => (
                    <Button
                      key={label}
                      variant={selectedType === value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedType(selectedType === value ? "all" : value)}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Capacity Filter */}
              <div>
                <label className="small text-foreground mb-2 block">
                  Capacity
                </label>
                <div className="flex flex-wrap gap-2">
                  {["0-100", "101-200", "201+"].map((capacity) => (
                    <Button
                      key={capacity}
                      variant={selectedCapacity === capacity ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCapacity(capacity === selectedCapacity ? "all" : capacity)}
                    >
                      {capacity}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <label className="small text-foreground mb-2 block">
                  Price
                </label>
                <div className="flex flex-wrap gap-2">
                  {["$0 - $300", "$301 - $1000", "$1001+"].map((price) => (
                    <Button
                      key={price}
                      variant={selectedPrice === price ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedPrice(price === selectedPrice ? "all" : price)}
                    >
                      {price}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Venues Grid */}
          <div className="lg:col-span-3">
            <h2 className="h3 text-foreground mb-6">Venues</h2>
            {remainingVenues.length === 0 ? (
              <EmptyState
                icon={<Building2 className="h-16 w-16" />}
                title="No venues found"
                description="Try adjusting your filters or search terms to find more options."
                action={
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedType("all")
                      setSelectedCapacity("all")
                      setSelectedPrice("all")
                    }}
                  >
                    Clear Filters
                  </Button>
                }
              />
            ) : (
              <div className="grid sm:grid-cols-2 gap-6">
                {remainingVenues.map((listing) => (
                  <VenueCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
