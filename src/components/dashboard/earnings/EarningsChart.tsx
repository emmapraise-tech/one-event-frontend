'use client';

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from '@/components/ui/card';
import {
	Bar,
	BarChart,
	ResponsiveContainer,
	XAxis,
	YAxis,
	Tooltip,
	CartesianGrid,
	TooltipProps,
} from 'recharts';

interface EarningsChartProps {
	data: {
		name: string;
		total: number;
	}[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
	if (active && payload && payload.length) {
		return (
			<div className="rounded-lg border bg-white p-2 shadow-sm text-xs">
				<span className="font-semibold text-gray-900">{label}</span>
				<div className="flex items-center gap-2 mt-1">
					<div className="w-2 h-2 rounded-full bg-primary" />
					<span className="text-muted-foreground">
						Revenue:{' '}
						<span className="font-medium text-foreground">
							₦{payload[0].value?.toLocaleString()}
						</span>
					</span>
				</div>
			</div>
		);
	}
	return null;
};

export function EarningsChart({ data }: EarningsChartProps) {
	return (
		<Card className="shadow-sm border-border/60">
			<CardHeader>
				<CardTitle className="text-base font-semibold">
					Revenue Overview
				</CardTitle>
				<CardDescription>Monthly earnings performance</CardDescription>
			</CardHeader>
			<CardContent className="pl-0">
				<ResponsiveContainer width="100%" height={450}>
					<BarChart data={data}>
						<CartesianGrid
							strokeDasharray="3 3"
							vertical={false}
							stroke="#e5e7eb"
						/>
						<XAxis
							dataKey="name"
							stroke="#888888"
							fontSize={12}
							tickLine={false}
							axisLine={false}
						/>
						<YAxis
							stroke="#888888"
							fontSize={12}
							tickLine={false}
							axisLine={false}
							tickFormatter={(value) => `₦${value}`}
						/>
						<Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb' }} />
						<Bar
							dataKey="total"
							fill="currentColor"
							radius={[4, 4, 0, 0]}
							className="fill-primary"
							barSize={32}
						/>
					</BarChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
}
