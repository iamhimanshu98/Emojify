import { useState, useCallback } from "react";
import { Upload, File, X } from "lucide-react";

interface FileUploadProps {
  onUpload: (imageData: string) => void;
}

export function FileUpload({ onUpload }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.match("image.*")) {
        alert("Please select an image file");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          setPreview(result);
          onUpload(result);
        }
      };
      reader.readAsDataURL(file);
    },
    [onUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0]);
      }
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        handleFile(e.target.files[0]);
      }
    },
    [handleFile]
  );

  const clearPreview = useCallback(() => {
    setPreview(null);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div
        className={`relative w-full h-[500px] border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-8 transition-colors ${
          isDragging
            ? "border-indigo-500 bg-indigo-900/20"
            : "border-gray-600 hover:border-gray-500 bg-gray-800/50"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {preview ? (
          <div className="relative w-full h-full">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-contain"
            />
            <button
              onClick={clearPreview}
              className="absolute top-3 right-3 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        ) : (
          <>
            <Upload className="w-24 h-24 text-gray-500 mb-6" />
            <p className="text-2xl font-medium text-gray-300 mb-3">
              Drag & Drop your image here
            </p>
            <p className="text-lg text-gray-500 mb-8">
              Supports: JPG, PNG, JPEG
            </p>
            <label className="bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-medium py-4 px-8 rounded-lg transition-colors cursor-pointer flex items-center gap-3">
              <File size={24} />
              Browse Files
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileInput}
              />
            </label>
          </>
        )}
      </div>
    </div>
  );
}
