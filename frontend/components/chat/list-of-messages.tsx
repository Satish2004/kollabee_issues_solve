import React, { useState } from 'react'
import Message from './message'
import { createClient } from "@/utils/supabase/client"
import { fetchMessagesWithRelations } from './action'
import Loader from '../ui/loader'


const ListOfMessages = ({conversation_id, currentUser}:{conversation_id:string, currentUser:any}) => {
    const supabase = createClient()
    const [messages, setMessages] = React.useState<any>([])
    const [isLoading, setIsLoading]= useState(false)

    React.useEffect(()=>{
        const channel=supabase.channel('chat-custom-room').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'Messages' }, payload => {
            console.log('payload', payload)
            const newMsg = payload.new
            console.log('subscription', newMsg)
            supabase.from('Messages').select("*, sender:User!Messages_sender_id_fkey (*), receiver:User!Messages_receiver_id_fkey (*)").eq('id', newMsg.id)
            .then(({ data, error }) => {
                if(error){
                    console.log(error)
                }else{
                    if(data && data[0]?.conversation_id !== conversation_id){
                        return;
                    }
                    setMessages((prevMessages: any) => {
                        // Create a new array with the previous messages and the new message
                        const updatedMessages = [...prevMessages, data && data[0]];
                    
                        // Scroll to the bottom after the state has been updated
                        setTimeout(() => {
                            const listElement = document.getElementById('list-of-messages');
                            if (listElement) {
                                listElement.scrollTo({
                                    top: listElement.scrollHeight,
                                    behavior: 'smooth',
                                });
                            }
                        }, 0);
                    
                        return updatedMessages; // Return the updated state
                    });
                }
            })

        }).subscribe()

        return () => {
            channel.unsubscribe()
        }

    }, [conversation_id])

    React.useEffect(()=>{
        setIsLoading(true)
        const fetchMessages = async() => {
            const { data, error } = await fetchMessagesWithRelations(conversation_id);
            if(error){
                console.log(error)
            }
            setMessages(() => {
                // Create a new array with the previous messages and the new message
                const updatedMessages = data;
            
                // Scroll to the bottom after the state has been updated
                setTimeout(() => {
                    const listElement = document.getElementById('list-of-messages');
                    if (listElement) {
                        listElement.scrollTo({
                            top: listElement.scrollHeight,
                            behavior: 'smooth',
                        });
                    }
                }, 0);
                
                return updatedMessages; // Return the updated state
            });
            setIsLoading(false)
        }

        fetchMessages()
    }, [conversation_id])

    return (
        <div className="space-y-7 overflow-y-auto h-[70vh] px-1 pb-3" id='list-of-messages'>
            {isLoading?<Loader />:<>{messages?.map((message:any, index:number) => (
                <Message key={index} message={message} currentUser={currentUser}/>
            ))}</>}
        </div>
    )
}

export default ListOfMessages