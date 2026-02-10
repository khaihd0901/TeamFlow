import { useChatStore } from "@/stores/chatStore";
import PrivateChatCard from "./PrivateChatCard";

const PrivateChatList = () => {
  const { conversations } = useChatStore();
  if (!conversations) return;

  const privateChats = conversations.filter(
    (conversation) => conversation.type === "private"
  );
  return (
    <div className="flex-1 overflow-y-auto p-2 space-y-2">
      {privateChats.map((conversation) => (
        <PrivateChatCard
          conversation={conversation}
          key={conversation._id}
        />
      ))}
    </div>
  );
};

export default PrivateChatList;