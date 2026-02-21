"use client";

import { Download, Upload, Wallet, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EarningsStats } from "@/components/dashboard/earnings/EarningsStats";
import { EarningsChart } from "@/components/dashboard/earnings/EarningsChart";
import {
  TransactionHistory,
  TransactionStatus,
  TransactionType,
} from "@/components/dashboard/earnings/TransactionHistory";

// Mock Data
const mockStats = {
  totalRevenue: 2540000,
  pendingPayouts: 150000,
  availableForPayout: 450000,
  revenueGrowth: 12.5,
};

const mockChartData = [
  { name: "Jan", total: 150000 },
  { name: "Feb", total: 230000 },
  { name: "Mar", total: 180000 },
  { name: "Apr", total: 320000 },
  { name: "May", total: 450000 },
  { name: "Jun", total: 380000 },
  { name: "Jul", total: 520000 },
];

const mockTransactions = [
  {
    id: "TX-001",
    date: "2024-07-15T10:30:00",
    description: "Booking Payment - Wedding Reception",
    amount: 350000,
    type: TransactionType.INFLOW,
    status: TransactionStatus.COMPLETED,
    reference: "REF-892301",
  },
  {
    id: "TX-002",
    date: "2024-07-12T14:15:00",
    description: "Payout to Bank Account",
    amount: 200000,
    type: TransactionType.OUTFLOW,
    status: TransactionStatus.COMPLETED,
    reference: "PAY-112233",
  },
  {
    id: "TX-003",
    date: "2024-07-10T09:00:00",
    description: "Booking Payment - Birthday Party",
    amount: 150000,
    type: TransactionType.INFLOW,
    status: TransactionStatus.PENDING,
    reference: "REF-892305",
  },
  {
    id: "TX-004",
    date: "2024-07-05T11:20:00",
    description: "Booking Payment - Corporate Event",
    amount: 500000,
    type: TransactionType.INFLOW,
    status: TransactionStatus.COMPLETED,
    reference: "REF-892308",
  },
  {
    id: "TX-005",
    date: "2024-06-28T16:45:00",
    description: "Payout to Bank Account",
    amount: 100000,
    type: TransactionType.OUTFLOW,
    status: TransactionStatus.FAILED,
    reference: "PAY-112244",
  },
];

export default function EarningsPage() {
  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-white/80 border-b border-border/60 px-8 py-4 flex items-center justify-between backdrop-blur-sm supports-backdrop-filter:bg-white/60">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">
            Earnings
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your revenue and payouts
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="hidden sm:flex border-border/60"
          >
            <HelpCircle className="mr-2 h-4 w-4" />
            Help & Support
          </Button>
          <Button className="bg-brand-blue hover:bg-brand-blue-hover text-white shadow-sm h-10 px-6 font-bold rounded-lg transition-colors">
            <Upload className="mr-2 h-4 w-4" />
            Request Payout
          </Button>
        </div>
      </div>

      <div className="w-full px-8 p-8 space-y-8">
        {/* Stats Grid */}
        <EarningsStats {...mockStats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart Section */}
          <div className="lg:col-span-2">
            <EarningsChart data={mockChartData} />
          </div>

          {/* Quick Transfer / Info Card (Right Column) */}
          <div className="space-y-6">
            <div className="rounded-xl border border-border/60 bg-white shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Wallet className="h-4 w-4 text-primary" />
                Virtual Settlement Account
              </h3>
              <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                Payments from your customers are automatically routed to this
                dedicated virtual account.
              </p>
              <div className="p-4 rounded-lg border border-border/50 bg-gray-50 flex flex-col gap-3 mb-4">
                <div className="flex items-center justify-between pb-3 border-b border-border/50">
                  <span className="text-xs text-muted-foreground">
                    Bank Name
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    Providus Bank (Pending)
                  </span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-border/50">
                  <span className="text-xs text-muted-foreground">
                    Account Number
                  </span>
                  <span className="text-sm font-black text-brand-blue tracking-wider">
                    Generating...
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Account Name
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    OneEvent / Vendor Name
                  </span>
                </div>
              </div>
              <Button variant="outline" disabled className="w-full text-xs">
                Copy Account Details
              </Button>
            </div>

            <div className="rounded-xl bg-linear-to-br from-blue-50 to-indigo-50 border border-blue-100 p-6">
              <h4 className="font-semibold text-blue-900 mb-2">
                Automated Payouts
              </h4>
              <p className="text-xs text-blue-700 mb-4 leading-relaxed">
                Enable automated weekly payouts to receive your earnings every
                Monday directly to your bank account.
              </p>
              <Button
                size="sm"
                variant="secondary"
                className="w-full bg-white text-blue-700 hover:bg-blue-50 border border-blue-200"
              >
                Configure Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <TransactionHistory transactions={mockTransactions} />
      </div>
    </div>
  );
}
