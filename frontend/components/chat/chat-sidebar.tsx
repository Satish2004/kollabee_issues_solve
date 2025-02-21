import { useRouter } from "next/navigation"
import { Input } from "../ui/input"
import { useState, useEffect } from "react"
import { getConversation } from "./action"
import { formatDistanceToNow, parseISO } from "date-fns"  // Import the necessary functions from date-fns


const ChatSidebar = ({ currentUser, conversationList, conversationId, setConversationId, setReceiverId, messages }: any) => {
    const router = useRouter()

    // State to store the last message for each conversation
    const [lastMessages, setLastMessages] = useState<any>({})

    // Function to get the last message for a conversation
    const getLastMessage = async(conversationId: string) => {
        const conversations = await getConversation(conversationId)
        const lastMessage = conversations?.length > 0 ? conversations[conversations.length - 1].text : 'No messages yet'
        const lastTime = conversations?.length > 0 ? conversations[conversations.length - 1].created_at : 'No messages yet'

        // Ensure lastTime is a valid ISO string, then parse it to Date
        let formattedTime = 'No messages yet';
        if (lastTime !== 'No messages yet') {
            // If the lastTime is a valid string that can be parsed into a date
            const parsedDate = typeof lastTime === 'string' ? parseISO(lastTime) : lastTime;
            formattedTime = formatDistanceToNow(parsedDate, { addSuffix: true });
        }
        return { lastMessage, lastTime: formattedTime }
    }

    // Effect hook to fetch the last message for all conversations
    useEffect(() => {
        const fetchLastMessages = async () => {
            const messagesObj: any = {}
            for (const conversation of conversationList) {
                const lastMessage = await getLastMessage(conversation[0].conversation_id)
                messagesObj[conversation[0].conversation_id] = lastMessage
            }
            setLastMessages(messagesObj)
        }

        fetchLastMessages()
    }, [conversationList])  // Re-run effect when conversationList changes

    return (
        <div className="h-full border rounded-md flex flex-col col-span-3 bg-white">
            <div className="p-5 border-b flex justify-between items-center h-20">
                <h1 className='text-2xl font-bold'>Messages</h1>
            </div>
            <div className="flex-1 overflow-y-auto p-1 px-5">
                <Input placeholder="Search for Contact" className="my-2" />
                {conversationList?.map((conversation: any, index: number) => {
                    const { lastMessage, lastTime } = lastMessages[conversation[0].conversation_id] || 'Loading...'
                    return (
                        <div key={index} className={`flex items-center gap-3 p-3 hover:dark:bg-white hover:bg-[#615EF00F] cursor-pointer rounded-md ${conversationId === conversation[0].conversation_id ? 'bg-[#615EF00F]' : ''}`} 
                            onClick={() => {
                                setReceiverId(conversation[0].receiver.id)
                                setConversationId(conversation[0].conversation_id)
                                router.push(`/chat/?conversation_id=${conversation[0].conversation_id}&receiver_id=${conversation[0].receiver.id}`)
                            }}>
                            <div className="h-10 w-10 bg-amber-800 dark:bg-zinc-900 rounded-lg flex justify-center items-center font-bold capitalize text-white dark:text-black">
                                {conversation[0].receiver.id === currentUser.id
                                    ? conversation[0].sender.imageUrl 
                                    ? <img src={conversation[0].sender.imageUrl} alt="Sender Avatar" className="h-full w-full object-cover rounded-lg" />
                                    : conversation[0].sender.name.split(' ')[0][0] + conversation[0].sender.name.split(' ')[0][1]
                                    : conversation[0].receiver.imageUrl 
                                    ? <img src={conversation[0].receiver.imageUrl} alt="Receiver Avatar" className="h-full w-full object-cover rounded-lg" />
                                    : conversation[0].receiver.name.split(' ')[0][0] + conversation[0].receiver.name.split(' ')[0][1]
                                }
                            </div>

                            <div className="flex flex-col items-start w-full">
                                <div className="w-full flex justify-between items-center">
                                    <h1 className='text-md font-medium dark:text-white text-black'>{conversation[0].receiver.id === currentUser.id ? conversation[0].sender.name : conversation[0].receiver.name}</h1>
                                    <p className="text-xs text-gray-600">{lastTime}</p>
                                </div>

                                <p className="text-xs text-gray-600">{lastMessage}</p> {/* Display last message */}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default ChatSidebar
