import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { LayoutDashboard } from "lucide-react";
import { ListingFormData, ListingType } from "@/types/listing";

interface StepProps {
  formData: ListingFormData;
  updateFormData: (data: Partial<ListingFormData>) => void;
  onNext: () => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

import { AMENITY_MAP } from "@/constants/amenities";

export function SpecificationStep({
  formData,
  updateFormData,
  onNext,
  onBack,
}: StepProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const toggleAmenity = (amenity: string) => {
    const currentAmenities = formData.amenities || [];
    if (currentAmenities.includes(amenity)) {
      updateFormData({
        amenities: currentAmenities.filter((a) => a !== amenity),
      });
    } else {
      updateFormData({
        amenities: [...currentAmenities, amenity],
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
          <LayoutDashboard className="h-5 w-5" />
        </div>
        <h2 className="text-lg font-semibold">Specification</h2>
      </div>

      <div className="space-y-8">
        {formData.type === ListingType.VENUE ? (
          <>
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="grid gap-3">
                <Label
                  htmlFor="totalArea"
                  className="text-base font-medium text-gray-700"
                >
                  Total Area (sq ft)
                </Label>
                <Input
                  id="totalArea"
                  type="number"
                  placeholder="e.g. 5000"
                  value={formData.totalArea || ""}
                  onChange={(e) =>
                    updateFormData({ totalArea: Number(e.target.value) })
                  }
                  className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 text-base"
                />
              </div>
              <div className="grid gap-3">
                <Label
                  htmlFor="seatedCapacity"
                  className="text-base font-medium text-gray-700"
                >
                  Seated Capacity
                </Label>
                <Input
                  id="seatedCapacity"
                  type="number"
                  placeholder="e.g. 200"
                  value={formData.seatedCapacity || ""}
                  onChange={(e) =>
                    updateFormData({ seatedCapacity: Number(e.target.value) })
                  }
                  className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 text-base"
                />
              </div>
              <div className="grid gap-3">
                <Label
                  htmlFor="standingCapacity"
                  className="text-base font-medium text-gray-700"
                >
                  Standing Capacity
                </Label>
                <Input
                  id="standingCapacity"
                  type="number"
                  placeholder="e.g. 350"
                  value={formData.standingCapacity || ""}
                  onChange={(e) =>
                    updateFormData({ standingCapacity: Number(e.target.value) })
                  }
                  className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 text-base"
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-base font-medium text-gray-700">
                Venue Setting
              </Label>
              <div className="flex gap-8 p-4 bg-gray-50 border border-gray-100 rounded-xl">
                <div className="flex items-center space-x-3 cursor-pointer">
                  <Checkbox
                    id="hasIndoor"
                    checked={formData.hasIndoor}
                    onCheckedChange={(checked) =>
                      updateFormData({ hasIndoor: !!checked })
                    }
                    className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 h-5 w-5"
                  />
                  <Label
                    htmlFor="hasIndoor"
                    className="text-sm font-medium text-gray-600 cursor-pointer"
                  >
                    Indoor Space
                  </Label>
                </div>
                <div className="flex items-center space-x-3 cursor-pointer">
                  <Checkbox
                    id="hasOutdoor"
                    checked={formData.hasOutdoor}
                    onCheckedChange={(checked) =>
                      updateFormData({ hasOutdoor: !!checked })
                    }
                    className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 h-5 w-5"
                  />
                  <Label
                    htmlFor="hasOutdoor"
                    className="text-sm font-medium text-gray-600 cursor-pointer"
                  >
                    Outdoor Space
                  </Label>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-base font-medium text-gray-700">
                Amenities
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
                {Object.entries(AMENITY_MAP).map(([slug, config]) => (
                  <div
                    key={slug}
                    className="flex items-center space-x-3 group cursor-pointer"
                  >
                    <Checkbox
                      id={`amenity-${slug}`}
                      checked={formData.amenities?.includes(slug)}
                      onCheckedChange={() => toggleAmenity(slug)}
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 h-5 w-5 border-2 border-gray-300 transition-all rounded-md"
                    />
                    <label
                      htmlFor={`amenity-${slug}`}
                      className="text-sm font-medium leading-none text-gray-600 group-hover:text-gray-900 cursor-pointer transition-colors flex items-center gap-2"
                    >
                      <span className="opacity-70">{config.icon}</span>
                      {config.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 pt-2">
            <div className="grid gap-3">
              <Label
                htmlFor="minBookingHrs"
                className="text-base font-medium text-gray-700"
              >
                Minimum Booking Hours
              </Label>
              <Input
                id="minBookingHrs"
                type="number"
                placeholder="e.g. 2"
                min="1"
                value={formData.minBookingHrs || ""}
                onChange={(e) =>
                  updateFormData({ minBookingHrs: Number(e.target.value) })
                }
                className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 text-base"
              />
            </div>
            <div className="grid gap-4 col-span-2">
              <Label className="text-base font-medium text-gray-700">
                Specialties
              </Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {(formData.specialties || []).map((specialty, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-bold border border-blue-100 animate-in zoom-in-50 duration-200"
                  >
                    {specialty}
                    <button
                      type="button"
                      onClick={() => {
                        const newSpecs = (formData.specialties || []).filter(
                          (_, i) => i !== index,
                        );
                        updateFormData({ specialties: newSpecs });
                      }}
                      className="hover:text-blue-900 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-4 w-4"
                      >
                        <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  id="specialty-input"
                  type="text"
                  placeholder="Add a specialty (e.g. Wedding Photography)"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const val = (e.target as HTMLInputElement).value.trim();
                      if (val && !formData.specialties?.includes(val)) {
                        updateFormData({
                          specialties: [...(formData.specialties || []), val],
                        });
                        (e.target as HTMLInputElement).value = "";
                      }
                    }
                  }}
                  className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 text-base flex-1"
                />
                <Button
                  type="button"
                  onClick={() => {
                    const input = document.getElementById(
                      "specialty-input",
                    ) as HTMLInputElement;
                    const val = input.value.trim();
                    if (val && !formData.specialties?.includes(val)) {
                      updateFormData({
                        specialties: [...(formData.specialties || []), val],
                      });
                      input.value = "";
                    }
                  }}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 h-12 px-6 rounded-xl font-bold"
                >
                  Add
                </Button>
              </div>
              <p className="text-xs text-gray-400 font-medium italic">
                Press Enter or click Add to save a specialty.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
        >
          Continue
        </Button>
      </div>
    </form>
  );
}
