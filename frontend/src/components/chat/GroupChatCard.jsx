import { useAuthStore } from "@/stores/authStore";
import { useChatStore } from "@/stores/chatStore";
import React from "react";
import ChatCard from "./ChatCard";
import UnreadCountBadge from "./UnreadCountBadge";
import GroupChatAvatar from "./GroupChatAvatar";

const GroupChatCard = ({ conversation }) => {
  const { user } = useAuthStore();
  const { activeConversationId, setActiveConversationId, messages } =
    useChatStore();

  if (!user) return null;

  const unreadCount = conversation.unReadCounts[user._id];
  const name = conversation.group[0]?.name || "";
  const handleSelectConversation = async (id) => {
    setActiveConversationId(id);
    if (!messages[id]) {
      // todo: fetch message
    }
  };
  return (
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
  );
};

export default GroupChatCard;
