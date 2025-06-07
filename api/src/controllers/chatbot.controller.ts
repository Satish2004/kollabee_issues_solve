import type { Request, Response } from "express";
import { faqData } from "../utils/faq.data";
import prisma from "../db";

// Get all available questions with pagination
export const getQuestions = async (req: Request, res: Response) => {
  try {
    const chatbotUser = await prisma.user.findFirst({
      where: {
        email: "chatbot@kollabee.com",
      },
    });

    if (!chatbotUser) {
      const newChatbotUser = await prisma.user.create({
        data: {
          email: "chatbot@kollabee.com",
          name: "Kollabee Assistant",
          role: "ADMIN", // Or create a new role for chatbot
          displayName: "Kollabee Assistant",
          fullName: "Kollabee Assistant",
        },
      });

      console.log("Created chatbot user:", newChatbotUser.id);

      // Add this ID to your environment variables
      console.log("Add this to your .env file:");
      console.log(`CHATBOT_USER_ID=${newChatbotUser.id}`);
    } else {
      console.log("Chatbot user already exists:", chatbotUser.id);
    }

    const page = Number.parseInt(req.query.page as string) || 1;
    const limit = Number.parseInt(req.query.limit as string) || 5;
    const skip = (page - 1) * limit;

    // Get total count of questions
    const totalCount = faqData.length;
    const totalPages = Math.ceil(totalCount / limit);

    // Get paginated questions
    const paginatedQuestions = faqData
      .slice(skip, skip + limit)
      .map((item) => ({
        id: item.id,
        question: item.question,
      }));

    return res.status(200).json({
      success: true,
      data: paginatedQuestions,
      totalCount,
      currentPage: page,
      totalPages,
      hasMore: page < totalPages,
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch questions" });
  }
};

// Get answer for a specific question
export const getAnswer = async (req: any, res: Response) => {
  try {
    const { questionId } = req.body;

    if (!questionId) {
      return res
        .status(400)
        .json({ success: false, message: "Question ID is required" });
    }

    const faqItem = faqData.find((item) => item.id === questionId);

    if (!faqItem) {
      return res
        .status(404)
        .json({ success: false, message: "Question not found" });
    }

    // If user is authenticated, save this interaction to chat history
    // if (req.user && req.user.userId) {
    //   try {
    //     await saveChatHistory(
    //       req.user.userId,
    //       faqItem.question,
    //       faqItem.answer
    //     );
    //   } catch (err) {
    //     console.error("Error saving chat history:", err);
    //     // Continue even if saving history fails
    //   }
    // }

    return res.status(200).json({ success: true, data: faqItem });
  } catch (error) {
    console.error("Error fetching answer:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch answer" });
  }
};

// Save chat history
export const saveChatHistory = async (
  userId: string,
  userMessage: string,
  botMessage: string
) => {
  // Ensure chatbot user exists
  const chatbotUser = await prisma.user.findFirst({
    where: { email: "chatbot@kollabee.com" },
  });

  if (!chatbotUser) {
    throw new Error("Chatbot user not found. Please ensure it is created.");
  }

  // Find or create a conversation
  let conversation = await prisma.conversation.findFirst({
    where: {
      participants: {
        some: { userId },
      },
      status: "PENDING",
    },
    orderBy: { createdAt: "desc" },
  });

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        status: "PENDING",
        initiatedBy: userId,
        participants: {
          create: [
            { userId },
            { userId: chatbotUser.id }, // Add chatbot as a participant
          ],
        },
      },
    });
  }

  // Save user message
  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderId: userId,
      content: userMessage,
      isRead: true,
    },
  });

  // Save bot message
  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderId: chatbotUser.id,
      content: botMessage,
      isRead: true,
    },
  });
};

// Get chat history for a user
export const getChatHistory = async (req: any, res: Response) => {
  try {
    return res.status(200).json({ success: true, data: [] });

    // if (!req.user || !req.user.userId) {
    //   return res.status(401).json({ success: false, message: "Unauthorized" });
    // }

    // const userId = req.user.userId;

    // // Ensure chatbot user exists
    // const chatbotUser = await prisma.user.findFirst({
    //   where: { email: "chatbot@kollabee.com" },
    // });

    // if (!chatbotUser) {
    //   return res.status(500).json({
    //     success: false,
    //     message: "Chatbot user not found. Please ensure it is created.",
    //   });
    // }

    // // Find the most recent conversation between the user and the chatbot
    // const conversation = await prisma.conversation.findFirst({
    //   where: {
    //     participants: {
    //       every: {
    //         OR: [{ userId }, { userId: chatbotUser.id }],
    //       },
    //     },
    //   },
    //   orderBy: { createdAt: "desc" },
    //   include: {
    //     messages: {
    //       orderBy: { createdAt: "asc" },
    //       include: { sender: true },
    //     },
    //   },
    // });

    // if (!conversation) {
    //   return res.status(200).json({ success: true, data: [] });
    // }

    // // Transform messages for frontend
    // const chatMessages = conversation.messages.map((message) => ({
    //   id: message.id,
    //   type: message.senderId === userId ? "user" : "bot",
    //   content: message.content,
    //   timestamp: message.createdAt,
    // }));

    // return res.status(200).json({ success: true, data: chatMessages });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch chat history",
    });
  }
};

// Save a single message to chat history
export const saveMessage = async (req: any, res: Response) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { content, isUserMessage } = req.body;
    const userId = req.user.userId;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: "Message content is required",
      });
    }

    // Ensure chatbot user exists
    const chatbotUser = await prisma.user.findFirst({
      where: { email: "chatbot@kollabee.com" },
    });

    if (!chatbotUser) {
      return res.status(500).json({
        success: false,
        message: "Chatbot user not found. Please ensure it is created.",
      });
    }

    // Find or create conversation
    let conversation = await prisma.conversation.findFirst({
      where: {
        participants: {
          some: { userId },
        },
        AND: {
          participants: {
            some: { userId: chatbotUser.id },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          status: "ACCEPTED",
          initiatedBy: userId,
          participants: {
            create: [{ userId }, { userId: chatbotUser.id }],
          },
        },
      });
    }

    // Determine sender ID
    const senderId = isUserMessage ? userId : chatbotUser.id;

    // Save message
    const message = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderId,
        content,
        isRead: true,
      },
    });

    return res.status(201).json({ success: true, data: message });
  } catch (error) {
    console.error("Error saving message:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to save message",
    });
  }
};
