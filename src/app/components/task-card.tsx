import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, Paperclip } from 'lucide-react'
import type { Task } from "@/app/types/kanban"

interface TaskCardProps {
  task: Task
  onClick: () => void
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <Card 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      className="mb-3 cursor-pointer"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
    >
      <CardContent className="p-3">
        <div className="text-sm font-medium mb-2">{task.title}</div>
        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {task.assignees.map((assignee, i) => (
              <Avatar key={i} className="h-6 w-6 border-2 border-background">
                <AvatarImage src={`/placeholder.svg?height=24&width=24`} />
                <AvatarFallback>{assignee[0].toUpperCase()}</AvatarFallback>
              </Avatar>
            ))}
          </div>
          <div className="flex items-center space-x-3 text-gray-500">
            <div className="flex items-center text-xs">
              <MessageSquare className="mr-1 h-4 w-4" />
              {task.comments.length}
            </div>
            <div className="flex items-center text-xs">
              <Paperclip className="mr-1 h-4 w-4" />
              {task.attachments.length}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

