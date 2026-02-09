import { useChatStore } from "@/stores/chatStore";
import ChatBoxSkeleton from "./ChatBoxSkeleton";
import ChatWelcome from "./ChatWelcome";
import ChatBoxHeader from "./ChatBoxHeader";
import ChatBoxBody from "./ChatBoxBody";
import ChatBoxFooter from "./ChatBoxFooter";

const ChatBox = ({onClose}) => {
  const { activeConversationId, conversations, messageLoading, messages: allMessages } =
    useChatStore();
    const messages = allMessages[activeConversationId]?.items || [];
  const selectedConver =
    conversations.find((c) => c._id === activeConversationId) || null;
  if (!selectedConver) {
    return <ChatWelcome onCloseChat={onClose} />;
  }
  if (messageLoading) {
    return <ChatBoxSkeleton />;
  }
  if(!messages?.length<0){
    return (
      <div className="flex h-full justify-center items-center text-muted-foreground">
        do not have any message in this conversation
      </div>
    )
  }
  return (
    <div className="flex h-full w-full max-w-lg flex-col rounded-xl border bg-background shadow-sm">
      {/* Header */}
      <ChatBoxHeader onCloseChat={onClose} chat={selectedConver} />

      {/* Messages */}
      <ChatBoxBody messages={messages} selectedConver={selectedConver} />

      {/* Input */}
      <ChatBoxFooter selectedConver={selectedConver} />
    </div>
  );
};

export default ChatBox;
