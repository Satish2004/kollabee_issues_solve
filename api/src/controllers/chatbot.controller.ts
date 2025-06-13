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
    const { questionId, orderId } = req.body;

    if (!questionId) {
      return res
        .status(400)
        .json({ success: false, message: "Question ID is required" });
    }
   
    // Special handling for profile status
    if (questionId === "check_profile_status") {
      console.log("check_profile_status", req.user.userId);
      try {
        const seller = await prisma.seller.findUnique({
          where: { userId: req.user.userId },
          include: {
            user: {
              select: {
                name: true,
                email: true,
                phoneNumber: true,
                country: true,
                state: true,
                address: true,
                companyWebsite: true,
              },
            },
          },
        });
        
        if (!seller) {
          return res.status(404).json({ success: false, message: "Seller profile not found" });
        }

        const profileSteps = {
          1: "Business Information",
          2: "Contact Details",
          3: "Business Categories",
          4: "Business Overview",
          5: "Capabilities & Operations",
          6: "Compliance & Credentials",
          7: "Brand Presence",
          8: "Additional Information",
          9: "Team Size",
          10: "Annual Revenue",
          11: "Minimum Order",
          12: "Comments"
        };

        const completedSteps = seller.profileCompletion || [];
        const totalSteps = Object.keys(profileSteps).length;
        const completionPercentage = Math.round((completedSteps.length / totalSteps) * 100);
        const isReadyForApproval = [1, 2, 3, 4, 5, 6, 7].every(step => completedSteps.includes(step));

        // HTML for step status
        const stepStatusHtml = Object.entries(profileSteps)
          .map(([stepNum, stepName]) => {
            const isCompleted = completedSteps.includes(parseInt(stepNum));
            return `<li style=\"margin-bottom:4px;\"><span style=\"font-size:18px;vertical-align:middle;\">${isCompleted ? '✅' : '❌'}</span> <span style=\"vertical-align:middle;\">${stepName}</span></li>`;
          })
          .join("");

        // HTML for basic details
        const basicDetailsHtml = `
          <ul style=\"list-style:none;padding:0;\">
            <li><span style=\"font-weight:bold;\">👤 Name:</span> ${seller.user.name || '-'} </li>
            <li><span style=\"font-weight:bold;\">📧 Email:</span> ${seller.user.email || '-'} </li>
            <li><span style=\"font-weight:bold;\">📱 Phone:</span> ${seller.user.phoneNumber || '-'} </li>
            <li><span style=\"font-weight:bold;\">🏢 Business Name:</span> ${seller.businessName || '-'} </li>
            <li><span style=\"font-weight:bold;\">🌐 Website:</span> ${seller.websiteLink || '-'} </li>
            <li><span style=\"font-weight:bold;\">📍 Location:</span> ${seller.user.country || '-'}, ${seller.user.state || '-'} </li>
          </ul>
        `;

        // Main HTML summary
        const summaryHtml = `
          <div style=\"font-family:Segoe UI,Arial,sans-serif;max-width:420px;\">
            <div style=\"font-size:20px;font-weight:bold;margin-bottom:8px;\">Profile Completion Status</div>
            <div style=\"margin-bottom:8px;\"><span style=\"font-size:18px;\">📊</span> <b>Overall Completion:</b> <span style=\"color:#007bff;font-weight:bold;\">${completionPercentage}%</span> ${isReadyForApproval ? '<span style=\"color:#28a745;font-weight:bold;\">✨ Profile is ready for approval!</span>' : '<span style=\"color:#dc3545;font-weight:bold;\">⚠️ Profile needs more information for approval</span>'}</div>
            <div style=\"font-size:16px;font-weight:500;margin-bottom:4px;\">Step-by-Step Status</div>
            <ul style=\"padding-left:18px;margin-bottom:12px;\">${stepStatusHtml}</ul>
            <div style=\"font-size:16px;font-weight:500;margin-bottom:4px;\">Basic Information</div>
            ${basicDetailsHtml}
            ${!isReadyForApproval ? '<div style=\"color:#dc3545;font-weight:bold;margin-top:8px;\">⚠️ Note: Complete steps 1-7 to be eligible for approval.</div>' : ''}
          </div>
        `;

        return res.status(200).json({ 
          success: true, 
          data: { 
            id: questionId, 
            question: "Check Profile Status", 
            answer: summaryHtml, // HTML answer
            answerType: "html" // Optionally, let frontend know this is HTML
          } 
        });
      } catch (err) {
        return res.status(500).json({ success: false, message: "Failed to fetch profile details" });
      }
    }

    // Special handling for order status
    if (questionId === "check_order_status") {
      // If orderId is provided, fetch order status
      console.log("check_order_status", req.user.sellerId);
      console.log("orderId", orderId);
      if (orderId) {
        try {
          const order = await prisma.order.findFirst({
            where: { id: orderId, items: { some: { sellerId: req.user.sellerId } } },
            select: {
              id: true,
              status: true,
              createdAt: true,
              trackingNumber: true,
              carrier: true,
              trackingHistory: true,
            },
          });
          if (!order) {
            return res.status(404).json({ success: false, message: `Order with ID ${orderId} not found.` });
          }

          // Format tracking history as HTML
          let trackingHistoryHtml = "";
          if (order.trackingHistory && order.trackingHistory.length > 0) {
            trackingHistoryHtml = `<div style=\"margin-top:8px;\"><b>📦 Tracking History:</b><ul style=\"padding-left:18px;\">`;
            order.trackingHistory.forEach((t, idx) => {
              if (t && typeof t === 'object' && 'status' in t && 'timestamp' in t) {
                trackingHistoryHtml += `<li style=\"margin-bottom:2px;\">${idx + 1}. <span style=\"font-weight:500;\">${t.status}</span> at <span style=\"color:#007bff;\">${t.location || "-"}</span> <span style=\"color:#888;\">(${t.timestamp})</span></li>`;
              }
            });
            trackingHistoryHtml += `</ul></div>`;
          }

          // Main HTML summary
          const summaryHtml = `
            <div style=\"font-family:Segoe UI,Arial,sans-serif;max-width:420px;\">
              <div style=\"font-size:20px;font-weight:bold;margin-bottom:8px;\">Order Status</div>
              <div style=\"margin-bottom:8px;\"><span style=\"font-size:18px;\">🆔</span> <b>Order ID:</b> <span style=\"color:#007bff;\">${order.id}</span></div>
              <div style=\"margin-bottom:8px;\"><span style=\"font-size:18px;\">📅</span> <b>Created:</b> ${new Date(order.createdAt).toLocaleString()}</div>
              <div style=\"margin-bottom:8px;\"><span style=\"font-size:18px;\">🚚</span> <b>Status:</b> <span style=\"color:#28a745;font-weight:bold;\">${order.status}</span></div>
              <div style=\"margin-bottom:8px;\"><span style=\"font-size:18px;\">🔢</span> <b>Tracking Number:</b> ${order.trackingNumber || "-"}</div>
              <div style=\"margin-bottom:8px;\"><span style=\"font-size:18px;\">🏷️</span> <b>Carrier:</b> ${order.carrier || "-"}</div>
              ${trackingHistoryHtml}
            </div>
          `;

          return res.status(200).json({ success: true, data: { id: questionId, question: "Check Order Status", answer: summaryHtml, answerType: "html" } });
        } catch (err) {
          return res.status(500).json({ success: false, message: "Failed to fetch order status" });
        }
      } else {
        // Prompt for order ID
        return res.status(200).json({ success: true, data: { id: questionId, question: "Check Order Status", answer: "Please enter your Order ID to check the status." } });
      }
    }

    // Default: static FAQ
    const faqItem = faqData.find((item) => item.id === questionId);
    if (!faqItem) {
      return res
        .status(404)
        .json({ success: false, message: "Question not found" });
    }
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
