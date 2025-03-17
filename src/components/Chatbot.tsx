import { useState, useRef } from "react";
import { MessageSquare, Mic, MicOff } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { HinglishConverter } from "../utils/HinglishConverter";

interface Message {
  text: string;
  sender: string;
}

interface Props {
  chatMessages: Message[];
  setChatMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  userInput: string;
  setUserInput: React.Dispatch<React.SetStateAction<string>>;
  showChatbot: boolean;
  setShowChatbot: React.Dispatch<React.SetStateAction<boolean>>;
  chatPrompts: { text: string; icon: JSX.Element }[];
}

export const Chatbot = ({
  chatMessages,
  setChatMessages,
  userInput,
  setUserInput,
  showChatbot,
  setShowChatbot,
  chatPrompts,
}: Props) => {
  const chatSectionRef = useRef<HTMLDivElement>(null);
  const [isListening, setIsListening] = useState(false);

  const containsHindi = (text: string) => /[\u0900-\u097F]/.test(text);

  const startListening = () => {
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      let spokenText = event.results[0][0].transcript;
      if (containsHindi(spokenText)) {
        spokenText = HinglishConverter(spokenText);
      }
      setUserInput(spokenText);
    };

    recognition.start();
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    setChatMessages([...chatMessages, { text: userInput, sender: "user" }]);

    try {
      const response = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput }),
      });

      const data = await response.json();
      setChatMessages([...chatMessages, { text: data.response, sender: "ai" }]);
    } catch {
      setChatMessages([
        ...chatMessages,
        { text: "Error connecting to AI.", sender: "ai" },
      ]);
    }

    setUserInput("");
  };

  const handlePromptClick = (promptText: string) => {
    setUserInput(promptText);
  };

  const handleOpenChat = () => {
    setShowChatbot(!showChatbot);
    if (!showChatbot) {
      setTimeout(() => {
        chatSectionRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  return (
    <div
      ref={chatSectionRef}
      className="bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 md:p-8"
    >
      <div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6 cursor-pointer"
        onClick={handleOpenChat}
      >
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white">
          Need more suggestions?
        </h2>
        <button className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 sm:py-3 px-4 sm:px-6 rounded transition duration-300 text-sm sm:text-base w-full sm:w-auto justify-center sm:justify-start">
          <MessageSquare className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
          {showChatbot ? "Hide Chat" : "Open Chat"}
        </button>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          showChatbot ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border border-gray-700 rounded-lg">
          <div className="h-96 sm:h-[450px] md:h-[500px] overflow-y-auto p-3 sm:p-4 md:p-6 bg-gray-900 custom-scrollbar">
            {chatMessages.length === 0 ? (
              <div className="text-center text-gray-500 mt-4 sm:mt-6 md:mt-8 mb-5 sm:mb-8 md:mb-10">
                <MessageSquare className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 mx-auto mb-3 sm:mb-4 opacity-50" />
                <p className="mb-4 sm:mb-6 md:mb-8 text-sm sm:text-base md:text-lg">
                  Ask for personalized activity suggestions based on your mood!
                </p>
                <div className="flex flex-col gap-2 sm:gap-3">
                  {chatPrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handlePromptClick(prompt.text)}
                      className="flex items-center gap-2 sm:gap-3 bg-gray-800 hover:bg-gray-700 text-left text-gray-300 p-3 sm:p-4 rounded-lg transition-colors text-xs sm:text-sm md:text-base"
                    >
                      <span className="text-indigo-400">{prompt.icon}</span>
                      {prompt.text}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-3 sm:space-y-4 md:space-y-5 mb-4 sm:mb-5 md:mb-6">
                  {chatMessages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        msg.sender === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 rounded-lg text-sm sm:text-base md:text-lg leading-relaxed ${
                          msg.sender === "user"
                            ? "bg-indigo-600 text-white rounded-br-none"
                            : "bg-gray-700 text-gray-200 rounded-bl-none"
                        }`}
                      >
                        <ReactMarkdown
                          components={{
                            p: (props) => (
                              <p
                                className="whitespace-pre-wrap leading-loose text-sm sm:text-base md:text-lg"
                                {...props}
                              />
                            ),
                          }}
                        >
                          {msg.text}
                        </ReactMarkdown>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 sm:gap-3 mt-3 sm:mt-4 md:mt-6">
                  {chatPrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handlePromptClick(prompt.text)}
                      className="flex items-center gap-1 sm:gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full text-xs sm:text-sm transition-colors"
                    >
                      <span className="text-indigo-400">{prompt.icon}</span>
                      {prompt.text}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <form
            onSubmit={handleChatSubmit}
            className="flex border-t border-gray-700"
          >
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Ask for more activity suggestions..."
              className="flex-grow p-2 sm:p-3 md:p-4 bg-gray-800 text-white focus:outline-none text-sm sm:text-base md:text-lg"
            />
            <button
              onClick={startListening}
              className="bg-gray-700 py-2 px-3 flex items-center gap-2 hover:bg-gray-600 transition"
            >
              {isListening ? (
                <MicOff className="text-red-500" />
              ) : (
                <Mic className="text-green-400" />
              )}
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 sm:px-4 md:px-6 text-sm sm:text-base"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
