import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
	title: string;
	value: string;
	trend: string;
	trendUp: boolean;
	icon: LucideIcon;
	iconColorClass?: string;
	bgColorClass?: string;
}

export function StatsCard({
	title,
	value,
	trend,
	trendUp,
	icon: Icon,
	iconColorClass = 'text-primary-blue',
	bgColorClass = 'bg-primary-soft-blue',
}: StatsCardProps) {
	return (
		<Card className="shadow-sm border-neutral-100">
			<CardContent className="p-6">
				<div className="flex justify-between items-start mb-4">
					<span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
						{title}
					</span>
					<div className={cn('p-2 rounded-lg', bgColorClass)}>
						<Icon className={cn('h-4 w-4', iconColorClass)} />
					</div>
				</div>

				<div className="flex items-baseline gap-2 mb-1">
					<h3 className="text-2xl font-bold text-neutral-900">{value}</h3>
					<span
						className={cn(
							'text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center',
							trendUp
								? 'bg-green-100 text-green-700'
								: 'bg-red-100 text-red-700'
						)}
					>
						{trendUp ? '↑' : '↓'} {trend}
					</span>
				</div>
				<p className="text-xs text-neutral-400">vs. last month</p>
			</CardContent>
		</Card>
	);
}
