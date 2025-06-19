"use client"

import { useState, useEffect, useRef, useCallback, memo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Play,
  Pause,
  Plus,
  Lock,
  Trash2,
  RotateCcw,
  Settings,
  Volume2,
  CheckSquare,
  Menu,
  X,
  Crown,
  Calendar,
  FileText,
} from "lucide-react"

interface Task {
  id: number
  text: string
  priority: "High" | "Medium" | "Low"
  completed: boolean
  completedAt?: Date
}

interface CustomTimer {
  id: string
  name: string
  workMinutes: number
  breakMinutes: number
  longBreakMinutes: number
  sessionsUntilLongBreak: number
}

const defaultTimer: CustomTimer = {
  id: "default",
  name: "Classic Pomodoro",
  workMinutes: 25,
  breakMinutes: 5,
  longBreakMinutes: 15,
  sessionsUntilLongBreak: 4,
}

function PomodoroApp() {
  // Core timer state
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isActive, setIsActive] = useState(false)
  const [mode, setMode] = useState<"work" | "break">("work")
  const [sessions, setSessions] = useState(0)
  
  // Tasks state
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState("")
  const [newTaskPriority, setNewTaskPriority] = useState<"High" | "Medium" | "Low">("Medium")
  const [completedTasks, setCompletedTasks] = useState<Task[]>([])
  
  // Music state
  const [currentMusic, setCurrentMusic] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null)
  
  // UI state
  const [showTasks, setShowTasks] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [selectedBackground, setSelectedBackground] = useState("gradient-blue")
  const [customTimers, setCustomTimers] = useState<CustomTimer[]>([defaultTimer])
  const [selectedTimer, setSelectedTimer] = useState("default")
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Music categories
  const musicCategories = [
    {
      id: "lofi",
      name: "Lo-fi Hip Hop",
      description: "Chill beats",
      icon: "🎵",
      isPremium: false,
    },
    {
      id: "jazz",
      name: "Jazz Cafe",
      description: "Smooth jazz",
      icon: "🎷",
      isPremium: false,
    },
    {
      id: "nature",
      name: "Nature Sounds",
      description: "Forest & rain",
      icon: "🌲",
      isPremium: false,
    },
    {
      id: "alpha",
      name: "Alpha Waves",
      description: "8-14 Hz",
      icon: "🧠",
      isPremium: true,
    },
  ]

  const backgroundOptions = [
    { id: "gradient-blue", name: "Ocean", preview: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
    { id: "gradient-purple", name: "Sunset", preview: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
    { id: "gradient-green", name: "Forest", preview: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" },
    { id: "gradient-dark", name: "Night", preview: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)" },
  ]

  // Initialize with sample tasks
  useEffect(() => {
    const sampleTasks: Task[] = [
      {
        id: 1,
        text: "Complete project proposal",
        priority: "High",
        completed: false,
      },
      {
        id: 2,
        text: "Review team feedback",
        priority: "Medium", 
        completed: false,
      },
    ]
    setTasks(sampleTasks)

    // Additional timers
    const timers: CustomTimer[] = [
      defaultTimer,
      {
        id: "short",
        name: "Short Focus",
        workMinutes: 15,
        breakMinutes: 3,
        longBreakMinutes: 10,
        sessionsUntilLongBreak: 3,
      },
      {
        id: "long",
        name: "Deep Work",
        workMinutes: 45,
        breakMinutes: 10,
        longBreakMinutes: 30,
        sessionsUntilLongBreak: 2,
      },
    ]
    setCustomTimers(timers)
  }, [])

  const getCurrentTimer = (): CustomTimer => {
    if (customTimers.length === 0) return defaultTimer
    return customTimers.find(timer => timer.id === selectedTimer) || customTimers[0] || defaultTimer
  }

  // Timer logic
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            setIsActive(false)
            handleTimerComplete()
            return 0
          }
          return time - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isActive, timeLeft])

  const handleTimerComplete = () => {
    try {
      const currentTimer = getCurrentTimer()
      
      if (mode === "work") {
        const newSessions = sessions + 1
        setSessions(newSessions)
        
        if (newSessions % currentTimer.sessionsUntilLongBreak === 0) {
          setMode("break")
          setTimeLeft(currentTimer.longBreakMinutes * 60)
        } else {
          setMode("break")
          setTimeLeft(currentTimer.breakMinutes * 60)
        }
      } else {
        setMode("work")
        setTimeLeft(currentTimer.workMinutes * 60)
      }
    } catch (error) {
      setTimeLeft(25 * 60) // fallback
    }
  }

  const toggleTimer = () => {
    setIsActive(!isActive)
  }

  const resetTimer = () => {
    try {
      setIsActive(false)
      const currentTimer = getCurrentTimer()
      setTimeLeft(mode === "work" ? currentTimer.workMinutes * 60 : currentTimer.breakMinutes * 60)
    } catch (error) {
      setTimeLeft(25 * 60) // fallback
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Task functions
  const addTask = () => {
    if (!newTask.trim()) return
    
    const task: Task = {
      id: Date.now(),
      text: newTask.trim(),
      priority: newTaskPriority,
      completed: false,
    }
    
    setTasks([...tasks, task])
    setNewTask("")
  }

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const toggleTask = (id: number) => {
    const task = tasks.find(t => t.id === id)
    if (!task) return

    if (task.completed) {
      setTasks(tasks.map(t => t.id === id ? { ...t, completed: false, completedAt: undefined } : t))
      setCompletedTasks(completedTasks.filter(t => t.id !== id))
    } else {
      const completedTask = { ...task, completed: true, completedAt: new Date() }
      setTasks(tasks.filter(t => t.id !== id))
      setCompletedTasks([completedTask, ...completedTasks])
    }
  }

  // Music functions
  const handleMusicSelection = async (musicType: string) => {
    try {
      if (currentAudio) {
        currentAudio.pause()
        currentAudio.currentTime = 0
      }

      if (currentMusic === musicType && isPlaying) {
        setIsPlaying(false)
        setCurrentMusic(null)
        setCurrentAudio(null)
        return
      }

      setCurrentMusic(musicType)
      setIsPlaying(true)
    } catch (error) {
      setIsPlaying(false)
    }
  }

  const getBackgroundStyle = (backgroundId: string) => {
    const bg = backgroundOptions.find(b => b.id === backgroundId)
    return bg?.preview || backgroundOptions[0].preview
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-500/20 text-red-400 border-red-400/30"
      case "Medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-400/30"  
      case "Low": return "bg-green-500/20 text-green-400 border-green-400/30"
      default: return "bg-gray-500/20 text-gray-400 border-gray-400/30"
    }
  }

  const progress = (() => {
    try {
      const currentTimer = getCurrentTimer()
      const totalTime = mode === "work" ? currentTimer.workMinutes * 60 : currentTimer.breakMinutes * 60
      if (totalTime === 0) return 0
      return Math.max(0, Math.min(100, ((totalTime - timeLeft) / totalTime) * 100))
    } catch (error) {
      return 0
    }
  })()

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: getBackgroundStyle(selectedBackground),
        backgroundAttachment: "fixed",
      }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
      
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowTasks(!showTasks)}
            className="glass-card border-white/20 text-gray-300 hover:bg-white/10 transition-all duration-300"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-white">PomoFlow</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <Link href="/calendar">
            <Button className="glass-card border-white/20 text-gray-300 hover:bg-white/10 transition-all duration-300">
              <Calendar className="w-5 h-5" />
            </Button>
          </Link>
          
          <Link href="/notes">
            <Button className="glass-card border-white/20 text-gray-300 hover:bg-white/10 transition-all duration-300">
              <FileText className="w-5 h-5" />
            </Button>
          </Link>
          
          <Link href="/tasks">
            <Button className="glass-card border-white/20 text-gray-300 hover:bg-white/10 transition-all duration-300">
              <CheckSquare className="w-5 h-5" />
            </Button>
          </Link>
          
          <Link href="/subscription">
            <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white transition-all duration-300 hover:scale-105">
              <Crown className="w-5 h-5 mr-2" />
              Premium
            </Button>
          </Link>
          
          <DropdownMenu open={showSettings} onOpenChange={setShowSettings}>
            <DropdownMenuTrigger asChild>
              <Button className="glass-card border-white/20 text-gray-300 hover:bg-white/10 transition-all duration-300">
                <Settings className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="glass-card border-white/20 text-gray-300 w-80 mr-4">
              <DropdownMenuLabel className="text-white font-semibold">Settings</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/20" />
              
              {/* Timer Selection */}
              <div className="p-3">
                <h4 className="text-sm font-medium text-white mb-2">Timer Preset</h4>
                <Select value={selectedTimer} onValueChange={setSelectedTimer}>
                  <SelectTrigger className="glass-card border-white/20 text-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-white/20">
                    {customTimers.map(timer => (
                      <SelectItem key={timer.id} value={timer.id}>{timer.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <DropdownMenuSeparator className="bg-white/20" />
              
              {/* Background Selection */}
              <div className="p-3">
                <h4 className="text-sm font-medium text-white mb-2">Background</h4>
                <div className="grid grid-cols-2 gap-2">
                  {backgroundOptions.map(bg => (
                    <Button
                      key={bg.id}
                      onClick={() => setSelectedBackground(bg.id)}
                      className={`text-xs p-2 h-auto flex flex-col items-center gap-1 ${
                        selectedBackground === bg.id
                          ? "bg-blue-500/20 text-blue-400 border-blue-400/30"
                          : "glass-card border-white/20 text-gray-300 hover:bg-white/10"
                      }`}
                    >
                      <div className="w-full h-6 rounded border border-white/20" style={{ background: bg.preview }} />
                      <span>{bg.name}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col lg:flex-row items-start justify-center gap-8 p-4 min-h-[calc(100vh-80px)]">
        
        {/* Primary: Timer */}
        <Card className="glass-card border-white/20 p-8 w-full max-w-md">
          <CardContent className="p-0">
            <div className="text-center">
              <div className="mb-6">
                <div className="text-sm font-medium text-gray-300 mb-2">
                  {mode === "work" ? "Focus Time" : "Break Time"} • Session {sessions + 1}
                </div>
                <div className="text-6xl font-bold text-white mb-4">
                  {formatTime(timeLeft)}
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 mb-6">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              
              <div className="flex justify-center gap-4">
                <Button
                  onClick={toggleTimer}
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105"
                >
                  {isActive ? <Pause className="w-6 h-6 mr-2" /> : <Play className="w-6 h-6 mr-2" />}
                  {isActive ? "Pause" : "Start"}
                </Button>
                <Button
                  onClick={resetTimer}
                  size="lg"
                  className="glass-card border-white/20 text-gray-300 hover:bg-white/10 px-8 py-4 text-lg font-semibold transition-all duration-300"
                >
                  <RotateCcw className="w-6 h-6 mr-2" />
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Secondary Primary: Music Player */}
        <Card className="glass-card border-white/20 p-6 w-full max-w-md">
          <CardContent className="p-0">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">Focus Music</h3>
              {currentMusic && (
                <div className="text-sm text-gray-300 mb-4">
                  Now Playing: {musicCategories.find(cat => cat.id === currentMusic)?.name}
                </div>
              )}
            </div>
            
            {/* Music Categories */}
            <div className="grid grid-cols-1 gap-3">
              {musicCategories.map(category => (
                <Button
                  key={category.id}
                  onClick={() => handleMusicSelection(category.id)}
                  className={`p-4 text-left transition-all duration-300 ${
                    currentMusic === category.id
                      ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400/30 text-purple-300"
                      : "glass-card border-white/20 text-gray-300 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{category.icon}</span>
                    <div>
                      <div className="font-medium">{category.name}</div>
                      <div className="text-sm opacity-75">{category.description}</div>
                    </div>
                    {category.isPremium && <Lock className="w-4 h-4 ml-auto" />}
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-black/90 backdrop-blur-lg border-r border-white/20 transform transition-transform duration-300 z-50 ${showTasks ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Tasks</h2>
            <Button
              onClick={() => setShowTasks(false)}
              className="glass-card border-white/20 text-gray-300 hover:bg-white/10 p-2"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Add Task */}
          <div className="mb-6">
            <div className="flex gap-2 mb-2">
              <Input
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add new task..."
                className="glass-card border-white/20 text-gray-300 placeholder-gray-500"
                onKeyDown={(e) => e.key === 'Enter' && addTask()}
              />
              <Button
                onClick={addTask}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>
            <Select value={newTaskPriority} onValueChange={setNewTaskPriority}>
              <SelectTrigger className="glass-card border-white/20 text-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-card border-white/20">
                <SelectItem value="High">High Priority</SelectItem>
                <SelectItem value="Medium">Medium Priority</SelectItem>
                <SelectItem value="Low">Low Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Active Tasks */}
          <div className="space-y-3 mb-6">
            {tasks.map(task => (
              <div key={task.id} className="glass-card border-white/20 p-3 rounded-lg">
                <div className="flex items-start gap-3">
                  <Button
                    onClick={() => toggleTask(task.id)}
                    className="p-1 glass-card border-white/20 text-gray-300 hover:bg-white/10 flex-shrink-0"
                  >
                    <CheckSquare className="w-4 h-4" />
                  </Button>
                  <div className="flex-1 min-w-0">
                    <div className="text-gray-300 text-sm mb-1">{task.text}</div>
                    <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </Badge>
                  </div>
                  <Button
                    onClick={() => deleteTask(task.id)}
                    className="p-1 glass-card border-white/20 text-gray-300 hover:bg-red-500/20 flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-white mb-3">Completed ({completedTasks.length})</h3>
              <div className="space-y-2">
                {completedTasks.slice(0, 5).map(task => (
                  <div key={task.id} className="glass-card border-white/20 p-2 rounded-lg opacity-60">
                    <div className="text-gray-400 text-sm line-through">{task.text}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {task.completedAt?.toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Overlay when sidebar is open */}
      {showTasks && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setShowTasks(false)}
        />
      )}

      <style jsx>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  )
}

export default memo(PomodoroApp)