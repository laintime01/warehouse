'use client'

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

interface ItemData {
    name: string
    details: string
    position: string
    quantity: number
    status: 'match' | 'mismatch' | 'empty' | 'unplanned'  // 添加 status
  }

interface ItemDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    isEdit?: boolean
    initialData?: ItemData | null
    onSubmit: (data: ItemData) => void
  }

export function ItemDialog({ 
  open, 
  onOpenChange, 
  isEdit = false,
  initialData = null,
  onSubmit 
}: ItemDialogProps) {
    const [formData, setFormData] = useState<ItemData>({
        name: initialData?.name || '',
        details: initialData?.details || '',
        position: initialData?.position || '',
        quantity: initialData?.quantity || 0,
        status: initialData?.status || 'match'  // 设置默认值
      })
    

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Edit Item' : 'Add New Item'}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? 'Edit item details and quantities' : 'Add a new item to the warehouse'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">
                Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                placeholder="Enter item name"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="details">
                Details
              </Label>
              <Input
                id="details"
                value={formData.details}
                onChange={(e) => setFormData(prev => ({...prev, details: e.target.value}))}
                placeholder="Enter item details"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="position">
                Position
              </Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => setFormData(prev => ({...prev, position: e.target.value}))}
                placeholder="Enter storage position (e.g., A-1-1-01)"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="plannedQuantity">
                  Planned Quantity
                </Label>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="quantity">
                  Actual Quantity
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  min="0"
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({
                    ...prev, 
                    quantity: parseInt(e.target.value) || 0
                  }))}
                  required
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {isEdit ? 'Save Changes' : 'Add Item'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}