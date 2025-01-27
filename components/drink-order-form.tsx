'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { apiClient } from '@/app/api/api-client'
import { User } from '@/app/api/api-client.types'

interface DrinkOrderFormProps {
  user: User;
  onOrderCreated: () => void;
}

const DRINK_TYPES = ['Tea', 'Coffee', 'Hot Chocolate'];

export function DrinkOrderForm({ user, onOrderCreated }: DrinkOrderFormProps) {
  const [type, setType] = useState(DRINK_TYPES[0])
  const [specification, setSpecification] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      await apiClient.createDrinkOrder({
        userId: user.id,
        name: `${type} for ${user.firstName}`,
        type,
        additionalSpecification: specification ? { notes: specification } : undefined
      })

      onOrderCreated()
      toast({
        title: 'Success',
        description: 'Drink preferences saved',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save drink preferences',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Drink Type</Label>
        <Select value={type} onValueChange={setType} required>
          <SelectTrigger>
            <SelectValue placeholder="Select drink type" />
          </SelectTrigger>
          <SelectContent>
            {DRINK_TYPES.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Special Instructions</Label>
        <Input
          placeholder="e.g., 2 sugars, milk"
          value={specification}
          onChange={(e) => setSpecification(e.target.value)}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save Preferences'}
      </Button>
    </form>
  )
}
