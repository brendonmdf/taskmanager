import Link from 'next/link'
import { Search, Bell } from 'lucide-react'
import { Input } from "@/components/ui/input"

export function Header() {
  return (
    <header className="border-b bg-white">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center flex-1">
          <Search className="w-5 h-5 text-gray-500 mr-2" />
          <Input type="search" placeholder="Search Tasks" className="max-w-sm" />
        </div>
        <nav>
          <ul className="flex items-center space-x-4">
            <li>
              <Link href="/dashboard" className="text-sm font-medium">Dashboard</Link>
            </li>
            <li>
              <Link href="/my-tasks" className="text-sm font-medium">My Tasks</Link>
            </li>
            <li>
              <Link href="/reporting" className="text-sm font-medium">Reporting</Link>
            </li>
            <li>
              <Link href="/portfolios" className="text-sm font-medium">Portfolios</Link>
            </li>
            <li>
              <Link href="/goals" className="text-sm font-medium">Goals</Link>
            </li>
          </ul>
        </nav>
        <div className="flex items-center space-x-4">
          <Bell className="w-5 h-5 text-gray-500" />
        </div>
      </div>
    </header>
  )
}

