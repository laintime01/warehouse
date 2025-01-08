'use client'

import { useEffect, useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, Filter, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
import { ItemDialog } from './item-dialog'
import { useToast } from "@/hooks/use-toast"

type Item = {
  id: string
  name: string
  details: string
  position: string    // e.g., "A-1-1-01"
  quantity: number
  plannedQuantity: number
  status: 'match' | 'mismatch' | 'empty' | 'unplanned'
  lastUpdated: Date
}

export function WarehouseSystem() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editItem, setEditItem] = useState<Item | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const { toast } = useToast()

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

  useEffect(() => {
    fetchItems()
  }, [])

  const handleSearch = () => {
    setLoading(true)
    fetchItems(searchQuery)
  }

  const handleSubmit = async (data: Omit<Item, 'id' | 'status' | 'lastUpdated'>) => {
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

  const handleEdit = async (id: string, data: Omit<Item, 'id' | 'status' | 'lastUpdated'>) => {
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

  const getStatusBadge = (status: Item['status']) => {
    const styles = {
      'match': 'bg-green-100 text-green-800',
      'mismatch': 'bg-red-100 text-red-800',
      'empty': 'bg-yellow-100 text-yellow-800',
      'unplanned': 'bg-blue-100 text-blue-800'
    }
    return styles[status] || ''
  }

  const getStatusIcon = (status: Item['status']) => {
    switch (status) {
      case 'match':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case 'mismatch':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'empty':
      case 'unplanned':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
    }
  }

  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.details.toLowerCase().includes(searchQuery.toLowerCase())

    if (statusFilter === 'all') return matchesSearch
    return matchesSearch && item.status === statusFilter
  })

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
                    placeholder="Search locations or items..."
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
              <div className="flex gap-2">
                <Tabs defaultValue="all" onValueChange={setStatusFilter} className="w-[400px]">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="match">Match</TabsTrigger>
                    <TabsTrigger value="mismatch">Mismatch</TabsTrigger>
                    <TabsTrigger value="empty">Empty</TabsTrigger>
                  </TabsList>
                </Tabs>
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
            </div>

            <div className="rounded-lg border shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Location</TableHead>
                    <TableHead>Planned Item</TableHead>
                    <TableHead>Planned Qty</TableHead>
                    <TableHead>Actual Item</TableHead>
                    <TableHead>Actual Qty</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Variance</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-10">
                        <div className="flex items-center justify-center text-muted-foreground">
                          Loading...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-10">
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
                    filteredItems.map((item) => {
                      const variance = item.quantity - item.plannedQuantity
                      const hasVariance = variance !== 0

                      return (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.position}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.plannedQuantity}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(item.status)}
                              <Badge className={getStatusBadge(item.status)}>
                                {item.status.toUpperCase()}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            {hasVariance && (
                              <span className={variance < 0 ? 'text-red-500' : 'text-green-500'}>
                                {variance > 0 ? '+' : ''}{variance}
                              </span>
                            )}
                          </TableCell>
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
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Total Locations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{items.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Matching</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {items.filter(l => l.status === 'match').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Mismatched</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {items.filter(l => l.status === 'mismatch').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Empty</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {items.filter(l => l.status === 'empty').length}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ItemDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
        isEdit={!!editItem}
        initialData={editItem}
        onSubmit={(data) => {
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