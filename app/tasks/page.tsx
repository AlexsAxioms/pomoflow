"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, CheckCircle, Trash2, Home, Clock, RotateCcw, Filter, Search } from "lucide-react"

interface Task {
  id: number
  text: string
  priority: "High" | "Medium" | "Low"
  completed: boolean
  completedAt?: Date
  createdAt: Date
  category?: string
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [completedTasks, setCompletedTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState("")
  const [newTaskPriority, setNewTaskPriority] = useState<"High" | "Medium" | "Low">("Medium")
  const [newTaskCategory, setNewTaskCategory] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterPriority, setFilterPriority] = useState<"All" | "High" | "Medium" | "Low">("All")
  const [filterCategory, setFilterCategory] = useState<string>("All")
  const [isSubscribed, setIsSubscribed] = useState(false)

  // Load subscription state from localStorage
  useEffect(() => {
    const savedSubscription = localStorage.getItem("subscription-status")
    if (savedSubscription === "true") {
      setIsSubscribed(true)
    }
  }, [])

  // Initialize with sample tasks
  useEffect(() => {
    const sampleTasks: Task[] = [
      {
        id: 1,
        text: "Complete project proposal",
        priority: "High",
        completed: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        category: "Work",
      },
      {
        id: 2,
        text: "Review team feedback",
        priority: "Medium",
        completed: false,
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        category: "Work",
      },
      {
        id: 3,
        text: "Buy groceries",
        priority: "Low",
        completed: false,
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
        category: "Personal",
      },
    ]

    const sampleCompletedTasks: Task[] = [
      {
        id: 4,
        text: "Morning workout",
        priority: "Medium",
        completed: true,
        completedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
        category: "Health",
      },
      {
        id: 5,
        text: "Read daily news",
        priority: "Low",
        completed: true,
        completedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000),
        category: "Personal",
      },
    ]

    setTasks(sampleTasks)
    setCompletedTasks(sampleCompletedTasks)
  }, [])

  const addTask = () => {
    const totalDailyTasks = tasks.length + todaysCompletedTasks.length
    if (newTask.trim() && (isSubscribed || totalDailyTasks < 3)) {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          text: newTask.trim(),
          priority: newTaskPriority,
          completed: false,
          createdAt: new Date(),
          category: newTaskCategory.trim() || "General",
        },
      ])
      setNewTask("")
      setNewTaskCategory("")
    }
  }

  const removeTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const toggleTaskCompletion = (id: number) => {
    const task = tasks.find((t) => t.id === id)
    if (task) {
      const updatedTask = { ...task, completed: true, completedAt: new Date() }
      setTasks(tasks.filter((t) => t.id !== id))
      setCompletedTasks([updatedTask, ...completedTasks])
    }
  }

  const uncompleteTask = (id: number) => {
    const task = completedTasks.find((t) => t.id === id)
    if (task) {
      const updatedTask = { ...task, completed: false, completedAt: undefined }
      setCompletedTasks(completedTasks.filter((t) => t.id !== id))
      setTasks([...tasks, updatedTask])
    }
  }

  const removeCompletedTask = (id: number) => {
    setCompletedTasks(completedTasks.filter((task) => task.id !== id))
  }

  const clearAllCompletedTasks = () => {
    setCompletedTasks([])
  }

  // Get today's completed tasks
  const todaysCompletedTasks = completedTasks.filter((task) => {
    if (!task.completedAt) return false
    const today = new Date()
    const taskDate = new Date(task.completedAt)
    return (
      taskDate.getDate() === today.getDate() &&
      taskDate.getMonth() === today.getMonth() &&
      taskDate.getFullYear() === today.getFullYear()
    )
  })

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.category && task.category.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesPriority = filterPriority === "All" || task.priority === filterPriority
    const matchesCategory = filterCategory === "All" || task.category === filterCategory
    return matchesSearch && matchesPriority && matchesCategory
  })

  // Get unique categories
  const categories = Array.from(new Set([...tasks, ...completedTasks].map((task) => task.category).filter(Boolean)))

  const getPriorityEmoji = (priority: string) => {
    switch (priority) {
      case "High":
        return "🔥"
      case "Medium":
        return "⚡"
      case "Low":
        return "🌱"
      default:
        return "📝"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "text-red-400 bg-red-500/20 border-red-400/30"
      case "Medium":
        return "text-yellow-400 bg-yellow-500/20 border-yellow-400/30"
      case "Low":
        return "text-green-400 bg-green-500/20 border-green-400/30"
      default:
        return "text-gray-400 bg-gray-500/20 border-gray-400/30"
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      Work: "bg-blue-500/20 text-blue-400 border-blue-400/30",
      Personal: "bg-purple-500/20 text-purple-400 border-purple-400/30",
      Health: "bg-green-500/20 text-green-400 border-green-400/30",
      General: "bg-gray-500/20 text-gray-400 border-gray-400/30",
    }
    return colors[category as keyof typeof colors] || "bg-gray-500/20 text-gray-400 border-gray-400/30"
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return "Yesterday"
    return date.toLocaleDateString()
  }

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
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <span style={{ imageRendering: "pixelated", fontSize: "32px" }}>📝</span>
              <h1 className="text-4xl font-bold text-white neon-text" style={{ fontFamily: "Arial, sans-serif" }}>
                Task Management
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
              Organize and track your tasks efficiently
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Add Task Section */}
            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3" style={{ fontFamily: "Arial, sans-serif" }}>
                  <span style={{ imageRendering: "pixelated", fontSize: "24px" }}>➕</span>
                  Add New Task
                  {isSubscribed && (
                    <Badge className="bg-green-500/20 text-green-400 border-green-400/30">Premium</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300" style={{ fontFamily: "Arial, sans-serif" }}>
                    Task Description
                  </label>
                  <Input
                    placeholder="Enter task description..."
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    className="w-full bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                    style={{ fontFamily: "Arial, sans-serif" }}
                    onKeyPress={(e) => e.key === "Enter" && addTask()}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300" style={{ fontFamily: "Arial, sans-serif" }}>
                      Priority
                    </label>
                    <Select
                      value={newTaskPriority}
                      onValueChange={(value: "High" | "Medium" | "Low") => setNewTaskPriority(value)}
                    >
                      <SelectTrigger className="glass-card border-white/20 text-gray-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass-card border-white/20 text-gray-300">
                        <SelectItem value="High">🔥 High</SelectItem>
                        <SelectItem value="Medium">⚡ Medium</SelectItem>
                        <SelectItem value="Low">🌱 Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300" style={{ fontFamily: "Arial, sans-serif" }}>
                      Category
                    </label>
                    <Input
                      placeholder="e.g., Work, Personal..."
                      value={newTaskCategory}
                      onChange={(e) => setNewTaskCategory(e.target.value)}
                      className="w-full bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                      style={{ fontFamily: "Arial, sans-serif" }}
                    />
                  </div>
                </div>

                <Button
                  onClick={addTask}
                  disabled={!newTask.trim() || (!isSubscribed && tasks.length + todaysCompletedTasks.length >= 3)}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transition-all duration-200 hover:scale-105 hover:shadow-lg border-0"
                  style={{ fontFamily: "Arial, sans-serif" }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Task
                </Button>

                {!isSubscribed && tasks.length + todaysCompletedTasks.length >= 3 && (
                  <div className="text-center p-4 bg-amber-800/20 rounded-lg border border-amber-600/30">
                    <p className="text-amber-300 text-sm mb-2" style={{ fontFamily: "Arial, sans-serif" }}>
                      Daily task limit reached ({tasks.length + todaysCompletedTasks.length}/3)
                    </p>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transition-all duration-200 hover:scale-105 border-0"
                      style={{ fontFamily: "Arial, sans-serif" }}
                    >
                      Upgrade to Premium
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Filters Section */}
            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3" style={{ fontFamily: "Arial, sans-serif" }}>
                  <Filter className="w-6 h-6 text-green-400" />
                  Filters & Search
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300" style={{ fontFamily: "Arial, sans-serif" }}>
                    Search Tasks
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search tasks..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                      style={{ fontFamily: "Arial, sans-serif" }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300" style={{ fontFamily: "Arial, sans-serif" }}>
                    Filter by Priority
                  </label>
                  <Select
                    value={filterPriority}
                    onValueChange={(value: "All" | "High" | "Medium" | "Low") => setFilterPriority(value)}
                  >
                    <SelectTrigger className="glass-card border-white/20 text-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-white/20 text-gray-300">
                      <SelectItem value="All">All Priorities</SelectItem>
                      <SelectItem value="High">🔥 High</SelectItem>
                      <SelectItem value="Medium">⚡ Medium</SelectItem>
                      <SelectItem value="Low">🌱 Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300" style={{ fontFamily: "Arial, sans-serif" }}>
                    Filter by Category
                  </label>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="glass-card border-white/20 text-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-white/20 text-gray-300">
                      <SelectItem value="All">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={() => {
                    setSearchTerm("")
                    setFilterPriority("All")
                    setFilterCategory("All")
                  }}
                  variant="outline"
                  className="w-full glass-card border-white/20 text-gray-300 hover:bg-white/10"
                  style={{ fontFamily: "Arial, sans-serif" }}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              </CardContent>
            </Card>

            {/* Stats Section */}
            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3" style={{ fontFamily: "Arial, sans-serif" }}>
                  <span style={{ imageRendering: "pixelated", fontSize: "24px" }}>📊</span>
                  Task Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-400/20">
                    <div
                      className="text-2xl font-bold text-blue-400 neon-text"
                      style={{ fontFamily: "Arial, sans-serif" }}
                    >
                      {tasks.length}
                    </div>
                    <div className="text-sm text-gray-400" style={{ fontFamily: "Arial, sans-serif" }}>
                      Active Tasks
                    </div>
                  </div>
                  <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-400/20">
                    <div
                      className="text-2xl font-bold text-green-400 neon-text"
                      style={{ fontFamily: "Arial, sans-serif" }}
                    >
                      {todaysCompletedTasks.length}
                    </div>
                    <div className="text-sm text-gray-400" style={{ fontFamily: "Arial, sans-serif" }}>
                      Completed Today
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-white" style={{ fontFamily: "Arial, sans-serif" }}>
                    Priority Breakdown
                  </h4>
                  {["High", "Medium", "Low"].map((priority) => {
                    const count = tasks.filter((task) => task.priority === priority).length
                    return (
                      <div key={priority} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span>{getPriorityEmoji(priority)}</span>
                          <span className="text-gray-300" style={{ fontFamily: "Arial, sans-serif" }}>
                            {priority}
                          </span>
                        </div>
                        <Badge variant="outline" className={getPriorityColor(priority)}>
                          {count}
                        </Badge>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Active Tasks */}
          <Card className="glass-card border-white/20 mt-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3" style={{ fontFamily: "Arial, sans-serif" }}>
                  <span style={{ imageRendering: "pixelated", fontSize: "24px" }}>📋</span>
                  Active Tasks
                  <Badge variant="secondary" className="bg-gray-700/50 text-gray-300 border-gray-600">
                    {filteredTasks.length} tasks
                  </Badge>
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {filteredTasks.length === 0 ? (
                <div className="text-center py-12">
                  <span style={{ imageRendering: "pixelated", fontSize: "64px" }}>📝</span>
                  <h3
                    className="text-xl font-semibold text-gray-400 mb-2 mt-4"
                    style={{ fontFamily: "Arial, sans-serif" }}
                  >
                    {searchTerm || filterPriority !== "All" || filterCategory !== "All"
                      ? "No matching tasks"
                      : "No active tasks"}
                  </h3>
                  <p className="text-gray-500" style={{ fontFamily: "Arial, sans-serif" }}>
                    {searchTerm || filterPriority !== "All" || filterCategory !== "All"
                      ? "Try adjusting your filters"
                      : "Add your first task to get started"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
                  {filteredTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-4 border border-gray-600 rounded-lg hover:shadow-md transition-all duration-200 bg-white/5"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => toggleTaskCompletion(task.id)}
                            className="w-5 h-5 text-green-400 bg-gray-700 border-gray-600 rounded focus:ring-green-500 focus:ring-2"
                          />
                          <div>
                            <h3
                              className="font-semibold text-white text-lg"
                              style={{ fontFamily: "Arial, sans-serif" }}
                            >
                              {task.text}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className={getPriorityColor(task.priority)}>
                                {getPriorityEmoji(task.priority)} {task.priority}
                              </Badge>
                              {task.category && (
                                <Badge variant="outline" className={getCategoryColor(task.category)}>
                                  {task.category}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            onClick={() => removeTask(task.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span style={{ fontFamily: "Arial, sans-serif" }}>Created {formatDate(task.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Completed Tasks */}
          {todaysCompletedTasks.length > 0 && (
            <Card className="glass-card border-white/20 mt-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3" style={{ fontFamily: "Arial, sans-serif" }}>
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    Completed Today
                    <Badge variant="secondary" className="bg-green-700/50 text-green-300 border-green-600">
                      {todaysCompletedTasks.length} tasks
                    </Badge>
                  </CardTitle>
                  <Button
                    onClick={clearAllCompletedTasks}
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-gray-300"
                    style={{ fontFamily: "Arial, sans-serif" }}
                  >
                    Clear All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
                  {todaysCompletedTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-4 bg-green-500/10 border border-green-400/20 rounded-lg hover:bg-green-500/20 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={true}
                            onChange={() => uncompleteTask(task.id)}
                            className="w-5 h-5 text-green-400 bg-gray-700 border-gray-600 rounded focus:ring-green-500 focus:ring-2"
                          />
                          <div>
                            <span
                              className="text-green-300 line-through text-lg"
                              style={{ fontFamily: "Arial, sans-serif" }}
                            >
                              {task.text}
                            </span>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-400/30">
                                {getPriorityEmoji(task.priority)} {task.priority}
                              </Badge>
                              {task.category && (
                                <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-400/30">
                                  {task.category}
                                </Badge>
                              )}
                              {task.completedAt && (
                                <span className="text-green-400 text-sm" style={{ fontFamily: "Arial, sans-serif" }}>
                                  Completed at{" "}
                                  {task.completedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={() => removeCompletedTask(task.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
