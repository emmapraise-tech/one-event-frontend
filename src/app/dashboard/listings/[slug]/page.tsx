"use client"

import { useParams } from "next/navigation"
import { useListingBySlug } from "@/hooks/useListings"
import { useBookings } from "@/hooks/useBookings"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ListingImage } from "@/components/ui/listing-image"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, MapPin, Star } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const bookingSchema = z.object({
  bookingDate: z.string().min(1, "Booking date is required"),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  numberOfGuests: z.number().min(1).optional(),
  specialRequests: z.string().optional(),
})

type BookingFormData = z.infer<typeof bookingSchema>

export default function ListingDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const router = useRouter()
  const { user } = useAuth()
  const { data: listing, isLoading } = useListingBySlug(slug)
  const { createBooking, isCreating } = useBookings()
  const [showBookingDialog, setShowBookingDialog] = useState(false)

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      bookingDate: "",
      startTime: "",
      endTime: "",
      numberOfGuests: undefined,
      specialRequests: "",
    },
  })

  const onSubmit = async (data: BookingFormData) => {
    if (!listing) return

    // Create booking
    createBooking(
      {
        listingId: listing.id,
        ...data,
      },
      {
        onSuccess: () => {
          setShowBookingDialog(false)
          router.push("/dashboard/bookings")
        },
      },
    )
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Listing not found</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="aspect-video w-full rounded-lg overflow-hidden">
            <ListingImage 
              src={listing.images && listing.images.length > 0 ? listing.images[0].url : undefined}
              alt={listing.images && listing.images.length > 0 ? listing.images[0].alt || listing.title : listing.title}
              type={listing.type} 
            />
          </div>
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{listing.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={listing.status === "ACTIVE" ? "default" : "secondary"}>
                      {listing.type}
                    </Badge>
                    <Badge variant="outline">{listing.status}</Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="mr-2 h-4 w-4" />
                {listing.addressLine && <span>{listing.addressLine}, </span>}
                {listing.city && <span>{listing.city}, </span>}
                {listing.state && <span>{listing.state}</span>}
                {listing.country && <span>, {listing.country}</span>}
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <Star className="mr-1 h-4 w-4 fill-primary text-primary" />
                  <span className="font-medium">{listing.rating}</span>
                  <span className="text-muted-foreground ml-1">({listing.reviewCount})</span>
                </div>
                {listing.basePrice && (
                  <div className="text-lg font-semibold">
                    {listing.currency} {listing.basePrice.toLocaleString()}
                  </div>
                )}
              </div>
              {listing.description && (
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-sm text-muted-foreground">{listing.description}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Book This Service</CardTitle>
            </CardHeader>
            <CardContent>
              {user ? (
                <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
                  <DialogTrigger asChild>
                    <Button className="w-full" size="lg">
                      Book Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Create Booking</DialogTitle>
                      <DialogDescription>
                        Fill in the details to book this service
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="bookingDate">Booking Date</Label>
                        <Input
                          id="bookingDate"
                          type="date"
                          min={new Date().toISOString().split("T")[0]}
                          {...form.register("bookingDate")}
                        />
                        {form.formState.errors.bookingDate && (
                          <p className="text-sm text-destructive">
                            {form.formState.errors.bookingDate.message}
                          </p>
                        )}
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="startTime">Start Time (Optional)</Label>
                        <Input
                          id="startTime"
                          type="datetime-local"
                          {...form.register("startTime")}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="endTime">End Time (Optional)</Label>
                        <Input
                          id="endTime"
                          type="datetime-local"
                          {...form.register("endTime")}
                        />
                      </div>
                      {listing.type === "VENUE" && (
                        <div className="grid gap-2">
                          <Label htmlFor="numberOfGuests">Number of Guests</Label>
                          <Input
                            id="numberOfGuests"
                            type="number"
                            min={1}
                            {...form.register("numberOfGuests", { valueAsNumber: true })}
                          />
                        </div>
                      )}
                      <div className="grid gap-2">
                        <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
                        <Textarea
                          id="specialRequests"
                          {...form.register("specialRequests")}
                          rows={3}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowBookingDialog(false)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button type="submit" disabled={isCreating} className="flex-1">
                          {isCreating ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            "Confirm Booking"
                          )}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Please sign in to book this service
                  </p>
                  <Button asChild className="w-full" size="lg">
                    <Link href="/login">Sign In to Book</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

