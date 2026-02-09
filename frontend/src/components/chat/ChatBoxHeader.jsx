import React from "react";
import { X } from "lucide-react";
import { useChatStore } from "@/stores/chatStore";
import { useAuthStore } from "@/stores/authStore";
import UserAvatar from "./UserAvatar";

const ChatBoxHeader = ({ onCloseChat, chat }) => {
  const { conversations, activeConversationId } = useChatStore();
  const { user } = useAuthStore();
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

            <div>
              <p className="text-sm font-medium">{otherUser?.name}</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </div>
          </>
        ) : (
          <>
            <div className="h-9 w-9 rounded-full bg-gray-400" />

            <div>
              <p className="text-sm font-medium">{chat.group[0]?.name}</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </div>
          </>
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
