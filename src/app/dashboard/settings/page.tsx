"use client"

import { useAuth } from "@/hooks/useAuth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Loader2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  const { user, isLoading } = useAuth()

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="h2 text-foreground">Settings</h1>
        <p className="body text-muted-foreground mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Customize the appearance of the application. Choose between light, dark, or system theme.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="small text-foreground">Theme</label>
              <p className="caption text-muted-foreground">
                Select your preferred theme mode
              </p>
            </div>
            <ThemeToggle />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>
            Your account details and information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="small text-muted-foreground">Email</label>
            <p className="body text-foreground">{user.email}</p>
          </div>
          <Separator />
          <div className="space-y-2">
            <label className="small text-muted-foreground">Name</label>
            <p className="body text-foreground">
              {user.firstName && user.lastName
                ? `${user.firstName} ${user.lastName}`
                : user.firstName || "Not set"}
            </p>
          </div>
          <Separator />
          <div className="space-y-2">
            <label className="small text-muted-foreground">Phone</label>
            <p className="body text-foreground">{user.phone || "Not set"}</p>
          </div>
          <Separator />
          <div className="space-y-2">
            <label className="small text-muted-foreground">Account Type</label>
            <p className="body text-foreground capitalize">{user.type.toLowerCase()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

