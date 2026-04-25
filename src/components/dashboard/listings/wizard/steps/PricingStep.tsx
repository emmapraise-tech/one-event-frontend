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
import {
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Info,
  Plus,
  Trash2,
} from "lucide-react";
import { ListingFormData } from "@/types/listing";

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
  isLastStep,
}: StepProps) {
  // Local state for calendar interactions
  const [currentViewDate, setCurrentViewDate] = useState(new Date());
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);

  const handlePrevMonth = () => {
    setCurrentViewDate(new Date(currentViewDate.getFullYear(), currentViewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentViewDate(new Date(currentViewDate.getFullYear(), currentViewDate.getMonth() + 1, 1));
  };

  const toggleDate = (day: number) => {
    const date = new Date(currentViewDate.getFullYear(), currentViewDate.getMonth(), day);
    const exists = blockedDates.some(
      (d) =>
        d.getDate() === day && 
        d.getMonth() === currentViewDate.getMonth() && 
        d.getFullYear() === currentViewDate.getFullYear()
    );

    if (exists) {
      setBlockedDates((prev) =>
        prev.filter(
          (d) =>
            !(
              d.getDate() === day &&
              d.getMonth() === currentViewDate.getMonth() &&
              d.getFullYear() === currentViewDate.getFullYear()
            )
        )
      );
    } else {
      setBlockedDates((prev) => [...prev, date]);
    }
  };

  const isBlocked = (day: number) => {
    return blockedDates.some(
      (d) =>
        d.getDate() === day && 
        d.getMonth() === currentViewDate.getMonth() && 
        d.getFullYear() === currentViewDate.getFullYear()
    );
  };

  // Helper to get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Helper to get day of week for first day of month (0 = Sunday, ..., 6 = Saturday)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentViewDate.getFullYear(), currentViewDate.getMonth());
  const firstDay = getFirstDayOfMonth(currentViewDate.getFullYear(), currentViewDate.getMonth());
  const monthName = currentViewDate.toLocaleString('default', { month: 'long' });
  const year = currentViewDate.getFullYear();

  // Previous month days to fill the gap
  const prevMonthDays = getDaysInMonth(currentViewDate.getFullYear(), currentViewDate.getMonth() - 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => prevMonthDays - firstDay + i + 1);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
          <DollarSign className="h-5 w-5" />
        </div>
        <h2 className="text-lg font-semibold">Pricing & Availability</h2>
      </div>

      <div className="grid gap-12 lg:grid-cols-[360px_1fr]">
        {/* Pricing Section */}
        <div className="space-y-8">
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
                    type="number"
                    className="rounded-l-none rounded-r-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 text-base h-12"
                    placeholder="0.00"
                    value={formData.basePrice || ""}
                    onChange={(e) =>
                      updateFormData({ basePrice: Number(e.target.value) })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Service Charge (Commission) */}
            <div className="grid gap-3 pt-2">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium text-gray-700">
                  Service Charge (10%)
                </Label>
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <Info className="h-3 w-3" />
                </div>
              </div>
              <div className="flex h-12 w-full items-center rounded-lg border border-gray-200 bg-gray-50/50 px-4 text-gray-600 font-semibold shadow-inner">
                ₦ {((formData.basePrice || 0) * 0.1).toLocaleString()}
              </div>
              <p className="text-[11px] text-gray-400 font-medium">
                Automatically calculated based on your daily price.
              </p>
            </div>

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
                      type="number"
                      placeholder="Price"
                      value={addon.price || ""}
                      onChange={(e) => {
                        const newAddOns = [...(formData.addOns || [])];
                        newAddOns[index].price = Number(e.target.value);
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
        </div>

        {/* Calendar Section */}
        <div className="space-y-3">
          <Label className="text-base font-medium text-gray-700">
            Availability Calendar
          </Label>
          <div className="rounded-2xl border border-gray-200 p-6 bg-white shadow-sm select-none">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-lg font-bold text-gray-900">
                {monthName} {year}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePrevMonth}
                  type="button"
                  className="h-9 w-9 border-gray-200 hover:bg-gray-50 hover:text-blue-600"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNextMonth}
                  type="button"
                  className="h-9 w-9 border-gray-200 hover:bg-gray-50 hover:text-blue-600"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Simple Custom Calendar Grid Mockup matching design */}
            <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-400 mb-4 uppercase tracking-wider">
              <div>Su</div>
              <div>Mo</div>
              <div>Tu</div>
              <div>We</div>
              <div>Th</div>
              <div>Fr</div>
              <div>Sa</div>
            </div>
            <div className="grid grid-cols-7 gap-3 text-center text-sm font-medium">
              {/* Empty days from previous month */}
              {emptyDays.map((day) => (
                <div key={`empty-${day}`} className="h-10 w-10 flex items-center justify-center text-gray-300 mx-auto">
                  {day}
                </div>
              ))}
              {/* Days of current month */}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                const blocked = isBlocked(day);
                return (
                  <div
                    key={day}
                    onClick={() => toggleDate(day)}
                    className={`
											h-10 w-10 flex items-center justify-center rounded-lg cursor-pointer mx-auto transition-all duration-200
											${
                        blocked
                          ? "bg-blue-600 text-white shadow-md shadow-blue-200 scale-105"
                          : "hover:bg-gray-100 hover:text-blue-600 text-gray-700"
                      }
										`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>

            <div className="mt-8 rounded-xl bg-blue-50 p-4 text-sm text-blue-700 flex items-start gap-3">
              <Info className="h-5 w-5 shrink-0 mt-0.5" />
              <span>
                Select dates to block them from being booked. Currently
                selecting: <strong>{blockedDates.length} days blocked</strong>.
              </span>
            </div>
          </div>
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
