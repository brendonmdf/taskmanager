import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Task } from "@/app/types/kanban"

interface ListViewProps {
  tasks: Task[]
  onTaskClick: (taskId: string) => void
}

export function ListView({ tasks, onTaskClick }: ListViewProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Assignees</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((task) => (
          <TableRow key={task.id}>
            <TableCell>{task.title}</TableCell>
            <TableCell>{task.status}</TableCell>
            <TableCell>{task.assignees.join(", ")}</TableCell>
            <TableCell>
              <Button variant="ghost" onClick={() => onTaskClick(task.id)}>View Details</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

