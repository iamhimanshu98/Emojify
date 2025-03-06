import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatMessageProps {
  text: string;
  sender: 'user' | 'ai';
}

export function ChatMessage({ text, sender }: ChatMessageProps) {
  return (
    <div className={`flex ${sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 rounded-lg text-xs sm:text-sm md:text-base whitespace-pre-wrap ${
          sender === 'user'
            ? 'bg-indigo-600 text-white rounded-br-none'
            : 'bg-gray-700 text-gray-200 rounded-bl-none'
        }`}
      >
        <div className="chat-message prose prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}