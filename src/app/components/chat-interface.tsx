'use client'

import { useState } from 'react'
import { ChatList } from './chat-list'
import { MessageArea } from './message-area'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send } from 'lucide-react'

interface ChatInterfaceProps {
  selectedChat: string | null
  setSelectedChat: (chatId: string | null) => void
}

export function ChatInterface({ selectedChat, setSelectedChat }: ChatInterfaceProps) {
  const [message, setMessage] = useState('')

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      // Here you would typically send the message to your backend
      console.log('Sending message:', message)
      setMessage('')
    }
  }

  return (
    <div className="flex h-[calc(100vh-12rem)] border rounded-lg overflow-hidden">
      <ChatList selectedChat={selectedChat} setSelectedChat={setSelectedChat} />
      <div className="flex flex-col flex-1">
        <MessageArea selectedChat={selectedChat} />
        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button onClick={handleSendMessage}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

