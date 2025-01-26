'use client'

import { useState } from 'react'
import { apiClient } from '@/lib/api-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { Plus, Coffee } from 'lucide-react'

interface AddUserFormProps {
  onUserAdded: () => void
}

export function AddUserForm({ onUserAdded }: AddUserFormProps) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const isValid = firstName.trim() !== '' && lastName.trim() !== ''

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!isValid) return

    setIsLoading(true)
    try {
      await apiClient.createUser(firstName.trim(), lastName.trim())
      setFirstName('')
      setLastName('')
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
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
        <Input
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          disabled={isLoading}
          required
        />
        <Input
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>
      <Button
        type="submit"
        size="icon"
        disabled={!isValid || isLoading}
        className="min-w-10 w-full sm:w-auto"
      >
        {isLoading ? (
          <Coffee className="h-4 w-4 animate-spin" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
      </Button>
    </form>
  )
}
