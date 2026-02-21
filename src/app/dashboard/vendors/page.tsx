"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useVendors } from "@/hooks/useVendors";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

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
});

type VendorFormData = z.infer<typeof vendorSchema>;

export default function VendorPage() {
  const router = useRouter();
  const { user } = useAuth();
  const {
    vendor,
    isLoading: isLoadingVendor,
    createVendor,
    isCreating,
  } = useVendors();

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
  });

  const onSubmit = (data: VendorFormData) => {
    if (!user) return;

    if (vendor) {
      // Update existing vendor - would need update mutation
      alert("Vendor update functionality coming soon");
      return;
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
    );
  };

  if (isLoadingVendor) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
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
              <Textarea
                id="businessAddress"
                {...form.register("businessAddress")}
                rows={2}
              />
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
                <Input
                  id="businessEmail"
                  type="email"
                  {...form.register("businessEmail")}
                />
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
                <Input
                  id="businessWebsite"
                  {...form.register("businessWebsite")}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="businessLogo">Business Logo URL</Label>
                <Input id="businessLogo" {...form.register("businessLogo")} />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="businessDescription">Business Description</Label>
              <Textarea
                id="businessDescription"
                {...form.register("businessDescription")}
                rows={4}
              />
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Legal & Banking Information</h3>
                <span className="text-xs bg-brand-blue-soft text-brand-blue px-2 py-1 rounded font-bold">
                  Virtual Account Pending
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                A dedicated virtual account will be automatically generated for
                your business upon approval. You will receive all booking
                payments through this account.
              </p>
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

              <div className="mt-8 border-t pt-4">
                <h4 className="font-semibold text-sm mb-4">
                  Settlement Bank Account{" "}
                  <span className="text-muted-foreground font-normal">
                    (Where we will send your payouts)
                  </span>
                </h4>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="grid gap-2">
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input
                      id="bankName"
                      {...form.register("bankName")}
                      placeholder="e.g. GTBank"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="bankAccountNumber">Account Number</Label>
                    <Input
                      id="bankAccountNumber"
                      {...form.register("bankAccountNumber")}
                      placeholder="10-digit number"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="bankAccountName">Account Name</Label>
                    <Input
                      id="bankAccountName"
                      {...form.register("bankAccountName")}
                      placeholder="e.g. John Doe"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-xl border border-brand-blue-soft bg-brand-blue/5">
                <h4 className="font-semibold text-sm mb-4 flex items-center">
                  Virtual Collection Account
                  <span className="ml-2 text-[10px] bg-brand-blue-soft text-brand-blue px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                    Auto-Generated
                  </span>
                </h4>
                <div className="grid gap-4 sm:grid-cols-3 opacity-80 pointer-events-none">
                  <div className="grid gap-2">
                    <Label>Virtual Bank Name</Label>
                    <Input
                      value="Providus Bank"
                      readOnly
                      className="bg-white/50"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Account Number</Label>
                    <Input
                      value="Generating..."
                      readOnly
                      className="bg-white/50"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Account Name</Label>
                    <Input
                      value={vendor ? vendor.businessName : "OneEvent / Vendor"}
                      readOnly
                      className="bg-white/50"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={isCreating}
                className="bg-brand-blue hover:bg-brand-blue-hover text-white shadow-sm h-10 px-6 font-bold rounded-lg transition-colors"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {vendor ? "Updating..." : "Creating..."}
                  </>
                ) : vendor ? (
                  "Update Profile"
                ) : (
                  "Create Profile"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
