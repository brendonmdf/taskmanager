import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, Paperclip, ChevronRight, Clock, Tag } from 'lucide-react'
import type { Task, Comment } from '@/app/types/kanban'
import { columnOrder } from '@/app/types/kanban'

interface TaskModalProps {
  task: Task | null
  isOpen: boolean
  onClose: () => void
  onUpdate: (updatedTask: Task) => void
}

export function TaskModal({ task, isOpen, onClose, onUpdate }: TaskModalProps) {
  const [localTask, setLocalTask] = useState<Task | null>(task)
  const [newComment, setNewComment] = useState('')
  const [newAttachment, setNewAttachment] = useState<File | null>(null)
  const [selectedPhase, setSelectedPhase] = useState<Task['status'] | ''>('')

  useEffect(() => {
    setLocalTask(task)
    setSelectedPhase('')
  }, [task])

  if (!localTask) return null

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        author: 'Current User',
        content: newComment,
        createdAt: new Date().toISOString(),
      }
      setLocalTask(prev => prev ? {...prev, comments: [...prev.comments, comment]} : null)
      setNewComment('')
    }
  }

  const handleAttachmentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setNewAttachment(file)
      setLocalTask(prev => prev ? {...prev, attachments: [...prev.attachments, URL.createObjectURL(file)]} : null)
    }
  }

  const handleMoveToNextPhase = () => {
    if (selectedPhase && localTask) {
      setLocalTask(prev => prev ? {...prev, status: selectedPhase} : null)
      setSelectedPhase('')
    }
  }

  const handleSave = () => {
    if (localTask) {
      onUpdate(localTask)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{localTask.title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>Created on {new Date().toLocaleDateString()}</span>
            <Tag className="w-4 h-4 ml-4" />
            <span>{localTask.status}</span>
          </div>
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
              <TabsTrigger value="attachments">Attachments</TabsTrigger>
            </TabsList>
            <TabsContent value="details">
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                  <Textarea
                    id="description"
                    value={localTask.description}
                    onChange={(e) => setLocalTask(prev => prev ? {...prev, description: e.target.value} : null)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Assignees</Label>
                  <div className="flex space-x-2 mt-1">
                    {localTask.assignees.map((assignee, index) => (
                      <Avatar key={index}>
                        <AvatarImage src={`/placeholder.svg?height=32&width=32`} />
                        <AvatarFallback>{assignee[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="comments">
              <div className="space-y-4 mt-4">
                {localTask.comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Avatar>
                        <AvatarImage src={`/placeholder.svg?height=32&width=32`} />
                        <AvatarFallback>{comment.author[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold">{comment.author}</p>
                        <p className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                    <p className="mt-2 text-sm">{comment.content}</p>
                  </div>
                ))}
                <form onSubmit={handleCommentSubmit} className="mt-4">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="mb-2"
                  />
                  <Button type="submit" size="sm">Add Comment</Button>
                </form>
              </div>
            </TabsContent>
            <TabsContent value="attachments">
              <div className="space-y-4 mt-4">
                {localTask.attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Paperclip className="w-4 h-4" />
                    <a href={attachment} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      Attachment {index + 1}
                    </a>
                  </div>
                ))}
                <Label htmlFor="attachment" className="cursor-pointer inline-flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800">
                  <Input
                    id="attachment"
                    type="file"
                    className="hidden"
                    onChange={handleAttachmentUpload}
                  />
                  <Paperclip className="w-4 h-4" />
                  <span>Attach a file</span>
                </Label>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <div className="flex justify-between items-center mt-6">
          <Select value={selectedPhase} onValueChange={setSelectedPhase}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select next phase" />
            </SelectTrigger>
            <SelectContent>
              {columnOrder.map((phase) => (
                <SelectItem key={phase} value={phase}>
                  {phase.charAt(0).toUpperCase() + phase.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleMoveToNextPhase} disabled={!selectedPhase}>
            Move to Selected Phase <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

