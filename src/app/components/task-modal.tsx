import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MessageSquare, Paperclip, ChevronRight } from 'lucide-react'
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

  useEffect(() => {
    setLocalTask(task)
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
    const currentIndex = columnOrder.indexOf(localTask.status)
    if (currentIndex < columnOrder.length - 1) {
      const nextStatus = columnOrder[currentIndex + 1]
      setLocalTask(prev => prev ? {...prev, status: nextStatus as Task['status']} : null)
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{localTask.title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p>{localTask.description}</p>
          <div>
            <h4 className="mb-2 font-semibold">Assignees</h4>
            <div className="flex space-x-2">
              {localTask.assignees.map((assignee, index) => (
                <Avatar key={index}>
                  <AvatarImage src={`/placeholder.svg?height=32&width=32`} />
                  <AvatarFallback>{assignee[0].toUpperCase()}</AvatarFallback>
                </Avatar>
              ))}
            </div>
          </div>
          <div>
            <h4 className="mb-2 font-semibold">Comments</h4>
            {localTask.comments.map((comment) => (
              <div key={comment.id} className="mb-2">
                <p className="text-sm font-semibold">{comment.author}</p>
                <p className="text-sm">{comment.content}</p>
              </div>
            ))}
            <form onSubmit={handleCommentSubmit} className="mt-2">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="mb-2"
              />
              <Button type="submit" size="sm">Add Comment</Button>
            </form>
          </div>
          <div>
            <h4 className="mb-2 font-semibold">Attachments</h4>
            {localTask.attachments.map((attachment, index) => (
              <div key={index} className="mb-2">
                <a href={attachment} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  Attachment {index + 1}
                </a>
              </div>
            ))}
            <Label htmlFor="attachment" className="cursor-pointer">
              <Input
                id="attachment"
                type="file"
                className="hidden"
                onChange={handleAttachmentUpload}
              />
              <div className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800">
                <Paperclip className="w-4 h-4" />
                <span>Attach a file</span>
              </div>
            </Label>
          </div>
        </div>
        <div className="flex justify-between">
          <Button onClick={handleMoveToNextPhase} disabled={localTask.status === 'done'}>
            Move to Next Phase <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

