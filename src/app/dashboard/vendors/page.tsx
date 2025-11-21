"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useVendors } from "@/hooks/useVendors"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

const vendorSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  businessAddress: z.string().min(1, "Business address is required"),
  businessPhone: z.string().min(1, "Business phone is required"),
  businessEmail: z.string().email("Invalid email address"),
  businessWebsite: z.string().url().optional().or(z.literal("")),
  businessLogo: z.string().url().optional().or(z.literal("")),
  businessDescription: z.string().optional(),
  taxNumber: z.string().optional(),
  cacNumber: z.string().optional(),
  rcNumber: z.string().optional(),
  bankName: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  bankAccountName: z.string().optional(),
})

type VendorFormData = z.infer<typeof vendorSchema>

export default function VendorPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { vendor, isLoading: isLoadingVendor, createVendor, isCreating } = useVendors()

  const form = useForm<VendorFormData>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      businessName: vendor?.businessName || "",
      businessAddress: vendor?.businessAddress || "",
      businessPhone: vendor?.businessPhone || "",
      businessEmail: vendor?.businessEmail || "",
      businessWebsite: vendor?.businessWebsite || "",
      businessLogo: vendor?.businessLogo || "",
      businessDescription: vendor?.businessDescription || "",
      taxNumber: vendor?.taxNumber || "",
      cacNumber: vendor?.cacNumber || "",
      rcNumber: vendor?.rcNumber || "",
      bankName: vendor?.bankName || "",
      bankAccountNumber: vendor?.bankAccountNumber || "",
      bankAccountName: vendor?.bankAccountName || "",
    },
  })

  const onSubmit = (data: VendorFormData) => {
    if (!user) return

    if (vendor) {
      // Update existing vendor - would need update mutation
      alert("Vendor update functionality coming soon")
      return
    }

    createVendor(
      {
        ...data,
        userId: user.id,
      },
      {
        onSuccess: () => {
          // Vendor created successfully
        },
      },
    )
  }

  if (isLoadingVendor) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {vendor ? "Vendor Profile" : "Create Vendor Profile"}
        </h1>
        <p className="text-muted-foreground">
          {vendor
            ? "Manage your vendor profile information"
            : "Set up your vendor profile to start listing services"}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="businessName">Business Name *</Label>
              <Input id="businessName" {...form.register("businessName")} />
              {form.formState.errors.businessName && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.businessName.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="businessAddress">Business Address *</Label>
              <Textarea id="businessAddress" {...form.register("businessAddress")} rows={2} />
              {form.formState.errors.businessAddress && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.businessAddress.message}
                </p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="businessPhone">Business Phone *</Label>
                <Input id="businessPhone" {...form.register("businessPhone")} />
                {form.formState.errors.businessPhone && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.businessPhone.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="businessEmail">Business Email *</Label>
                <Input id="businessEmail" type="email" {...form.register("businessEmail")} />
                {form.formState.errors.businessEmail && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.businessEmail.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="businessWebsite">Business Website</Label>
                <Input id="businessWebsite" {...form.register("businessWebsite")} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="businessLogo">Business Logo URL</Label>
                <Input id="businessLogo" {...form.register("businessLogo")} />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="businessDescription">Business Description</Label>
              <Textarea id="businessDescription" {...form.register("businessDescription")} rows={4} />
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-4">Legal & Banking Information</h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="grid gap-2">
                  <Label htmlFor="taxNumber">Tax Number</Label>
                  <Input id="taxNumber" {...form.register("taxNumber")} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cacNumber">CAC Number</Label>
                  <Input id="cacNumber" {...form.register("cacNumber")} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="rcNumber">RC Number</Label>
                  <Input id="rcNumber" {...form.register("rcNumber")} />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 mt-4">
                <div className="grid gap-2">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input id="bankName" {...form.register("bankName")} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="bankAccountNumber">Account Number</Label>
                  <Input id="bankAccountNumber" {...form.register("bankAccountNumber")} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="bankAccountName">Account Name</Label>
                  <Input id="bankAccountName" {...form.register("bankAccountName")} />
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={isCreating}>
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {vendor ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  vendor ? "Update Profile" : "Create Profile"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

