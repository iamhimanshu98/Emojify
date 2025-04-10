import { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  Mic,
  MicOff,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import { HinglishConverter } from "../utils/HinglishConverter";
import { cn } from "../utils/cn";
import React, { createContext, useContext } from "react";

const ListContext = createContext(false);

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const containsHindi = (text: string) => /[\u0900-\u097F]/.test(text);

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      let spokenText = event.results[0][0].transcript;
      if (containsHindi(spokenText)) {
        spokenText = HinglishConverter(spokenText);
      }
      setUserInput(spokenText);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.start();
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;

    const newUserMessage = { text: userInput, sender: "user" };
    setChatMessages((prev) => [...prev, newUserMessage]);
    setUserInput("");
    setIsLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();
      setChatMessages((prev) => [
        ...prev,
        { text: data.response, sender: "ai" },
      ]);
    } catch (error) {
      setChatMessages((prev) => [
        ...prev,
        {
          text: "Sorry, I'm having trouble connecting right now. Please try again later.",
          sender: "ai",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
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
      <button
        onClick={handleOpenChat}
        className="flex w-full flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6"
        aria-expanded={showChatbot}
        aria-controls="chat-section"
      >
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white">
          Need more suggestions?
        </h2>
        <div className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 sm:py-3 px-4 sm:px-6 rounded transition duration-300 text-sm sm:text-base w-full sm:w-auto justify-center sm:justify-start">
          {showChatbot ? (
            <>
              <ChevronUp className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Hide Chat
            </>
          ) : (
            <>
              <ChevronDown className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Open Chat
            </>
          )}
        </div>
      </button>

      <AnimatePresence>
        {showChatbot && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            id="chat-section"
            className="overflow-hidden"
          >
            <div className="border border-gray-700 rounded-lg">
              <div className="h-96 sm:h-[450px] md:h-[500px] overflow-y-auto p-3 sm:p-4 md:p-6 bg-gray-900 custom-scrollbar">
                {chatMessages.length === 0 ? (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-center text-gray-500 mt-4 sm:mt-6 md:mt-8 mb-5 sm:mb-8 md:mb-10"
                  >
                    <MessageSquare className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 mx-auto mb-3 sm:mb-4 opacity-50" />
                    <p className="mb-4 sm:mb-6 md:mb-8 text-lg sm:text-xl md:text-2xl font-semibold text-gray-300">
                      What can I Help you With ?
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
                  </motion.div>
                ) : (
                  <>
                    <div className="space-y-3 sm:space-y-4 md:space-y-5 mb-4 sm:mb-5 md:mb-6">
                      {chatMessages.map((msg, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className={cn(
                            "flex",
                            msg.sender === "user"
                              ? "justify-end"
                              : "justify-start"
                          )}
                        >
                          <div
                            className={cn(
                              "max-w-[80%]",
                              msg.sender === "user"
                                ? "text-right bg-indigo-900/30 border border-indigo-400/40 shadow-md shadow-indigo-500/30 rounded-2xl rounded-br-none px-4 py-3"
                                : "text-left text-gray-100"
                            )}
                          >
                            <ReactMarkdown
                              components={{
                                ul: ({ children }) => (
                                  <ListContext.Provider value={true}>
                                    <ul className="list-disc ml-6">
                                      {children}
                                    </ul>
                                  </ListContext.Provider>
                                ),
                                ol: ({ children }) => (
                                  <ListContext.Provider value={true}>
                                    <ol className="list-disc ml-6">
                                      {children}
                                    </ol>
                                  </ListContext.Provider>
                                ),
                                li: ({ children }) => {
                                  return (
                                    <li className="text-base sm:text-lg md:text-xl leading-relaxed text-gray-100 mb-4">
                                      {children}
                                    </li>
                                  );
                                },
                                strong: ({ children }) => {
                                  const insideList = useContext(ListContext);

                                  return insideList ? (
                                    <strong className="block font-semibold md:text-xl  text-gray-100 mb-2">
                                      {children}
                                    </strong>
                                  ) : (
                                    <h2 className="text-2xl sm:text-2xl md:text-3xl font-helvetica font-light text-gray-100 my-5">
                                      {children}
                                    </h2>
                                  );
                                },

                                p: ({ children }) => (
                                  <p className="text-base sm:text-lg md:text-xl leading-loose text-gray-100 mb-4">
                                    {children}
                                  </p>
                                ),
                                code: ({ children }) => (
                                  <code className="bg-gray-900 text-indigo-300 font-mono px-1.5 py-0.5 rounded text-sm">
                                    {children}
                                  </code>
                                ),
                              }}
                            >
                              {msg.text.replace(
                                /(\*\*[^*]+\*\*)\s*:\s*/g,
                                "$1 "
                              )}
                            </ReactMarkdown>
                          </div>
                        </motion.div>
                      ))}
                      {isLoading && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex justify-start"
                        >
                          <div className="bg-gray-700 text-gray-200 rounded-lg rounded-bl-none px-4 py-2">
                            <Loader2 className="w-5 h-5 animate-spin" />
                          </div>
                        </motion.div>
                      )}
                      <div ref={messagesEndRef} />
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
                  placeholder="Ask for any suggestions..."
                  className="flex-grow p-3 md:p-4 z-10 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 text-base md:text-lg rounded-bl-lg placeholder-gray-400"
                  disabled={isLoading}
                />

                <button
                  type="button"
                  onClick={startListening}
                  disabled={isLoading}
                  className={cn(
                    "relative py-2 px-3 flex items-center transition",
                    isListening
                      ? "bg-red-700 animate-pulse shadow-md shadow-red-500/50"
                      : "bg-gray-700 hover:bg-gray-600 ",
                    isLoading && "opacity-50 cursor-not-allowed"
                  )}
                  title={isListening ? "Stop listening" : "Start voice input"}
                >
                  {isListening ? (
                    <MicOff className="text-red-300 w-6 h-5 z-10" />
                  ) : (
                    <Mic className="text-indigo-300 w-6 h-5 z-10" />
                  )}
                </button>

                <button
                  type="submit"
                  disabled={!userInput.trim() || isLoading}
                  className={cn(
                    "bg-indigo-600 z-0 text-white px-4 md:px-6 text-base rounded-br-lg transition",
                    !isLoading && userInput.trim() && "hover:bg-indigo-700",
                    (!userInput.trim() || isLoading) && "opacity-100"
                  )}
                >
                  Send
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
