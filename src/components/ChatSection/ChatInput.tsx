import { useState, useRef } from 'react';
import { Mic, Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  userInput: string;
  setUserInput: (input: string) => void;
}

export function ChatInput({ onSendMessage, userInput, setUserInput }: ChatInputProps) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const startListening = () => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        
        setUserInput(transcript);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current.start();
      setIsListening(true);
    } else {
      alert('Speech recognition is not supported in your browser.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim()) {
      onSendMessage(userInput.trim());
      setUserInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex border-t border-gray-700">
      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Type your message or use voice input..."
        className="flex-grow p-2 sm:p-3 md:p-4 bg-gray-800 text-white focus:outline-none text-sm sm:text-base md:text-lg"
      />
      <button
        type="button"
        onClick={isListening ? stopListening : startListening}
        className={`px-4 transition-colors ${
          isListening ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
        }`}
      >
        <Mic className={`w-5 h-5 ${isListening ? 'animate-pulse' : ''}`} />
      </button>
      <button
        type="submit"
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 sm:px-4 md:px-6 text-sm sm:text-base flex items-center"
      >
        <Send className="w-5 h-5" />
      </button>
    </form>
  );
}