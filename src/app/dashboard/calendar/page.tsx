"use client";

import { useState } from "react";
import { CalendarGrid } from "@/components/dashboard/calendar/CalendarGrid";
import { CalendarHeader } from "@/components/dashboard/calendar/CalendarHeader";
import { CalendarStats } from "@/components/dashboard/calendar/CalendarStats";
import { BookingDetailsSidebar } from "@/components/dashboard/calendar/BookingDetailsSidebar";
import { bookings, Booking } from "@/components/dashboard/calendar/mockData";

export default function CalendarPage() {
  // Initialize with first booking selected to match design mock
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(
    bookings[0],
  );

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          <CalendarHeader />
          <CalendarStats />

          {/* Grow grid to fill remaining space */}
          <div className="flex-1 pb-6 min-h-[600px]">
            <CalendarGrid
              onSelectBooking={setSelectedBooking}
              selectedBookingId={selectedBooking?.id}
            />
          </div>
        </div>
      </div>

      {/* Right Sidebar - Conditional or Responsive */}
      {selectedBooking && (
        <div className="hidden lg:block h-full">
          <BookingDetailsSidebar
            booking={selectedBooking}
            onClose={() => setSelectedBooking(null)}
          />
        </div>
      )}
    </div>
  );
}
