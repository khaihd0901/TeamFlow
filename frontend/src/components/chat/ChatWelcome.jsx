import React from 'react'
import ChatBoxHeader from './ChatBoxHeader'
import { MessageCircleMore } from 'lucide-react'
import ChatBoxFooter from './ChatBoxFooter'

const ChatWelcome = ({onClose}) => {
  return (
    <div className='w-full h-full bg-white rounded-xl shadow'>
      <ChatBoxHeader onCloseChat={onClose}/>
      <div className="flex flex-col bg-primary-foreground rounded-xl flex-1 items-center justify-center h-69">
          <div className="mx-auto mb-3 rounded-full flex items-center justify-center">
            <span><MessageCircleMore className='size-10'/></span>
          </div>
          <h2 className='text-2xl font-medium mb-2 bg-clip-text text-gray-400'>"say hello"</h2>
      </div>
    <ChatBoxFooter/>
    </div>
  )
}

export default ChatWelcome