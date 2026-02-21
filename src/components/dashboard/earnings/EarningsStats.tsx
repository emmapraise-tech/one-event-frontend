import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  DollarSign,
} from "lucide-react";

interface EarningsStatsProps {
  totalRevenue: number;
  pendingPayouts: number;
  availableForPayout: number;
  revenueGrowth: number; // percentage
}

export function EarningsStats({
  totalRevenue,
  pendingPayouts,
  availableForPayout,
  revenueGrowth,
}: EarningsStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Total Revenue */}
      <Card className="shadow-sm border-border/60">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Revenue
          </CardTitle>
          <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
            <DollarSign className="h-4 w-4 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">
            ₦ {totalRevenue.toLocaleString()}
          </div>
          <div className="flex items-center text-xs mt-1">
            {revenueGrowth >= 0 ? (
              <span className="text-emerald-600 flex items-center font-medium bg-emerald-50 px-1.5 py-0.5 rounded mr-2">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                {revenueGrowth}%
              </span>
            ) : (
              <span className="text-rose-600 flex items-center font-medium bg-rose-50 px-1.5 py-0.5 rounded mr-2">
                <ArrowDownRight className="h-3 w-3 mr-1" />
                {Math.abs(revenueGrowth)}%
              </span>
            )}
            <span className="text-muted-foreground">vs last month</span>
          </div>
        </CardContent>
      </Card>

      {/* Available for Payout */}
      <Card className="shadow-sm border-border/60">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Available for Payout
          </CardTitle>
          <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
            <Wallet className="h-4 w-4 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">
            ₦ {availableForPayout.toLocaleString()}
          </div>
          <div className="flex items-center text-xs mt-1 text-muted-foreground">
            Ready to withdraw
          </div>
        </CardContent>
      </Card>

      {/* Pending Clearance */}
      <Card className="shadow-sm border-border/60">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Pending Clearance
          </CardTitle>
          <div className="h-8 w-8 rounded-full bg-amber-50 flex items-center justify-center">
            <Clock className="h-4 w-4 text-amber-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">
            ₦ {pendingPayouts.toLocaleString()}
          </div>
          <div className="flex items-center text-xs mt-1 text-muted-foreground">
            Est. clearance: 2-3 days
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
