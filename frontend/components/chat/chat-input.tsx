import { useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { createMessage, getUser, updateUserConversations } from "./action";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import EmogiIcon from "./EmogiIcon";
import MicrophoneIcon from "./MicrophoneIcon";

const ChatInput = ({ sender, receiver_id, conversation_id }: any) => {
    const [message, setMessage] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const handleSendMessage = async (text: string) => {
        const senderRes = await getUser(sender.id);
        if (!senderRes) return console.error("Error fetching sender:");

        const senderData = senderRes;
        if (senderData && !senderData.conversations?.includes(conversation_id)) {
            console.log(await updateUserConversations(sender.id, conversation_id));
        }

        const receiverRes = await getUser(receiver_id);
        if (!receiverRes) return console.error("Error fetching receiver:");

        const receiverData = receiverRes;
        if (receiverData && !receiverData.conversations?.includes(conversation_id)) {
            console.log(await updateUserConversations(receiver_id, conversation_id));
        }

        const data = await createMessage(text, sender.id, receiver_id, conversation_id);
        console.log(data);
        if (data.error) console.log(data.error);
    };

    const handleEmojiClick = (emojiData: EmojiClickData) => {
        setMessage((prev) => prev + emojiData.emoji);
        setShowEmojiPicker(false); // Close emoji picker after selecting an emoji
    };

    if (!sender || !receiver_id || !conversation_id) {
        return <div></div>;
    }

    return (
        <div className="p-3 shadow-lg relative">
            <Textarea
                placeholder="Send a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault(); // Prevent new line on Enter
                        handleSendMessage(message);
                        setMessage("");
                    }
                }}
                className="rounded-xl bg-white"
                rows={5}
            />

            {/* Emoji Picker */}
            {showEmojiPicker && (
                <div className="absolute bottom-[5rem] right-5 z-50">
                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
            )}

            <div className="absolute flex items-center gap-2 top-[4.7rem] right-5">
                {/* Toggle Emoji Picker */}
                <Button
                    variant={"outline"}
                    className="rounded-full py-[1.5rem] shadow-none"
                    onClick={() => setShowEmojiPicker((prev) => !prev)}
                >
                    <EmogiIcon />
                </Button>

                {/* Microphone */}
                <Button variant={"outline"} className="rounded-full py-[1.5rem] shadow-none">
                    <MicrophoneIcon />
                </Button>

                {/* Send Button */}
                <Button
                    variant={"outline"}
                    className="rounded-full shadow-none bg-[#EA3D4F] text-white font-medium p-5"
                    onClick={() => {
                        handleSendMessage(message);
                        setMessage("");
                    }}
                >
                    Send
                    <svg
                        width="18"
                        height="20"
                        viewBox="0 0 18 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M16.2703 8.63131L3.14063 1.13913C2.8638 0.984056 2.54632 0.916943 2.23041 0.946713C1.91451 0.976483 1.61516 1.10173 1.37217 1.30578C1.12919 1.50984 0.954086 1.78304 0.87016 2.08904C0.786234 2.39505 0.797461 2.71935 0.902347 3.01881L3.26016 10.0001L0.902347 16.9813C0.819453 17.2168 0.794207 17.4688 0.828723 17.7161C0.86324 17.9634 0.956514 18.1988 1.10073 18.4026C1.24495 18.6064 1.43591 18.7727 1.65762 18.8875C1.87933 19.0023 2.12532 19.0624 2.375 19.0626C2.6435 19.062 2.90737 18.9926 3.14141 18.861L3.14844 18.8563L16.2734 11.3508C16.5141 11.2146 16.7143 11.017 16.8536 10.7781C16.9928 10.5392 17.0662 10.2676 17.0662 9.99108C17.0662 9.71455 16.9928 9.44297 16.8536 9.20408C16.7143 8.96519 16.5141 8.76754 16.2734 8.63131H16.2703ZM2.93672 16.8173L4.92266 10.9376H9.25C9.49864 10.9376 9.7371 10.8388 9.91292 10.663C10.0887 10.4872 10.1875 10.2487 10.1875 10.0001C10.1875 9.75142 10.0887 9.51297 9.91292 9.33715C9.7371 9.16134 9.49864 9.06256 9.25 9.06256H4.92266L2.93594 3.18131L14.8703 9.99147L2.93672 16.8173Z"
                            fill="white"
                        />
                    </svg>
                </Button>
            </div>
        </div>
    );
};

export default ChatInput;
