'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Coffee, Users2, Plus, X } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

export default function TeaRoulette() {
  const [participants, setParticipants] = useState<string[]>([])
  const [newParticipant, setNewParticipant] = useState('')
  const [selectedMaker, setSelectedMaker] = useState<string | null>(null)
  const { toast } = useToast()

  const addParticipant = () => {
    if (!newParticipant.trim()) {
      toast({
        title: "Error",
        description: "Please enter a participant name",
        variant: "destructive",
      })
      return
    }

    if (participants.includes(newParticipant.trim())) {
      toast({
        title: "Error",
        description: "This participant is already added",
        variant: "destructive",
      })
      return
    }

    setParticipants([...participants, newParticipant.trim()])
    setNewParticipant('')
  }

  const removeParticipant = (index: number) => {
    setParticipants(participants.filter((_, i) => i !== index))
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

    try {
      const randomIndex = Math.floor(Math.random() * participants.length)
      const selected = participants[randomIndex]
      setSelectedMaker(selected)

      toast({
        title: "Tea maker selected!",
        description: `${selected} will make the tea this round.`,
        variant: "success",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to select tea maker",
        variant: "destructive",
      })
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
    <main className="min-h-screen p-4 md:p-8 lg:p-24 bg-background bg-[url('/tea-pattern.png')] bg-repeat bg-opacity-5">
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
                    onKeyPress={(e) => e.key === 'Enter' && addParticipant()}
                    placeholder="Enter name..."
                    className="flex-1"
                  />
                  <Button onClick={addParticipant} size="icon">
                    <Plus className="h-4 w-4" />
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
                  participants.map((participant, index) => (
                    <div
                      key={index}
                      className="bg-primary/10 dark:bg-primary/20 px-3 py-1 rounded-full flex items-center gap-2 transition-all hover:scale-105"
                    >
                      <span>{participant}</span>
                      <button
                        onClick={() => removeParticipant(index)}
                        className="hover:text-destructive transition-colors"
                        aria-label={`Remove ${participant}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {selectedMaker && (
              <div className="mt-6 text-center p-6 rounded-lg bg-primary/10 dark:bg-primary/20 animate-fade-in">
                <div className="relative">
                  <Coffee className="h-12 w-12 mx-auto mb-2 animate-bounce text-primary" />
                  <p className="text-lg font-medium">Today's Tea Master:</p>
                  <p className="text-3xl font-bold text-green-700 mt-2">{selectedMaker}</p>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <Button
              onClick={selectTeaMaker}
              className="w-full relative overflow-hidden group"
              size="lg"
              disabled={participants.length < 2}
            >
              <span className="relative z-10 flex items-center gap-2">
                <Coffee className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                Spin the Tea Wheel
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
