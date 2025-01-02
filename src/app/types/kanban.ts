export interface Comment {
    id: string
    author: string
    content: string
    createdAt: string
  }
  
  export interface Task {
    id: string
    title: string
    description: string
    status: 'backlog' | 'todo' | 'in-progress' | 'done'
    assignees: string[]
    comments: Comment[]
    attachments: string[]
  }
  
  export interface Column {
    id: string
    title: string
    tasks: Task[]
  }
  
  export const columnOrder: Column['id'][] = ['backlog', 'todo', 'in-progress', 'done']
  
  