'use client'

import { useState, useEffect } from 'react'
import { DndContext, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { KanbanColumn } from './kanban-column'
import { TaskModal } from './task-modal'
import { ListView } from './list-view'
import { Button } from "@/components/ui/button"
import { CalendarIcon, LayoutGrid, List } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import type { Column, Task } from '@/app/types/kanban'

const initialColumns: Column[] = [
  {
    id: 'external',
    title: 'External Tickets',
    tasks: [],
  },
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
  const [view, setView] = useState<'board' | 'list'>('board')
  const [date, setDate] = useState<Date | undefined>(undefined)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/tasks')
        if (!response.ok) {
          throw new Error('Failed to fetch tasks')
        }
        const tasks: Task[] = await response.json()
        setColumns((prevColumns) => {
          const updatedColumns = prevColumns.map(column => ({...column, tasks: []}));
          const filteredTasks = date
            ? tasks.filter(task => {
                const taskDate = new Date(task.createdAt);
                return taskDate.toDateString() === date.toDateString();
              })
            : tasks;
          
          filteredTasks.forEach((task) => {
            const columnIndex = updatedColumns.findIndex((col) => col.id === task.status);
            if (columnIndex !== -1) {
              updatedColumns[columnIndex].tasks.push(task);
            }
          });
          return updatedColumns;
        });
      } catch (error) {
        console.error('Error fetching tasks:', error)
      }
    }

    fetchTasks()
  }, [date])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  async function handleDragEnd(event: any) {
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

        // Update the task status in the database
        fetch(`/api/tasks/${activeTask.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: overColumnId }),
        }).catch(error => console.error('Error updating task status:', error))

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

  const allTasks = columns.flatMap(column => column.tasks)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <h2 className="text-2xl font-bold">Task Boards</h2>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon">
                <CalendarIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {date && (
            <Button variant="ghost" onClick={() => setDate(undefined)}>
              Clear filter: {format(date, "PPP")}
            </Button>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant={view === 'board' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setView('board')}
          >
            <LayoutGrid className="h-4 w-4 mr-2" />
            Board View
          </Button>
          <Button 
            variant={view === 'list' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setView('list')}
          >
            <List className="h-4 w-4 mr-2" />
            List View
          </Button>
        </div>
      </div>
      {view === 'board' ? (
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
      ) : (
        <ListView tasks={allTasks} onTaskClick={handleTaskClick} />
      )}
      <TaskModal
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        onUpdate={handleTaskUpdate}
      />
    </div>
  )
}

