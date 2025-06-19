"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertTriangle, RefreshCw } from "lucide-react"

export function DatabaseStatus() {
  const [status, setStatus] = useState<"loading" | "connected" | "error">("loading")
  const [error, setError] = useState("")

  const testConnection = async () => {
    setStatus("loading")
    setError("")

    try {
      const response = await fetch("/api/test-db")
      const data = await response.json()

      if (data.success) {
        setStatus("connected")
      } else {
        setStatus("error")
        setError(data.message || "Connection failed")
      }
    } catch (err) {
      setStatus("error")
      setError("Network error occurred")
    }
  }

  useEffect(() => {
    testConnection()
  }, [])

  return (
    <div className="space-y-4">
      {status === "loading" && (
        <Alert className="bg-blue-500/10 border-blue-400/30">
          <RefreshCw className="h-4 w-4 animate-spin text-blue-400" />
          <AlertDescription className="text-blue-300">Testing database connection...</AlertDescription>
        </Alert>
      )}

      {status === "connected" && (
        <Alert className="bg-green-500/10 border-green-400/30">
          <CheckCircle className="h-4 w-4 text-green-400" />
          <AlertDescription className="text-green-300">
            <strong>Database Connected!</strong> Your Supabase integration is working correctly.
          </AlertDescription>
        </Alert>
      )}

      {status === "error" && (
        <Alert className="bg-red-500/10 border-red-400/30">
          <AlertTriangle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-red-300">
            <strong>Database Connection Failed:</strong> {error}
            <br />
            <Button
              variant="outline"
              size="sm"
              className="mt-2 glass-card border-white/20 text-gray-300 hover:bg-white/10"
              onClick={testConnection}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry Connection
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
