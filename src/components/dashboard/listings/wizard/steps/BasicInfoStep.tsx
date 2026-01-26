import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ListingCategory } from '@/types/listing';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import { FileText } from 'lucide-react';
import { ListingFormData } from '@/types/listing';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

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

				<div className="grid gap-6 sm:grid-cols-1">
					<Label className="text-base font-medium text-gray-700">
						Category (Select all that apply)
					</Label>
					<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
						{Object.values(ListingCategory).map((category) => {
							const isSelected = formData.categories?.includes(category);
							return (
								<div
									key={category}
									onClick={() => {
										const currentCategories = formData.categories || [];
										const newCategories = isSelected
											? currentCategories.filter((c) => c !== category)
											: [...currentCategories, category];
										updateFormData({ categories: newCategories });
									}}
									className={`
                                            cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 flex flex-col items-center justify-center gap-2 text-center h-24
                                            ${
																							isSelected
																								? 'border-brand-gold bg-brand-gold/5 text-brand-gold-dark font-semibold shadow-sm'
																								: 'border-gray-100 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
																						}
                                        `}
								>
									<span className="text-sm">{category.replace('_', ' ')}</span>
								</div>
							);
						})}
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
					</div>
					<div className="relative">
						<div className="prose-base">
							<ReactQuill
								theme="snow"
								placeholder="Describe the ambiance, unique features, and suitability for events..."
								value={formData.description}
								onChange={(value: string) =>
									updateFormData({ description: value })
								}
								className="bg-white rounded-xl overflow-hidden [&_.ql-toolbar]:border-gray-200 [&_.ql-container]:border-gray-200 [&_.ql-container]:min-h-[160px] [&_.ql-editor]:min-h-[160px] [&_.ql-editor]:text-base"
							/>
						</div>
						<div className="text-xs text-gray-400 font-medium text-right mt-1">
							{formData.description.length} / 5000 characters
						</div>
					</div>
				</div>
			</div>

			<div className="flex justify-end pt-4">
				<Button
					type="submit"
					className="bg-brand-gold hover:bg-brand-gold-hover text-white font-bold px-8 h-12 rounded-xl shadow-lg shadow-orange-200"
				>
					Continue
				</Button>
			</div>
		</form>
	);
}
