import { Button } from '@/components/ui/button';
import { Plus, Filter } from 'lucide-react';

export function CalendarHeader() {
	return (
		<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
			<div>
				<h1 className="text-3xl font-bold tracking-tight text-gray-900">
					Schedule & Availability
				</h1>
				<p className="text-muted-foreground mt-1">
					Manage event center availability and bookings
				</p>
			</div>
			<div className="flex gap-3">
				<Button variant="outline" className="gap-2 bg-white h-10 px-4">
					<Filter className="h-4 w-4" />
					Filters
				</Button>
				<Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm h-10 px-6 font-medium gap-2">
					<Plus className="h-4 w-4" />
					Add Booking
				</Button>
			</div>
		</div>
	);
}
