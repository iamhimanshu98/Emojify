import { useState, useEffect } from "react";
import { Camera, Upload, AlertCircle, Smile } from "lucide-react";
import { WebcamCapture } from "./components/WebcamCapture";
import { FileUpload } from "./components/FileUpload";
import { EmotionDisplay } from "./components/EmotionDisplay";

const API_URL = "http://localhost:5000";

// Default image from Unsplash (a happy person)
const DEFAULT_IMAGE = "/public/files/boy.jpg";

function App() {
  const [mode, setMode] = useState<"webcam" | "upload">("webcam");
  const [image, setImage] = useState<string | null>(null);
  const [emotion, setEmotion] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadDefaultImage = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const img = new Image();
        img.crossOrigin = "anonymous";

        img.onerror = () => {
          setError("Failed to load default image");
          setIsLoading(false);
        };

        img.onload = async () => {
          try {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");

            if (!ctx) {
              throw new Error("Failed to get canvas context");
            }

            ctx.drawImage(img, 0, 0);
            const base64Image = canvas.toDataURL("image/jpeg");

            setImage(base64Image);
            await analyzeImage(base64Image);
          } catch (err) {
            console.error("Error processing default image:", err);
            setError("Failed to process default image");
          } finally {
            setIsLoading(false);
          }
        };

        img.src = DEFAULT_IMAGE;
      } catch (err) {
        console.error("Error in loadDefaultImage:", err);
        setError("Failed to initialize default image");
        setIsLoading(false);
      }
    };

    loadDefaultImage();
  }, []);

  const analyzeImage = async (imageData: string) => {
    try {
      setIsLoading(true);
      setError(null);
  
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: imageData }),
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to process image");
      }
  
      const data = await response.json();
      setEmotion(data.emotion);
      setConfidence(data.confidence);
    } catch (err) {
      console.error("Error analyzing image:", err);
      setError(err instanceof Error ? err.message : "Failed to detect emotion");
      setEmotion(null);
      setConfidence(null);
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleImage = async (imageData: string) => {
    console.log("Captured Image Data:", imageData); // Debug log
  
    try {
      if (!imageData) {
        throw new Error("No image data received");
      }
  
      setImage(imageData);
      await analyzeImage(imageData);
    } catch (err) {
      console.error("Error handling image:", err);
      setError(err instanceof Error ? err.message : "Failed to process image");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Smile className="w-12 h-12 text-indigo-500" />
            <h1 className="text-5xl pb-2 font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
              Emojify
            </h1>
          </div>
          <p className="text-xl text-gray-400 mb-4">
            Transform your expressions into emotions with AI
          </p>
          <div className="flex flex-col items-center gap-2 text-gray-400 max-w-2xl mx-auto">
            <p className="text-sm">
              Experience real-time emotion detection powered by advanced AI.
              Whether you're using your webcam or uploading a photo, Emojify
              instantly analyzes facial expressions and matches them with the
              perfect emoji.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="font-semibold text-indigo-400 mb-2">
                  Real-time Detection
                </h3>
                <p className="text-xs">
                  Instant emotion analysis through your webcam
                </p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-400 mb-2">
                  Photo Upload
                </h3>
                <p className="text-xs">Upload and analyze photos with ease</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="font-semibold text-pink-400 mb-2">AI Powered</h3>
                <p className="text-xs">
                  Advanced machine learning for accurate results
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setMode("webcam")}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
              mode === "webcam"
                ? "bg-indigo-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            <Camera size={20} />
            Webcam
          </button>
          <button
            onClick={() => setMode("upload")}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
              mode === "upload"
                ? "bg-indigo-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            <Upload size={20} />
            Upload Photo
          </button>
        </div>

        <div className="max-w-8xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              {mode === "webcam" ? (
                <WebcamCapture onCapture={handleImage} />
              ) : (
                <FileUpload onUpload={handleImage} />
              )}
            </div>

            <div className="flex flex-col justify-center">
              {error ? (
                <div className="flex items-center gap-2 text-red-400 bg-red-900/20 p-4 rounded-lg">
                  <AlertCircle size={20} />
                  {error}
                </div>
              ) : (
                <>
                  {image && (
                    <img
                      src={image}
                      alt="Captured"
                      className="w-full rounded-lg shadow-lg mb-4"
                    />
                  )}
                  <EmotionDisplay emotion={emotion} confidence={confidence} />
                </>
              )}
            </div>
          </div>
        </div>

        <footer className="mt-16 text-center text-gray-400 text-sm">
          <p>© 2025 Emojify. All rights reserved.</p>
          <p className="mt-2">Powered by advanced Emotion Detection Model</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
