'use client'

import { useState } from 'react'
import { apiClient } from '@/lib/api-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface AddUserFormProps {
  onUserAdded: () => void
}

export function AddUserForm({ onUserAdded }: AddUserFormProps) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      await apiClient.createUser(firstName, lastName)
      setFirstName('')
      setLastName('')
      setIsOpen(false)
      onUserAdded()
      toast({
        title: 'Success',
        description: 'User added successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add user',
        variant: 'destructive',
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger id="add-user-dialog">Add User</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <Input
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <Button type="submit" className="w-full">Add User</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
