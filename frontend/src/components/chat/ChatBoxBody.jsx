import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import ChatMessageItem from "./ChatMessageItem";
import InfiniteScroll from "react-infinite-scroll-component";
import { useChatStore } from "@/stores/chatStore";

const ChatBoxBody = ({ allMessages, selectedConver, activeConversationId }) => {
  const [lastMessageStatus, setLastMessageStatus] = useState("sent");
  //ref
  const messagesEndRef = useRef(null);
  const messages = allMessages[activeConversationId]?.items || [];
  const reservedMessages = [...messages].reverse();
  const hasMore = allMessages[activeConversationId]?.hasMore || false;
  // const hasMore = true;
  console.log(messages);
  const { chatGetAllMessages } = useChatStore();
  console.log("hasMore", hasMore);

  useEffect(() => {
    const lastMessage = selectedConver?.lastMessage;
    if (!lastMessage) {
      return;
    }
    const seenBy = selectedConver?.seenBy || [];
    console.log("seenBy", seenBy);

    setLastMessageStatus(seenBy.length > 0 ? "seen" : "sent");
  }, [selectedConver]);
  useLayoutEffect(() => {
    if (!messagesEndRef.current) {
      return;
    }
    messagesEndRef.current.scrollIntoView({
      // behavior: 'smooth',
      block: "end",
    });
  }, [activeConversationId]);
  const getMoreMessages = async () => {
    console.log("activeConversationId", activeConversationId);
    if (!activeConversationId) {
      return;
    }

    try {
      const res = await chatGetAllMessages(activeConversationId);
      console.log("more conver", res);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div
      id="scrollableDiv"
      className="flex flex-col overflow-y-auto overflow-x-hidden px-4 py-3"
      style={{ height: "400px" }}
    >
      <div ref={messagesEndRef} />
      <InfiniteScroll
        dataLength={reservedMessages.length}
        next={() => console.log("loading more ...")}
        hasMore={hasMore}
        inverse={true}
        //  height={400}
        scrollableTarget="scrollableDiv"
        loader={<p className="text-center">Loading...</p>}
        style={{
          display: "flex",
          flexDirection: "column-reverse",
        }}
      >
        {reservedMessages?.map((msg, index) => (
          <ChatMessageItem
            key={msg._id || index}
            message={msg}
            index={index}
            messages={reservedMessages}
            selectedConver={selectedConver}
            lastMessageStatus={lastMessageStatus}
          />
        ))}
      </InfiniteScroll>
      <div />
    </div>
  );
};

export default ChatBoxBody;
