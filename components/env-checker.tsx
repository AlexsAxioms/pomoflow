"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertTriangle, ExternalLink, RefreshCw, Database, Settings } from "lucide-react"

interface EnvStatus {
  success: boolean
  environment: {
    supabase: {
      url: { exists: boolean; value: string | null }
      anonKey: { exists: boolean; value: string | null }
      serviceKey: { exists: boolean; value: string | null }
    }
    stripe: {
      publishableKey: { exists: boolean; value: string | null }
      secretKey: { exists: boolean; value: string | null }
    }
    other: {
      siteUrl: string
      nodeEnv: string
    }
  }
  missing: string[]
  help: string
}

export function EnvChecker() {
  const [envStatus, setEnvStatus] = useState<EnvStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const checkEnvironment = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/check-env")
      const data = await response.json()
      setEnvStatus(data)
    } catch (error) {
      console.error("Failed to check environment:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkEnvironment()
  }, [])

  if (isLoading) {
    return (
      <Card className="glass-card border-white/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin text-blue-400" />
            <span className="text-gray-300">Checking environment variables...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!envStatus) {
    return (
      <Card className="glass-card border-white/20">
        <CardContent className="p-6">
          <Alert className="bg-red-500/10 border-red-400/30">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-300">Failed to check environment variables</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass-card border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Environment Configuration
        </CardTitle>
        <CardDescription className="text-gray-300">
          Checking your project's environment variables and integrations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Status */}
        {envStatus.success ? (
          <Alert className="bg-green-500/10 border-green-400/30">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <AlertDescription className="text-green-300">
              <strong>✅ Environment Configured!</strong> All required variables are set.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="bg-red-500/10 border-red-400/30">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-300">
              <strong>❌ Missing Environment Variables</strong>
              <br />
              {envStatus.help}
            </AlertDescription>
          </Alert>
        )}

        {/* Missing Variables */}
        {envStatus.missing.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-white">Missing Variables:</h3>
            <div className="space-y-2">
              {envStatus.missing.map((variable) => (
                <div key={variable} className="flex items-center gap-2 text-red-300">
                  <AlertTriangle className="h-3 w-3" />
                  <code className="text-xs bg-red-500/20 px-2 py-1 rounded">{variable}</code>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Supabase Status */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-blue-400" />
            <h3 className="font-semibold text-white">Supabase Integration</h3>
          </div>
          <div className="ml-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Project URL</span>
              <div className="flex items-center gap-2">
                {envStatus.environment.supabase.url.exists ? (
                  <CheckCircle className="h-3 w-3 text-green-400" />
                ) : (
                  <AlertTriangle className="h-3 w-3 text-red-400" />
                )}
                <code className="text-xs text-gray-400">{envStatus.environment.supabase.url.value || "Not set"}</code>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Anonymous Key</span>
              <div className="flex items-center gap-2">
                {envStatus.environment.supabase.anonKey.exists ? (
                  <CheckCircle className="h-3 w-3 text-green-400" />
                ) : (
                  <AlertTriangle className="h-3 w-3 text-red-400" />
                )}
                <code className="text-xs text-gray-400">
                  {envStatus.environment.supabase.anonKey.value || "Not set"}
                </code>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Service Role Key</span>
              <div className="flex items-center gap-2">
                {envStatus.environment.supabase.serviceKey.exists ? (
                  <CheckCircle className="h-3 w-3 text-green-400" />
                ) : (
                  <AlertTriangle className="h-3 w-3 text-yellow-400" />
                )}
                <code className="text-xs text-gray-400">
                  {envStatus.environment.supabase.serviceKey.value || "Optional"}
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* Setup Instructions */}
        {!envStatus.success && (
          <Alert className="bg-blue-500/10 border-blue-400/30">
            <AlertDescription className="text-blue-300">
              <strong>How to fix this:</strong>
              <ol className="list-decimal list-inside mt-2 space-y-1">
                <li>Go to your v0 project settings</li>
                <li>Click on "Integrations" or "Add Integration"</li>
                <li>Add the "Supabase" integration</li>
                <li>Follow the setup wizard to connect your Supabase project</li>
                <li>Refresh this page to check again</li>
              </ol>
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={checkEnvironment}
            variant="outline"
            className="glass-card border-white/20 text-gray-300 hover:bg-white/10"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Recheck Environment
          </Button>

          {!envStatus.success && (
            <Button
              onClick={() => window.open("https://v0.dev/docs/integrations/supabase", "_blank")}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Setup Supabase Integration
            </Button>
          )}

          {envStatus.success && (
            <Button
              onClick={() => (window.location.href = "/")}
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
            >
              Go to Dashboard
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
