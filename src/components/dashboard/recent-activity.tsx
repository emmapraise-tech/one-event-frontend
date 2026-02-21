import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ChevronRight, MoreHorizontal, Star } from "lucide-react";

export function PendingRequests() {
  return (
    <Card className="shadow-sm border-neutral-100">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base font-bold text-neutral-900">
            Pending Requests
          </CardTitle>
          <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            2
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Request Item */}
        <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100 hover:border-primary-blue/30 transition-colors">
          <div className="flex gap-3 mb-3">
            <div className="h-10 w-10 shrink-0 bg-blue-100 text-primary-blue rounded-lg flex items-center justify-center">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-neutral-900">
                Wedding Reception Inquiry
              </h4>
              <p className="text-xs text-neutral-500">
                Request for Grand Ballroom on Dec 12
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              className="h-8 bg-primary-blue hover:bg-primary-blue-hover text-xs font-semibold"
            >
              Review
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 text-neutral-500 hover:text-neutral-900 text-xs"
            >
              Dismiss
            </Button>
          </div>
        </div>

        {/* Review Item */}
        <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100 flex gap-3 items-start">
          <div className="h-10 w-10 shrink-0 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center">
            <Star className="h-5 w-5 fill-current" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-neutral-900">
              New Review Received
            </h4>
            <p className="text-xs text-neutral-500 mb-1">
              4 star rating from Corporate Event Inc.
            </p>
            <button className="text-xs text-primary-blue font-semibold hover:underline">
              Read Review
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function RecentBookingsTable() {
  return (
    <Card className="shadow-sm border-neutral-100">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-bold text-neutral-900">
          Recent Bookings
        </CardTitle>
        <button className="text-xs font-semibold text-primary-blue hover:underline">
          View All
        </button>
      </CardHeader>
      <CardContent>
        <table className="w-full text-sm text-left">
          <thead className="text-[10px] uppercase text-neutral-400 font-semibold tracking-wider border-b border-neutral-100">
            <tr>
              <th className="pb-3 pl-2">Guest & Venue</th>
              <th className="pb-3">Date</th>
              <th className="pb-3">Status</th>
              <th className="pb-3 text-right pr-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-50">
            {[1, 2, 3].map((i) => (
              <tr key={i} className="group hover:bg-neutral-50/50">
                <td className="py-4 pl-2">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-neutral-200" />
                    <div>
                      <div className="font-semibold text-neutral-900">
                        Sarah Johnson
                      </div>
                      <div className="text-xs text-neutral-500">
                        Grand Ballroom A
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 text-neutral-600">Oct 24, 2025</td>
                <td className="py-4">
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0 shadow-none font-bold text-[10px] uppercase">
                    Confirmed
                  </Badge>
                </td>
                <td className="py-4 text-right pr-2">
                  <button className="text-neutral-400 hover:text-primary-blue">
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
