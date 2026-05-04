import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatNumber, parseNumber } from "@/lib/utils";
import {
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Info,
  Plus,
  Trash2,
  Building2,
} from "lucide-react";
import { ListingFormData, ListingType } from "@/types/listing";

interface StepProps {
  formData: ListingFormData;
  updateFormData: (data: Partial<ListingFormData>) => void;
  onNext: () => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export function PricingStep({
  formData,
  updateFormData,
  onNext,
  onBack,
}: StepProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
          <DollarSign className="h-5 w-5" />
        </div>
        <h2 className="text-lg font-semibold">Pricing & Availability</h2>
      </div>

      {formData.type !== ListingType.VENUE && (
        <div className="space-y-6">
          <div className="grid gap-3 animate-in slide-in-from-top-2 duration-300">
                  <Label
                    htmlFor="basePrice"
                    className="text-base font-medium text-gray-700"
                  >
                    Daily Price
                  </Label>
                  <div className="relative shadow-sm">
                    <div className="flex">
                      <div className="flex items-center justify-center border border-r-0 border-gray-200 rounded-l-lg bg-gray-50 px-4 text-gray-500 font-medium min-w-[48px]">
                        ₦
                      </div>
                      <Input
                        id="basePrice"
                        type="text"
                        className="rounded-l-none rounded-r-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 text-base h-12"
                        placeholder="0.00"
                        value={formatNumber(formData.basePrice)}
                        onChange={(e) =>
                          updateFormData({ basePrice: parseNumber(e.target.value) })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Service Charge (Commission) */}
                <div className="grid gap-3 pt-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-medium text-gray-700">
                      Service Charge (5%)
                    </Label>
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                      <Info className="h-3 w-3" />
                    </div>
                  </div>
                  <div className="flex h-12 w-full items-center rounded-lg border border-gray-200 bg-gray-50/50 px-4 text-gray-600 font-semibold shadow-inner">
                    ₦ {((formData.basePrice || 0) * 0.05).toLocaleString()}
                  </div>
                  <p className="text-[11px] text-gray-400 font-medium">
                    Automatically calculated based on your daily price.
                  </p>
          </div>
        </div>
      )}

      {/* Halls Section (For Venues only) */}
      {formData.type === ListingType.VENUE && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium text-gray-700">
                Halls / Spaces
              </Label>
              <p className="text-xs text-gray-500 mt-1">Add multiple halls if your venue has them.</p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                const current = formData.halls || [];
                updateFormData({
                  halls: [...current, { name: "", capacity: 0, standingCapacity: 0, hasIndoor: true, hasOutdoor: false, price: 0 }],
                });
              }}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Hall
            </Button>
          </div>

          <div className="space-y-3">
            {(formData.halls || []).map((hall, index) => (
              <div
                key={index}
                className="flex flex-col gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 animate-in fade-in slide-in-from-left-2 duration-200"
              >
                <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <span className="text-sm font-bold text-gray-800">Hall Details</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={(formData.halls || []).length <= 1}
                    onClick={() => {
                      const newHalls = formData.halls?.filter((_, i) => i !== index);
                      updateFormData({ halls: newHalls });
                    }}
                    className="h-8 text-gray-400 hover:text-red-500 hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    Remove
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <Label className="text-xs text-gray-500 mb-1 block">Hall Name</Label>
                    <Input
                      placeholder="e.g. Main Hall"
                      value={hall.name}
                      onChange={(e) => {
                        const newHalls = [...(formData.halls || [])];
                        newHalls[index].name = e.target.value;
                        updateFormData({ halls: newHalls });
                      }}
                      className="h-10 border-gray-200 bg-white"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 mb-1 block">Price (₦)</Label>
                    <Input
                      type="text"
                      placeholder="e.g. 150,000"
                      value={formatNumber(hall.price)}
                      onChange={(e) => {
                        const newHalls = [...(formData.halls || [])];
                        newHalls[index].price = parseNumber(e.target.value);
                        updateFormData({ halls: newHalls });
                      }}
                      className="h-10 border-gray-200 bg-white"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 mb-1 block">Seating Capacity</Label>
                    <Input
                      type="text"
                      placeholder="e.g. 500"
                      value={formatNumber(hall.capacity)}
                      onChange={(e) => {
                        const newHalls = [...(formData.halls || [])];
                        newHalls[index].capacity = parseNumber(e.target.value);
                        updateFormData({ halls: newHalls });
                      }}
                      className="h-10 border-gray-200 bg-white"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 mb-1 block">Standing Capacity</Label>
                    <Input
                      type="text"
                      placeholder="e.g. 800"
                      value={formatNumber(hall.standingCapacity)}
                      onChange={(e) => {
                        const newHalls = [...(formData.halls || [])];
                        newHalls[index].standingCapacity = parseNumber(e.target.value);
                        updateFormData({ halls: newHalls });
                      }}
                      className="h-10 border-gray-200 bg-white"
                    />
                  </div>
                </div>
                <div className="space-y-2 mt-1">
                  <Label className="text-xs text-gray-500 block">Hall Setting</Label>
                  <RadioGroup
                    value={hall.hasIndoor ? "indoor" : "outdoor"}
                    onValueChange={(val) => {
                      const newHalls = [...(formData.halls || [])];
                      newHalls[index].hasIndoor = val === "indoor";
                      newHalls[index].hasOutdoor = val === "outdoor";
                      updateFormData({ halls: newHalls });
                    }}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="indoor" id={`indoor-${index}`} />
                      <Label htmlFor={`indoor-${index}`} className="text-xs text-gray-600 cursor-pointer">Indoor Space</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="outdoor" id={`outdoor-${index}`} />
                      <Label htmlFor={`outdoor-${index}`} className="text-xs text-gray-600 cursor-pointer">Outdoor Space</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add-ons Section */}
      <div className="space-y-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium text-gray-700">
            Extra Services (Add-ons)
          </Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              const current = formData.addOns || [];
              updateFormData({
                addOns: [...current, { name: "", price: 0 }],
              });
            }}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 gap-2"
          >
            <Plus className="h-4 w-4" />
            Add service
          </Button>
        </div>

        <div className="space-y-3">
          {(formData.addOns || []).map((addon, index) => (
            <div
              key={index}
              className="flex gap-3 items-start animate-in fade-in slide-in-from-left-2 duration-200"
            >
              <div className="flex-1">
                <Input
                  placeholder="Setting, Sound, etc."
                  value={addon.name}
                  onChange={(e) => {
                    const newAddOns = [...(formData.addOns || [])];
                    newAddOns[index].name = e.target.value;
                    updateFormData({ addOns: newAddOns });
                  }}
                  className="h-10 border-gray-200"
                />
              </div>
              <div className="w-24 relative">
                <Input
                  type="text"
                  placeholder="Price"
                  value={formatNumber(addon.price)}
                  onChange={(e) => {
                    const newAddOns = [...(formData.addOns || [])];
                    newAddOns[index].price = parseNumber(e.target.value);
                    updateFormData({ addOns: newAddOns });
                  }}
                  className="h-10 pl-6 border-gray-200"
                />
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-semibold">
                  ₦
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => {
                  const newAddOns = formData.addOns?.filter(
                    (_, i) => i !== index,
                  );
                  updateFormData({ addOns: newAddOns });
                }}
                className="h-10 w-10 text-gray-400 hover:text-red-500 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {(!formData.addOns || formData.addOns.length === 0) && (
            <p className="text-xs text-gray-400 italic bg-gray-50 p-3 rounded-lg border border-dashed border-gray-200 text-center">
              No extra services added yet.
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-between pt-8 border-t border-gray-100">
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          className="text-gray-500 hover:text-gray-900 hover:bg-gray-100 h-12 px-6 rounded-xl font-bold"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        {/* <Button
          type="submit"
          className="hover:bg-blue-700 w-full sm:w-auto bg-brand-blue text-white px-10 h-12 rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-100"
        >
          {isLastStep ? "Publish Listing" : "Continue"}
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button> */}
      </div>
    </form>
  );
}
