import { cn, formatMessageTime } from "@/lib/utils";
import React from "react";
import UserAvatar from "./UserAvatar";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";

const ChatMessageItem = ({
  message,
  index,
  messages,
  selectedConver,
  lastMessageStatus,
}) => {
  const prev = index + 1 < messages.length ? messages[index + 1] : undefined;
  const isGroupBreak =
    index === 0 ||
    message.senderId != prev?.senderId ||
    new Date(message.createdAt).getTime() -
      new Date(prev?.createdAt || 0).getTime() >
      300000;

  const participant = selectedConver.participants.find(
    (p) => p._id?.toString() === message.senderId?.toString(),
  );
  return (
    <div
      className={cn(
        "flex gap-2 message-bounce",
        message.isOwn ? "justify-end" : "justify-start",
      )}
    >
      {!message.isOwn && (
        <div className="w-8">
          {isGroupBreak && (
            <UserAvatar
              type="chat"
              name={participant?.name || "User"}
              avatarUrl={participant?.avatarUrl || undefined}
            />
          )}
        </div>
      )}

      <div
        className={cn(
          "max-w-xs lg:max-w-md space-y-1 flex flex-col",
          message.isOwn ? "items-end" : "items-start",
        )}
      >
        <Card
          className={cn(
            "p-3",
            message.isOwn
              ? "chat-bubble-sent border-0"
              : "bg-chat-bubble-received",
          )}
        >
          <p className="text-sm leading-relaxed wrap-break-word">
            {message.content}
          </p>
        </Card>

        {isGroupBreak && (
          <span className="text-sm text-muted-foreground px-1">
            {formatMessageTime(new Date(message.createdAt))}
          </span>
        )}

        {message.isOwn && message._id === selectedConver.lastMessage?._id && (
          <Badge
            variant="outline"
            className={cn(
              "text-xs px-1.5 py-0.5 border-0",
              lastMessageStatus === "seen"
                ? "bg-primary/20 text-primary"
                : "bg-muted text-muted-foreground",
            )}
          >
            {lastMessageStatus}
          </Badge>
        )}
      </div>
    </div>
  );
};

export default ChatMessageItem;
