import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { ChatInput } from './ChatInput';
import { ChatMessage } from './ChatMessage';
import { ChatPrompts } from './ChatPrompts';
import { MoodFacts } from './MoodFacts';

// Define the prop types
interface ChatSectionProps {
  emotion: string | null;
  onSendMessage: (message: string) => void;
  chatMessages: { text: string; sender: string }[];
  showChatbot: boolean;
  setShowChatbot: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ChatSection({
  emotion,
  onSendMessage,
  chatMessages,
  showChatbot,
  setShowChatbot,
}: ChatSectionProps) {
  const [userInput, setUserInput] = useState('');

  const handlePromptClick = (promptText: string) => {
    setUserInput(promptText);
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
      <div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6 cursor-pointer"
        onClick={() => setShowChatbot(!showChatbot)}
      >
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white">
          Need more suggestions?
        </h2>
        <button className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 sm:py-3 px-4 sm:px-6 rounded transition duration-300 text-sm sm:text-base w-full sm:w-auto justify-center sm:justify-start">
          <MessageSquare className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
          {showChatbot ? 'Hide Chat' : 'Open Chat'}
        </button>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          showChatbot ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="border border-gray-700 rounded-lg">
          <div className="h-64 sm:h-80 md:h-96 overflow-y-auto p-3 sm:p-4 md:p-6 bg-gray-900 custom-scrollbar">
            {chatMessages.length === 0 ? (
              <div className="text-center text-gray-500 mt-4 sm:mt-6 md:mt-8 mb-5 sm:mb-8 md:mb-10">
                <MessageSquare className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 mx-auto mb-3 sm:mb-4 opacity-50" />
                <p className="mb-4 sm:mb-6 md:mb-8 text-sm sm:text-base md:text-lg">
                  Ask for personalized activity suggestions based on your mood!
                </p>
                <ChatPrompts onPromptClick={handlePromptClick} currentEmotion={emotion} />
              </div>
            ) : (
              <>
                <div className="space-y-3 sm:space-y-4 md:space-y-5 mb-4 sm:mb-5 md:mb-6">
                  {chatMessages.map((msg, index) => (
                    <ChatMessage
                      key={index}
                      text={msg.text}
                      sender={msg.sender as 'user' | 'ai'}
                    />
                  ))}
                </div>
                <ChatPrompts onPromptClick={handlePromptClick} currentEmotion={emotion} />
              </>
            )}
          </div>

          <ChatInput
            onSendMessage={onSendMessage}
            userInput={userInput}
            setUserInput={setUserInput}
          />
        </div>

        <MoodFacts emotion={emotion} />
      </div>
    </div>
  );
}
