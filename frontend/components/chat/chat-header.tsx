import { useState, useEffect } from "react";
import { fetchMessagesWithRelations } from "./action";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import Loader from "../ui/loader";

const ChatHeader = ({
  currentUser,
  conversation_id,
  isModal,
  setReceiverId,
  setConversationId,
}: any) => {
  const router = useRouter();
  const [conversation, setConversation] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchConversations = async () => {
      setIsLoading(true);
      try {
        const res = await fetchMessagesWithRelations(conversation_id);
        setConversation(res?.data ? res.data[0] : null);
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
        setConversation(null);
      } finally {
        setIsLoading(false);
      }
    };
    if (conversation_id) fetchConversations();
  }, [conversation_id]);

  const renderAvatar = () => {
    const user =
      conversation?.receiver?.id === currentUser.id
        ? conversation?.sender
        : conversation?.receiver;

    if (user?.imageUrl) {
      return (
        <img
          src={user.imageUrl}
          alt="User Avatar"
          className="h-full w-full object-cover rounded-full"
        />
      );
    }

    const initials = user?.name
      ? user.name.split(" ")[0]?.[0] + (user.name.split(" ")[0]?.[1] || "")
      : "NA";
    return initials;
  };

  const getUsername = () => {
    const user =
      conversation?.receiver?.id === currentUser.id
        ? conversation?.sender
        : conversation?.receiver;

    return user?.name
      ? `@${user.name.toLowerCase().replace(/\s+/g, "")}`
      : "@unknown";
  };

  return (
    <div className="h-16">
      <div className="p-5 border-b flex justify-between items-center h-full">
        {isLoading ? (
          <Loader />
        ) : conversation ? (
          <>
            <div className="flex items-center gap-2">
              <div className="rounded-full w-10 h-10 bg-amber-900 flex justify-center items-center text-white font-bold">
                {renderAvatar()}
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg font-bold">
                  {conversation?.receiver?.id === currentUser.id
                    ? conversation?.sender?.name
                    : conversation?.receiver?.name}
                </h1>
                <p className="text-xs">{getUsername()}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button className="bg-[#EA3D4F] text-white rounded-full">
                Call
              </Button>
              <Button
                variant={"outline"}
                className="border border-[#EA3D4F] rounded-full"
              >
                Report
              </Button>
            </div>

            {isModal && (
              <Button
                onClick={() => {
                  if (conversation?.receiver?.id && conversation?.conversation_id) {
                    setReceiverId(conversation.receiver.id);
                    setConversationId(conversation.conversation_id);
                    router.push(
                      `/chat/?conversation_id=${conversation.conversation_id}&receiver_id=${conversation.receiver.id}`
                    );
                  }
                }}
              >
                Go To Chat Page
              </Button>
            )}
          </>
        ) : (
          <p className="text-gray-500">No conversation found.</p>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
