"use client"

import { useParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useListingBySlug } from "@/hooks/useListings"
import { useListings } from "@/hooks/useListings"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ListingType, ListingStatus } from "@/types/listing"
import { Loader2 } from "lucide-react"
import { useEffect } from "react"

const listingSchema = z.object({
  type: z.nativeEnum(ListingType),
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  basePrice: z.number().optional(),
  currency: z.string().optional(),
  addressLine: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
})

type ListingFormData = z.infer<typeof listingSchema>

export default function EditListingPage() {
  const params = useParams()
  const slug = params.slug as string
  const router = useRouter()
  const { data: listing, isLoading: isLoadingListing } = useListingBySlug(slug)
  const { listings, updateListing, isUpdating } = useListings()

  const form = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      type: ListingType.VENUE,
      title: "",
      slug: "",
      description: "",
      basePrice: undefined,
      currency: "NGN",
      addressLine: "",
      city: "",
      state: "",
      country: "",
    },
  })

  useEffect(() => {
    if (listing) {
      form.reset({
        type: listing.type,
        title: listing.name,
        slug: listing.slug,
        description: listing.description || "",
        basePrice: listing.basePrice,
        currency: listing.currency || "NGN",
        addressLine: listing.addressLine || "",
        city: listing.city || "",
        state: listing.state || "",
        country: listing.country || "",
      })
    }
  }, [listing, form])

  const onSubmit = (data: ListingFormData) => {
    if (!listing) return
    
    updateListing(
      { id: listing.id, data },
      {
        onSuccess: () => {
          router.push("/dashboard/listings")
        },
      },
    )
  }

  // Generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
    form.setValue("slug", slug)
  }

  if (isLoadingListing) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Listing not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Listing</h1>
        <p className="text-muted-foreground">
          Update your listing information
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listing Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="type">Listing Type</Label>
              <Select
                value={form.watch("type")}
                onValueChange={(value) => form.setValue("type", value as ListingType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(ListingType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                {...form.register("title")}
                onChange={(e) => {
                  form.register("title").onChange(e)
                  handleTitleChange(e)
                }}
              />
              {form.formState.errors.title && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="slug">Slug (URL-friendly identifier)</Label>
              <Input id="slug" {...form.register("slug")} />
              {form.formState.errors.slug && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.slug.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" {...form.register("description")} rows={4} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="basePrice">Base Price</Label>
                <Input
                  id="basePrice"
                  type="number"
                  step="0.01"
                  {...form.register("basePrice", { valueAsNumber: true })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="currency">Currency</Label>
                <Input id="currency" {...form.register("currency")} />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="addressLine">Address Line</Label>
              <Input id="addressLine" {...form.register("addressLine")} />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="grid gap-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" {...form.register("city")} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" {...form.register("state")} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" {...form.register("country")} />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Listing"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

