import ChatContainer from '@/components/chat/chat-container'
import { getCurrentUser } from "@/app/home/actions"
import { createClient } from "@/utils/supabase/server"


const page = async ({ searchParams }: {
  searchParams: { [key: string]: string | string[] | undefined }
}) => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const currentUser = user ? await getCurrentUser(user.id) : null
  const {receiver_id, conversation_id} = await searchParams
  console.log(conversation_id, receiver_id)
  return (
    <div className='w-screen flex justify-center h-[92vh]'>
      <div className="w-full mx-10 my-2 h-full">
        <ChatContainer currentUser={currentUser} initialConversation_id={conversation_id} receiver_id={receiver_id} isModal={false}/>
      </div>
    </div>
  )
}

export default page