"use client";

import { useState, useEffect, useRef } from "react";
import {
  fetchChatbotQuestions,
  fetchChatHistory,
  createWelcomeMessage,
  processQuestion,
  type ChatMessage,
  type Question,
} from "@/lib/api/chatbot";

import { Card, CardContent } from "@/components/ui/card";

export default function ChatbotPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch questions on component mount
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        let paginatedQuestions;

        try {
          paginatedQuestions = await fetchChatbotQuestions(currentPage, 5);
        } catch (err) {
          console.error("Error fetching questions from API:", err);
          // Use dummy data as fallback
        }

        setQuestions(paginatedQuestions.data);
        setTotalPages(paginatedQuestions.totalPages);
        setHasMore(paginatedQuestions.hasMore);

        // Only add welcome message if no history and first page
        if (!historyLoaded && currentPage === 1) {
          try {
            // Try to load chat history
            const history = await fetchChatHistory();
            if (history && history.length > 0) {
              setMessages(history);
              setHistoryLoaded(true);
            } else {
              // If no history, show welcome message
              setMessages([createWelcomeMessage()]);
            }
          } catch (err) {
            console.error("Error loading chat history:", err);
            setMessages([createWelcomeMessage()]);
          }
        }
      } catch (err) {
        console.error("Error in loadQuestions:", err);
        setError("Failed to load chatbot questions. Please try again later.");

        // Set fallback questions even on error

        if (!historyLoaded) {
          setMessages([createWelcomeMessage()]);
        }
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [currentPage, historyLoaded]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleQuestionClick = async (question: Question) => {
    await processQuestion(question, setMessages, setIsTyping);
  };

  const loadMoreQuestions = async () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <div className="md:px-6">
      <main className="flex flex-col items-center justify-between bg-white rounded-xl ">
        <div className="w-full ">
          <Card className="w-full shadow-lg overflow-hidden">
            {/* Chatbot Header */}
            <div className="button-bg text-white p-3 sm:p-4 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 hidden sm:block"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <h2 className="text-lg sm:text-xl font-semibold">
                Kollabee Assistant
              </h2>
            </div>

            {/* Chat Messages */}
            <div className="h-[350px] sm:h-[400px] md:h-[450px] lg:h-[500px] overflow-y-auto p-3 sm:p-4 bg-gray-50">
              {loading && questions.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 button-bg"></div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-full text-red-500 p-3 sm:p-4 text-center text-sm sm:text-base">
                  {error}
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.type === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-[80%] rounded-lg px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base ${
                          message.type === "user"
                            ? "button-bg text-white"
                            : "bg-white text-gray-800 border border-gray-200"
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white text-gray-800 rounded-lg px-3 py-2 sm:px-4 sm:py-2 border border-gray-200">
                        <div className="flex space-x-1">
                          <div
                            className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                            style={{ animationDelay: "0ms" }}
                          ></div>
                          <div
                            className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                            style={{ animationDelay: "150ms" }}
                          ></div>
                          <div
                            className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                            style={{ animationDelay: "300ms" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Questions List */}
            <div className="border-t p-3 sm:p-4 bg-white">
              <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                Frequently Asked Questions:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {questions && questions.length > 0 && (
                  <>
                    {questions.map((question) => (
                      <button
                        key={question.id}
                        onClick={() => handleQuestionClick(question)}
                        disabled={isTyping}
                        className="text-left text-xs sm:text-sm p-2 sm:p-3 rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200"
                      >
                        {question.question}
                      </button>
                    ))}

                    {hasMore && (
                      <button
                        onClick={loadMoreQuestions}
                        disabled={isTyping || loading}
                        className="text-left text-xs sm:text-sm p-2 sm:p-3 rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 col-span-full flex items-center justify-center"
                      >
                        {loading ? (
                          <span className="flex items-center">
                            <svg
                              className="animate-spin -ml-1 mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 text-indigo-600"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            <span className="text-xs sm:text-sm">
                              Loading...
                            </span>
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3 sm:h-4 sm:w-4 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                            <span className="text-xs sm:text-sm">
                              More Questions
                            </span>
                          </span>
                        )}
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
