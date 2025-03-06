import { Lightbulb, Music, Clock } from 'lucide-react';

interface ChatPromptsProps {
  onPromptClick: (prompt: string) => void;
  currentEmotion: string | null;
}

export function ChatPrompts({ onPromptClick, currentEmotion }: ChatPromptsProps) {
  const getEmotionBasedPrompts = () => {
    const basePrompts = [
      {
        text: `Tell me interesting facts about ${currentEmotion || 'my current mood'}`,
        icon: <Lightbulb size={16} />,
      },
      {
        text: `Suggest music that matches ${currentEmotion ? `my ${currentEmotion} mood` : 'how I\'m feeling'}`,
        icon: <Music size={16} />,
      },
      {
        text: currentEmotion 
          ? `What activities would help with my ${currentEmotion} mood?`
          : 'What activities would help improve my mood?',
        icon: <Clock size={16} />,
      },
    ];

    // Add emotion-specific prompts
    if (currentEmotion) {
      switch (currentEmotion.toLowerCase()) {
        case 'sad':
          basePrompts.push({
            text: 'How can I lift my spirits when feeling down?',
            icon: <Lightbulb size={16} />,
          });
          break;
        case 'angry':
          basePrompts.push({
            text: 'Share some calming techniques for anger',
            icon: <Lightbulb size={16} />,
          });
          break;
        case 'happy':
          basePrompts.push({
            text: 'How can I spread positivity to others?',
            icon: <Lightbulb size={16} />,
          });
          break;
        // Add more emotion-specific prompts as needed
      }
    }

    return basePrompts;
  };

  const prompts = getEmotionBasedPrompts();

  return (
    <div className="flex flex-wrap gap-2 sm:gap-3 mt-3 sm:mt-4 md:mt-6">
      {prompts.map((prompt, idx) => (
        <button
          key={idx}
          onClick={() => onPromptClick(prompt.text)}
          className="flex items-center gap-1 sm:gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full text-xs sm:text-sm transition-colors"
        >
          <span className="text-indigo-400">{prompt.icon}</span>
          {prompt.text}
        </button>
      ))}
    </div>
  );
}