'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

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
      // TODO: Integrate with API once available
      const randomIndex = Math.floor(Math.random() * participants.length)
      const selected = participants[randomIndex]
      setSelectedMaker(selected)

      toast({
        title: "Tea maker selected!",
        description: `${selected} will make the tea this round.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to select tea maker",
        variant: "destructive",
      })
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto bg-white/10 backdrop-blur-lg border-none">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Tea Roulette</CardTitle>
            <CardDescription className="text-center text-gray-300">
              Add participants and randomly select who makes the tea!
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="participant">Add Participant</Label>
                  <Input
                    id="participant"
                    value={newParticipant}
                    onChange={(e) => setNewParticipant(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addParticipant()}
                    placeholder="Enter name..."
                    className="bg-white/5"
                  />
                </div>
                <Button
                  onClick={addParticipant}
                  className="mt-6"
                >
                  Add
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Participants</Label>
                <div className="flex flex-wrap gap-2">
                  {participants.map((participant, index) => (
                    <div
                      key={index}
                      className="bg-white/20 px-3 py-1 rounded-full flex items-center gap-2"
                    >
                      <span>{participant}</span>
                      <button
                        onClick={() => removeParticipant(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {selectedMaker && (
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <p className="text-xl font-semibold">Selected Tea Maker:</p>
                  <p className="text-2xl text-green-400">{selectedMaker}</p>
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter>
            <Button
              onClick={selectTeaMaker}
              className="w-full"
              size="lg"
              disabled={participants.length < 2}
            >
              Select Tea Maker
            </Button>
          </CardFooter>
        </Card>
      </div>
      <Toaster />
    </main>
  )
}
