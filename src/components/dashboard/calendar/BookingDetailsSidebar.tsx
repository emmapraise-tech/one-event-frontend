"use client";

import { format } from "date-fns";
import {
  X,
  MapPin,
  Phone,
  User,
  CreditCard,
  FileText,
  Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Booking } from "./mockData";
import { cn } from "@/lib/utils"; // Assuming you have a cn utility, if not use string concat

interface BookingDetailsSidebarProps {
  booking: Booking | null;
  onClose: () => void;
}

export function BookingDetailsSidebar({
  booking,
  onClose,
}: BookingDetailsSidebarProps) {
  if (!booking) return null;

  const paymentPercentage =
    booking.totalCost > 0 ? (booking.paidAmount / booking.totalCost) * 100 : 0;

  return (
    <div className="flex h-full flex-col border-l border-gray-100 bg-white shadow-lg lg:w-[400px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900">Booking Details</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-8 p-6">
          {/* Status Badge */}
          <div>
            <span
              className={cn(
                "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
                booking.status === "confirmed" && "bg-green-100 text-green-700",
                booking.status === "pending" && "bg-yellow-100 text-yellow-700",
                booking.status === "blocked" && "bg-gray-100 text-gray-700",
              )}
            >
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
            <h3 className="mt-3 text-2xl font-bold text-gray-900 leading-tight">
              {booking.title}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {format(new Date(booking.date), "MMM d, yyyy")} • {booking.time}
            </p>
          </div>

          {/* Customer Info */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-blue-50 p-2 text-primary">
                <User className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Client Name
                </p>
                <p className="font-medium text-gray-900">
                  {booking.clientName}
                </p>
                <button className="text-xs text-primary hover:underline font-medium">
                  View Profile
                </button>
              </div>
            </div>

            {booking.location && (
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-blue-50 p-2 text-primary">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Venue
                  </p>
                  <p className="font-medium text-gray-900">
                    {booking.location} (500 Capacity)
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <div className="rounded-full bg-blue-50 p-2 text-primary">
                <Phone className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Contact
                </p>
                <p className="font-medium text-gray-900">+234 801 234 5678</p>
              </div>
            </div>
          </div>

          {/* Payment Status */}
          <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 space-y-4">
            <h4 className="font-semibold text-gray-900">Payment Status</h4>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Cost</span>
                <span className="font-bold text-gray-900">
                  ₦{booking.totalCost.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Paid</span>
                <span className="font-bold text-green-600">
                  ₦{booking.paidAmount.toLocaleString()}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="h-2 w-full rounded-full bg-gray-200 mt-2">
                <div
                  className="h-2 rounded-full bg-green-500 transition-all duration-500"
                  style={{ width: `${paymentPercentage}%` }}
                />
              </div>

              <div className="flex justify-between text-sm pt-2 border-t border-gray-200 mt-2">
                <span className="font-medium text-gray-900">Balance</span>
                <span className="font-bold text-red-600">
                  ₦{(booking.totalCost - booking.paidAmount).toLocaleString()}
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full bg-white border-gray-200 hover:bg-gray-50 text-gray-900 font-medium"
            >
              Send Payment Reminder
            </Button>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900">Notes</h4>
            <textarea
              className="w-full h-24 rounded-lg border border-gray-200 bg-white p-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none placeholder:text-gray-400"
              placeholder="Add a note..."
            ></textarea>
          </div>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t border-gray-100 p-6">
        <div className="flex gap-3">
          <Button
            variant="ghost"
            className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
          >
            Cancel
          </Button>
          <Button className="flex-1 bg-primary text-white hover:bg-primary/90">
            Edit
          </Button>
        </div>
      </div>
    </div>
  );
}
