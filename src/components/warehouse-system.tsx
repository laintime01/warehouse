'use client'

import { useEffect, useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Search, Plus } from 'lucide-react'
import { ItemDialog } from './item-dialog'
import { useToast } from "@/hooks/use-toast"

type Item = {
  id: string
  name: string
  details: string
  position: string
  quantity: number
}

export function WarehouseSystem() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editItem, setEditItem] = useState<Item | null>(null)
  const { toast } = useToast()

  // 获取所有物品或搜索物品
  const fetchItems = async (search?: string) => {
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      
      const response = await fetch(`/api/items${search ? `?${params}` : ''}`)
      if (!response.ok) throw new Error('Failed to fetch items')
      
      const data = await response.json()
      setItems(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch items",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // 初始加载
  useEffect(() => {
    fetchItems()
  }, [])

  // 搜索功能
  const handleSearch = () => {
    setLoading(true)
    fetchItems(searchQuery)
  }

  // 添加新物品
  const handleSubmit = async (data: Omit<Item, 'id'>) => {
    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Failed to create item')
      
      toast({
        title: "Success",
        description: "Item created successfully",
      })
      
      setDialogOpen(false)
      fetchItems()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create item",
        variant: "destructive",
      })
    }
  }

  // 编辑物品
  const handleEdit = async (id: string, data: Omit<Item, 'id'>) => {
    try {
      const response = await fetch(`/api/items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Failed to update item')
      
      toast({
        title: "Success",
        description: "Item updated successfully",
      })
      
      setDialogOpen(false)
      fetchItems()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update item",
        variant: "destructive",
      })
    }
  }

  // 删除物品
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      const response = await fetch(`/api/items/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete item')
      
      toast({
        title: "Success",
        description: "Item deleted successfully",
      })
      
      fetchItems()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-900">
              Infinite Cables Production Warehouse Management System
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 flex gap-2">
                <div className="relative flex-1 max-w-md">
                  <Input
                    placeholder="Search items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full pl-10"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                <Button 
                  onClick={handleSearch}
                  variant="secondary"
                >
                  Search
                </Button>
              </div>
              <Button 
                onClick={() => {
                  setEditItem(null)
                  setDialogOpen(true)
                }}
                className="whitespace-nowrap"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add New Item
              </Button>
            </div>

            <div className="rounded-lg border shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead className="w-[100px]">Quantity</TableHead>
                    <TableHead className="w-[150px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10">
                        <div className="flex items-center justify-center text-muted-foreground">
                          Loading...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : items.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <p>No items found</p>
                          <Button
                            variant="link"
                            onClick={() => {
                              setEditItem(null)
                              setDialogOpen(true)
                            }}
                            className="mt-2"
                          >
                            Add your first item
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-mono text-sm">
                          {item.id.slice(0, 8)}
                        </TableCell>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.details}</TableCell>
                        <TableCell>{item.position}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setEditItem(item)
                                setDialogOpen(true)
                              }}
                            >
                              Edit
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDelete(item.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <ItemDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
        isEdit={!!editItem}
        initialData={editItem}
        onSubmit={(data: Omit<Item, 'id'>) => {
          if (editItem) {
            handleEdit(editItem.id, data)
          } else {
            handleSubmit(data)
          }
        }}
      />
    </div>
  )
}