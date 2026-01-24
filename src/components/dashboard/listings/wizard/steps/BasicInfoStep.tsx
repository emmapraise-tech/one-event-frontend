import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { ListingType } from '@/types/listing';
import { FileText } from 'lucide-react';
import { ListingFormData } from '@/types/listing';

interface StepProps {
	formData: ListingFormData;
	updateFormData: (data: Partial<ListingFormData>) => void;
	onNext: () => void;
	onBack: () => void;
	isFirstStep: boolean;
	isLastStep: boolean;
}

export function BasicInfoStep({ formData, updateFormData, onNext }: StepProps) {
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onNext();
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div className="flex items-center gap-2 mb-6">
				<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
					<FileText className="h-5 w-5" />
				</div>
				<h2 className="text-lg font-semibold">Basic Details</h2>
			</div>

			<div className="space-y-6">
				<div className="grid gap-3">
					<Label
						htmlFor="title"
						className="text-base font-medium text-gray-700"
					>
						Venue Name
					</Label>
					<Input
						id="title"
						placeholder="e.g. Grand Imperial Ballroom"
						value={formData.title}
						onChange={(e) => updateFormData({ title: e.target.value })}
						required
						className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 text-base"
					/>
				</div>

				<div className="grid gap-6 sm:grid-cols-2">
					<div className="grid gap-3">
						<Label
							htmlFor="type"
							className="text-base font-medium text-gray-700"
						>
							Venue Type
						</Label>
						<Select
							value={formData.type}
							onValueChange={(value) =>
								updateFormData({ type: value as ListingType })
							}
						>
							<SelectTrigger className="h-12 border-gray-200 focus:ring-blue-500/20 text-base">
								<SelectValue placeholder="Select type" />
							</SelectTrigger>
							<SelectContent>
								{Object.values(ListingType).map((type) => (
									<SelectItem key={type} value={type}>
										{type}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="grid gap-3">
						{/* Placeholder for Host Name - in real app might come from auth context or be editable */}
						<Label
							htmlFor="hostName"
							className="text-base font-medium text-gray-700"
						>
							Host Name
						</Label>
						<Input
							id="hostName"
							placeholder="Jane Doe"
							defaultValue="Jane Doe"
							readOnly
							className="h-12 border-gray-200 bg-gray-50/50 text-gray-500 cursor-not-allowed"
						/>
					</div>
				</div>

				<div className="grid gap-3">
					<div className="flex items-center justify-between">
						<Label
							htmlFor="description"
							className="text-base font-medium text-gray-700"
						>
							Description
						</Label>
						<div className="flex gap-2">
							{/* Formatting tools mock */}
							<Button
								variant="ghost"
								size="sm"
								className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
							>
								<span className="font-bold font-serif">B</span>
							</Button>
							<Button
								variant="ghost"
								size="sm"
								className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
							>
								<span className="italic font-serif">I</span>
							</Button>
							<Button
								variant="ghost"
								size="sm"
								className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
							>
								<span className="underline">U</span>
							</Button>
						</div>
					</div>
					<div className="relative">
						<Textarea
							id="description"
							placeholder="Describe the ambiance, unique features, and suitability for events..."
							className="min-h-[160px] border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 text-base resize-none p-4"
							value={formData.description}
							onChange={(e) => updateFormData({ description: e.target.value })}
						/>
						<div className="absolute bottom-3 right-3 text-xs text-gray-400 font-medium">
							{formData.description.length} / 5000 characters
						</div>
					</div>
				</div>
			</div>

			<div className="flex justify-end pt-4">
				<Button
					type="submit"
					className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
				>
					Continue
				</Button>
			</div>
		</form>
	);
}
