import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { TaskCard } from './task-card'
import type { Column, Task } from '@/app/types/kanban'

interface KanbanColumnProps {
  column: Column
  onTaskClick: (taskId: string) => void
}

export function KanbanColumn({ column, onTaskClick }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  })

  return (
    <div className="w-72 bg-gray-100 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">{column.title}</h3>
        <span className="text-sm text-gray-500">{column.tasks.length}</span>
      </div>
      <div ref={setNodeRef}>
        <SortableContext items={column.tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {column.tasks.map((task) => (
            <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task.id)} />
          ))}
        </SortableContext>
      </div>
    </div>
  )
}

