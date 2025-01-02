'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/app/components/sidebar'
import { Header } from '@/app/components/header'
import { KanbanBoard } from '@/app/components/kanban-board'
import { Button } from "@/components/ui/button"
import { PlusCircle } from 'lucide-react'
import type { Task } from '@/app/types/kanban'

export default function DashboardPage() {
  const router = useRouter()
  const [newTickets, setNewTickets] = useState<Task[]>([])

  useEffect(() => {
    const storedTickets = JSON.parse(localStorage.getItem('tickets') || '[]')
    setNewTickets(storedTickets)
  }, [])

  useEffect(() => {
    const refreshTickets = () => {
      const storedTickets = JSON.parse(localStorage.getItem('tickets') || '[]');
      setNewTickets(storedTickets);
    };

    refreshTickets();

    window.addEventListener('focus', refreshTickets);
    return () => window.removeEventListener('focus', refreshTickets);
  }, []);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <Button onClick={() => router.push('/create-ticket')}>
              <PlusCircle className="mr-2 h-4 w-4" /> Create Ticket
            </Button>
          </div>
          <KanbanBoard initialTickets={newTickets} />
        </main>
      </div>
    </div>
  )
}
