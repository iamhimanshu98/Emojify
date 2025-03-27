import React from 'react';
import {
  Smile,
  Frown,
  Meh,
  AlertTriangle,
  Heart,
  Zap,
  Droplet,
  Brain,
} from 'lucide-react';
import type { ModelType } from '../utils/types';

interface EmotionDisplayProps {
  emotion: string | null;
  confidence: number | null;
  modelType: ModelType;
}

export function EmotionDisplay({ emotion, confidence, modelType }: EmotionDisplayProps) {
  const [emoji, setEmoji] = React.useState<JSX.Element | null>(null);
  const [color, setColor] = React.useState('text-gray-400');
  const [description, setDescription] = React.useState('');

  React.useEffect(() => {
    if (!emotion) {
      setEmoji(null);
      setColor('text-gray-400');
      setDescription('');
      return;
    }

    switch (emotion.toLowerCase()) {
      case 'happy':
        setEmoji(<Smile className="w-full h-full" />);
        setColor('text-yellow-500');
        setDescription('You seem happy and joyful!');
        break;
      case 'sad':
        setEmoji(<Frown className="w-full h-full" />);
        setColor('text-blue-500');
        setDescription('You appear to be feeling sad.');
        break;
      case 'angry':
        setEmoji(<AlertTriangle className="w-full h-full" />);
        setColor('text-red-500');
        setDescription('You seem angry or upset.');
        break;
      case 'surprised':
      case 'surprise':
        setEmoji(<Zap className="w-full h-full" />);
        setColor('text-purple-500');
        setDescription('You look surprised!');
        break;
      case 'fear':
        setEmoji(<Droplet className="w-full h-full" />);
        setColor('text-indigo-500');
        setDescription('You appear to be feeling fearful.');
        break;
      case 'disgust':
        setEmoji(<AlertTriangle className="w-full h-full" />);
        setColor('text-green-500');
        setDescription('You seem disgusted.');
        break;
      case 'neutral':
        setEmoji(<Meh className="w-full h-full" />);
        setColor('text-gray-500');
        setDescription('You appear neutral.');
        break;
      default:
        setEmoji(<Heart className="w-full h-full" />);
        setColor('text-pink-500');
        setDescription(`Detected: ${emotion}`);
    }
  }, [emotion]);

  if (!emotion) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-gray-700 rounded-lg">
        <Meh className="w-16 h-16 text-gray-500" />
        <h3 className="mt-4 text-xl font-bold">No Emotion Detected</h3>
        <p className="text-gray-400 text-center">
          Try uploading a clearer image or adjusting lighting.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-5 h-5 text-purple-500" />
        <span className="text-sm text-purple-400">
          Using {modelType === 'tensorflow' ? 'TensorFlow' : 'DeepFace'} Model
        </span>
      </div>
      <div className={`w-32 h-32 mb-4 ${color}`}>{emoji}</div>
      <h2 className="text-2xl font-bold mb-2 capitalize">{emotion}</h2>
      <p className="text-gray-400 mb-4">{description}</p>
      {confidence !== null && (
        <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
          <div
            className="bg-indigo-600 h-4 rounded-full"
            style={{ width: `${confidence * 100}%` }}
          ></div>
        </div>
      )}
      {confidence !== null && (
        <p className="text-gray-400">
          Accuracy: {(confidence * 100).toFixed(1)}%
        </p>
      )}
    </div>
  );
}