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
      
      <main className="flex-1">{children}</main>
    </div>
  )
}

