'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
} from 'recharts';

const data = [
	{ date: 'May 01', value: 2000 },
	{ date: 'May 05', value: 3500 },
	{ date: 'May 08', value: 2800 },
	{ date: 'May 12', value: 4500 },
	{ date: 'May 15', value: 3200 },
	{ date: 'May 18', value: 5200 },
	{ date: 'May 22', value: 4800 },
	{ date: 'May 25', value: 6000 },
	{ date: 'May 29', value: 5500 },
];

export function RevenueChart() {
	return (
		<Card className="shadow-sm border-neutral-100 h-full">
			<CardHeader className="flex flex-row items-center justify-between pb-2">
				<div className="space-y-1">
					<CardTitle className="text-base font-bold text-neutral-900">
						Revenue Trends
					</CardTitle>
					<p className="text-xs text-neutral-500">
						Income performance over time
					</p>
				</div>
				<Select defaultValue="30days">
					<SelectTrigger className="w-[120px] h-8 text-xs bg-neutral-50 border-neutral-200">
						<SelectValue placeholder="Period" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="7days">Last 7 Days</SelectItem>
						<SelectItem value="30days">Last 30 Days</SelectItem>
						<SelectItem value="90days">Last 3 months</SelectItem>
					</SelectContent>
				</Select>
			</CardHeader>
			<CardContent>
				<div className="h-[250px] w-full mt-4">
					<ResponsiveContainer width="100%" height="100%">
						<AreaChart
							data={data}
							margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
						>
							<defs>
								<linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
									<stop offset="5%" stopColor="#1E3A8A" stopOpacity={0.1} />
									<stop offset="95%" stopColor="#1E3A8A" stopOpacity={0} />
								</linearGradient>
							</defs>
							<CartesianGrid
								vertical={false}
								strokeDasharray="0"
								stroke="#F5F5F5"
							/>
							<XAxis
								dataKey="date"
								axisLine={false}
								tickLine={false}
								tick={{ fill: '#737373', fontSize: 10 }}
								tickMargin={15}
							/>
							<Tooltip
								contentStyle={{
									borderRadius: '8px',
									border: '1px solid #E5E5E5',
									boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
								}}
								cursor={{
									stroke: '#1E3A8A',
									strokeWidth: 1,
									strokeDasharray: '4 4',
								}}
							/>
							<Area
								type="monotone"
								dataKey="value"
								stroke="#1E3A8A"
								strokeWidth={2}
								fillOpacity={1}
								fill="url(#colorValue)"
								dot={{ r: 4, fill: 'white', stroke: '#1E3A8A', strokeWidth: 2 }}
								activeDot={{
									r: 6,
									fill: '#1E3A8A',
									stroke: 'white',
									strokeWidth: 2,
								}}
							/>
						</AreaChart>
					</ResponsiveContainer>
				</div>
			</CardContent>
		</Card>
	);
}
