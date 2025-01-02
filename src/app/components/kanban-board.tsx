'use client'

import { useState, useEffect } from 'react'
import { DndContext, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { KanbanColumn } from './kanban-column'
import { TaskModal } from './task-modal'
import { Button } from "@/components/ui/button"
import { Calendar, LayoutGrid, List } from 'lucide-react'
import type { Column, Task } from '@/app/types/kanban'

const initialColumns: Column[] = [
  {
    id: 'backlog',
    title: 'Backlog Tasks',
    tasks: [],
  },
  {
    id: 'todo',
    title: 'To Do Tasks',
    tasks: [],
  },
  {
    id: 'in-progress',
    title: 'In Process',
    tasks: [],
  },
  {
    id: 'done',
    title: 'Done',
    tasks: [],
  },
]

interface KanbanBoardProps {
  initialTickets: Task[]
}

export function KanbanBoard({ initialTickets }: KanbanBoardProps) {
  const [columns, setColumns] = useState(initialColumns)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  useEffect(() => {
    setColumns((prevColumns) => {
      const updatedColumns = prevColumns.map(column => ({...column, tasks: [...column.tasks]}));
      initialTickets.forEach((ticket) => {
        const columnIndex = updatedColumns.findIndex((col) => col.id === ticket.status);
        if (columnIndex !== -1) {
          const existingTaskIndex = updatedColumns[columnIndex].tasks.findIndex(t => t.id === ticket.id);
          if (existingTaskIndex === -1) {
            updatedColumns[columnIndex].tasks.push(ticket);
          }
        }
      });
      return updatedColumns;
    });
  }, [initialTickets])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function handleDragEnd(event: any) {
    const { active, over } = event

    if (!over) return

    const activeColumnId = active.data.current.sortable.containerId
    const overColumnId = over.id

    if (activeColumnId !== overColumnId) {
      setColumns((columns) => {
        const activeColumn = columns.find((col) => col.id === activeColumnId)
        const overColumn = columns.find((col) => col.id === overColumnId)

        if (!activeColumn || !overColumn) return columns

        const activeTask = activeColumn.tasks.find((task) => task.id === active.id)
        if (!activeTask) return columns

        return columns.map((col) => {
          if (col.id === activeColumnId) {
            return {
              ...col,
              tasks: col.tasks.filter((task) => task.id !== active.id),
            }
          } else if (col.id === overColumnId) {
            return {
              ...col,
              tasks: [...col.tasks, { ...activeTask, status: overColumnId as Task['status'] }],
            }
          } else {
            return col
          }
        })
      })
    }
  }

  const handleTaskClick = (taskId: string) => {
    const task = columns.flatMap(col => col.tasks).find(t => t.id === taskId);
    if (task) {
      setSelectedTask(task);
    }
  };

  const handleTaskUpdate = (updatedTask: Task) => {
    setColumns((prevColumns) => 
      prevColumns.map((column) => ({
        ...column,
        tasks: column.tasks.map((task) => 
          task.id === updatedTask.id ? updatedTask : task
        ),
      }))
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <h2 className="text-2xl font-bold">Task Boards</h2>
          <Button variant="outline" size="icon">
            <Calendar className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <LayoutGrid className="h-4 w-4 mr-2" />
            Board View
          </Button>
          <Button variant="outline" size="sm">
            <List className="h-4 w-4 mr-2" />
            List View
          </Button>
        </div>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
      >
        <div className="flex space-x-4 overflow-x-auto pb-4">
          <SortableContext items={columns.map(col => col.id)} strategy={horizontalListSortingStrategy}>
            {columns.map((column) => (
              <KanbanColumn 
                key={column.id} 
                column={column} 
                onTaskClick={handleTaskClick}
              />
            ))}
          </SortableContext>
        </div>
      </DndContext>
      <TaskModal
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        onUpdate={handleTaskUpdate}
      />
    </div>
  )
}

