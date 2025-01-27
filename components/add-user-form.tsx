'use client'

import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { Plus, Coffee } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import React from 'react'

interface AddUserFormProps {
  onUserAdded: () => void
}

const DRINK_TYPES = ['Tea', 'Coffee', 'Cappuccino', 'Hot Chocolate', 'Other'];
const NAME_MAX_LENGTH = 50
const SPECIFICATION_MAX_LENGTH = 100

export function AddUserForm({ onUserAdded }: AddUserFormProps) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [drinkType, setDrinkType] = useState(DRINK_TYPES[0])
  const [specification, setSpecification] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [existingUsers, setExistingUsers] = useState<string[]>([])
  const { toast } = useToast()

  // Load existing users on mount
  useEffect(() => {
    async function loadExistingUsers() {
      try {
        const users = await apiClient.getUsers()
        setExistingUsers(users.map(u => `${u.firstName.toLowerCase()} ${u.lastName.toLowerCase()}`))
      } catch (error) {
        console.error('Failed to load existing users:', error)
      }
    }
    loadExistingUsers()
  }, [])

  const isNameDuplicate = () => {
    const fullName = `${firstName.trim().toLowerCase()} ${lastName.trim().toLowerCase()}`
    return existingUsers.includes(fullName)
  }

  const isSpecificationRequired = drinkType === 'Other'

  const isValid =
    firstName.trim() !== '' &&
    lastName.trim() !== '' &&
    firstName.length <= NAME_MAX_LENGTH &&
    lastName.length <= NAME_MAX_LENGTH &&
    (!isSpecificationRequired || (specification && specification.trim().length > 0)) &&
    (!specification || specification.length <= SPECIFICATION_MAX_LENGTH) &&
    !isNameDuplicate()

  const getValidationMessage = () => {
    if (!firstName.trim() || !lastName.trim() || !drinkType) {
      return { message: '* First, Last names and Preferred Drink are required', type: 'info' }
    }
    if (isSpecificationRequired && !specification.trim()) {
      return { message: '* Special Instructions are required for Other drink type', type: 'info' }
    }
    if (firstName.length > NAME_MAX_LENGTH || lastName.length > NAME_MAX_LENGTH) {
      return { message: `Names must be ${NAME_MAX_LENGTH} characters or less`, type: 'error' }
    }
    if (specification && specification.length > SPECIFICATION_MAX_LENGTH) {
      return { message: `Special instructions must be ${SPECIFICATION_MAX_LENGTH} characters or less`, type: 'error' }
    }
    if (isNameDuplicate()) {
      return { message: 'This name already exists', type: 'error' }
    }
    return null
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!isValid) {
      const validation = getValidationMessage()
      if (validation) {
        toast({
          title: 'Validation Error',
          description: validation.message,
          variant: validation.type === 'error' ? 'destructive' : 'default',
        })
      }
      return
    }

    setIsLoading(true)
    try {
      const user = await apiClient.createUser(firstName.trim(), lastName.trim())
      await apiClient.createDrinkOrder({
        userId: user.id,
        name: `${drinkType} for ${user.firstName}`,
        type: drinkType,
        additionalSpecification: specification.trim() ? { notes: specification.trim() } : undefined
      })

      setFirstName('')
      setLastName('')
      setSpecification('')
      setDrinkType(DRINK_TYPES[0])
      setExistingUsers(prev => [...prev, `${firstName.trim().toLowerCase()} ${lastName.trim().toLowerCase()}`])
      onUserAdded()

      toast({
        title: 'Success',
        description: 'Drink runner added successfully',
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add drink runner'
      console.error('Error adding drink runner:', error)
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div>
          <Label>
            First Name *
          </Label>
          <Input
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>
        <div>
          <Label>
            Last Name *
          </Label>
          <Input
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div>
          <Label>
            Preferred Drink *
          </Label>
          <Select
            value={drinkType}
            onValueChange={(value) => {
              setDrinkType(value)
              if (value !== 'Other') {
                setSpecification('')
              }
            }}
            disabled={isLoading}
          >
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
        <div>
          <Label>
            Special Instructions {isSpecificationRequired && '*'}
          </Label>
          <Input
            placeholder={isSpecificationRequired ? "Please specify drink type" : "e.g., 2 sugars, milk"}
            value={specification}
            onChange={(e) => setSpecification(e.target.value)}
            disabled={isLoading}
            required={isSpecificationRequired}
          />
        </div>
      </div>

      {/* Validation message with dynamic styling */}
      {!isValid && getValidationMessage() && (
        <p className={cn(
          "text-sm",
          getValidationMessage()?.type === 'error' ? "text-destructive" : "text-muted-foreground"
        )}>
          {getValidationMessage()?.message}
        </p>
      )}

      <Button
        type="submit"
        disabled={!isValid || isLoading}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Coffee className="h-4 w-4 mr-2 animate-spin" />
            Adding...
          </>
        ) : (
          <>
            <Plus className="h-4 w-4 mr-2" />
            Add participant to the list
          </>
        )}
      </Button>
    </form>
  )
}
