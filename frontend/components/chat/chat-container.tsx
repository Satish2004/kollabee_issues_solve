'use client';
import { useState, useEffect } from "react";
import ChatInput from "./chat-input";
import ChatHeader from "./chat-header";
import {v4 as uuidv4} from 'uuid'
import ListOfMessages from "./list-of-messages";
import ChatSidebar from "./chat-sidebar";
import { fetchMessagesWithRelations, getConversation, getUser } from "./action";
import { User } from "@prisma/client";
import { redirect } from "next/navigation";
import Loader from "../ui/loader";

const ChatContainer = ({currentUser, receiver_id, initialConversation_id, isModal}:
    {
        currentUser:User |null, 
        receiver_id:string | null | undefined
        initialConversation_id :string | null
        isModal: false | boolean
    }
) => {
    if(currentUser===null){
        redirect('/login')
    }
    const [receiverId, setReceiverId] = useState(receiver_id)
    const [conversation_id, setConversationId] = useState('')
    const [conversationList, setConversationList] = useState<any>([])
    const [isLoading1, setIsLoading1]=useState(false)
    const [isLoading2, setIsLoading2]=useState(false)
    
    useEffect(()=>{
        console.log('receiver_id', receiverId)
        if(receiver_id ==='null'){
            setReceiverId(null)
        }else if(receiver_id !=='null'){
            setReceiverId(receiver_id)
        }
    }, [receiver_id])

    useEffect(()=>{
        setIsLoading1(true)
        if(initialConversation_id !=='null' && initialConversation_id !== undefined && initialConversation_id !== null){
            getConversation(initialConversation_id).then((conversation) => {setReceiverId(conversation && conversation[0]?.receiver_id)})
            setConversationId(initialConversation_id)
        }else{
            console.log('creating uuid conversation')
            setConversationId(uuidv4())
        }
        setIsLoading1(false)
    }, [initialConversation_id])
  
    useEffect(()=>{
        const fetchConversations = async() => {
            const user = await getUser(currentUser.id) //get the data of current user
            if(user){
                const conversationIds = user?.conversations //get all the conversation ids of the current user
                const conversationsPromises = conversationIds && Promise.all(conversationIds.map(async(conversation_id:string) => {
                    const { data, error } = await fetchMessagesWithRelations(conversation_id) //get all the messages of the current user based on the conversation id in form of promises
                    if(error){
                        console.log(error)
                    }
                    console.log(data)
                    return data
                }))
                const conversations = await conversationsPromises //get all the messages of the current user based on the conversation id
                console.log('conv', conversations)
                
                const uniqueConversations = conversations?.map((conversation:any) => {
                    const uniqueConversationsIn = conversation.reduce((acc:any, current:any) => {
                        if (!acc?.some((obj:any) => obj.conversation_id === current?.conversation_id)) {
                          acc?.push(current);
                        }
                        return acc;
                    }, []);
                    return uniqueConversationsIn
                })

                console.log('unique comnv', uniqueConversations)

                setConversationList(uniqueConversations)
            }
        }
        setIsLoading2(true)
        fetchConversations()
        setIsLoading2(false)

    }, [])

    return (
        <>
        
            <main className='grid grid-cols-12 gap-3 h-full'>
                {isLoading1 || isLoading2 ?<Loader />:
                <>
                {!isModal && 
                    <ChatSidebar currentUser={currentUser} conversationList={conversationList} setConversationId={setConversationId} conversationId={conversation_id} setReceiverId={setReceiverId}/>
                }
                </>}
                {isLoading1 || isLoading2?<Loader />:
                <div className={`h-full border flex flex-col ${isModal?'col-span-12':'col-span-6'} bg-[#F8FAFC] dark:bg-black`}>
                    <ChatHeader currentUser={currentUser} conversation_id={conversation_id} isModal={isModal} setConversationId={setConversationId} setReceiverId={setReceiverId}/>
                    <div className="flex-1 flex flex-col overflow-y-auto h-full ">

                        
                        <ListOfMessages conversation_id={conversation_id} currentUser={currentUser}/>
                        
                    </div>
                    <ChatInput sender={currentUser} receiver_id={receiverId} conversation_id={conversation_id} />
                </div>
                }
            </main>
        </>
    )
}

export default ChatContainer



/*
Sender id and receiver id are the foreign keys in the messages table and to show the user in the chat
The conversation id is a unique id for each conversation between two users
*/