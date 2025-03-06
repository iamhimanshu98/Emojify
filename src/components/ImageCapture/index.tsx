import { useState } from 'react';
import { Camera, Upload } from 'lucide-react';
import { WebcamCapture } from './WebcamCapture';
import { FileUpload } from './FileUpload';

interface ImageCaptureProps {
  onImageCapture: (imageData: string) => void;
}

export function ImageCapture({ onImageCapture }: ImageCaptureProps) {
  const [mode, setMode] = useState<"webcam" | "upload">("webcam");

  return (
    <div className="bg-gray-800/50 p-4 sm:p-6 md:p-8 rounded-lg shadow-lg">
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 mb-6">
        <button
          onClick={() => setMode("webcam")}
          className={`flex items-center gap-2 px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-lg text-sm sm:text-base md:text-lg transition-colors ${
            mode === "webcam"
              ? "bg-indigo-600 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          <Camera className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          Webcam
        </button>
        <button
          onClick={() => setMode("upload")}
          className={`flex items-center gap-2 px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-lg text-sm sm:text-base md:text-lg transition-colors ${
            mode === "upload"
              ? "bg-indigo-600 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          <Upload className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          Upload Photo
        </button>
      </div>

      <div className="w-full">
        {mode === "webcam" ? (
          <WebcamCapture onCapture={onImageCapture} />
        ) : (
          <FileUpload onUpload={onImageCapture} />
        )}
      </div>
    </div>
  );
}