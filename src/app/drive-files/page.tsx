'use client'

import { useState } from 'react'
import { Folder, File, Plus, Upload, ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useRouter } from 'next/navigation'

interface FileItem {
  id: string
  name: string
  type: 'file' | 'folder'
  content?: string
}

export default function DriveFilesPage() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [currentFolder, setCurrentFolder] = useState<string | null>(null)
  const [newItemName, setNewItemName] = useState('')
  const [newItemType, setNewItemType] = useState<'file' | 'folder'>('file')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const router = useRouter()

  const currentFiles = files.filter(file => 
    currentFolder === null ? !file.name.includes('/') : file.name.startsWith(`${currentFolder}/`)
  )

  const handleCreateItem = () => {
    if (newItemName) {
      const newItem: FileItem = {
        id: Date.now().toString(),
        name: currentFolder ? `${currentFolder}/${newItemName}` : newItemName,
        type: newItemType,
        content: newItemType === 'file' ? '' : undefined
      }
      setFiles([...files, newItem])
      setNewItemName('')
      setIsDialogOpen(false)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const newFile: FileItem = {
          id: Date.now().toString(),
          name: currentFolder ? `${currentFolder}/${file.name}` : file.name,
          type: 'file',
          content: e.target?.result as string
        }
        setFiles([...files, newFile])
      }
      reader.readAsText(file)
    }
  }

  const handleFolderClick = (folderName: string) => {
    setCurrentFolder(folderName)
  }

  const handleBackClick = () => {
    if (currentFolder) {
      const parts = currentFolder.split('/')
      parts.pop()
      setCurrentFolder(parts.length > 0 ? parts.join('/') : null)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Drive Files</h1>
        <Button onClick={() => router.push('/dashboard')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
      </div>
      <div className="flex space-x-2 mb-4">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> New Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Item</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type
                </Label>
                <select
                  id="type"
                  value={newItemType}
                  onChange={(e) => setNewItemType(e.target.value as 'file' | 'folder')}
                  className="col-span-3"
                >
                  <option value="file">File</option>
                  <option value="folder">Folder</option>
                </select>
              </div>
            </div>
            <Button onClick={handleCreateItem}>Create</Button>
          </DialogContent>
        </Dialog>
        <Input
          type="file"
          onChange={handleFileUpload}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload">
          <Button as="span">
            <Upload className="mr-2 h-4 w-4" /> Upload File
          </Button>
        </label>
        {currentFolder && (
          <Button onClick={handleBackClick}>Back</Button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentFiles.map((item) => (
          <div
            key={item.id}
            className="flex items-center p-2 border rounded cursor-pointer hover:bg-gray-100"
            onClick={() => item.type === 'folder' && handleFolderClick(item.name)}
          >
            {item.type === 'folder' ? (
              <Folder className="mr-2 h-6 w-6" />
            ) : (
              <File className="mr-2 h-6 w-6" />
            )}
            <span>{item.name.split('/').pop()}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

