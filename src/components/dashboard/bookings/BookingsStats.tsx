import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, FileText, Calendar } from "lucide-react";

interface BookingsStatsProps {
  totalRevenue: number;
  pendingRequests: number;
  upcomingEvents: number;
}

export function BookingsStats({
  totalRevenue,
  pendingRequests,
  upcomingEvents,
}: BookingsStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="shadow-sm border-border/60">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Revenue
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-emerald-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            ₦ {totalRevenue.toLocaleString()}
          </div>
          <div className="mt-1 flex items-center text-xs">
            <span className="text-emerald-700 bg-emerald-100 font-medium px-1.5 py-0.5 rounded text-[10px] mr-2">
              +15%
            </span>
            <span className="text-muted-foreground">vs last month</span>
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-sm border-border/60">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Pending Requests
          </CardTitle>
          <FileText className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {pendingRequests}
          </div>
          <div className="mt-1 flex items-center text-xs">
            <span className="text-blue-700 bg-blue-100 font-medium px-1.5 py-0.5 rounded text-[10px] mr-2">
              +2 new today
            </span>
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-sm border-border/60">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Upcoming Events
          </CardTitle>
          <Calendar className="h-4 w-4 text-rose-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {upcomingEvents}
          </div>
          <div className="mt-1 flex items-center text-xs">
            <span className="bg-rose-100 text-rose-700 font-medium px-1.5 py-0.5 rounded text-[10px] mr-2">
              Next 7 days
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
