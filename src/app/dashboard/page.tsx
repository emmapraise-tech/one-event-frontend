"use client"

import { useAuth } from "@/hooks/useAuth"
import { useBookings } from "@/hooks/useBookings"
import { useListings } from "@/hooks/useListings"
import { useVendors } from "@/hooks/useVendors"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Calendar, Store, Users, TrendingUp } from "lucide-react"
import Link from "next/link"
import { UserType } from "@/types/auth"
import { BookingStatus } from "@/types/booking"

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const { bookings } = useBookings()
  const { listings } = useListings()
  const { vendor } = useVendors()

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  const isVendor = user.type === UserType.VENDOR || user.type === UserType.ADMIN
  const isAdmin = user.type === UserType.ADMIN
  const vendorListings = isVendor && vendor
    ? listings?.filter((listing) => listing.vendorId === vendor.id)
    : []
  const activeBookings = bookings?.filter(
    (booking) => booking.status === BookingStatus.CONFIRMED || booking.status === BookingStatus.PENDING
  ).length || 0
  const totalBookings = bookings?.length || 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user.firstName || user.email}!
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your account
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isVendor && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">My Listings</CardTitle>
                <Store className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{vendorListings?.length || 0}</div>
                <p className="text-xs text-muted-foreground">
                  <Link href="/dashboard/listings" className="text-primary hover:underline">
                    View all listings
                  </Link>
                </p>
              </CardContent>
            </Card>
          </>
        )}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookings}</div>
            <p className="text-xs text-muted-foreground">
              {activeBookings} active
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              <Link href="/dashboard/bookings" className="text-primary hover:underline">
                View all bookings
              </Link>
            </p>
          </CardContent>
        </Card>
        {isAdmin && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">-</div>
                <p className="text-xs text-muted-foreground">
                  <Link href="/dashboard/admin/users" className="text-primary hover:underline">
                    Manage users
                  </Link>
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">All Bookings</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">-</div>
                <p className="text-xs text-muted-foreground">
                  <Link href="/dashboard/admin/bookings" className="text-primary hover:underline">
                    View all bookings
                  </Link>
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <div className="grid grid-cols-[100px_1fr]">
                <span className="font-medium">Email:</span>
                <span>{user.email}</span>
              </div>
              <div className="grid grid-cols-[100px_1fr]">
                <span className="font-medium">Role:</span>
                <Badge variant={user.type === UserType.ADMIN ? "default" : user.type === UserType.VENDOR ? "secondary" : "outline"}>
                  {user.type}
                </Badge>
              </div>
              <div className="grid grid-cols-[100px_1fr]">
                <span className="font-medium">Phone:</span>
                <span>{user.phone}</span>
              </div>
              <div className="grid grid-cols-[100px_1fr]">
                <span className="font-medium">Status:</span>
                <Badge variant={user.isActive ? "default" : "secondary"}>
                  {user.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {isVendor && !vendor && (
          <Card>
            <CardHeader>
              <CardTitle>Vendor Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Create a vendor profile to start listing your services
              </p>
              <Button asChild>
                <Link href="/dashboard/vendors">Create Vendor Profile</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
