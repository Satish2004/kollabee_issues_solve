'use server'
import { prisma } from "@/lib/db"

export const getConversation=async(conversationId:string)=>{
    const conversation= await prisma.messages.findMany({
        where:{
            conversation_id:conversationId
        },
        include:{
            sender:true,
            receiver:true
        }
    })
    return conversation
}


export const getUser=async(userId:string)=>{
    console.log(userId)
    const user= await prisma.user.findUnique({
        where:{
            id:userId
        }
    })
    return user
}


export const fetchMessagesWithRelations=async(conversation_id: string)=>{
    try {
        const messages = await prisma.messages.findMany({
            where: {
                conversation_id:conversation_id
            },
            include: {
                sender: true,  // Includes the sender details (User model)
                receiver: true, // Includes the receiver details (User model)
            },
        });
        return { data: messages, error: null };
    } catch (error) {
        console.error("Error fetching messages:", error);
        return { data: null, error };
    }
}

export async function updateUserConversations(userId: string, conversationId: string) {
    try {
      // Fetch the current conversations for the user
      const senderData = await prisma.user.findUnique({
        where: { id: userId },
        select: { conversations: true },
      });
  
      // Update the user's conversations
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          conversations: {
            set: [...(senderData?.conversations || []), conversationId],
          },
        },
      });
  
      return { data: updatedUser, error: null };
    } catch (error) {
      console.error("Error updating user conversations:", error);
      return { data: null, error };
    }
}


export const createMessage = async (text:string, senderId:string, receiverId:string, conversationId:string) => {
    try {
      const data = await prisma.messages.create({
        data: {
          text: text,
          sender_id: senderId,
          receiver_id: receiverId,
          conversation_id: conversationId,
        },
      });
      console.log(data)
      return { data: data, error: null };
    } catch (error) {
      console.error('Error creating message:', error);
      return { data: null, error };
    }
};


export const getMessageUsingId=async(msgId:string)=>{
    try {
        const messages = await prisma.messages.findMany({
            where: {
                id:msgId,
            },
            include: {
                sender: true,  // Includes the sender details (User model)
                receiver: true, // Includes the receiver details (User model)
            },
        });
        return { data: messages, error: null };
    } catch (error) {
        console.error("Error fetching messages:", error);
        return { data: null, error };
    }
}


export const getConversations=async(conversationId:string)=>{
    const conversations = await prisma.messages.findMany({
        where: {
            conversation_id: conversationId
        },
    })
    return conversations
}