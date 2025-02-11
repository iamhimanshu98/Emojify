import { useRef, useCallback, useState } from "react";
import { Camera, ImagePlus } from "lucide-react";

interface WebcamCaptureProps {
  onCapture: (image: string) => void;
}

export function WebcamCapture({ onCapture }: WebcamCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);

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
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
        }
        setIsStreaming(true);
      } catch (err) {
        console.error("Error accessing webcam:", err);
      }
    }
  }, [isStreaming]);

  const capturePhoto = useCallback(() => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
  
      if (ctx) {
        // Flip the image horizontally before drawing
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
  
        // Draw the flipped video frame
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
  
        // Convert the canvas to an image
        const imageData = canvas.toDataURL("image/jpeg", 1.0);
        onCapture(imageData);
      }
    }
  }, [onCapture]);
  

  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="w-full max-w-3xl aspect-video">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full scale-x-[-1] rounded-lg shadow-lg bg-gray-900 "
        />
      </div>
      <div className="flex justify-center gap-6 mt-6">
        <button
          onClick={toggleCamera}
          className={`px-6 py-2 rounded-lg transition-colors flex items-center gap-2 ${
            isStreaming
              ? "bg-red-600 hover:bg-red-700"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          <Camera size={20} />
          {isStreaming ? "Stop Camera" : "Start Camera"}
        </button>
        {isStreaming && (
          <button
            onClick={capturePhoto}
            className="px-6 py-2 rounded-lg transition-colors flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            <ImagePlus size={20} />
            Capture
          </button>
        )}
      </div>
    </div>
  );
}
