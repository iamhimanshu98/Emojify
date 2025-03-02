import { useState, useRef, useCallback } from "react";
import { Camera, RefreshCw } from "lucide-react";

interface WebcamCaptureProps {
  onCapture: (imageData: string) => void;
}

export function WebcamCapture({ onCapture }: WebcamCaptureProps) {
  const [isStreaming, setIsStreaming] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startWebcam = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreaming(true);
      }
    } catch (err) {
      console.error("Error accessing webcam:", err);
    }
  }, []);

  const stopWebcam = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setIsStreaming(false);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  }, []);

  const captureImage = useCallback(() => {
    if (!videoRef.current || !isStreaming) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL("image/jpeg");
      onCapture(imageData);
    }
  }, [onCapture, isStreaming]);

  const resetWebcam = useCallback(() => {
    stopWebcam();
    startWebcam();
  }, [startWebcam, stopWebcam]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full h-[400px] bg-gray-900 rounded-lg overflow-hidden mb-4">
        {!isStreaming ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-gray-400 mb-4">Webcam is not active</p>
            <button
              onClick={startWebcam}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
            >
              <Camera size={20} />
              Start Webcam
            </button>
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="flex gap-4">
        <button
          onClick={captureImage}
          disabled={!isStreaming}
          className={`flex-1 py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors ${
            isStreaming
              ? "bg-indigo-600 hover:bg-indigo-700 text-white"
              : "bg-gray-700 text-gray-400"
          }`}
        >
          <Camera size={20} />
          Capture
        </button>
        {isStreaming && (
          <button
            onClick={resetWebcam}
            className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <RefreshCw size={20} />
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
