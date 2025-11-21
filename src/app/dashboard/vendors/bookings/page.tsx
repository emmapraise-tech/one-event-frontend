"use client"

import { useQuery } from "@tanstack/react-query"
import api from "@/lib/axios"
import { ApiResponse } from "@/types/api"
import { Booking } from "@/types/booking"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EmptyState } from "@/components/ui/empty-state"
import { Badge } from "@/components/ui/badge"
import { Loader2, Calendar, MapPin } from "lucide-react"
import { format } from "date-fns"
import { BookingStatus } from "@/types/booking"
import { useAuth } from "@/hooks/useAuth"

async function getVendorBookings(): Promise<Booking[]> {
  const response = await api.get<ApiResponse<Booking[]>>("/vendors/bookings")
  return response.data.data
}

export default function VendorBookingsPage() {
  const { user } = useAuth()
  const { data: bookings, isLoading, error } = useQuery({
    queryKey: ["vendor", "bookings"],
    queryFn: getVendorBookings,
  })

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
        Error loading bookings
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Vendor Bookings</h1>
        <p className="text-muted-foreground">
          Manage bookings for your listings
        </p>
      </div>

      {bookings?.length === 0 ? (
        <EmptyState
          icon={<Calendar className="h-16 w-16" />}
          title="No bookings yet"
          description="Bookings for your listings will appear here once customers make reservations."
        />
      ) : (
        <div className="grid gap-4">
          {bookings?.map((booking) => (
            <Card key={booking.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle>{booking.listing?.title || "Unknown Listing"}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{format(new Date(booking.bookingDate), "PPP")}</span>
                      {booking.startTime && (
                        <>
                          <span>•</span>
                          <span>{format(new Date(booking.startTime), "p")}</span>
                        </>
                      )}
                    </div>
                    {booking.listing && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>
                          {booking.listing.city}, {booking.listing.state}
                        </span>
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Customer: {booking.customer?.firstName} {booking.customer?.lastName} ({booking.customer?.email})
                    </p>
                  </div>
                  <Badge
                    variant={
                      booking.status === BookingStatus.CONFIRMED
                        ? "default"
                        : booking.status === BookingStatus.CANCELLED
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {booking.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Total Amount:</span>
                      <p className="font-semibold">
                        {booking.currency} {booking.totalAmount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Payment Status:</span>
                      <p className="font-semibold">
                        {booking.fullPaymentPaid
                          ? "Paid"
                          : booking.depositPaid
                          ? "Deposit Paid"
                          : "Pending"}
                      </p>
                    </div>
                  </div>
                  {booking.numberOfGuests && (
                    <div>
                      <span className="text-sm text-muted-foreground">Number of Guests:</span>
                      <p className="text-sm font-medium">{booking.numberOfGuests}</p>
                    </div>
                  )}
                  {booking.specialRequests && (
                    <div>
                      <span className="text-sm text-muted-foreground">Special Requests:</span>
                      <p className="text-sm">{booking.specialRequests}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

