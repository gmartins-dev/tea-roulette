'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Coffee, Users2, X } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { apiClient } from '@/lib/api-client'
import { cn } from '@/lib/utils'
import { User, DrinkRun } from '@/types/api'
import { AddUserForm } from '@/components/add-user-form'

export default function TeaRoulette() {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [currentRun, setCurrentRun] = useState<DrinkRun | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    try {
      const fetchedUsers = await apiClient.getUsers()
      setUsers(fetchedUsers)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load users',
        variant: 'destructive',
      })
    }
  }

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  async function handleCreateRun() {
    if (selectedUsers.length === 0) {
      toast({
        title: 'Error',
        description: 'Please select at least one participant',
        variant: 'destructive',
      })
      return
    }

    try {
      const run = await apiClient.createDrinkRun(
        selectedUsers.map(userId => ({ userId }))
      )
      setCurrentRun(run)
      setSelectedUsers([])
      toast({
        title: 'Success!',
        description: `${run.drinkMaker.firstName} ${run.drinkMaker.lastName} will make the drinks!`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create drink run',
        variant: 'destructive',
      })
    }
  }

  return (
    <main className="min-h-screen p-4 md:p-8 lg:p-24 bg-background bg-repeat bg-opacity-5">
      <ThemeToggle />
      <div className="container mx-auto max-w-2xl">
        <Card className="border-2 shadow-lg backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-bold text-center flex items-center justify-center gap-2">
              Tea Roulette
              <Coffee className="h-6 w-6 animate-spin" />
            </CardTitle>
            <CardDescription className="text-center text-sm md:text-base">
              Cross your fingers and spin the wheel of tea-making destiny!
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label className="flex items-center gap-2">
                  <Users2 className="h-4 w-4" />
                  Participants
                </Label>
                <div className="mt-2">
                  <AddUserForm onUserAdded={loadUsers} />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label className="text-base flex items-center gap-2">
                  <Coffee className="h-4 w-4" />
                  Selected Participants
                </Label>
                {selectedUsers.length > 0 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setSelectedUsers([])}
                    className="h-8 group"
                  >
                    <Trash2 className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform" />
                    Clear All
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-2 min-h-[100px] p-4 rounded-lg border bg-muted/50">
                {users.length === 0 ? (
                  <p className="text-sm text-muted-foreground w-full text-center">
                    Add some tea enthusiasts to get started! ☕
                  </p>
                ) : (
                  users.map((user) => (
                    <div
                      key={user.id}
                      className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer ${
                        selectedUsers.includes(user.id) ? 'bg-primary/10 border-primary' : 'bg-card'
                      }`}
                      onClick={() => toggleUserSelection(user.id)}
                    >
                      <span>{user.firstName} {user.lastName}</span>
                      {selectedUsers.includes(user.id) && (
                        <X className="h-4 w-4 text-primary" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {currentRun && (
              <div className="mt-6 text-center p-6 rounded-lg bg-primary/10 dark:bg-primary/20">
                <div className="relative">
                  <Coffee className="h-12 w-12 mx-auto mb-2 animate-bounce text-primary" />
                  <p className="text-lg font-medium">Today's Tea Master:</p>
                  <p className="text-3xl font-bold text-primary mt-2">
                    {currentRun.drinkMaker.firstName} {currentRun.drinkMaker.lastName}
                  </p>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <Button
              onClick={handleCreateRun}
              className="w-full relative overflow-hidden group"
              size="lg"
              disabled={selectedUsers.length === 0}
            >
              <span className="relative z-10 flex items-center gap-2">
                <Coffee className={cn(
                  "h-5 w-5 transition-all",
                  "group-hover:rotate-12"
                )} />
                Spin the Tea Wheel
              </span>
              <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/20 transition-colors" />
            </Button>
            {selectedUsers.length === 1 && (
              <p className="text-sm text-muted-foreground text-center">
                Add 1 more tea maker to start
              </p>
            )}
          </CardFooter>
        </Card>
      </div>
      <Toaster />
    </main>
  )
}
