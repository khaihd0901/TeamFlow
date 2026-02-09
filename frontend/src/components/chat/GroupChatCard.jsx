import { useAuthStore } from "@/stores/authStore";
import { useChatStore } from "@/stores/chatStore";
import React, { useContext } from "react";
import ChatCard from "./ChatCard";
import UnreadCountBadge from "./UnreadCountBadge";
import GroupChatAvatar from "./GroupChatAvatar";
import ChatBox from "./ChatBox";
import { ChatContext } from "@/lib/ChatContext";

const GroupChatCard = ({ conversation }) => {
  const { setOpenChatBox } = useContext(ChatContext);
  const { user } = useAuthStore();
  const { activeConversationId, setActiveConversationId, messages,chatGetAllMessages } =
    useChatStore();

  if (!user) return null;

  const unreadCount = conversation.unReadCounts[user._id];
  const name = conversation.group[0]?.name || "";
  const handleSelectConversation = async (id) => {
    setActiveConversationId(id);
     setOpenChatBox(prev => !prev);
    if (!messages[id]) {
      await chatGetAllMessages(id);
    }
  };
  return (
    <>
    <ChatCard
      conversationId={conversation._id}
      name={name}
      timeStamp={
        conversation.lastMessage?.createdAt
          ? new Date(conversation.lastMessage.createdAt)
          : undefined
      }
      isActive={activeConversationId === conversation._id}
      onSelect={handleSelectConversation}
      unreadCount={unreadCount}
      leftSection={<>
       {unreadCount > 0 && <UnreadCountBadge unreadCount={unreadCount} />}
          <GroupChatAvatar
            participants={conversation.participants}
            type="chat"
          />
      </>}
      subTitle={
        <p className={`text-sm truncate font-medium text-foreground`}>
          {conversation.participants.length} members
        </p>
      }
    />
    </>
  );
};

export default GroupChatCard;
