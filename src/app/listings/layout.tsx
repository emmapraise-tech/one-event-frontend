"use client"

import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { UserType } from "@/types/auth"
import { CheckSquare } from "lucide-react"

export default function ListingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useAuth()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border bg-background">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/listings" className="flex items-center gap-2 h3">
            <CheckSquare className="h-6 w-6" style={{ color: 'var(--primary-blue-500)' }} />
            <span>One Event</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/listings" className="small hover:opacity-70 transition-colors text-primary">
              Home
            </Link>
            <Link href="/listings" className="small hover:opacity-70 transition-colors text-primary">
              Browse
            </Link>
            <Link href="#" className="small hover:opacity-70 transition-colors text-primary">
              About
            </Link>
            <Link href="#" className="small hover:opacity-70 transition-colors text-primary">
              Contact
            </Link>
            {user ? (
              <Link href="/dashboard">
                <Avatar className="h-9 w-9 cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                  <AvatarImage src={undefined} alt={user.firstName || user.email} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user.firstName
                      ? `${user.firstName.charAt(0)}${user.lastName?.charAt(0) || ""}`
                      : user.email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>
            ) : (
              <Button variant="outline" size="sm" asChild>
                <Link href="/login">Sign in</Link>
              </Button>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  )
}

