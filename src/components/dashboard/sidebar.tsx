"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Store, Calendar, Settings, LogOut, PlusCircle } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const isVendor = user?.type === 'SERVICE_PROVIDER' || user?.type === 'ADMIN'

  return (
    <div className={cn("pb-12 w-64 border-r min-h-screen bg-background", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            OneEvent
          </h2>
          <div className="space-y-1">
            <Button variant={pathname === "/dashboard" ? "secondary" : "ghost"} className="w-full justify-start" asChild>
              <Link href="/dashboard">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
            <Button variant={pathname === "/dashboard/bookings" ? "secondary" : "ghost"} className="w-full justify-start" asChild>
              <Link href="/dashboard/bookings">
                <Calendar className="mr-2 h-4 w-4" />
                Bookings
              </Link>
            </Button>
            {isVendor && (
              <>
                <Button variant={pathname === "/dashboard/listings" ? "secondary" : "ghost"} className="w-full justify-start" asChild>
                  <Link href="/dashboard/listings">
                    <Store className="mr-2 h-4 w-4" />
                    My Listings
                  </Link>
                </Button>
                <Button variant={pathname === "/dashboard/listings/new" ? "secondary" : "ghost"} className="w-full justify-start" asChild>
                  <Link href="/dashboard/listings/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Listing
                  </Link>
                </Button>
              </>
            )}
            <Button variant={pathname === "/dashboard/settings" ? "secondary" : "ghost"} className="w-full justify-start" asChild>
              <Link href="/dashboard/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </Button>
          </div>
        </div>
        <div className="px-3 py-2">
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
