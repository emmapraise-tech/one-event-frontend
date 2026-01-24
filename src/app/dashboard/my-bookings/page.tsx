"use client"

import { useMyBookings } from "@/hooks/useMyBookings"
import { useAuth } from "@/hooks/useAuth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EmptyState } from "@/components/ui/empty-state"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Calendar, MapPin, X } from "lucide-react"
import { BookingStatus } from "@/types/booking"
import { format } from "date-fns"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useCreatePayment } from "@/hooks/usePayments"
import { useState } from "react"

export default function BookingsPage() {
  const { bookings, isLoading, error, cancelBooking, isCancelling } = useMyBookings()
  const { user } = useAuth()
  const { createPayment, isCreating } = useCreatePayment()
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null)

  const handleCancel = (bookingId: string) => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      cancelBooking(bookingId, {
        onSuccess: () => {
          // Booking cancelled
        },
      })
    }
  }

  const handlePayment = (bookingId: string) => {
    createPayment(
      { bookingId },
      {
        onSuccess: (payment) => {
          // Redirect to payment URL if available
          if (payment.metadata?.authorization_url) {
            window.location.href = payment.metadata.authorization_url
          }
        },
      },
    )
  }

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
        <h1 className="text-3xl font-bold tracking-tight">My Bookings</h1>
        <p className="text-muted-foreground">
          Manage your event bookings and payments
        </p>
      </div>

      {bookings?.length === 0 ? (
        <EmptyState
          icon={<Calendar className="h-16 w-16" />}
          title="No bookings yet"
          description="Your upcoming event bookings will appear here once you make a reservation."
          action={
            <Button asChild>
              <a href="/listings">Browse Available Venues</a>
            </Button>
          }
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
                      <span>
                        {format(new Date(booking.bookingDate), "PPP")}
                      </span>
                      {booking.startTime && (
                        <>
                          <span>•</span>
                          <span>
                            {format(new Date(booking.startTime), "p")}
                          </span>
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
                  {booking.specialRequests && (
                    <div>
                      <span className="text-sm text-muted-foreground">Special Requests:</span>
                      <p className="text-sm">{booking.specialRequests}</p>
                    </div>
                  )}
                  <div className="flex gap-2">
                    {!booking.fullPaymentPaid && booking.status === BookingStatus.CONFIRMED && (
                      <Button
                        onClick={() => handlePayment(booking.id)}
                        disabled={isCreating}
                        size="sm"
                      >
                        {isCreating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          "Make Payment"
                        )}
                      </Button>
                    )}
                    {booking.status !== BookingStatus.CANCELLED &&
                      booking.status !== BookingStatus.COMPLETED && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancel(booking.id)}
                          disabled={isCancelling}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Cancel
                        </Button>
                      )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

