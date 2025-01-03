'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/app/components/sidebar'
import { Header } from '@/app/components/header'
import { KanbanBoard } from '@/app/components/kanban-board'
import { Button } from "@/components/ui/button"
import { PlusCircle } from 'lucide-react'
import { ReportingForm } from '@/app/components/reporting-form'
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

  const handleReportSubmit = (report: { title: string; description: string }) => {
    // Here you would typically send this to your backend
    console.log('Report submitted:', report)
    // For now, we'll just store it in localStorage
    const reports = JSON.parse(localStorage.getItem('reports') || '[]')
    reports.push({ ...report, id: Date.now(), createdAt: new Date().toISOString() })
    localStorage.setItem('reports', JSON.stringify(reports))
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="space-x-2">
              <Button onClick={() => router.push('/create-ticket')}>
                <PlusCircle className="mr-2 h-4 w-4" /> Create Ticket
              </Button>
              <ReportingForm onSubmit={handleReportSubmit} />
            </div>
          </div>
          <KanbanBoard initialTickets={newTickets} />
        </main>
      </div>
    </div>
  )
}

