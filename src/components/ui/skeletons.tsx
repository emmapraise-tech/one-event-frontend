import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function CardSkeleton() {
	return (
		<Card className="overflow-hidden">
			<Skeleton className="h-48 w-full object-cover" />
			<CardContent className="p-4 space-y-3">
				<Skeleton className="h-4 w-3/4" />
				<Skeleton className="h-3 w-1/2" />
				<div className="flex gap-2 pt-2">
					<Skeleton className="h-6 w-16 rounded-full" />
					<Skeleton className="h-6 w-16 rounded-full" />
				</div>
			</CardContent>
		</Card>
	);
}

export function TableSkeleton({
	columns = 4,
	rows = 5,
}: {
	columns?: number;
	rows?: number;
}) {
	return (
		<div className="w-full rounded-md border p-4 space-y-4">
			{/* Header Row */}
			<div className="flex gap-4 border-b pb-4">
				{Array.from({ length: columns }).map((_, i) => (
					<Skeleton key={`header-${i}`} className="h-6 w-full max-w-[150px]" />
				))}
			</div>
			{/* Body Rows */}
			{Array.from({ length: rows }).map((_, r) => (
				<div
					key={`row-${r}`}
					className="flex gap-4 py-2 border-b last:border-0 last:pb-0"
				>
					{Array.from({ length: columns }).map((_, c) => (
						<Skeleton
							key={`cell-${r}-${c}`}
							className="h-5 w-full max-w-[150px]"
						/>
					))}
				</div>
			))}
		</div>
	);
}

export function PageHeaderSkeleton() {
	return (
		<div className="space-y-4 py-6">
			<Skeleton className="h-10 w-[250px]" />
			<Skeleton className="h-5 w-[400px]" />
		</div>
	);
}

export function FormSkeleton({ fields = 4 }: { fields?: number }) {
	return (
		<div className="space-y-6 max-w-2xl">
			{Array.from({ length: fields }).map((_, i) => (
				<div key={`field-${i}`} className="space-y-2">
					<Skeleton className="h-4 w-24" />
					<Skeleton className="h-10 w-full" />
				</div>
			))}
			<Skeleton className="h-12 w-32 mt-8" />
		</div>
	);
}

export function ListingDetailSkeleton() {
	return (
		<div className="min-h-screen bg-neutral-bg pb-10">
			<div className="container mx-auto px-4 pt-6 pb-12">
				{/* Breadcrumbs */}
				<div className="flex items-center gap-2 mb-4">
					<Skeleton className="h-4 w-16" />
					<Skeleton className="h-4 w-16" />
					<Skeleton className="h-4 w-48" />
				</div>

				{/* Title Header */}
				<div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
					<Skeleton className="h-10 w-3/4 md:w-1/2" />
					<div className="flex gap-3">
						<Skeleton className="h-10 w-24" />
						<Skeleton className="h-10 w-24" />
					</div>
				</div>

				{/* Image Grid */}
				<div className="relative grid gap-2 overflow-hidden rounded-xl md:grid-cols-2 md:h-[400px] mb-8">
					<Skeleton className="h-[300px] md:h-full w-full" />
					<div className="hidden md:grid grid-cols-2 gap-2">
						<Skeleton className="h-full w-full" />
						<Skeleton className="h-full w-full" />
						<Skeleton className="h-full w-full" />
						<Skeleton className="h-full w-full" />
					</div>
				</div>

				<div className="grid gap-8 lg:grid-cols-3">
					{/* Main Content */}
					<div className="lg:col-span-2 space-y-8">
						<div className="flex items-center justify-between pb-6 border-b border-neutral-200">
							<div className="space-y-2">
								<Skeleton className="h-6 w-64" />
								<Skeleton className="h-4 w-48" />
							</div>
							<Skeleton className="h-14 w-14 rounded-full" />
						</div>

						<div className="space-y-4">
							<Skeleton className="h-8 w-48 mb-4" />
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-3/4" />
						</div>
					</div>

					{/* Right Sidebar Booking Widget Mock */}
					<div className="hidden lg:block">
						<Card className="p-6 space-y-6">
							<Skeleton className="h-8 w-32" />
							<Skeleton className="h-12 w-full" />
							<div className="flex gap-2">
								<Skeleton className="h-14 w-full" />
								<Skeleton className="h-14 w-full" />
							</div>
							<Skeleton className="h-32 w-full" />
							<Skeleton className="h-12 w-full" />
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
