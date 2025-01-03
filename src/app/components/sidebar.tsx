import Link from 'next/link'
import { FileText, ShoppingCart, FolderClosed, Settings, Code, MessageSquare } from 'lucide-react'

const sidebarItems = [
  { icon: MessageSquare, label: 'Messaging', count: 0, href: '/messaging' },
  { icon: FileText, label: 'Drive Files', count: 0, href: '/drive-files' },
  { icon: FolderClosed, label: 'Boards', count: 5, href: '/dashboard' },
  { icon: ShoppingCart, label: 'Pedidos', count: 0, href: '/dashboard' },
  { icon: Settings, label: 'Settings', count: 2, href: '/dashboard' },
  { icon: Code, label: 'Developer', count: 0, href: '/developer' },
  
]

export function Sidebar() {
  return (
    <div className="w-64 bg-white border-r flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-xl font-semibold">Task Manager.</h1>
      </div>
      <nav className="flex-1 overflow-y-auto">
        <ul className="p-2 space-y-2">
          {sidebarItems.map((item, index) => (
            <li key={index}>
              <Link href={item.href} className="flex items-center p-2 rounded-lg hover:bg-gray-100">
                <item.icon className="w-5 h-5 mr-3 text-gray-500" />
                <span className="flex-1">{item.label}</span>
                {item.count > 0 && (
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {item.count}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

