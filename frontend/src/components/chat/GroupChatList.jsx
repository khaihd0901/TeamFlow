import { useChatStore } from "@/stores/chatStore";
import GroupChatCard from "./GroupChatCard";

const GroupChatList = () => {
  const { conversations } = useChatStore();
  if (!conversations) return;

  const groupChats = conversations.filter((conversation) => conversation.type === "group");
  return (
    <div className="flex-1 overflow-y-auto p-2 space-y-2">
      {groupChats.map((conversation) => (
        <GroupChatCard
          conversation={conversation}
          key={conversation._id}
        />
      ))}
    </div>
  );
};

export default GroupChatList;