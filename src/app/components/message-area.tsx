'use client'

import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, UserPlus, UserMinus } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Message {
  id: string
  sender: string
  content: string
  timestamp: string
}

interface MessageAreaProps {
  selectedChat: string | null
}

export function MessageArea({ selectedChat }: MessageAreaProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMember, setNewMember] = useState('')
  const [groupMembers, setGroupMembers] = useState<string[]>([])

  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedChat) {
        try {
          const response = await fetch(`/api/chats/${selectedChat}/messages`)
          if (!response.ok) {
            throw new Error('Failed to fetch messages')
          }
          const fetchedMessages: Message[] = await response.json()
          setMessages(fetchedMessages)

          const membersResponse = await fetch(`/api/chats/${selectedChat}/members`)
          if (!membersResponse.ok) {
            throw new Error('Failed to fetch group members')
          }
          const fetchedMembers: string[] = await membersResponse.json()
          setGroupMembers(fetchedMembers)
        } catch (error) {
          console.error('Error fetching data:', error)
        }
      }
    }

    fetchMessages()
  }, [selectedChat])

  const handleAddMember = async () => {
    if (newMember && !groupMembers.includes(newMember)) {
      try {
        const response = await fetch(`/api/chats/${selectedChat}/members`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ memberName: newMember }),
        })
        if (!response.ok) {
          throw new Error('Failed to add member')
        }
        setGroupMembers([...groupMembers, newMember])
        setNewMember('')
      } catch (error) {
        console.error('Error adding member:', error)
      }
    }
  }

  const handleRemoveMember = async (member: string) => {
    try {
      const response = await fetch(`/api/chats/${selectedChat}/members/${member}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Failed to remove member')
      }
      setGroupMembers(groupMembers.filter(m => m !== member))
    } catch (error) {
      console.error('Error removing member:', error)
    }
  }

  if (!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select a chat to start messaging
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 border-b flex justify-between items-center">
        <div className="font-semibold">Chat Name</div>
        <div className="flex items-center space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <UserPlus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Member to Group</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newMember}
                    onChange={(e) => setNewMember(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <Button onClick={handleAddMember}>Add Member</Button>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Group Members</DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-[200px]">
                {groupMembers.map((member, index) => (
                  <div key={index} className="flex justify-between items-center py-2">
                    <span>{member}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMember(member)}
                    >
                      <UserMinus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <ScrollArea className="flex-1 p-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex mb-4 ${message.sender === 'You' ? 'justify-end' : ''}`}>
            {message.sender !== 'You' && (
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${message.sender}`} />
                <AvatarFallback>{message.sender[0]}</AvatarFallback>
              </Avatar>
            )}
            <div className={`rounded-lg p-2 max-w-[70%] ${
              message.sender === 'You' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}>
              <div className="font-semibold">{message.sender}</div>
              <div>{message.content}</div>
              <div className="text-xs text-right mt-1">{message.timestamp}</div>
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  )
}

