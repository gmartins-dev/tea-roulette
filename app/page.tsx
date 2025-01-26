'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Coffee, Users2, X, Plus } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { apiClient } from '@/lib/api-client'
import { cn } from '@/lib/utils'
import { User, DrinkRun } from '@/types/api'
import { AddUserForm } from '@/components/add-user-form'
import { DrinkOrderForm } from '@/components/drink-order-form'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'

export default function TeaRoulette() {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [currentRun, setCurrentRun] = useState<DrinkRun | null>(null)
  const [isSpinning, setIsSpinning] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const canStartRun = selectedUsers.length >= 2


  useEffect(() => {
    loadUsers()
  }, [])

  useEffect(() => {
    function handleKeyPress(e: KeyboardEvent) {
      if (e.key === 'Enter' && canStartRun && !isSpinning) {
        handleCreateRun()
      }
      if (e.key === 'Escape' && selectedUser) {
        setSelectedUser(null)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [canStartRun, isSpinning, selectedUser])

  async function loadUsers() {
    setIsLoading(true)
    try {
      const fetchedUsers = await apiClient.getUsers()
      setUsers(fetchedUsers)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load users',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const handleUserClick = (user: User) => {
    if (!user.drinkOrders?.length) {
      // If user has no drink order, show the form
      setSelectedUser(user)
    } else {
      // If user has a drink order, allow selection
      toggleUserSelection(user.id)
    }
  }

  async function handleCreateRun() {
    if (selectedUsers.length < 2) {
      toast({
        title: 'Error',
        description: 'Please select at least two participants',
        variant: 'destructive',
      })
      return
    }

    // Check if all selected users have drink orders
    const usersWithoutOrders = selectedUsers.filter(userId =>
      !users.find(u => u.id === userId)?.drinkOrders?.length
    )

    if (usersWithoutOrders.length > 0) {
      const userNames = usersWithoutOrders
        .map(id => users.find(u => u.id === id))
        .filter(Boolean)
        .map(u => `${u!.firstName} ${u!.lastName}`)
        .join(', ')

      toast({
        title: 'Error',
        description: `The following users need drink preferences: ${userNames}`,
        variant: 'destructive',
      })
      return
    }

    setIsSpinning(true)
    try {
      const run = await apiClient.createDrinkRun(selectedUsers)
      await new Promise(resolve => setTimeout(resolve, 1000))
      setCurrentRun(run)
      setSelectedUsers([])
      toast({
        title: '🎉 We have a winner!',
        description: `${run.drinkMaker.firstName} ${run.drinkMaker.lastName} will make the drinks!`,
        variant: 'success',
      })
    } catch (error) {
      console.error('Error creating drink run:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create drink run',
        variant: 'destructive',
      })
    } finally {
      setIsSpinning(false)
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
                  Add Tea Makers
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
                  Select Participants
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
                {isLoading ? (
                  <div className="w-full h-[100px] flex items-center justify-center">
                    <Coffee className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : users.length === 0 ? (
                  <div className="w-full h-[100px] flex items-center justify-center text-muted-foreground">
                    No tea makers yet. Add some above!
                  </div>
                ) : (
                  users.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => toggleUserSelection(user.id)}
                      className={cn(
                        "flex flex-col p-3 rounded-lg border cursor-pointer min-w-[200px] transition-all",
                        "hover:shadow-md hover:scale-[1.02]",
                        "active:scale-[0.98]",
                        selectedUsers.includes(user.id) && "bg-primary/10 border-primary ring-1 ring-primary",
                        !user.drinkOrders?.length && "opacity-50 hover:opacity-70"
                      )}
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-medium">{user.firstName} {user.lastName}</span>
                        {selectedUsers.includes(user.id) ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <X className="h-4 w-4 text-primary hover:scale-110 transition-transform" />
                            </TooltipTrigger>
                            <TooltipContent>Click to remove</TooltipContent>
                          </Tooltip>
                        ) : (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Plus className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            </TooltipTrigger>
                            <TooltipContent>Click to select</TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                      {user.drinkOrders?.[0] ? (
                        <div className="text-sm text-muted-foreground mt-1">
                          <div className="flex items-center gap-1">
                            <Coffee className="h-3 w-3" />
                            {user.drinkOrders[0].type}
                          </div>
                          {user.drinkOrders[0].additionalSpecification?.notes && (
                            <div className="text-xs mt-0.5 pl-4">
                              {user.drinkOrders[0].additionalSpecification.notes}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-xs text-muted-foreground mt-1 italic">
                          No drink preference set
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {currentRun && (
              <div className="mt-6 text-center p-6 rounded-lg bg-primary/10 dark:bg-primary/20">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/5 animate-pulse rounded-lg" />
                  <Coffee className="h-12 w-12 mx-auto mb-2 animate-bounce text-primary" />
                  <p className="text-lg font-medium">Today's Tea Master:</p>
                  <p className="text-3xl font-bold text-primary mt-2">
                    {currentRun.drinkMaker.firstName} {currentRun.drinkMaker.lastName}
                  </p>
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-muted-foreground">Orders to prepare:</p>
                    <div className="space-y-1">
                      {currentRun.orders.map(order => (
                        <div key={order.id} className="text-sm flex items-center gap-2 justify-center">
                          <Coffee className="h-3 w-3" />
                          {order.name}
                          {order.additionalSpecification?.notes && (
                            <span className="text-xs text-muted-foreground">
                              ({order.additionalSpecification.notes})
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <Button
              onClick={handleCreateRun}
              className={cn(
                "w-full relative overflow-hidden group",
                isSpinning && "animate-pulse"
              )}
              size="lg"
              disabled={!canStartRun || isSpinning}
            >
              <span className="relative z-10 flex items-center gap-2">
                <Coffee className={cn(
                  "h-5 w-5 transition-all",
                  isSpinning ? "animate-spin" : "group-hover:rotate-12"
                )} />
                {isSpinning ? "Choosing Tea Master..." : "Spin the Tea Wheel"}
              </span>
              <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/20 transition-colors" />
            </Button>
            {selectedUsers.length === 1 && (
              <p className="text-sm text-muted-foreground text-center">
                Add at least one more tea maker to start
              </p>
            )}
            {selectedUsers.length === 0 && (
              <p className="text-sm text-muted-foreground text-center">
                Select some tea makers to begin
              </p>
            )}
          </CardFooter>
        </Card>
      </div>
      {selectedUser && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card p-6 rounded-lg shadow-lg max-w-md w-full space-y-4">
            <h2 className="text-lg font-semibold">
              Set Drink Preference for {selectedUser.firstName}
            </h2>
            <DrinkOrderForm
              user={selectedUser}
              onOrderCreated={() => {
                setSelectedUser(null)
                loadUsers()
              }}
            />
            <Button
              variant="ghost"
              onClick={() => setSelectedUser(null)}
              className="w-full mt-2"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
      <Toaster />
    </main>
  )
}
