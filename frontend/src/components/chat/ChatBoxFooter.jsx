import React, { useState } from "react";
import { Send } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { Input } from "../ui/input";
import { useChatStore } from "@/stores/chatStore";
import { toast } from "sonner";
const ChatBoxFooter = ({selectedConver}) => {
  console.log("selectedConver", selectedConver)
  const {user} = useAuthStore();
  const [value, setValue] = useState("");
  const {chatSendPrivateMessage,chatSendGroupMessage} = useChatStore();
  if(!user) return
  const handleSendMessage = async ()=>{
    if(!value.trim()) return
    try{
      if(selectedConver.type === 'private'){
        const participants = selectedConver.participants;
        const otherUser = participants.filter((p) => p._id !== user._id)[0]
        await chatSendPrivateMessage(otherUser._id,value)
      }else{
        await chatSendGroupMessage(selectedConver._id, value)
      }
    }catch(err){
      console.log(err)
      toast.error("error when send message !!!")
    }finally{
        setValue("")
      }
  }
  const handleKeyPress = (e) =>{
    if(e.key === "Enter"){
      e.preventDefault();
      handleSendMessage();
    }
  }
  return (
    <div className="border-t p-3">
      <div className="flex items-center gap-2">
        <Input
          value={value}
          onKeyPress={handleKeyPress}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded-full border resize-none px-4 py-2 text-sm focus:outline-none focus:ring-1"
        />
        <button
        onClick={handleSendMessage}
        className="rounded-full p-2 bg-blue-500 text-gray-950 hover:bg-blue-600">
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default ChatBoxFooter;
