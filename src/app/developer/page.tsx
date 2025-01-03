'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Report {
  id: number
  title: string
  description: string
  createdAt: string
}

interface Log {
  id: number
  action: string
  details: string
  createdAt: string
}

export default function DeveloperPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [logs, setLogs] = useState<Log[]>([])
  const [selectedLog, setSelectedLog] = useState<Log | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Fetch reports and logs from localStorage
    const storedReports = JSON.parse(localStorage.getItem('reports') || '[]')
    setReports(storedReports)

    // For this example, we'll generate some dummy logs
    const dummyLogs = [
      { id: 1, action: 'User Login', details: 'User John Doe logged in', createdAt: new Date().toISOString() },
      { id: 2, action: 'Ticket Created', details: 'New ticket #1234 created', createdAt: new Date().toISOString() },
      { id: 3, action: 'Report Submitted', details: 'New report submitted by user', createdAt: new Date().toISOString() },
    ]
    setLogs(dummyLogs)
  }, [])

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Developer Dashboard</h1>
        <Button onClick={() => router.push('/dashboard')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Main Dashboard
        </Button>
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">Reports</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>{report.id}</TableCell>
                  <TableCell>{report.title}</TableCell>
                  <TableCell>{new Date(report.createdAt).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Logs</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.id}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" onClick={() => setSelectedLog(log)}>View Details</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Log Details</DialogTitle>
                        </DialogHeader>
                        <div className="mt-2">
                          <p><strong>ID:</strong> {selectedLog?.id}</p>
                          <p><strong>Action:</strong> {selectedLog?.action}</p>
                          <p><strong>Details:</strong> {selectedLog?.details}</p>
                          <p><strong>Created At:</strong> {selectedLog && new Date(selectedLog.createdAt).toLocaleString()}</p>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

