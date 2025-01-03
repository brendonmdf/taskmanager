'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle } from 'lucide-react'
import type { Task } from '@/app/types/kanban'

export default function ExternalTicketPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newTicket: Task = {
      id: Date.now().toString(),
      title,
      description,
      status: 'external',
      assignees: [],
      comments: [],
      attachments: []
    }
    try {
      const existingTickets = JSON.parse(localStorage.getItem('tickets') || '[]')
      localStorage.setItem('tickets', JSON.stringify([...existingTickets, newTicket]))
      setNotification({ type: 'success', message: 'Ticket created successfully!' })
      setTitle('')
      setDescription('')
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to create ticket. Please try again.' })
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {notification && (
        <Alert variant={notification.type === 'success' ? 'default' : 'destructive'} className="mb-4">
          {notification.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
          <AlertTitle>{notification.type === 'success' ? 'Success' : 'Error'}</AlertTitle>
          <AlertDescription>{notification.message}</AlertDescription>
        </Alert>
      )}
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create New External Ticket</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">Create Ticket</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

