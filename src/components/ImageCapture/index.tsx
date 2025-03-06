import { useState } from 'react';
import { Camera, Upload } from 'lucide-react';
import { WebcamCapture } from './WebcamCapture';
import { FileUpload } from './FileUpload';

interface ImageCaptureProps {
  onImageCapture: (imageData: string) => void;
}

export function ImageCapture({ onImageCapture }: ImageCaptureProps) {
  const [mode, setMode] = useState<'webcam' | 'upload'>('webcam');

  const buttonStyles =
    'flex items-center gap-2 px-6 py-3 rounded-lg text-lg transition-colors';

  return (
    <div className="bg-gray-800/50 p-6 rounded-lg shadow-lg">
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <button
          onClick={() => setMode('webcam')}
          className={`${buttonStyles} ${
            mode === 'webcam'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          <Camera className="w-6 h-6" /> Webcam
        </button>
        <button
          onClick={() => setMode('upload')}
          className={`${buttonStyles} ${
            mode === 'upload'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          <Upload className="w-6 h-6" /> Upload Photo
        </button>
      </div>
      <div className="w-full">
        {mode === 'webcam' ? (
          <WebcamCapture onCapture={onImageCapture} />
        ) : (
          <FileUpload onUpload={onImageCapture} />
        )}
      </div>
    </div>
  );
}
