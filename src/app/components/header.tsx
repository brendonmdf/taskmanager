'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, Bell } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


export function Header() {
  const router = useRouter()

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
              <Link href="" className="text-sm font-medium">My Tasks</Link>
            </li>
            <li>
              <Link href="/developer" className="text-sm font-medium">Reporting</Link>
            </li>
            <li>
              <Link href="" className="text-sm font-medium">Portfolios</Link>
            </li>
            <li>
              <Link href="" className="text-sm font-medium">Goals</Link>
            </li>
          </ul>
        </nav>
        <div className="flex items-center space-x-4">
          <Bell className="w-5 h-5 text-gray-500" />
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-user.jpg" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/profile')}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

