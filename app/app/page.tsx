
  "use client"

  import { useState, useEffect, useRef, memo } from "react"
  import Link from "next/link"

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
    const [newTaskPriority, setNewTaskPriority] = useState<"High" | "Medium" |       
  "Low">("Medium")

    // Music state
    const [currentMusic, setCurrentMusic] = useState<string | null>(null)
    const [isPlaying, setIsPlaying] = useState(false)

    // UI state
    const [showTasks, setShowTasks] = useState(false)
    const [selectedBackground, setSelectedBackground] =
  useState("gradient-blue")

    const intervalRef = useRef<NodeJS.Timeout | null>(null)

    // Music categories
    const musicCategories = [
      { id: "lofi", name: "Lo-fi Hip Hop", description: "Chill beats", icon:
  "🎵", isPremium: false },
      { id: "jazz", name: "Jazz Cafe", description: "Smooth jazz", icon: "🎷",       
  isPremium: false },
      { id: "nature", name: "Nature Sounds", description: "Forest & rain", icon:     
   "🌲", isPremium: false },
      { id: "alpha", name: "Alpha Waves", description: "8-14 Hz", icon: "🧠",        
  isPremium: true },
    ]

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
      if (mode === "work") {
        setSessions(sessions + 1)
        setMode("break")
        setTimeLeft(5 * 60) // 5 minute break
      } else {
        setMode("work")
        setTimeLeft(25 * 60) // 25 minute work
      }
    }

    const toggleTimer = () => {
      setIsActive(!isActive)
    }

    const resetTimer = () => {
      setIsActive(false)
      setTimeLeft(mode === "work" ? 25 * 60 : 5 * 60)
    }

    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2,      
  "0")}`
    }

    const progress = Math.max(0, Math.min(100, ((1500 - timeLeft) / 1500) *
  100))

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900
  via-purple-900 to-purple-800 text-white">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowTasks(!showTasks)}
              className="p-2 bg-white/10 rounded-lg border border-white/20
  hover:bg-white/20"
            >
              ☰
            </button>
            <h1 className="text-2xl font-bold">PomoFlow</h1>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/calendar" className="p-2 bg-white/10 rounded-lg border      
  border-white/20 hover:bg-white/20">
              📅
            </Link>
            <Link href="/notes" className="p-2 bg-white/10 rounded-lg border
  border-white/20 hover:bg-white/20">
              📝
            </Link>
            <Link href="/subscription" className="px-4 py-2 bg-gradient-to-r
  from-amber-500 to-orange-500 rounded-lg hover:scale-105">
              👑 Premium
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row items-center justify-center        
  gap-8 p-4 min-h-[80vh]">

          {/* Timer Card */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20        
  rounded-lg p-8 w-full max-w-md">
            <div className="text-center">
              <div className="text-sm font-medium text-gray-300 mb-2">
                {mode === "work" ? "Focus Time" : "Break Time"} • Session
  {sessions + 1}
              </div>
              <div className="text-6xl font-bold mb-4">
                {formatTime(timeLeft)}
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 mb-6">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2        
  rounded-full transition-all duration-1000"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={toggleTimer}
                  className="bg-gradient-to-r from-blue-500 to-purple-500
  hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 text-lg
  font-semibold rounded-lg transition-all duration-300 hover:scale-105"
                >
                  {isActive ? "⏸ Pause" : "▶ Start"}
                </button>
                <button
                  onClick={resetTimer}
                  className="bg-white/10 border border-white/20 text-gray-300        
  hover:bg-white/20 px-8 py-4 text-lg font-semibold rounded-lg transition-all        
  duration-300"
                >
                  🔄 Reset
                </button>
              </div>
            </div>
          </div>

          {/* Music Card */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20        
  rounded-lg p-6 w-full max-w-md">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Focus Music</h3>
              {currentMusic && (
                <div className="text-sm text-gray-300 mb-4">
                  Now Playing: {musicCategories.find(cat => cat.id ===
  currentMusic)?.name}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3">
              {musicCategories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setCurrentMusic(currentMusic === category.id ?      
  null : category.id)}
                  className={`p-4 text-left rounded-lg transition-all
  duration-300 ${
                    currentMusic === category.id
                      ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20
  border border-purple-400/30"
                      : "bg-white/10 border border-white/20 hover:bg-white/20"       
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{category.icon}</span>
                    <div>
                      <div className="font-medium">{category.name}</div>
                      <div className="text-sm
  opacity-75">{category.description}</div>
                      {category.isPremium && <div className="text-xs
  text-yellow-400">🔒 Premium</div>}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  export default memo(PomodoroApp)
