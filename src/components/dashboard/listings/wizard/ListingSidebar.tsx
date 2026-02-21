import { Zap, HelpCircle, CheckCircle2, Circle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ListingFormData } from "@/types/listing";

interface ListingSidebarProps {
  currentStep: number;
  totalSteps: number;
  formData: Partial<ListingFormData>;
}

export function ListingSidebar({
  currentStep,
  totalSteps,
  formData,
}: ListingSidebarProps) {
  // Calculate completion percentage based on steps and filled fields
  const calculateCompletion = () => {
    let score = 0;
    if (formData.title && formData.description) score += 20;
    if (formData.addressLine && formData.city) score += 20;
    if (formData.totalArea || formData.amenities?.length) score += 20;
    if (formData.imageUrls && formData.imageUrls.length > 5) score += 20;
    if (formData.basePrice || (formData.weekdayPrice && formData.weekendPrice))
      score += 20;
    return score;
  };

  const completionPercentage = calculateCompletion();

  const steps = [
    { id: 1, label: "Basic venue details", completed: !!formData.title },
    {
      id: 2,
      label: "Verify location on map",
      completed: !!formData.addressLine,
    },
    { id: 3, label: "Add specification", completed: !!formData.totalArea },
    {
      id: 4,
      label: "Add at least 5 photos",
      completed: (formData.imageUrls?.length || 0) >= 5,
    },
    {
      id: 5,
      label: "Set pricing information",
      completed:
        !!formData.basePrice ||
        (!!formData.weekdayPrice && !!formData.weekendPrice),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Listing Quality Card */}
      <Card className="rounded-2xl border-gray-100 shadow-sm overflow-hidden">
        <CardHeader className="pb-4 pt-6 px-6">
          <div className="flex items-center justify-between mb-2">
            <CardTitle className="text-base font-bold text-gray-900">
              Listing Quality
            </CardTitle>
            <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
              {completionPercentage}%
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-700 ease-in-out shadow-[0_0_10px_rgba(37,99,235,0.3)]"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-6 pt-0">
          <div className="space-y-4">
            {steps.map((step) => (
              <div key={step.id} className="flex items-start gap-3 group">
                <div
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border mt-0.5 transition-colors",
                    step.completed
                      ? "border-green-500 bg-green-500 text-white"
                      : "border-gray-200 text-gray-300",
                  )}
                >
                  {step.completed ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-3 w-3"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <div className="h-1.5 w-1.5 rounded-full bg-current" />
                  )}
                </div>
                <span
                  className={cn(
                    "text-sm leading-tight transition-colors",
                    step.completed
                      ? "text-gray-700 font-medium"
                      : "text-gray-500",
                  )}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pro Tip Card */}
      <Card className="rounded-2xl border-blue-100 bg-linear-to-b from-blue-50 to-white shadow-sm">
        <CardContent className="pt-6 pb-6 px-6">
          <div className="mb-3 flex items-center gap-2 text-blue-700">
            <div className="bg-blue-100 p-1.5 rounded-md">
              <Zap className="h-4 w-4 fill-blue-600 text-blue-600" />
            </div>
            <span className="font-bold text-sm">Pro Tip</span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            Venues with{" "}
            <span className="font-semibold text-gray-900">
              high-quality cover images
            </span>{" "}
            receive up to{" "}
            <span className="font-bold text-blue-600 bg-blue-50 px-1 rounded">
              2.5x more inquiries
            </span>
            . Make sure your best photo is first!
          </p>
        </CardContent>
      </Card>

      {/* Need Help Card */}
      <Card className="rounded-2xl border-gray-100 shadow-sm">
        <CardHeader className="pt-6 pb-2 px-6">
          <CardTitle className="text-base font-bold text-gray-900">
            Need Help?
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-6 px-6">
          <p className="mb-4 text-sm text-gray-500 leading-relaxed">
            Our support team is available 24/7 to assist you with your listing
            setup.
          </p>
          <Button
            variant="link"
            className="h-auto p-0 text-blue-600 font-semibold hover:text-blue-700 hover:no-underline flex items-center gap-1 group"
          >
            Contact Support
            <span className="group-hover:translate-x-0.5 transition-transform">
              →
            </span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
