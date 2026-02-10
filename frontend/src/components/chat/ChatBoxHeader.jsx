import React from "react";
import { X } from "lucide-react";
import { useChatStore } from "@/stores/chatStore";
import { useAuthStore } from "@/stores/authStore";
import UserAvatar from "./UserAvatar";
import { useSocketStore } from "@/stores/socketStore";
import StatusBadge from "./StatusBadge";
import GroupChatAvatar from "./GroupChatAvatar";

const ChatBoxHeader = ({ onCloseChat, chat }) => {
  const { conversations, activeConversationId } = useChatStore();
  const { user } = useAuthStore();
  const { onlineUsers } = useSocketStore();
  let otherUser;
  chat = chat ?? conversations.find((c) => c._id === activeConversationId);
  if (chat.type === "private") {
    const otherUsers = chat.participants.filter((p) => p._id !== user?._id);
    otherUser = otherUsers.length > 0 ? otherUsers[0] : null;

    if (!user || !otherUser) return;
  }
  return (
    <div className="flex items-center justify-between border-b px-4 py-3">
      <div className="flex items-center gap-3 relative">
        {chat.type === "private" ? (
          <>
            <UserAvatar
              type={"sidebar"}
              name={otherUser?.name || "Moji"}
              avatarUrl={otherUser?.avatarUrl || undefined}
            />

            <StatusBadge
              status={
                onlineUsers.includes(otherUser?._id || "") ? "online" : "offline"
              }
            />
          </>
        ) : (
          <GroupChatAvatar participants={chat.participants} type={`sidebar`} />
        )}
      </div>

      {/* Close button */}
      <button onClick={onCloseChat} className="rounded-full p-1 hover:bg-muted">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default ChatBoxHeader;
