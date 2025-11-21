"use client"

import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function DashboardPage() {
  const { user, isLoading, logout } = useAuth()

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <p>You need to be logged in to view this page.</p>
        <Button onClick={() => window.location.href = '/login'}>Go to Login</Button>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button variant="outline" onClick={logout}>Sign out</Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Welcome back, {user.firstName}!</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            <div className="grid grid-cols-[100px_1fr]">
              <span className="font-medium">Email:</span>
              <span>{user.email}</span>
            </div>
            <div className="grid grid-cols-[100px_1fr]">
              <span className="font-medium">Role:</span>
              <span>{user.type}</span>
            </div>
            <div className="grid grid-cols-[100px_1fr]">
              <span className="font-medium">Phone:</span>
              <span>{user.phone}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
