interface Window {
  SpeechRecognition: typeof SpeechRecognition;
  webkitSpeechRecognition: typeof SpeechRecognition;
}

interface Activity {
  title: string;
  description: string;
  time: number;
}

interface WebcamCaptureProps {
  onCapture: (imageData: string) => void;
}

interface FileUploadProps {
  onUpload: (imageData: string) => void;
}
