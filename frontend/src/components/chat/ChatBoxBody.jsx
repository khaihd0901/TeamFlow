
import React from "react";
import ChatMessageItem from "./ChatMessageItem";

const ChatBoxBody = ({ messages,selectedConver }) => {
  return (
    <div className="flex-1 h-40 overflow-y-auto overflow-x-hidden px-4 py-3 space-y-2">
      {messages?.map((msg, index) => (
        <ChatMessageItem 
        key={msg._id || index}
        message={msg} 
        index={index}
        messages={messages}
        selectedConver={selectedConver}
        />
      ))}
      <div />
    </div>
  );
};

export default ChatBoxBody;
