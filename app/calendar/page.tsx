"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Calendar,
  RefreshCw,
  Clock,
  Users,
  Video,
  FileText,
  Coffee,
  CheckCircle,
  XCircle,
  Settings,
  Home,
} from "lucide-react"

interface CalendarEvent {
  id: string
  time: string
  title: string
  type: "meeting" | "review" | "break" | "focus" | "call"
  duration: string
  attendees?: number
}

export default function CalendarIntegrationPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<"google" | "outlook" | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [lastSync, setLastSync] = useState<Date | null>(null)

  const sampleEvents: CalendarEvent[] = [
    {
      id: "1",
      time: "09:00 AM",
      title: "Daily Standup",
      type: "meeting",
      duration: "30 min",
      attendees: 5,
    },
    {
      id: "2",
      time: "10:00 AM",
      title: "Client Meeting - Q4 Review",
      type: "meeting",
      duration: "60 min",
      attendees: 3,
    },
    {
      id: "3",
      time: "11:30 AM",
      title: "Focus Time - Development",
      type: "focus",
      duration: "90 min",
    },
    {
      id: "4",
      time: "01:00 PM",
      title: "Lunch Break",
      type: "break",
      duration: "60 min",
    },
    {
      id: "5",
      time: "02:00 PM",
      title: "Project Review - Mobile App",
      type: "review",
      duration: "45 min",
      attendees: 4,
    },
    {
      id: "6",
      time: "03:30 PM",
      title: "Team Call - Sprint Planning",
      type: "call",
      duration: "60 min",
      attendees: 8,
    },
    {
      id: "7",
      time: "05:00 PM",
      title: "Focus Session - Documentation",
      type: "focus",
      duration: "60 min",
    },
  ]

  const handleSync = async () => {
    if (!selectedProvider) return

    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsConnected(!isConnected)
    setLastSync(new Date())
    setIsLoading(false)
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case "meeting":
        return Users
      case "review":
        return FileText
      case "break":
        return Coffee
      case "focus":
        return Clock
      case "call":
        return Video
      default:
        return Calendar
    }
  }

  const getEventColor = (type: string) => {
    switch (type) {
      case "meeting":
        return "bg-blue-500/20 border-blue-400/30 text-blue-300"
      case "review":
        return "bg-purple-500/20 border-purple-400/30 text-purple-300"
      case "break":
        return "bg-green-500/20 border-green-400/30 text-green-300"
      case "focus":
        return "bg-orange-500/20 border-orange-400/30 text-orange-300"
      case "call":
        return "bg-indigo-500/20 border-indigo-400/30 text-indigo-300"
      default:
        return "bg-gray-500/20 border-gray-400/30 text-gray-300"
    }
  }

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div
      className="min-h-screen relative"
      style={{ background: "linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)" }}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-green-400/30 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-green-400/30 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-green-400/30 rounded-full animate-pulse delay-500"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-green-400/30 rounded-full animate-pulse delay-700"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <span style={{ imageRendering: "pixelated", fontSize: "32px" }}>📅</span>
              <h1 className="text-4xl font-bold text-white neon-text" style={{ fontFamily: "Arial, sans-serif" }}>
                Calendar Integration
              </h1>
            </div>
            <Button
              variant="outline"
              className="glass-card hover:bg-white/10 text-white border-white/20 transition-all duration-200 hover:scale-105"
              style={{ fontFamily: "Arial, sans-serif" }}
              onClick={() => (window.location.href = "/")}
            >
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </div>

          <div className="text-center mb-8">
            <p className="text-xl text-gray-300" style={{ fontFamily: "Arial, sans-serif" }}>
              Sync your calendar events to optimize your Pomodoro sessions
            </p>
          </div>

          {/* Connection Status & Sync Controls */}
          <Card className="glass-card border-white/20 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3" style={{ fontFamily: "Arial, sans-serif" }}>
                <span style={{ imageRendering: "pixelated", fontSize: "24px" }}>🔄</span>
                Calendar Sync
                {isConnected ? (
                  <Badge className="bg-green-500/20 text-green-400 border-green-400/30">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Connected
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-gray-700/50 text-gray-400 border-gray-600">
                    <XCircle className="w-3 h-3 mr-1" />
                    Disconnected
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300" style={{ fontFamily: "Arial, sans-serif" }}>
                    Calendar Provider
                  </label>
                  <Select
                    value={selectedProvider || ""}
                    onValueChange={(value: "google" | "outlook") => setSelectedProvider(value)}
                  >
                    <SelectTrigger className="glass-card border-white/20 text-gray-300">
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-white/20 text-gray-300 z-50">
                      <SelectItem value="google">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-red-500 rounded"></div>
                          Google Calendar
                        </div>
                      </SelectItem>
                      <SelectItem value="outlook">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-blue-500 rounded"></div>
                          Outlook Calendar
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300" style={{ fontFamily: "Arial, sans-serif" }}>
                    Last Sync
                  </label>
                  <div className="text-sm text-gray-400 p-2 bg-white/5 rounded border border-white/20">
                    {lastSync ? lastSync.toLocaleTimeString() : "Never"}
                  </div>
                </div>

                <Button
                  onClick={handleSync}
                  disabled={!selectedProvider || isLoading}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transition-all duration-200 hover:scale-105 hover:shadow-lg border-0"
                  style={{ fontFamily: "Arial, sans-serif" }}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Syncing...
                    </>
                  ) : isConnected ? (
                    <>
                      <XCircle className="w-4 h-4 mr-2" />
                      Disconnect
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Connect & Sync
                    </>
                  )}
                </Button>
              </div>

              {isConnected && (
                <div className="mt-4 p-4 bg-green-500/10 border border-green-400/20 rounded-lg">
                  <div className="flex items-center gap-2 text-green-300">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium" style={{ fontFamily: "Arial, sans-serif" }}>
                      Successfully connected to {selectedProvider === "google" ? "Google" : "Outlook"} Calendar
                    </span>
                  </div>
                  <p className="text-green-400 text-sm mt-1" style={{ fontFamily: "Arial, sans-serif" }}>
                    Your calendar events are now synchronized and will help optimize your Pomodoro sessions.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Today's Schedule */}
          <Card className="glass-card border-white/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3 text-white" style={{ fontFamily: "Arial, sans-serif" }}>
                  <Calendar className="w-6 h-6 text-green-400" />
                  Today's Schedule
                </CardTitle>
                <div className="text-right">
                  <div className="text-sm text-gray-300" style={{ fontFamily: "Arial, sans-serif" }}>
                    {today}
                  </div>
                  <div className="text-xs text-gray-500" style={{ fontFamily: "Arial, sans-serif" }}>
                    {sampleEvents.length} events scheduled
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {!isConnected ? (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2" style={{ fontFamily: "Arial, sans-serif" }}>
                    Connect Your Calendar
                  </h3>
                  <p className="text-gray-500 mb-4" style={{ fontFamily: "Arial, sans-serif" }}>
                    Connect your Google or Outlook calendar to see your events here
                  </p>
                  <Button
                    onClick={() => document.querySelector("select")?.focus()}
                    variant="outline"
                    className="transition-all duration-200 hover:scale-105 glass-card border-white/20 text-gray-300 hover:bg-white/10"
                    style={{ fontFamily: "Arial, sans-serif" }}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Set Up Connection
                  </Button>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar">
                  {sampleEvents.map((event, index) => {
                    const IconComponent = getEventIcon(event.type)
                    return (
                      <div
                        key={event.id}
                        className={`p-4 rounded-lg border-l-4 ${getEventColor(event.type)} hover:shadow-md transition-all duration-200`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <IconComponent className="w-5 h-5" />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-white" style={{ fontFamily: "Arial, sans-serif" }}>
                                  {event.time}
                                </span>
                                <span className="text-sm opacity-75">•</span>
                                <span className="font-medium text-gray-300" style={{ fontFamily: "Arial, sans-serif" }}>
                                  {event.title}
                                </span>
                              </div>
                              <div className="flex items-center gap-4 mt-1 text-sm opacity-75 text-gray-400">
                                <span style={{ fontFamily: "Arial, sans-serif" }}>Duration: {event.duration}</span>
                                {event.attendees && (
                                  <span className="flex items-center gap-1" style={{ fontFamily: "Arial, sans-serif" }}>
                                    <Users className="w-3 h-3" />
                                    {event.attendees} attendees
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className="text-xs capitalize bg-white/10 text-gray-300 border-white/20"
                          >
                            {event.type}
                          </Badge>
                        </div>
                      </div>
                    )
                  })}

                  <Separator className="my-6 bg-white/10" />

                  <div className="text-center p-4 bg-green-500/10 border border-green-400/20 rounded-lg">
                    <div className="flex items-center justify-center gap-2 text-green-300 mb-2">
                      <span style={{ imageRendering: "pixelated", fontSize: "20px" }}>⏰</span>
                      <span className="font-medium" style={{ fontFamily: "Arial, sans-serif" }}>
                        Pomodoro Optimization
                      </span>
                    </div>
                    <p className="text-green-400 text-sm" style={{ fontFamily: "Arial, sans-serif" }}>
                      Based on your calendar, we recommend 25-minute focus sessions between meetings with 5-minute
                      breaks.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
