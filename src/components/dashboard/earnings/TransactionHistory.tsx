'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import {
	Download,
	MoreVertical,
	Search,
	Filter,
	ArrowUpRight,
	ArrowDownLeft,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export enum TransactionStatus {
	COMPLETED = 'COMPLETED',
	PENDING = 'PENDING',
	FAILED = 'FAILED',
}

export enum TransactionType {
	INFLOW = 'INFLOW', // Booking Payment
	OUTFLOW = 'OUTFLOW', // Payout
}

export interface Transaction {
	id: string;
	date: string;
	description: string;
	amount: number;
	type: TransactionType;
	status: TransactionStatus;
	reference: string;
}

interface TransactionHistoryProps {
	transactions: Transaction[];
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
	const [searchQuery, setSearchQuery] = useState('');

	const getStatusColor = (status: TransactionStatus) => {
		switch (status) {
			case TransactionStatus.COMPLETED:
				return 'bg-emerald-50 text-emerald-700 border-emerald-200';
			case TransactionStatus.PENDING:
				return 'bg-amber-50 text-amber-700 border-amber-200';
			case TransactionStatus.FAILED:
				return 'bg-rose-50 text-rose-700 border-rose-200';
			default:
				return 'bg-gray-100 text-gray-700 border-gray-200';
		}
	};

	const getTypeIcon = (type: TransactionType) => {
		return type === TransactionType.INFLOW ? (
			<ArrowDownLeft className="h-4 w-4 text-primary" />
		) : (
			<ArrowUpRight className="h-4 w-4 text-muted-foreground" />
		);
	};

	return (
		<div className="space-y-4">
			<div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
				<h3 className="text-lg font-semibold tracking-tight">
					Recent Transactions
				</h3>
				<div className="flex w-full sm:w-auto gap-2">
					<div className="relative flex-1 sm:w-64">
						<Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Search transactions..."
							className="pl-9 bg-background border-border/60"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>
					<Button variant="outline" className="border-border/60">
						<Filter className="mr-2 h-4 w-4" />
						Filter
					</Button>
				</div>
			</div>

			<div className="border border-border/60 rounded-xl bg-white overflow-hidden shadow-sm">
				<div className="overflow-x-auto">
					<table className="w-full text-sm text-left">
						<thead className="text-xs text-muted-foreground uppercase bg-gray-50/50 border-b border-border/60">
							<tr>
								<th className="px-6 py-4 font-semibold tracking-wider">Date</th>
								<th className="px-6 py-4 font-semibold tracking-wider">
									Description
								</th>
								<th className="px-6 py-4 font-semibold tracking-wider hidden md:table-cell">
									Reference
								</th>
								<th className="px-6 py-4 font-semibold tracking-wider">
									Amount
								</th>
								<th className="px-6 py-4 font-semibold tracking-wider hidden sm:table-cell">
									Status
								</th>
								<th className="px-6 py-4 font-semibold tracking-wider text-right">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100">
							{transactions.map((tx) => (
								<tr
									key={tx.id}
									className="hover:bg-gray-50/50 transition-colors"
								>
									<td className="px-6 py-4 font-medium text-gray-900">
										{format(new Date(tx.date), 'dd MMM, yyyy')}
										<div className="text-xs text-muted-foreground mt-0.5">
											{format(new Date(tx.date), 'p')}
										</div>
									</td>
									<td className="px-6 py-4">
										<div className="flex items-center gap-3">
											<div
												className={`p-2 rounded-full hidden sm:block ${tx.type === TransactionType.INFLOW ? 'bg-blue-50' : 'bg-gray-100'}`}
											>
												{getTypeIcon(tx.type)}
											</div>
											<span className="font-medium text-gray-700 min-w-[120px] line-clamp-2">
												{tx.description}
											</span>
										</div>
									</td>
									<td className="px-6 py-4 text-muted-foreground font-mono text-xs hidden md:table-cell">
										{tx.reference}
									</td>
									<td
										className={`px-6 py-4 font-semibold whitespace-nowrap ${tx.type === TransactionType.INFLOW ? 'text-primary' : 'text-gray-900'}`}
									>
										{tx.type === TransactionType.INFLOW ? '+' : '-'} ₦
										{tx.amount.toLocaleString()}
									</td>
									<td className="px-6 py-4 hidden sm:table-cell">
										<Badge
											variant="secondary"
											className={`${getStatusColor(tx.status)} border px-2 py-0.5 rounded-md`}
										>
											{tx.status.charAt(0) + tx.status.slice(1).toLowerCase()}
										</Badge>
									</td>
									<td className="px-6 py-4 text-right">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant="ghost"
													size="icon"
													className="h-8 w-8 text-muted-foreground hover:text-foreground"
												>
													<MoreVertical className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem>View Details</DropdownMenuItem>
												<DropdownMenuItem>
													<Download className="mr-2 h-4 w-4" /> Download Receipt
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
