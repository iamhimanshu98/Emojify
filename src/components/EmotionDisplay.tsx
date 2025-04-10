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
        setEmoji(<Smile className="w-24 h-24" />);
        setColor('text-yellow-400');
        setDescription('You seem happy and joyful!');
        break;
      case 'sad':
        setEmoji(<Frown className="w-24 h-24" />);
        setColor('text-blue-400');
        setDescription('You appear to be feeling sad.');
        break;
      case 'angry':
        setEmoji(<AlertTriangle className="w-24 h-24" />);
        setColor('text-red-400');
        setDescription('You seem angry or upset.');
        break;
      case 'surprised':
      case 'surprise':
        setEmoji(<Zap className="w-24 h-24" />);
        setColor('text-purple-400');
        setDescription('You look surprised!');
        break;
      case 'fear':
        setEmoji(<Droplet className="w-24 h-24" />);
        setColor('text-indigo-400');
        setDescription('You appear to be feeling fearful.');
        break;
      case 'disgust':
        setEmoji(<AlertTriangle className="w-24 h-24" />);
        setColor('text-green-400');
        setDescription('You seem disgusted.');
        break;
      case 'neutral':
        setEmoji(<Meh className="w-24 h-24" />);
        setColor('text-gray-500');
        setDescription('You appear neutral.');
        break;
      default:
        setEmoji(<Heart className="w-24 h-24" />);
        setColor('text-pink-400');
        setDescription(`Detected: ${emotion}`);
    }
  }, [emotion]);

  if (!emotion) {
    return (
      <div className="flex flex-col items-center justify-center bg-gray-800 p-6 rounded-xl shadow-lg space-y-4 w-full h-64 max-w-md">
        <Meh className="w-16 h-16 text-gray-500" />
        <h3 className="text-xl font-semibold text-white">No Emotion Detected</h3>
        <p className="text-sm text-gray-400 text-center">
          Try uploading a clearer image or adjusting lighting.
        </p>
      </div>
    );
  }

  return (<div className="bg-gray-900 p-12 rounded-3xl shadow-2xl flex flex-col justify-center items-center space-y-8 text-white">  
    <div className="flex items-center gap-4 text-lg text-purple-400">  
      <Brain className="w-8 h-8" />  
      <span>  
        <span className="font-semibold">Using {modelType === 'tensorflow' ? 'TensorFlow' : 'DeepFace'} model</span>  
      </span>  
    </div>  
  
    <div className={`flex items-center justify-center ${color}`}>  
      {emoji}  
    </div>  
  
    <h2 className="text-3xl font-bold capitalize">{emotion}</h2>  
    <p className="text-lg text-gray-300 text-center">{description}</p>  
  
    {confidence !== null && (  
      <div className="w-full space-y-3">  
        <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">  
          <div  
            className="bg-indigo-500 h-4 transition-all duration-500"  
            style={{ width: `${confidence * 100}%` }}  
          ></div>  
        </div>  
        <p className="text-lg text-gray-400 text-center">  
          Accuracy: {(confidence * 100).toFixed(1)}%  
        </p>  
      </div>  
    )}  
  </div>
  );
}
