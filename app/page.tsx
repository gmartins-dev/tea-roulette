'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Coffee, Users2, Plus, X } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { apiClient } from '@/lib/api-client'
import { cn } from '@/lib/utils'

export default function TeaRoulette() {
  const [users, setUsers] = useState<Array<{ id: string; name: string }>>([])
  const [participants, setParticipants] = useState<Array<{ id: string; name: string }>>([])
  const [newParticipant, setNewParticipant] = useState('')
  const [selectedMaker, setSelectedMaker] = useState<{ id: string; name: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    setIsLoadingUsers(true)
    try {
      const fetchedUsers = await apiClient.getUsers()
      setUsers(fetchedUsers.map(user => ({
        id: user.id,
        name: `${user.firstName} ${user.lastName}`
      })))
    } catch (error) {
      console.error('LoadUsers Error:', error)
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      })
    } finally {
      setIsLoadingUsers(false)
    }
  }

  const addParticipant = async () => {
    if (!newParticipant.trim()) {
      toast({
        title: "Error",
        description: "Please enter a participant name",
        variant: "destructive",
      })
      return
    }

    try {
      const [firstName, ...lastNameParts] = newParticipant.trim().split(' ')
      const lastName = lastNameParts.join(' ') || firstName

      const user = await apiClient.createUser(firstName, lastName)
      const newUser = {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`
      }

      setUsers(prev => [...prev, newUser])
      setParticipants(prev => [...prev, newUser])
      setNewParticipant('')

      toast({
        title: "Success",
        description: "Participant added successfully",
        variant: "success",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add participant",
        variant: "destructive",
      })
    }
  }

  const removeParticipant = (id: string) => {
    setParticipants(prev => prev.filter(p => p.id !== id))
  }

  const selectTeaMaker = async () => {
    if (participants.length < 2) {
      toast({
        title: "Error",
        description: "Add at least 2 participants",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const drinkRun = await apiClient.createDrinkRun(
        participants.map(p => ({ userId: p.id }))
      )

      const maker = {
        id: drinkRun.drinkMaker.id,
        name: `${drinkRun.drinkMaker.firstName} ${drinkRun.drinkMaker.lastName}`
      }
      setSelectedMaker(maker)

      toast({
        title: "Tea maker selected!",
        description: `${maker.name} will make the tea this round.`,
        variant: "success",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to select tea maker",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const clearAllParticipants = () => {
    if (participants.length === 0) {
      toast({
        title: "No participants",
        description: "There are no participants to clear",
        variant: "destructive",
      })
      return
    }

    setParticipants([])
    setSelectedMaker(null)
    toast({
      title: "Cleared",
      description: "All participants have been removed",
      variant: "success",
    })
  }

  return (
    <main className="min-h-screen p-4 md:p-8 lg:p-24 bg-background  bg-repeat bg-opacity-5">
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
                <Label htmlFor="participant" className="flex items-center gap-2">
                  <Users2 className="h-4 w-4" />
                  Add participants
                </Label>
                <div className="flex gap-2 mt-1.5">
                  <Input
                    id="participant"
                    value={newParticipant}
                    onChange={(e) => setNewParticipant(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !isLoading && addParticipant()}
                    placeholder="Enter name..."
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <Button onClick={addParticipant} size="icon" disabled={isLoading}>
                    {isLoading ? (
                      <Coffee className="h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label className="text-base flex items-center gap-2">
                  <Coffee className="h-4 w-4" />
                  Participants
                </Label>
                {participants.length > 0 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={clearAllParticipants}
                    className="h-8 group"
                  >
                    <Trash2 className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform" />
                    Clear All
                  </Button>
                )}
        </div>
              <div className="flex flex-wrap gap-2 min-h-[100px] p-4 rounded-lg border bg-muted/50">
                {participants.length === 0 ? (
                  <p className="text-sm text-muted-foreground w-full text-center">
                    Add some tea enthusiasts to get started! ☕
                  </p>
                ) : (
                  participants.map((participant) => (
                    <div
                      key={participant.id}
                      className="bg-primary/10 dark:bg-primary/20 px-3 py-1 rounded-full flex items-center gap-2 transition-all hover:scale-105"
                    >
                      <Coffee className="h-3 w-3" />
                      <span>{participant.name}</span>
                      <button
                        onClick={() => removeParticipant(participant.id)}
                        className="hover:text-destructive transition-colors"
                        aria-label={`Remove ${participant.name}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {selectedMaker && (
              <div className="mt-6 text-center p-6 rounded-lg bg-primary/10 dark:bg-primary/20">
                <div className="relative">
                  <Coffee className="h-12 w-12 mx-auto mb-2 animate-bounce text-primary" />
                  <p className="text-lg font-medium">Today's Tea Master:</p>
                  <p className="text-3xl font-bold text-primary mt-2">{selectedMaker.name}</p>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <Button
              onClick={selectTeaMaker}
              className="w-full relative overflow-hidden group"
              size="lg"
              disabled={participants.length < 2 || isLoading}
            >
              <span className="relative z-10 flex items-center gap-2">
                <Coffee className={cn(
                  "h-5 w-5 transition-all",
                  isLoading ? "animate-spin" : "group-hover:rotate-12"
                )} />
                {isLoading ? "Selecting..." : "Spin the Tea Wheel"}
              </span>
              <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/20 transition-colors" />
            </Button>
            {participants.length > 0 && (
              <p className="text-sm text-muted-foreground text-center">
                {participants.length === 1
                  ? "Add 1 more tea maker to start"
                  : ''
                }
              </p>
            )}
          </CardFooter>
        </Card>
    </div>
      <Toaster />
    </main>
  )
}
