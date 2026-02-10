import React, { useContext } from "react";
import ChatCard from "./ChatCard";
import { useAuthStore } from "@/stores/authStore";
import { useChatStore } from "@/stores/chatStore";
import { cn } from "@/lib/utils";
import UnreadCountBadge from "./UnreadCountBadge";
import UserAvatar from "./UserAvatar";
import StatusBadge from "./StatusBadge";
import { ChatContext } from "@/lib/ChatContext";
import { useSocketStore } from "@/stores/socketStore";

const PrivateChatCard = ({ conversation }) => {
  const { setOpenChatBox } = useContext(ChatContext);

  const { user } = useAuthStore();
  const {
    activeConversationId,
    setActiveConversationId,
    messages,
    chatGetAllMessages,
  } = useChatStore();
  const { onlineUsers } = useSocketStore();

  if (!user) return null;

  const otherUser = conversation.participants.find((p) => p._id !== user._id);

  if (!otherUser) return null;

  const unreadCount = conversation.unReadCounts[user._id];
  const lastMessage = conversation.lastMessage?.content || "";

  const handleSelectConversation = async (id) => {
    setActiveConversationId(id);
    setOpenChatBox((prev) => !prev);
    if (!messages[id]) {
      await chatGetAllMessages(id);
    }
  };
  return (
    <ChatCard
      conversationId={conversation._id}
      name={otherUser.name || ""}
      timeStamp={
        conversation.lastMessage?.createdAt
          ? new Date(conversation.lastMessage.createdAt)
          : undefined
      }
      isActive={activeConversationId === conversation._id}
      onSelect={handleSelectConversation}
      unreadCount={unreadCount}
      leftSection={
        <>
          <UserAvatar
            type="sidebar"
            name={otherUser.name ?? ""}
            avatarUrl={otherUser?.avatarUrl ?? undefined}
          />
          <StatusBadge
            status={
              onlineUsers.includes(otherUser?._id || "") ? "online" : "offline"
            }
          />
          {unreadCount > 0 && <UnreadCountBadge unreadCount={unreadCount} />}
        </>
      }
      subTitle={
        <p
          className={cn(
            "text-sm truncate",
            unreadCount > 0
              ? "font-medium text-foreground"
              : "text-muted-foreground",
          )}
        >
          {lastMessage}
        </p>
      }
    />
  );
};

export default PrivateChatCard;
