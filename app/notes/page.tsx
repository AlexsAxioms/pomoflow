"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Edit3,
  Trash2,
  FileText,
  Clock,
  Search,
  Tag,
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Code,
  Home,
  Type,
  Underline,
} from "lucide-react"

interface Note {
  id: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
  tags: string[]
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [newNoteTitle, setNewNoteTitle] = useState("")
  const [newNoteContent, setNewNoteContent] = useState("")
  const [editingNote, setEditingNote] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [newTag, setNewTag] = useState("")
  const [showSlashMenu, setShowSlashMenu] = useState(false)
  const [slashMenuPosition, setSlashMenuPosition] = useState({ x: 0, y: 0 })
  const [cursorPosition, setCursorPosition] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Initialize with sample notes
  useEffect(() => {
    const sampleNotes: Note[] = [
      {
        id: "1",
        title: "Meeting Follow-up",
        content:
          "Remember to call John about the Q4 project timeline. He mentioned some concerns about the delivery date.",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        tags: ["work", "urgent"],
      },
      {
        id: "2",
        title: "Project Ideas",
        content:
          "New app features to consider:\n- Dark mode toggle\n- Export functionality\n- Team collaboration\n- Mobile app version",
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        tags: ["ideas", "development"],
      },
      {
        id: "3",
        title: "Daily Reflection",
        content:
          "Today was productive! Completed 6 Pomodoro sessions and finished the calendar integration feature. Need to focus more on documentation tomorrow.",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        tags: ["personal", "reflection"],
      },
    ]
    setNotes(sampleNotes)
  }, [])

  const handleSaveNote = () => {
    if (!newNoteTitle.trim() || !newNoteContent.trim()) return

    const newNote: Note = {
      id: Date.now().toString(),
      title: newNoteTitle.trim(),
      content: newNoteContent.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: newTag
        ? newTag
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0)
        : [],
    }

    setNotes([newNote, ...notes])
    setNewNoteTitle("")
    setNewNoteContent("")
    setNewTag("")
  }

  const handleEditNote = (noteId: string) => {
    const note = notes.find((n) => n.id === noteId)
    if (note) {
      setNewNoteTitle(note.title)
      setNewNoteContent(note.content)
      setNewTag(note.tags.join(", "))
      setEditingNote(noteId)
    }
  }

  const handleUpdateNote = () => {
    if (!editingNote || !newNoteTitle.trim() || !newNoteContent.trim()) return

    setNotes(
      notes.map((note) =>
        note.id === editingNote
          ? {
              ...note,
              title: newNoteTitle.trim(),
              content: newNoteContent.trim(),
              updatedAt: new Date(),
              tags: newTag
                ? newTag
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter((tag) => tag.length > 0)
                : [],
            }
          : note,
      ),
    )

    setNewNoteTitle("")
    setNewNoteContent("")
    setNewTag("")
    setEditingNote(null)
  }

  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter((note) => note.id !== noteId))
  }

  const handleCancelEdit = () => {
    setNewNoteTitle("")
    setNewNoteContent("")
    setNewTag("")
    setEditingNote(null)
  }

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return "Yesterday"
    return date.toLocaleDateString()
  }

  const getTagColor = (tag: string) => {
    const colors = {
      work: "bg-blue-500/20 text-blue-300 border-blue-400/30",
      urgent: "bg-red-500/20 text-red-300 border-red-400/30",
      ideas: "bg-purple-500/20 text-purple-300 border-purple-400/30",
      development: "bg-green-500/20 text-green-300 border-green-400/30",
      personal: "bg-orange-500/20 text-orange-300 border-orange-400/30",
      reflection: "bg-indigo-500/20 text-indigo-300 border-indigo-400/30",
    }
    return colors[tag as keyof typeof colors] || "bg-gray-500/20 text-gray-300 border-gray-400/30"
  }

  // Handle slash command
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    const cursorPos = e.target.selectionStart

    setNewNoteContent(value)
    setCursorPosition(cursorPos)

    // Check for slash command
    if (value[cursorPos - 1] === "/") {
      const textarea = e.target
      const rect = textarea.getBoundingClientRect()
      const lineHeight = 24 // Approximate line height
      const lines = value.substring(0, cursorPos).split("\n")
      const currentLine = lines.length - 1
      const charPosition = lines[lines.length - 1].length

      setSlashMenuPosition({
        x: rect.left + charPosition * 8, // Approximate character width
        y: rect.top + currentLine * lineHeight + 30,
      })
      setShowSlashMenu(true)
    } else {
      setShowSlashMenu(false)
    }
  }

  // Insert formatting at cursor position
  const insertFormatting = (before: string, after = "", placeholder = "") => {
    if (!textareaRef.current) return

    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = newNoteContent.substring(start, end)
    const textToInsert = selectedText || placeholder

    // Remove the slash that triggered the menu
    const beforeSlash = newNoteContent.substring(0, cursorPosition - 1)
    const afterCursor = newNoteContent.substring(cursorPosition)

    const newContent = beforeSlash + before + textToInsert + after + afterCursor
    setNewNoteContent(newContent)
    setShowSlashMenu(false)

    // Set cursor position after the inserted text
    setTimeout(() => {
      const newCursorPos = beforeSlash.length + before.length + textToInsert.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
      textarea.focus()
    }, 0)
  }

  // Formatting functions
  const formatBold = () => insertFormatting("**", "**", "bold text")
  const formatItalic = () => insertFormatting("*", "*", "italic text")
  const formatUnderline = () => insertFormatting("<u>", "</u>", "underlined text")
  const formatCode = () => insertFormatting("`", "`", "code")
  const formatQuote = () => insertFormatting("> ", "", "quote")
  const formatBulletList = () => insertFormatting("- ", "", "list item")
  const formatNumberedList = () => insertFormatting("1. ", "", "list item")
  const formatHeading = () => insertFormatting("# ", "", "heading")

  const slashCommands = [
    { icon: Type, label: "Heading", action: formatHeading, description: "Create a heading" },
    { icon: Bold, label: "Bold", action: formatBold, description: "Make text bold" },
    { icon: Italic, label: "Italic", action: formatItalic, description: "Make text italic" },
    { icon: Underline, label: "Underline", action: formatUnderline, description: "Underline text" },
    { icon: Code, label: "Code", action: formatCode, description: "Add inline code" },
    { icon: Quote, label: "Quote", action: formatQuote, description: "Add a quote" },
    { icon: List, label: "Bullet List", action: formatBulletList, description: "Create bullet list" },
    { icon: ListOrdered, label: "Numbered List", action: formatNumberedList, description: "Create numbered list" },
  ]

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
                Quick Notes
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
              Capture your thoughts and ideas during Pomodoro sessions
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Note Input Section */}
            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3" style={{ fontFamily: "Arial, sans-serif" }}>
                  <span style={{ imageRendering: "pixelated", fontSize: "24px" }}>✍️</span>
                  {editingNote ? "Edit Note" : "New Note"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300" style={{ fontFamily: "Arial, sans-serif" }}>
                    Note Title
                  </label>
                  <Input
                    placeholder="Enter note title..."
                    value={newNoteTitle}
                    onChange={(e) => setNewNoteTitle(e.target.value)}
                    className="w-full bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                    style={{ fontFamily: "Arial, sans-serif" }}
                  />
                </div>

                <div className="space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-300" style={{ fontFamily: "Arial, sans-serif" }}>
                      Content
                    </label>
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={formatBold}
                        className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-white/10"
                        title="Bold (Ctrl+B)"
                      >
                        <Bold className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={formatItalic}
                        className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-white/10"
                        title="Italic (Ctrl+I)"
                      >
                        <Italic className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={formatCode}
                        className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-white/10"
                        title="Code"
                      >
                        <Code className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={formatBulletList}
                        className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-white/10"
                        title="Bullet List"
                      >
                        <List className="w-4 h-4" />
                      </Button>
                      <span className="text-xs text-gray-500 ml-2">Type / for commands</span>
                    </div>
                  </div>
                  <Textarea
                    ref={textareaRef}
                    placeholder="Write your note here... (Type / for formatting commands)"
                    value={newNoteContent}
                    onChange={handleContentChange}
                    className="min-h-[200px] resize-none bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                    style={{ fontFamily: "Arial, sans-serif" }}
                  />

                  {/* Slash Command Menu */}
                  {showSlashMenu && (
                    <div
                      className="absolute z-50 bg-gray-800 border border-gray-600 rounded-lg shadow-lg p-2 min-w-[200px]"
                      style={{
                        left: slashMenuPosition.x,
                        top: slashMenuPosition.y,
                      }}
                    >
                      <div className="text-xs text-gray-400 mb-2 px-2">Formatting Commands</div>
                      {slashCommands.map((command, index) => (
                        <button
                          key={index}
                          onClick={command.action}
                          className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-700 rounded text-white text-sm"
                        >
                          <command.icon className="w-4 h-4 text-gray-400" />
                          <div>
                            <div className="font-medium">{command.label}</div>
                            <div className="text-xs text-gray-400">{command.description}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300" style={{ fontFamily: "Arial, sans-serif" }}>
                    Tags (comma-separated)
                  </label>
                  <Input
                    placeholder="work, urgent, ideas..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="w-full bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                    style={{ fontFamily: "Arial, sans-serif" }}
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  {editingNote ? (
                    <>
                      <Button
                        onClick={handleUpdateNote}
                        disabled={!newNoteTitle.trim() || !newNoteContent.trim()}
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transition-all duration-200 hover:scale-105 hover:shadow-lg border-0"
                        style={{ fontFamily: "Arial, sans-serif" }}
                      >
                        <span style={{ imageRendering: "pixelated", fontSize: "16px", marginRight: "8px" }}>💾</span>
                        Update Note
                      </Button>
                      <Button
                        onClick={handleCancelEdit}
                        variant="outline"
                        className="transition-all duration-200 hover:scale-105 glass-card border-white/20 text-gray-300 hover:bg-white/10"
                        style={{ fontFamily: "Arial, sans-serif" }}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={handleSaveNote}
                      disabled={!newNoteTitle.trim() || !newNoteContent.trim()}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transition-all duration-200 hover:scale-105 hover:shadow-lg border-0"
                      style={{ fontFamily: "Arial, sans-serif" }}
                    >
                      <span style={{ imageRendering: "pixelated", fontSize: "16px", marginRight: "8px" }}>💾</span>
                      Save Note
                    </Button>
                  )}
                </div>

                <div className="text-center text-sm text-gray-500" style={{ fontFamily: "Arial, sans-serif" }}>
                  {notes.length} notes saved locally
                </div>
              </CardContent>
            </Card>

            {/* Notes Display Section */}
            <Card className="glass-card border-white/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3" style={{ fontFamily: "Arial, sans-serif" }}>
                    <FileText className="w-6 h-6 text-green-400" />
                    Saved Notes
                  </CardTitle>
                  <Badge variant="secondary" className="text-sm bg-gray-700/50 text-gray-300 border-gray-600">
                    {filteredNotes.length} notes
                  </Badge>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search notes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                    style={{ fontFamily: "Arial, sans-serif" }}
                  />
                </div>
              </CardHeader>
              <CardContent>
                {filteredNotes.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <h3
                      className="text-xl font-semibold text-gray-400 mb-2"
                      style={{ fontFamily: "Arial, sans-serif" }}
                    >
                      {searchTerm ? "No matching notes" : "No notes yet"}
                    </h3>
                    <p className="text-gray-500" style={{ fontFamily: "Arial, sans-serif" }}>
                      {searchTerm ? "Try a different search term" : "Create your first note to get started"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
                    {filteredNotes.map((note) => (
                      <div
                        key={note.id}
                        className="p-4 border border-gray-600 rounded-lg hover:shadow-md transition-all duration-200 bg-white/5"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-white text-lg" style={{ fontFamily: "Arial, sans-serif" }}>
                            {note.title}
                          </h3>
                          <div className="flex gap-1">
                            <Button
                              onClick={() => handleEditNote(note.id)}
                              variant="ghost"
                              size="sm"
                              className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                            >
                              <Edit3 className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => handleDeleteNote(note.id)}
                              variant="ghost"
                              size="sm"
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <div
                          className="text-gray-300 text-sm mb-3 whitespace-pre-wrap"
                          style={{ fontFamily: "Arial, sans-serif" }}
                          dangerouslySetInnerHTML={{
                            __html: note.content
                              .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                              .replace(/\*(.*?)\*/g, "<em>$1</em>")
                              .replace(/`(.*?)`/g, '<code class="bg-gray-700 px-1 rounded">$1</code>')
                              .replace(
                                /^> (.+)$/gm,
                                '<blockquote class="border-l-4 border-gray-500 pl-4 italic">$1</blockquote>',
                              )
                              .replace(/^- (.+)$/gm, '<li class="ml-4">• $1</li>')
                              .replace(/^\d+\. (.+)$/gm, '<li class="ml-4">$1</li>')
                              .replace(/^# (.+)$/gm, '<h3 class="text-lg font-bold text-white">$1</h3>'),
                          }}
                        />

                        {note.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {note.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className={`text-xs ${getTagColor(tag)}`}>
                                <Tag className="w-3 h-3 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span style={{ fontFamily: "Arial, sans-serif" }}>
                              Created {formatDate(note.createdAt)}
                            </span>
                          </div>
                          {note.updatedAt.getTime() !== note.createdAt.getTime() && (
                            <span style={{ fontFamily: "Arial, sans-serif" }}>
                              Updated {formatDate(note.updatedAt)}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <Card className="glass-card border-white/20 mt-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div
                    className="text-2xl font-bold text-green-400 neon-text"
                    style={{ fontFamily: "Arial, sans-serif" }}
                  >
                    {notes.length}
                  </div>
                  <div className="text-sm text-gray-400" style={{ fontFamily: "Arial, sans-serif" }}>
                    Total Notes
                  </div>
                </div>
                <div>
                  <div
                    className="text-2xl font-bold text-green-400 neon-text"
                    style={{ fontFamily: "Arial, sans-serif" }}
                  >
                    {notes.filter((note) => note.createdAt.toDateString() === new Date().toDateString()).length}
                  </div>
                  <div className="text-sm text-gray-400" style={{ fontFamily: "Arial, sans-serif" }}>
                    Notes Today
                  </div>
                </div>
                <div>
                  <div
                    className="text-2xl font-bold text-green-400 neon-text"
                    style={{ fontFamily: "Arial, sans-serif" }}
                  >
                    {Array.from(new Set(notes.flatMap((note) => note.tags))).length}
                  </div>
                  <div className="text-sm text-gray-400" style={{ fontFamily: "Arial, sans-serif" }}>
                    Unique Tags
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Click outside to close slash menu */}
      {showSlashMenu && <div className="fixed inset-0 z-40" onClick={() => setShowSlashMenu(false)} />}
    </div>
  )
}
