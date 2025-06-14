import { api } from "../axios";

// Types
export interface Question {
  id: string;
  question: string;
}

export interface Answer {
  id: string;
  question: string;
  answer: string;
}

export interface ChatMessage {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
  answerType?: string; // Optional, for bot messages
}

export interface PaginatedQuestions {
  data: Question[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
}

// Track if waiting for order ID
export let waitingForOrderId = false;
export const setWaitingForOrderId = (val: boolean) => { waitingForOrderId = val; };

/**
 * Fetch chatbot questions with pagination
 * @param page - Page number (starting from 1)
 * @param limit - Number of questions per page
 */
export const fetchChatbotQuestions = async (
  page = 1,
  limit = 5
): Promise<PaginatedQuestions> => {
  try {
    const response = await api.get(
      `/chatbot/questions?page=${page}&limit=${limit}`
    );
    return response && (response as any).success
      ? (response as any)
      : {
          data: [],
          totalCount: 0,
          currentPage: 1,
          totalPages: 1,
          hasMore: false,
        };
  } catch (error) {
    console.error("Error fetching chatbot questions:", error);
    throw new Error("Failed to fetch chatbot questions");
  }
};

/**
 * Get answer for a specific question
 * @param questionId - The ID of the question
 */
export const fetchChatbotAnswer = async (
  questionId: string,
  orderId?: string
): Promise<Answer> => {
  try {
    const response: any = await api.post(`/chatbot/answer`, {
      questionId,
      ...(orderId ? { orderId } : {}),
    });
    return response && response.success ? response.data : null;
  } catch (error) {
    console.error("Error fetching chatbot answer:", error);
    throw new Error("Failed to fetch answer");
  }
};

/**
 * Save chat history to the database
 * @param message - The message content
 * @param isUserMessage - Whether the message is from the user or bot
 */
export const saveChatHistory = async (
  message: string,
  isUserMessage: boolean
): Promise<void> => {
  try {
    await api.post(`/chatbot/history`, {
      content: message,
      isUserMessage,
    });
  } catch (error) {
    console.error("Error saving chat history:", error);
    // Don't throw error to prevent disrupting the chat flow
  }
};

/**
 * Fetch chat history for the current user
 */
export const fetchChatHistory = async (): Promise<ChatMessage[]> => {
  try {
    const response: any = await api.get(`/chatbot/history`);
    return response && response.success ? response.data : [];
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return [];
  }
};

/**
 * Calculate typing delay based on answer length
 * @param text - The answer text
 * @returns Delay in milliseconds
 */
export const calculateTypingDelay = (text: string): number => {
  // Base delay of 500ms
  const baseDelay = 500;
  // Additional delay based on text length (10ms per character, capped at 3000ms)
  const lengthDelay = Math.min(text.length * 10, 3000);
  return baseDelay + lengthDelay;
};

/**
 * Mock the typing effect with a delay based on answer length
 * @param answer - The answer text
 * @returns Promise that resolves after the calculated delay
 */
export const simulateTyping = async (answer: string): Promise<void> => {
  const delay = calculateTypingDelay(answer);
  return new Promise((resolve) => setTimeout(resolve, delay));
};

/**
 * Generate a unique ID for chat messages
 */
export const generateMessageId = (): string => {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const getDummyQuestions = (): Question[] => {
  return [
    { id: "q1", question: "What is Kollabee?" },
    { id: "q2", question: "How do I register as a supplier?" },
    { id: "q3", question: "What benefits do buyers get on Kollabee?" },
    { id: "q4", question: "How does Kollabee ensure supplier quality?" },
    { id: "q5", question: "What payment methods are supported?" },
    { id: "q6", question: "How can I contact Kollabee support?" },
    { id: "q7", question: "Is Kollabee available internationally?" },
  ];
};

/**
 * Get dummy answer for fallback
 * @param questionId - The ID of the question
 */
export const getDummyAnswer = (questionId: string): Answer => {
  const dummyAnswers: Record<string, string> = {
    q1: "Kollabee is a platform that connects buyers and suppliers, streamlining the procurement process and facilitating efficient business relationships. Our platform helps businesses find reliable partners and manage their supply chain effectively.",
    q2: 'To register as a supplier on Kollabee, click on the "Join as Supplier" button on our homepage. Fill out the required information including your company details, product categories, and business credentials. Our team will review your application and get back to you within 2-3 business days.',
    q3: "Buyers on Kollabee enjoy several benefits including access to a verified network of suppliers, competitive pricing through our bidding system, quality assurance through our supplier rating mechanism, streamlined procurement processes, and dedicated support from our customer service team.",
    q4: "Kollabee implements a rigorous verification process for all suppliers. We check business credentials, conduct background checks, and continuously monitor supplier performance through buyer ratings and feedback. We also have a dispute resolution system to address any quality issues that may arise.",
    q5: "Kollabee supports various payment methods including credit/debit cards, bank transfers, PayPal, and escrow services for large transactions. All payments are processed securely through our platform with encryption and fraud protection measures in place.",
    q6: "You can reach our support team through multiple channels: email at support@kollabee.com, live chat available on our website during business hours (9 AM - 6 PM EST), or by phone at +1-800-KOLLABEE. We typically respond to inquiries within 24 hours.",
    q7: "Yes, Kollabee operates globally, connecting buyers and suppliers across different countries. Our platform supports multiple languages and currencies to facilitate international trade. We also provide guidance on international shipping, customs, and compliance requirements.",
  };

  const dummyQuestions = getDummyQuestions();
  const question =
    dummyQuestions.find((q) => q.id === questionId)?.question ||
    "Unknown question";

  return {
    id: questionId,
    question,
    answer:
      dummyAnswers[questionId] ||
      "Sorry, I don't have information about that yet.",
  };
};

/**
 * Create a welcome message
 */
export const createWelcomeMessage = (): ChatMessage => {
  return {
    id: generateMessageId(),
    type: "bot",
    content:
      "Hello! I'm Kollabee's virtual assistant. How can I help you today? You can select one of the frequently asked questions below.",
    timestamp: new Date(),
  };
};

/**
 * Create a user message
 * @param content - The message content
 */
export const createUserMessage = (content: string): ChatMessage => {
  return {
    id: generateMessageId(),
    type: "user",
    content,
    timestamp: new Date(),
  };
};

/**
 * Create a bot message
 * @param content - The message content
 * @param answerType - Optional type of answer (e.g., 'html')
 */
export const createBotMessage = (content: string, answerType?: string): ChatMessage => {
  return {
    id: generateMessageId(),
    type: "bot",
    content,
    timestamp: new Date(),
    ...(answerType ? { answerType } : {}),
  };
};

/**
 * Create an error message
 */
export const createErrorMessage = (): ChatMessage => {
  return {
    id: generateMessageId(),
    type: "bot",
    content: "Sorry, I couldn't retrieve the answer. Please try again later.",
    timestamp: new Date(),
  };
};

/**
 * Fetch order status by order ID
 * @param orderId - The ID of the order
 */
export const fetchOrderStatus = async (orderId: string): Promise<Answer> => {
  try {
    const response: any = await api.post(`/chatbot/answer`, {
      questionId: "check_order_status",
      orderId,
    });
    return response && response.success ? response.data : null;
  } catch (error) {
    console.error("Error fetching order status:", error);
    throw new Error("Failed to fetch order status");
  }
};

/**
 * Process a user question and get the answer
 * @param question - The question object
 * @param setMessages - Function to update messages
 * @param setIsTyping - Function to update typing state
 */
export const processQuestion = async (
  question: Question,
  setMessages: (updater: (prev: ChatMessage[]) => ChatMessage[]) => void,
  setIsTyping: (isTyping: boolean) => void
): Promise<void> => {
  // Add user question to messages
  const userMessage = createUserMessage(question.question);
  setMessages((prev) => [...prev, userMessage]);
  setIsTyping(true);

  // Save user message to history
  await saveChatHistory(question.question, true);

  try {
    // Special handling for order status
    if (question.id === "check_order_status") {
      setWaitingForOrderId(true);
    }
    // Fetch answer
    let answerData: Answer;
    try {
      answerData = await fetchChatbotAnswer(
        question.id,
        (question as any).orderId
      );
    } catch (err) {
      console.error("Error fetching answer from API, using dummy data:", err);
      answerData = getDummyAnswer(question.id);
    }
    // Simulate typing delay based on answer length
    await simulateTyping(answerData.answer);
    // Add bot response
    const botMessage = createBotMessage(answerData.answer, (answerData as any).answerType);
    setMessages((prev) => [...prev, botMessage]);
    // Save bot message to history
    await saveChatHistory(answerData.answer, false);
  } catch (err) {
    // Handle error
    const errorMessage = createErrorMessage();
    setMessages((prev) => [...prev, errorMessage]);
    await saveChatHistory(errorMessage.content, false);
  } finally {
    setIsTyping(false);
  }
};
