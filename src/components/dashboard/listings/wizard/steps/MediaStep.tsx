import { Button } from "@/components/ui/button";
import { Image as ImageIcon, Upload, X } from "lucide-react";
import { ListingFormData } from "@/types/listing";
import { cn } from "@/lib/utils";

interface StepProps {
  formData: ListingFormData;
  updateFormData: (data: Partial<ListingFormData>) => void;
  onNext: () => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export function MediaStep({
  formData,
  updateFormData,
  onNext,
  onBack,
}: StepProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      // Create preview URLs
      const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file));

      updateFormData({
        imageFiles: [...(formData.imageFiles || []), ...newFiles],
        imageUrls: [...(formData.imageUrls || []), ...newPreviewUrls],
      });
    }
  };

  const removeImage = (index: number) => {
    const newFiles = [...(formData.imageFiles || [])];
    const newUrls = [...(formData.imageUrls || [])];

    newFiles.splice(index, 1);
    newUrls.splice(index, 1);

    updateFormData({
      imageFiles: newFiles,
      imageUrls: newUrls,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
          <ImageIcon className="h-5 w-5" />
        </div>
        <h2 className="text-lg font-semibold">Media Gallery</h2>
      </div>

      <div className="space-y-8">
        {/* Upload Area */}
        <div className="relative">
          <input
            type="file"
            id="file-upload"
            multiple
            accept="image/*"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            onChange={handleFileChange}
          />
          <div className="border-2 border-dashed border-gray-200 bg-gray-50/50 rounded-2xl p-12 flex flex-col items-center justify-center text-center hover:bg-blue-50/50 hover:border-blue-200 transition-all group">
            <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform duration-300 border-4 border-white shadow-sm">
              <Upload className="h-7 w-7" />
            </div>
            <h3 className="font-bold text-xl mb-2 text-gray-900">
              Click to upload or drag & drop
            </h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
              SVG, PNG, JPG or GIF (max. 800x400px recommended). Max 5MB per
              file.
            </p>
            <Button
              type="button"
              variant="outline"
              className="border-blue-200 text-blue-700 hover:bg-blue-50 pointer-events-none"
            >
              Browse Files
            </Button>
          </div>
        </div>

        {/* Image Grid */}
        {formData.imageUrls && formData.imageUrls.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {formData.imageUrls.map((img, i) => (
              <div
                key={i}
                className="group relative aspect-square rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <img
                  src={img}
                  alt={`Venue ${i + 1}`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="bg-white/90 text-red-500 p-2 rounded-full hover:bg-white hover:scale-110 transition-all"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
            {/* Placeholders to match design */}
            <label
              htmlFor="file-upload"
              className="aspect-square rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <div className="text-center">
                <ImageIcon className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <span className="text-xs font-medium text-gray-400">
                  Add More
                </span>
              </div>
            </label>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {/* Hardcoded placeholders for visual fidelity to design even without uploads */}
            <div className="aspect-square rounded-xl bg-gray-900 flex items-center justify-center overflow-hidden shadow-md">
              {/* Gradient/Image placeholder */}
              <div className="h-full w-full bg-linear-to-b from-amber-700 to-black opacity-80" />
            </div>
            <div className="aspect-square rounded-xl bg-green-900 flex items-center justify-center overflow-hidden shadow-md">
              <div className="h-full w-full bg-linear-to-b from-green-700 to-black opacity-80" />
            </div>
            <div className="aspect-square rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center">
              <ImageIcon className="h-6 w-6 text-gray-300" />
            </div>
            <div className="aspect-square rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center">
              <ImageIcon className="h-6 w-6 text-gray-300" />
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
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
