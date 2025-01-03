'use client'

import { useState } from 'react'
import { Sidebar } from '@/app/components/sidebar'
import { Header } from '@/app/components/header'
import { ChatInterface } from '@/app/components/chat-interface'
import { Button } from "@/components/ui/button"
import { PlusCircle } from 'lucide-react'

export default function MessagingPage() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Messaging</h1>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> New Chat
            </Button>
          </div>
          <ChatInterface selectedChat={selectedChat} setSelectedChat={setSelectedChat} />
        </main>
      </div>
    </div>
  )
}

