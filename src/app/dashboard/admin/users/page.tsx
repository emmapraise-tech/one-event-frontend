"use client"

import { useQuery } from "@tanstack/react-query"
import { userService } from "@/services/user.service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EmptyState } from "@/components/ui/empty-state"
import { Badge } from "@/components/ui/badge"
import { Loader2, Users } from "lucide-react"
import { UserType } from "@/types/auth"

export default function AdminUsersPage() {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: userService.findAll,
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
        Error loading users
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">
          View and manage all users in the system
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          {users?.length === 0 ? (
            <EmptyState
              icon={<Users className="h-16 w-16" />}
              title="No users found"
              description="User accounts will appear here once users register on the platform."
            />
          ) : (
            <div className="space-y-4">
              {users?.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">
                        {user.firstName} {user.lastName}
                      </p>
                      <Badge
                        variant={
                          user.type === UserType.ADMIN
                            ? "default"
                            : user.type === UserType.VENDOR
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {user.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-sm text-muted-foreground">{user.phone}</p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {user.isActive ? (
                      <Badge variant="default">Active</Badge>
                    ) : (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

