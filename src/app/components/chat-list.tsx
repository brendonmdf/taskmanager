'use client'

import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, UserPlus, X } from 'lucide-react'

interface Chat {
  id: string
  name: string
  lastMessage: string
  isGroup: boolean
}

interface ChatListProps {
  selectedChat: string | null
  setSelectedChat: (chatId: string | null) => void
}

export function ChatList({ selectedChat, setSelectedChat }: ChatListProps) {
  const [chats, setChats] = useState<Chat[]>([])
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch('/api/chats')
        if (!response.ok) {
          throw new Error('Failed to fetch chats')
        }
        const fetchedChats: Chat[] = await response.json()
        setChats(fetchedChats)
      } catch (error) {
        console.error('Error fetching chats:', error)
      }
    }

    fetchChats()
  }, [])
  const [newGroupName, setNewGroupName] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const handleCreateGroup = async () => {
    if (newGroupName.trim() !== '') {
      try {
        const response = await fetch('/api/chats', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newGroupName, isGroup: true }),
        })
        if (!response.ok) {
          throw new Error('Failed to create group')
        }
        const newGroup: Chat = await response.json()
        setChats([...chats, newGroup])
        setNewGroupName('')
      } catch (error) {
        console.error('Error creating group:', error)
      }
    }
  }

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="w-64 border-r flex flex-col">
      <div className="p-4 border-b">
        <Input
          placeholder="Search chats..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-2"
        />
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full">
              <UserPlus className="mr-2 h-4 w-4" /> New Group
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Group</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <Button onClick={handleCreateGroup}>Create Group</Button>
          </DialogContent>
        </Dialog>
      </div>
      <ScrollArea className="flex-1">
        {filteredChats.map((chat) => (
          <div
            key={chat.id}
            className={`flex items-center p-4 cursor-pointer hover:bg-gray-100 ${
              selectedChat === chat.id ? 'bg-gray-200' : ''
            }`}
            onClick={() => setSelectedChat(chat.id)}
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${chat.name}`} />
              <AvatarFallback>{chat.name[0]}</AvatarFallback>
            </Avatar>
            <div className="ml-4 flex-1 overflow-hidden">
              <div className="font-semibold">{chat.name}</div>
              <div className="text-sm text-gray-500 truncate">{chat.lastMessage}</div>
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  )
}

