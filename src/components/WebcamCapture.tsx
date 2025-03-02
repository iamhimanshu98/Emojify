import { useRef, useCallback, useState } from "react";
import { Camera, ImagePlus, AlertCircle } from "lucide-react";

interface WebcamCaptureProps {
  onCapture: (image: string) => void;
}

export function WebcamCapture({ onCapture }: WebcamCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleCamera = useCallback(async () => {
    if (isStreaming) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
        streamRef.current = null;
      }
      setIsStreaming(false);
      setError(null);
    } else {
      try {
        setError(null);
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
        }
        setIsStreaming(true);
      } catch (err) {
        console.error("Error accessing webcam:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Could not access camera. Please ensure you have granted camera permissions."
        );
      }
    }
  }, [isStreaming]);

  const capturePhoto = useCallback(() => {
    if (videoRef.current) {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          throw new Error("Could not get canvas context");
        }

        // Flip the image horizontally
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);

        // Draw the flipped video frame
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        // Convert the canvas to an image
        const imageData = canvas.toDataURL("image/jpeg", 1.0);
        onCapture(imageData);
        setError(null);
      } catch (err) {
        console.error("Error capturing photo:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to capture photo. Please try again."
        );
      }
    }
  }, [onCapture]);

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="w-full max-w-4xl aspect-video relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full scale-x-[-1] rounded-lg shadow-lg bg-gray-900 border border-gray-700"
        />
        {error && (
          <div className="absolute top-4 left-4 right-4 flex items-center gap-2 text-red-400 bg-red-900/20 p-4 rounded-lg">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}
      </div>
      <div className="flex justify-center flex-wrap gap-6 mt-6 w-full max-w-4xl">
        {isStreaming && (
          <button
            onClick={capturePhoto}
            className="px-6 py-3 rounded-lg transition-colors flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-lg"
          >
            <ImagePlus size={28} />
            Capture
          </button>
        )}
        <button
          onClick={toggleCamera}
          className={`px-6 py-3 rounded-lg transition-colors flex items-center gap-2 text-lg ${
            isStreaming
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-indigo-600 hover:bg-indigo-700 text-white"
          }`}
        >
          <Camera size={28} />
          {isStreaming ? "Stop Camera" : "Start Camera"}
        </button>
      </div>
    </div>
  );
}
