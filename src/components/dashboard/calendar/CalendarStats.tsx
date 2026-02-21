"use client";

import { Calendar, TrendingUp, AlertCircle, CreditCard } from "lucide-react";

export function CalendarStats() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-primary">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Upcoming Events
            </p>
            <h3 className="text-2xl font-bold text-gray-900">12</h3>
          </div>
        </div>
        <div className="mt-4 flex items-center text-xs font-medium text-emerald-600">
          <TrendingUp className="mr-1 h-3 w-3" />
          <span>+2 from last week</span>
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-primary">
            <CreditCard className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Total Revenue (Month)
            </p>
            <h3 className="text-2xl font-bold text-gray-900">₦4,500,000</h3>
          </div>
        </div>
        <div className="mt-4 flex items-center text-xs font-medium text-muted-foreground">
          <span>Target: ₦6,000,000</span>
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Pending Requests
            </p>
            <h3 className="text-2xl font-bold text-gray-900">3</h3>
          </div>
        </div>
        <div className="mt-4 flex items-center text-xs font-medium text-orange-600">
          <span>Action required</span>
        </div>
      </div>
    </div>
  );
}
