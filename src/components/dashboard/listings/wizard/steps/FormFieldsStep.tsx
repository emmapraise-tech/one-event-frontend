import { ListingFormData, FormField } from '@/types/listing';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, GripVertical, Type, List } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

interface FormFieldsStepProps {
	formData: ListingFormData;
	updateFormData: (data: Partial<ListingFormData>) => void;
	onNext: () => void;
	onBack: () => void;
	isFirstStep?: boolean;
	isLastStep?: boolean;
}

export function FormFieldsStep({
	formData,
	updateFormData,
	onNext,
	onBack,
}: FormFieldsStepProps) {
	const addField = () => {
		const newField: FormField = {
			id: Math.random().toString(36).substr(2, 9),
			type: 'text',
			label: '',
			required: false,
		};
		updateFormData({
			formFields: [...(formData.formFields || []), newField],
		});
	};

	const removeField = (id: string) => {
		updateFormData({
			formFields: formData.formFields.filter((f) => f.id !== id),
		});
	};

	const updateField = (id: string, updates: Partial<FormField>) => {
		updateFormData({
			formFields: formData.formFields.map((f) =>
				f.id === id ? { ...f, ...updates } : f
			),
		});
	};

	return (
		<div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
			<div>
				<h2 className="text-2xl font-black text-gray-900 tracking-tight">
					Additional Information
				</h2>
				<p className="text-gray-500 mt-2 font-medium">
					Add specific questions or requests for information from customers
					booking this listing.
				</p>
			</div>

			<div className="space-y-4">
				{formData.formFields?.map((field, index) => (
					<div
						key={field.id}
						className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 relative group"
					>
						<div className="pt-2 text-gray-400 cursor-move">
							<GripVertical className="h-5 w-5" />
						</div>

						<div className="flex-1 grid gap-4 sm:grid-cols-[1fr_200px] items-start">
							<div className="space-y-2">
								<Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
									Field Label
								</Label>
								<Input
									placeholder="e.g. What is your theme color?"
									value={field.label}
									onChange={(e) =>
										updateField(field.id, { label: e.target.value })
									}
									className="bg-white border-white focus:border-brand-blue"
								/>
							</div>

							<div className="space-y-2">
								<Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
									Field Type
								</Label>
								<Select
									value={field.type}
									onValueChange={(val: any) =>
										updateField(field.id, { type: val })
									}
								>
									<SelectTrigger className="bg-white border-white">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="text">Short Text</SelectItem>
										<SelectItem value="textarea">Long Text</SelectItem>
										<SelectItem value="date">Date picker</SelectItem>
										<SelectItem value="number">Number</SelectItem>
										<SelectItem value="color">Color picker</SelectItem>
										<SelectItem value="checkbox">Checkbox</SelectItem>
										<SelectItem value="radio">Radio Buttons</SelectItem>
										<SelectItem value="select">Dropdown Select</SelectItem>
										<SelectItem value="image">Image Upload</SelectItem>
										<SelectItem value="file">Document/File Upload</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="sm:col-span-2 space-y-4">
								{(field.type === 'radio' || field.type === 'select') && (
									<div className="space-y-2">
										<Label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
											<List className="h-3 w-3" />
											Options (one per line)
										</Label>
										<Textarea
											placeholder="Enter options..."
											value={field.options?.join('\n') || ''}
											onChange={(e) =>
												updateField(field.id, {
													options: e.target.value
														.split('\n')
														.filter((o) => o.trim() !== ''),
												})
											}
											className="bg-white border-white focus:border-brand-blue min-h-[100px] rounded-xl shadow-sm"
										/>
									</div>
								)}

								<div className="flex items-center gap-2 pt-2">
									<Switch
										checked={field.required}
										onCheckedChange={(checked: boolean) =>
											updateField(field.id, { required: checked })
										}
										id={`required-${field.id}`}
									/>
									<Label
										htmlFor={`required-${field.id}`}
										className="text-sm font-medium text-gray-600 cursor-pointer"
									>
										Required field
									</Label>
								</div>
							</div>
						</div>

						<Button
							variant="ghost"
							size="icon"
							onClick={() => removeField(field.id)}
							className="text-gray-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2 sm:relative sm:top-0 sm:right-0 sm:opacity-100"
						>
							<Trash2 className="h-4 w-4" />
						</Button>
					</div>
				))}

				{(!formData.formFields || formData.formFields.length === 0) && (
					<div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-3xl">
						<div className="mx-auto w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
							<Plus className="h-6 w-6 text-gray-400" />
						</div>
						<h3 className="text-sm font-bold text-gray-900 mb-1">
							No custom fields yet
						</h3>
						<p className="text-sm text-gray-500 mb-4">
							Click below to add questions for your customers.
						</p>
						<Button
							variant="outline"
							onClick={addField}
							className="rounded-xl border-dashed border-2 hover:bg-gray-50"
						>
							<Plus className="h-4 w-4 mr-2" />
							Add First Field
						</Button>
					</div>
				)}

				{formData.formFields && formData.formFields.length > 0 && (
					<Button
						variant="outline"
						onClick={addField}
						className="w-full border-dashed border-2 hover:bg-gray-50 h-12 rounded-2xl text-brand-blue border-brand-blue/20 hover:border-brand-blue/40"
					>
						<Plus className="h-4 w-4 mr-2" />
						Add Another Field
					</Button>
				)}
			</div>

			<div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-8">
				<Button
					variant="ghost"
					onClick={onBack}
					className="text-gray-500 hover:text-gray-900 hover:bg-gray-100 h-12 px-6 rounded-xl font-bold"
				>
					Back
				</Button>
				<Button
					onClick={onNext}
					// className="bg-gray-900 hover:bg-gray-800 text-white h-12 px-8 rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-gray-200"
					// className=" hover:bg-blue-700 w-full sm:w-auto bg-brand-blue text-white shadow-sm"
				>
					Continue
				</Button>
			</div>
		</div>
	);
}
